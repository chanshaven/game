# Ai Là Triệu Phú

Dựng theo format phát trên VTV3 quãng **2015–2016**: mười lăm câu hỏi, thang tiền
từ 200.000 lên 150.000.000, hai mốc an toàn ở câu 5 và câu 10, bốn quyền trợ giúp
trong đó có **Tư vấn tại chỗ** — quyền chỉ bản này mới có.

Chạy hoàn toàn trong trình duyệt. Không cần cài đặt, không cần server, không dùng
thư viện ngoài nào. Mở file là chơi.

Toàn bộ tiếng dẫn là file mp3 thật cắt từ chương trình, nằm trong `sound/`.
Phần lớn không khí nằm ở đó — chơi mà tắt loa thì còn lại một cái trắc nghiệm.

---

## 1. Chạy thử

**Cách nhanh nhất:** nhấp đúp vào `index.html`.

Nếu dùng VS Code, cài extension **Live Server** rồi bấm *Go Live* để trang tự tải
lại mỗi khi sửa code.

Trước khi đẩy lên GitHub, chạy `node test.js` để soát ngân hàng câu hỏi và kiểm tra
mọi file mp3 khai báo trong `audio.js` có thật nằm trong `sound/` hay không.

---

## 2. Cấu trúc thư mục

```
index.html      giao diện + toàn bộ CSS + logo vẽ bằng SVG
questions.js    ngân hàng câu hỏi, chia theo level 1-15
audio.js        danh mục file mp3 + nhạc nền sinh bằng WebAudio
game.js         toàn bộ luật chơi
logo.svg        bản logo rút gọn, dùng làm ảnh thẻ ở trang chủ
test.js         soát câu hỏi và file âm thanh, chạy bằng node
sound/          tiếng dẫn chương trình, chia thư mục theo loại
sound/nen/      nhạc nền ba chặng, cắt từ nhạc hiệu của chương trình
```

Logo tròn ở màn chào vẽ hoàn toàn bằng SVG, không dùng ảnh: vành ngoài có chữ
chạy vòng, mạng tơ là các dây cung nối trên một đường tròn, dải ruy băng vàng là
đường epitrochoid bảy thuỳ. Muốn đổi hình bông hoa thì sửa thuộc tính `d` của hai
thẻ `<path>` trong `<g filter="url(#fSang)">`.

Không có bản gộp một file như mấy game kia, vì game này phải kéo theo cả thư mục
`sound/`. Muốn gửi cho ai thì nén nguyên thư mục `ai-la-trieu-phu` rồi gửi.

---

## 3. Luật chơi đã cài

| | |
|---|---|
| Số câu | 15 |
| Mốc an toàn | câu 5 (2.000.000) và câu 10 (22.000.000) |
| Sai ở câu 1-5 | ra về tay trắng |
| Sai ở câu 6-10 | giữ 2.000.000 |
| Sai ở câu 11-15 | giữ 22.000.000 |
| Dừng cuộc chơi | lúc nào cũng được, giữ tiền của câu vừa trả lời đúng |
| Trợ giúp | mỗi quyền dùng một lần trong cả ván |
| Tư vấn tại chỗ | chỉ có từ câu 6 trở đi |
| Đồng hồ | 30 giây cho câu 1-5, 45 giây cho câu 6-10, 60 giây cho câu 11-15 |
| Hết giờ | tính như trả lời sai, vẫn giữ tiền của mốc an toàn đã qua |

Thang tiền: 200.000 · 400.000 · 600.000 · 1.000.000 · **2.000.000** · 3.000.000 ·
6.000.000 · 10.000.000 · 14.000.000 · **22.000.000** · 30.000.000 · 40.000.000 ·
60.000.000 · 85.000.000 · **150.000.000**

Trên thang tiền: **vạch vàng đặc là số tiền đang có** (câu vừa trả lời đúng),
**vạch viền nhấp nháy là câu đang chơi** — chưa phải tiền của mình. Ba mốc 5, 10,
15 có chữ trắng và một mảng sáng nhạt.

**Chốt đáp án phải bấm hai lần** vào cùng một phương án — hoặc bấm một lần rồi
nhấn Enter. Lần đầu là chọn, lần hai mới là câu trả lời cuối cùng, đúng như MC
hỏi lại. Bàn phím: `A` `B` `C` `D` hoặc `1` `2` `3` `4`.

---

## 4. Bốn quyền trợ giúp

**50:50** — bỏ đi hai phương án sai, giữ lại đáp án đúng và một phương án sai
bốc ngẫu nhiên.

**Gọi điện thoại cho người thân** — máy đóng vai người thân. Đồng hồ 30 giây chạy,
người thân lên tiếng ở một thời điểm bất kỳ giữa chừng. Họ **có thể trả lời sai**,
và càng lên câu cao càng dễ sai. Từ câu 11 trở đi đôi khi họ nói thẳng là chịu.

**Hỏi ý kiến khán giả trong trường quay** — biểu đồ bốn cột. Tỉ lệ dồn vào đáp án
đúng giảm dần theo chặng. Từ câu 11 trở đi có khoảng hai phần mười số lần khán giả
dồn nhầm sang một phương án sai — không có cú đó thì trợ giúp này hoá ra đáp án.

**Tư vấn tại chỗ** — **chỉ có từ câu số 6 trở đi**, năm câu đầu chỉ có ba quyền
kia. Trước đó nút để mờ và ghi "Từ câu 6"; tới câu 6 nó nháy sáng một nhịp.
Đổi mốc này ở hằng số `TU_VAN_TU_CAU` đầu `game.js`.

Ba khán giả đoán độc lập, mỗi người có thể đúng hoặc sai.
Nếu cả ba cùng chọn B thì có sẵn câu dẫn riêng cho trường hợp đó. Nếu quá nửa tổ
chỉ đúng và người chơi theo đúng, chương trình cảm ơn tổ tư vấn.

Độ tin cậy theo chặng nằm ở bảng `TIN` đầu file `game.js`, sửa trực tiếp được:

```js
const TIN = {
  dt: [[5, .92], [10, .72], [13, .50], [15, .35]],   // người thân
  kg: [[5, .84], [10, .62], [13, .40], [15, .32]],   // khán giả
  tv: [[5, .90], [10, .70], [13, .52], [15, .40]],   // mỗi người tổ tư vấn
};
```

Đọc là: tới câu 5 thì người thân đúng 92% số lần, tới câu 10 thì 72%, và cứ thế.

---

## 5. Thêm câu hỏi — `questions.js`

Mỗi level là một mảng. Thêm bao nhiêu câu cũng được, mỗi ván bốc ngẫu nhiên một
câu trong level đó.

```js
15: [
  { q: 'Tên khai sinh của nhà thơ Tố Hữu là gì?',
    a: ['Nguyễn Kim Thành', 'Nguyễn Thứ Lễ', 'Trần Hữu Tri', 'Nguyễn Trọng Trí'],
    c: 0 },            //  c là chỉ số đáp án đúng: 0=A, 1=B, 2=C, 3=D
],
```

Hai chỗ dễ hỏng nhất:

- **Bốn phương án nên dài gần bằng nhau.** Đáp án đúng dài hơn hẳn ba cái kia thì
  người chơi đoán ra mà không cần biết gì. `node test.js` cảnh báo chuyện này.
- **Đừng để đáp án đúng dồn vào một chữ cái.** `test.js` đếm phân bố A/B/C/D và
  kêu lên nếu một chữ cái vượt 40%.

Bộ mồi hiện có 60 câu, 4 câu mỗi level. Càng đổ thêm thì càng lâu lặp lại.

---

## 6. Thêm hoặc đổi âm thanh — `audio.js`

Mỗi khoá trong bảng `SND` trỏ tới **một mảng** đường dẫn. Game bốc ngẫu nhiên một
file trong mảng, nên cứ thêm biến thể vào là tiếng dẫn tự đỡ nhàm:

```js
'dung-A': ['A-dung/A-la-cau-tra-loi-dung.mp3',
           'A-dung/A-xin-chuc-mung.mp3'],
```

File khai báo mà không có trên đĩa thì game **bỏ qua rồi chạy tiếp**, không đứng.
Nhờ vậy có thể khai báo trước rồi bổ sung file sau.

Lưu ý: nhóm `sai-A`, `sai-B`… là tiếng công bố **đáp án đúng** khi người chơi trả
lời sai ("A mới là câu trả lời đúng"), nên chữ cái ở đây là đáp án đúng chứ không
phải phương án người chơi đã chọn.

Lưu ý nữa: hai file `to-tu-van-tai-cho.mp3` và `to-tu-van-tai-cho-de-tu-van.mp3`
đều là câu dẫn mời tổ tư vấn. Lúc đầu game phát cả hai liền nhau, nghe như lắp
bắp, nên giờ chúng nằm chung một nhóm `tg-tuvan` và mỗi lần chỉ bốc một câu.
Thêm biến thể vào nhóm đó thì càng đỡ nhàm.

### Còn thiếu

| Nhóm | Thiếu gì |
|---|---|
| `cau-hoi` | câu hỏi số 12, 13, 14, 15 |
| `sai-B`, `sai-D` | mới có một biến thể, nghe hai ván là lặp |
| `dung-A` | mới có hai biến thể |
| — | nhạc lúc chốt đáp án, lúc dừng cuộc chơi, lúc thắng 150 triệu |
| — | tiếng vỗ tay, "chúng ta đến với câu hỏi tiếp theo" |

### Nhạc nền

Nhạc nền là **chính nhạc hiệu của chương trình** — lấy từ `nhac-hieu/nhac-hieu-dai.mp3`,
cắt thành một vòng lặp 9,7 giây rồi hạ nhỏ xuống. File nằm ở `sound/nen/`:

```
nen/nen-1.mp3   câu 1-5
nen/nen-2.mp3   câu 6-10
nen/nen-3.mp3   câu 11-15
```

Hiện **cả ba là một đoạn giống hệt nhau**. Để ba file riêng là để sau này có
nhạc riêng cho từng chặng thì chỉ việc chép đè lên đúng file, không phải sửa
code. Game biết ba chặng đang dùng chung một đoạn nên **không bật lại từ đầu**
khi sang chặng mới, cứ để nhạc chạy tiếp.

Vòng lặp được cắt bằng cách dò điểm nối hợp nhất về phổ rồi chồng mờ 0,6 giây,
nên nghe lặp không thấy mối nối.

Nhạc nền **tự nhỏ xuống khi MC nói** rồi lên lại khi MC dứt lời, nên không bao
giờ át tiếng dẫn. Vào và ra đều nhỏ dần chứ không cắt phụt. Mỗi lần bật, nhạc
vào ở một chỗ bất kỳ trong vòng lặp cho đỡ nhàm.

Chỉnh to nhỏ ở hai hằng số ngay trên hàm `bedStart` trong `audio.js`:

```js
const BED_TO  = 0.40;   // lúc bình thường
const BED_NHO = 0.14;   // lúc MC đang nói
```

Người chơi **tắt riêng nhạc nền** được bằng nút *Nhạc nền* ở góc trên bên phải,
tiếng dẫn vẫn chạy bình thường. Lựa chọn được nhớ cho lần sau.

Không có file trong `sound/nen/` thì game **im lặng** — không tự chế ra tiếng gì.

---

## 7. Những chỗ hay sửa khác

**Thang tiền** — mảng `LADDER` đầu `game.js`, 15 số từ thấp lên cao.
**Mốc an toàn** — mảng `MOC`, mặc định `[5, 10]`.

**Đồng hồ đếm ngược** — bảng `GIO` trong `game.js`, tính bằng giây:

```js
const GIO = { 5: 30, 10: 45, 15: 60 };   // đặt cả ba về 0 là tắt hẳn đồng hồ
```

Đồng hồ **dừng lại trong lúc dùng trợ giúp** (vòng tròn mờ đi cho thấy đã dừng) và
dừng hẳn khi đã chốt đáp án. Năm giây cuối có tiếng tích tắc. Hết giờ thì tính như
trả lời sai: công bố đáp án đúng rồi rơi về mốc an toàn gần nhất.

**Khoảng lặng trước khi công bố kết quả** — bảng `CHO` trong `game.js`, tính bằng
mili giây. Đây là chỗ tim đập, chỉnh dài ngắn ở đây:

```js
const CHO = { 4: 900, 9: 1900, 12: 2900, 15: 4200 };
```

Đọc là: tới câu 4 chờ 0,9 giây; từ câu 5 đến câu 9 chờ 1,9 giây; và cứ thế.

**Tên người thân và tổ tư vấn** — `TEN_THAN` và `TEN_TUVAN` trong `game.js`.

**Màu sắc** — khối `:root` đầu `index.html`. Hình lục giác của hộp câu hỏi và bốn
phương án là biến `--hex`, sửa một chỗ là đổi hết.
