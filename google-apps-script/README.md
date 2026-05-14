# Google Apps Script Form Backend

This folder contains the Apps Script code that writes campaign form responses into a Google Sheet.

## Setup

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Replace the default code with the contents of `Code.gs`.
4. Save the project.
5. In Apps Script, click **Run** once on `doGet` or `doPost` to authorize access.
6. Deploy the script as a web app:
   - Click **Deploy → New deployment**
   - Choose **Web app**
   - **Execute as**: Me
   - **Who has access**: Anyone
   - Click **Deploy**
7. Copy the **Web app URL**.
8. Paste that URL into `APPS_SCRIPT_URL` in `index.html`.

## What it does

- Accepts `suggestion`, `email`, `hp`, and `source` fields.
- Ignores submissions where the honeypot field `hp` is filled.
- Appends valid submissions to a sheet named `Submissions`.

## Columns written to the sheet

- Timestamp
- Suggestion
- Email
- Source
- User

## Notes

- The frontend posts using `mode: 'no-cors'` so the request can reach Google Apps Script from the static site.
- If you want to see detailed errors during setup, check **Apps Script → Executions** and **View → Logs**.
