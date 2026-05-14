const SHEET_NAME = 'Submissions';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Google Apps Script web app is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(ss, SHEET_NAME);

    const suggestion = (e && e.parameter && e.parameter.suggestion ? String(e.parameter.suggestion) : '').trim();
    const email = (e && e.parameter && e.parameter.email ? String(e.parameter.email) : '').trim();
    const hp = (e && e.parameter && e.parameter.hp ? String(e.parameter.hp) : '').trim();
    const source = (e && e.parameter && e.parameter.source ? String(e.parameter.source) : '').trim();

    if (hp) {
      return json_({ ok: true, ignored: true });
    }

    if (!suggestion || suggestion.length < 3) {
      return json_({ ok: false, error: 'Suggestion required' });
    }

    sheet.appendRow([
      new Date(),
      suggestion,
      email || '(not provided)',
      source || 'unknown',
      Session.getActiveUser().getEmail() || ''
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function getOrCreateSheet_(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'Suggestion', 'Email', 'Source', 'User']);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
