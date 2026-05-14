# SGA Campaign Landing Page — Copilot Instructions

## What this is
A single-file mobile-first campaign landing page (`index.html`) for a student government election at American College Thessaloniki. No build system, no framework, no dependencies except two Google Fonts and optional third-party SDKs loaded at runtime.

## Stack
- Pure HTML/CSS/JS in one file (`index.html`)
- Fonts: Bebas Neue (display) + DM Sans (body) via Google Fonts CDN
- Form backend: Formspree (free tier) — ID goes in `FORMSPREE_ID` const
- Push notifications: OneSignal Web Push SDK v16 — ID goes in `ONESIGNAL_APP_ID` const
- Hosting target: Vercel or Netlify (static, no server)

## Key variables to configure
```js
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';     // formspree.io form ID
const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID'; // onesignal.com app ID
```
Both are guarded — the code degrades gracefully if they're still placeholder strings.

## Photo slots
Two candidate photo placeholders in the DOM:
```html
<!-- #photo-petar and #photo-tea -->
<!-- Uncomment the <img> tag inside each and point src at the actual file -->
```
Photos should be portrait ratio (3:4), placed in the same directory as `index.html`.

## Common issues to check
- **Form not submitting**: confirm `FORMSPREE_ID` is set and the Formspree form has the correct allowed origin (add your Vercel/Netlify domain in Formspree dashboard)
- **Notifications not working on iOS**: Web Push on iOS requires the user to Add to Home Screen first; this is a browser limitation, not a bug
- **Notification permission denied**: browser setting, user must manually re-enable in site settings
- **OneSignal SDK not loading**: check network tab for the CDN script; OneSignal requires HTTPS — won't work on `file://` locally
- **Fonts not loading**: Google Fonts requires internet access; locally open `index.html` may show fallback fonts, this is fine
- **Form success state not showing**: check `display` toggle on `#form-container` and `#form-success` — success state is `display: block`, default is `display: none`

## How to test locally in VSCode
1. Install the **Live Server** extension (ritwickdey.liveserver)
2. Right-click `index.html` → Open with Live Server
3. For push notification testing you need HTTPS — use **ngrok** or deploy to Netlify/Vercel preview

## Structure at a glance
```
index.html
├── <style>          CSS variables, layout, animations
├── .hero            Full-screen opening with large background text
├── .candidates      2-column photo + name grid
├── .platform-item   4 numbered platform points
├── .form-section    Suggestion textarea + optional email + submit
├── .notify-section  Push notification opt-in
├── <footer>         Names + election date
└── <script>         submitForm() + requestNotify() + OneSignal loader
```
