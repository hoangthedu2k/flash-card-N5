import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, ArrowRight, RotateCcw, CheckCircle2, XCircle, Trophy, Play, Sparkles, Loader2, AlertTriangle, Volume2 } from 'lucide-react';

// Dữ liệu từ vựng N5 MỞ RỘNG (~300 từ cốt lõi)
const N5_WORDS = [
  // --- QUỐC GIA & NGÔN NGỮ ---
  { kanji: "ベトナム", kana: "ベトナム", meaning: "Việt Nam" },
  { kanji: "日本", kana: "にほん", meaning: "Nhật Bản" },
  { kanji: "中国", kana: "ちゅうごく", meaning: "Trung Quốc" },
  { kanji: "韓国", kana: "かんこく", meaning: "Hàn Quốc" },
  { kanji: "タイ", kana: "タイ", meaning: "Thái Lan" },
  { kanji: "フランス", kana: "フランス", meaning: "Nước Pháp" },
  { kanji: "日本語", kana: "にほんご", meaning: "Tiếng Nhật" },
  { kanji: "英語", kana: "えいご", meaning: "Tiếng Anh" },

  // --- ĐẠI TỪ & NGƯỜI ---
  { kanji: "私", kana: "わたし", meaning: "Tôi" },
  { kanji: "あなた", kana: "あなた", meaning: "Bạn" },
  { kanji: "あの人", kana: "あのひと", meaning: "Người kia" },
  { kanji: "あの方", kana: "あのかた", meaning: "Vị kia (lịch sự của あの人)" },
  { kanji: "皆さん", kana: "みなさん", meaning: "Mọi người" },
  { kanji: "男の人", kana: "おとこのひと", meaning: "Người đàn ông" },
  { kanji: "女の人", kana: "おんなのひと", meaning: "Người phụ nữ" },
  { kanji: "男の子", kana: "おとこのこ", meaning: "Cậu bé" },
  { kanji: "女の子", kana: "おんなのこ", meaning: "Cô bé" },
  { kanji: "子ども", kana: "こども", meaning: "Trẻ em, con cái" },
  { kanji: "友達", kana: "ともだち", meaning: "Bạn bè" },
  { kanji: "恋人", kana: "こいびと", meaning: "Người yêu" },
  { kanji: "大人", kana: "おとな", meaning: "Người lớn" },
  { kanji: "誰", kana: "だれ", meaning: "Ai" },
  { kanji: "どなた", kana: "どなた", meaning: "Ai (lịch sự)" },

  // --- GIA ĐÌNH ---
  { kanji: "家族", kana: "かぞく", meaning: "Gia đình" },
  { kanji: "父", kana: "ちち", meaning: "Bố (của mình)" },
  { kanji: "母", kana: "はは", meaning: "Mẹ (của mình)" },
  { kanji: "兄", kana: "あに", meaning: "Anh trai (của mình)" },
  { kanji: "姉", kana: "あね", meaning: "Chị gái (của mình)" },
  { kanji: "弟", kana: "おとうと", meaning: "Em trai (của mình)" },
  { kanji: "妹", kana: "いもうと", meaning: "Em gái (của mình)" },
  { kanji: "お父さん", kana: "おとうさん", meaning: "Bố (của người khác)" },
  { kanji: "お母さん", kana: "おかあさん", meaning: "Mẹ (của người khác)" },
  { kanji: "お兄さん", kana: "おにいさん", meaning: "Anh trai (của người khác)" },
  { kanji: "お姉さん", kana: "おねえさん", meaning: "Chị gái (của người khác)" },
  { kanji: "祖父", kana: "そふ", meaning: "Ông (của mình)" },
  { kanji: "祖母", kana: "そぼ", meaning: "Bà (của mình)" },
  { kanji: "両親", kana: "りょうしん", meaning: "Bố mẹ" },
  { kanji: "兄弟", kana: "きょうだい", meaning: "Anh em" },

  // --- NGHỀ NGHIỆP ---
  { kanji: "先生", kana: "せんせい", meaning: "Giáo viên" },
  { kanji: "教師", kana: "きょうし", meaning: "Giáo viên (nghề nghiệp)" },
  { kanji: "学生", kana: "がくせい", meaning: "Học sinh, sinh viên" },
  { kanji: "会社員", kana: "かいしゃいん", meaning: "Nhân viên công ty" },
  { kanji: "社員", kana: "しゃいん", meaning: "Nhân viên (của một công ty cụ thể)" },
  { kanji: "銀行員", kana: "ぎんこういん", meaning: "Nhân viên ngân hàng" },
  { kanji: "医者", kana: "いしゃ", meaning: "Bác sĩ" },
  { kanji: "職員", kana: "しょくいん", meaning: "Nhân viên, công chức" },
  { kanji: "作家", kana: "さっか", meaning: "Nhà văn, tác giả" },
  { kanji: "運転手", kana: "うんてんしゅ", meaning: "Tài xế, người lái xe" },
  { kanji: "エンジニア", kana: "エンジニア", meaning: "Kỹ sư" },
  { kanji: "店員", kana: "てんいん", meaning: "Nhân viên cửa hàng" },
  { kanji: "歌手", kana: "かしゅ", meaning: "Ca sĩ" },
  { kanji: "社長", kana: "しゃちょう", meaning: "Giám đốc" },
  { kanji: "部長", kana: "ぶちょう", meaning: "Trưởng phòng, trưởng ban" },

  // --- THỜI GIAN ---
  { kanji: "今", kana: "いま", meaning: "Bây giờ" },
  { kanji: "朝", kana: "あさ", meaning: "Buổi sáng" },
  { kanji: "昼", kana: "ひる", meaning: "Buổi trưa" },
  { kanji: "夜", kana: "よる", meaning: "Buổi tối" },
  { kanji: "午前", kana: "ごぜん", meaning: "Sáng (A.M)" },
  { kanji: "午後", kana: "ごご", meaning: "Chiều (P.M)" },
  { kanji: "今日", kana: "きょう", meaning: "Hôm nay" },
  { kanji: "明日", kana: "あした", meaning: "Ngày mai" },
  { kanji: "明後日", kana: "あさって", meaning: "Ngày kia" },
  { kanji: "昨日", kana: "きのう", meaning: "Hôm qua" },
  { kanji: "一昨日", kana: "おととい", meaning: "Hôm kia" },
  { kanji: "今朝", kana: "けさ", meaning: "Sáng nay" },
  { kanji: "今晩", kana: "こんばん", meaning: "Tối nay" },
  { kanji: "毎日", kana: "まいにち", meaning: "Mỗi ngày" },
  { kanji: "毎朝", kana: "まいあさ", meaning: "Mỗi sáng" },
  { kanji: "毎晩", kana: "まいばん", meaning: "Mỗi tối" },
  { kanji: "先週", kana: "せんしゅう", meaning: "Tuần trước" },
  { kanji: "今週", kana: "こんしゅう", meaning: "Tuần này" },
  { kanji: "来週", kana: "らいしゅう", meaning: "Tuần sau" },
  { kanji: "先月", kana: "せんげつ", meaning: "Tháng trước" },
  { kanji: "今月", kana: "こんげつ", meaning: "Tháng này" },
  { kanji: "来月", kana: "らいげつ", meaning: "Tháng sau" },
  { kanji: "去年", kana: "きょねん", meaning: "Năm ngoái" },
  { kanji: "今年", kana: "ことし", meaning: "Năm nay" },
  { kanji: "来年", kana: "らいねん", meaning: "Năm sau" },
  { kanji: "時間", kana: "じかん", meaning: "Thời gian" },

  // --- ĐỊA ĐIỂM & ĐI LẠI ---
  { kanji: "学校", kana: "がっこう", meaning: "Trường học" },
  { kanji: "大学", kana: "だいがく", meaning: "Đại học" },
  { kanji: "図書館", kana: "としょかん", meaning: "Thư viện" },
  { kanji: "郵便局", kana: "ゆうびんきょく", meaning: "Bưu điện" },
  { kanji: "病院", kana: "びょういん", meaning: "Bệnh viện" },
  { kanji: "銀行", kana: "ぎんこう", meaning: "Ngân hàng" },
  { kanji: "会社", kana: "かいしゃ", meaning: "Công ty" },
  { kanji: "レストラン", kana: "レストラン", meaning: "Nhà hàng" },
  { kanji: "スーパー", kana: "スーパー", meaning: "Siêu thị" },
  { kanji: "店", kana: "みせ", meaning: "Cửa hàng" },
  { kanji: "駅", kana: "えき", meaning: "Nhà ga" },
  { kanji: "交番", kana: "こうばん", meaning: "Đồn cảnh sát" },
  { kanji: "市役所", kana: "しやくしょ", meaning: "Tòa thị chính" },
  { kanji: "大使館", kana: "たいしかん", meaning: "Đại sứ quán" },
  { kanji: "公園", kana: "こうえん", meaning: "Công viên" },
  { kanji: "町", kana: "まち", meaning: "Thành phố, thị trấn" },
  { kanji: "家", kana: "いえ", meaning: "Nhà" },
  { kanji: "部屋", kana: "へや", meaning: "Căn phòng" },
  { kanji: "電車", kana: "でんしゃ", meaning: "Tàu điện" },
  { kanji: "地下鉄", kana: "ちかてつ", meaning: "Tàu điện ngầm" },
  { kanji: "自転車", kana: "じてんしゃ", meaning: "Xe đạp" },
  { kanji: "車", kana: "くるま", meaning: "Ô tô" },

  // --- ĐỒ VẬT & THỰC PHẨM ---
  { kanji: "本", kana: "ほん", meaning: "Sách" },
  { kanji: "辞書", kana: "じしょ", meaning: "Từ điển" },
  { kanji: "手帳", kana: "てちょう", meaning: "Sổ tay" },
  { kanji: "傘", kana: "かさ", meaning: "Cái ô" },
  { kanji: "かばん", kana: "かばん", meaning: "Cặp, túi" },
  { kanji: "鍵", kana: "かぎ", meaning: "Chìa khóa" },
  { kanji: "時計", kana: "とけい", meaning: "Đồng hồ" },
  { kanji: "靴", kana: "くつ", meaning: "Giày" },
  { kanji: "服", kana: "ふく", meaning: "Quần áo" },
  { kanji: "机", kana: "つくえ", meaning: "Cái bàn" },
  { kanji: "椅子", kana: "いす", meaning: "Cái ghế" },
  { kanji: "料理", kana: "りょうり", meaning: "Món ăn" },
  { kanji: "ご飯", kana: "ごはん", meaning: "Cơm, bữa ăn" },
  { kanji: "肉", kana: "にく", meaning: "Thịt" },
  { kanji: "魚", kana: "さかな", meaning: "Cá" },
  { kanji: "野菜", kana: "やさい", meaning: "Rau" },
  { kanji: "水", kana: "みず", meaning: "Nước" },
  { kanji: "お酒", kana: "おさけ", meaning: "Rượu" },
  { kanji: "お茶", kana: "おちゃ", meaning: "Trà" },
  { kanji: "お菓子", kana: "おかし", meaning: "Bánh kẹo" },

  // --- ĐỘNG TỪ (V ます) ---
  { kanji: "起きます", kana: "おきます", meaning: "Thức dậy" },
  { kanji: "寝ます", kana: "ねます", meaning: "Ngủ" },
  { kanji: "働きます", kana: "はたらきます", meaning: "Làm việc" },
  { kanji: "休みます", kana: "やすみます", meaning: "Nghỉ ngơi" },
  { kanji: "勉強します", kana: "べんきょうします", meaning: "Học" },
  { kanji: "行きます", kana: "いきます", meaning: "Đi" },
  { kanji: "来ます", kana: "きます", meaning: "Đến" },
  { kanji: "帰ります", kana: "かえります", meaning: "Trở về" },
  { kanji: "食べます", kana: "たべます", meaning: "Ăn" },
  { kanji: "飲みます", kana: "のみます", meaning: "Uống" },
  { kanji: "見ます", kana: "みます", meaning: "Nhìn, xem" },
  { kanji: "聞きます", kana: "ききます", meaning: "Nghe, hỏi" },
  { kanji: "読みます", kana: "よみます", meaning: "Đọc" },
  { kanji: "書きます", kana: "かきます", meaning: "Viết" },
  { kanji: "買います", kana: "かいます", meaning: "Mua" },
  { kanji: "会います", kana: "あいます", meaning: "Gặp (bạn bè)" },
  { kanji: "あります", kana: "あります", meaning: "Có (đồ vật, sự việc)" },
  { kanji: "います", kana: "います", meaning: "Có, ở (người, động vật)" },
  { kanji: "遊びます", kana: "あそびます", meaning: "Chơi" },
  { kanji: "出かけます", kana: "でかけます", meaning: "Đi ra ngoài" },

  // --- TÍNH TỪ (Aい & Aな) ---
  { kanji: "大きい", kana: "おおきい", meaning: "To, lớn" },
  { kanji: "小さい", kana: "ちいさい", meaning: "Nhỏ, bé" },
  { kanji: "新しい", kana: "あたらしい", meaning: "Mới" },
  { kanji: "古い", kana: "ふるい", meaning: "Cũ" },
  { kanji: "いい", kana: "いい", meaning: "Tốt" },
  { kanji: "悪い", kana: "わるい", meaning: "Xấu, tồi" },
  { kanji: "暑い", kana: "あつい", meaning: "Nóng" },
  { kanji: "寒い", kana: "さむい", meaning: "Lạnh" },
  { kanji: "高い", kana: "たかい", meaning: "Cao, đắt" },
  { kanji: "安い", kana: "やすい", meaning: "Rẻ" },
  { kanji: "おいしい", kana: "おいしい", meaning: "Ngon" },
  { kanji: "忙しい", kana: "いそがしい", meaning: "Bận rộn" },
  { kanji: "楽しい", kana: "たのしい", meaning: "Vui vẻ" },
  { kanji: "難しい", kana: "むずかしい", meaning: "Khó" },
  { kanji: "広い", kana: "ひろい", meaning: "Rộng" },
  { kanji: "狭い", kana: "せまい", meaning: "Hẹp" },
  { kanji: "暇", kana: "ひま", meaning: "Rảnh rỗi (Aな)" },
  { kanji: "便利", kana: "べんり", meaning: "Tiện lợi (Aな)" },
  { kanji: "元気", kana: "げんき", meaning: "Khỏe mạnh (Aな)" },
  { kanji: "静か", kana: "しずか", meaning: "Yên tĩnh (Aな)" },
  { kanji: "にぎやか", kana: "にぎやか", meaning: "Náo nhiệt (Aな)" },
  { kanji: "有名", kana: "ゆうめい", meaning: "Nổi tiếng (Aな)" },
  { kanji: "きれい", kana: "きれい", meaning: "Sạch, đẹp (Aな)" },
  { kanji: "好き", kana: "すき", meaning: "Thích (Aな)" },
  { kanji: "嫌い", kana: "きらい", meaning: "Ghét (Aな)" },
  { kanji: "上手", kana: "じょうず", meaning: "Giỏi (Aな)" },
  { kanji: "下手", kana: "へた", meaning: "Kém (Aな)" },

  // --- TỪ ĐỂ HỎI & PHÓ TỪ ---
  { kanji: "何", kana: "なに / なん", meaning: "Cái gì" },
  { kanji: "どこ", kana: "どこ", meaning: "Ở đâu" },
  { kanji: "いつ", kana: "いつ", meaning: "Khi nào" },
  { kanji: "いくら", kana: "いくら", meaning: "Bao nhiêu tiền" },
  { kanji: "どんな", kana: "どんな", meaning: "Như thế nào" },
  { kanji: "とても", kana: "とても", meaning: "Rất" },
  { kanji: "あまり", kana: "あまり", meaning: "Không ~ lắm (đi với phủ định)" },
  { kanji: "全然", kana: "ぜんぜん", meaning: "Hoàn toàn không (đi với phủ định)" },
  { kanji: "いつも", kana: "いつも", meaning: "Lúc nào cũng" },
  { kanji: "ときどき", kana: "ときどき", meaning: "Thỉnh thoảng" },
  { kanji: "たくさん", kana: "たくさん", meaning: "Nhiều" },
  { kanji: "少し", kana: "すこし", meaning: "Một chút" },

  // --- ĐỘNG TỪ MỞ RỘNG (V ます) ---
  { kanji: "教えます", kana: "おしえます", meaning: "Dạy, cho biết" },
  { kanji: "習います", kana: "ならいます", meaning: "Học tập (có người dạy)" },
  { kanji: "貸します", kana: "かします", meaning: "Cho vay, cho mượn" },
  { kanji: "借ります", kana: "かりる", meaning: "Vay, mượn" },
  { kanji: "送ります", kana: "おくります", meaning: "Gửi (đồ, thư)" },
  { kanji: "切ります", kana: "きります", meaning: "Cắt" },
  { kanji: "あげます", kana: "あげます", meaning: "Tặng, cho" },
  { kanji: "もらいます", kana: "もらいます", meaning: "Nhận" },
  { kanji: "分かります", kana: "わかります", meaning: "Hiểu" },
  { kanji: "撮ります", kana: "とります", meaning: "Chụp (ảnh)" },
  { kanji: "作ります", kana: "つくりる", meaning: "Chế biến, làm, tạo ra" },
  { kanji: "使います", kana: "つかいます", meaning: "Sử dụng" },
  { kanji: "入ります", kana: "はいります", meaning: "Vào (phòng)" },
  { kanji: "出ます", kana: "でます", meaning: "Ra, rời khỏi" },
  { kanji: "泳ぎます", kana: "およぎます", meaning: "Bơi" },
  { kanji: "持ちます", kana: "もちます", meaning: "Cầm, nắm, mang theo" },
  { kanji: "待ちます", kana: "まちます", meaning: "Đợi, chờ" },
  { kanji: "呼びます", kana: "よびます", meaning: "Gọi (tên, taxi)" },
  { kanji: "急ぎます", kana: "いそぎます", meaning: "Vội vàng, gấp rút" },

  // --- TÍNH TỪ MÀU SẮC & TRẠNG THÁI ---
  { kanji: "赤い", kana: "あかい", meaning: "Màu đỏ" },
  { kanji: "青い", kana: "あおい", meaning: "Màu xanh" },
  { kanji: "白い", kana: "しろい", meaning: "Màu trắng" },
  { kanji: "黒い", kana: "くろい", meaning: "Màu đen" },
  { kanji: "黄色い", kana: "きいろい", meaning: "Màu vàng" },
  { kanji: "茶色い", kana: "ちゃいろい", meaning: "Màu nâu" },
  { kanji: "明るい", kana: "あかるい", meaning: "Sáng sủa" },
  { kanji: "暗い", kana: "くらい", meaning: "Tối tăm" },
  { kanji: "重い", kana: "おもい", meaning: "Nặng" },
  { kanji: "軽い", kana: "かるい", meaning: "Nhẹ" },
  { kanji: "近い", kana: "ちかい", meaning: "Gần" },
  { kanji: "遠い", kana: "とおい", meaning: "Xa" },
  { kanji: "速い", kana: "はやい", meaning: "Nhanh" },
  { kanji: "遅い", kana: "おそい", meaning: "Chậm, muộn" },
  { kanji: "親切", kana: "しんせつ", meaning: "Tử tế (Aな)" },
  { kanji: "大切", kana: "たいせつ", meaning: "Quan trọng (Aな)" },
  { kanji: "大変", kana: "たいへん", meaning: "Vất vả, kinh khủng (Aな)" },

  // --- VỊ TRÍ & PHƯƠNG HƯỚNG ---
  { kanji: "上", kana: "うえ", meaning: "Trên" },
  { kanji: "下", kana: "した", meaning: "Dưới" },
  { kanji: "前", kana: "まえ", meaning: "Trước" },
  { kanji: "後ろ", kana: "うしろ", meaning: "Sau" },
  { kanji: "右", kana: "みぎ", meaning: "Bên phải" },
  { kanji: "左", kana: "ひだり", meaning: "Bên trái" },
  { kanji: "中", kana: "なか", meaning: "Trong" },
  { kanji: "外", kana: "そと", meaning: "Ngoài" },
  { kanji: "隣", kana: "となり", meaning: "Bên cạnh (sát vách)" },
  { kanji: "近く", kana: "ちかく", meaning: "Ở gần" },
  { kanji: "間", kana: "あいだ", meaning: "Ở giữa" },
  { kanji: "北", kana: "きた", meaning: "Hướng Bắc" },
  { kanji: "南", kana: "みなみ", meaning: "Hướng Nam" },
  { kanji: "東", kana: "ひがし", meaning: "Hướng Đông" },
  { kanji: "西", kana: "にし", meaning: "Hướng Tây" },

  // --- ĐỒ VẬT GIA ĐÌNH & CÔNG NGHỆ ---
  { kanji: "携帯電話", kana: "けいたいでんわ", meaning: "Điện thoại di động" },
  { kanji: "パソコン", kana: "パソコン", meaning: "Máy tính cá nhân" },
  { kanji: "テレビ", kana: "テレビ", meaning: "Tivi" },
  { kanji: "ラジオ", kana: "ラジオ", meaning: "Đài radio" },
  { kanji: "カメラ", kana: "カメラ", meaning: "Máy ảnh" },
  { kanji: "冷蔵庫", kana: "れいぞうこ", meaning: "Tủ lạnh" },
  { kanji: "机", kana: "つくえ", meaning: "Cái bàn" },
  { kanji: "窓", kana: "まど", meaning: "Cửa sổ" },
  { kanji: "ドア", kana: "ドア", meaning: "Cửa ra vào" },
  { kanji: "荷物", kana: "にもつ", meaning: "Hành lý" },
  { kanji: "手紙", kana: "てがみ", meaning: "Bức thư" },
  { kanji: "切手", kana: "きって", meaning: "Tem" },

  // --- SỐ ĐẾM & ĐƠN VỊ ---
  { kanji: "一つ", kana: "ひとつ", meaning: "1 cái (vật chung)" },
  { kanji: "二つ", kana: "ふたつ", meaning: "2 cái" },
  { kanji: "三つ", kana: "みっつ", meaning: "3 cái" },
  { kanji: "四つ", kana: "よっつ", meaning: "4 cái" },
  { kanji: "五つ", kana: "いつつ", meaning: "5 cái" },
  { kanji: "六つ", kana: "むっつ", meaning: "6 cái" },
  { kanji: "七つ", kana: "ななつ", meaning: "7 cái" },
  { kanji: "八つ", kana: "やっつ", meaning: "8 cái" },
  { kanji: "九つ", kana: "ここのつ", meaning: "9 cái" },
  { kanji: "十", kana: "とお", meaning: "10 cái" },
  { kanji: "一人", kana: "ひとり", meaning: "1 người" },
  { kanji: "二人", kana: "ふたり", meaning: "2 người" },
  { kanji: "台", kana: "だい", meaning: "Máy móc (đơn vị đếm)" },
  { kanji: "枚", kana: "まい", meaning: "Tờ, tờ giấy (đơn vị đếm)" },

  // --- CƠ THỂ & SỨC KHỎE ---
  { kanji: "体", kana: "からだ", meaning: "Cơ thể" },
  { kanji: "頭", kana: "あたま", meaning: "Đầu" },
  { kanji: "髪", kana: "かみ", meaning: "Tóc" },
  { kanji: "顔", kana: "かお", meaning: "Khuôn mặt" },
  { kanji: "目", kana: "め", meaning: "Mắt" },
  { kanji: "耳", kana: "みみ", meaning: "Tai" },
  { kanji: "口", kana: "くち", meaning: "Miệng" },
  { kanji: "鼻", kana: "はな", meaning: "Mũi" },
  { kanji: "手", kana: "て", meaning: "Tay" },
  { kanji: "足", kana: "あし", meaning: "Chân" },
  { kanji: "お腹", kana: "おなか", meaning: "Bụng" },
  { kanji: "歯", kana: "は", meaning: "Răng" },
  { kanji: "病気", kana: "びょうき", meaning: "Bệnh tật, ốm" },
  { kanji: "風邪", kana: "かぜ", meaning: "Cảm cúm" },
  { kanji: "熱", kana: "ねつ", meaning: "Sốt" },
  { kanji: "薬", kana: "くすり", meaning: "Thuốc" },

  // --- GIẢI TRÍ & SỞ THÍCH ---
  { kanji: "音楽", kana: "おんがく", meaning: "Âm nhạc" },
  { kanji: "歌", kana: "うた", meaning: "Bài hát" },
  { kanji: "映画", kana: "えいが", meaning: "Phim ảnh" },
  { kanji: "写真", kana: "しゃしん", meaning: "Ảnh, bức ảnh" },
  { kanji: "本", kana: "ほん", meaning: "Sách" },
  { kanji: "雑誌", kana: "ざっし", meaning: "Tạp chí" },
  { kanji: "スポーツ", kana: "スポーツ", meaning: "Thể thao" },
  { kanji: "テニス", kana: "テニス", meaning: "Tennis" },
  { kanji: "サッカー", kana: "サッカー", meaning: "Bóng đá" },
  { kanji: "旅行", kana: "りょこう", meaning: "Du lịch" },
  { kanji: "お土産", kana: "おみやげ", meaning: "Quà lưu niệm" },
  { kanji: "宿題", kana: "しゅくだい", meaning: "Bài tập về nhà" },
  { kanji: "試験", kana: "しけん", meaning: "Kỳ thi" },

  // --- ĐỘNG TỪ TRẠNG THÁI & DI CHUYỂN ---
  { kanji: "登ります", kana: "のぼります", meaning: "Leo (núi)" },
  { kanji: "泊まります", kana: "とまります", meaning: "Trọ lại (khách sạn)" },
  { kanji: "掃除します", kana: "そうじします", meaning: "Dọn vệ sinh" },
  { kanji: "洗濯します", kana: "せんたくします", meaning: "Giặt giũ" },
  { kanji: "練習します", kana: "れんしゅうします", meaning: "Luyện tập" },
  { kanji: "成ります", kana: "なります", meaning: "Trở nên, trở thành" },
  { kanji: "要ります", kana: "いります", meaning: "Cần" },
  { kanji: "調べます", kana: "しらべます", meaning: "Tìm hiểu, điều tra" },
  { kanji: "直します", kana: "なおします", meaning: "Sửa chữa" },
  { kanji: "思い出します", kana: "おもいだします", meaning: "Nhớ lại, hồi tưởng" },
  { kanji: "座ります", kana: "すわります", meaning: "Ngồi" },
  { kanji: "立ちます", kana: "たちます", meaning: "Đứng" },
  { kanji: "置きます", kana: "おきます", meaning: "Đặt, để" },

  // --- THỜI TIẾT & TỰ NHIÊN ---
  { kanji: "天気", kana: "てんき", meaning: "Thời tiết" },
  { kanji: "雨", kana: "あめ", meaning: "Mưa" },
  { kanji: "雪", kana: "ゆき", meaning: "Tuyết" },
  { kanji: "晴れ", kana: "はれ", meaning: "Nắng, trời quang" },
  { kanji: "曇り", kana: "くもり", meaning: "Mây, trời âm u" },
  { kanji: "空", kana: "そら", meaning: "Bầu trời" },
  { kanji: "海", kana: "うみ", meaning: "Biển" },
  { kanji: "山", kana: "やま", meaning: "Núi" },
  { kanji: "川", kana: "かわ", meaning: "Sông" },
  { kanji: "花", kana: "はな", meaning: "Hoa" },

  // --- PHÓ TỪ & TỪ NỐI QUAN TRỌNG ---
  { kanji: "一番", kana: "いちばん", meaning: "Nhất, số 1" },
  { kanji: "初めて", kana: "はじめて", meaning: "Lần đầu tiên" },
  { kanji: "また", kana: "また", meaning: "Lại, hẹn gặp lại" },
  { kanji: "もう", kana: "もう", meaning: "Đã, rồi" },
  { kanji: "まだ", kana: "まだ", meaning: "Chưa" },
  { kanji: "これから", kana: "これから", meaning: "Từ bây giờ" },
  { kanji: "ずっと", kana: "ずっと", meaning: "Suốt, hơn hẳn" },
  { kanji: "ゆっくり", kana: "ゆっくり", meaning: "Chậm rãi, thong thả" },
  { kanji: "すぐ", kana: "すぐ", meaning: "Ngay lập tức" },
  { kanji: "だいたい", kana: "だいたい", meaning: "Đại khái, khoảng" },
  { kanji: "たくさん", kana: "たくさん", meaning: "Nhiều" },
  { kanji: "本当に", kana: "ほんとうに", meaning: "Thật sự" },
  { kanji: "しかし", kana: "しかし", meaning: "Nhưng (lịch sự)" },
  { kanji: "だから", kana: "だから", meaning: "Vì thế" },

  // --- TÂM TRẠNG & CẢM XÚC ---
  { kanji: "嬉しい", kana: "うれしい", meaning: "Vui mừng" },
  { kanji: "寂しい", kana: "さびしい", meaning: "Buồn, cô đơn" },
  { kanji: "恥ずかしい", kana: "はずかしい", meaning: "Xấu hổ, ngượng ngùng" },
  { kanji: "驚きます", kana: "おどろきます", meaning: "Ngạc nhiên" },
  { kanji: "困ります", kana: "こまります", meaning: "Khó khăn, rắc rối" },
  { kanji: "安心します", kana: "あんしんします", meaning: "Yên tâm" },
  { kanji: "心配します", kana: "しんぱいします", meaning: "Lo lắng" },
  { kanji: "がっかりします", kana: "がっかりします", meaning: "Thất vọng" },

  // --- PHÓ TỪ CHỈ MỨC ĐỘ & TÌNH TRẠNG ---
  { kanji: "多分", kana: "たぶん", meaning: "Có lẽ, chắc là" },
  { kanji: "きっと", kana: "きっと", meaning: "Nhất định" },
  { kanji: "もし", kana: "もし", meaning: "Nếu" },
  { kanji: "いくら", kana: "いくら", meaning: "Mặc dù ~ bao nhiêu đi nữa" },
  { kanji: "ずっと", kana: "ずっと", meaning: "Suốt, hơn hẳn" },
  { kanji: "はっきり", kana: "はっきり", meaning: "Rõ ràng" },
  { kanji: "ほとんど", kana: "ほとんど", meaning: "Hầu hết, hầu như" },
  { kanji: "だいたい", kana: "だいたい", meaning: "Đại khái, khoảng" },

  // --- ĐỒ VẬT VĂN PHÒNG & NHÀ Ở ---
  { kanji: "封筒", kana: "ふうとう", meaning: "Phong bì" },
  { kanji: "書類", kana: "しょるい", meaning: "Giấy tờ, tài liệu" },
  { kanji: "資料", kana: "しりょう", meaning: "Tài liệu, dữ liệu" },
  { kanji: "机", kana: "つくえ", meaning: "Cái bàn" },
  { kanji: "引き出し", kana: "ひきだし", meaning: "Ngăn kéo" },
  { kanji: "カレンダー", kana: "カレンダー", meaning: "Lịch" },
  { kanji: "ポスター", kana: "ポスター", meaning: "Áp phích" },
  { kanji: "ゴミ箱", kana: "ごみばこ", meaning: "Thùng rác" },
  { kanji: "鏡", kana: "かがみ", meaning: "Cái gương" },
  { kanji: "階段", kana: "かいだん", meaning: "Cầu thang" },
  { kanji: "電気", kana: "でんき", meaning: "Điện, đèn điện" },
  { kanji: "エアコン", kana: "エアコン", meaning: "Máy điều hòa" },

  // --- ĐỘNG TỪ TRẠNG THÁI NÂNG CAO ---
  { kanji: "飾ります", kana: "かざります", meaning: "Trang trí" },
  { kanji: "並べます", kana: "ならべます", meaning: "Xếp thành hàng" },
  { kanji: "植えます", kana: "うええます", meaning: "Trồng (cây)" },
  { kanji: "戻します", kana: "もどします", meaning: "Đưa về, để lại vị trí cũ" },
  { kanji: "まとめます", kana: "まとめます", meaning: "Tóm tắt, thu dọn" },
  { kanji: "片付けます", kana: "かたづけます", meaning: "Dọn dẹp" },
  { kanji: "決まります", kana: "きまります", meaning: "Được quyết định" },
  { kanji: "知らせます", kana: "しらせます", meaning: "Thông báo, cho biết" },

  // --- TỪ VỰNG KHÁC (SỰ KIỆN) ---
  { kanji: "講義", kana: "こうぎ", meaning: "Bài giảng" },
  { kanji: "ミーティング", kana: "ミーティング", meaning: "Cuộc họp" },
  { kanji: "予定", kana: "よてい", meaning: "Dự định, kế hoạch" },
  { kanji: "お知らせ", kana: "おしらせ", meaning: "Thông báo" },
  { kanji: "案内書", kana: "あんないしょ", meaning: "Sách hướng dẫn" },

  // --- THIÊN NHIÊN & ĐỘNG VẬT ---
  { kanji: "世界", kana: "せかい", meaning: "Thế giới" },
  { kanji: "空気", kana: "くうき", meaning: "Không khí" },
  { kanji: "海", kana: "うみ", meaning: "Biển" },
  { kanji: "島", kana: "しま", meaning: "Đảo" },
  { kanji: "森", kana: "もり", meaning: "Rừng" },
  { kanji: "林", kana: "はやし", meaning: "Rừng thưa, lùm cây" },
  { kanji: "犬", kana: "いぬ", meaning: "Con chó" },
  { kanji: "猫", kana: "ねこ", meaning: "Con mèo" },
  { kanji: "象", kana: "ぞう", meaning: "Con voi" },
  { kanji: "馬", kana: "うま", meaning: "Con ngựa" },

  // --- GIAO THÔNG & DI CHUYỂN ---
  { kanji: "飛行機", kana: "ひこうき", meaning: "Máy bay" },
  { kanji: "船", kana: "ふね", meaning: "Thuyền, tàu thủy" },
  { kanji: "タクシー", kana: "タクシー", meaning: "Taxi" },
  { kanji: "バス停", kana: "バスてい", meaning: "Điểm dừng xe buýt" },
  { kanji: "駐車場", kana: "ちゅうしゃじょう", meaning: "Bãi đỗ xe" },
  { kanji: "交差点", kana: "こうさてん", meaning: "Ngã tư" },
  { kanji: "信号", kana: "しんごう", meaning: "Đèn giao thông" },
  { kanji: "角", kana: "かど", meaning: "Góc đường" },
  { kanji: "道", kana: "みち", meaning: "Con đường" },
  { kanji: "橋", kana: "はし", meaning: "Cây cầu" },

  // --- ĐỊA ĐIỂM CÔNG CỘNG & KIẾN TRÚC ---
  { kanji: "神社", kana: "じんじゃ", meaning: "Đền thờ thần đạo" },
  { kanji: "お寺", kana: "おてら", meaning: "Chùa" },
  { kanji: "ビル", kana: "ビル", meaning: "Tòa nhà" },
  { kanji: "工場", kana: "こうじょう", meaning: "Nhà máy" },
  { kanji: "ガソリンスタンド", kana: "ガソリンスタンド", meaning: "Trạm xăng" },

  // --- ĐỘNG TỪ GIAO TIẾP & ĐỜI SỐNG ---
  { kanji: "話します", kana: "はなします", meaning: "Nói chuyện, thảo luận" },
  { kanji: "伝えます", kana: "つたえます", meaning: "Truyền đạt, nhắn lại" },
  { kanji: "手伝います", kana: "てつだいます", meaning: "Giúp đỡ" },
  { kanji: "呼びます", kana: "よびます", meaning: "Gọi, mời" },
  { kanji: "見せます", kana: "みせます", meaning: "Cho xem" },
  { kanji: "覚えます", kana: "おぼえます", meaning: "Ghi nhớ" },
  { kanji: "忘れます", kana: "わすれます", meaning: "Quên" },
  { kanji: "失くします", kana: "なくします", meaning: "Làm mất" },
  { kanji: "払います", kana: "はらいます", meaning: "Thanh toán, trả tiền" },
  { kanji: "脱ぎます", kana: "ぬぎます", meaning: "Cởi (quần áo, giày)" },

  // --- CÁC CỤM TỪ GIAO TIẾP (PHRASES) ---
  { kanji: "お大事に", kana: "おだいじに", meaning: "Chúc bạn mau khỏe" },
  { kanji: "お疲れ様", kana: "おつかれさま", meaning: "Bạn đã vất vả rồi" },
  { kanji: "失礼します", kana: "しつれいします", meaning: "Tôi xin phép (vào phòng/về trước)" },
  { kanji: "いらっしゃいませ", kana: "いらっしゃいませ", meaning: "Chào mừng quý khách" },
  { kanji: "おかげさまで", kana: "おかげさまで", meaning: "Nhờ ơn trời/nhờ bạn giúp đỡ" },

  // --- TỪ GHÉP HÁN TỰ (KANJI COMPOUNDS) ---
  { kanji: "外国人", kana: "がいこくじん", meaning: "Người nước ngoài" },
  { kanji: "留学生", kana: "りゅうがくせい", meaning: "Du học sinh" },
  { kanji: "地下鉄", kana: "ちかてつ", meaning: "Tàu điện ngầm" },
  { kanji: "新幹線", kana: "しんかんせん", meaning: "Tàu cao tốc Shinkansen" },
  { kanji: "図書館", kana: "としょかん", meaning: "Thư viện" },
  { kanji: "映画館", kana: "えいがかん", meaning: "Rạp chiếu phim" },
  { kanji: "大使館", kana: "たいしかん", meaning: "Đại sứ quán" },
  { kanji: "郵便局", kana: "ゆうびんきょく", meaning: "Bưu điện" },
  { kanji: "市役所", kana: "しやくしょ", meaning: "Tòa thị chính" },
  { kanji: "銀行員", kana: "ぎんこういん", meaning: "Nhân viên ngân hàng" },
  { kanji: "研修生", kana: "けんしゅうせい", meaning: "Thực tập sinh" },

  // --- TRẠNG THÁI & TÍNH CHẤT NÂNG CAO ---
  { kanji: "安全", kana: "あんぜん", meaning: "An toàn (Aな)" },
  { kanji: "危険", kana: "きけん", meaning: "Nguy hiểm (Aな)" },
  { kanji: "不便", kana: "ふべん", meaning: "Bất tiện (Aな)" },
  { kanji: "十分", kana: "じゅうぶん", meaning: "Đầy đủ" },
  { kanji: "下手", kana: "へた", meaning: "Kém, dở (Aな)" },
  { kanji: "上手", kana: "じょうず", meaning: "Giỏi (Aな)" },
  { kanji: "苦手", kana: "にがて", meaning: "Kém, yếu / Không thích lắm" },

  // --- THỜI GIAN & ĐƠN VỊ CHI TIẾT ---
  { kanji: "一箇月", kana: "いっかげつ", meaning: "1 tháng (khoảng thời gian)" },
  { kanji: "一週間", kana: "いっしゅうかん", meaning: "1 tuần (khoảng thời gian)" },
  { kanji: "一晩中", kana: "ひとばんじゅう", meaning: "Suốt cả đêm" },
  { kanji: "時間通り", kana: "じかんどおり", meaning: "Đúng giờ" },
  { kanji: "再来年", kana: "さらいねん", meaning: "Năm sau nữa" },
  { kanji: "再来週", kana: "さらいしゅう", meaning: "Tuần sau nữa" },

  // --- CÁC DANH TỪ KHÁC TRONG SÁCH KANJI ---
  { kanji: "電気", kana: "でんき", meaning: "Điện, đèn" },
  { kanji: "電話", kana: "でんわ", meaning: "Điện thoại" },
  { kanji: "電車", kana: "でんしゃ", meaning: "Tàu điện" },
  { kanji: "自動車", kana: "じどうしゃ", meaning: "Xe ô tô (tự động xa)" },
  { kanji: "自転車", kana: "じてんしゃ", meaning: "Xe đạp" },
  { kanji: "料理", kana: "りょうり", meaning: "Món ăn, nấu ăn" },
  { kanji: "地図", kana: "ちず", meaning: "Bản đồ" },
  { kanji: "作文", kana: "さくぶん", meaning: "Đoạn văn, bài văn" },
  { kanji: "説明書", kana: "せつめいしょ", meaning: "Sách hướng dẫn" },
  { kanji: "教科書", kana: "きょうかしょ", meaning: "Sách giáo khoa" },
  { kanji: "漢字", kana: "かんじ", meaning: "Hán tự" },
  { kanji: "名字", kana: "みょうじ", meaning: "Họ (tên)" },

  // --- CỤM TỪ ĐỘNG TỪ GHÉP ---
  { kanji: "買い物します", kana: "かいものします", meaning: "Đi mua sắm" },
  { kanji: "見学します", kana: "けんがくします", meaning: "Tham quan học tập" },
  { kanji: "質問します", kana: "しつもんします", meaning: "Đặt câu hỏi" },
  { kanji: "練習します", kana: "れんしゅうします", meaning: "Luyện tập" },
  { kanji: "復習します", kana: "ふくしゅうします", meaning: "Ôn tập" },
  { kanji: "予習します", kana: "よしゅうします", meaning: "Chuẩn bị bài mới" },

  // --- MÀU SẮC & HÌNH DÁNG ---
  { kanji: "赤", kana: "あか", meaning: "Màu đỏ (danh từ)" },
  { kanji: "青", kana: "あお", meaning: "Màu xanh (danh từ)" },
  { kanji: "白", kana: "しろ", meaning: "Màu trắng (danh từ)" },
  { kanji: "黒", kana: "くろ", meaning: "Màu đen (danh từ)" },
  { kanji: "色", kana: "いろ", meaning: "Màu sắc" },
  { kanji: "色々", kana: "いろいろ", meaning: "Nhiều loại, phong phú (Aな)" },
  { kanji: "丸い", kana: "まるい", meaning: "Tròn" },

  // --- ĐỘNG VẬT & TỰ NHIÊN ---
  { kanji: "鳥", kana: "とり", meaning: "Con chim" },
  { kanji: "肉", kana: "にく", meaning: "Thịt" },
  { kanji: "牛肉", kana: "ぎゅうにく", meaning: "Thịt bò" },
  { kanji: "豚肉", kana: "ぶたにく", meaning: "Thịt lợn" },
  { kanji: "鶏肉", kana: "とりにく", meaning: "Thịt gà" },
  { kanji: "虫", kana: "むし", meaning: "Côn trùng" },
  { kanji: "風", kana: "かぜ", meaning: "Gió" },

  // --- ĐỘNG TỪ NHÓM 2 & ĐỘNG TỪ ĐẶC BIỆT ---
  { kanji: "降ります", kana: "ふります", meaning: "Rơi (mưa, tuyết)" },
  { kanji: "掃除します", kana: "そうじします", meaning: "Dọn dẹp vệ sinh" },
  { kanji: "洗濯します", kana: "せんたくします", meaning: "Giặt giũ" },
  { kanji: "練習します", kana: "れんしゅうします", meaning: "Luyện tập" },
  { kanji: "登ります", kana: "のぼります", meaning: "Leo (núi)" },
  { kanji: "泊まります", kana: "とまります", meaning: "Trọ lại, ở lại (khách sạn)" },
  { kanji: "成ります", kana: "なります", meaning: "Trở nên, trở thành" },

  // --- THỜI GIAN & TẦN SUẤT CHI TIẾT ---
  { kanji: "今夜", kana: "こんや", meaning: "Tối nay" },
  { kanji: "今週", kana: "こんしゅう", meaning: "Tuần này" },
  { kanji: "来週", kana: "らいしゅう", meaning: "Tuần sau" },
  { kanji: "先週", kana: "せんしゅう", meaning: "Tuần trước" },
  { kanji: "今月", kana: "こんげつ", meaning: "Tháng này" },
  { kanji: "来月", kana: "らいげつ", meaning: "Tháng sau" },
  { kanji: "先月", kana: "せんげtう", meaning: "Tháng trước" },
  { kanji: "再来年", kana: "さらいねん", meaning: "Năm sau nữa" },
  { kanji: "毎年", kana: "まいねん / まいとし", meaning: "Hàng năm" },

  // --- CÁC DANH TỪ TRONG ĐỜI SỐNG HẰNG NGÀY ---
  { kanji: "洗濯物", kana: "せんたくもの", meaning: "Đồ giặt" },
  { kanji: "掃除機", kana: "そうじき", meaning: "Máy hút bụi" },
  { kanji: "お風呂", kana: "おふろ", meaning: "Bồn tắm" },
  { kanji: "石鹸", kana: "せっけん", meaning: "Xà phòng" },
  { kanji: "タオル", kana: "タオル", meaning: "Khăn tắm" },
  { kanji: "シャワー", kana: "シャワー", meaning: "Vòi hoa sen" },

  // --- TỪ VỰNG CHỈ TRẠNG THÁI ---
  { kanji: "強い", kana: "つよい", meaning: "Mạnh" },
  { kanji: "弱い", kana: "よわい", meaning: "Yếu" },
  { kanji: "悪い", kana: "わるい", meaning: "Xấu, tồi" },
  { kanji: "調子", kana: "ちょうし", meaning: "Tình trạng (sức khỏe, máy móc)" },

  // --- CÔNG VIỆC & VĂN PHÒNG ---
  { kanji: "仕事", kana: "しごと", meaning: "Công việc" },
  { kanji: "会議", kana: "かいぎ", meaning: "Cuộc họp" },
  { kanji: "場所", kana: "ばしょ", meaning: "Địa điểm" },
  { kanji: "工場", kana: "こうじょう", meaning: "Nhà máy" },
  { kanji: "事務所", kana: "じむしょ", meaning: "Văn phòng" },
  { kanji: "受付け", kana: "うけつけ", meaning: "Quầy lễ tân" },
  { kanji: "名刺", kana: "めいし", meaning: "Danh thiếp" },
  { kanji: "手帳", kana: "てちょう", meaning: "Sổ tay" },
  { kanji: "辞書", kana: "じしょ", meaning: "Từ điển" },

  // --- TRẠNG THÁI VẬT LÝ & TÍNH CHẤT ---
  { kanji: "熱い", kana: "あつい", meaning: "Nóng (vật thể/cảm giác)" },
  { kanji: "冷たい", kana: "つめたい", meaning: "Lạnh (vật thể/cảm giác)" },
  { kanji: "甘い", kana: "あまい", meaning: "Ngọt" },
  { kanji: "辛い", kana: "からい", meaning: "Cay" },
  { kanji: "苦い", kana: "にがい", meaning: "Đắng" },
  { kanji: "塩辛い", kana: "しおからい", meaning: "Mặn" },
  { kanji: "酸っぱい", kana: "すっぱい", meaning: "Chua" },
  { kanji: "柔らかい", kana: "やわらかい", meaning: "Mềm" },
  { kanji: "硬い", kana: "かたい", meaning: "Cứng" },

  // --- MÁY MÓC & KỸ THUẬT CƠ BẢN ---
  { kanji: "機械", kana: "きかい", meaning: "Máy móc" },
  { kanji: "故障", kana: "こしょう", meaning: "Hỏng hóc, lỗi" },
  { kanji: "道具", kana: "どうぐ", meaning: "Dụng cụ" },
  { kanji: "ボタン", kana: "ボタン", meaning: "Nút bấm" },
  { kanji: "スイッチ", kana: "スイッチ", meaning: "Công tắc" },
  { kanji: "画面", kana: "がめん", meaning: "Màn hình" },
  { kanji: "操作", kana: "そうさ", meaning: "Thao tác, vận hành" },

  // --- PHÓ TỪ & TỪ HÀNH ĐỘNG KHÁC ---
  { kanji: "多分", kana: "たぶん", meaning: "Có lẽ" },
  { kanji: "きっと", kana: "きっと", meaning: "Chắc chắn" },
  { kanji: "絶対", kana: "ぜったい", meaning: "Tuyệt đối" },
  { kanji: "本当に", kana: "ほんとうに", meaning: "Thật lòng, thực sự" },
  { kanji: "急に", kana: "きゅうに", meaning: "Đột ngột" },
  { kanji: "特に", kana: "とくに", meaning: "Đặc biệt là" },
  { kanji: "一生懸命", kana: "いっしょうけんめい", meaning: "Cố gắng hết sức" },

  // --- ĐỘNG TỪ CHỈ SỰ BIẾN ĐỔI ---
  { kanji: "変わります", kana: "かわります", meaning: "Thay đổi" },
  { kanji: "故障します", kana: "こしょうします", meaning: "Bị hỏng" },
  { kanji: "準備します", kana: "じゅんびします", meaning: "Chuẩn bị" },
  { kanji: "出席します", kana: "しゅっせきします", meaning: "Có mặt, tham dự" },
  { kanji: "連絡します", kana: "れんらくします", meaning: "Liên lạc" },

  // --- SỨC KHỎE & BỆNH VIỆN ---
  { kanji: "病院", kana: "びょういん", meaning: "Bệnh viện" },
  { kanji: "病気", kana: "びょうき", meaning: "Bệnh, ốm" },
  { kanji: "医者", kana: "いしゃ", meaning: "Bác sĩ" },
  { kanji: "薬", kana: "くすり", meaning: "Thuốc" },
  { kanji: "熱", kana: "ねつ", meaning: "Sốt" },
  { kanji: "咳", kana: "せき", meaning: "Ho" },
  { kanji: "保険証", kana: "ほけんしょう", meaning: "Thẻ bảo hiểm" },
  { kanji: "診察", kana: "しんさつ", meaning: "Khám bệnh" },

  // --- SỞ THÍCH & NGHỆ THUẬT ---
  { kanji: "趣味", kana: "しゅみ", meaning: "Sở thích" },
  { kanji: "絵", kana: "え", meaning: "Bức tranh" },
  { kanji: "音楽", kana: "おんがく", meaning: "Âm nhạc" },
  { kanji: "ダンス", kana: "ダンス", meaning: "Nhảy múa, khiêu vũ" },
  { kanji: "歌", kana: "うた", meaning: "Bài hát" },
  { kanji: "ピアノ", kana: "ピアノ", meaning: "Đàn Piano" },
  { kanji: "映画", kana: "えいが", meaning: "Phim" },
  { kanji: "小説", kana: "しょうせつ", meaning: "Tiểu thuyết" },

  // --- DANH TỪ CHỈ KHÁI NIỆM & TRẠNG THÁI ---
  { kanji: "意味", kana: "いみ", meaning: "Ý nghĩa" },
  { kanji: "意見", kana: "いけん", meaning: "Ý kiến" },
  { kanji: "嘘", kana: "うそ", meaning: "Lời nói dối" },
  { kanji: "本当", kana: "ほんとう", meaning: "Sự thật" },
  { kanji: "習慣", kana: "しゅうかん", meaning: "Tập quán, thói quen" },
  { kanji: "経験", kana: "けいけん", meaning: "Kinh nghiệm" },
  { kanji: "理由", kana: "りゆう", meaning: "Lý do" },

  // --- ĐỘNG TỪ VỀ TƯ DUY & CẢM GIÁC ---
  { kanji: "思います", kana: "おもいます", meaning: "Nghĩ rằng" },
  { kanji: "言います", kana: "いいます", meaning: "Nói" },
  { kanji: "知っています", kana: "しっています", meaning: "Biết" },
  { kanji: "探します", kana: "さがします", meaning: "Tìm kiếm" },
  { kanji: "考えます", kana: "かんがえます", meaning: "Suy nghĩ, tư duy" },
  { kanji: "感じます", kana: "かんじます", meaning: "Cảm thấy" },

  // --- VỊ TRÍ & KHOẢNG CÁCH CHI TIẾT ---
  { kanji: "真ん中", kana: "まんなか", meaning: "Chính giữa" },
  { kanji: "隅", kana: "すみ", meaning: "Góc (bên trong)" },
  { kanji: "端", kana: "はし", meaning: "Rìa, mép" },
  { kanji: "そば", kana: "そば", meaning: "Bên cạnh, gần" },
  { kanji: "向こう", kana: "むこう", meaning: "Phía bên kia" },
  { kanji: "近く", kana: "ちかく", meaning: "Gần đây" },
  { kanji: "遠く", kana: "とおく", meaning: "Xa xôi" },

  // --- LIÊN TỪ & TỪ NỐI (CONJUNCTIONS) ---
  { kanji: "そして", kana: "そして", meaning: "Và, thêm nữa" },
  { kanji: "それから", kana: "それから", meaning: "Sau đó" },
  { kanji: "それで", kana: "それで", meaning: "Vì thế, do đó" },
  { kanji: "しかし", kana: "しかし", meaning: "Nhưng, tuy nhiên" },
  { kanji: "ですが", kana: "ですが", meaning: "Nhưng (dạng lịch sự)" },
  { kanji: "それでは", kana: "それでは", meaning: "Vậy thì, sau đây" },
  { kanji: "次に", kana: "つぎに", meaning: "Tiếp theo" },

  // --- ĐƠN VỊ ĐẾM CHI TIẾT (COUNTERS) ---
  { kanji: "歳", kana: "さい", meaning: "Tuổi" },
  { kanji: "回", kana: "かい", meaning: "Lần" },
  { kanji: "階", kana: "かい", meaning: "Tầng (nhà)" },
  { kanji: "冊", kana: "さつ", meaning: "Cuốn, quyển (sách)" },
  { kanji: "着", kana: "ちゃく", meaning: "Bộ (quần áo)" },
  { kanji: "個", kana: "こ", meaning: "Cái, quả (vật nhỏ)" },
  { kanji: "本", kana: "ほん / ぽん / ぼん", meaning: "Cái (vật dài như bút, chai)" },
  { kanji: "匹", kana: "ひき / ぴき / びき", meaning: "Con (động vật nhỏ)" },

  // --- CÔNG NGHỆ & ĐIỆN TỬ (PHỔ BIẾN TRONG KANJI N5) ---
  { kanji: "電子辞書", kana: "でんしじょ", meaning: "Từ điển điện tử" },
  { kanji: "電気屋", kana: "でんきや", meaning: "Cửa hàng đồ điện" },
  { kanji: "送り先", kana: "おくりさき", meaning: "Địa chỉ gửi đến" },
  { kanji: "注文", kana: "ちゅうもん", meaning: "Đặt hàng" },
  { kanji: "返信", kana: "へんしん", meaning: "Trả lời (tin nhắn/email)" },
  { kanji: "消します", kana: "けします", meaning: "Tắt (điện), xóa" },
  { kanji: "点けます", kana: "つけます", meaning: "Bật (điện)" },

  // --- THIÊN NHIÊN & ĐỊA DANH ---
  { kanji: "池", kana: "いけ", meaning: "Cái ao" },
  { kanji: "石", kana: "いし", meaning: "Hòn đá" },
  { kanji: "岩", kana: "いわ", meaning: "Tảng đá" },
  { kanji: "光", kana: "ひかり", meaning: "Ánh sáng" },
  { kanji: "星", kana: "ほし", meaning: "Ngôi sao" },
  { kanji: "正月", kana: "しょうがつ", meaning: "Ngày Tết" },

  // --- CỤM TỪ TRẠNG THÁI NÂNG CAO ---
  { kanji: "同じ", kana: "おなじ", meaning: "Giống nhau" },
  { kanji: "半分", kana: "はんぶん", meaning: "Một nửa" },
  { kanji: "全部", kana: "ぜんぶ", meaning: "Toàn bộ" },
  { kanji: "他に", kana: "ほかに", meaning: "Ngoài ra" },
  { kanji: "非常に", kana: "ひじょうに", meaning: "Rất, cực kỳ" },

  // --- GIAO TIẾP & ĐỜI SỐNG (KAISATSU) ---
  { kanji: "おめでとうございます", kana: "おめでとうございます", meaning: "Chúc mừng" },
  { kanji: "乾杯", kana: "かんぱい", meaning: "Cạn chén / Nâng ly" },
  { kanji: "お釣り", kana: "おつり", meaning: "Tiền thừa, tiền thối lại" },
  { kanji: "どうぞ", kana: "どうぞ", meaning: "Xin mời" },
  { kanji: "失礼します", kana: "しつれいします", meaning: "Tôi xin lỗi / Xin phép" },
  { kanji: "すみません", kana: "すみません", meaning: "Xin lỗi / Cho hỏi" },
  { kanji: "お願いします", kana: "おねがいします", meaning: "Làm ơn / Nhờ anh/chị" },
  { kanji: "いいですよ", kana: "いいですよ", meaning: "Được chứ / Được ạ" },

  // --- GIA ĐÌNH (GỌI NGƯỜI KHÁC - LỊCH SỰ) ---
  { kanji: "ご家族", kana: "ごかぞく", meaning: "Gia đình (người khác)" },
  { kanji: "お父さん", kana: "おとうさん", meaning: "Bố (người khác)" },
  { kanji: "お母さん", kana: "おかあさん", meaning: "Mẹ (người khác)" },
  { kanji: "お兄さん", kana: "おにいさん", meaning: "Anh trai (người khác)" },
  { kanji: "お姉さん", kana: "おねえさん", meaning: "Chị gái (người khác)" },
  { kanji: "弟さん", kana: "おとうとさん", meaning: "Em trai (người khác)" },
  { kanji: "妹さん", kana: "いもうとさん", meaning: "Em gái (người khác)" },
  { kanji: "奥さん", kana: "おくさん", meaning: "Vợ (người khác)" },
  { kanji: "ご主人", kana: "ごしゅじん", meaning: "Chồng (người khác)" },
  { kanji: "お子さん", kana: "おこさん", meaning: "Con cái (người khác)" },

  // --- VỊ TRÍ & PHƯƠNG HƯỚNG BỔ SUNG ---
  { kanji: "こちら", kana: "こちら", meaning: "Phía này / Đây (lịch sự)" },
  { kanji: "あちら", kana: "あちら", meaning: "Phía kia / Đó (lịch sự)" },
  { kanji: "そちら", kana: "そちら", meaning: "Phía đó (lịch sự)" },
  { kanji: "どちら", kana: "どちら", meaning: "Phía nào / Đâu (lịch sự)" },
  { kanji: "近く", kana: "ちかく", meaning: "Ở gần" },
  { kanji: "遠く", kana: "とおく", meaning: "Ở xa" },

  // --- CÁC DANH TỪ KANJI CUỐI SÁCH ---
  { kanji: "理由", kana: "りゆう", meaning: "Lý do" },
  { kanji: "目的", kana: "もくてき", meaning: "Mục đích" },
  { kanji: "方法", kana: "ほうほう", meaning: "Phương pháp" },
  { kanji: "半分", kana: "はんぶん", meaning: "Một nửa" },
  { kanji: "正月", kana: "しょうがつ", meaning: "Ngày Tết" },
  { kanji: "神社", kana: "じんじゃ", meaning: "Đền thờ" },
  { kanji: "お寺", kana: "おてら", meaning: "Chùa" },
  { kanji: "道具", kana: "どうぐ", meaning: "Dụng cụ" },
  { kanji: "場所", kana: "ばしょ", meaning: "Địa điểm" },
  { kanji: "最近", kana: "さいきん", meaning: "Gần đây" },
  { kanji: "最後", kana: "さいご", meaning: "Cuối cùng" },
  { kanji: "最初", kana: "さいしょ", meaning: "Đầu tiên" },

  // --- RAU CỦ & ĐỒ ĂN CHI TIẾT ---
  { kanji: "野菜", kana: "やさい", meaning: "Rau" },
  { kanji: "砂糖", kana: "さとう", meaning: "Đường" },
  { kanji: "塩", kana: "しお", meaning: "Muối" },
  { kanji: "醤油", kana: "しょうゆ", meaning: "Xì dầu (nước tương)" },
  { kanji: "食べ物", kana: "たべもの", meaning: "Đồ ăn" },
  { kanji: "飲み物", kana: "のみもの", meaning: "Đồ uống" },
  { kanji: "紅茶", kana: "こうちゃ", meaning: "Trà đen (hồng trà)" },
  { kanji: "喫茶店", kana: "きっさてん", meaning: "Quán cà phê" },

  // --- ĐỘNG VẬT & CÔN TRÙNG (BỔ SUNG) ---
  { kanji: "動物", kana: "どうぶつ", meaning: "Động vật" },
  { kanji: "豚", kana: "ぶた", meaning: "Con lợn" },
  { kanji: "牛", kana: "うし", meaning: "Con bò" },
  { kanji: "魚", kana: "さかな", meaning: "Con cá" },
  { kanji: "卵", kana: "たまご", meaning: "Trứng" },

  // --- ĐỒ VẬT TRONG NHÀ & TRANG PHỤC (CHI TIẾT) ---
  { kanji: "電気", kana: "でんき", meaning: "Điện, đèn điện" },
  { kanji: "冷蔵庫", kana: "れいぞうこ", meaning: "Tủ lạnh" },
  { kanji: "洗濯機", kana: "せんたくき", meaning: "Máy giặt" },
  { kanji: "掃除機", kana: "そうじき", meaning: "Máy hút bụi" },
  { kanji: "棚", kana: "たな", meaning: "Cái giá, kệ" },
  { kanji: "箱", kana: "はこ", meaning: "Cái hộp" },
  { kanji: "眼鏡", kana: "めがね", meaning: "Kính mắt" },
  { kanji: "指輪", kana: "ゆびわ", meaning: "Nhẫn" },

  // --- CÁC DANH TỪ TRỪU TƯỢNG & KHÁC ---
  { kanji: "半分", kana: "はんぶん", meaning: "Một nửa" },
  { kanji: "全部", kana: "ぜんぶ", meaning: "Toàn bộ" },
  { kanji: "火事", kana: "かじ", meaning: "Hỏa hoạn" },
  { kanji: "地震", kana: "じしん", meaning: "Động đất" },
  { kanji: "事故", kana: "じこ", meaning: "Tai nạn" },
  { kanji: "予定", kana: "よてい", meaning: "Dự định" },
  { kanji: "約束", kana: "やくそく", meaning: "Lời hứa, cuộc hẹn" },
  { kanji: "用事", kana: "ようじ", meaning: "Việc bận" },

  // --- TÍNH TỪ & PHÓ TỪ BỔ SUNG ---
  { kanji: "危ない", kana: "あぶない", meaning: "Nguy hiểm" },
  { kanji: "薄い", kana: "うすい", meaning: "Mỏng, nhạt" },
  { kanji: "厚い", kana: "あつい", meaning: "Dày" },
  { kanji: "太い", kana: "ふとい", meaning: "Béo, mập, dày" },
  { kanji: "細い", kana: "ほそい", meaning: "Gầy, mảnh" },
  { kanji: "大体", kana: "だいたい", meaning: "Đại khái" },
  { kanji: "随分", kana: "ずいぶん", meaning: "Khá là, tương đối" },
  { kanji: "大抵", kana: "たいてい", meaning: "Thường, đại để" },

  // --- THỜI GIAN CHI TIẾT (NGÀY TRONG THÁNG) ---
  { kanji: "一日", kana: "ついたち", meaning: "Ngày mồng 1" },
  { kanji: "二日", kana: "ふつか", meaning: "Ngày mồng 2" },
  { kanji: "三日", kana: "みっか", meaning: "Ngày mồng 3" },
  { kanji: "四日", kana: "よっか", meaning: "Ngày mồng 4" },
  { kanji: "五日", kana: "いつか", meaning: "Ngày mồng 5" },
  { kanji: "六日", kana: "むいか", meaning: "Ngày mồng 6" },
  { kanji: "七日", kana: "なのか", meaning: "Ngày mồng 7" },
  { kanji: "八日", kana: "ようか", meaning: "Ngày mồng 8" },
  { kanji: "九日", kana: "ここのか", meaning: "Ngày mồng 9" },
  { kanji: "十日", kana: "とおか", meaning: "Ngày mồng 10" },
  { kanji: "十四日", kana: "じゅうよっか", meaning: "Ngày 14" },
  { kanji: "二十日", kana: "はつか", meaning: "Ngày 20" },
  { kanji: "二十四日", kana: "にじゅうよっか", meaning: "Ngày 24" },

  // --- HỆ THỐNG SỐ ĐẾM CHUYÊN BIỆT ---
  { kanji: "一つ", kana: "ひとつ", meaning: "1 cái (vật chung)" },
  { kanji: "二つ", kana: "ふたつ", meaning: "2 cái" },
  { kanji: "三つ", kana: "みっつ", meaning: "3 cái" },
  { kanji: "四つ", kana: "よっつ", meaning: "4 cái" },
  { kanji: "五つ", kana: "いつつ", meaning: "5 cái" },
  { kanji: "六つ", kana: "むっつ", meaning: "6 cái" },
  { kanji: "七つ", kana: "ななつ", meaning: "7 cái" },
  { kanji: "八つ", kana: "やっつ", meaning: "8 cái" },
  { kanji: "九つ", kana: "ここのつ", meaning: "9 cái" },
  { kanji: "十", kana: "とお", meaning: "10 cái" },
  { kanji: "一人", kana: "ひとり", meaning: "1 người" },
  { kanji: "二人", kana: "ふたり", meaning: "2 người" },
  { kanji: "三人", kana: "さんにん", meaning: "3 người" },

  // --- QUỐC GIA & NGÔN NGỮ (KATAKANA & KANJI) ---
  { kanji: "日本", kana: "にほん", meaning: "Nhật Bản" },
  { kanji: "日本語", kana: "にほんご", meaning: "Tiếng Nhật" },
  { kanji: "日本人", kana: "にほんじん", meaning: "Người Nhật" },
  { kanji: "ベトナム", kana: "ベトナム", meaning: "Việt Nam" },
  { kanji: "アメリカ", kana: "アメリカ", meaning: "Mỹ" },
  { kanji: "中国", kana: "ちゅうごく", meaning: "Trung Quốc" },
  { kanji: "韓国", kana: "かんこく", meaning: "Hàn Quốc" },
  { kanji: "英国", kana: "えいこく", meaning: "Nước Anh" },
  { kanji: "英語", kana: "えいご", meaning: "Tiếng Anh" },
  { kanji: "フランス", kana: "フランス", meaning: "Pháp" },

  // --- CÁC TỪ VỰNG KANJI VỀ VỊ TRÍ CHI TIẾT ---
  { kanji: "右側", kana: "みぎがわ", meaning: "Phía bên phải" },
  { kanji: "左側", kana: "ひだりがわ", meaning: "Phía bên trái" },
  { kanji: "向こう側", kana: "むこうがわ", meaning: "Phía đối diện" },
  { kanji: "両側", kana: "りょうがわ", meaning: "Cả hai phía" },

  // --- CỤM ĐỘNG TỪ DI CHUYỂN NÂNG CAO ---
  { kanji: "乗り換えます", kana: "のりかえます", meaning: "Chuyển tàu, xe" },
  { kanji: "見つけます", kana: "みつけます", meaning: "Tìm thấy" },
  { kanji: "集めます", kana: "あつめます", meaning: "Thu thập, tập hợp" },
  { kanji: "換えます", kana: "かえます", meaning: "Đổi, trao đổi" },
  { kanji: "捨てます", kana: "すてます", meaning: "Vứt bỏ" },

  // --- NGHỀ NGHIỆP (OCCUPATIONS) ---
  { kanji: "会社員", kana: "かいしゃいん", meaning: "Nhân viên công ty" },
  { kanji: "公務員", kana: "こうむいん", meaning: "Công chức nhà nước" },
  { kanji: "駅員", kana: "えきいん", meaning: "Nhân viên nhà ga" },
  { kanji: "料理人", kana: "りょうりにん", meaning: "Đầu bếp" },
  { kanji: "運転手", kana: "うんてんしゅ", meaning: "Tài xế" },
  { kanji: "警察官", kana: "けいさつかん", meaning: "Cảnh sát" },
  { kanji: "弁護士", kana: "べんごし", meaning: "Luật sư" },
  { kanji: "研究者", kana: "けんきゅうしゃ", meaning: "Nhà nghiên cứu" },

  // --- BỘ PHẬN CƠ THỂ CHI TIẾT ---
  { kanji: "首", kana: "くび", meaning: "Cổ" },
  { kanji: "肩", kana: "かた", meaning: "Vai" },
  { kanji: "背中", kana: "せなか", meaning: "Lưng" },
  { kanji: "胸", kana: "むね", meaning: "Ngực" },
  { kanji: "指", kana: "ゆび", meaning: "Ngón tay" },
  { kanji: "爪", kana: "つめ", meaning: "Móng tay" },
  { kanji: "喉", kana: "のど", meaning: "Họng" },
  { kanji: "声", kana: "こえ", meaning: "Giọng nói" },

  // --- RAU CỦ & ĐỘNG VẬT BỔ SUNG ---
  { kanji: "林檎", kana: "りんご", meaning: "Quả táo" },
  { kanji: "蜜柑", kana: "みかん", meaning: "Quả quýt" },
  { kanji: "大根", kana: "だいこん", meaning: "Củ cải trắng" },
  { kanji: "馬", kana: "うま", meaning: "Con ngựa" },
  { kanji: "象", kana: "ぞう", meaning: "Con voi" },
  { kanji: "蛇", kana: "へび", meaning: "Con rắn" },

  // --- PHÓ TỪ CHỈ SỐ LƯỢNG & TẦN SUẤT ---
  { kanji: "全部", kana: "ぜんぶ", meaning: "Tất cả" },
  { kanji: "半分", kana: "はんぶん", meaning: "Một nửa" },
  { kanji: "少々", kana: "しょうしょう", meaning: "Một chút (lịch sự)" },
  { kanji: "時々", kana: "ときどき", meaning: "Thỉnh thoảng" },
  { kanji: "たまに", kana: "たまに", meaning: "Hiếm khi" },
  { kanji: "全然", kana: "ぜんぜん", meaning: "Hoàn toàn không (đi với phủ định)" },
  { kanji: "かなり", kana: "かなり", meaning: "Khá là" },

  // --- CÁC ĐỘNG TỪ TRẠNG THÁI N5 ---
  { kanji: "鳴ります", kana: "なります", meaning: "Kêu, reo (chuông)" },
  { kanji: "並びます", kana: "ならびます", meaning: "Xếp hàng" },
  { kanji: "運びます", kana: "はこびます", meaning: "Vận chuyển" },
  { kanji: "渡ります", kana: "わたります", meaning: "Băng qua (đường/cầu)" },
  { kanji: "止まります", kana: "とまります", meaning: "Dừng lại" },
  { kanji: "曲がります", kana: "まがります", meaning: "Rẽ, quẹo" },

  // --- KATAKANA: ĐỒ GIA DỤNG & CÔNG NGHỆ ---
  { kanji: "エアコン", kana: "エアコン", meaning: "Máy điều hòa" },
  { kanji: "プレゼント", kana: "プレゼント", meaning: "Quà tặng" },
  { kanji: "ホッチキス", kana: "ホッチキス", meaning: "Cái dập ghim" },
  { kanji: "セロテープ", kana: "セロテープ", meaning: "Băng dính" },
  { kanji: "消しゴム", kana: "けしゴム", meaning: "Cục tẩy" },
  { kanji: "シャープペンシル", kana: "シャープペンシル", meaning: "Bút chì kim" },
  { kanji: "レポート", kana: "レポート", meaning: "Bản báo cáo" },
  { kanji: "パソコン", kana: "パソコン", meaning: "Máy tính cá nhân" },
  { kanji: "エレベーター", kana: "エレベーター", meaning: "Thang máy" },
  { kanji: "エスカレーター", kana: "エスカレーター", meaning: "Thang cuốn" },

  // --- CÁC TỪ VỰNG VỀ THỜI TIẾT & TRẠNG THÁI TỰ NHIÊN ---
  { kanji: "太陽", kana: "たいよう", meaning: "Mặt trời" },
  { kanji: "月", kana: "つき", meaning: "Mặt trăng" },
  { kanji: "星", kana: "ほし", meaning: "Ngôi sao" },
  { kanji: "風", kana: "かぜ", meaning: "Gió" },
  { kanji: "波", kana: "なみ", meaning: "Sóng biển" },
  { kanji: "景色", kana: "けしき", meaning: "Phong cảnh" },

  // --- CỤM ĐỘNG TỪ NÂNG CAO (N5 PHỨC TẠP) ---
  { kanji: "出します", kana: "だします", meaning: "Nộp (báo cáo), lấy ra" },
  { kanji: "入れます", kana: "いれます", meaning: "Cho vào, bỏ vào" },
  { kanji: "回します", kana: "まわします", meaning: "Vặn, xoay (nút bấm)" },
  { kanji: "引きます", kana: "ひきます", meaning: "Kéo" },
  { kanji: "変えます", kana: "かえます", meaning: "Thay đổi (cái gì đó)" },
  { kanji: "触ります", kana: "さわります", meaning: "Chạm vào, sờ vào" },
  { kanji: "動きます", kana: "うごきます", meaning: "Chuyển động, hoạt động" },
  { kanji: "歩きます", kana: "あるきます", meaning: "Đi bộ" },

  // --- DANH TỪ CHỈ KHÔNG GIAN & VỊ TRÍ ---
  { kanji: "玄関", kana: "げんかん", meaning: "Lối vào nhà, hiên nhà" },
  { kanji: "廊下", kana: "ろうか", meaning: "Hành lang" },
  { kanji: "池", kana: "いけ", meaning: "Cái ao" },
  { kanji: "階段", kana: "かいだん", meaning: "Cầu thang bộ" },
  { kanji: "角", kana: "かど", meaning: "Góc đường" },
  { kanji: "交差点", kana: "こうさてん", meaning: "Ngã tư" },
  { kanji: "橋", kana: "はし", meaning: "Cây cầu" },
  { kanji: "踏切", kana: "ふみきり", meaning: "Nơi tàu hỏa chạy ngang qua" },

  // --- VĂN PHÒNG PHẨM & ĐỒ DÙNG LẺ ---
  { kanji: "切手", kana: "きって", meaning: "Tem thư" },
  { kanji: "葉書", kana: "はがき", meaning: "Bưu thiếp" },
  { kanji: "封筒", kana: "ふうとう", meaning: "Phong bì" },
  { kanji: "速達", kana: "そくたつ", meaning: "Gửi chuyển phát nhanh" },
  { kanji: "書留", kana: "かきとめ", meaning: "Gửi bảo đảm" },
  { kanji: "航空便", kana: "こうくうびん", meaning: "Gửi bằng đường hàng không" },
  { kanji: "船便", kana: "ふなびん", meaning: "Gửi bằng đường biển" },

  // --- PHÓ TỪ & TỪ HẠN ĐỊNH CHI TIẾT ---
  { kanji: "少し", kana: "すこし", meaning: "Một chút, một ít" },
  { kanji: "少々", kana: "しょうしょう", meaning: "Một chút (dùng trong nhà hàng/lịch sự)" },
  { kanji: "ずっと", kana: "ずっと", meaning: "Suốt / Hơn hẳn (so sánh)" },
  { kanji: "もっと", kana: "もっと", meaning: "Hơn nữa" },
  { kanji: "そろそろ", kana: "そろそろ", meaning: "Sắp sửa đến lúc..." },
  { kanji: "初めて", kana: "はじめて", meaning: "Lần đầu tiên" },
  { kanji: "まず", kana: "まず", meaning: "Trước tiên, đầu tiên" },
  { kanji: "最後に", kana: "さいごに", meaning: "Cuối cùng" },

  // --- TỪ VỰNG VỀ GIẢI TRÍ & SỰ KIỆN ---
  { kanji: "お祭り", kana: "おまつり", meaning: "Lễ hội" },
  { kanji: "お花見", kana: "おはなみ", meaning: "Ngắm hoa anh đào" },
  { kanji: "場所", kana: "ばしょ", meaning: "Địa điểm" },
  { kanji: "都合", kana: "つごう", meaning: "Điều kiện, sự thuận tiện" },
  { kanji: "予定", kana: "よてい", meaning: "Dự định, kế hoạch" },
  { kanji: "番組", kana: "ばんぐみ", meaning: "Chương trình (tivi)" },

  // --- CÁC DANH TỪ KANJI CUỐI GIÁO TRÌNH GUNGUN ---
  { kanji: "意味", kana: "いみ", meaning: "Ý nghĩa" },
  { kanji: "意見", kana: "いけん", meaning: "Ý kiến" },
  { kanji: "返事", kana: "へんじ", meaning: "Hồi âm, trả lời" },
  { kanji: "習慣", kana: "しゅうかん", meaning: "Thói quen, tập quán" },
  { kanji: "健康", kana: "けんこう", meaning: "Sức khỏe" },
  { kanji: "将来", kana: "しょうらい", meaning: "Tương lai" },
  { kanji: "準備", kana: "じゅんび", meaning: "Chuẩn bị" },
  { kanji: "掃除", kana: "そうじ", meaning: "Dọn dẹp" },
  { kanji: "洗濯", kana: "せんたく", meaning: "Giặt giũ" },

  // --- CÁC CỤM TỪ GIAO TIẾP ĐẶC BIỆT ---
  { kanji: "お帰りなさい", kana: "おかえりなさい", meaning: "Bạn đã về rồi à" },
  { kanji: "行ってきます", kana: "いってきます", meaning: "Tôi đi đây (rồi sẽ về)" },
  { kanji: "行ってらっしゃい", kana: "いってらっしゃい", meaning: "Bạn đi nhé" },
  { kanji: "ただいま", kana: "ただいま", meaning: "Tôi đã về rồi đây" },
  { kanji: "お邪魔します", kana: "おじゃまします", meaning: "Tôi xin lỗi vì đã làm phiền (khi vào nhà người khác)" }
];

export default function App() {
  const [learnedCount, setLearnedCount] = useState(0);
  const [currentMode, setCurrentMode] = useState('menu'); // menu, learning, quiz, quizSelect, result
  
  // State cho phần học (Learning)
  const [learningBatch, setLearningBatch] = useState([]);
  const [learningIndex, setLearningIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // State cho tính năng AI (Gemini)
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiError, setAiError] = useState("");

  // State cho phần trắc nghiệm (Quiz)
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // State cho danh sách học lại (Từ trả lời sai)
  const [reviewList, setReviewList] = useState([]);
  const [isReviewSession, setIsReviewSession] = useState(false);
  
  // State cho xác nhận Reset (tránh dùng window.confirm bị chặn)
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const BATCH_SIZE = 10;
  const totalWords = N5_WORDS.length;

  // --- HÀM PHÁT ÂM CẢI TIẾN ---
  const playPronunciation = (textToSpeak, fallbackKana, e) => {
    if (e) e.stopPropagation();

    if ('speechSynthesis' in window) {
      // Ưu tiên đọc văn bản (Kanji) để trình duyệt bắt được Pitch Accent (ngữ điệu)
      // Nếu không có Kanji (như các từ Katakana hoặc Hiragana đơn thuần), thì đọc bằng Kana.
      const text = textToSpeak || fallbackKana;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // BẮT BUỘC chỉ định ngôn ngữ là tiếng Nhật
      utterance.lang = 'ja-JP';
      
      const voices = window.speechSynthesis.getVoices();
      // Tìm giọng đọc Google hoặc giọng mặc định tiếng Nhật tốt nhất
      const japaneseVoice = voices.find(voice => 
        voice.lang === 'ja-JP' && (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Siri'))
      ) || voices.find(voice => voice.lang.includes('ja'));
      
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }
      
      // Cấu hình tốc độ và cao độ tự nhiên hơn
      utterance.rate = 0.85; // Chậm lại một xíu để nghe rõ trọng âm
      utterance.pitch = 1.0; 

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ phát âm.");
    }
  };

  // Ensure voices are loaded (sometimes takes a moment on first load)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
         window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // --- LOGIC HỌC TỪ MỚI ---
  const startLearning = () => {
    if (learnedCount >= totalWords) return;
    const nextBatch = N5_WORDS.slice(learnedCount, learnedCount + BATCH_SIZE);
    setLearningBatch(nextBatch);
    setLearningIndex(0);
    setIsFlipped(false);
    setAiData(null);
    setAiError("");
    setIsReviewSession(false);
    setCurrentMode('learning');
  };

  const handleNextLearningWord = () => {
    if (learningIndex < learningBatch.length - 1) {
      setIsFlipped(false);
      setAiData(null);
      setAiError("");
      setTimeout(() => {
        setLearningIndex(prev => prev + 1);
      }, 150); // Đợi lật thẻ lại rồi mới chuyển chữ
    } else {
      // Hoàn thành batch -> Cập nhật số lượng đã học (nếu không phải là đang ôn tập từ sai)
      if (!isReviewSession) {
        setLearnedCount(prev => prev + learningBatch.length);
      }
      setCurrentMode('menu');
    }
  };

  // --- LOGIC ÔN TẬP TỪ SAI ---
  const startReview = () => {
    if (reviewList.length === 0) return;
    setLearningBatch([...reviewList]);
    setLearningIndex(0);
    setIsFlipped(false);
    setAiData(null);
    setAiError("");
    setIsReviewSession(true);
    setCurrentMode('learning');
    
    // Xóa danh sách sau khi bắt đầu ôn tập để tạo vòng lặp mới
    setReviewList([]);
  };

  // --- HÀM TẠO CÂU HỎI TỪ MẢNG TỪ VỰNG ---
  const generateQuestionsForWords = (wordsArray) => {
    let questions = [];
    wordsArray.forEach(word => {
      // 1. Câu hỏi về Nghĩa
      const wrongMeanings = N5_WORDS.filter(w => w.meaning !== word.meaning).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.meaning);
      questions.push({
        originalWord: word, type: 'meaning', promptLabel: 'Chọn nghĩa của từ sau',
        promptMain: word.kanji, promptSub: word.kana, correctAnswer: word.meaning,
        options: [word.meaning, ...wrongMeanings].sort(() => Math.random() - 0.5)
      });
      // 2. Câu hỏi về Cách đọc
      const wrongKanas = N5_WORDS.filter(w => w.kana !== word.kana).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.kana);
      questions.push({
        originalWord: word, type: 'reading', promptLabel: 'Chọn cách đọc của từ sau',
        promptMain: word.kanji, promptSub: word.meaning, correctAnswer: word.kana,
        options: [word.kana, ...wrongKanas].sort(() => Math.random() - 0.5)
      });
      // 3. Câu hỏi về Cách viết
      const wrongKanjis = N5_WORDS.filter(w => w.kanji !== word.kanji).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.kanji);
      questions.push({
        originalWord: word, type: 'writing', promptLabel: 'Chọn chữ Hán / Cách viết của từ sau',
        promptMain: word.meaning, promptSub: '', correctAnswer: word.kanji,
        options: [word.kanji, ...wrongKanjis].sort(() => Math.random() - 0.5)
      });
    });
    return questions;
  };

  // --- LOGIC XỬ LÝ CHỌN CHẾ ĐỘ KIỂM TRA ---
  const openQuizOptions = () => {
    if (learnedCount === 0) return;
    if (learnedCount === BATCH_SIZE) {
      // Nếu mới học 10 từ, vào thẳng bài kiểm tra 10 từ đó
      handleStartQuiz('recent');
    } else {
      // Nếu học >= 20 từ, mở menu chọn
      setCurrentMode('quizSelect');
    }
  };

  const handleStartQuiz = (type) => {
    let finalQuestions = [];

    if (type === 'recent') {
      // Kiểm tra 10 từ vừa học (30 câu hỏi)
      const recentWords = N5_WORDS.slice(learnedCount - BATCH_SIZE, learnedCount);
      finalQuestions = generateQuestionsForWords(recentWords);
      finalQuestions.sort(() => Math.random() - 0.5); // Trộn ngẫu nhiên 30 câu
    } else if (type === 'random') {
      // Kiểm tra ngẫu nhiên 10 câu trong TẤT CẢ các từ đã học
      const allLearnedWords = N5_WORDS.slice(0, learnedCount);
      const allPossibleQuestions = generateQuestionsForWords(allLearnedWords);
      // Trộn toàn bộ rổ câu hỏi và bốc đúng 10 câu
      finalQuestions = allPossibleQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    }

    setQuizQuestions(finalQuestions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setCurrentMode('quiz');
  };

  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return; // Không cho chọn lại khi đã chọn
    setSelectedAnswer(option);
    
    const currentQuestion = quizQuestions[currentQuizIndex];
    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    } else {
      // Nếu trả lời sai, thêm từ gốc vào danh sách cần học lại
      setReviewList(prev => {
        // Kiểm tra xem từ này đã có trong danh sách chưa để tránh trùng lặp
        const exists = prev.some(w => w.kanji === currentQuestion.originalWord.kanji);
        if (!exists) {
          return [...prev, currentQuestion.originalWord];
        }
        return prev;
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setSelectedAnswer(null);
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setCurrentMode('result');
    }
  };

  // --- LOGIC GEMINI API ---
  const fetchAiHelp = async (word) => {
    setAiLoading(true);
    setAiError("");
    setAiData(null);
    
    const apiKey = ""; // API key sẽ được inject ở runtime
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    // Câu lệnh (prompt) được siết chặt cực kỳ nghiêm ngặt để ép AI chỉ dùng tiếng Nhật
    const prompt = `Bạn là giáo viên tiếng Nhật trình độ N5. Học sinh đang học từ vựng tiếng Nhật sau: "${word.kanji}" (cách đọc Hiragana: ${word.kana}) - nghĩa tiếng Việt: "${word.meaning}".

YÊU CẦU BẮT BUỘC (KIỂM TRA KỸ TRƯỚC KHI TRẢ LỜI):
1. Viết đúng 2 câu ví dụ HOÀN TOÀN BẰNG TIẾNG NHẬT (Sử dụng Kanji, Hiragana, Katakana. TUYỆT ĐỐI KHÔNG dùng tiếng Hàn, tiếng Trung hay ngôn ngữ nào khác) ở trình độ sơ cấp N5 có chứa từ vựng trên.
2. Cung cấp phiên âm Romaji chuẩn cho mỗi câu ví dụ.
3. Cung cấp bản dịch nghĩa tiếng Việt cho mỗi câu ví dụ.
4. Đưa ra 1 mẹo nhỏ bằng tiếng Việt (ví dụ: liên tưởng hình ảnh, chiết tự chữ Hán, hoặc mẹo âm thanh) để học sinh dễ nhớ từ này.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            examples: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  japanese: { type: "STRING" },
                  romaji: { type: "STRING" },
                  vietnamese: { type: "STRING" }
                }
              }
            },
            tip: { type: "STRING" }
          }
        }
      }
    };

    const fetchWithRetry = async (retries = 5) => {
      const delays = [1000, 2000, 4000, 8000, 16000];
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error("Lỗi kết nối AI");
          return await res.json();
        } catch (e) {
          if (i === retries - 1) throw e;
          await new Promise(r => setTimeout(r, delays[i]));
        }
      }
    };

    try {
      const data = await fetchWithRetry();
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        setAiData(JSON.parse(jsonText));
      } else {
        throw new Error("Không nhận được dữ liệu");
      }
    } catch (err) {
      setAiError("Có lỗi xảy ra khi gọi AI. Vui lòng thử lại!");
    } finally {
      setAiLoading(false);
    }
  };

  // --- GIAO DIỆN (UI COMPONENTS) ---

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <GraduationCap size={40} />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Gungun N5 Flashcards</h1>
      <p className="text-gray-500 text-center mb-8">
        Học từ vựng theo cụm 10 từ và làm bài trắc nghiệm tích lũy!
      </p>

      <div className="w-full bg-gray-100 rounded-full h-4 mb-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
          style={{ width: `${(learnedCount / totalWords) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-8">
        Đã học: <span className="text-blue-600 text-lg">{learnedCount}</span> / {totalWords} từ
      </p>

      <div className="space-y-4 w-full">
        <button 
          onClick={startLearning}
          disabled={learnedCount >= totalWords}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
            learnedCount >= totalWords ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          <BookOpen size={20} />
          {learnedCount >= totalWords ? "Đã học hết từ vựng!" : "Học 10 từ tiếp theo"}
        </button>

        <button 
          onClick={openQuizOptions}
          disabled={learnedCount === 0}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all transform active:scale-95 ${
            learnedCount === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm'
          }`}
        >
          <Play size={20} />
          Kiểm tra ({learnedCount} từ)
        </button>

        {reviewList.length > 0 && (
          <button 
            onClick={startReview}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 transition-all shadow-sm transform active:scale-95 animate-fade-in"
          >
            <AlertTriangle size={20} />
            Ôn lại các từ sai ({reviewList.length} từ)
          </button>
        )}
      </div>

      {learnedCount > 0 && (
        <div className="mt-8 text-center">
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)} className="text-sm text-gray-400 hover:text-red-500 transition-colors underline">
              Xóa tiến trình học
            </button>
          ) : (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-in">
              <p className="text-sm text-red-600 font-medium mb-3">Bạn có chắc chắn muốn xóa toàn bộ tiến trình không?</p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => { setLearnedCount(0); setShowResetConfirm(false); setReviewList([]); }} 
                  className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600"
                >
                  Đồng ý
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderQuizSelect = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full text-center">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
        <Play size={40} className="ml-2" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn chế độ kiểm tra</h2>
      <p className="text-gray-500 mb-8">Bạn muốn ôn tập theo phương pháp nào?</p>
      
      <div className="space-y-4 w-full">
        <button 
          onClick={() => handleStartQuiz('recent')}
          className="w-full flex flex-col items-center justify-center p-4 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-left"
        >
          <span className="font-bold text-lg mb-1">Kiểm tra bài mới</span>
          <span className="text-sm opacity-80">30 câu hỏi cho 10 từ vừa học xong</span>
        </button>

        <button 
          onClick={() => handleStartQuiz('random')}
          className="w-full flex flex-col items-center justify-center p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-left"
        >
          <span className="font-bold text-lg mb-1">Kiểm tra tổng hợp</span>
          <span className="text-sm opacity-80">10 câu hỏi ngẫu nhiên trong số {learnedCount} từ đã học</span>
        </button>
      </div>

      <button 
        onClick={() => setCurrentMode('menu')}
        className="mt-6 text-gray-500 hover:text-gray-800 font-medium"
      >
        &larr; Quay lại
      </button>
    </div>
  );

  const renderLearning = () => {
    const currentWord = learningBatch[learningIndex];
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md pb-12">
        <div className="w-full flex justify-between items-center mb-6 px-4">
          <button onClick={() => setCurrentMode('menu')} className="text-gray-500 hover:text-gray-800 font-medium">
            &larr; Thoát
          </button>
          <div className="text-gray-500 font-medium flex items-center gap-2">
            {isReviewSession && <AlertTriangle size={16} className="text-orange-500" />}
            Từ {learningIndex + 1} / {learningBatch.length}
          </div>
        </div>

        {/* CSS cho hiệu ứng Flip 3D */}
        <style dangerouslySetInnerHTML={{__html: `
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}} />

        {/* Flashcard */}
        <div 
          className="perspective-1000 w-full h-80 cursor-pointer relative"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Mặt trước: Tiếng Nhật */}
            <div className="absolute w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden border border-gray-100" lang="ja">
              {/* Nút phát âm trên mặt thẻ. CHÚ Ý: Ưu tiên phát âm Kanji để đọc đúng trọng âm */}
              <button 
                onClick={(e) => playPronunciation(currentWord.kanji, currentWord.kana, e)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Nghe phát âm"
              >
                <Volume2 size={24} />
              </button>

              <span className="text-gray-400 text-lg tracking-widest uppercase mb-4 font-semibold">Chạm để lật</span>
              <h2 className="text-7xl font-bold text-gray-800 mb-6">{currentWord.kanji}</h2>
              <p className="text-2xl text-blue-600 font-medium bg-blue-50 py-2 px-6 rounded-full">{currentWord.kana}</p>
            </div>

            {/* Mặt sau: Nghĩa tiếng Việt */}
            <div className="absolute w-full h-full bg-blue-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180">
              <span className="text-blue-200 text-lg tracking-widest uppercase mb-4 font-semibold">Ý nghĩa</span>
              <h2 className="text-4xl font-bold text-center leading-tight">{currentWord.meaning}</h2>
            </div>
          </div>
        </div>

        {/* AI Assistant Button & Panel */}
        <div className="w-full mt-6">
          {!aiData && !aiLoading && (
            <button 
              onClick={() => fetchAiHelp(currentWord)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <Sparkles size={18} className="text-indigo-500" />
              Giải thích & Lấy ví dụ với AI ✨
            </button>
          )}

          {aiLoading && (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 text-indigo-500 bg-indigo-50 rounded-xl animate-pulse">
              <Loader2 size={18} className="animate-spin" />
              AI đang suy nghĩ...
            </div>
          )}

          {aiError && (
            <div className="w-full text-center text-red-500 text-sm mt-2">
              {aiError}
            </div>
          )}

          {aiData && (
            <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 mt-2 text-left animate-fade-in">
              <h3 className="flex items-center gap-2 font-bold text-indigo-700 mb-3 border-b border-indigo-50 pb-2">
                <Sparkles size={16} /> Mẹo nhớ từ AI
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {aiData.tip}
              </p>
              
              <h3 className="font-bold text-gray-800 mb-2 text-sm">Câu ví dụ:</h3>
              <ul className="space-y-3">
                {aiData.examples.map((ex, idx) => (
                  <li key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100" lang="ja">
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      {ex.japanese}
                      <button 
                        onClick={() => playPronunciation(ex.japanese, "", null)}
                        className="text-gray-400 hover:text-indigo-600 focus:outline-none"
                      >
                        <Volume2 size={14} />
                      </button>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{ex.romaji}</p>
                    <p className="text-sm text-indigo-600 mt-1">{ex.vietnamese}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button 
          onClick={handleNextLearningWord}
          className="mt-6 bg-gray-800 text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg active:scale-95 transform"
        >
          {learningIndex < learningBatch.length - 1 ? "Từ tiếp theo" : (isReviewSession ? "Hoàn thành ôn tập" : "Hoàn thành phiên học")}
          <ArrowRight size={20} />
        </button>
      </div>
    );
  };

  const renderQuiz = () => {
    const question = quizQuestions[currentQuizIndex];
    return (
      <div className="flex flex-col w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-emerald-500 p-6 text-white text-center relative">
           <button onClick={() => setCurrentMode('menu')} className="absolute left-4 top-6 text-emerald-100 hover:text-white font-medium text-sm">
            Thoát
          </button>
          <span className="text-emerald-100 font-medium text-sm">Câu hỏi {currentQuizIndex + 1} / {quizQuestions.length}</span>
          
          <div className="mt-4 text-emerald-200 text-sm font-semibold uppercase tracking-wider">
            {question.promptLabel}
          </div>
          <h2 className="text-5xl font-bold mt-2 flex items-center justify-center gap-2" lang="ja">
            {question.promptMain}
            {/* Truyền Kanji vào hàm phát âm khi đang hiển thị Hiragana (reading test) để máy hiểu trọng âm */}
            {(question.type === 'meaning' || question.type === 'reading') && (
              <button 
                onClick={(e) => playPronunciation(question.originalWord.kanji, question.originalWord.kana, e)}
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <Volume2 size={24} />
              </button>
            )}
          </h2>
          {question.promptSub && <p className="text-xl mt-2 opacity-90">{question.promptSub}</p>}
        </div>

        <div className="p-6 space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            
            let btnClass = "w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex justify-between items-center ";
            
            if (!selectedAnswer) {
              btnClass += "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700";
            } else if (isCorrect) {
              btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
            } else if (isSelected && !isCorrect) {
              btnClass += "border-red-500 bg-red-50 text-red-700";
            } else {
              btnClass += "border-gray-100 opacity-50 text-gray-400";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleAnswerSelect(option)}
                disabled={!!selectedAnswer}
                className={btnClass}
              >
                <span className="text-lg">{option}</span>
                {selectedAnswer && isCorrect && <CheckCircle2 className="text-emerald-500" />}
                {selectedAnswer && isSelected && !isCorrect && <XCircle className="text-red-500" />}
              </button>
            );
          })}

          {selectedAnswer && (
            <button 
              onClick={handleNextQuestion}
              className="w-full mt-6 bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-md animate-fade-in"
            >
              Tiếp tục
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full text-center">
      <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mb-6">
        <Trophy size={48} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết quả kiểm tra</h2>
      <p className="text-gray-500 mb-8">Bạn vừa hoàn thành bài ôn tập gồm {quizQuestions.length} câu hỏi.</p>
      
      <div className="text-6xl font-black text-emerald-500 mb-8">
        {quizScore}<span className="text-3xl text-gray-300">/{quizQuestions.length}</span>
      </div>

      <button 
        onClick={() => setCurrentMode('menu')}
        className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-md"
      >
        <RotateCcw size={20} />
        Về trang chủ
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      {currentMode === 'menu' && renderMenu()}
      {currentMode === 'quizSelect' && renderQuizSelect()}
      {currentMode === 'learning' && renderLearning()}
      {currentMode === 'quiz' && renderQuiz()}
      {currentMode === 'result' && renderResult()}
    </div>
  );
}
