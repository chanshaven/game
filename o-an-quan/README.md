# Ô Ăn Quan

Trò chơi dân gian Việt Nam, bản chơi trên trình duyệt. Đấu với máy ba mức hoặc
hai người chung một máy. Mở `index.html` là chạy, không cần cài gì.

## Bàn cờ

Mười ô vuông chia hai bên, mỗi ô năm viên **dân**. Hai đầu là hai ô bán nguyệt,
mỗi ô một viên **quan**. Năm ô phía mình là phần mình.

Trong code bàn cờ không phải hình chữ nhật mà là **một vòng tròn**: sỏi chỉ chạy
vòng quanh theo một đường khép kín, nên cả ba cỡ bàn dùng chung một mảng ô.

    [quan 0] [5 ô người 0] [quan 1] [5 ô người 1] [quan 2] ...

Hai người ra đúng 12 ô như bàn cổ điển, ba người ra 18 ô, bốn người ra 24 ô.
`engine.js` đã chạy được cả ba; giao diện hiện mới vẽ bàn hai người.

## Luật

**Một lượt đi.** Bốc hết sỏi ở một ô của mình, rải mỗi ô một viên theo chiều đã
định. Rải hết viên cuối thì nhìn ô ngay sau đó:

| Ô kế tiếp | Kết quả |
| --- | --- |
| Còn sỏi | Bốc luôn ô ấy, rải tiếp |
| Trống | **Ăn** sỏi ở ô liền sau ô trống ấy |
| Ô quan | Mất lượt |
| Trống, rồi lại trống | Hết lượt |

Ăn xong mà lại gặp một ô trống nữa rồi một ô có sỏi thì **ăn liên hoàn**.

**Quan non.** Ô quan còn dưới năm dân thì chưa được ăn, rơi vào đúng thế đó thì
mất lượt. Đây là luật nhà, không phải luật gốc, nhưng thiếu nó thì *nước đi đầu
tiên của ván đã ăn được quan*: bốc ô sát ô quan, rải năm viên, ô kế tiếp còn sỏi
nên bốc tiếp, vòng lại đúng thế ăn quan. Đo 300 ván máy với máy: bỏ luật này thì
người đi trước thắng 76% và ván dài 44 lượt, có luật thì còn 70% và 50 lượt.
Bật tắt được ở mục "Luật và tuỳ chỉnh".

**Hết sỏi thì rải lại.** Đến lượt mà cả năm ô của mình trống thì lấy trong chỗ
sỏi đã ăn, mỗi ô một viên. Không đủ thì vay của đối thủ, cuối ván trả lại.

**Hết quan tàn dân.** Cả hai ô quan sạch sỏi là xong ván. Ai còn sỏi bên phần
mình thì vơ về. Dân một điểm, quan mười điểm (đổi được thành năm).

**Chiều rải.** Luật dân gian cho chọn chiều mỗi lượt. Bản này mặc định *khoá một
chiều* cho dễ học, mở "Mở rộng — tự chọn chiều" thì mỗi lượt được chọn trái phải.

## Máy đấu

| Mức | Cách nghĩ |
| --- | --- |
| Dễ | Gần như ngẫu nhiên, thấy ăn thì hơi thích |
| Thường | Tham ăn một nước, có ngó nước trả đũa |
| Khó | Minimax cắt tỉa alpha-beta, sâu 7 nước |

Ô ăn quan không có may rủi: cùng một thế, cùng một nước thì kết quả luôn như
nhau, nên minimax chạy thẳng không cần mô phỏng xác suất. Nhánh chỉ có năm nước
(mười nếu được chọn chiều) nên đào sâu bảy tầng vẫn nhẹ.

Đo trên `bench.js`, đổi bên cho công bằng: **Khó thắng Thường 91%**, **Thường
thắng Dễ 87%**. Khó đi trước thì thắng Thường trọn 50/50 ván.

## File

    index.html   giao diện + toàn bộ CSS
    engine.js    luật chơi, thuần logic, chạy được bằng node
    ai.js        ba mức máy
    game.js      vẽ bàn, hoạt ảnh rải sỏi, âm thanh
    test.js      chạy `node test.js` để đánh vài nghìn ván tự động
    bench.js     chạy `node bench.js` để đo cân bằng và sức mạnh ba mức máy
    build.js     chạy `node build.js` để gộp thành một file gửi qua Zalo

## Kiểm tra

    node test.js

Đánh vài nghìn ván máy với máy, kiểm ba thứ: sỏi không tự sinh tự mất, ván nào
cũng kết thúc, và ba mức máy mạnh dần lên. Có cả vài thế cờ dựng tay để soi từng
nước — ăn quan, quan non, rải lại khi hết dân.

## Người đi trước có lợi

Khoá một chiều thì người đi trước thắng **70%** (máy Thường đấu máy Thường, 300
ván). Cho chọn chiều thì cán cân lật hẳn: người đi trước chỉ còn thắng **27%** —
đi sau được nhìn nước của đối thủ rồi mới chọn hướng, lợi hơn hẳn.

Chênh lệch này là có thật trong trò chơi, không phải lỗi. Nên sau mỗi ván game
**tự đổi người đi trước**.

## Còn thiếu

- Bàn ba người hình tam giác và bốn người hình vuông: engine chạy được rồi,
  chưa có giao diện.
- Chơi qua mạng với bạn ở máy khác.
