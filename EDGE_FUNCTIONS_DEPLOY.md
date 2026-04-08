# AdminPilot – Edge Functions Deployment

## Voraussetzungen
1. Supabase CLI installieren: `npm install -g supabase`
2. Anthropic API Key (von console.anthropic.com)

## Schritt 1: Supabase CLI einrichten

```bash
cd C:\Users\JuliusRichter-Bergho\Documents\GitHub\AdminPilot
supabase login
supabase link --project-ref bknvubqmhmstpoduhvlf
```

## Schritt 2: Secrets setzen

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-DEIN_KEY_HIER
```

## Schritt 3: Edge Functions deployen

```bash
supabase functions deploy ocr-analyze
supabase functions deploy calculate-benefits
```

## Schritt 4: Testen

Upload ein Dokument im App-Bereich → es sollte automatisch analysiert werden.

## Troubleshooting

- Logs anschauen: `supabase functions logs ocr-analyze`
- Function lokal testen: `supabase functions serve ocr-analyze`
