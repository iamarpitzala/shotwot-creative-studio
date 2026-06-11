#!/usr/bin/env bash
# deploy.sh — Build and deploy the ShotWot frontend to Cloud Run
#
# The Vite VITE_* env vars are baked into the static bundle at build time,
# so they must be passed as Docker build args here.
#
# Usage:
#   chmod +x deploy.sh
#   source .env   # loads VITE_* vars into shell, then run:
#   ./deploy.sh

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID:-your-gcp-project-id}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE_NAME="shotwot-frontend"
REPO="shotwot"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE_NAME}"
# ──────────────────────────────────────────────────────────────────────────────

# Validate required vars
: "${VITE_API_URL:?Set VITE_API_URL (e.g. https://shotwot-backend-xxx-el.a.run.app)}"
: "${VITE_FIREBASE_API_KEY:?Set VITE_FIREBASE_API_KEY}"
: "${VITE_FIREBASE_AUTH_DOMAIN:?Set VITE_FIREBASE_AUTH_DOMAIN}"
: "${VITE_FIREBASE_PROJECT_ID:?Set VITE_FIREBASE_PROJECT_ID}"
: "${VITE_FIREBASE_STORAGE_BUCKET:?Set VITE_FIREBASE_STORAGE_BUCKET}"
: "${VITE_FIREBASE_MESSAGING_SENDER_ID:?Set VITE_FIREBASE_MESSAGING_SENDER_ID}"
: "${VITE_FIREBASE_APP_ID:?Set VITE_FIREBASE_APP_ID}"

echo "▶ Building image: ${IMAGE}"
gcloud builds submit \
  --project="${PROJECT_ID}" \
  --tag="${IMAGE}" \
  --substitutions \
    "_VITE_API_URL=${VITE_API_URL},\
_VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY},\
_VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN},\
_VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID},\
_VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET},\
_VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID},\
_VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}" \
  --config=cloudbuild.frontend.yaml \
  .

echo "▶ Deploying to Cloud Run: ${SERVICE_NAME} in ${REGION}"
gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --image="${IMAGE}" \
  --platform=managed \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=5 \
  --concurrency=1000 \
  --cpu=1 \
  --memory=256Mi \
  --port=8080

echo "✅ Frontend deployed."
gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format="value(status.url)"
