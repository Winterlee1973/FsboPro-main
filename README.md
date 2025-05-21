# FsboPro – Firebase-Native Edition 🚀

A full-stack “For Sale By Owner” prototype built with  
**Next.js 15 (static export) + Tailwind CSS** on the front end,  
**Express (TypeScript) running in Firebase Cloud Functions** on the back end.

---

## Project structure

```
/
├── client/               # Next.js front-end
│   ├── src/
│   └── next.config.ts
├── functions/            # Cloud Functions (Express API)
│   ├── src/index.ts
│   └── tsconfig.json
├── firebase.json         # Hosting + Functions rewrite rules
├── .env.example          # copy to .env.local – never commit REAL secrets
└── README.md             # this file
```

---

## 1  Set up locally

```bash
# prerequisites: Node 18+, pnpm, Firebase CLI
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

# create env file (populate your Firebase keys)
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

Only Firebase-style keys remain:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

Copy `.env.example` → `.env.local`, fill them in, and **do not commit** `.env.local`.

---

## 4  Next steps

* **Auth** – swap the stub in `functions/src/index.ts` for real `firebase-admin` ID-token checks.  
* **Database** – currently reads/writes Firestore; switch to Cloud SQL Postgres if you need relational.  
* **Cloud Run** – if you ever outgrow Functions, add a Dockerfile and deploy via `gcloud run deploy`.

Happy shipping! 🏡


DATABASE_URL=postgresql://postgres:wXz8wMCwjTztbfe0@db.biwdyefuevbznzrjgymj.supabase.co:5432/postgres
