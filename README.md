# ViaMundi

Semesterprosjekt 2025 - Gruppe 12

En reiseplanleggingsapplikasjon bygget med Next.js, Firebase og moderne webteknologier.

## 📁 Prosjektstruktur

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Autentiseringssider
│   │   ├── login/               # Innloggingsside
│   │   └── signup/              # Registreringsside
│   ├── (pages)/                 # Applikasjonssider
│   │   ├── bruker/              # Brukerprofilside
│   │   ├── interesse/           # Interesseside
│   │   ├── om-oss/              # Om oss side
│   │   ├── onboarding/          # Onboarding side
│   │   └── resultat/            # Resultatside
│   ├── api/                     # API endepunkter
│   │   ├── attractions/         # Attraksjoner API
│   │   ├── auth/session/        # Autentisering API
│   │   ├── location/            # Lokasjon API (detaljer & bilder)
│   │   ├── restaurants/         # Restauranter API
│   │   ├── status/              # Status API
│   │   ├── user/profile/        # Brukerprofil API
│   │   └── weather/             # Vær API
│   ├── page.jsx                 # Hjemmeside
│   ├── layout.jsx               # Root layout
│   ├── error.jsx                # Error boundary
│   ├── not-found.jsx            # 404 side
│   └── globals.css              # Globale stiler
├── components/                   # Gjenbrukbare komponenter
│   ├── ui/                      # Grunnleggende UI komponenter (shadcn/ui)
│   ├── layout/                  # Layout komponenter (Header, Footer, Nav)
│   ├── features/                # Funksjonsspesifikke komponenter
│   │   ├── landing/             # Landingsside komponenter
│   │   ├── about/               # Om oss side komponenter
│   │   ├── auth/                # Autentiseringskomponenter
│   │   └── searchParameters/    # Søkeparameter komponenter
│   └── common/                  # Delte komponenter
├── lib/                         # Verktøy og konfigurasjoner
│   ├── auth/                    # Autentiseringslogikk
│   ├── firebase/                # Firebase konfigurasjon
│   └── groq/                    # Groq AI konfigurasjon
├── utils/                       # Hjelpefunksjoner
│   ├── cityIsValid.js           # Byvalidering
│   ├── cn.js                    # Klassenavn utilities
│   └── decodeCityToCoord.js     # By til koordinater
├── hooks/                       # Custom React hooks
│   └── use-mobile.js            # Mobile detection hook
└── assets/                      # Statiske ressurser
    ├── cities.json              # Byer data
    └── navLinks.json            # Navigasjonslenker
```

## 👥 Team

- Fredrik Andreas Wiik
- Tim Harseth
- Nahom Berhane

