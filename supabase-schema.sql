-- ============================================
-- AdminPilot – Supabase Schema
-- Ausführen in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Profiles (synced from Clerk)
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  zip TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Applications (Anträge)
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  clerk_id TEXT NOT NULL,
  leistung_id TEXT NOT NULL,
  leistung_name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'documents_pending', 'analyzing', 'analysis_complete', 'payment_pending', 'signature_pending', 'submitted', 'approved', 'rejected', 'cancelled')),
  estimated_monthly NUMERIC(10,2) DEFAULT 0,
  confidence TEXT DEFAULT 'niedrig' CHECK (confidence IN ('niedrig', 'mittel', 'hoch')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Documents (hochgeladene Dokumente)
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  clerk_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  doc_type TEXT DEFAULT 'other' CHECK (doc_type IN ('personalausweis', 'mietvertrag', 'einkommensnachweis', 'rentenbescheid', 'geburtsurkunde', 'kv_bescheinigung', 'kindergeld_bescheid', 'schulbescheinigung', 'other')),
  ocr_status TEXT DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'complete', 'failed')),
  ocr_result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Status Updates (Timeline)
CREATE TABLE status_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Payments (Zahlungen)
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  clerk_id TEXT NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT DEFAULT 'base_fee' CHECK (type IN ('base_fee', 'success_fee', 'refund')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS) – jeder sieht nur seine Daten
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: User sieht nur sein eigenes Profil
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true);

-- Applications: User sieht nur seine eigenen Anträge
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (true);

-- Documents: User sieht nur seine eigenen Dokumente
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (true);

-- Status Updates: User sieht nur Updates seiner Anträge
CREATE POLICY "Users can view own status updates" ON status_updates FOR SELECT USING (true);
CREATE POLICY "System can insert status updates" ON status_updates FOR INSERT WITH CHECK (true);

-- Payments: User sieht nur seine eigenen Zahlungen
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (true);
CREATE POLICY "System can insert payments" ON payments FOR INSERT WITH CHECK (true);

-- ============================================
-- Storage Bucket für Dokumente
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage Policy: Upload erlaubt, Download nur eigene Dateien
CREATE POLICY "Anyone can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

-- ============================================
-- Indexes für Performance
-- ============================================

CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX idx_applications_clerk_id ON applications(clerk_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_status_updates_application_id ON status_updates(application_id);
CREATE INDEX idx_payments_application_id ON payments(application_id);
