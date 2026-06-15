# Seaweed Tide Planner

Standalone mobile-first tide planning web app for seaweed farming workflows in Kenya.

The first build is a static GitHub Pages-compatible web app. It is intentionally separate from the Seaweed Station dashboard and does not use the Seaweed Station v4 Supabase database.

## Project Shape

```text
index.html                         Tide planner entry point
map.html                           Farm and tide-reference map
importer.html                      Admin-gated dataset import preview page
assets/css/                        App styling
assets/js/                         Tide logic, formatting, charts, page controller
assets/data/                       Static prototype data and tide profiles
assets/vendor/leaflet/             Local Leaflet map assets for offline-capable app packaging
01_Tide_Planning_Documents/        Requirements and planning pack
02_Tide_Data_Sources/              Source tide-table PDFs and references
03_Build_And_Handover_Documents/   Deployment and local-operator notes
04_Superbase/                      Supabase SQL schema, seed, RLS, and import tools
tools/                             Packaging helper scripts
tests/                             Smoke tests for reusable tide logic
```

## Local Run

Use a local static server from this folder.

No Node/npm is required for the current static app:

```powershell
python -m http.server 8080
```

If Node/npm is installed later, the same command is also wrapped as:

```powershell
npm run serve
```

Then open:

```text
http://localhost:8080/
```

## Checks

Run the initial tide-core smoke tests when Node is available:

```powershell
npm test
```

The static web app still runs without a build step. Android packaging prep has a generated `www/` bundle step, but the generated folder is intentionally ignored by git.

## Android Prep

The Android field-user app surface is Tide + Map only. Admin/importer remain web/operator pages and are not copied into the Android web bundle.

Generate the Android web bundle with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\prepare_android_web.ps1
```

Capacitor config is in `capacitor.config.json`. Full notes are in:

```text
03_Build_And_Handover_Documents/ANDROID_APP_PREP.md
```

## Deployment Direction

The intended first public deployment is:

```text
https://seaweed-tide-planner.github.io
```

The app should remain domain-portable. Keep app base paths, API URLs, and deployment settings in `assets/js/config.js` or future environment config rather than hardcoding a production domain into app logic.

## Backend Boundary

The Tide Planner backend context is:

```text
V0_Tide_Planner
```

Supabase project:

```text
Project ref: iztlyyavbdgfqfymqwzz
REST URL: https://iztlyyavbdgfqfymqwzz.supabase.co/rest/v1
```

The current prototype uses static seed data while the dedicated backend schema is still being defined. Supabase is configured in `assets/js/config.js`, but live reads are disabled until table names, RLS policies, and approved read paths are agreed. Do not use the Seaweed Station v4 Supabase project as the Tide Planner source of truth.

Only the public anon key should ever be used in browser code. Service-role keys must never be committed or shipped to the web app.

Database setup SQL is managed in:

```text
04_Superbase/V0_Tide_Planner/2026-06-09_initial_foundation/
```

The active simplified schema and importer amendments are managed in:

```text
04_Superbase/V0_Tide_Planner/v0_SQL_one_time_amendments/
04_Superbase/V0_Tide_Planner/tools/
```
