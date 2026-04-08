# AdminPilot 🧭

**Ihr Begleiter durch die Bürokratie**

Digitaler Antragsservice für staatliche Leistungen – automatisiert und einfach.

## Quickstart

```bash
npm install
npm run dev
```

## Tech Stack

React + Vite · Clerk Auth · Supabase (Frankfurt) · Stripe · Resend · Vercel

## Projektstruktur

```
src/
├── App.jsx               # Router (pathname-basiert)
├── styles/design-system.css  # Design Tokens
├── components/layout/    # Header, Footer, 3 Layouts
├── components/shared/    # Button, Card, TrustBar, Logo
├── pages/public/         # 14 öffentliche Seiten
├── pages/legal/          # 6 rechtliche Seiten
├── pages/app/            # 11 App-Seiten
├── pages/system/         # 4 System-Routen
├── data/leistungen.js    # 9 MVP-Leistungen
└── utils/router.js       # SPA Router
```

## MVP: 9 Leistungen

**Senioren:** Wohngeld · KV-Zuschuss · Kindererziehungszeiten · EM-Rentenzuschlag
**Familien:** Wohngeld · Kindergeld · Kinderzuschlag · Basiselterngeld · BuT

## Brand: `#1A3C2B` (dark) · `#8AA494` (sage) · `#D4A847` (gold) · `#F8FAF9` (bg)
