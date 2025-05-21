# FsboPro – Supabase + Firebase Hosting Edition 🚀

A full-stack “For Sale By Owner” prototype built with
**Next.js 15 (static export) + Tailwind CSS** on the front end,
**Express (TypeScript) running in Firebase Cloud Functions** on the back end,
using **Supabase for Authentication and Database**.

---

## Project structure

```
/
├── client/               # Next.js front-end
│   ├── src/
│   └── next.config.ts
├── functions/            # Cloud Functions (Express API) - Can be used for backend logic interacting with Supabase
│   ├── src/index.ts
│   └── tsconfig.json
├── firebase.json         # Hosting + Functions rewrite rules
├── .env.example          # copy to .env.local – never commit REAL secrets
└── README.md             # this file
```

---

## 1  Set up locally

```bash
# prerequisites: Node 18+, pnpm, Firebase CLI, Supabase project
npm  i -g firebase-tools
pnpm --version   # make sure it’s installed
firebase login   # once

git clone https://github.com/<you>/FsboPro.git
cd FsboPro

# install all workspace deps
pnpm install           # root (front-end)
cd functions
pnpm install           # Cloud Functions
cd ..

# create env file (populate your Supabase keys)
cp .env.example .env.local
```

### Start emulators + live reload

```bash
# build static front-end once
pnpm run build         # outputs client/out (exported)

# launch Hosting + Functions locally
firebase emulators:start --only hosting,functions
```

* **Front-end preview:** <http://localhost:5000>
* **API preview:**      <http://localhost:5001/api/...>

Changes you make in **client/** auto-reload thanks to the emulator file-watcher.

---

## 2  Deploy to Firebase

```bash
# build the export each time
pnpm run build

# deploy Hosting + Functions
firebase deploy --only hosting,functions
```

After a few seconds you’ll see:

```
✔ Deploy complete!
   Hosting URL: https://<project-id>.web.app
   Function URL: https://<region>-<project-id>.cloudfunctions.net/api
```

That URL is live.

---

## 3  Environment variables

Add your Supabase project URL and Anon Key to `.env.local`:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Copy `.env.example` → `.env.local`, fill them in, and **do not commit** `.env.local`.

---

## 4  Next steps

* **Supabase Configuration** - Replace the placeholder values in `.env.local` with your actual Supabase project URL and Anon Key.
* **Backend Integration** - Update backend functions in `functions/src/` to interact with your Supabase database and authentication as needed.
* **Frontend Enhancements** - Improve the UI and user experience for login and registration in `client/src/pages/LoginPage.tsx`.

Happy shipping! 🏡
