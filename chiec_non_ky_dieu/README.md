# Chiếc Nón Kỳ Diệu — Giải cứu cún con

Trò chơi ô chữ chạy hoàn toàn trong trình duyệt. Không cần cài đặt, không cần server,
không dùng thư viện ngoài nào. Mở file là chơi.

Mỗi ván có một **câu hỏi hiện sẵn** phía trên ô chữ, đáp án của câu hỏi chính là ô chữ
phải mở. Bên cạnh vòng quay là **cảnh cún con đang bị vây bắt**: năm trái tim ở góc
dưới đếm số mạng còn lại, và cứ mất một tim là kẻ bắt cún lại tiến sát thêm một bước,
trời tối thêm một mức, cún run và hoảng sợ hơn. Hết 5 tim là cún bị chụp lưới.

Mất một tim khi: đoán sai chữ cái, hoặc quay trúng **MẤT LƯỢT**, **MẤT ĐIỂM**,
**CÚN GẶP NGUY**, bốc trúng hộp phạt ở **XUI RỒI**, hoặc trả lời hỏng ô **THỬ THÁCH**.
Riêng **CƯỢC ĐÔI** nếu nhận cược mà sai thì mất hai tim.

Đang chơi dở muốn bỏ ngang thì bấm **Thoát ván** ở góc trên bên phải để quay về
màn hình chọn cách chơi.

---

## 1. Chạy thử

**Cách nhanh nhất:** nhấp đúp vào `index.html`. Trình duyệt sẽ mở và chơi được ngay.

Nếu bạn dùng VS Code, cài extension **Live Server** rồi bấm *Go Live* để trang tự
tải lại mỗi khi bạn sửa code — tiện hơn khi chỉnh sửa nhiều.

---

## 2. Cấu trúc thư mục

```
index.html      giao diện + toàn bộ CSS + cảnh cún vẽ bằng SVG + bảng điểm nổi
questions.js    ngân hàng 496 ô chữ kèm câu hỏi, chia 6 phần theo chủ đề
challenges.js   ngân hàng 120 câu đố phụ cho ô THỬ THÁCH
game.js         toàn bộ logic trò chơi
chiec-non-ky-dieu-1-file.html
                bản gộp cả 4 file trên thành MỘT file duy nhất —
                tiện để gửi qua Zalo/email hoặc chép vào USB
```

Bản 1 file và bản nhiều file có nội dung y hệt nhau. Sửa bản nhiều file thì dễ đọc
hơn; khi xong, nếu muốn có lại bản 1 file, chỉ cần chép nội dung `questions.js`,
`challenges.js` và `game.js` vào đúng ba thẻ `<script>` trong file gộp.

---

## 3. Những chỗ hay sửa nhất

### Thêm hoặc sửa câu hỏi — `questions.js`

Mỗi ô chữ là một dòng gồm ba phần: **đáp án**, **chủ đề**, **câu hỏi**.

```js
["ĂN QUẢ NHỚ KẺ TRỒNG CÂY", "Tục ngữ",
 "Câu tục ngữ nào dạy ta phải biết ơn người đã tạo ra thành quả cho mình hưởng?"],
```

Quy tắc cho **đáp án**:

- Viết HOA toàn bộ, **có dấu đầy đủ**.
- Chỉ dùng chữ cái và dấu cách. Không dùng dấu phẩy, dấu chấm, gạch nối, ngoặc
  kép hay chữ số — viết `MƯỜI` thay cho `10`.
- Dấu cách chính là chỗ ngắt từ trên bảng ô chữ.

Quy tắc cho **câu hỏi**:

- Phải tự đứng được một mình. Người chơi đọc là hiểu ngay phải đoán cái gì,
  không cần biết chủ đề — vì trò chơi **không hiện chủ đề** ra màn hình.
- Nên kết thúc bằng dấu hỏi.
- Với câu tiếng Anh thì hỏi bằng tiếng Việt, ví dụ *"Bông tuyết trong tiếng Anh
  gọi là gì?"* cho đáp án `SNOWFLAKE`.

**Chủ đề** (phần giữa) chỉ để bạn sắp xếp file cho gọn, trò chơi không dùng tới.

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

Các loại `t` đang có: `pts` (điểm), `lose` (mất lượt, mất một tim),
`double` (gấp đôi), `half` (chia đôi), `life` (thêm một tim),
`lucky` (ba hộp quà), `unlucky` (ba hộp phạt), `quiz` (câu đố phụ THỬ THÁCH),
`gift` (tặng 1000 điểm), `zero` (điểm về 0 và mất một tim),
`danger` (mất ngay một tim), `bet` (cược đôi — người chơi tự chọn nhận hay bỏ).

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

> Nếu đổi `START_LIVES` khác 5, nhớ sửa luôn phần cảnh cún ở mục dưới, vì cảnh
> được vẽ sẵn đúng 6 mức nguy hiểm tương ứng với 5 mạng.

**Muốn game dễ thở hơn** thì bỏ dòng `loseLives(p, 1);` trong nhánh `case 'lose'`
(ô MẤT LƯỢT) của hàm `land()` — ô đó sẽ chỉ mất lượt chứ không mất tim nữa.
**Muốn khó hơn nữa** thì thêm `loseLives(p, 1);` vào nhánh `case 'half'` (ô CHIA ĐÔI).

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

### Nhạc nền và tiếng động — `game.js`

Tất cả âm thanh đều tổng hợp trực tiếp bằng Web Audio API nên không có file mp3 nào.
Toàn bộ nằm trong đối tượng `sfx`:

| Lúc nào | Hàm | Nghe ra sao |
|---|---|---|
| Bấm QUAY | `sfx.whoosh()` | tiếng gió rít quét từ trầm lên cao rồi tắt |
| Kim đi qua từng ô | `sfx.tick()` | tick tick khô, gọi mỗi lần đổi ô |
| Đoán đúng chữ | `sfx.good()` | ba nốt đi lên kèm `sfx.sparkle()` lấp lánh |
| Đoán sai | `sfx.bad()` | còi báo lỗi rồi `sfx.whimper()` — cún kêu ư ử |
| Mất một tim | `sfx.alarm()` | hai tiếng bíp cảnh báo, tự phát trong `loseLives` |
| Mở bảng ĐOÁN ĐÁP ÁN và đang làm THỬ THÁCH | `sfx.tensionStart()` / `sfx.tensionStop()` | nền trầm rung kèm nhịp tim, chạy tới khi đóng bảng |
| Giải được ô chữ | `sfx.victory()` + `confetti()` | kèn fanfare và pháo giấy rơi đầy màn hình |
| Đoán sai đáp án, cún bị bắt | `sfx.dramaticFail()` | bốn nốt tụt dần, một tiếng trầm rền rồi cún kêu |

Pháo giấy vẽ bằng Canvas trong hàm `confetti()` — sửa số `160` để thêm bớt mảnh giấy,
sửa mảng `cols` để đổi màu.

Nhạc nền:

- Giai điệu: mảng `MEL` (8 ô nhịp, mỗi ô 8 nốt, số là cao độ MIDI, `0` là nghỉ).
- Hợp âm: mảng `CHORDS`.
- Tốc độ: hằng số `BPM`.
- Âm lượng nhạc nền: số `0.2` trong hàm `setMusic`.
- Các tiếng động: đối tượng `sfx` (tick, good, bad, big, fail, life, whoosh).

Nếu bạn muốn dùng nhạc mp3 có sẵn thay cho nhạc tổng hợp, thêm thẻ
`<audio id="bgm" src="nhac.mp3" loop>` vào HTML rồi gọi `document.getElementById('bgm').play()`
trong hàm `setMusic`. Nhớ chỉ dùng nhạc bạn có quyền sử dụng.

### Sửa quà và phạt của ô MAY MẮN / XUI RỒI — `game.js`

Hai mảng `GIFTS` và `CURSES` nằm cạnh nhau trong `game.js`. Mỗi phần tử gồm nhãn hiện
trên hộp và hàm áp dụng hiệu ứng:

```js
{ t: 'Thêm 1.500 điểm', run: p => { p.score += 1500; return 'được thưởng 1.500 điểm'; } },
{ t: 'Mất một trái tim', run: p => { loseLives(p, 1); return 'mất một trái tim'; } },
```

`p` là người đang chơi (`p.score`, `p.lives`). Chuỗi trả về được ghép vào câu thông báo
nên hãy viết theo dạng *"được ..."* / *"mất ..."*. Các hàm dùng được: `gainLives(p, n)`,
`loseLives(p, n)`, `revealRandom(n)` (mở n chữ cái ngẫu nhiên), `fmt(số)`.

Mỗi lượt trò chơi bốc ngẫu nhiên **3 phần** trong mảng, mở ra cho người chơi xem 1,8 giây,
úp xuống rồi xáo 5 lần trước khi cho chọn. Muốn xáo lâu hơn thì sửa số `5` và số `440`
(mili giây mỗi lần xáo) trong hàm `boxPick`.

### Sửa câu đố của ô THỬ THÁCH — `challenges.js`

Mỗi dòng là `["Câu hỏi", ["đáp án ĐÚNG", "sai", "sai"]]` — đáp án đúng luôn đứng đầu,
trò chơi tự xáo thứ tự khi hiện lên. Thời gian trả lời 15 giây nằm ở hai chỗ trong hàm
`openChallenge`: chuỗi `'width 15s linear'` và số `15000`. Mức thưởng phạt cũng ở đó
(`p.score += 1000`, `revealRandom(1)`, `loseLives(p, 1)`).

---

## 4. Cảnh giải cứu cún hoạt động thế nào

Đây là phần vui nhất để nghịch. Toàn bộ cảnh là **một khối SVG vẽ tay** nằm trong
`index.html`, bên trong `<div class="scene" id="scene" data-danger="0">`.

Mọi thứ được điều khiển bằng **một thuộc tính duy nhất**: `data-danger` nhận giá trị
từ `0` tới `5`, do hàm `renderScene()` trong `game.js` đặt theo công thức

```js
danger = START_LIVES - số mạng còn lại   // 5 mạng -> 0,  0 mạng -> 5
```

Phần CSS trong `index.html` lo phần còn lại:

| Sửa gì | Chỗ sửa trong CSS |
|---|---|
| Màu trời, màu đồi, màu cỏ theo từng mức | các dòng `.scene[data-danger="N"]{ --sky1 --sky2 --hill --ground --fence --alarm }` |
| Kẻ bắt cún đứng gần hay xa | `.scene[data-danger="N"] .catcher{ --cx: ... }` — `352px` là xa nhất, `193px` là lúc lưới trùm lên cún. Khoảng cách giữa các mức cố tình thu hẹp dần để càng ít tim thì hắn lao tới càng nhanh |
| Cún lùi lại khi hắn tới gần | biến `--dogx` trong các dòng `.scene[data-danger="N"]` |
| Nét mặt cún | năm nhóm `.f-calm`, `.f-worry`, `.f-panic`, `.f-terror`, `.f-caught`; các dòng `.scene[data-danger="N"] .f-xxx{display:block}` quyết định mức nào dùng mặt nào |
| Tai cún cụp xuống | các dòng `.scene[data-danger="N"] .ear-l / .ear-r{transform:rotate(...)}` |
| Cún run rẩy | `@keyframes tremble` (mức 2 và 3, càng cao càng nhanh) và `@keyframes terror` (mức 4, run mạnh kèm lắc người) |
| Cún vẫy đuôi | `@keyframes wag`, chỉ bật ở mức 0 |
| Dấu chấm than cảnh báo | nhóm `.warnmark`, hiện từ mức 2, càng cao nhảy càng nhanh |
| Viền đỏ báo động nhấp nháy | `.scene::after` và `@keyframes alarmPulse`, bật ở mức 4 và 5 |
| Hàng trái tim | `.hudHearts` và `@keyframes beat` — tim đập nhanh dần từ mức 3 |
| Rung cả khung khi mất mạng | `@keyframes shakeScene`, do hàm `shakeScene()` trong `game.js` gọi |

Điểm của người đang chơi nổi ngay trên khung cún, trong khối `.hud` — gồm `.hudMain`
(tên và điểm người đang tới lượt) và `.hudRivals` (tim và điểm của những người còn lại,
chỉ hiện ở chế độ nhiều người). Hàng tim nằm riêng ở `.hudHearts` góc dưới trái.
Hàm `renderScene()` trong `game.js` cập nhật cả bốn thứ: mức nguy hiểm, điểm, hàng tim
và danh sách đối thủ.

**Muốn đổi cún thành mèo** thì sửa nhóm `<g class="dogc">` trong SVG. **Muốn đổi
kẻ bắt cún thành thứ khác** (nước dâng, quái vật, quả bóng bay xì hơi...) thì sửa
nhóm `<g class="catcher">` và các giá trị `--cx`.

---

## 5. Cách chữ cái tiếng Việt được xử lý

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

## 6. Đưa game lên mạng cho bạn bè chơi

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

## 7. Vài điều nên biết khi sửa

- File `game.js` bọc toàn bộ trong một IIFE `(function(){ ... })()` nên không có
  biến nào rò ra ngoài, trừ `window.QBANK` do `questions.js` tạo.
- Trạng thái ván chơi nằm gọn trong một đối tượng tên `S` ở đầu file. Muốn hiểu
  luồng chơi, đọc theo thứ tự: `spin()` → `land()` → `guess()` → `passTurn()` →
  `finishRound()` → `gameOver()`.
- Mọi phần vẽ vòng quay nằm trong `drawWheel()` bằng Canvas 2D. Hàm này được gọi
  lại mỗi khung hình khi quay, và mỗi 260 mili giây để nhấp nháy bóng đèn viền nón.
- Giao diện dựng lại qua ba hàm `renderScene()`, `renderBoard()` và
  `renderKeys()`; `renderAll()` gọi `renderScene()` cùng `updateControls()`.
- Trang cố tình chỉ có một tông màu tối kiểu sân khấu truyền hình, không có chế độ
  sáng. Nếu muốn thêm chế độ sáng thì phải định nghĩa lại các biến màu trong `:root`.

Chúc bạn sửa vui và cún con luôn được cứu kịp.
