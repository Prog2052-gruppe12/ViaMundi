# ViaMundi

Semesterprosjekt 2025 - Gruppe 12

En reiseplanleggingsapplikasjon bygget med Next.js, Firebase og moderne webteknologier.

## 🚀 Kom i gang

```bash
# Installer avhengigheter
npm install

# Kjør utviklingsserver
npm run dev

# Bygg for produksjon
npm run build
```

## 📁 Prosjektstruktur

```
src/
├── app/                          # Next.js App Router
│   ├── api/v1/status/           # API endepunkter
│   ├── om-oss/page.js           # Om oss side
│   ├── page.js                  # Hjemmeside
│   ├── layout.js                # Root layout
│   └── globals.css              # Globale stiler
├── components/                   # Gjenbrukbare komponenter
│   ├── ui/                      # Grunnleggende UI komponenter (shadcn/ui)
│   ├── layout/                  # Layout komponenter (Header, Footer, Nav)
│   ├── features/                # Funksjonsspesifikke komponenter
│   │   ├── landing/             # Landingsside komponenter
│   │   └── about/               # Om oss side komponenter
│   └── common/                  # Delte komponenter
├── lib/                         # Verktøy og konfigurasjoner
│   ├── firebase/                # Firebase konfigurasjon
│   └── utils.js                 # Hjelpefunksjoner
└── assets/                      # Statiske ressurser
    └── cities.json              # Byer data
```

## 🛠️ Teknologistack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Komponenter**: shadcn/ui + Radix UI
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Språk**: JavaScript

## 📝 Utvikling

- **Komponenter**: Organisert etter funksjoner for bedre vedlikehold
- **API Ruter**: Versjonert under `/api/v1/`
- **Styling**: Utility-first med Tailwind CSS
- **State Management**: React hooks og context

## 🌐 API Endepunkter

- `GET /api/v1/status` - Applikasjonsstatus sjekk

## 👥 Team

- Fredrik Andreas Wiik
- Tim Harseth
- Nahom Berhane

