/**
 * Google Apps Script — Flashcard N5 Backend
 *
 * CÁCH TRIỂN KHAI:
 * 1. Mở Google Sheet của bạn
 * 2. Menu: Extensions > Apps Script
 * 3. Xóa code cũ, dán toàn bộ file này vào
 * 4. Sửa SHEET_NAME nếu sheet của bạn không phải "Sheet1"
 * 5. Menu: Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL deployment dán vào CONFIG.APPS_SCRIPT_URL trong index.html
 *
 * ĐỊNH DẠNG GOOGLE SHEET (bắt buộc):
 * | A (kanji) | B (kana)   | C (meaning) | D (status)  |
 * |-----------|------------|-------------|-------------|
 * | 日本       | にほん      | Nhật Bản    | new         |
 * | 学校       | がっこう    | Trường học  | learned     |
 *
 * Dòng đầu tiên là HEADER (tiêu đề), dữ liệu bắt đầu từ dòng 2.
 * Cột D (status) có thể để trống — mặc định là "new".
 * Các giá trị status hợp lệ: new | learned | review | mastered
 */

// ============================================================
// CẤU HÌNH
// ============================================================
const SHEET_NAME = 'Sheet1'; // Tên sheet (tab) chứa từ vựng

// ============================================================
// GET: Trả về toàn bộ từ vựng kèm trạng thái (dạng JSON)
// ============================================================
function doGet(e) {
  try {
    const sheet = getSheet();
    const data  = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse([]);
    }

    const words = data.slice(1) // bỏ dòng header
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

// ============================================================
// POST: Cập nhật trạng thái của một từ
// Body: { "kanji": "日本", "status": "learned" }
// ============================================================
function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
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
        break;
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
// HELPERS
// ============================================================
function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');
  return sheet;
}

function jsonResponse(data, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
