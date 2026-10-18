# Project handoff for Claude Code

## User intent and current state

The user requested: "make all pages functional and make it in a single platform, also add another page calculative metrics for KPI", then asked to host locally, then requested transfer to Claude Code. The implementation is complete as a browser-local platform. No new feature or backend work has been requested as part of this handoff.

Workspace: `C:\Users\TANJIM IMTIAL\Downloads\product-growth-design-html\product-growth-design`.

Local URL: `http://localhost:8080`. A Python server was started in the previous assistant session and returned HTTP 200. It may need restarting when that session ends. Keep using the same URL/hostname to access the same browser-local data; localhost and 127.0.0.1 have separate storage origins.

## Architecture and files

- `index.html`: unified application entry point, loading `app.css`, `metrics.js`, and `app.js`.
- `app.js`: hash routing, view templates, handlers, browser-local persistence, backup validation, exports, and sample data.
- `app.css`: responsive purple/blue styling inspired by the supplied mockups.
- `metrics.js`: standalone KPI calculations, available as `GrowthMetrics` in browsers and a CommonJS export for tests.
- `verify.cjs`: Node tests for calculations and functional smoke checks using a simulated DOM. This is not a real browser integration test.
- `01-sign-in.html` through `14-kpi-calculator.html`: compatibility redirects to the unified platform routes.
- `design-reference/`: preserved original design mockups. These are visual references, not the live app. Preserve them when changing the platform.
- `README.md`: user-facing setup and limitations.

No package installation, build process, framework, or backend is required. Fonts use Google Fonts with system font fallbacks.

## Features delivered

Routes: `signin`, `dashboard`, `products`, `board`, `work`, `calendar`, `meetings`, `email`, `notes`, `campaigns`, `analytics`, `kpi`, `files`, `automations`, `settings`.

Includes local profile entry/sign-out, product creation and insights, task creation/editing/deletion/status updates and search, per-product boards, schedule from tasks and meetings, template-based meeting minutes, email draft preparation and downloads, notes, campaign tracking and ROI, filtered analytics, resource links, workspace rules, currency settings, CSV exports, JSON backup/restore.

KPI calculator includes conversion rate, CAC, ROAS, marketing ROI, average revenue per customer, estimated customer lifetime value, retention, CTR, CPC, and target attainment. Includes live calculations, snapshots/history, CSV export, formula explanations, and zero-denominator handling.

## Data and limitations

All state resides in localStorage under `imtial-growth-v1`. Use Settings → Download workspace backup to preserve or transfer actual browser data; source files do not contain users' saved workspace records. No passwords are stored. Local profile entry is not secure authentication.

Meeting minutes use a local template, not AI. Email opens a `mailto:` draft in the user's mail client; sending and delivery are outside this app. Automations run during workspace use, not as scheduled background jobs. There is no server storage, multi-user access, synchronization, deployed hosting, live AI, or email service.

HTML escaping, safe HTTP/HTTPS resource links, backup schema checks, and spreadsheet formula escaping are implemented. Browser storage failures trigger an export-backup notification.

## Run and verify

From this project directory:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://localhost:8080`. If port 8080 is already serving this project, reuse that server. Do not terminate unrelated processes.

```powershell
node --check app.js
node --check metrics.js
node verify.cjs
```

Last checks passed: KPI formulas, zero denominators, negative ROI, fourteen application route renders, HTML escaping, task persistence, meeting-to-email flow, backup validation, and legacy page redirects. Node v24.19.0 and Python 3.14.2 were available. Playwright was not installed; real-browser visual and end-to-end verification remain unperformed.

## Continuing work

Read the current files before editing and preserve existing user changes. Work on the root application files for platform changes. Use `design-reference/` when reviewing the original designs. Keep browser-local limitations explicit; only add real authentication, AI, email delivery, backend storage, or deployment when requested. The present task is a handoff, not authorization for further feature work.
