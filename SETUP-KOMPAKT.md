# AdminPilot — Setup ohne CLI

Das komplette Setup über Supabase-, Stripe-, Clerk- und Vercel-Dashboards.
Terminal wird nur am Ende verwendet, um den Code auf GitHub zu pushen.

**Dauer:** 60–90 Minuten beim ersten Mal.

---

## Übersicht

| Schritt | Wo | Was |
|---|---|---|
| 1 | Supabase Dashboard | Projekt anlegen |
| 2 | Supabase SQL Editor | `supabase-setup.sql` ausführen |
| 3 | Supabase Dashboard | 7 Edge Functions anlegen |
| 4 | Supabase Dashboard | Secrets setzen |
| 5 | Stripe Dashboard | Produkte + Webhook |
| 6 | Clerk Dashboard | App + JWT Template |
| 7 | Vercel Dashboard | Environment Variables |
| 8 | Terminal | Git-Push |

---

## 1 — Supabase-Projekt anlegen

https://supabase.com/dashboard → **New project**

- **Name:** `adminpilot`
- **Database Password:** sicheres Passwort generieren, **speichern** (Passwort-Manager)
- **Region:** Frankfurt (eu-central-1) — wichtig wegen DSGVO
- **Pricing Plan:** Free reicht für Start

2–3 Minuten warten, bis der Status auf "Healthy" springt.

### Werte notieren

Du brauchst später diese Werte — Dashboard → Settings:

| Wert | Wo zu finden |
|---|---|
| **Project URL** | Settings → API → Project URL |
| **anon public key** | Settings → API → anon public |
| **service_role key** | Settings → API → service_role (geheim!) |
| **Project Ref** | Settings → General → Reference ID |
| **JWT Secret** | Settings → API → JWT Secret (unten) |

Am einfachsten: in einem Notepad oder Passwort-Manager temporär sammeln.

---

## 2 — Datenbank-Setup per SQL

Supabase Dashboard → **SQL Editor** (im linken Menü).

1. **New query** klicken
2. Die Datei `supabase-setup.sql` aus dem Repo komplett hineinkopieren
3. Oben rechts **Run** klicken

Erwartete Ausgabe: "Success. No rows returned." — das ist das richtige Ergebnis.

### Prüfen, dass alles angelegt wurde

Neue Query im SQL Editor:

```sql
select tablename from pg_tables
where schemaname = 'public'
order by tablename;
```

Sollte 7 Zeilen zeigen:
- `application_drafts`
- `applications`
- `documents`
- `notifications`
- `payments`
- `status_events`
- `users`

### Storage-Bucket prüfen

Dashboard → **Storage** (linkes Menü). Du solltest den Bucket `user-documents` sehen. Falls nicht (weil das `insert into storage.buckets` eventuell an Berechtigungen scheitert):
- **New bucket** klicken
- Name: `user-documents`
- Public: aus
- File size limit: 10 MB
- Dann im SQL Editor den Teil 6 aus `supabase-setup.sql` erneut ausführen (nur die Storage-Policies).

---

## 3 — Edge Functions anlegen

Hier liegt die einzige Stelle, wo der Dashboard-Weg etwas umständlich ist: 7 Functions müssen einzeln angelegt werden.

Supabase Dashboard → **Edge Functions** (linkes Menü) → **Deploy a new function** → **Via editor**.

Für jede der folgenden 7 Functions:
1. **Function name** eintragen (siehe Tabelle unten)
2. Den Inhalt der entsprechenden `index.ts`-Datei aus dem Repo einfügen
3. **Deploy function** klicken

| # | Function Name | Datei im Repo |
|---|---|---|
| 1 | `ocr-analyze` | `supabase/functions/ocr-analyze/index.ts` |
| 2 | `entitlement-calculate` | `supabase/functions/entitlement-calculate/index.ts` |
| 3 | `create-checkout` | `supabase/functions/create-checkout/index.ts` |
| 4 | `generate-application-pdf` | `supabase/functions/generate-application-pdf/index.ts` |
| 5 | `analyze-authority-letter` | `supabase/functions/analyze-authority-letter/index.ts` |
| 6 | `stripe-webhook` | `supabase/functions/stripe-webhook/index.ts` |
| 7 | `schedule-reminders` | `supabase/functions/schedule-reminders/index.ts` |

### Wichtig: JWT-Verify für zwei Functions deaktivieren

Nach dem Deployen von `stripe-webhook` und `schedule-reminders`:
- Function anklicken → **Details** Tab → **Verify JWT with legacy secret** **AUS**
- Grund: diese beiden werden von externen Diensten (Stripe, Supabase Cron) ohne Clerk-JWT aufgerufen.

Die anderen 5 Functions bleiben mit JWT-Verify eingeschaltet (Standard).

---

## 4 — Edge-Function-Secrets setzen

Supabase Dashboard → **Edge Functions** → **Secrets** (Tab oben).

Folgende Secrets eintragen — jeweils **Add new secret**:

| Key | Wert | Woher |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | https://console.anthropic.com/settings/keys |
| `STRIPE_SECRET_KEY` | `sk_test_...` oder `sk_live_...` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Kommt in Schritt 5 |
| `APP_URL` | `https://adminpilot.de` | Deine Produktion-Domain |

`STRIPE_WEBHOOK_SECRET` zunächst leer lassen, nach Schritt 5 nachtragen.

Die Supabase-eigenen Secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) sind standardmäßig schon gesetzt und müssen nicht manuell ergänzt werden.

---

## 5 — Stripe einrichten

https://dashboard.stripe.com

### Produkte anlegen
**Products** → **Add Product**:

| Name | Preis | Billing |
|---|---|---|
| AdminPilot Basis | 49,00 EUR | One-time |
| AdminPilot Plus | 78,00 EUR | One-time |

### Webhook anlegen
**Developers → Webhooks → Add endpoint**

- **Endpoint URL:** `https://<REF>.supabase.co/functions/v1/stripe-webhook`
  (`<REF>` ist deine Supabase Project Ref)
- **Events:** diese drei auswählen:
  - `checkout.session.completed`
  - `payment_intent.payment_failed`
  - `charge.refunded`

Nach dem Anlegen: **Webhook anklicken → Signing secret → Reveal → kopieren**.

Zurück zu Supabase Dashboard → Edge Functions → Secrets → `STRIPE_WEBHOOK_SECRET` mit dem `whsec_...`-Wert ausfüllen.

---

## 6 — Clerk einrichten

https://dashboard.clerk.com → **Create application**

### Basis-Konfiguration
- **Name:** `AdminPilot`
- **Sign-in options:** Email + Password (senior-freundlich)
- **Locale:** German (de-DE)

### JWT Template für Supabase

**Configure → JWT Templates → New template**

- **Name:** `supabase` (exakt so — der Frontend-Code erwartet diesen Namen)
- **Signing algorithm:** HS256
- **Signing key:** Wert des **JWT Secrets** aus Supabase (Settings → API → JWT Secret)
- **Claims** (in JSON):
  ```json
  {
    "aud": "authenticated",
    "sub": "{{user.id}}"
  }
  ```

### Wert notieren
**API Keys → Publishable key** kopieren (`pk_test_...` oder `pk_live_...`).

---

## 7 — Vercel Environment Variables

Dein Vercel-Projekt `admin-pilot-rosy` existiert schon. Nur die Env-Vars ändern.

Vercel Dashboard → Projekt → **Settings → Environment Variables**

Für **Production, Preview und Development** jeweils setzen:

| Name | Wert |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `VITE_SUPABASE_URL` | `https://<REF>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `VITE_SUPABASE_FUNCTIONS_URL` | `https://<REF>.supabase.co/functions/v1` |

**Nach dem Speichern wichtig:** Deployments → neueste Deployment → **Redeploy**, damit die neuen Env-Vars greifen.

---

## 8 — Code pushen (Terminal)

Hier ist das Einzige, was im Terminal läuft:

```bash
# Annahme: dein AdminPilot-Repo liegt bei ~/dev/AdminPilot
cd ~/dev/AdminPilot

# Neuen Branch anlegen
git checkout main
git pull
git checkout -b feat/ausfuellhilfe-plus

# Dateien aus dem entpackten ZIP rüberkopieren
# (ersetze ~/Downloads/adminpilot-code durch deinen Pfad)
rsync -av --exclude='.git' --exclude='node_modules' \
  ~/Downloads/adminpilot-code/ ./

# Status prüfen — du solltest viele geänderte/neue Dateien sehen
git status

# Alles committen
git add -A
git commit -m "feat: Ausfüllhilfe Plus - neue Positionierung, App-Layer, Supabase-Schema"

# Pushen
git push -u origin feat/ausfuellhilfe-plus
```

Danach auf GitHub: Pull Request öffnen, von Linda oder Julius prüfen lassen, mergen auf `main`. Vercel baut automatisch.

---

## 9 — Smoke Test nach Deploy

Sobald Vercel gebaut und Env-Vars gesetzt sind:

1. **https://adminpilot.de öffnen**
   - Startseite lädt
   - Neue Sprache "Sie reichen ein" sichtbar
   - Preismodell zeigt 49 € und 78 €

2. **Registrierung testen**
   - `/registrieren` → Account anlegen, Email bestätigen
   - Weiterleitung zu `/app`

3. **Antrag anlegen**
   - "Neuen Antrag starten" → Grundsicherung
   - Test-Rentenbescheid hochladen
   - OCR-Analyse: 10–30 Sekunden
   - Schätzung wird angezeigt

4. **Test-Zahlung** (Stripe Testmodus)
   - Basis 49 € → Checkout öffnet
   - Testkarte: `4242 4242 4242 4242`, beliebiges Ablaufdatum/CVC
   - Redirect zurück, Status auf "paid"

5. **PDF generieren**
   - "Antragsunterlagen erzeugen" klicken
   - PDF sollte herunterladbar sein

Wenn alle 5 Punkte grün: Launch-Readiness erreicht.

---

## 10 — Cron Job aktivieren (später)

Erst sinnvoll, wenn Plus-Kunden echte eingereichte Anträge haben. Kann auch Wochen nach Launch aktiviert werden.

### Extensions aktivieren
Supabase Dashboard → **Database → Extensions**

- `pg_cron` → enable
- `pg_net` → enable

### Cron Job setzen
SQL Editor → New query:

```sql
select cron.schedule(
  'reminders-hourly',
  '0 * * * *',
  $$ select net.http_post(
       url := 'https://<REF>.supabase.co/functions/v1/schedule-reminders',
       headers := jsonb_build_object(
         'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
         'Content-Type', 'application/json'
       ),
       body := '{}'::jsonb
     );
  $$
);
```

Die zwei Platzhalter `<REF>` und `<SERVICE_ROLE_KEY>` vor dem Ausführen ersetzen.

Zum Prüfen: `select * from cron.job;`

---

## Troubleshooting

**SQL-Script schlägt bei Storage-Bucket fehl**
→ Bucket manuell im Dashboard anlegen (Storage → New bucket → `user-documents`, Public=aus).
Dann den Storage-Policy-Teil (Teil 6) aus `supabase-setup.sql` erneut ausführen.

**Edge Function gibt 500 zurück**
Dashboard → Edge Functions → Function anklicken → **Logs** Tab. Dort steht die genaue Fehlermeldung.

**OCR-Function funktioniert nicht**
→ Prüfe, ob `ANTHROPIC_API_KEY` in Secrets gesetzt ist.
→ Prüfe, dass der Bucket existiert und Storage-Policies gesetzt sind.

**Stripe-Webhook: "No signature matches"**
→ `STRIPE_WEBHOOK_SECRET` ist falsch. In Stripe Dashboard neu kopieren, in Supabase Secrets aktualisieren, Function neu deployen.

**Clerk-JWT wird von Supabase nicht akzeptiert**
→ Im Clerk JWT Template muss der **Signing Key** das JWT Secret aus Supabase sein (nicht ein Clerk-Key). Algorithmus: HS256.
→ Template-Name muss **genau** `supabase` heißen.

**Vercel zeigt alte Version**
→ Nach jedem Env-Var-Update: Deployments → neueste → **Redeploy**.

**Frontend zeigt leere Seite**
→ Browser-Konsole öffnen. Meistens fehlt eine Env-Var oder der Clerk-Key ist falsch.

---

## Zusammengefasst: Deine Reihenfolge

1. Supabase-Projekt anlegen → URL + Keys notieren
2. `supabase-setup.sql` im SQL Editor ausführen
3. Edge Functions im Dashboard anlegen (7× Copy-Paste)
4. Secrets setzen
5. Stripe: Produkte + Webhook
6. Clerk: App + JWT Template
7. Vercel: Env-Vars + Redeploy
8. Terminal: `git push` auf neuen Branch
9. GitHub: Pull Request, mergen
10. Smoke Test durchlaufen
