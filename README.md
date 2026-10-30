# ServiceHub Next.js (identity module)

This is the active frontend for the ServiceHub identity module (authentication,
customer profile, saved addresses, account settings, provider onboarding). The
Flutter app in `../flutter` stays as the visual and business-rule reference.

## Features

- Welcome, customer register, provider register (UI-only), sign-in, password
  recovery screens.
- Session cookies (httpOnly) via a BFF. The browser never talks to Spring and
  never sees tokens.
- Profile view/edit, photo and phone placeholders, address CRUD.
- Offline banner, cached profile/addresses, installable PWA.
- Provider onboarding draft in Context + sessionStorage.
- Optional AI business description (`useCompletion` + `/api/ai/business-description`).

## Architecture (BFF + cookies)

Browser → Next.js Server Actions / `app/api/*` → Spring Boot (`API_BASE_URL`).

On login, the access token (and refresh token if present) is stored in
`sh_access` / `sh_refresh` cookies: httpOnly, secure in production, sameSite=lax.
`middleware.ts` sends unauthenticated visitors of `/profile`, `/logout` and
`/provider/home` to `/sign-in`. Session restore happens on load through `GET /api/me`.

Token parsing lives in `src/lib/parse-login.ts` (TODO: confirm the exact Spring
shape). Spring currently returns `{ token, tokenType, user }`.

### Address extras (client-only)

Spring stores `label`, `addressLine`, `city`, `postalCode` (country is also sent
because the backend DTO requires it). Street+unit are sent as `addressLine` and
ZIP as `postalCode`. State, access note, unit split and the **default address**
flag are kept in `localStorage` key `servicehub.addressExtras`, keyed by address
id.

## Environment

Copy `.env.example` to `.env.local`. Do not put API keys in the client bundle.

```
API_BASE_URL=http://localhost:8080/api/v1
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_KEY=
OPENAI_API_KEY=
```

## Run

```powershell
cd nextjs
npm install
npm run dev
```

Open http://localhost:3000

Release:

```powershell
cd nextjs
npx next build
npx next start
```

(`npm run build` uses Turbopack; `npx next build` is the webpack production
build if you need a classic output.)

## Tests

```powershell
cd nextjs
npm test
npx tsc --noEmit
npm run lint
```

## PWA checks (Chrome DevTools)

1. Production build + `npx next start` (the service worker registers only in
   production).
2. Application → Manifest: name ServiceHub, standalone, theme `#FF8811`.
3. Application → Service Workers: `sw.js` activated.
4. Application → Cache Storage: `servicehub-next-v1`.
5. Network → Offline: open `/profile` after a visit; the OfflineBanner and
   “saved data” copy should appear.
6. Use **Install app** on the welcome screen (`beforeinstallprompt`).

## Backend contract assumptions

- `POST /auth/register` `{fullName,email,password}` always creates CUSTOMER.
- `POST /auth/login` returns a token in a flexible JSON shape.
- `POST /auth/refresh` and `/auth/logout` are optional.
- `GET/PATCH /users/me`, address CRUD as in `identity.md`.
- Phone verification, photo upload, forgot/reset password and OTP have **no**
  backend endpoints: the UI validates and shows an explicit “not connected”
  message. Provider onboarding is UI-only (TODOs in the screens).

Known limitations: Spring `UserController` in this repo currently exposes
`GET /users/me` only; address and PATCH endpoints must exist on the running
API for live CRUD. No offline write queue (optional). Provider home is
session-protected.

## 5-minute demo

1. Register a customer (try empty fields → “Check a few details”).
2. Sign in; reload — session cookie restores `/profile`.
3. Edit personal information; see the success banner.
4. Add an address, try a duplicate (same street/city/ZIP), delete with confirm.
5. DevTools → Offline: banner + cached profile/addresses; Save is refused.
6. Install the PWA from the welcome screen (production).
7. Provider onboarding → Business details → Generate with AI (needs API key).
8. Log out (cookies and local caches cleared).
