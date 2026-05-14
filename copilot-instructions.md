# SGA Campaign Landing Page — Copilot Instructions

## What this is
A single-file mobile-first campaign landing page (`index.html`) for a student government election at American College Thessaloniki. No build system, no framework, no dependencies except two Google Fonts.

## Stack
- Pure HTML/CSS/JS in one file (`index.html`)
- Fonts: Bebas Neue (display) + DM Sans (body) via Google Fonts CDN
- Form backend: Google Apps Script Web App URL in `APPS_SCRIPT_URL`
- Hosting target: Vercel or Netlify (static, no server)

## Key variables to configure
```js
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```
The submit flow is guarded and degrades gracefully if the URL is not configured.

## Photo slots
Two candidate photo placeholders in the DOM:
```html
<!-- #photo-petar and #photo-tea -->
<!-- Uncomment the <img> tag inside each and point src at the actual file -->
```
Photos should be portrait ratio (3:4), placed in the same directory as `index.html`.

## Common issues to check
- **Form not submitting**: confirm `APPS_SCRIPT_URL` points to a deployed Apps Script web app and accepts POST requests
- **No visible submit success state**: frontend uses `mode: 'no-cors'`, so verify entries in Google Sheet
- **Fonts not loading**: Google Fonts requires internet access; locally open `index.html` may show fallback fonts, this is fine
- **Form success state not showing**: check `display` toggle on `#form-container` and `#form-success` — success state is `display: block`, default is `display: none`

## How to test locally in VSCode
1. Install the **Live Server** extension (ritwickdey.liveserver)
2. Right-click `index.html` → Open with Live Server

## Structure at a glance
```
index.html
├── <style>          CSS variables, layout, animations
├── .hero            Full-screen opening with large background text
├── .candidates      2-column photo + name grid
├── .platform-item   4 numbered platform points
├── .form-section    Suggestion textarea + optional email + submit
├── <footer>         Names + election date
└── <script>         submitForm() + candidate rendering
```
