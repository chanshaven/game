# Ô Chữ Bí Mật

Trò chơi ô chữ chạy hoàn toàn trong trình duyệt. Không cần cài đặt, không cần server,
không dùng thư viện ngoài nào. Mở file là chơi.

Mỗi ván có một **từ khoá hàng dọc** bị giấu. Bên trên là các **hàng ngang**, mỗi hàng
một câu hỏi, và mỗi hàng góp đúng một chữ cái cho từ khoá — chữ cái đó nằm trên dải
vàng chạy dọc giữa bảng.

Mở được hàng nào thì chữ cái của hàng đó sáng lên ở ô từ khoá phía dưới. Chưa cần mở
hết hàng vẫn đoán từ khoá được, và **đoán càng sớm thưởng càng cao**.

---

## 0. Hai màn hình

Mở file lên là thấy **màn giới thiệu** trước: *Chơi ngay · Luật chơi · Tuỳ chọn · Trang chủ*.
Bấm *Chơi ngay* mới vào bàn chơi; trong bàn chơi có nút **⬅️ Giới thiệu** để quay ra.

Quay ra giữa chừng **không mất ván** — màn giới thiệu sẽ đổi nút thành *⏯️ Chơi tiếp ván
đang dở*, bên dưới có thêm *🎲 Bắt đầu ván mới* nếu muốn bỏ ván cũ.

Cả hai màn nằm trong cùng một file `index.html`, không phải hai trang, nên bản gộp một
file cũng có đủ.

---

## 1. Chạy thử

**Cách nhanh nhất:** nhấp đúp vào `index.html`. Trình duyệt mở lên là chơi được ngay.

Nếu dùng VS Code, cài extension **Live Server** rồi bấm *Go Live* để trang tự tải lại
mỗi khi sửa code — tiện hơn khi chỉnh đề nhiều.

---

## 2. Cấu trúc thư mục

```
index.html                  giao diện + toàn bộ CSS
questions.js                ngân hàng bộ đề  <-- SỬA CÂU HỎI Ở ĐÂY
game.js                     toàn bộ logic trò chơi
build.js                    script gộp 3 file trên thành 1 file duy nhất
o-chu-bi-mat-1-file.html    bản gộp sẵn, để gửi cho người khác
README.md                   file bạn đang đọc
```

Sửa câu hỏi thì **chỉ cần đụng vào `questions.js`**. Hai file kia để yên cũng được.

---

## 3. Thêm hoặc sửa bộ đề

Mở `questions.js`. Mỗi bộ đề là một khối `{ }` như thế này:

```js
{
  topic: "Thế giới thực vật",     // tên chủ đề, hiện ở góc trên màn hình
  keyword: "THỰC VẬT",            // TỪ KHOÁ hàng dọc, viết HOA có dấu
  rows: [
    ["NHIỆT ĐỘ", 4, "Đây là một yếu tố mà khi tăng quá cao..."],
    ["ÁNH SÁNG", 2, "Đây là yếu tố quan trọng giúp cây quang hợp."],
    // ... mỗi chữ cái của từ khoá là một hàng
  ]
}
```

Mỗi hàng ngang viết theo dạng `["ĐÁP ÁN", k, "Câu hỏi"]`.

### Con số `k` là gì

`k` là **vị trí chữ cái của hàng này nằm trên cột từ khoá**, đếm từ 0 và không tính
dấu cách.

Từ khoá `THỰC VẬT` bỏ dấu cách ra là `T H Ự C V Ậ T` — 7 chữ, nên phải có 7 hàng ngang.
Chữ đầu tiên là **T**, tức hàng 1 phải chứa chữ T:

```
đáp án hàng 1:   N  H  I  Ệ  T  Đ  Ộ
vị trí:          0  1  2  3  4  5  6
                             ^
                          chữ T ở vị trí 4   ->   k = 4
```

**Lười đếm thì ghi `null` thay cho số**, game sẽ tự dò:

```js
["NHIỆT ĐỘ", null, "Đây là một yếu tố..."]
```

Nếu chữ đó xuất hiện nhiều lần trong đáp án (ví dụ `CÁNH HOA` có hai chữ H), game lấy
chỗ đầu tiên và nhắc trong Console. Muốn chỗ khác thì ghi rõ số.

### Hai quy tắc bắt buộc

1. **Số hàng ngang = số chữ cái của từ khoá** (không tính dấu cách).
2. Chữ ở vị trí `k` của mỗi đáp án phải **đúng bằng** chữ cái tương ứng của từ khoá.

Sai chỗ nào, mở **Console** (phím `F12` → tab Console) sẽ thấy báo đỏ chỉ rõ bộ đề nào,
hàng nào, sai ra sao. Ví dụ:

```
[Ô chữ] Bộ đề 1 hàng 3 ("SỰ SỐNG"): vị trí k=2 là chữ "S" nhưng từ khoá cần chữ "Ự".
```

### Thêm bộ đề thứ hai trở đi

Chép nguyên một khối `{ ... }`, dán xuống dưới, **nhớ dấu phẩy ngăn giữa hai khối**:

```js
(window.DEBANK = window.DEBANK || []).push(

{ topic: "Thế giới thực vật", keyword: "THỰC VẬT", rows: [ ... ] },

{ topic: "Lịch sử Việt Nam",  keyword: "ĐỘC LẬP",  rows: [ ... ] }

);
```

Có từ 2 bộ đề trở lên, game **tự hiện ô chọn chủ đề** trên thanh công cụ, và mỗi lần mở
game sẽ **bốc ngẫu nhiên** một bộ (xem mục 5).

Danh sách trong ô chọn cố ý **chỉ ghi tên chủ đề và số hàng, không ghi từ khoá** — kẻo
học sinh nhìn vào là biết đáp án.

---

## 4. Luật chơi và cách tính điểm

| Việc | Điểm |
|---|---|
| Mở đúng một hàng ngang | **70 ÷ số hàng** — ô chữ 7 hàng thì +10, ô chữ 12 hàng thì +6 |
| Đoán đúng từ khoá | **130 × (số hàng còn kín ÷ tổng số hàng)** |
| Đoán sai từ khoá | **−20** và phần thưởng còn **60%**, mất một lượt (có 3 lượt) |
| Dùng gợi ý | **tăng dần**: −5, −10, −15, −20… xem bên dưới |

- Trả lời sai hoặc hết giờ thì **hàng đó xám đi và khoá luôn**, không mở lại được.
- Hết 3 lượt đoán từ khoá là kết thúc ván.
- Xếp loại cuối ván: từ 150 điểm — *Xuất sắc*, 110 — *Giỏi*, 70 — *Khá*.

### Đoán càng sớm càng được nhiều

Đây là trục chính của cách tính điểm, nên viết kỹ một chút.

Mỗi hàng mở ra cho bạn điểm, **nhưng cũng để lộ một chữ cái của từ khoá**, nên nó ăn bớt
phần thưởng từ khoá. Phần bị ăn bớt **luôn lớn hơn** số điểm vừa nhận, vì vậy tổng điểm
giảm đều theo từng hàng. Ô chữ 7 hàng:

| Lúc đoán từ khoá | Điểm hàng | Thưởng | **Tổng** |
|---|---|---|---|
| Chưa mở hàng nào — *đoán mù* | 0 | 130 | **130** |
| Mở 1 hàng | 10 | 111 | **121** |
| Mở 2 hàng | 20 | 93 | **113** |
| Mở 4 hàng | 40 | 56 | **96** |
| Giải hết 7 hàng | 70 | 0 | **70** |

Nhờ vậy **không có kiểu mở gần hết rồi mới đoán cho chắc ăn** — càng chần chừ càng mất
điểm. Mở hết thì thưởng về 0, đúng thôi: lúc đó cả từ khoá đã hiện ra, đoán không còn là
tài nữa.

Đường điểm này giảm đều với mọi cỡ ô chữ, từ 4 hàng đến 12 hàng, vì **điểm mỗi hàng =
70 ÷ số hàng**. Đồng thời ô chữ ngắn và ô chữ dài đều đáng giá như nhau (tối đa ~130đ) —
quan trọng khi cộng dồn qua nhiều ván, chứ tính cứng +10 mỗi hàng thì ô chữ 12 hàng tự
nhiên được gấp ba ô chữ 4 hàng.

**Trả lời sai một hàng ngang không bị trừ vào phần thưởng.** Hàng sai có lộ chữ nào đâu;
bạn đã mất số điểm của hàng đó rồi, không phạt thêm lần nữa.

### Cái giá của việc đoán bừa

Chốt từ khoá phải là một canh bạc thật, không phải bấm cho vui. Mỗi lần đoán sai:

- **mất ngay 20 điểm**, và
- **phần thưởng từ khoá teo lại còn 60%** cho những lần sau.

Vế thứ hai mới là vế nặng: đoán bừa là tự phá món quà mình đang nhắm tới, và nó có tác
dụng **kể cả khi người chơi đang 0 điểm** — không còn kẽ hở kiểu "hết điểm rồi thì đoán
liều thoải mái".

| Kết cục | Được |
|---|---|
| Trúng ngay lần đầu | **130đ** |
| Sai 1 lần rồi mới trúng | 58đ |
| Sai 2 lần rồi mới trúng | 7đ |
| Sai cả 3 lần | hết lượt, ván kết thúc |

Hộp đoán từ khoá luôn ghi sẵn **đúng được bao nhiêu** và **sai thì thưởng còn bao nhiêu**
ngay trước nút Chốt, nên người chơi cân nhắc có đủ thông tin rồi mới quyết. Đến lượt cuối
thì dòng đó đổi thành *"−20đ và hết lượt, kết thúc ván"*.

Nhãn **ĐOÁN MÙ** cũng mất ngay sau lần đoán sai đầu tiên — đã sai một lần thì không còn
gọi là đoán mù nữa.

Ô *Thưởng từ khoá* trên bảng điểm hiện sẵn nhãn **ĐOÁN MÙ** khi chưa mở hàng nào, và tụt
dần mỗi lần bạn mở thêm một hàng. Đoán mù trúng thì bảng kết quả hiện riêng dòng
**ĐOÁN MÙ!** kèm pháo giấy nổ hai lần.

### Bỏ qua ván

Gặp ô chữ quá khó, bấm **⏭️ Bỏ qua ván** ở cạnh nút đoán từ khoá. Game hỏi lại một lần,
cho biết sẽ mất bao nhiêu điểm rồi mới thực hiện.

Giá của việc bỏ cuộc là **một nửa số điểm của ván đó** (làm tròn xuống, ví dụ 95đ còn
48đ). Đổi lại bạn thấy ngay toàn bộ đáp án và sang được ô chữ khác. Chưa có điểm nào thì
không mất gì.

### Gợi ý

Mỗi hàng ngang được gợi ý nhiều lần, mỗi lần mở thêm **một chữ cái** tính từ trái sang.
Nhưng **càng xin càng đắt**: lần đầu −5, lần hai −10, lần ba −15, cứ thế tăng thêm 5.

Số lần tối đa bằng **một phần ba số chữ** của đáp án, nên đáp án dài mới được nhiều:

| Đáp án | Số gợi ý tối đa | Tổng điểm mất nếu xin hết |
|---|---|---|
| 4–6 chữ | 2 | 15 |
| 7–9 chữ | 3 | 30 |
| 10–12 chữ | 4 | 50 |
| 13 chữ trở lên | 5 | 75 |

**Ô nằm trên cột từ khoá không bao giờ bị gợi ý** — đó là phần cốt lõi của trò chơi,
muốn có chữ đó thì phải trả lời đúng cả hàng.

Nút gợi ý luôn hiện sẵn giá của lần bấm kế tiếp và số lần đã dùng, ví dụ
`💡 Gợi ý −10đ 1/3`.

---

## 5. Chơi liền nhiều ô chữ

Mở game lên là **bốc ngẫu nhiên** một bộ đề trong ngân hàng. Giải xong, bảng kết quả có
nút **▶️ Ô chữ tiếp theo** để sang bộ khác ngay, kèm số bộ còn lại chưa chơi.

Game xáo toàn bộ ngân hàng thành một "túi" rồi rút dần, nên **chơi hết lượt mới lặp
lại**, không bị trúng đi trúng lại một đề. Hết túi thì tự xáo lại từ đầu.

Điểm được **cộng dồn qua các ván**: dòng phụ đề trên đầu hiện `Ván 3 · Tổng 285đ`, và
bảng kết quả từ ván thứ hai trở đi hiện thêm *Tổng cộng sau N ván*.

Muốn chơi mãi một chủ đề (ví dụ đang dạy bài nào đó) thì chọn chủ đề cụ thể trong ô
**🎲 Ngẫu nhiên** trên thanh công cụ — lúc đó nút sẽ thành *Chơi lại chủ đề này*. Chọn
lại `🎲 Ngẫu nhiên` để quay về chế độ bốc thăm.

---

## 6. Mấy nút trên thanh công cụ

| Nút | Tác dụng |
|---|---|
| 🏠 **Trang chủ** | Quay về trang danh sách game |
| 🎲 **Ngẫu nhiên** | Ô chọn chủ đề — để nguyên là mỗi ván một đề khác nhau |
| ✍️ **Bắt buộc gõ dấu** | Bật/tắt yêu cầu gõ đúng dấu tiếng Việt |
| ⏱️ **Giờ** | Đổi 40s → 60s → 90s → tắt đồng hồ (mặc định 40s) |
| 🎵 **Nhạc nền** | Tắt/bật nhạc nền |
| 🔊 **Âm thanh** | Tắt/bật tiếng hiệu ứng (đúng, sai, đếm ngược) |
| 🔄 **Chơi lại** | Bắt đầu lại từ đầu |

**Về chế độ gõ dấu** (mặc định bật): gõ `nhiet do` sẽ bị nhắc *"Gần đúng rồi, kiểm tra
lại dấu"* — ô nhập rung lên nhưng **không tính là sai, không khoá hàng**, gõ lại thoải
mái. Chỉ khi sai hẳn nội dung mới mất lượt. Phân biệt như vậy vì sai dấu là lỗi gõ,
không phải sai kiến thức.

Máy không có bộ gõ tiếng Việt thì dùng **thanh chữ có dấu** ngay dưới ô nhập
(Ă Â Đ Ê Ô Ơ Ư À Á Ả Ã Ạ), bấm là chèn vào đúng chỗ con trỏ.

Chữ hoa/thường và khoảng trắng không phân biệt: `Thực Vật` = `THỰCVẬT` = `thực vật`.

---

## 7. Nhạc nền

Nhạc **sinh ra ngay trong trình duyệt bằng Web Audio**, không có file mp3 nào cả —
thư mục vẫn nhẹ và không dính bản quyền của ai.

Đó là một vòng lặp dài khoảng 23 giây: hợp âm **Am – F – C – G**, giai điệu kiểu hộp
nhạc ở giọng La thứ, thêm bè trầm, tiếng đệm nhẹ và hi-hat khẽ. Nhịp 84 BPM, chậm và
êm, vì đây là game phải ngồi nghĩ chứ không phải game gấp gáp.

Vài điều đã xử lý sẵn:

- Trình duyệt cấm phát tiếng trước khi người dùng chạm vào trang, nên nhạc chỉ thật sự
  bắt đầu ở **cú bấm đầu tiên**. Không phải lỗi.
- Mở bảng câu hỏi thì nhạc **tự nhỏ xuống còn 40%**, đóng lại thì to trở lại — để người
  dẫn chương trình đọc câu hỏi còn nghe rõ.
- Chuyển sang tab khác thì nhạc tạm dừng, quay lại tự chạy tiếp.
- Nhạc và hiệu ứng đi qua **một bộ nén** ở cuối, nên lúc thắng cuộc cả chục nốt chồng
  lên nhau vẫn không chói tai.

### Muốn đổi nhạc

Mở `game.js`, tìm khối `NHẠC NỀN` rồi sửa hai mảng:

```js
const CHORDS = [[57,60,64],[53,57,60],[52,55,60],[55,59,62], ...];  // hợp âm mỗi ô nhịp
const MEL = [
  [69, 0,72, 0,76, 0,74, 0],   // 8 nốt móc đơn của ô nhịp 1, số 0 là nghỉ
  ...
];
const BPM = 84;                 // nhanh chậm
const MUSIC_VOL = 0.34;         // to nhỏ
```

Số trong mảng là **cao độ MIDI**: 60 = Đô giữa, 69 = La giữa, cứ +12 là lên một quãng
tám. `MEL` có 8 dòng ứng với 8 ô nhịp, mỗi dòng 8 nốt móc đơn.

---

## 8. Gộp thành một file để gửi cho người khác

Sửa đề xong, chạy:

```bash
node build.js
```

Script sẽ nhét `questions.js` và `game.js` thẳng vào trong HTML và ghi ra
`o-chu-bi-mat-1-file.html`. File đó **tự chứa mọi thứ** — gửi qua Zalo, email, USB đều
được, người nhận mở ra là chơi, không cần thư mục kèm theo.

Lưu ý: nút *Trang chủ Fiddle Game* ở màn giới thiệu trỏ ra `../index.html`, mở lẻ một mình thì nút
đó sẽ không dẫn đi đâu cả. Không sao, mấy nút khác vẫn chạy bình thường.

---

## 9. Đăng lên web

Thư mục này nằm cạnh `chiec-non-ky-dieu` trong thư mục `game`, và trang chủ
`game/index.html` đã có sẵn thẻ dẫn vào đây. Sửa xong chỉ cần:

```bash
git add .
git commit -m "Cập nhật Ô Chữ Bí Mật"
git push
```

Cloudflare tự deploy lại sau khoảng một phút.
