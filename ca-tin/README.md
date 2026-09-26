# Cả Tin

Trò chơi suy luận một người. Mỗi màn hiện ra một bảng luật viết rõ ràng — và bảng
luật đó nói dối. Người chơi phải thử, đọc sổ tay, rồi suy ra luật thật.

Qua màn bằng cách chọn đúng **ba lần liên tiếp**. Bàn chơi đổi sau mỗi lần thử nên
không thể ăn may, phải thật sự nắm được luật.

Chín màn: tám màn sinh ra mỗi ván một khác, và màn thứ chín luôn cố định.

## Mỗi ván một bộ luật khác

Luật **không** nằm cứng trong code. Mỗi ván sinh ra chín bảng luật mới, nên chơi lại
không thể dựa vào trí nhớ của ván trước.

Nhưng luật cũng không sinh bừa. Cái hay của game nằm ở chỗ bảng luật nói sai **một
cách có chủ đích**, nên phần được giữ cố định là *kiểu nói dối*, còn phần bốc ngẫu
nhiên chỉ là thuộc tính cụ thể. Ba thứ đổi mỗi ván:

1. Thuộc tính trong từng luật — lần này *lam + số chẵn*, lần sau *tam giác + số lớn hơn 5*
2. Kiểu nói dối của từng màn — bốc trong bậc khó của màn đó
3. Màn **nói thật** rơi vào đâu — đâu đó từ màn 3 đến màn 8

Điều thứ ba đáng giá nhất: vì không biết màn nào là màn thật, người chơi phải ôm câu
hỏi "lần này nó có đang nói thật không" suốt cả ván.

## Màn cuối

Bảng luật màn chín chỉ có một dòng: **"Luật chơi là lời nói dối."**

Nếu câu đó đúng thì nó đang nói dối, nên nó sai. Nếu nó sai thì bảng luật đang nói
thật, nên nó đúng. Không ô nào trên bàn cho ra kết quả đúng — và đó không phải lỗi,
đó là cả màn chơi.

Cách qua màn là **ngừng chạm vào bàn**. Sau 3,5 giây yên lặng, một nét gạch bắt đầu
kéo ngang chính dòng chữ đang nói dối, mất 7 giây để đi hết. Chạm vào bất cứ đâu là
nét gạch tan và phải làm lại.

Nét gạch ấy là chỗ quan trọng nhất của thiết kế này. Bản đầu trong tài liệu định để
người chơi đợi mù ba mươi giây, nhưng đợi mù thì chỉ thành bực chứ không thành hiểu.
Phải **cho thấy** việc không làm gì cũng là một nước đi, ngay lúc nó đang có tác dụng.

Ba câu thả dần khi người chơi càng thử càng sai, ở lần thứ 5, 12 và 20 — câu cuối là
chìa khoá: *"Tôi chưa bao giờ nói bạn phải chọn."*

## Đếm cái đáng đếm

Cuối ván có hai con số. Số lần thử đo kỹ năng. Con số kia đo đúng thứ trò chơi này
nói về: **số lần bạn tin bảng luật** — tức số màn mà nước đi đầu tiên của bạn làm
đúng y như bảng luật bảo.

Ở màn nghịch lý, chạm vào bàn dù chỉ một lần cũng tính là tin, vì bạn vẫn tin rằng
có gì đó để chọn.

Câu kết của Người dẫn đường đổi theo con số này chứ không theo điểm.

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
| `audio.js` | Nhạc nền và hiệu ứng, sinh bằng WebAudio |
| `game.js` | Logic: dựng bàn, chấm đúng sai, sổ tay, mã ván, xếp hạng |
| `build.js` | Gộp cả bốn thành `ca-tin-1-file.html` để gửi qua Zalo |

## Âm thanh

Không dùng file nhạc nào — tất cả sinh bằng WebAudio, nên bản một file gửi đi vẫn
kêu và không phải tải kèm gì.

Nhạc nền là một bản marimba vui nhộn, 112 nhịp một phút, tự sinh khi chơi chứ
không lặp lại y hệt. Bè trầm đánh nốt gốc và quãng năm xen kẽ theo từng phách nên
nghe nhún; giai điệu chạy móc đơn trong thang ngũ cung, có đảo phách và có chỗ
nghỉ; vòng hoà âm Đô trưởng - La thứ - Fa trưởng - Sol, mỗi ô nhịp một hợp âm.

Tiếng marimba dựng bằng cộng hài âm chứ không lọc. Hài âm thứ tư rất mạnh và tắt
nhanh hơn nốt gốc — chính hai chỗ đó cho ra chất gỗ. Thêm hài âm thứ mười tắt rất
nhanh làm tiếng dùi gõ vào thanh. Đường tắt dần dùng `setTargetAtTime`, cho ra
đúng đường cong e mũ trừ, tức đúng cách một vật rung tắt dần trong đời thật.

Nốt được đặt trước hai ô nhịp và hẹn theo đồng hồ của WebAudio, nên tiết tấu
chính xác từng mili giây dù `setTimeout` chạy không đều.

Nút loa ở góc phải trên bật tắt cả nhạc lẫn hiệu ứng, và **nhớ lựa chọn** cho lần
sau. Hai game kia chưa có nút này.

Trình duyệt nào cũng chặn tự phát nhạc, nên nhạc chỉ bắt đầu sau khi người chơi bấm
một nút ở màn hình mở đầu. Chỉnh nhanh trong `audio.js`: `MUSIC_VOL` to nhỏ, `BPM` nhanh chậm, `REST_CHANCE` thưa dày.

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

Bàn chơi dựng bằng cách bốc cả bàn rồi đếm, không đạt thì bốc lại — vì luật giờ có thể
phụ thuộc vào chỗ ô nằm và vào nước đi trước, không chọn sẵn ô đúng ô sai được nữa.
Mỗi bàn giữ 2-4 ô đúng: ít hơn thì mò mãi không ra, nhiều hơn thì ăn may.

Bộ sinh tự loại những luật hỏng: luật chỉ nói về thuộc tính thì đếm thẳng trên 81 tổ
hợp (dưới 4 là quá hiếm, trên 54 là quá lỏng); luật nói về vị trí hay về nước đi trước
thì phải thử dựng bàn mới biết có chơi được không. Nó cũng tránh hai màn liền kề dùng cùng
kiểu nói dối hay cùng bộ thuộc tính, vì như thế màn sau sẽ tự lộ đáp án cho màn trước.

## Bốn trục, không phải ba

Mỗi ô có ba thứ **in trên nó** — màu, hình, số — và một thứ nữa không in ra: **chỗ nó
nằm trên lưới**. Người chơi quen soi ba thứ đầu, nên một luật thật kiểu *"ô ở hàng
dưới cùng"* giấu được rất lâu mà vẫn hoàn toàn công bằng: thông tin luôn bày ra trước
mắt, chỉ là không ai nghĩ tới.

Vì thế gợi ý ở những màn thường **cố ý không nhắc tới vị trí** — nhắc ra là lộ mất
trục thứ tư trước khi người chơi kịp gặp nó.

Trục thứ năm không nằm trên bàn chơi mà nằm ở **nước đi liền trước của chính người
chơi**: kiểu `LICHSU` cho ra những luật như *"ô cùng màu với ô bạn vừa chọn"*. Chỗ này
lật ngược cách nghĩ — luật không còn đứng yên một chỗ để soi, nó đi theo bạn. Sổ tay
từ chỗ tiện lợi thành chỗ bắt buộc, và phải đọc theo thứ tự chứ không so lẻ từng dòng
được nữa.

Nước đi **đầu tiên** của một màn `LICHSU` luôn được chấp nhận, vì chưa có gì để so.

Mọi điều kiện lịch sử phải đúng với *mọi* ô có thể vừa chọn. Hai điều kiện "mang số
lớn hơn" và "mang số nhỏ hơn" đã bị bỏ: chọn phải ô số 9 rồi thì không còn ô nào lớn
hơn, bàn chơi không dựng nổi và người chơi kẹt vĩnh viễn.

## Ba kiểu nói dối còn lại

Ghi trong tài liệu thiết kế, chưa làm: luật hết hạn giữa chừng, bảng luật tự sửa chữ
khi bạn nhìn đi chỗ khác, và giao diện nói dối.

## Màn hình mở đầu

Game không ném thẳng người chơi vào lưới ô nữa. Màn mở đầu có ba dòng luật chơi,
nút bắt đầu, ô nhập mã ván, và nút *Chơi tiếp* hiện ra khi có ván đang dở.
*Thoát ván* ở dưới đưa về đây, tiến độ vẫn còn.

## Chạy

Mở `index.html` bằng trình duyệt. Không cần cài gì, không cần server.

Muốn một file duy nhất để gửi đi: `node build.js`
