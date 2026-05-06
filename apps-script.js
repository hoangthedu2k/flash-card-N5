/**
 * Google Apps Script — Flashcard N5 Backend
 *
 * CÁCH TRIỂN KHAI:
 * 1. Mở Google Sheet của bạn
 * 2. Menu: Extensions > Apps Script
 * 3. Xóa code cũ, dán toàn bộ file này vào
 * 4. Sửa SHEET_NAME nếu sheet của bạn không phải "Sheet1"
 * 5. (Tùy chọn) Cài Gemini API key cho tính năng AI — xem hướng dẫn bên dưới
 * 6. Menu: Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy URL deployment dán vào CONFIG.APPS_SCRIPT_URL trong index.html
 *
 * CÀI ĐẶT GEMINI API KEY (để dùng tính năng AI):
 * 1. Trong Apps Script editor: menu Project Settings (biểu tượng ⚙️)
 * 2. Chọn tab "Script properties"
 * 3. Add property: Name = GEMINI_API_KEY, Value = <key của bạn>
 * 4. Save → Redeploy (Deploy > Manage deployments > chọn New version)
 *
 * ĐỊNH DẠNG GOOGLE SHEET (bắt buộc):
 * | A (kanji) | B (kana)   | C (meaning) | D (status)  |
 * |-----------|------------|-------------|-------------|
 * | 日本       | にほん      | Nhật Bản    | new         |
 * | 学校       | がっこう    | Trường học  | learned     |
 */

// ============================================================
// CẤU HÌNH
// ============================================================
const SHEET_NAME = 'Sheet1';
const GEMINI_MODEL = 'gemini-3-flash-preview';

// ============================================================
// GET: Trả về từ vựng, hoặc ?action=listModels để xem models available
// ============================================================
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'listModels') {
      return listAvailableModels();
    }

    const sheet = getSheet();
    const data  = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse([]);
    }

    const words = data.slice(1)
      .map(row => ({
        kanji:   String(row[0] || '').trim(),
        kana:    String(row[1] || '').trim(),
        meaning: String(row[2] || '').trim(),
        status:  String(row[3] || 'new').trim() || 'new',
      }))
      .filter(w => w.kanji && w.kana && w.meaning);

    return jsonResponse(words);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function listAvailableModels() {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) return jsonResponse({ error: 'GEMINI_API_KEY chưa được cài' }, 500);
  const res = UrlFetchApp.fetch(
    'https://generativelanguage.googleapis.com/v1beta/models?key=' + key,
    { muteHttpExceptions: true }
  );
  const data = JSON.parse(res.getContentText());
  const names = (data.models || [])
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => m.name);
  return jsonResponse({ models: names });
}

// ============================================================
// POST: Cập nhật trạng thái HOẶC gọi AI
// Body cập nhật status: { "kanji": "日本", "status": "learned" }
// Body gọi AI:          { "action": "ai", "kanji": "日本", "kana": "にほん", "meaning": "Nhật Bản" }
// ============================================================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action === 'ai') {
      return handleAiRequest(body);
    }

    const kanji  = String(body.kanji  || '').trim();
    const status = String(body.status || '').trim();

    if (!kanji || !status) {
      return jsonResponse({ error: 'Missing kanji or status' }, 400);
    }

    const validStatuses = ['new', 'learned', 'review', 'mastered'];
    if (!validStatuses.includes(status)) {
      return jsonResponse({ error: 'Invalid status: ' + status }, 400);
    }

    const sheet = getSheet();
    const data  = sheet.getDataRange().getValues();

    let updated = false;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === kanji) {
        sheet.getRange(i + 1, 4).setValue(status);
        updated = true;
        // Tiếp tục để cập nhật tất cả dòng trùng (không break)
      }
    }

    if (!updated) {
      return jsonResponse({ error: 'Word not found: ' + kanji }, 404);
    }

    return jsonResponse({ success: true, kanji, status });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ============================================================
// AI: Gọi Gemini server-side, key lưu trong Script Properties
// ============================================================
function handleAiRequest(body) {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) {
    return jsonResponse({ error: 'GEMINI_API_KEY chưa được cài trong Script Properties. Xem hướng dẫn trong apps-script.js.' }, 500);
  }

  const kanji   = String(body.kanji   || '').trim();
  const kana    = String(body.kana    || '').trim();
  const meaning = String(body.meaning || '').trim();

  if (!kanji || !kana || !meaning) {
    return jsonResponse({ error: 'Missing kanji, kana or meaning' }, 400);
  }

  const prompt =
    'Bạn là giáo viên tiếng Nhật N5. Từ vựng: "' + kanji + '" (' + kana + ') - nghĩa tiếng Việt: "' + meaning + '".\n\n' +
    'Trả lời ĐÚNG định dạng JSON sau, không thêm gì khác:\n' +
    '{"examples":[{"japanese":"...","romaji":"...","vietnamese":"..."},{"japanese":"...","romaji":"...","vietnamese":"..."}],"tip":"..."}\n\n' +
    'Yêu cầu:\n' +
    '- examples: 2 câu ví dụ tiếng Nhật N5 đơn giản, có romaji và dịch tiếng Việt\n' +
    '- tip: 1 mẹo nhớ từ bằng tiếng Việt';

  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + key;

  const requestOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 },
    }),
    muteHttpExceptions: true,
  };

  let response, code, data;
  for (let attempt = 1; attempt <= 3; attempt++) {
    response = UrlFetchApp.fetch(apiUrl, requestOptions);
    code = response.getResponseCode();
    data = JSON.parse(response.getContentText());
    if (code === 200) break;
    const isRetryable = code === 429 || code === 503 ||
      (data?.error?.message || '').toLowerCase().includes('high demand');
    if (!isRetryable || attempt === 3) break;
    Utilities.sleep(attempt * 2000);
  }

  if (code !== 200) {
    const msg = data?.error?.message || ('Gemini HTTP ' + code);
    return jsonResponse({ error: msg });
  }

  const text = (data.candidates || [])[0]?.content?.parts?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return jsonResponse({ error: 'Gemini trả về không đúng định dạng JSON' }, 500);

  try {
    return jsonResponse(JSON.parse(match[0]));
  } catch (err) {
    return jsonResponse({ error: 'JSON parse error: ' + err.message }, 500);
  }
}

// ============================================================
// HELPERS
// ============================================================
function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');
  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
