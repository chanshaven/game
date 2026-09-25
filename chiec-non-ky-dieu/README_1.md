# Chiếc Nón Kỳ Diệu — Giải cứu cún con

Trò chơi ô chữ chạy hoàn toàn trong trình duyệt. Không cần cài đặt, không cần server,
không dùng thư viện ngoài nào. Mở file là chơi.

---

## 1. Chạy thử

**Cách nhanh nhất:** nhấp đúp vào `index.html`. Trình duyệt sẽ mở và chơi được ngay.

Nếu bạn dùng VS Code, cài extension **Live Server** rồi bấm *Go Live* để trang tự
tải lại mỗi khi bạn sửa code — tiện hơn khi chỉnh sửa nhiều.

---

## 2. Cấu trúc thư mục

```
index.html      giao diện + toàn bộ CSS  (CSS nằm gọn trong thẻ <style> ở đầu file)
questions.js    ngân hàng 496 ô chữ, chia 6 phần theo chủ đề
game.js         toàn bộ logic trò chơi
chiec-non-ky-dieu-1-file.html
                bản gộp cả 3 file trên thành MỘT file duy nhất —
                tiện để gửi qua Zalo/email hoặc chép vào USB
```

Bản 1 file và bản 3 file có nội dung y hệt nhau. Sửa bản 3 file thì dễ đọc hơn;
khi xong, nếu muốn có lại bản 1 file, chỉ cần chép nội dung `questions.js` và
`game.js` vào đúng hai thẻ `<script>` trong file gộp.

---

## 3. Những chỗ hay sửa nhất

### Thêm hoặc sửa câu hỏi — `questions.js`

Mỗi câu là một dòng gồm ba phần: **đáp án**, **chủ đề**, **gợi ý**.

```js
["ĂN QUẢ NHỚ KẺ TRỒNG CÂY", "Tục ngữ", "Nhắc ta biết ơn người đi trước"],
```

Quy tắc bắt buộc:

- Viết HOA toàn bộ đáp án, **có dấu đầy đủ**.
- Chỉ dùng chữ cái và dấu cách. Không dùng dấu phẩy, dấu chấm, gạch nối, ngoặc
  kép hay chữ số — viết `MƯỜI` thay cho `10`.
- Dấu cách chính là chỗ ngắt từ trên bảng ô chữ.

Thêm câu mới: chép thêm một dòng vào bất kỳ khối `push(...)` nào, nhớ dấu phẩy ở
cuối dòng phía trước. Không phải khai báo gì thêm ở chỗ khác.

Muốn làm bộ câu hỏi riêng cho nhóm bạn: xóa hết nội dung trong các khối `push`
rồi thay bằng câu của bạn, hoặc thêm một khối `push` mới ở cuối file.

### Sửa các ô trên vòng quay — `game.js`, hằng số `SEGS` (gần đầu file)

```js
const SEGS = [
  { t:'pts', v:200 },              // ô điểm
  { t:'lose',   l:'MẤT LƯỢT' },    // ô đặc biệt: t là loại, l là chữ hiển thị
  ...
];
```

Các loại `t` đang có: `pts` (điểm), `lose` (mất lượt), `double` (gấp đôi),
`half` (chia đôi), `life` (thêm mạng), `lucky` (mở free một chữ), `hint` (gợi ý),
`again` (quay thêm lần nữa), `gift` (tặng 1000 điểm), `zero` (điểm về 0),
`danger` (mất ngay một mạng), `bet` (cược đôi).

- Đổi số điểm: sửa `v`.
- Thêm bớt ô: thêm/xóa phần tử trong mảng. Vòng quay tự chia lại số phần bằng nhau,
  không cần sửa gì thêm.
- Đổi màu ô: sửa bảng `COLORS` ngay bên dưới `SEGS`. Mỗi loại là một cặp
  `['màu nền', 'màu chữ']`.
- Muốn thêm một loại ô hoàn toàn mới: thêm vào `SEGS`, thêm màu vào `COLORS`,
  rồi thêm một nhánh `case` trong hàm `land()`.

### Số mạng của cún — `game.js`

```js
const MAX_LIVES = 8, START_LIVES = 5;
```

`START_LIVES` là số mạng lúc bắt đầu, `MAX_LIVES` là trần khi được cộng thêm mạng.

### Điểm thưởng khi đoán đúng đáp án — `game.js`

Tìm chuỗi `300 + hid * 150` (xuất hiện ở hai hàm `openSolve` và `doSolve`).
`hid` là số chữ cái còn đang ẩn, nên đoán càng sớm thưởng càng cao.
Sửa cả hai chỗ cho khớp nhau.

### Màu sắc và phông chữ — `index.html`

Toàn bộ màu nằm trong khối `:root{ ... }` ở đầu thẻ `<style>`, đặt tên theo kiểu
`--gold-400`, `--wine-800`... Đổi một biến là cả trang đổi theo.

Phông chữ lấy từ Google Fonts qua thẻ `<link>` trong `<head>`:
`Anton` cho tiêu đề và `Be Vietnam Pro` cho phần chữ thường. Muốn đổi thì thay
đường dẫn Google Fonts rồi sửa hai biến `--fx-display` và `--fx-body`.

> Lưu ý: hãy chọn phông **có hỗ trợ tiếng Việt**, nếu không các chữ ă â ê ô ơ ư đ
> sẽ hiện sai hoặc mất dấu.

### Nhạc nền — `game.js`

Nhạc được tổng hợp trực tiếp bằng Web Audio API nên không có file mp3 nào.

- Giai điệu: mảng `MEL` (8 ô nhịp, mỗi ô 8 nốt, số là cao độ MIDI, `0` là nghỉ).
- Hợp âm: mảng `CHORDS`.
- Tốc độ: hằng số `BPM`.
- Âm lượng nhạc nền: số `0.2` trong hàm `setMusic`.
- Các tiếng động: đối tượng `sfx` (tick, good, bad, big, fail, life, whoosh).

Nếu bạn muốn dùng nhạc mp3 có sẵn thay cho nhạc tổng hợp, thêm thẻ
`<audio id="bgm" src="nhac.mp3" loop>` vào HTML rồi gọi `document.getElementById('bgm').play()`
trong hàm `setMusic`. Nhớ chỉ dùng nhạc bạn có quyền sử dụng.

### Đổi cún thành con vật khác — `index.html`

Hình cún là SVG vẽ tay nằm trong khối `<symbol id="ic-dog">` ở đầu phần body.
Thay nội dung symbol đó là đổi được con vật. Các câu thoại về cún nằm trong hàm
`renderLives()` của `game.js`.

---

## 4. Cách chữ cái tiếng Việt được xử lý

Đây là phần dễ nhầm nhất, nên ghi lại cho rõ.

Bảng phím có **33 chữ cái**: `A Ă Â B C D Đ E Ê F G H I J K L M N O Ô Ơ P Q R S T U Ư V W X Y Z`
(bốn chữ F J W Z giữ lại để chơi được các đáp án tiếng Anh).

Trong `game.js`, bảng `GROUPS` quy định mỗi phím mở những ký tự nào:

```js
'A': 'AÁÀẢÃẠ',   'Ă': 'ĂẮẰẲẴẶ',   'Â': 'ÂẤẦẨẪẬ',
'E': 'EÉÈẺẼẸ',   'Ê': 'ÊẾỀỂỄỆ',
'O': 'OÓÒỎÕỌ',   'Ô': 'ÔỐỒỔỖỘ',   'Ơ': 'ƠỚỜỞỠỢ',
'U': 'UÚÙỦŨỤ',   'Ư': 'ƯỨỪỬỮỰ',
'I': 'IÍÌỈĨỊ',   'Y': 'YÝỲỶỸỴ',   'Đ': 'Đ'
```

Nghĩa là:

- **A, Ă, Â là ba phím khác nhau.** Bấm `A` không mở được chữ `ă` hay `â`.
  Tương tự với E/Ê, O/Ô/Ơ, U/Ư và D/Đ.
- Chọn đúng nguyên âm gốc thì **mở hết mọi dấu thanh** của nguyên âm đó — bấm `Â`
  là lộ cả `â ấ ầ ẩ ẫ ậ`. Người chơi không phải đoán riêng từng dấu sắc huyền hỏi ngã nặng.

Riêng khi **đoán cả đáp án**, hàm `loose()` bỏ hết dấu trước khi so sánh, nên gõ
không dấu vẫn được tính đúng — để người chơi trên điện thoại không cần bộ gõ tiếng Việt.

---

## 5. Đưa game lên mạng cho bạn bè chơi

Vì đây là trang tĩnh nên chỗ nào cũng host được, đa số đều miễn phí:

- **Netlify Drop** — vào `app.netlify.com/drop`, kéo thả nguyên thư mục vào trang.
  Vài giây sau có link, không cần tạo tài khoản trước.
- **GitHub Pages** — đẩy thư mục lên một repo, vào *Settings → Pages*, chọn nhánh
  `main` và thư mục `/root`.
- **Cloudflare Pages** hoặc **Vercel** — tương tự, kết nối repo là xong.
- **Gửi thẳng file** — gửi `chiec-non-ky-dieu-1-file.html` qua Zalo, Messenger hay
  email. Người nhận tải về, nhấp đúp là chơi được, không cần mạng (trừ phông chữ
  Google Fonts, thiếu thì trình duyệt tự thay phông khác, game vẫn chạy bình thường).

---

## 6. Vài điều nên biết khi sửa

- File `game.js` bọc toàn bộ trong một IIFE `(function(){ ... })()` nên không có
  biến nào rò ra ngoài, trừ `window.QBANK` do `questions.js` tạo.
- Trạng thái ván chơi nằm gọn trong một đối tượng tên `S` ở đầu file. Muốn hiểu
  luồng chơi, đọc theo thứ tự: `spin()` → `land()` → `guess()` → `passTurn()` →
  `finishRound()` → `gameOver()`.
- Mọi phần vẽ vòng quay nằm trong `drawWheel()` bằng Canvas 2D. Hàm này được gọi
  lại mỗi khung hình khi quay, và mỗi 260 mili giây để nhấp nháy bóng đèn viền nón.
- Giao diện dựng lại qua bốn hàm `renderPlayers()`, `renderBoard()`, `renderLives()`,
  `renderKeys()`; `renderAll()` gọi gộp cả bốn.
- Trang cố tình chỉ có một tông màu tối kiểu sân khấu truyền hình, không có chế độ
  sáng. Nếu muốn thêm chế độ sáng thì phải định nghĩa lại các biến màu trong `:root`.

Chúc bạn sửa vui và cún con luôn được cứu kịp.
