# Firebase Setup (generated on 2025-05-20)

## Local Development

```bash
pnpm install           # install root deps (front‑end + server)
cd functions
pnpm install           # install Cloud Functions deps
cd ..

# Build the client
pnpm run build         # vite build -> client/dist

# Start emulators (hosting + functions)
firebase emulators:start --only hosting,functions
```

* Hosting preview: http://localhost:5000  
* API preview: http://localhost:5001/api/…


## Deployment

```bash
# builds client and functions then deploys
pnpm run build
firebase deploy --only hosting,functions
```

## Notes

* Auth: placeholder middleware in `server/firebaseAuth.ts` currently lets every request through.  
  Replace with real Firebase Auth verification when ready.
* Removed Replit‑specific files and env vars (`ISSUER_URL`, `REPLIT_DOMAINS`, `REPL_ID`).
* Environment keys now live in `.env.example`.  Copy to `.env.local` and add your secrets.
