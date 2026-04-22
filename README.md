# AdminPilot — Ausfüllhilfe Plus

Digitaler Service zum Ausfüllen staatlicher Sozialleistungsanträge für Senioren
(Grundsicherung, Wohngeld, Pflegegeld). Betrieben unter der ALEVOR
Mittelstandspartner GmbH.

**Positionierung:** Technische Ausfüllhilfe, keine Rechtsdienstleistung.
Der Kunde bleibt immer Antragsteller und reicht selbst ein.

---

## Was dieses Paket enthält

Dieses Repository ist eine **komplette Neufassung** der Website und App-Schicht
passend zur neuen Positionierung "Ausfüllhilfe Plus" (siehe
`/docs/sprachliche-leitlinien.md`).

### Dateien zum 1:1-Austausch

**Website-Seiten (`src/pages/`)**
- `HomePage.jsx` — neue Startseite ohne "Wir reichen ein"-Sprache
- `PricingPage.jsx` — neues Preismodell: Basis 49 € / Plus 78 €
- `FaqPage.jsx` — neue FAQ mit rechtssicheren Antworten
- `GrundsicherungPage.jsx`, `WohngeldPage.jsx`, `PflegegeldPage.jsx`
- `HowItWorksPage.jsx` — 6-Schritte-Flow mit klarer Abgrenzung
- `AgbPage.jsx` — **Entwurf**, muss vom Anwalt geprüft werden
- `DatenschutzPage.jsx` — **Entwurf** mit Art. 9 DSGVO

**App-Layer (`src/pages/` und `src/components/`)**
- `DashboardPage.jsx` — Übersicht der Anträge
- `NewApplicationPage.jsx` — Leistungsauswahl + Upload
- `ApplicationDetailPage.jsx` — Schätzung, Zahlung, PDF, Einreichung
- `components/ApplicationCard.jsx`, `components/UploadFlow.jsx`

**Supabase (`supabase/`)**
- `migrations/20260422_000001_initial_schema.sql` — 7 Tabellen + Enums
- `migrations/20260422_000002_rls_policies.sql` — Row Level Security
- `functions/ocr-analyze/` — Claude Vision OCR je Dokumententyp
- `functions/entitlement-calculate/` — Anspruchs-Schätzung
- `functions/create-checkout/` — Stripe Checkout Session
- `functions/stripe-webhook/` — Zahlungs-Webhook
- `functions/generate-application-pdf/` — PDF-Generator (pdf-lib)
- `functions/schedule-reminders/` — Cron-basierte Erinnerungen
- `functions/analyze-authority-letter/` — Behördenbrief-Analyse

---

## Setup

Siehe **`SETUP-KOMPAKT.md`** — eine komplette Anleitung, die alles über
Dashboards abwickelt (Supabase, Stripe, Clerk, Vercel). Terminal wird nur
zum Git-Push verwendet.

Wichtigste Dateien für Setup:
- **`supabase-setup.sql`** — komplettes DB-Schema, RLS, Storage als ein SQL
- **`SETUP-KOMPAKT.md`** — Schritt-für-Schritt-Anleitung (ohne Supabase CLI)
- **`.env.example`** — Frontend-Env-Vars Template

## Dev-Server lokal

```bash
npm install
cp .env.example .env.local   # Werte ausfüllen
npm run dev                  # http://localhost:3000
```

---

## Wichtige Hinweise

### Rechtlich
- **AGB und Datenschutz sind Entwürfe.** Müssen vor Go-Live vom Anwalt
  geprüft werden. Siehe `legal/` für spezifische Anmerkungen.
- Der gesamte Produkt-Flow ist auf "Ausfüllhilfe Plus" ausgelegt: Kunde bleibt
  Antragsteller, AdminPilot reicht nicht ein.
- Audit-Log in `status_events`-Tabelle ist zentral für Haftungsfragen — jeder
  Status-Wechsel durch den Kunden wird dokumentiert.

### Sprachliche Leitlinien (siehe `docs/sprachliche-leitlinien.md`)
1. Niemals "Wir reichen ein" — immer "Sie reichen ein"
2. Alle Beträge mit "unverbindliche Schätzung" kennzeichnen
3. Keine Formulierung, die Rechtsberatung suggeriert

### Design
- Typografie: Gill Sans (Headlines) + System-Sans (Body)
- Farben: Dark Forest #1A3C2B, Deep Grove #2D6148, Sage Gray #8AA494
- Mobile-first: Senioren nutzen primär Smartphone für Uploads

### Datenschutz
- Server in Frankfurt (Supabase EU-Central-1)
- Art. 9 DSGVO für Sozialdaten via explizite Einwilligung
- Zero Data Retention mit Anthropic vertraglich vereinbaren
- Löschkonzept: 24 Monate Inaktivität → automatische Löschung

---

## Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

Environment-Variablen in Vercel Dashboard setzen (alle `VITE_*`).

### Supabase (Backend)
Siehe Setup-Schritte oben.

---

## Architektur

```
Browser (React + Vite)
    │
    │ HTTPS + Clerk JWT
    ▼
Supabase (Frankfurt)
    ├─ Postgres (mit RLS)
    ├─ Storage (user-documents)
    └─ Edge Functions
            ├─ ocr-analyze ────────┐
            ├─ entitlement-calc    │
            ├─ create-checkout ──► Stripe
            ├─ stripe-webhook ◄──  Stripe
            ├─ generate-app-pdf    │
            ├─ schedule-reminders  │
            └─ analyze-auth-letter │
                                   ▼
                            Anthropic API
                            (Claude Vision)
```

---

## Nächste Schritte (aus Master-Checkliste)

1. **Legal prüfen lassen** — AGB, Datenschutz, DSFA
2. **Echte Antragsformulare einbinden** — aktuell generiert
   `generate-application-pdf` eine Zusammenfassung; für Produktion müssen
   die amtlichen PDF-Formulare je Bundesland als Template hinterlegt und
   ihre AcroForm-Felder befüllt werden.
3. **Behörden-Datenbank** — PLZ → zuständiges Sozialamt / Wohngeldstelle.
   Kann aus OpenData-Quellen aufgebaut werden (govdata.de).
4. **Versand-Dienstleister** für Plus-Umschlag — Empfehlung Pingen oder
   PostScan Mail.
5. **Beta-Testkunden** akquirieren (10–20 Personen) bevor öffentlicher Launch.

---

## Kontakt

ALEVOR Mittelstandspartner GmbH
Titurelstraße 10, 81925 München
info@adminpilot.de
