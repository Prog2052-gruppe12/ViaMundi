# ViaMundi

Semesterprosjekt 2025 - Gruppe 12

En intelligent reiseplanleggingsapplikasjon som bruker AI til å generere skreddersydde reiseplaner basert på brukerens interesser og preferanser. ViaMundi kombinerer data fra TripAdvisor API med Groq AI for å kuratere relevante aktiviteter, restauranter og attraksjoner.

## Hovedfunksjoner

- Intelligent søk med AI-basert forståelse av søkeintensjoner
- Interessebasert kuratering av aktiviteter
- Dag-for-dag planlegging med detaljerte reiseplaner
- Væroppsummering for reiseperioden
- Lagring og gjenbruk av reiseplaner
- PDF-eksport av reiseplaner
- Brukerautentisering med Firebase

## Teknologier

### Frontend
- Next.js 15.5.2 med App Router
- React 19.1.0
- Tailwind CSS 4.1.13
- shadcn/ui komponentbibliotek
- React Hook Form + Zod for form-håndtering

### Backend
- Firebase (Authentication og Firestore)
- Groq SDK for AI-funksjonalitet
- TripAdvisor Content API for reisedata

### Testing
- Jest 30.2.0
- Testing Library

## Komme i gang

### Forutsetninger

- Node.js 18+ og npm
- Firebase-prosjekt med Authentication og Firestore aktivert
- Groq API-nøkkel
- TripAdvisor Content API-nøkkel

### Installasjon

1. Klon repositoriet
   ```bash
   git clone <repository-url>
   cd viamundi
   ```

2. Installer avhengigheter
   ```bash
   npm install
   ```

3. Konfigurer miljøvariabler
   
   Opprett en `.env.local` fil i rotmappen:
   ```env
   # Firebase (Client-side)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   
   # Firebase (Server-side)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY=your_private_key
   
   # Groq AI
   GROQ_API_KEY=your_groq_api_key
   
   # TripAdvisor API
   TRIP_ADVISOR_API_KEY=your_tripadvisor_api_key
   
   # Autentisering (Valgfritt)
   AUTH_COOKIE_NAME=firebase_session
   AUTH_COOKIE_DOMAIN=
   ```

4. Start utviklingsserveren
   ```bash
   npm run dev
   ```

5. Åpne nettleseren
   
   Naviger til http://localhost:3000

## Kommandoer

```bash
# Utvikling
npm run dev          # Starter utviklingsserver
npm run build        # Bygger produksjonsversjon
npm start            # Starter produksjonsserver

# Kvalitetssikring
npm run lint         # Kjører ESLint

# Testing
npm test             # Kjører tester
npm run test:coverage # Genererer testdekning-rapport
```

## Prosjektstruktur

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Autentiseringssider
│   ├── (pages)/                 # Applikasjonssider
│   ├── api/                     # API endepunkter
│   └── page.jsx                 # Hjemmeside
├── components/                   # React-komponenter
│   ├── ui/                      # Grunnleggende UI-komponenter
│   ├── layout/                  # Layout-komponenter
│   ├── features/                # Funksjonsspesifikke komponenter
│   └── common/                  # Delte komponenter
├── hooks/                       # Custom React hooks
├── lib/                         # Biblioteker og verktøy
│   ├── auth/                    # Autentiseringslogikk
│   ├── firebase/                # Firebase konfigurasjon
│   ├── groq/                    # Groq AI konfigurasjon
│   └── ...                     # Andre biblioteker
├── utils/                       # Hjelpefunksjoner
└── assets/                      # Statiske ressurser
```

## Arkitektur

ViaMundi følger en 3-lags arkitektur:

1. Presentasjonslag - React-komponenter og UI (Next.js Pages)
2. Applikasjonslag - API-ruter og forretningslogikk
3. Tjenestelag - Firebase, Groq AI, TripAdvisor API

## Autentisering

ViaMundi bruker Firebase Authentication med session cookies:
- Email/Password innlogging
- Google OAuth
- HttpOnly session cookies (3 dagers utløpstid)
## Team

- Fredrik Andreas Wiik
- Tim Harseth
- Nahom Berhane

Semesterprosjekt 2025 - Gruppe 12
