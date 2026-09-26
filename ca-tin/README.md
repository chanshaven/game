# Cả Tin

Trò chơi suy luận một người. Mỗi màn hiện ra một bảng luật viết rõ ràng — và bảng
luật đó nói dối. Người chơi phải thử, đọc sổ tay, rồi suy ra luật thật.

Qua màn bằng cách chọn đúng **ba lần liên tiếp**. Bàn chơi đổi sau mỗi lần thử nên
không thể ăn may, phải thật sự nắm được luật.

## Mỗi ván một bộ luật khác

Luật **không** nằm cứng trong code. Mỗi ván sinh ra sáu bảng luật mới, nên chơi lại
không thể dựa vào trí nhớ của ván trước.

Nhưng luật cũng không sinh bừa. Cái hay của game nằm ở chỗ bảng luật nói sai **một
cách có chủ đích**, nên phần được giữ cố định là *kiểu nói dối*, còn phần bốc ngẫu
nhiên chỉ là thuộc tính cụ thể. Ba thứ đổi mỗi ván:

1. Thuộc tính trong từng luật — lần này *lam + số chẵn*, lần sau *tam giác + số lớn hơn 5*
2. Kiểu nói dối của từng màn — bốc trong bậc khó của màn đó
3. Màn **nói thật** rơi vào đâu — đâu đó từ màn 3 đến màn 6

Điều thứ ba đáng giá nhất: vì không biết màn nào là màn thật, người chơi phải ôm câu
hỏi "lần này nó có đang nói thật không" suốt cả ván.

## Mã ván

Mỗi ván có một mã bốn ký tự, hiện ở chân trang và ở màn hình kết thúc. Luật được sinh
**ra từ** mã, không lưu vào máy — nên mở lại trang giữa chừng vẫn gặp đúng bộ luật cũ,
và gửi mã cho bạn bè là họ chơi đúng ván của mình.

Mở một ván cụ thể: thêm `?van=MÃ` vào cuối địa chỉ trang.

Bảng chữ dùng cho mã đã bỏ `0`, `O`, `1`, `I` để đọc qua điện thoại không nhầm.

## File

| File | Việc |
| --- | --- |
| `index.html` | Khung trang và toàn bộ CSS |
| `levels.js` | Bộ sinh luật: điều kiện, khuôn nói dối, bậc khó, lời Người dẫn đường |
| `game.js` | Logic: dựng bàn, chấm đúng sai, sổ tay, mã ván, xếp hạng |
| `build.js` | Gộp cả ba thành `ca-tin-1-file.html` để gửi qua Zalo |

## Sửa và mở rộng

**Thêm điều kiện mới** — mở `levels.js`, thêm vào mảng `ATOMS`. Mỗi điều kiện cần dạng
khẳng định và dạng phủ định viết sẵn, để câu tiếng Việt lúc nào cũng đọc xuôi:

```js
{ ax: 'so', pos: 'mang số nguyên tố', neg: 'mang số không nguyên tố',
  test: t => [2,3,5,7].indexOf(t.num) >= 0 }
```

**Thêm kiểu nói dối mới** — thêm vào `TEMPLATES`, rồi ghi tên nó vào `TIER_POOLS` ở bậc
khó phù hợp. `need` là số điều kiện cần bốc (mỗi cái nằm trên một thuộc tính khác nhau),
`used` là những thuộc tính mà **luật thật** dùng tới — gợi ý tự suy ra từ đó.

**Đổi độ dài ván** — sửa `TIER_PLAN`. Mảng này vừa quyết định số màn vừa quyết định bậc
khó của từng màn.

Bộ sinh tự loại những luật hỏng: ít hơn 4 ô hợp lệ trong tổng số 81 tổ hợp thì bàn chơi
không dựng đủ ô đúng, nhiều hơn 54 thì quá lỏng. Nó cũng tránh hai màn liền kề dùng cùng
kiểu nói dối hay cùng bộ thuộc tính, vì như thế màn sau sẽ tự lộ đáp án cho màn trước.

## Bốn kiểu nói dối chưa làm

Ghi trong tài liệu thiết kế, chưa đưa vào bản này vì cần trạng thái phức tạp hơn: luật
hết hạn giữa chừng, luật phụ thuộc lịch sử chọn, bảng luật tự sửa chữ khi bạn nhìn đi
chỗ khác, và giao diện nói dối.

## Chạy

Mở `index.html` bằng trình duyệt. Không cần cài gì, không cần server.

Muốn một file duy nhất để gửi đi: `node build.js`
