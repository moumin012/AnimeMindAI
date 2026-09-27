# StudentOS Mobile

A mobile-first StudentOS foundation designed for React Native / Expo clients and validated here as a responsive React web preview. The product UI deliberately has no fabricated AI, account, app-control, usage, or curriculum claims.

## Run locally

```bash
npm install
npm start
```

## What works locally

- A progressive, resumable onboarding asks for a display name, country, education level, and only the following education question that applies. It supports school, university, vocational, adult, self-learning, and other paths; optional profile preferences can be skipped.
- Onboarding, structured education profile, profile preferences, schedules, tasks, subjects, study timer, emergency stop, recall cards, study plans, goals, notifications preferences, theme, RTL, export, and deletion persist in the device's local storage.
- The study timer records only sessions the student actually starts and completes/interupts.
- Planning recommendations are deterministic and explain their inputs. They are not represented as AI output.
- Notification permission is requested only after the student presses **Allow**.
- AI uses a same-origin/explicitly configured backend endpoint (`POST /ai/tutor` by default); it never puts a provider key in the browser. Until that endpoint is configured, the tutor reports its real unavailable state.

## Cloud setup

Copy `.env.example` to `.env.local` and add public Firebase configuration to enable Firebase Authentication. Enable Email/Password, Google, Apple, and Phone providers in Firebase Console. Apple and Phone require their respective platform setup. The UI will not claim these providers work before configuration.

The API must authenticate the request server-side and own all LLM keys. See `docs/ARCHITECTURE.md` for backend contracts and platform adapters.

## Production mobile direction

`src/services/mobileControl.js` is an adapter boundary. This preview supplies its browser implementation only. A React Native / Expo application can reuse the pure domain, persistence, i18n, scheduling, and API layers while replacing this adapter with Android and iOS implementations. Restrictions and usage monitoring are marked unsupported until a native adapter confirms actual OS capability and permission state.

## Verification

```bash
npm run build
npm test -- --watchAll=false
```
