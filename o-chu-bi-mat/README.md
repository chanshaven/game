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

Có từ 2 bộ đề trở lên, game **tự hiện ô chọn chủ đề** trên thanh công cụ.

---

## 4. Luật chơi và cách tính điểm

| Việc | Điểm |
|---|---|
| Mở đúng một hàng ngang | **+10** |
| Dùng gợi ý (hiện chữ cái đầu) | **−5** |
| Đoán đúng từ khoá | **+100**, trừ dần 10 mỗi hàng đã dùng, thấp nhất **30** |
| Đoán sai từ khoá | **−15** và mất một lượt (có 3 lượt) |

- Trả lời sai hoặc hết giờ thì **hàng đó xám đi và khoá luôn**, không mở lại được.
- Hết 3 lượt đoán từ khoá là kết thúc ván.
- Xếp loại cuối ván: từ 150 điểm — *Xuất sắc*, 110 — *Giỏi*, 70 — *Khá*.

---

## 5. Mấy nút trên thanh công cụ

| Nút | Tác dụng |
|---|---|
| 🏠 **Trang chủ** | Quay về trang danh sách game |
| ✍️ **Bắt buộc gõ dấu** | Bật/tắt yêu cầu gõ đúng dấu tiếng Việt |
| ⏱️ **Giờ** | Đổi 30s → 45s → 60s → tắt đồng hồ |
| 🔊 **Âm thanh** | Tắt/bật tiếng |
| 🔄 **Chơi lại** | Bắt đầu lại từ đầu |

**Về chế độ gõ dấu** (mặc định bật): gõ `nhiet do` sẽ bị nhắc *"Gần đúng rồi, kiểm tra
lại dấu"* — ô nhập rung lên nhưng **không tính là sai, không khoá hàng**, gõ lại thoải
mái. Chỉ khi sai hẳn nội dung mới mất lượt. Phân biệt như vậy vì sai dấu là lỗi gõ,
không phải sai kiến thức.

Máy không có bộ gõ tiếng Việt thì dùng **thanh chữ có dấu** ngay dưới ô nhập
(Ă Â Đ Ê Ô Ơ Ư À Á Ả Ã Ạ), bấm là chèn vào đúng chỗ con trỏ.

Chữ hoa/thường và khoảng trắng không phân biệt: `Thực Vật` = `THỰCVẬT` = `thực vật`.

---

## 6. Gộp thành một file để gửi cho người khác

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

## 7. Đăng lên web

Thư mục này nằm cạnh `chiec-non-ky-dieu` trong thư mục `game`, và trang chủ
`game/index.html` đã có sẵn thẻ dẫn vào đây. Sửa xong chỉ cần:

```bash
git add .
git commit -m "Cập nhật Ô Chữ Bí Mật"
git push
```

Cloudflare tự deploy lại sau khoảng một phút.
