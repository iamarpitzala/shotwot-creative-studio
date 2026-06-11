# ShotWot Frontend — Cloud Run Deployment

The frontend is a static Vite SPA served by nginx on Cloud Run.
Firebase config and the backend URL are baked into the bundle at build time via `VITE_*` build args.

## Prerequisites

Same Artifact Registry repo as the backend (`shotwot`).
See `shotwot-backend/DEPLOY.md` for the one-time setup steps.

## Deploying

```bash
# Load your values
export GCP_PROJECT_ID=YOUR_PROJECT_ID
export GCP_REGION=asia-south1

# Firebase Web App config (from Firebase Console → Project Settings → Your apps)
export VITE_FIREBASE_API_KEY=AIza...
export VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
export VITE_FIREBASE_PROJECT_ID=your-project
export VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
export VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
export VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend Cloud Run URL (from the backend deploy output)
export VITE_API_URL=https://shotwot-backend-xxx-el.a.run.app

chmod +x deploy.sh
./deploy.sh
```

The script prints the frontend Cloud Run URL at the end.

## After deploying

1. Go to **Firebase Console → Authentication → Settings → Authorized domains**
   and add your frontend Cloud Run URL (e.g. `shotwot-frontend-xxx-el.a.run.app`).

2. Update the backend's CORS env var with the frontend URL:
   ```bash
   gcloud run services update shotwot-backend \
     --region=asia-south1 \
     --update-env-vars="FRONTEND_URL=https://shotwot-frontend-xxx-el.a.run.app"
   ```
