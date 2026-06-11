/**
 * Vercel serverless proxy — forwards all /api/* requests to the Cloud Run
 * backend, attaching a GCP identity token so Cloud Run's IAM auth is satisfied.
 *
 * Environment variables required in Vercel project settings:
 *   BACKEND_URL        = https://shotwot-backend-343786485228.us-central1.run.app
 *   GCP_CLIENT_EMAIL   = shotwot-studio-sa@studio-shotwot.iam.gserviceaccount.com
 *   GCP_PRIVATE_KEY    = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
 */

import { SignJWT, importPKCS8 } from "jose";

const BACKEND_URL = process.env.BACKEND_URL;
const CLIENT_EMAIL = process.env.GCP_CLIENT_EMAIL;
const PRIVATE_KEY_RAW = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n");
const AUDIENCE = BACKEND_URL;

async function getIdentityToken() {
  const privateKey = await importPKCS8(PRIVATE_KEY_RAW, "RS256");
  const now = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({
    target_audience: AUDIENCE,
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(CLIENT_EMAIL)
    .setSubject(CLIENT_EMAIL)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  // Exchange self-signed JWT for a Google-issued identity token
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const data = await resp.json();
  return data.id_token;
}

export default async function handler(req, res) {
  try {
    // Strip the /api prefix to get the actual backend path
    const backendPath = req.url.replace(/^\/api/, "") || "/";
    const targetUrl = `${BACKEND_URL}${backendPath}`;

    const identityToken = await getIdentityToken();

    // Forward all headers except host, plus the identity token
    const forwardHeaders = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (key.toLowerCase() === "host") continue;
      forwardHeaders[key] = value;
    }
    forwardHeaders["Authorization-Cloud-Run"] = `Bearer ${identityToken}`;
    // Keep the original Authorization header (Firebase token) for FastAPI
    // Cloud Run needs the identity token — pass it via a custom header
    // and rewrite in the request
    forwardHeaders["Authorization"] = `Bearer ${identityToken}`;
    // Restore the Firebase token as X-Firebase-Token so FastAPI can read it
    if (req.headers["authorization"]) {
      forwardHeaders["X-Firebase-Token"] = req.headers["authorization"].replace("Bearer ", "");
    }

    // Read body for POST/PUT/PATCH
    let body = undefined;
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = Buffer.concat(chunks);
    }

    const backendResp = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    // Forward response headers
    for (const [key, value] of backendResp.headers.entries()) {
      if (key.toLowerCase() === "transfer-encoding") continue;
      res.setHeader(key, value);
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(backendResp.status);

    const respBody = await backendResp.arrayBuffer();
    res.send(Buffer.from(respBody));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ detail: "Proxy error: " + err.message });
  }
}
