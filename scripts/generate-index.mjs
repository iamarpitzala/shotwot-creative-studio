/**
 * Post-build script: reads the TanStack Start manifest to find the client entry
 * JS and CSS filenames (which are hashed), then writes dist/client/index.html.
 *
 * Run after `bun run build`.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const distClient = "dist/client";
const distServerAssets = "dist/server/assets";

// Find the manifest file
const manifestFile = readdirSync(distServerAssets).find((f) =>
  f.startsWith("_tanstack-start-manifest")
);
if (!manifestFile) {
  throw new Error("Could not find TanStack manifest in dist/server/assets/");
}

const manifestSrc = readFileSync(join(distServerAssets, manifestFile), "utf8");

// Extract clientEntry from the manifest
const clientEntryMatch = manifestSrc.match(/clientEntry:\s*["']([^"']+)["']/);
if (!clientEntryMatch) {
  throw new Error("Could not find clientEntry in manifest");
}
const clientEntry = clientEntryMatch[1]; // e.g. "/assets/index-C8BbX2Zu.js"

// Find the CSS file in dist/client/assets
const cssFile = readdirSync(join(distClient, "assets")).find((f) =>
  f.startsWith("styles") && f.endsWith(".css")
);
const cssPath = cssFile ? `/assets/${cssFile}` : null;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ShotWot Studio — Your brand. Your people. Generated.</title>
    <meta name="description" content="India's first B2B AI creative studio." />
    ${cssPath ? `<link rel="stylesheet" href="${cssPath}" />` : ""}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${clientEntry}"></script>
  </body>
</html>
`;

writeFileSync(join(distClient, "index.html"), html);
console.log(`✅ Generated dist/client/index.html`);
console.log(`   client entry: ${clientEntry}`);
console.log(`   css: ${cssPath ?? "none"}`);
