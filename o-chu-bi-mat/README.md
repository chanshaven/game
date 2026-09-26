# Ô Chữ Bí Mật

Trò chơi ô chữ chạy hoàn toàn trong trình duyệt. Không cần cài đặt, không cần server,
không dùng thư viện ngoài nào. Mở file là chơi.

Mỗi ván có một **từ khoá hàng dọc** bị giấu. Bên trên là các **hàng ngang**, mỗi hàng
một câu hỏi, và mỗi hàng góp đúng một chữ cái cho từ khoá — chữ cái đó nằm trên dải
vàng chạy dọc giữa bảng.

Mở được hàng nào thì chữ cái của hàng đó sáng lên ở ô từ khoá phía dưới. Chưa cần mở
hết hàng vẫn đoán từ khoá được, và **đoán càng sớm thưởng càng cao**.

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
| Mở đúng một hàng ngang | **+10** |
| Đoán đúng từ khoá | **+100**, trừ dần 10 mỗi hàng đã dùng, thấp nhất **30** |
| Đoán sai từ khoá | **−15** và mất một lượt (có 3 lượt) |
| Dùng gợi ý | **tăng dần**: −5, −10, −15, −20… xem bên dưới |

- Trả lời sai hoặc hết giờ thì **hàng đó xám đi và khoá luôn**, không mở lại được.
- Hết 3 lượt đoán từ khoá là kết thúc ván.
- Xếp loại cuối ván: từ 150 điểm — *Xuất sắc*, 110 — *Giỏi*, 70 — *Khá*.

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

Lưu ý: bản 1 file vẫn có nút *Trang chủ* trỏ ra `../index.html`, mở lẻ một mình thì nút
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
