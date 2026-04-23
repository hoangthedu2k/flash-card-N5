# Gungun N5 Flashcards

Ứng dụng học từ vựng tiếng Nhật N5 dạng static page, chạy trực tiếp trên GitHub Pages.

## Tính năng

- 📘 Học từ vựng theo cụm 10 từ với flashcard lật 3D
- 🎯 3 loại câu hỏi trắc nghiệm: nghĩa, cách đọc, cách viết
- ⚠️ Ôn tập từ đã trả lời sai
- 📊 Theo dõi tiến trình: new → learned → review → mastered
- 🔊 Phát âm tiếng Nhật qua Web Speech API
- ✨ Giải thích từ vựng + ví dụ bằng AI (Gemini)
- ☁️ Đồng bộ trạng thái học về Google Sheets

---

## Cách triển khai

### Bước 1: Deploy lên GitHub Pages

1. Tạo repo mới trên GitHub (hoặc dùng repo hiện có)
2. Push file `index.html` lên repo:
   ```bash
   git init
   git add index.html
   git commit -m "Add flashcard app"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
3. Vào **Settings → Pages → Source**: chọn `main` branch, folder `/` (root)
4. App sẽ chạy tại: `https://your-username.github.io/your-repo/`

> **Lưu ý:** Nếu chỉ muốn dùng offline với dữ liệu built-in, bỏ qua các bước còn lại.

---

### Bước 2 (Tùy chọn): Kết nối Google Sheets

#### 2a. Tạo Google Sheet

1. Tạo Google Sheet mới
2. Đặt tên sheet (tab) là `Sheet1`
3. Thêm dữ liệu theo định dạng sau (dòng 1 là header):

   | A — kanji | B — kana | C — meaning | D — status |
   |-----------|----------|-------------|------------|
   | 日本 | にほん | Nhật Bản | new |
   | 学校 | がっこう | Trường học | |

   Cột D để trống thì mặc định là `new`.

#### 2b. Tạo Google Apps Script

1. Trong Google Sheet: menu **Extensions → Apps Script**
2. Xóa code mẫu, dán toàn bộ nội dung file `apps-script.js` vào
3. Nếu sheet của bạn tên khác, sửa dòng: `const SHEET_NAME = 'Sheet1';`
4. Lưu dự án (Ctrl+S)

#### 2c. Deploy Apps Script

1. Click **Deploy → New deployment**
2. Click biểu tượng ⚙️ cạnh "Select type" → chọn **Web app**
3. Điền mô tả (bất kỳ)
4. **Execute as:** Me
5. **Who has access:** Anyone
6. Click **Deploy** → Cấp quyền khi được hỏi
7. Copy **Web app URL** (dạng `https://script.google.com/macros/s/ABC.../exec`)

#### 2d. Cập nhật CONFIG trong index.html

Mở `index.html`, tìm phần CONFIG ở đầu script và điền URL:

```javascript
const CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/ABC.../exec",
  GEMINI_API_KEY: "",
};
```

---

### Bước 3 (Tùy chọn): Bật tính năng AI

1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Tạo API key miễn phí
3. Điền vào CONFIG:
   ```javascript
   GEMINI_API_KEY: "AIza...",
   ```

---

## Định dạng trạng thái từ vựng

| Status | Ý nghĩa |
|--------|---------|
| `new` | Chưa học |
| `learned` | Đã học qua flashcard |
| `review` | Cần ôn (trả lời sai trong quiz) |
| `mastered` | Thuộc lòng (từng là review, trả lời đúng quiz) |

---

## Luồng học

```
Học flashcard (10 từ)
    → trạng thái: new → learned

Làm quiz, trả lời sai
    → trạng thái: learned → review

Ôn tập (review session)
    → xem lại flashcard → trạng thái: review → learned

Làm quiz, từ review trả lời đúng
    → trạng thái: review → mastered
```

---

## Cập nhật Apps Script sau khi đổi code

Mỗi khi sửa `apps-script.js`:
1. Deploy → **Manage deployments**
2. Click biểu tượng ✏️ → chọn **Version: New version**
3. Click **Deploy**

URL không thay đổi, không cần sửa `index.html`.

---

## Chạy offline / Không có Google Sheets

App hoạt động hoàn toàn offline với bộ từ vựng N5 built-in (~250 từ).
Tiến trình sẽ lưu trong **localStorage** của trình duyệt.
