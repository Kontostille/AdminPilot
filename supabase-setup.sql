-- ============================================================================
-- AdminPilot - Komplettes Supabase Setup
-- ============================================================================
--
-- ANLEITUNG:
--   1. Supabase Dashboard öffnen (https://supabase.com/dashboard)
--   2. Dein AdminPilot-Projekt auswählen
--   3. Im Menü links: "SQL Editor"
--   4. "New query" klicken
--   5. Diese komplette Datei hineinkopieren (alles markieren, einfügen)
--   6. Oben rechts "Run" klicken
--
--   Das Skript ist idempotent - du kannst es mehrfach ausführen, ohne dass
--   etwas kaputtgeht.
--
-- INHALT:
--   Teil 1: Extensions
--   Teil 2: Enums (7 benutzerdefinierte Typen)
--   Teil 3: Tabellen (7 Stück)
--   Teil 4: Trigger und Helper-Funktionen
--   Teil 5: Row Level Security
--   Teil 6: Storage Bucket + Policies
--   Teil 7: Cron Job (am Ende - siehe Hinweis)
--
-- HINWEIS ZU PART 7 (Cron):
--   Der Cron-Job ganz unten ist auskommentiert. Bevor du ihn aktivierst,
--   musst du zwei Platzhalter ersetzen. Details stehen dort.
--
-- ============================================================================


-- ============================================================================
-- TEIL 1: EXTENSIONS
-- ============================================================================

create extension if not exists pgcrypto;


-- ============================================================================
-- TEIL 2: ENUMS
-- ============================================================================

do $$ begin
  create type benefit_type as enum (
    'grundsicherung', 'wohngeld', 'pflegegeld'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type document_category as enum (
    'rentenbescheid', 'mietvertrag', 'kontoauszug',
    'einkommensnachweis', 'pflegegutachten', 'versicherungskarte',
    'sonstiges'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type application_status as enum (
    'draft', 'analyzing', 'analyzed', 'paid', 'filling',
    'ready_to_submit', 'submitted', 'processing',
    'approved', 'rejected', 'refunded'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type package_type as enum ('basis', 'plus');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type submission_method as enum (
    'self_mail', 'self_in_person', 'self_digital',
    'plus_envelope', 'other'
  );
exception when duplicate_object then null;
end $$;


-- ============================================================================
-- TEIL 3: TABELLEN
-- ============================================================================

-- ---- users (synced from Clerk) --------------------------------------------

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  full_name text,
  birth_date date,
  address_street text,
  address_zip text,
  address_city text,
  phone text,
  marketing_consent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_users_clerk on public.users(clerk_user_id);
create index if not exists idx_users_email on public.users(email);


-- ---- documents -------------------------------------------------------------

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  application_id uuid,
  category document_category not null,
  storage_path text not null,
  original_filename text,
  file_size_bytes integer,
  mime_type text,
  ocr_status text default 'pending',
  ocr_text text,
  extracted_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_documents_user on public.documents(user_id);
create index if not exists idx_documents_application on public.documents(application_id);


-- ---- applications ---------------------------------------------------------

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  benefit_type benefit_type not null,
  status application_status not null default 'draft',
  package_type package_type,
  estimated_amount_monthly numeric(10,2),
  estimate_calculation jsonb,
  authority_name text,
  authority_address text,
  authority_contact jsonb,
  final_pdf_path text,
  submission_method submission_method,
  submission_date date,
  decision_date date,
  decision_result text,
  decision_amount numeric(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_applications_user on public.applications(user_id);
create index if not exists idx_applications_status on public.applications(status);

-- FK von documents zu applications nachtragen (da applications später angelegt wird)
do $$ begin
  alter table public.documents
    add constraint fk_documents_application
    foreign key (application_id)
    references public.applications(id) on delete set null;
exception when duplicate_object then null;
end $$;


-- ---- application_drafts (Autosave) ----------------------------------------

create table if not exists public.application_drafts (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique
    references public.applications(id) on delete cascade,
  form_data jsonb not null default '{}'::jsonb,
  current_step integer default 1,
  total_steps integer default 10,
  last_saved_at timestamptz default now()
);

create index if not exists idx_drafts_application on public.application_drafts(application_id);


-- ---- payments -------------------------------------------------------------

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  application_id uuid references public.applications(id) on delete set null,
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  package_type package_type not null,
  amount_cents integer not null,
  currency text not null default 'EUR',
  status text not null default 'pending',
  invoice_number text unique,
  invoice_pdf_path text,
  refund_reason text,
  refunded_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_application on public.payments(application_id);
create index if not exists idx_payments_stripe on public.payments(stripe_session_id);


-- ---- status_events (Audit Log - wichtig für Haftungsfragen!) --------------

create table if not exists public.status_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  application_id uuid references public.applications(id) on delete set null,
  event_type text not null,
  from_status application_status,
  to_status application_status,
  actor text not null default 'user',
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_events_application on public.status_events(application_id);
create index if not exists idx_events_user on public.status_events(user_id);
create index if not exists idx_events_type on public.status_events(event_type);


-- ---- notifications --------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  channel text not null default 'email',
  template_id text not null,
  subject text,
  recipient text,
  sent_at timestamptz,
  delivery_status text,
  resend_message_id text,
  scheduled_for timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_scheduled
  on public.notifications(scheduled_for) where sent_at is null;


-- ============================================================================
-- TEIL 4: TRIGGER UND HELPER-FUNKTIONEN
-- ============================================================================

-- ---- Updated-at Trigger ---------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_touch on public.users;
create trigger users_touch before update on public.users
  for each row execute function public.touch_updated_at();

drop trigger if exists documents_touch on public.documents;
create trigger documents_touch before update on public.documents
  for each row execute function public.touch_updated_at();

drop trigger if exists applications_touch on public.applications;
create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();


-- ---- Helper: current_user_id() aus Clerk JWT extrahieren ------------------

create or replace function public.current_user_id()
returns uuid language sql stable as $$
  select id from public.users
  where clerk_user_id = (auth.jwt() ->> 'sub')
  limit 1
$$;


-- ============================================================================
-- TEIL 5: ROW LEVEL SECURITY
-- ============================================================================

-- RLS auf allen Tabellen aktivieren
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.applications enable row level security;
alter table public.application_drafts enable row level security;
alter table public.payments enable row level security;
alter table public.status_events enable row level security;
alter table public.notifications enable row level security;


-- ---- users: nur eigene Zeile sehen ----------------------------------------

drop policy if exists "users_select_self" on public.users;
create policy "users_select_self"
  on public.users for select
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self"
  on public.users for update
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self"
  on public.users for insert
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));


-- ---- documents ------------------------------------------------------------

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own"
  on public.documents for select
  using (user_id = public.current_user_id());

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
  on public.documents for insert
  with check (user_id = public.current_user_id());

drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own"
  on public.documents for update
  using (user_id = public.current_user_id());

drop policy if exists "documents_delete_own" on public.documents;
create policy "documents_delete_own"
  on public.documents for delete
  using (user_id = public.current_user_id());


-- ---- applications ---------------------------------------------------------

drop policy if exists "applications_select_own" on public.applications;
create policy "applications_select_own"
  on public.applications for select
  using (user_id = public.current_user_id());

drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own"
  on public.applications for insert
  with check (user_id = public.current_user_id());

drop policy if exists "applications_update_own" on public.applications;
create policy "applications_update_own"
  on public.applications for update
  using (user_id = public.current_user_id());


-- ---- application_drafts ---------------------------------------------------

drop policy if exists "drafts_select_own" on public.application_drafts;
create policy "drafts_select_own"
  on public.application_drafts for select
  using (
    application_id in (
      select id from public.applications where user_id = public.current_user_id()
    )
  );

drop policy if exists "drafts_insert_own" on public.application_drafts;
create policy "drafts_insert_own"
  on public.application_drafts for insert
  with check (
    application_id in (
      select id from public.applications where user_id = public.current_user_id()
    )
  );

drop policy if exists "drafts_update_own" on public.application_drafts;
create policy "drafts_update_own"
  on public.application_drafts for update
  using (
    application_id in (
      select id from public.applications where user_id = public.current_user_id()
    )
  );


-- ---- payments: read-only für Client ---------------------------------------

drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own"
  on public.payments for select
  using (user_id = public.current_user_id());

-- INSERT/UPDATE nur über Stripe-Webhook (service role) - keine Policy nötig


-- ---- status_events: read-only für Client ----------------------------------

drop policy if exists "events_select_own" on public.status_events;
create policy "events_select_own"
  on public.status_events for select
  using (user_id = public.current_user_id());

-- INSERT nur über Edge Functions (service role) - Audit-Integrität!


-- ---- notifications: read-only für Client ----------------------------------

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = public.current_user_id());


-- ============================================================================
-- TEIL 6: STORAGE BUCKET + POLICIES
-- ============================================================================

-- ---- Bucket anlegen -------------------------------------------------------
-- Falls dieser Teil fehlschlägt (Berechtigungsfehler):
-- Storage → New Bucket im Dashboard, Name "user-documents", Public aus,
-- File Size Limit 10 MB.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-documents',
  'user-documents',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ---- Storage Policies: Nutzer sieht nur seine eigenen Dateien -------------
-- Pfad-Konvention im Bucket: <user_id>/<application_id>/<filename>

drop policy if exists "storage_own_files_select" on storage.objects;
create policy "storage_own_files_select"
  on storage.objects for select
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = public.current_user_id()::text
  );

drop policy if exists "storage_own_files_insert" on storage.objects;
create policy "storage_own_files_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = public.current_user_id()::text
  );

drop policy if exists "storage_own_files_update" on storage.objects;
create policy "storage_own_files_update"
  on storage.objects for update
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = public.current_user_id()::text
  );

drop policy if exists "storage_own_files_delete" on storage.objects;
create policy "storage_own_files_delete"
  on storage.objects for delete
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = public.current_user_id()::text
  );


-- ============================================================================
-- TEIL 7: CRON JOB (optional, nach Edge-Functions-Deployment aktivieren)
-- ============================================================================
--
-- DIESER TEIL IST AUSKOMMENTIERT.
--
-- Der Cron-Job triggert die Edge Function schedule-reminders zur vollen
-- Stunde, um Plus-Kunden an fällige Status-Erinnerungen zu erinnern.
-- Er funktioniert NUR, wenn:
--
--   1. Die Extensions pg_cron und pg_net aktiviert sind
--      (Dashboard → Database → Extensions → pg_cron + pg_net aktivieren)
--
--   2. Die Edge Function schedule-reminders bereits deployed ist
--
-- WIE DU DEN CRON-JOB AKTIVIERST:
--   a) Die beiden Extensions im Dashboard aktivieren (siehe oben)
--   b) Die zwei Platzhalter unten ersetzen:
--      - DEIN_PROJECT_REF    → deine Supabase Project Ref (z. B. abcdefgh)
--      - DEIN_SERVICE_KEY    → Service Role Key (Settings → API → service_role)
--   c) Die /* */ Kommentare um den Block entfernen
--   d) SQL Editor erneut ausführen
--
-- ============================================================================

/*
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'reminders-hourly',
  '0 * * * *',
  $cron$
    select net.http_post(
      url := 'https://DEIN_PROJECT_REF.supabase.co/functions/v1/schedule-reminders',
      headers := jsonb_build_object(
        'Authorization', 'Bearer DEIN_SERVICE_KEY',
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $cron$
);
*/


-- ============================================================================
-- FERTIG - Setup abgeschlossen.
-- ============================================================================
--
-- NÄCHSTE SCHRITTE (außerhalb dieser SQL-Datei):
--   1. Edge Functions deployen (siehe SETUP-KOMPAKT.md)
--   2. Edge Function Secrets setzen
--   3. Stripe-Produkte + Webhook anlegen
--   4. Clerk JWT Template anlegen
--   5. Vercel Environment Variables setzen
--
-- Zum Prüfen, ob alles angelegt wurde:
--   select tablename from pg_tables where schemaname = 'public'
--     order by tablename;
--   -- Sollte zeigen: applications, application_drafts, documents,
--   --                notifications, payments, status_events, users
-- ============================================================================
