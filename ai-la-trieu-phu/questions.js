/* ============================================================================
   AI LÀ TRIỆU PHÚ — ngân hàng câu hỏi

   Cấu trúc:  QUESTIONS[level] = [ câu, câu, ... ]   với level từ 1 đến 15
   Mỗi câu:   { q: "nội dung câu hỏi",
                a: ["đáp án A", "đáp án B", "đáp án C", "đáp án D"],
                c: 0 }        <- c là chỉ số đáp án đúng: 0=A, 1=B, 2=C, 3=D

   Mỗi ván game bốc ngẫu nhiên 1 câu ở mỗi level, nên càng nhiều câu mỗi level
   thì càng lâu lặp lại. Đây là bộ mồi 4 câu/level để chơi thử ngay — Chuong cứ
   đổ thêm vào, không cần sửa gì ở chỗ khác.

   LƯU Ý khi thêm câu:
   - Bốn đáp án nên dài gần bằng nhau. Đáp án đúng mà dài hơn hẳn ba cái kia là
     người chơi đoán ra ngay, không cần biết kiến thức.
   - Đừng để đáp án đúng rơi vào A quá nhiều. File test.js đếm giúp chuyện này.
   - Câu càng cao level càng phải khó. Thang 1-15 chia làm năm bậc:
       1-3   ai cũng trả lời được, cốt để người chơi ấm người
       4-6   kiến thức phổ thông, nghe là nhớ ra
       7-9   phải học qua mới biết
       10-12 phải đọc nhiều mới biết
       13-15 chuyên sâu, trúng được là nhờ may hoặc nhờ nghề
   ========================================================================== */
const QUESTIONS = {

  /* ===== Bậc 1-3: ai cũng trả lời được ================================== */

  1: [
    {
      q: 'Con vật nào gáy "ò ó o" mỗi buổi sáng sớm?',
      a: ['Gà trống', 'Gà mái', 'Con vịt', 'Con ngan'], c: 0
    },
    {
      q: 'Mặt Trời mọc ở hướng nào?',
      a: ['Hướng Tây', 'Hướng Nam', 'Hướng Bắc', 'Hướng Đông'], c: 3
    },
    {
      q: 'Một năm có bao nhiêu tháng?',
      a: ['10 tháng', '11 tháng', '12 tháng', '13 tháng'], c: 2
    },
    {
      q: 'Ở điều kiện bình thường, nước đóng băng ở nhiệt độ nào?',
      a: ['0 độ C', '10 độ C', '32 độ C', '100 độ C'], c: 0
    },
  ],

  2: [
    {
      q: 'Thủ đô của Việt Nam là thành phố nào?',
      a: ['Thành phố Huế', 'Thành phố Hà Nội', 'Thành phố Đà Nẵng', 'Thành phố Hải Phòng'], c: 1
    },
    {
      q: 'Thành ngữ "Chậm như..." nói đến con vật nào?',
      a: ['Con thỏ', 'Con ngựa', 'Con rùa', 'Con sóc'], c: 2
    },
    {
      q: 'Bộ phận nào trong cơ thể người có nhiệm vụ bơm máu đi nuôi cơ thể?',
      a: ['Lá gan', 'Quả thận', 'Lá phổi', 'Quả tim'], c: 3
    },
    {
      q: 'Tháng nào trong năm có 28 hoặc 29 ngày?',
      a: ['Tháng Hai', 'Tháng Tư', 'Tháng Sáu', 'Tháng Chín'], c: 0
    },
  ],

  3: [
    {
      q: 'Ngôi sao trên lá cờ Tổ quốc Việt Nam có mấy cánh?',
      a: ['Bốn cánh', 'Năm cánh', 'Sáu cánh', 'Bảy cánh'], c: 1
    },
    {
      q: 'Loài vật nào được mệnh danh là "chúa sơn lâm"?',
      a: ['Con voi', 'Con gấu', 'Con báo', 'Con hổ'], c: 3
    },
    {
      q: 'Câu "Ăn quả nhớ kẻ trồng cây" khuyên con người điều gì?',
      a: ['Phải biết tiết kiệm', 'Phải biết ơn', 'Phải chăm lao động', 'Phải biết nhường nhịn'], c: 1
    },
    {
      q: 'Ngày Quốc khánh của nước Cộng hoà xã hội chủ nghĩa Việt Nam là ngày nào?',
      a: ['Ngày 30 tháng 4', 'Ngày 1 tháng 5', 'Ngày 2 tháng 9', 'Ngày 19 tháng 8'], c: 2
    },
  ],

  /* ===== Bậc 4-6: kiến thức phổ thông =================================== */

  4: [
    {
      q: 'Vịnh Hạ Long nằm ở tỉnh nào của nước ta?',
      a: ['Quảng Ninh', 'Hải Phòng', 'Thái Bình', 'Nam Định'], c: 0
    },
    {
      q: 'Quốc gia nào có diện tích lớn nhất thế giới?',
      a: ['Canada', 'Trung Quốc', 'Hoa Kỳ', 'Liên bang Nga'], c: 3
    },
    {
      q: 'Khi quang hợp, cây xanh hấp thụ loại khí nào?',
      a: ['Khí ô-xi', 'Khí ni-tơ', 'Khí các-bô-níc', 'Khí hy-đrô'], c: 2
    },
    {
      q: 'Bác Hồ đọc bản Tuyên ngôn Độc lập tại quảng trường nào?',
      a: ['Quảng trường Ba Đình', 'Quảng trường Lam Sơn', 'Quảng trường Đông Kinh', 'Quảng trường Cách Mạng'], c: 0
    },
  ],

  5: [
    {
      q: 'Truyện Kiều là tác phẩm của tác giả nào?',
      a: ['Nguyễn Trãi', 'Nguyễn Du', 'Nguyễn Đình Chiểu', 'Nguyễn Khuyến'], c: 1
    },
    {
      q: 'Kim tự tháp Giza nổi tiếng nằm ở quốc gia nào?',
      a: ['Hy Lạp', 'I-rắc', 'Ai Cập', 'Mê-hi-cô'], c: 2
    },
    {
      q: 'Đơn vị tiền tệ của Nhật Bản có tên là gì?',
      a: ['Đồng Yên', 'Đồng Won', 'Đồng Nhân dân tệ', 'Đồng Bạt'], c: 0
    },
    {
      q: 'Hành tinh nào nằm gần Mặt Trời nhất trong hệ Mặt Trời?',
      a: ['Sao Kim', 'Sao Thuỷ', 'Trái Đất', 'Sao Hoả'], c: 1
    },
  ],

  6: [
    {
      q: 'Đỉnh núi nào cao nhất Việt Nam?',
      a: ['Bạch Mộc Lương Tử', 'Pu Ta Leng', 'Tây Côn Lĩnh', 'Phan Xi Păng'], c: 3
    },
    {
      q: 'Ai là người đầu tiên bay vào vũ trụ?',
      a: ['Neil Armstrong', 'Yuri Gagarin', 'Valentina Tereshkova', 'Alan Shepard'], c: 1
    },
    {
      q: 'Trong hoá học, ký hiệu Fe là của nguyên tố nào?',
      a: ['Đồng', 'Kẽm', 'Chì', 'Sắt'], c: 3
    },
    {
      q: 'Thế vận hội Olympic mùa hè được tổ chức mấy năm một lần?',
      a: ['Hai năm', 'Ba năm', 'Bốn năm', 'Năm năm'], c: 2
    },
  ],

  /* ===== Bậc 7-9: phải học qua mới biết ================================= */

  7: [
    {
      q: 'Chữ Quốc ngữ của người Việt được xây dựng chủ yếu dựa trên hệ chữ cái nào?',
      a: ['Chữ Hán', 'Chữ La-tinh', 'Chữ Phạn', 'Chữ Ki-ril'], c: 1
    },
    {
      q: 'Bức hoạ "Đêm đầy sao" là tác phẩm của hoạ sĩ nào?',
      a: ['Claude Monet', 'Vincent van Gogh', 'Paul Cézanne', 'Edvard Munch'], c: 1
    },
    {
      q: 'Chiến thắng Điện Biên Phủ diễn ra vào năm nào?',
      a: ['Năm 1945', 'Năm 1950', 'Năm 1954', 'Năm 1975'], c: 2
    },
    {
      q: 'Chất khí nào chiếm tỉ lệ lớn nhất trong khí quyển Trái Đất?',
      a: ['Ô-xi', 'Ni-tơ', 'Các-bô-níc', 'Ác-gông'], c: 1
    },
  ],

  8: [
    {
      q: 'Thành phố nào của Việt Nam được mệnh danh là "thành phố ngàn hoa"?',
      a: ['Sa Pa', 'Đà Lạt', 'Tam Đảo', 'Bà Nà'], c: 1
    },
    {
      q: 'Con sông nào dài nhất châu Á?',
      a: ['Sông Hoàng Hà', 'Sông Mê Kông', 'Sông Trường Giang', 'Sông Hằng'], c: 2
    },
    {
      q: 'Đại dương nào rộng lớn nhất trên Trái Đất?',
      a: ['Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương', 'Thái Bình Dương'], c: 3
    },
    {
      q: 'Xương nào dài nhất trong cơ thể người?',
      a: ['Xương đùi', 'Xương cánh tay', 'Xương sống', 'Xương ống chân'], c: 0
    },
  ],

  9: [
    {
      q: 'Truyện ngắn "Chí Phèo" là tác phẩm của nhà văn nào?',
      a: ['Ngô Tất Tố', 'Nam Cao', 'Vũ Trọng Phụng', 'Nguyễn Công Hoan'], c: 1
    },
    {
      q: 'Thủ đô của nước Úc là thành phố nào?',
      a: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], c: 2
    },
    {
      q: 'Việt Nam chính thức gia nhập Hiệp hội các quốc gia Đông Nam Á ASEAN vào năm nào?',
      a: ['Năm 1986', 'Năm 1991', 'Năm 1995', 'Năm 2000'], c: 2
    },
    {
      q: 'Kim loại nào tồn tại ở thể lỏng trong điều kiện nhiệt độ phòng?',
      a: ['Thuỷ ngân', 'Chì', 'Thiếc', 'Natri'], c: 0
    },
  ],

  /* ===== Bậc 10-12: phải đọc nhiều mới biết ============================= */

  10: [
    {
      q: 'Triều đại nào tồn tại lâu nhất trong lịch sử phong kiến Việt Nam?',
      a: ['Nhà Lý', 'Nhà Trần', 'Nhà Hậu Lê', 'Nhà Nguyễn'], c: 2
    },
    {
      q: 'Tổ chức Y tế Thế giới WHO đặt trụ sở chính tại thành phố nào?',
      a: ['New York', 'Giơ-ne-vơ', 'Pa-ri', 'Viên'], c: 1
    },
    {
      q: 'Ai là tác giả của bản "Tiến quân ca" — Quốc ca Việt Nam?',
      a: ['Đỗ Nhuận', 'Lưu Hữu Phước', 'Hoàng Việt', 'Văn Cao'], c: 3
    },
    {
      q: 'Hiệp ước nào năm 1957 đặt nền móng cho Liên minh châu Âu ngày nay?',
      a: ['Hiệp ước Maastricht', 'Hiệp ước Rô-ma', 'Hiệp ước Lisbon', 'Hiệp ước Schengen'], c: 1
    },
  ],

  11: [
    {
      q: 'Nhà thờ Đức Bà ở Pa-ri được xây theo phong cách kiến trúc nào?',
      a: ['Gô-tích', 'Ba-rốc', 'Rô-man', 'Phục Hưng'], c: 0
    },
    {
      q: 'Nguyên tố hoá học nào có số hiệu nguyên tử bằng 79?',
      a: ['Bạc', 'Bạch kim', 'Thuỷ ngân', 'Vàng'], c: 3
    },
    {
      q: 'Tiểu thuyết "Chiến tranh và Hoà bình" là tác phẩm của nhà văn nào?',
      a: ['Dostoevsky', 'Lev Tolstoy', 'Turgenev', 'Gogol'], c: 1
    },
    {
      q: 'Hiệp định Giơ-ne-vơ về Đông Dương được ký kết vào năm nào?',
      a: ['Năm 1945', 'Năm 1950', 'Năm 1954', 'Năm 1973'], c: 2
    },
  ],

  12: [
    {
      q: 'Trường đại học đầu tiên của Việt Nam, thành lập năm 1076, có tên là gì?',
      a: ['Văn Miếu', 'Quốc Tử Giám', 'Quốc Học', 'Sùng Chính viện'], c: 1
    },
    {
      q: 'Nhà toán học nào được mệnh danh là "hoàng tử của toán học"?',
      a: ['Euler', 'Newton', 'Gauss', 'Archimedes'], c: 2
    },
    {
      q: 'Giải thưởng Nobel KHÔNG có hạng mục nào sau đây?',
      a: ['Văn học', 'Hoá học', 'Toán học', 'Y học'], c: 2
    },
    {
      q: 'Thủ đô của Ca-dắc-xtan hiện nay có tên là gì?',
      a: ['Astana', 'Almaty', 'Bishkek', 'Tashkent'], c: 0
    },
  ],

  /* ===== Bậc 13-15: trúng được là nhờ may hoặc nhờ nghề ================= */

  13: [
    {
      q: 'Vị vua nào có thời gian trị vì lâu nhất trong lịch sử Việt Nam?',
      a: ['Lê Thánh Tông', 'Lý Nhân Tông', 'Trần Nhân Tông', 'Vua Minh Mạng'], c: 1
    },
    {
      q: 'Bộ luật thành văn đầu tiên của nước ta, ban hành dưới triều Lý, có tên là gì?',
      a: ['Hình thư', 'Luật Hồng Đức', 'Hoàng Việt luật lệ', 'Quốc triều thông chế'], c: 0
    },
    {
      q: 'Nguyên tố nào chiếm tỉ lệ khối lượng lớn nhất trong vỏ Trái Đất?',
      a: ['Sắt', 'Si-lic', 'Nhôm', 'Ô-xi'], c: 3
    },
    {
      q: 'Trong vật lý, hằng số Planck có đơn vị đo là gì?',
      a: ['Jun trên giây', 'Jun nhân giây', 'Oát trên giây', 'Niu-tơn nhân mét'], c: 1
    },
  ],

  14: [
    {
      q: 'Năm 1397, Hồ Quý Ly cho dời kinh đô về vùng đất nay thuộc tỉnh nào?',
      a: ['Ninh Bình', 'Thanh Hoá', 'Nghệ An', 'Hà Nam'], c: 1
    },
    {
      q: 'Nhà bác học nào đưa ra khái niệm "entropy" trong nhiệt động lực học?',
      a: ['Rudolf Clausius', 'Ludwig Boltzmann', 'Sadi Carnot', 'James Joule'], c: 0
    },
    {
      q: 'Kim loại nào có nhiệt độ nóng chảy cao nhất?',
      a: ['Vonfram', 'Titan', 'Crom', 'Tantan'], c: 0
    },
    {
      q: 'Một đơn vị thiên văn AU xấp xỉ bằng bao nhiêu ki-lô-mét?',
      a: ['15 triệu', '150 triệu', '1,5 tỉ', '15 tỉ'], c: 1
    },
  ],

  15: [
    {
      q: 'Tên khai sinh của nhà thơ Tố Hữu là gì?',
      a: ['Nguyễn Kim Thành', 'Nguyễn Thứ Lễ', 'Trần Hữu Tri', 'Nguyễn Trọng Trí'], c: 0
    },
    {
      q: 'Trong bảng tuần hoàn, ký hiệu Sb là của nguyên tố nào?',
      a: ['Stronti', 'Scandi', 'Selen', 'Antimon'], c: 3
    },
    {
      q: 'Ai là Tổng thư ký đầu tiên của Liên Hợp Quốc?',
      a: ['Trygve Lie', 'Dag Hammarskjold', 'U Thant', 'Kurt Waldheim'], c: 0
    },
    {
      q: 'Định lý nào khẳng định phương trình a mũ n cộng b mũ n bằng c mũ n không có nghiệm nguyên dương khi n lớn hơn 2?',
      a: ['Định lý Fermat lớn', 'Giả thuyết Goldbach', 'Định lý Euclid', 'Giả thuyết Riemann'], c: 0
    },
  ],

};

/* Cho phép dùng lại trong test.js chạy bằng Node */
if (typeof module !== 'undefined' && module.exports) module.exports = { QUESTIONS };



/* ============================================================================
   NGÂN HÀNG BỔ SUNG — BATCH 1
   75 câu mới: 5 câu / level
   ========================================================================== */


/* ===== LEVEL 1 =========================================================== */

QUESTIONS[1].push(

  {
    q: 'Người chuyên chế tác đồ trang sức bằng vàng, bạc được gọi là gì?',
    a: ['Thợ mộc', 'Thợ kim hoàn', 'Thợ nề', 'Thợ điện'], c: 1
  },

  {
    q: 'Từ nào còn thiếu trong thành ngữ "Ném đá giấu ..."?',
    a: ['Tay', 'Mặt', 'Tên', 'Lòng'], c: 0
  },

  {
    q: 'Từ nào còn thiếu trong câu "Đất lành ... đậu"?',
    a: ['Ong', 'Bướm', 'Chim', 'Cò'], c: 2
  },

  {
    q: 'Người trực tiếp chỉ đạo quá trình thực hiện một bộ phim được gọi là gì?',
    a: ['Biên kịch', 'Quay phim', 'Diễn viên', 'Đạo diễn'], c: 3
  },

  {
    q: 'Loại giấy nào từng được dùng để tạo một bản sao khi viết hoặc đánh máy?',
    a: ['Giấy dó', 'Giấy than', 'Giấy nhám', 'Giấy dầu'], c: 1
  }

);


/* ===== LEVEL 2 =========================================================== */

QUESTIONS[2].push(

  {
    q: 'Đâu là tên một quân cờ trong cờ vua?',
    a: ['Tàn', 'Tươi', 'Tốt', 'Tài'], c: 2
  },

  {
    q: 'Loại củ nào xuất hiện trong thành ngữ "Vàng như ..."?',
    a: ['Nghệ', 'Hành', 'Tỏi', 'Củ cải'], c: 0
  },

  {
    q: 'Nam châm có thể hút mạnh đồ vật làm chủ yếu từ vật liệu nào?',
    a: ['Gỗ', 'Nhựa', 'Thủy tinh', 'Sắt'], c: 3
  },

  {
    q: 'Nhân vật Harry Potter được biết đến với thân phận nào?',
    a: ['Thợ săn', 'Phù thủy', 'Thủy thủ', 'Hiệp sĩ'], c: 1
  },

  {
    q: 'Trong bóng đá, "khung thành" còn được gọi là gì?',
    a: ['Cầu biên', 'Cầu ngang', 'Cầu môn', 'Cầu giữa'], c: 2
  }

);


/* ===== LEVEL 3 =========================================================== */

QUESTIONS[3].push(

  {
    q: 'Loại đồ uống kết hợp cà phê với lòng đỏ trứng nổi tiếng gắn với thành phố nào?',
    a: ['Hà Nội', 'Huế', 'Đà Nẵng', 'Đà Lạt'], c: 0
  },

  {
    q: 'Trong môn bi-a pool, các bi mục tiêu thường được xếp thành hình gì khi bắt đầu ván?',
    a: ['Hình tròn', 'Hình vuông', 'Hình thang', 'Hình tam giác'], c: 3
  },

  {
    q: 'Nhân vật nào của Marvel nổi tiếng với hình dạng người khổng lồ màu xanh lá?',
    a: ['Thor', 'Iron Man', 'Hulk', 'Hawkeye'], c: 2
  },

  {
    q: 'Bộ phận nào của thằn lằn có thể mọc lại sau khi tự đứt để thoát kẻ săn mồi?',
    a: ['Chân', 'Đuôi', 'Đầu', 'Lưỡi'], c: 1
  },

  {
    q: 'Từ nào sau đây được viết đúng chính tả?',
    a: ['Chằn trọc', 'Trằn chọc', 'Chằn chọc', 'Trằn trọc'], c: 3
  }

);


/* ===== LEVEL 4 =========================================================== */

QUESTIONS[4].push(

  {
    q: 'Theo truyền thuyết, Thánh Gióng đã nhổ cây gì bên đường để đánh giặc?',
    a: ['Tre', 'Cau', 'Mía', 'Dừa'], c: 0
  },

  {
    q: 'Nhạc cụ truyền thống Việt Nam nào chỉ có một dây?',
    a: ['Đàn tranh', 'Đàn bầu', 'Đàn nguyệt', 'Đàn tỳ bà'], c: 1
  },

  {
    q: 'Bảy chú lùn trong truyện Nàng Bạch Tuyết làm nghề gì?',
    a: ['Thợ rèn', 'Thợ mộc', 'Thợ mỏ', 'Thợ may'], c: 2
  },

  {
    q: 'Ngày 19 tháng 11 hằng năm được Liên Hợp Quốc chọn là ngày thế giới về vấn đề nào?',
    a: ['Nước sạch', 'Lương thực', 'Khí hậu', 'Nhà vệ sinh'], c: 3
  },

  {
    q: 'Canh cua đồng kiểu miền Bắc thường được nấu cùng loại rau nào?',
    a: ['Rau muống', 'Rau đay', 'Cải ngọt', 'Rau ngót'], c: 1
  }

);


/* ===== LEVEL 5 =========================================================== */

QUESTIONS[5].push(

  {
    q: 'Ai là tác giả tiểu thuyết "Bá tước Monte Cristo"?',
    a: ['Alexandre Dumas', 'Victor Hugo', 'Émile Zola', 'Jules Verne'], c: 0
  },

  {
    q: 'Nam diễn viên nào nổi tiếng toàn cầu với nhân vật Mr. Bean?',
    a: ['Hugh Laurie', 'Jim Carrey', 'Rowan Atkinson', 'Steve Martin'], c: 2
  },

  {
    q: 'Bộ concerto "Bốn mùa" là tác phẩm nổi tiếng của nhà soạn nhạc nào?',
    a: ['Mozart', 'Antonio Vivaldi', 'Bach', 'Haydn'], c: 1
  },

  {
    q: 'Album "Map of the Soul: 7" là sản phẩm của nhóm nhạc Hàn Quốc nào?',
    a: ['EXO', 'TWICE', 'BLACKPINK', 'BTS'], c: 3
  },

  {
    q: 'Lễ hội bia Oktoberfest nổi tiếng được tổ chức truyền thống tại thành phố nào của Đức?',
    a: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'], c: 1
  }

);


/* ===== LEVEL 6 =========================================================== */

QUESTIONS[6].push(

  {
    q: 'Danh y Hải Thượng Lãn Ông có tên thật là gì?',
    a: ['Tuệ Tĩnh', 'Nguyễn Đình Chiểu', 'Phạm Ngọc Thạch', 'Lê Hữu Trác'], c: 3
  },

  {
    q: 'Năm 1054, vua nào đổi quốc hiệu nước ta thành Đại Việt?',
    a: ['Lý Thái Tổ', 'Lý Thái Tông', 'Lý Thánh Tông', 'Lý Nhân Tông'], c: 2
  },

  {
    q: 'Môn võ Việt Nam nào còn được gọi là Việt Võ Đạo?',
    a: ['Vovinam', 'Aikido', 'Taekwondo', 'Karatedo'], c: 0
  },

  {
    q: 'Hệ đếm chỉ sử dụng hai chữ số 0 và 1 được gọi là gì?',
    a: ['Hệ thập phân', 'Hệ nhị phân', 'Hệ bát phân', 'Hệ thập lục phân'], c: 1
  },

  {
    q: 'Bệnh sốt xuất huyết Dengue chủ yếu lây truyền qua loài nào?',
    a: ['Ruồi nhà', 'Ve', 'Muỗi vằn', 'Bọ chét'], c: 2
  }

);


/* ===== LEVEL 7 =========================================================== */

QUESTIONS[7].push(

  {
    q: 'Ca khúc "Chiếc khăn piêu" được phát triển từ âm hưởng dân ca của dân tộc nào?',
    a: ['Thái', 'Dao', 'Mường', 'Tày'], c: 0
  },

  {
    q: 'Bức chân dung "Em Thúy" là tác phẩm nổi tiếng của họa sĩ nào?',
    a: ['Tô Ngọc Vân', 'Nguyễn Gia Trí', 'Bùi Xuân Phái', 'Trần Văn Cẩn'], c: 3
  },

  {
    q: 'Vở kịch "Hồn Trương Ba, da hàng thịt" là tác phẩm của ai?',
    a: ['Nguyễn Huy Tưởng', 'Lưu Quang Vũ', 'Xuân Trình', 'Nguyễn Đình Thi'], c: 1
  },

  {
    q: 'Cuộc khởi nghĩa Yên Thế cuối thế kỷ XIX gắn liền với tên tuổi của ai?',
    a: ['Phan Đình Phùng', 'Nguyễn Thiện Thuật', 'Hoàng Hoa Thám', 'Trương Định'], c: 2
  },

  {
    q: 'Ngày Khí tượng Thế giới được tổ chức hằng năm vào ngày nào?',
    a: ['23 tháng 3', '22 tháng 4', '5 tháng 6', '16 tháng 9'], c: 0
  }

);


/* ===== LEVEL 8 =========================================================== */

QUESTIONS[8].push(

  {
    q: 'Tên thật của nhân vật chị Dậu trong "Tắt đèn" là gì?',
    a: ['Lê Thị Đào', 'Lê Thị Mai', 'Lê Thị Lan', 'Lê Thị Xuân'], c: 0
  },

  {
    q: 'Bài dân ca "Đi cấy" nổi tiếng có nguồn gốc từ địa phương nào?',
    a: ['Bắc Ninh', 'Nghệ An', 'Thanh Hóa', 'Phú Thọ'], c: 2
  },

  {
    q: 'Nam diễn viên nào từng hóa thân thành Nguyễn Ái Quốc trong phim "Thầu Chín ở Xiêm"?',
    a: ['Hồng Đăng', 'Mạnh Trường', 'Việt Anh', 'Thanh Sơn'], c: 1
  },

  {
    q: 'Nhà thơ nào từng vào vai nhân vật Bác sĩ Hoa Súng trong "Gặp nhau cuối tuần"?',
    a: ['Trần Đăng Khoa', 'Nguyễn Duy', 'Bằng Việt', 'Hoàng Nhuận Cầm'], c: 3
  },

  {
    q: 'Bức Mona Lisa được Leonardo da Vinci vẽ trên tấm gỗ của loại cây nào?',
    a: ['Sồi', 'Thông', 'Dương', 'Tuyết tùng'], c: 2
  }

);


/* ===== LEVEL 9 =========================================================== */

QUESTIONS[9].push(

  {
    q: 'Bức tranh "Nguyệt ước" là tác phẩm của họa sĩ nào?',
    a: ['Tô Ngọc Vân', 'Nguyễn Tư Nghiêm', 'Bùi Xuân Phái', 'Nguyễn Sáng'], c: 1
  },

  {
    q: 'Tên giải quần vợt Roland-Garros được đặt theo một người nổi tiếng trong lĩnh vực nào?',
    a: ['Văn học', 'Điện ảnh', 'Y học', 'Hàng không'], c: 3
  },

  {
    q: 'Thành phố cổ Petra từng là kinh đô của vương quốc cổ đại nào?',
    a: ['Nabataea', 'Phoenicia', 'Lydia', 'Numidia'], c: 0
  },

  {
    q: 'Các Ravenmaster tại Tháp London có nhiệm vụ chăm sóc loài chim nào?',
    a: ['Thiên nga', 'Đại bàng', 'Quạ', 'Chim ưng'], c: 2
  },

  {
    q: '"Mười ngày rung chuyển thế giới" của John Reed viết về sự kiện nào?',
    a: ['Cách mạng Pháp', 'Cách mạng Tháng Mười Nga', 'Nội chiến Mỹ', 'Cách mạng Tân Hợi'], c: 1
  }

);


/* ===== LEVEL 10 ========================================================== */

QUESTIONS[10].push(

  {
    q: 'Trong thần thoại Hy Lạp, Hades cai quản thế giới nào?',
    a: ['Cõi âm', 'Bầu trời', 'Biển cả', 'Rừng núi'], c: 0
  },

  {
    q: 'Tên nguyên tố Selenium bắt nguồn từ Selene trong tiếng Hy Lạp, nghĩa là gì?',
    a: ['Mặt Trời', 'Mặt Trăng', 'Ngôi sao', 'Bầu trời'], c: 1
  },

  {
    q: 'Làng gốm Bát Tràng thời kỳ đầu từng được biết đến với tên nào?',
    a: ['Bạch Bát phường', 'Tràng Tiền phường', 'Bạch Thổ phường', 'Bát Tràng phường'], c: 2
  },

  {
    q: 'Cầu Trường Tiền ở Huế từng mang tên vị vua triều Nguyễn nào?',
    a: ['Duy Tân', 'Khải Định', 'Bảo Đại', 'Thành Thái'], c: 3
  },

  {
    q: 'Thắng cảnh nào của vịnh Hạ Long xuất hiện trên mặt sau tờ 200.000 đồng polymer?',
    a: ['Hòn Gà Chọi', 'Hòn Đỉnh Hương', 'Hòn Trống Mái', 'Hòn Cánh Buồm'], c: 1
  }

);


/* ===== LEVEL 11 ========================================================== */

QUESTIONS[11].push(

  {
    q: 'Thí nghiệm hai bán cầu Magdeburg nổi tiếng chứng minh sự tồn tại của hiện tượng nào?',
    a: ['Áp suất không khí', 'Lực đàn hồi', 'Lực tĩnh điện', 'Cảm ứng từ'], c: 0
  },

  {
    q: 'Loại bức xạ nào thường được dùng để kiểm tra một số đặc điểm bảo an trên tiền giấy?',
    a: ['Tia gamma', 'Tia X', 'Tia tử ngoại', 'Sóng siêu âm'], c: 2
  },

  {
    q: 'Tượng trên đỉnh cổng Brandenburg ở Berlin tượng trưng cho nữ thần La Mã nào?',
    a: ['Minerva', 'Victoria', 'Diana', 'Vesta'], c: 1
  },

  {
    q: 'Tiếng Phần Lan, Estonia và Hungary thuộc hệ ngôn ngữ nào?',
    a: ['Slav', 'German', 'Balt', 'Ural'], c: 3
  },

  {
    q: 'Nhà văn Ian Fleming lấy tên "James Bond" từ tên của một người làm nghề gì?',
    a: ['Bác sĩ', 'Sĩ quan hải quân', 'Nhà nghiên cứu chim', 'Diễn viên sân khấu'], c: 2
  }

);


/* ===== LEVEL 12 ========================================================== */

QUESTIONS[12].push(

  {
    q: 'Tên danh họa Tô Ngọc Vân được đặt cho một hố va chạm trên hành tinh nào?',
    a: ['Sao Kim', 'Sao Thủy', 'Sao Hỏa', 'Sao Mộc'], c: 1
  },

  {
    q: 'H\'ri là một làn điệu dân ca truyền thống của dân tộc nào?',
    a: ['Ê Đê', 'Ba Na', 'Gia Rai', 'Chăm'], c: 3
  },

  {
    q: 'Tuyến đường sắt đầu tiên được xây dựng ở Việt Nam nối hai địa điểm nào?',
    a: ['Hà Nội - Hải Phòng', 'Hà Nội - Lạng Sơn', 'Sài Gòn - Mỹ Tho', 'Hà Nội - Lào Cai'], c: 2
  },

  {
    q: '"Bức tường Công xã" gắn với Công xã Paris nằm trong địa điểm nào?',
    a: ['Nghĩa trang Père-Lachaise', 'Đồi Montmartre', 'Quảng trường Bastille', 'Điện Panthéon'], c: 0
  },

  {
    q: 'Virus Nipah được đặt tên theo địa danh nào ở Malaysia?',
    a: ['Kuala Nipah', 'Sungai Nipah', 'Pulau Nipah', 'Bukit Nipah'], c: 1
  }

);


/* ===== LEVEL 13 ========================================================== */

QUESTIONS[13].push(

  {
    q: 'Nội dung nào KHÔNG thuộc năm môn phối hợp hiện đại truyền thống?',
    a: ['Đấu kiếm', 'Bơi', 'Bắn cung', 'Chạy'], c: 2
  },

  {
    q: 'Bức ảnh nụ hôn nổi tiếng tại Quảng trường Thời Đại năm 1945 ghi lại không khí ăn mừng sự kiện nào?',
    a: ['Kết thúc Thế chiến I', 'Kết thúc Thế chiến II', 'Khủng hoảng 1929 kết thúc', 'Ngày độc lập Hoa Kỳ'], c: 1
  },

  {
    q: 'Seabiscuit, biểu tượng nổi tiếng của nước Mỹ thời Đại suy thoái, là con vật gì?',
    a: ['Ngựa đua', 'Chó săn', 'Bò tót', 'Chim bồ câu'], c: 0
  },

  {
    q: 'Hai người đầu tiên nhận Huy chương Fields năm 1936 là công dân của hai nước nào?',
    a: ['Pháp và Nga', 'Anh và Đức', 'Nga và Phần Lan', 'Phần Lan và Hoa Kỳ'], c: 3
  },

  {
    q: 'Ai là tác giả phần lời của Quốc ca Ấn Độ?',
    a: ['R. K. Narayan', 'Salman Rushdie', 'Rabindranath Tagore', 'Vikram Seth'], c: 2
  }

);


/* ===== LEVEL 14 ========================================================== */

QUESTIONS[14].push(

  {
    q: 'Loài động vật nào ở Việt Nam được một bộ phận người Rắc Lây gọi là "min"?',
    a: ['Sao la', 'Bò tót', 'Sơn dương', 'Hươu sao'], c: 1
  },

  {
    q: 'Danh sĩ đời Trần nào sáng tác "Ngọc tỉnh liên phú", tự ví mình như sen trong giếng ngọc?',
    a: ['Trương Hán Siêu', 'Phạm Sư Mạnh', 'Mạc Đĩnh Chi', 'Lê Quát'], c: 2
  },

  {
    q: 'Làng Hới, nổi tiếng trong câu "Ăn cơm hom, nằm giường hòm, đắp chiếu Hới", thuộc địa phương nào?',
    a: ['Nam Định', 'Hưng Yên', 'Hà Nam', 'Thái Bình'], c: 3
  },

  {
    q: 'Roger Federer giành danh hiệu đơn ATP đầu tiên trong sự nghiệp tại thành phố nào?',
    a: ['Milan', 'Paris', 'Munich', 'Basel'], c: 0
  },

  {
    q: 'Một phần của bản giao hưởng nào của Beethoven được đưa lên tàu Voyager trong Golden Record?',
    a: ['Giao hưởng số 3', 'Giao hưởng số 5', 'Giao hưởng số 7', 'Giao hưởng số 9'], c: 1
  }

);


/* ===== LEVEL 15 ========================================================== */

QUESTIONS[15].push(

  {
    q: 'Trong bài thơ "Sông Lấp", Tú Xương nghe tiếng gì mà ngỡ là tiếng gọi đò?',
    a: ['Tiếng sáo', 'Tiếng ếch', 'Tiếng chim', 'Tiếng hát'], c: 1
  },

  {
    q: '"Sáng tạo Adam" trên trần Nhà nguyện Sistine là tác phẩm của nghệ sĩ nào?',
    a: ['Michelangelo', 'Raphael', 'Botticelli', 'Titian'], c: 0
  },

  {
    q: 'Hai câu thơ "Trường Sơn chí lớn ông cha / Cửu Long lòng mẹ bao la sóng trào" nằm trong tác phẩm nào của Lê Anh Xuân?',
    a: ['Dáng đứng Việt Nam', 'Gửi miền Bắc', 'Nguyễn Văn Trỗi', 'Không đâu như ở miền Nam'], c: 2
  },

  {
    q: 'Nhà thơ nào là người châu Á đầu tiên nhận giải Nobel Văn học?',
    a: ['Kawabata Yasunari', 'Lỗ Tấn', 'Kenzaburo Oe', 'Rabindranath Tagore'], c: 3
  },

  {
    q: 'Bức "Bác Hồ với thiếu nhi ba miền Trung, Nam, Bắc" của Diệp Minh Châu được thực hiện bằng chất liệu đặc biệt nào?',
    a: ['Mực tàu', 'Sáp màu', 'Máu', 'Sơn dầu'], c: 2
  }

);




/* ============================================================================
   AI LÀ TRIỆU PHÚ — BATCH 2
   75 CÂU MỚI — 5 CÂU / LEVEL
   Nguồn tham khảo: các tập Ai Là Triệu Phú 2005–2024
   ========================================================================== */


/* ===== LEVEL 1 =========================================================== */

QUESTIONS[1].push(

  {
    q: 'Theo hình tượng Giáng sinh phương Tây, ai thường chui qua ống khói để phát quà cho trẻ em?',
    a: ['Cô tiên mùa xuân', 'Ông già Noel', 'Công chúa Tuyết', 'Chú tuần lộc'], c: 1
  },

  {
    q: 'Đâu là tên một con phố nổi tiếng ở khu phố cổ Hà Nội?',
    a: ['Hàng Tím', 'Hàng Hồng', 'Hàng Nâu', 'Hàng Đào'], c: 3
  },

  {
    q: 'Từ nào còn thiếu trong thành ngữ "Cá ... một lứa"?',
    a: ['Chép', 'Mè', 'Thu', 'Trích'], c: 1
  },

  {
    q: 'Người ta thường dùng từ "chang chang" để miêu tả kiểu thời tiết nào?',
    a: ['Mưa to', 'Lốc xoáy', 'Nắng to', 'Sương mù'], c: 2
  },

  {
    q: 'Loài hoa nào đặc biệt gắn với ngày Tết ở miền Nam Việt Nam?',
    a: ['Đào hồng', 'Sen trắng', 'Mai vàng', 'Tulip đỏ'], c: 2
  }

);


/* ===== LEVEL 2 =========================================================== */

QUESTIONS[2].push(

  {
    q: 'Trong bài dân ca "Thằng Bờm", Bờm đồng ý đổi quạt mo lấy thứ gì?',
    a: ['Chim đồi mồi', 'Bè gỗ lim', 'Ao sâu cá mè', 'Nắm xôi'], c: 3
  },

  {
    q: 'Trong cách nói quen thuộc "Rồng bay, ... múa", con vật nào còn thiếu?',
    a: ['Gà', 'Rắn', 'Phượng', 'Khỉ'], c: 2
  },

  {
    q: 'Cách nói nào chỉ việc một người kiên trì theo đuổi tình cảm với người khác?',
    a: ['Trồng cây đa', 'Trồng cây si', 'Trồng cây bàng', 'Trồng cây táo'], c: 1
  },

  {
    q: 'Quả bóng của môn thể thao nào nhỏ nhất trong bốn môn sau?',
    a: ['Bóng rổ', 'Bóng đá', 'Bóng bàn', 'Bóng chuyền'], c: 2
  },

  {
    q: 'Thành ngữ nào hàm ý làm điều sai trái thì cuối cùng phải chịu hậu quả?',
    a: ['Ăn không nói có', 'Ăn xổi ở thì', 'Ăn miếng trả miếng', 'Ăn mặn khát nước'], c: 3
  }

);


/* ===== LEVEL 3 =========================================================== */

QUESTIONS[3].push(

  {
    q: 'Món cà ri truyền thống thường có màu đặc trưng nào?',
    a: ['Trắng', 'Xanh nhạt', 'Vàng', 'Hồng nhạt'], c: 2
  },

  {
    q: 'Đâu là tên thường dùng của một kiểu tóc mái?',
    a: ['Mái ngố', 'Mái tồ', 'Mái dại', 'Mái khôn'], c: 0
  },

  {
    q: 'Hai loại bánh truyền thống nào thường được nhắc đến thành một cặp?',
    a: ['Bánh gai - bánh bèo', 'Bánh ướt - bánh tẻ', 'Bánh xèo - bánh ít', 'Bánh trôi - bánh chay'], c: 3
  },

  {
    q: '"Không phải núi mà có khe, rõ ràng năm cánh mà chẳng phải sao" là câu đố về quả gì?',
    a: ['Quả sấu', 'Quả cóc', 'Quả me', 'Quả khế'], c: 3
  },

  {
    q: 'Từ nào hoàn thành đúng câu thành ngữ "Máu chảy ruột..."?',
    a: ['Mềm', 'Đau', 'Non', 'Già'], c: 0
  }

);


/* ===== LEVEL 4 =========================================================== */

QUESTIONS[4].push(

  {
    q: 'Ngành khoa học nghiên cứu các cơ thể sống được gọi là gì?',
    a: ['Sinh vật học', 'Hóa học', 'Vật lý học', 'Thiên văn học'], c: 0
  },

  {
    q: 'Các sản phẩm khai thác từ tài nguyên rừng được gọi chung là gì?',
    a: ['Nông sản', 'Hải sản', 'Thủy sản', 'Lâm sản'], c: 3
  },

  {
    q: 'Đâu là một đặc sản nổi tiếng của Hưng Yên?',
    a: ['Tương Bần', 'Thịt trâu gác bếp', 'Cơm lam', 'Cốm làng Vòng'], c: 0
  },

  {
    q: '"Thán khí" là tên gọi cũ của loại khí nào?',
    a: ['Ô-xi', 'Hi-đrô', 'Các-bô-níc', 'Ni-tơ'], c: 2
  },

  {
    q: '"Quả gì vỏ đỏ, ruột chấm vừng đen?" là câu đố về loại quả nào?',
    a: ['Quả vải', 'Thanh long', 'Hồng xiêm', 'Quả nhãn'], c: 1
  }

);


/* ===== LEVEL 5 =========================================================== */

QUESTIONS[5].push(

  {
    q: '"Con chó nhỏ mang giỏ hoa hồng" là tác phẩm của nhà văn nào?',
    a: ['Nguyễn Phong Việt', 'Nguyễn Nhật Ánh', 'Phan Ý Yên', 'Trần Thu Trang'], c: 1
  },

  {
    q: 'Trong câu nói dân gian "Trạng chết, Chúa cũng băng hà", "Trạng" được nhắc đến là ai?',
    a: ['Trạng Lường', 'Trạng Me', 'Trạng Cờ', 'Trạng Quỳnh'], c: 3
  },

  {
    q: 'Hai câu "Gió mưa là bệnh của trời, tương tư là bệnh của tôi yêu nàng" là của nhà thơ nào?',
    a: ['Xuân Diệu', 'Nguyễn Bính', 'Chế Lan Viên', 'Thâm Tâm'], c: 1
  },

  {
    q: 'Ca khúc nào sau đây là sáng tác nổi tiếng của Trịnh Công Sơn?',
    a: ['Đông trắng', 'Hạ trắng', 'Thu trắng', 'Xuân trắng'], c: 1
  },

  {
    q: 'Tiểu thuyết "Bến không chồng" là tác phẩm của nhà văn nào?',
    a: ['Lê Lựu', 'Nguyễn Khắc Trường', 'Ma Văn Kháng', 'Dương Hướng'], c: 3
  }

);


/* ===== LEVEL 6 =========================================================== */

QUESTIONS[6].push(

  {
    q: 'Buenos Aires là thủ đô của quốc gia nào?',
    a: ['Argentina', 'Chile', 'Uruguay', 'Paraguay'], c: 0
  },

  {
    q: 'Theo thần thoại Hy Lạp, vua Midas có khả năng biến vật mình chạm vào thành gì?',
    a: ['Đá', 'Vàng', 'Than', 'Nước'], c: 1
  },

  {
    q: 'Thiếu vitamin B1 nghiêm trọng có thể gây bệnh nào?',
    a: ['Hoại huyết', 'Quáng gà', 'Tê phù', 'Còi xương'], c: 2
  },

  {
    q: 'Âm có tần số lớn hơn khoảng 20.000 Hz được gọi là gì?',
    a: ['Siêu âm', 'Cận âm', 'Hạ âm', 'Thanh âm'], c: 0
  },

  {
    q: 'Yoga có nguồn gốc lịch sử chủ yếu từ quốc gia nào?',
    a: ['Nhật Bản', 'Trung Quốc', 'Ấn Độ', 'Hàn Quốc'], c: 2
  }

);


/* ===== LEVEL 7 =========================================================== */

QUESTIONS[7].push(

  {
    q: 'Quần thể đền cổ Wat Phou nằm ở quốc gia Đông Nam Á nào?',
    a: ['Lào', 'Thái Lan', 'Campuchia', 'Myanmar'], c: 0
  },

  {
    q: 'Quảng trường Marienplatz là quảng trường trung tâm nổi tiếng của thành phố nào?',
    a: ['Stuttgart', 'Cologne', 'Munich', 'Bonn'], c: 2
  },

  {
    q: '"Cỗ lá" là nét ẩm thực truyền thống đặc trưng của dân tộc nào?',
    a: ['Thái', 'Mường', 'Ê Đê', 'Cơ Tu'], c: 1
  },

  {
    q: 'Dân tộc nào ở miền Bắc Việt Nam còn từng được gọi là "Xá Lá Vàng"?',
    a: ['La Hủ', 'Phù Lá', 'Khơ Mú', 'Giáy'], c: 0
  },

  {
    q: 'Quốc gia châu Á nào có toàn bộ lãnh thổ nằm ở Nam bán cầu?',
    a: ['Brunei', 'Nhật Bản', 'Hàn Quốc', 'Timor-Leste'], c: 3
  }

);


/* ===== LEVEL 8 =========================================================== */

QUESTIONS[8].push(

  {
    q: 'Nhà hoạt động khí hậu Greta Thunberg mang quốc tịch nào?',
    a: ['Hoa Kỳ', 'Hà Lan', 'Thụy Điển', 'Na Uy'], c: 2
  },

  {
    q: 'AQI là chữ viết tắt của loại chỉ số nào?',
    a: ['Chỉ số thông minh', 'Chỉ số cảm xúc', 'Chỉ số chất lượng không khí', 'Chỉ số bức xạ'], c: 2
  },

  {
    q: 'Đơn vị tiền tệ của Kazakhstan có tên là gì?',
    a: ['Tenge', 'Manat', 'Taka', 'Tugrik'], c: 0
  },

  {
    q: 'Quốc gia nào là nước đầu tiên phát hành tiền giấy polymer để lưu thông rộng rãi?',
    a: ['Australia', 'Canada', 'Singapore', 'New Zealand'], c: 0
  },

  {
    q: 'Nhà hát cung đình cổ nổi tiếng nằm trong Đại Nội Huế có tên là gì?',
    a: ['Duyệt Thị Đường', 'Điện Cần Chánh', 'Lầu Kiến Trung', 'Cung Diên Thọ'], c: 0
  }

);


/* ===== LEVEL 9 =========================================================== */

QUESTIONS[9].push(

  {
    q: '"Nanta" - chương trình biểu diễn hài kịch không lời về những đầu bếp - nổi tiếng ở quốc gia nào?',
    a: ['Trung Quốc', 'Hàn Quốc', 'Nhật Bản', 'Ấn Độ'], c: 1
  },

  {
    q: 'Trong bài phát biểu tại Việt Nam năm 2016, Barack Obama nhắc đến ca khúc nào của Trịnh Công Sơn?',
    a: ['Nối vòng tay lớn', 'Huyền thoại mẹ', 'Diễm xưa', 'Một cõi đi về'], c: 0
  },

  {
    q: 'Danh ca opera Luciano Pavarotti nổi tiếng với loại giọng nào?',
    a: ['Nam trầm', 'Nam trung', 'Nam cao', 'Phản nam cao'], c: 2
  },

  {
    q: 'Bà Phạm Thị Trân được coi là bà tổ của loại hình sân khấu truyền thống nào?',
    a: ['Tuồng', 'Chèo', 'Ca trù', 'Cải lương'], c: 1
  },

  {
    q: '"Ngôi nhà của nàng Juliet" nổi tiếng nằm tại thành phố nào của Italia?',
    a: ['Bologna', 'Napoli', 'Verona', 'Catania'], c: 2
  }

);


/* ===== LEVEL 10 ========================================================== */

QUESTIONS[10].push(

  {
    q: 'Ca khúc "Writing\'s on the Wall" đoạt Oscar Ca khúc trong phim hay nhất thuộc bộ phim nào?',
    a: ['Mad Max', 'Spectre', 'The Revenant', 'Spotlight'], c: 1
  },

  {
    q: 'Năm 1982, tạp chí Time chọn vật nào làm "Machine of the Year" thay cho một cá nhân?',
    a: ['Ti vi', 'Máy tính cá nhân', 'Điện thoại', 'Máy ảnh'], c: 1
  },

  {
    q: 'Ngôi chùa gắn với thành ngữ "Vắng như chùa Bà Đanh" nằm ở địa phương nào?',
    a: ['Hà Nam', 'Thái Bình', 'Nam Định', 'Ninh Bình'], c: 0
  },

  {
    q: 'Nhà thám hiểm Thor Heyerdahl thực hiện hành trình Kon-Tiki vượt Thái Bình Dương bằng phương tiện nào?',
    a: ['Bè gỗ', 'Thuyền đánh cá', 'Thuyền buồm', 'Tàu hơi nước'], c: 0
  },

  {
    q: 'Ngôi làng Schengen, nơi gắn với tên một hiệp định nổi tiếng của châu Âu, thuộc quốc gia nào?',
    a: ['Bỉ', 'Pháp', 'Luxembourg', 'Đức'], c: 2
  }

);


/* ===== LEVEL 11 ========================================================== */

QUESTIONS[11].push(

  {
    q: 'Trước khi nổi tiếng với mã Morse, Samuel Morse hoạt động chuyên nghiệp chủ yếu trong lĩnh vực nào?',
    a: ['Hội họa', 'Y học', 'Báo chí', 'Kiến trúc'], c: 0
  },

  {
    q: 'Đài thiên văn ALMA nằm tại quốc gia Nam Mỹ nào?',
    a: ['Brazil', 'Uruguay', 'Argentina', 'Chile'], c: 3
  },

  {
    q: 'Chữ hình nêm, thường được khắc trên những tấm đất sét, gắn với nền văn minh cổ đại nào?',
    a: ['Lưỡng Hà', 'La Mã', 'Ai Cập', 'Hy Lạp'], c: 0
  },

  {
    q: 'Bộ phim "The Jazz Singer" năm 1927 nổi tiếng vì dấu mốc nào trong lịch sử điện ảnh?',
    a: ['Phim màu đầu tiên', 'Phim hoạt hình đầu tiên', 'Một trong những phim nói đồng bộ đầu tiên', 'Phim 3D đầu tiên'], c: 2
  },

  {
    q: 'Trận Austerlitz, còn gọi là "Trận chiến Ba Hoàng đế", gắn nổi bật với danh tướng nào?',
    a: ['Mikhail Kutuzov', 'Oliver Cromwell', 'Napoléon Bonaparte', 'Georgi Zhukov'], c: 2
  }

);


/* ===== LEVEL 12 ========================================================== */

QUESTIONS[12].push(

  {
    q: 'Robert Koch nhận Nobel Y học năm 1905 nhờ những nghiên cứu chủ yếu về bệnh nào?',
    a: ['Bạch hầu', 'Bệnh than', 'Bệnh lao', 'Bệnh tả'], c: 2
  },

  {
    q: 'Nghệ thuật Pháp lam - tráng men màu trên nền kim loại - phát triển đặc biệt rực rỡ dưới triều đại nào?',
    a: ['Nhà Lý', 'Nhà Nguyễn', 'Nhà Lê', 'Nhà Trần'], c: 1
  },

  {
    q: 'Điểm thấp nhất trên phần đất liền của châu Mỹ nằm tại quốc gia nào?',
    a: ['Argentina', 'Canada', 'Venezuela', 'Brazil'], c: 0
  },

  {
    q: 'Loại công cụ lao động đồng thời có thể dùng làm vũ khí của nhiều dân tộc Trường Sơn - Tây Nguyên gọi là gì?',
    a: ['Pa điền xang', 'Đuống', 'Xà gạc', 'Thò'], c: 2
  },

  {
    q: 'Anders Celsius, người gắn tên với thang nhiệt độ độ C, hoạt động nổi bật trong ngành khoa học nào?',
    a: ['Sinh học', 'Hóa học', 'Địa chất', 'Thiên văn học'], c: 3
  }

);


/* ===== LEVEL 13 ========================================================== */

QUESTIONS[13].push(

  {
    q: 'Loạt tranh sơn dầu "The Card Players - Những người chơi bài" là tác phẩm của danh họa nào?',
    a: ['Vincent van Gogh', 'Pablo Picasso', 'Claude Monet', 'Paul Cézanne'], c: 3
  },

  {
    q: 'Bản Giao hưởng số 3 của Beethoven thường được biết tới với biệt danh nào?',
    a: ['Niềm vui', 'Đồng quê', 'Định mệnh', 'Anh hùng ca'], c: 3
  },

  {
    q: 'Vị vua nào trong lịch sử Việt Nam từng hai lần lên ngôi hoàng đế?',
    a: ['Lê Chiêu Tông', 'Lê Hiển Tông', 'Lê Thần Tông', 'Lê Thánh Tông'], c: 2
  },

  {
    q: '"Sazae-san", tác phẩm giữ kỷ lục truyền hình lâu năm của Nhật Bản, thuộc thể loại nào?',
    a: ['Hoạt hình', 'Trinh thám', 'Hành động', 'Kinh dị'], c: 0
  },

  {
    q: '"Tứ trụ" của sử học Việt Nam hiện đại gồm Phan Huy Lê, Đinh Xuân Lâm, Trần Quốc Vượng và ai?',
    a: ['Đào Duy Anh', 'Trần Văn Giáp', 'Nguyễn Đồng Chi', 'Hà Văn Tấn'], c: 3
  }

);


/* ===== LEVEL 14 ========================================================== */

QUESTIONS[14].push(

  {
    q: 'Các vở "Chị Hòa", "Một Đảng viên" và "Ni cô Đàm Vân" đều gắn với nhà viết kịch nào?',
    a: ['Học Phi', 'Nguyễn Huy Tưởng', 'Thế Lữ', 'Nguyễn Đình Nghi'], c: 0
  },

  {
    q: 'Phần nào sau đây KHÔNG thuộc bố cục thông thường của một bài văn tế cổ?',
    a: ['Lung khởi', 'Thích thực', 'Luận', 'Kết'], c: 2
  },

  {
    q: 'Tác phẩm khảo cứu "Việt Nam phong tục" của Phan Kế Bính ban đầu được đăng trên ấn phẩm nào?',
    a: ['Nam Phong tạp chí', 'Gia Định báo', 'Phụ nữ tân văn', 'Đông Dương tạp chí'], c: 3
  },

  {
    q: 'Cựu phi hành gia nào từng bay vào vũ trụ và sau đó lặn xuống Challenger Deep ở rãnh Mariana?',
    a: ['Bob Behnken', 'Kate Rubins', 'Kathy Sullivan', 'Doug Hurley'], c: 2
  },

  {
    q: 'Thương cảng Vân Đồn của Đại Việt được mở dưới thời vị vua nhà Lý nào?',
    a: ['Lý Thánh Tông', 'Lý Nhân Tông', 'Lý Anh Tông', 'Lý Cao Tông'], c: 2
  }

);


/* ===== LEVEL 15 ========================================================== */

QUESTIONS[15].push(

  {
    q: 'Truyện ngắn "Đời thừa" của Nam Cao lần đầu được đăng trên tờ nào?',
    a: ['Ngày Nay', 'Tiểu thuyết thứ bảy', 'Nông cổ mín đàm', 'Phụ nữ tân văn'], c: 1
  },

  {
    q: 'Ông Lê Ngọc đã tạo nên một bức chân dung đặc biệt của Chủ tịch Hồ Chí Minh bằng phương tiện nào?',
    a: ['Máy đánh chữ', 'Đá quý', 'Sơn mài', 'Tranh lụa'], c: 0
  },

  {
    q: 'Ngày Tôn vinh tiếng Việt trong cộng đồng người Việt Nam ở nước ngoài được chọn vào ngày nào?',
    a: ['Ngày 1 tháng 9', 'Ngày 5 tháng 9', 'Ngày 8 tháng 9', 'Ngày 15 tháng 9'], c: 2
  },

  {
    q: '"Chùa Treo Chuông" là tên tiếng Việt thường dùng cho ngôi chùa nào tại Bangkok?',
    a: ['Wat Saket', 'Wat Arun', 'Wat Rakang', 'Wat Traimit'], c: 2
  },

  {
    q: 'Bánh Num Cọp Thnô, hay bánh hạt mít của người Khmer Nam Bộ, được làm chủ yếu từ nguyên liệu nào?',
    a: ['Đậu xanh', 'Gừng', 'Tỏi', 'Ngô'], c: 0
  }

);



/* ============================================================================
   AI LÀ TRIỆU PHÚ — BATCH 3
   90 CÂU MỚI — 6 CÂU / LEVEL
   ========================================================================== */


/* ===== LEVEL 1 =========================================================== */

QUESTIONS[1].push(

  {
    q: 'Xơ của loại quả già nào thường được dùng làm bông tắm?',
    a: ['Bầu', 'Bí đao', 'Dưa chuột', 'Mướp'], c: 3
  },

  {
    q: 'Người nghiện rượu nặng thường được gọi vui là gì?',
    a: ['Ma men', 'Ma lanh', 'Ma sói', 'Ma cô'], c: 0
  },

  {
    q: 'Loại quả nào sau đây có vị chua rõ rệt?',
    a: ['Mít', 'Chuối', 'Hồng xiêm', 'Chanh'], c: 3
  },

  {
    q: 'Cụm từ "gà lên chuồng" thường chỉ khoảng thời gian nào trong ngày?',
    a: ['Sáng sớm', 'Giữa trưa', 'Chập choạng tối', 'Nửa đêm'], c: 2
  },

  {
    q: 'Mì spaghetti gắn nổi tiếng nhất với nền ẩm thực nước nào?',
    a: ['Tây Ban Nha', 'Hy Lạp', 'Italia', 'Bồ Đào Nha'], c: 2
  },

  {
    q: 'Ấu trùng sống trong nước của muỗi thường được gọi là gì?',
    a: ['Bọ chét', 'Bọ xít', 'Bọ hung', 'Bọ gậy'], c: 3
  }

);


/* ===== LEVEL 2 =========================================================== */

QUESTIONS[2].push(

  {
    q: '"Rau câu" dùng làm thực phẩm thực chất thuộc nhóm sinh vật nào?',
    a: ['Nấm', 'Rêu', 'Tảo', 'Dương xỉ'], c: 2
  },

  {
    q: 'Đồ uống nào thường được nhắc tới như một nguồn cung cấp canxi?',
    a: ['Cà phê', 'Nước ngọt', 'Trà', 'Sữa'], c: 3
  },

  {
    q: 'Bánh chưng truyền thống thường được gói bằng loại lá nào?',
    a: ['Lá chuối', 'Lá sen', 'Lá dong', 'Lá dừa'], c: 2
  },

  {
    q: 'Từ nào còn thiếu trong thành ngữ "... loa mép giải"?',
    a: ['Tai', 'Mắt', 'Mũi', 'Mồm'], c: 3
  },

  {
    q: 'Con vật nào sau đây không thuộc lớp thú?',
    a: ['Sao la', 'Cá trê', 'Tê giác', 'Gấu trúc'], c: 1
  },

  {
    q: 'Mùa hè ở vùng nhiệt đới thường xuất hiện kiểu mưa nào?',
    a: ['Mưa tuyết', 'Mưa phùn', 'Mưa đá kéo dài', 'Mưa rào'], c: 3
  }

);


/* ===== LEVEL 3 =========================================================== */

QUESTIONS[3].push(

  {
    q: 'Thụy Sĩ nổi tiếng thế giới với ngành chế tạo sản phẩm nào?',
    a: ['Ô tô', 'Đồng hồ', 'Máy bay', 'Máy ảnh'], c: 1
  },

  {
    q: '"Hồ thiên nga" của Tchaikovsky thuộc loại hình nghệ thuật nào?',
    a: ['Opera', 'Kịch nói', 'Kịch câm', 'Ba lê'], c: 3
  },

  {
    q: 'Công trình nào ở Đà Nẵng nổi tiếng với hình ảnh hai bàn tay khổng lồ nâng lối đi?',
    a: ['Cầu Vàng', 'Cầu Rồng', 'Cầu Sông Hàn', 'Cầu Thuận Phước'], c: 0
  },

  {
    q: 'Tên gọi nào chỉ loại tàu vũ trụ có khả năng bay trở lại Trái Đất như một phương tiện có cánh?',
    a: ['Con cò', 'Con thoi', 'Con én', 'Con nhạn'], c: 1
  },

  {
    q: 'Bối cảnh chính của phần đầu phim "Home Alone" diễn ra vào dịp lễ nào?',
    a: ['Giáng sinh', 'Halloween', 'Phục sinh', 'Lễ Tạ ơn'], c: 0
  },

  {
    q: 'Tác phẩm thơ nổi tiếng của Trần Đăng Khoa có tên "Hạt ... làng ta"?',
    a: ['Ngô', 'Gạo', 'Đậu', 'Kê'], c: 1
  }

);


/* ===== LEVEL 4 =========================================================== */

QUESTIONS[4].push(

  {
    q: 'Câu "Con hơn cha là nhà có..." được hoàn thành bằng từ nào?',
    a: ['Lộc', 'Tiền', 'Danh', 'Phúc'], c: 3
  },

  {
    q: 'Bài hát thiếu nhi nổi tiếng có tên "Chị ong ... và em bé"?',
    a: ['Vàng', 'Nâu', 'Mật', 'Xinh'], c: 1
  },

  {
    q: '"Thắng dền" ở vùng cao Hà Giang là tên của loại món ăn nào?',
    a: ['Xôi', 'Canh', 'Bánh', 'Thịt nướng'], c: 2
  },

  {
    q: 'Nữ ca sĩ nào từng được truyền thông gọi là "công chúa nhạc đồng quê"?',
    a: ['Adele', 'Lady Gaga', 'Katy Perry', 'Taylor Swift'], c: 3
  },

  {
    q: 'Songthaew ở Thái Lan là tên gọi của loại hình nào?',
    a: ['Món ăn', 'Phương tiện đi lại', 'Lễ hội', 'Điệu múa'], c: 1
  },

  {
    q: 'Cuộc chạy Terry Fox được tổ chức để gây quỹ nghiên cứu căn bệnh nào?',
    a: ['Sốt rét', 'Ung thư', 'Lao', 'Tiểu đường'], c: 1
  }

);


/* ===== LEVEL 5 =========================================================== */

QUESTIONS[5].push(

  {
    q: 'Người lao động miền Tây trước đây thường dùng vật dụng nào để tránh muỗi khi ngủ?',
    a: ['Khăn rằn', 'Nóp', 'Cần xé', 'Nón lá'], c: 1
  },

  {
    q: 'Ca khúc nào được nhạc sĩ Hoàng Hà sáng tác trong không khí đất nước thống nhất năm 1975?',
    a: ['Đất nước trọn niềm vui', 'Mùa xuân trên thành phố Hồ Chí Minh', 'Tiến về Sài Gòn', 'Giải phóng miền Nam'], c: 0
  },

  {
    q: '"Ca dao em và tôi" là sáng tác của nhạc sĩ nào?',
    a: ['Phú Quang', 'Phó Đức Phương', 'Trần Tiến', 'An Thuyên'], c: 3
  },

  {
    q: 'Ngôn ngữ chính thức được sử dụng phổ biến tại Chile là tiếng gì?',
    a: ['Bồ Đào Nha', 'Tây Ban Nha', 'Pháp', 'Italia'], c: 1
  },

  {
    q: 'Câu "Da trời ai nhuộm mà xanh ngắt" nằm trong bài thơ nào của Nguyễn Khuyến?',
    a: ['Thu vịnh', 'Thu ẩm', 'Thu điếu', 'Bạn đến chơi nhà'], c: 0
  },

  {
    q: 'Đàn đáy là nhạc cụ đặc biệt gắn với loại hình nghệ thuật nào?',
    a: ['Ca trù', 'Tuồng', 'Cải lương', 'Hát xoan'], c: 0
  }

);


/* ===== LEVEL 6 =========================================================== */

QUESTIONS[6].push(

  {
    q: 'Điệu nhảy từng được gọi vui là "vũ điệu cồng chiêng" gắn với ca khúc nào của Tóc Tiên?',
    a: ['Có ai thương em như anh', 'Ngày mai', 'Vũ điệu cồng chiêng', 'Không ai hơn em đâu'], c: 1
  },

  {
    q: 'Ca khúc "Bước chân trên dải Trường Sơn" là sáng tác của nhạc sĩ nào?',
    a: ['Huy Du', 'Nguyễn Đức Toàn', 'Vũ Trọng Hối', 'Hoàng Vân'], c: 2
  },

  {
    q: 'Quần thể đền Wat Phou nằm tại quốc gia nào?',
    a: ['Lào', 'Myanmar', 'Thái Lan', 'Campuchia'], c: 0
  },

  {
    q: 'Marienplatz là quảng trường trung tâm nổi tiếng của thành phố nào?',
    a: ['Berlin', 'Hamburg', 'Munich', 'Dresden'], c: 2
  },

  {
    q: '"Cỗ lá" là nét ẩm thực truyền thống nổi bật của dân tộc nào?',
    a: ['Tày', 'Mường', 'Chăm', 'Ê Đê'], c: 1
  },

  {
    q: 'Môn nào lần đầu có mặt trong chương trình thi đấu Olympic ở Tokyo 2020?',
    a: ['Quyền Anh', 'Golf', 'Bóng chày', 'Karatedo'], c: 3
  }

);


/* ===== LEVEL 7 =========================================================== */

QUESTIONS[7].push(

  {
    q: 'Theo phong tục Giáng sinh ở Cộng hòa Séc, phụ nữ độc thân có thể ném vật gì qua vai để "đoán" chuyện kết hôn?',
    a: ['Chiếc khăn', 'Chiếc giày', 'Chiếc nhẫn', 'Quả táo'], c: 1
  },

  {
    q: 'Danh thắng Kẽm Trống được Hồ Xuân Hương nhắc tới nằm bên dòng sông nào?',
    a: ['Sông Lô', 'Sông Đáy', 'Sông Thương', 'Sông Mã'], c: 1
  },

  {
    q: 'Ai là quán quân mùa đầu tiên của The Face Vietnam năm 2016?',
    a: ['Phí Phương Anh', 'Khánh Ngân', 'Chúng Huyền Thanh', 'Quỳnh Mai'], c: 0
  },

  {
    q: 'Đỉnh Kinabalu nằm tại quốc gia Đông Nam Á nào?',
    a: ['Indonesia', 'Philippines', 'Malaysia', 'Brunei'], c: 2
  },

  {
    q: 'Trong các tác phẩm sau của Pushkin, tác phẩm nào ra đời sớm nhất?',
    a: ['Kị sĩ đồng', 'Ruslan và Lyudmila', 'Yevgeny Onegin', 'Con đầm pích'], c: 1
  },

  {
    q: 'Quốc gia nào sau đây không sử dụng đồng peso làm đơn vị tiền tệ?',
    a: ['Mexico', 'Philippines', 'Cuba', 'Venezuela'], c: 3
  }

);


/* ===== LEVEL 8 =========================================================== */

QUESTIONS[8].push(

  {
    q: 'Phim nào giành Quả cầu vàng 2016 cho hạng mục phim chính kịch hay nhất?',
    a: ['Spotlight', 'Mad Max: Fury Road', 'Carol', 'The Revenant'], c: 3
  },

  {
    q: 'Quốc gia nào sau đây không giáp biển Caspi?',
    a: ['Uzbekistan', 'Kazakhstan', 'Azerbaijan', 'Turkmenistan'], c: 0
  },

  {
    q: 'Hát Khắp Loong toong, nghĩa là "hát trên cánh đồng", là lối hát của dân tộc nào?',
    a: ['Tày', 'Nùng', 'Thái', 'H\'Mông'], c: 0
  },

  {
    q: 'Số 3 được biểu diễn như thế nào trong hệ nhị phân?',
    a: ['01', '10', '11', '100'], c: 2
  },

  {
    q: 'Kỹ thuật in bằng chữ rời phổ biến từ thời Gutenberg thường được gọi là phương pháp in gì?',
    a: ['In litô', 'In typô', 'In ống đồng', 'In lụa'], c: 1
  },

  {
    q: 'Người Viking có nguồn gốc chủ yếu từ khu vực nào của châu Âu?',
    a: ['Nam Âu', 'Đông Âu', 'Tây Âu', 'Bắc Âu'], c: 3
  }

);


/* ===== LEVEL 9 =========================================================== */

QUESTIONS[9].push(

  {
    q: 'Trước Viện Tế bào học và Di truyền học ở Novosibirsk có tượng đài vinh danh loài vật thí nghiệm nào?',
    a: ['Chuột', 'Thỏ', 'Ếch', 'Ruồi giấm'], c: 0
  },

  {
    q: 'Thiền sư nào là thầy của Lý Công Uẩn và có ảnh hưởng lớn tới việc hình thành triều Lý?',
    a: ['Khuông Việt', 'Từ Đạo Hạnh', 'Không Lộ', 'Vạn Hạnh'], c: 3
  },

  {
    q: 'Bản Giao hưởng số 6 "Đồng quê" của Beethoven có bao nhiêu chương?',
    a: ['Ba', 'Bốn', 'Năm', 'Sáu'], c: 2
  },

  {
    q: 'Ba môn phối hợp Triathlon gồm chạy bộ, bơi và môn nào?',
    a: ['Đua xe đạp', 'Chèo thuyền', 'Bắn súng', 'Đấu kiếm'], c: 0
  },

  {
    q: 'Tên phố cổ nào ở Hà Nội có nguồn gốc gắn với nghề làm và bán áo quan?',
    a: ['Hàng Chĩnh', 'Lò Sũ', 'Bát Đàn', 'Hàng Thiếc'], c: 1
  },

  {
    q: 'Điểm đến nào được người dùng Google Việt Nam tìm kiếm nhiều nhất trong nhóm điểm du lịch năm 2020?',
    a: ['Sa Pa', 'Đà Lạt', 'Phú Quốc', 'Cát Bà'], c: 3
  }

);


/* ===== LEVEL 10 ========================================================== */

QUESTIONS[10].push(

  {
    q: 'Robot Sophia được thiết kế với một phần ngoại hình lấy cảm hứng từ nữ minh tinh nào?',
    a: ['Grace Kelly', 'Audrey Hepburn', 'Elizabeth Taylor', 'Sophia Loren'], c: 1
  },

  {
    q: 'Các võ sĩ sumo chuyên nghiệp ở Nhật Bản theo quy định không được tự thực hiện hoạt động nào?',
    a: ['Kết hôn', 'Uống bia', 'Lái ô tô', 'Dùng điện thoại'], c: 2
  },

  {
    q: 'Cuộc đua xe đạp có tổ chức đầu tiên thường được ghi nhận diễn ra tại quốc gia nào?',
    a: ['Pháp', 'Anh', 'Bỉ', 'Hà Lan'], c: 0
  },

  {
    q: 'Hệ thống hang động núi lửa dài nổi bật nhất Đông Nam Á được ghi nhận tại quốc gia nào?',
    a: ['Indonesia', 'Philippines', 'Malaysia', 'Việt Nam'], c: 3
  },

  {
    q: 'Bản Hiến pháp đầu tiên của nước Việt Nam Dân chủ Cộng hòa được thông qua năm nào?',
    a: ['1945', '1946', '1954', '1959'], c: 1
  },

  {
    q: 'Lá cờ đỏ sao vàng xuất hiện công khai trong cuộc khởi nghĩa nào năm 1940?',
    a: ['Bắc Sơn', 'Ba Tơ', 'Yên Bái', 'Nam Kỳ'], c: 3
  }

);


/* ===== LEVEL 11 ========================================================== */

QUESTIONS[11].push(

  {
    q: 'Mốc giao điểm biên giới Việt Nam - Lào - Trung Quốc nằm trên núi nào?',
    a: ['Pha Luông', 'Khoan La San', 'Pu Ta Leng', 'Ky Quan San'], c: 1
  },

  {
    q: 'Hòn đảo nào ở Trường Sa còn được gọi bằng tên "Đảo Đồng Hồ"?',
    a: ['Nam Yết', 'Sơn Ca', 'An Bang', 'Sinh Tồn'], c: 2
  },

  {
    q: 'Biểu tượng mở đầu quen thuộc của hãng phim Mosfilm là hình ảnh công trình nào?',
    a: ['Tượng đài Công Nông', 'Tháp Kremlin', 'Nhà hát Bolshoi', 'Tượng Peter Đại đế'], c: 0
  },

  {
    q: 'Vị tướng nào của Trần Hưng Đạo nổi tiếng với tài bắn cung bách phát bách trúng?',
    a: ['Dã Tượng', 'Yết Kiêu', 'Nguyễn Địa Lô', 'Phạm Ngũ Lão'], c: 2
  },

  {
    q: 'Ngày 27 tháng 12 được Liên Hợp Quốc chọn là ngày quốc tế về vấn đề nào?',
    a: ['Sẵn sàng chống dịch bệnh', 'Bảo vệ rừng', 'Nước sạch', 'An toàn thực phẩm'], c: 0
  },

  {
    q: 'Phần động vật của Sách Đỏ Việt Nam lần đầu được xuất bản vào năm nào?',
    a: ['1986', '1990', '1992', '1996'], c: 2
  }

);


/* ===== LEVEL 12 ========================================================== */

QUESTIONS[12].push(

  {
    q: 'Nhạc hiệu mở đầu ngày mới của Đài Tiếng nói Việt Nam lấy từ ca khúc nào?',
    a: ['Người Hà Nội', 'Diệt phát xít', 'Chiến thắng Điện Biên', 'Ca ngợi Hồ Chủ tịch'], c: 1
  },

  {
    q: 'Hai câu "Một đèo, một đèo, lại một đèo / Khen ai khéo tạc cảnh cheo leo" nói về đèo nào?',
    a: ['Hải Vân', 'Ô Quy Hồ', 'Tam Điệp', 'Pha Đin'], c: 2
  },

  {
    q: 'Học thuyết nào năm 1977 đánh dấu sự điều chỉnh quan trọng của Nhật Bản trong quan hệ với Đông Nam Á?',
    a: ['Học thuyết Fukuda', 'Học thuyết Yoshida', 'Học thuyết Tanaka', 'Học thuyết Koizumi'], c: 0
  },

  {
    q: 'Quốc gia Trung Mỹ nào không cùng ngày độc lập 15/9 với Costa Rica, Guatemala và Honduras?',
    a: ['El Salvador', 'Nicaragua', 'Panama', 'Guatemala'], c: 2
  },

  {
    q: 'Cảng Hải Phòng trước đây từng được gọi bằng tên nào?',
    a: ['Ninh Hải', 'Hải Hòa', 'Ninh Hòa', 'Hải Thuận'], c: 0
  },

  {
    q: 'Các điệu múa Tra hạt, Ong eo, Đuổi chim và Cá lượn đặc trưng cho dân tộc nào?',
    a: ['Dao', 'Sán Chay', 'Hà Nhì', 'Khơ Mú'], c: 3
  }

);


/* ===== LEVEL 13 ========================================================== */

QUESTIONS[13].push(

  {
    q: 'Ngày 18 tháng 12 được Liên Hợp Quốc chọn làm ngày quốc tế của ngôn ngữ nào?',
    a: ['Tiếng Nga', 'Tiếng Ả Rập', 'Tiếng Pháp', 'Tiếng Tây Ban Nha'], c: 1
  },

  {
    q: 'Constantinople, kinh đô của Đế quốc Đông La Mã, ngày nay là thành phố nào?',
    a: ['Athens', 'Istanbul', 'Ankara', 'Sofia'], c: 1
  },

  {
    q: 'Ai là nữ Thủ tướng đầu tiên trong lịch sử Vương quốc Anh?',
    a: ['Theresa May', 'Margaret Thatcher', 'Liz Truss', 'Indira Gandhi'], c: 1
  },

  {
    q: 'Đoạn sông Hồng chảy trên lãnh thổ Trung Quốc thường được gọi là gì?',
    a: ['Lễ Xã Giang', 'Nguyên Giang', 'Tả Giang', 'Bàn Long Giang'], c: 1
  },

  {
    q: 'Ngôi chùa nào ở Bangkok có tên thường được dịch là "Chùa Treo Chuông"?',
    a: ['Wat Arun', 'Wat Saket', 'Wat Rakang', 'Wat Pho'], c: 2
  },

  {
    q: 'Cao nguyên trắng Bắc Hà nằm ở khu vực thuộc tỉnh nào theo địa danh truyền thống?',
    a: ['Lào Cai', 'Sơn La', 'Lai Châu', 'Hà Giang'], c: 0
  }

);


/* ===== LEVEL 14 ========================================================== */

QUESTIONS[14].push(

  {
    q: 'Ai đạt điểm tuyệt đối 42/42 tại Olympic Toán quốc tế năm 1979 và nhận thêm giải đặc biệt?',
    a: ['Ngô Bảo Châu', 'Lê Bá Khánh Trình', 'Đàm Thanh Sơn', 'Nguyễn Tiến Dũng'], c: 1
  },

  {
    q: '82 bia Tiến sĩ tại Văn Miếu - Quốc Tử Giám được UNESCO ghi danh vào chương trình Ký ức Thế giới khu vực vào năm nào?',
    a: ['2008', '2009', '2010', '2012'], c: 2
  },

  {
    q: 'Giao điểm biên giới ba nước Việt Nam - Lào - Trung Quốc nằm ở độ cao xấp xỉ bao nhiêu mét?',
    a: ['1.264 m', '1.564 m', '1.864 m', '2.164 m'], c: 2
  },

  {
    q: 'Đảo An Bang còn được biết đến bằng biệt danh nào do bãi cát quanh đảo thay đổi theo mùa?',
    a: ['Đảo La Bàn', 'Đảo Đồng Hồ', 'Đảo Mặt Trời', 'Đảo Cánh Buồm'], c: 1
  },

  {
    q: 'Nguyên Giang là tên gọi của đoạn sông nào khi chảy qua Vân Nam, Trung Quốc?',
    a: ['Sông Đà', 'Sông Mã', 'Sông Hồng', 'Sông Cả'], c: 2
  },

  {
    q: 'Trong số các nội dung sau, môn nào KHÔNG thuộc năm môn phối hợp hiện đại truyền thống?',
    a: ['Bơi', 'Đấu kiếm', 'Cưỡi ngựa', 'Bắn cung'], c: 3
  }

);


/* ===== LEVEL 15 ========================================================== */

QUESTIONS[15].push(

  {
    q: 'Tác phẩm hội họa thường được gọi là "Sự sáng tạo thế giới" trong nghệ thuật Phục Hưng gắn nổi bật với nghệ sĩ nào?',
    a: ['Michelangelo', 'Raphael', 'Titian', 'Botticelli'], c: 0
  },

  {
    q: 'Trong lịch sử in ấn châu Âu, kỹ thuật in chữ rời của Gutenberg thuộc phương pháp nào?',
    a: ['In ống đồng', 'In typô', 'In litô', 'In lõm'], c: 1
  },

  {
    q: 'Tên cũ "Ninh Hải" gắn với cảng biển lớn nào ở miền Bắc Việt Nam?',
    a: ['Cảng Cửa Lò', 'Cảng Hải Phòng', 'Cảng Hòn Gai', 'Cảng Cẩm Phả'], c: 1
  },

  {
    q: 'Học thuyết Fukuda được đặt theo tên thủ tướng của quốc gia nào?',
    a: ['Nhật Bản', 'Hàn Quốc', 'Singapore', 'Thái Lan'], c: 0
  },

  {
    q: 'Loạt điệu múa Ong eo và Cá lượn mô phỏng hoạt động lao động đặc trưng của cộng đồng nào?',
    a: ['Khơ Mú', 'Chăm', 'Ê Đê', 'Cơ Tu'], c: 0
  },

  {
    q: 'Bộ bia Tiến sĩ tại Văn Miếu ghi danh các khoa thi chủ yếu dưới hai triều đại nào?',
    a: ['Lý và Trần', 'Trần và Hồ', 'Lê và Mạc', 'Tây Sơn và Nguyễn'], c: 2
  }

);



/* ============================================================================
   AI LÀ TRIỆU PHÚ — BATCH 4
   90 CÂU MỚI — 6 CÂU / LEVEL
   ========================================================================== */


/* ===== LEVEL 1 =========================================================== */

QUESTIONS[1].push(

  {
    q: 'Đâu là tên một loại ớt?',
    a: ['Chỉ thiên', 'Chỉ địa', 'Chỉ phong', 'Chỉ vũ'], c: 0
  },

  {
    q: 'Đơn vị nào sau đây không dùng để đo chiều dài?',
    a: ['Centimét', 'Kilômét', 'Dặm', 'Héc-ta'], c: 3
  },

  {
    q: 'Vật dụng nào thường che miệng và mũi để hạn chế bụi xâm nhập?',
    a: ['Khẩu khí', 'Khẩu vị', 'Khẩu trang', 'Khẩu hiệu'], c: 2
  },

  {
    q: 'Từ nào sau đây được viết đúng chính tả?',
    a: ['Nực nưỡng', 'Nực lưỡng', 'Lực lưỡng', 'Lực nưỡng'], c: 2
  },

  {
    q: '"Hộp quẹt" là cách gọi khác của vật nào?',
    a: ['Que diêm', 'Đèn pin', 'Bật lửa', 'Nến'], c: 2
  },

  {
    q: 'Hoa tulip thường được xem là biểu tượng nổi tiếng của quốc gia nào?',
    a: ['Phần Lan', 'Hà Lan', 'Thụy Điển', 'Bulgaria'], c: 1
  }

);


/* ===== LEVEL 2 =========================================================== */

QUESTIONS[2].push(

  {
    q: '"Nha đam" còn có tên gọi phổ biến nào?',
    a: ['Trầu không', 'Lô hội', 'Rau má', 'Ngải cứu'], c: 1
  },

  {
    q: '"Trứng ngỗng" là cách học sinh thường ví von điểm số nào?',
    a: ['Điểm 10', 'Điểm 5', 'Điểm 1', 'Điểm 0'], c: 3
  },

  {
    q: 'Theo phương ngữ một số vùng Bắc Bộ, từ "bầm" dùng để gọi ai?',
    a: ['Bố', 'Mẹ', 'Ông', 'Bà'], c: 1
  },

  {
    q: '"Phin" thường được dùng để pha loại đồ uống nào?',
    a: ['Trà', 'Cà phê', 'Nước mía', 'Rượu'], c: 1
  },

  {
    q: 'Bảo bối nào của Doraemon giúp người sử dụng bay trên không?',
    a: ['Đèn pin thu nhỏ', 'Bánh mì chuyển ngữ', 'Cánh cửa thần kỳ', 'Chong chóng tre'], c: 3
  },

  {
    q: 'Cụm từ "Sư tử Hà Đông" thường ám chỉ kiểu người vợ nào?',
    a: ['Hiền lành, ít nói', 'Khéo léo, đảm đang', 'Dữ dằn, hay ghen', 'Vui tính, hài hước'], c: 2
  }

);


/* ===== LEVEL 3 =========================================================== */

QUESTIONS[3].push(

  {
    q: 'Khí hậu Việt Nam thường được mô tả là kiểu khí hậu gì?',
    a: ['Ôn đới hải dương', 'Hàn đới', 'Ôn đới lục địa', 'Nhiệt đới gió mùa'], c: 3
  },

  {
    q: 'Câu "Bạn có đi học không?" thuộc kiểu câu nào?',
    a: ['Câu cầu khiến', 'Câu cảm thán', 'Câu nghi vấn', 'Câu kể'], c: 2
  },

  {
    q: 'Trong các đồ uống sau, loại nào chủ yếu được chế biến từ lá cây?',
    a: ['Cà phê', 'Nước mía', 'Nước chanh', 'Trà'], c: 3
  },

  {
    q: 'Nghề nào thường được ví với hình ảnh "người lái đò"?',
    a: ['Thợ mộc', 'Bác sĩ', 'Giáo viên', 'Luật sư'], c: 2
  },

  {
    q: 'Hệ thống giao tiếp bằng động tác bàn tay dành cho người khiếm thính gọi là gì?',
    a: ['Cổ ngữ', 'Thủ ngữ', 'Thuật ngữ', 'Sinh ngữ'], c: 1
  },

  {
    q: 'Thành ngữ nào gần nghĩa nhất với "Nước đổ lá khoai"?',
    a: ['Nước chảy chỗ trũng', 'Nước mắt cá sấu', 'Nước mắt chảy xuôi', 'Nước đổ đầu vịt'], c: 3
  }

);


/* ===== LEVEL 4 =========================================================== */

QUESTIONS[4].push(

  {
    q: 'Theo truyền thuyết, Thánh Gióng lên bao nhiêu tuổi vẫn chưa biết nói, biết cười?',
    a: ['Một tuổi', 'Hai tuổi', 'Ba tuổi', 'Sáu tuổi'], c: 2
  },

  {
    q: 'Hình ảnh nào sau đây không phải biểu tượng đặc trưng của Nhật Bản?',
    a: ['Võ sĩ sumo', 'Cá chép Koi', 'Hoa anh đào', 'Búp bê Matryoshka'], c: 3
  },

  {
    q: 'Những câu thơ "Chú bé loắt choắt, cái xắc xinh xinh..." nói về nhân vật nào?',
    a: ['Dế Mèn', 'Mừng', 'Kim Đồng', 'Lượm'], c: 3
  },

  {
    q: 'Từ nào sau đây cũng là tên một loài động vật?',
    a: ['Dài', 'Ngắn', 'Lửng', 'Cao'], c: 2
  },

  {
    q: 'Đâu không phải tên một loài động vật?',
    a: ['Hải quỳ', 'Hải sâm', 'Hải cẩu', 'Hải đường'], c: 3
  },

  {
    q: 'Tên trò chơi dân gian nào cũng là tên một ca khúc của rapper Đen Vâu?',
    a: ['Nhảy dây', 'Ô ăn quan', 'Trốn tìm', 'Bịt mắt bắt dê'], c: 2
  }

);


/* ===== LEVEL 5 =========================================================== */

QUESTIONS[5].push(

  {
    q: 'Đâu là tên một bộ phim truyền hình Việt Nam từng rất nổi tiếng?',
    a: ['Cơm sống cơm chín', 'Gạo nếp gạo tẻ', 'Trầu to trầu nhỏ', 'Thóc mẩy thóc lép'], c: 1
  },

  {
    q: 'Loại sổ nào học sinh thường chuyền tay nhau ghi lời chúc trước khi ra trường?',
    a: ['Sổ kế toán', 'Sổ y bạ', 'Sổ lưu bút', 'Sổ hộ khẩu'], c: 2
  },

  {
    q: 'Ca khúc của Lê Cát Trọng Lý mở đầu bằng câu "Thương em anh trèo non cao" có tên gì?',
    a: ['Trôi nổi', 'Bấp bênh', 'Chót vót', 'Chênh vênh'], c: 3
  },

  {
    q: 'Nghệ nhân Hà Thị Cầu nổi tiếng đặc biệt với loại hình nghệ thuật nào?',
    a: ['Ca trù', 'Hát xẩm', 'Quan họ', 'Chầu văn'], c: 1
  },

  {
    q: 'Câu ca dao "Muốn ăn... lấy chồng Bình Định sợ dài đường đi" nhắc tới món bánh nào?',
    a: ['Bánh tét', 'Bánh ít lá gai', 'Bánh gai', 'Bánh căn'], c: 1
  },

  {
    q: 'Trong câu "Ăn không nên đọi, nói không nên lời", "đọi" có nghĩa là gì?',
    a: ['Nồi', 'Cơm', 'Thìa', 'Bát'], c: 3
  }

);


/* ===== LEVEL 6 =========================================================== */

QUESTIONS[6].push(

  {
    q: 'Vắc-xin Sabin được sử dụng để phòng bệnh nào?',
    a: ['Sởi', 'Uốn ván', 'Bại liệt', 'Ho gà'], c: 2
  },

  {
    q: 'Quốc gia nào thường được mệnh danh là "xứ sở hoa hồng"?',
    a: ['Romania', 'Bulgaria', 'Hungary', 'Albania'], c: 1
  },

  {
    q: 'Tên món bánh canh Nam Phổ ở Huế bắt nguồn từ đâu?',
    a: ['Tên một vị vua', 'Tên một gia vị', 'Tên người sáng tạo món ăn', 'Tên một ngôi làng'], c: 3
  },

  {
    q: 'Trong câu mở đầu ca khúc "Người Hà Nội", ba địa danh được nhắc theo thứ tự nào?',
    a: ['Hồng Hà - Hồ Gươm - Hồ Tây', 'Hồ Tây - Hồ Gươm - Hồng Hà', 'Hồng Hà - Hồ Tây - Hồ Gươm', 'Hồ Gươm - Hồng Hà - Hồ Tây'], c: 3
  },

  {
    q: 'Địa phương nào được xem là cái nôi nổi bật của nghệ thuật hát xoan?',
    a: ['Bắc Ninh', 'Phú Thọ', 'Hòa Bình', 'Thái Nguyên'], c: 1
  },

  {
    q: 'Hai câu "Con dù lớn vẫn là con của mẹ / Đi hết đời, lòng mẹ vẫn theo con" nằm trong bài thơ nào?',
    a: ['Con tập nói', 'Con cò', 'Con thức dậy', 'Tiếng hát con tàu'], c: 1
  }

);


/* ===== LEVEL 7 =========================================================== */

QUESTIONS[7].push(

  {
    q: 'Loài động vật nào nổi tiếng với việc ăn lá bạch đàn?',
    a: ['Kangaroo', 'Koala', 'Gấu trúc', 'Wallaby'], c: 1
  },

  {
    q: 'Ba con sư tử là biểu tượng nổi tiếng trên áo đội tuyển bóng đá quốc gia nào?',
    a: ['Đức', 'Anh', 'Nga', 'Bulgaria'], c: 1
  },

  {
    q: 'Điệu nhảy Haka gắn với người Māori của quốc gia nào?',
    a: ['New Zealand', 'Australia', 'Fiji', 'Samoa'], c: 0
  },

  {
    q: 'Thám tử Hercule Poirot là nhân vật do nhà văn nào sáng tạo?',
    a: ['Agatha Christie', 'Arthur Conan Doyle', 'Edgar Allan Poe', 'Charles Dickens'], c: 0
  },

  {
    q: 'Bánh chưng đen là món ăn truyền thống nổi tiếng của dân tộc nào?',
    a: ['Khơ Mú', 'Hà Nhì', 'Tày', 'Mường'], c: 2
  },

  {
    q: 'Cam Khe Mây là đặc sản nổi tiếng của vùng đất nào?',
    a: ['Hà Tĩnh', 'Nghệ An', 'Quảng Bình', 'Thanh Hóa'], c: 0
  }

);


/* ===== LEVEL 8 =========================================================== */

QUESTIONS[8].push(

  {
    q: 'Đàn balalaika truyền thống của Nga thường có bao nhiêu dây?',
    a: ['Ba dây', 'Bốn dây', 'Năm dây', 'Sáu dây'], c: 0
  },

  {
    q: 'Trường Cao đẳng Mỹ thuật Đông Dương là tiền thân quan trọng của trường nào?',
    a: ['Đại học Mỹ thuật Công nghiệp', 'Đại học Mỹ thuật Việt Nam', 'Đại học Kiến trúc Hà Nội', 'Đại học Sân khấu Điện ảnh'], c: 1
  },

  {
    q: 'Trong các cấp bậc quý tộc sau, cấp nào thấp nhất?',
    a: ['Hầu tước', 'Bá tước', 'Tử tước', 'Nam tước'], c: 3
  },

  {
    q: 'Ai được ghi nhận là người phát hiện penicillin?',
    a: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner'], c: 0
  },

  {
    q: 'Chùa Một Cột được khởi dựng dưới triều đại nào?',
    a: ['Nhà Tiền Lê', 'Nhà Lý', 'Nhà Trần', 'Nhà Hậu Lê'], c: 1
  },

  {
    q: 'Candidates Tournament là giải đấu quan trọng của môn nào?',
    a: ['Quần vợt', 'Đua ngựa', 'Golf', 'Cờ vua'], c: 3
  }

);


/* ===== LEVEL 9 =========================================================== */

QUESTIONS[9].push(

  {
    q: 'Edo là tên cũ của thành phố nào tại Nhật Bản?',
    a: ['Kyoto', 'Osaka', 'Kobe', 'Tokyo'], c: 3
  },

  {
    q: '"Gho" là trang phục truyền thống dành cho nam giới của quốc gia nào?',
    a: ['Myanmar', 'Campuchia', 'Nepal', 'Bhutan'], c: 3
  },

  {
    q: 'Hoạt động nổi bật nhất tại lễ hội Yi Peng của Thái Lan là gì?',
    a: ['Thả đèn trời', 'Đua thuyền', 'Té nước', 'Thả diều'], c: 0
  },

  {
    q: 'Quốc ca của quốc gia nào hiện không có lời chính thức?',
    a: ['Hoa Kỳ', 'Bồ Đào Nha', 'Tây Ban Nha', 'Pháp'], c: 2
  },

  {
    q: 'Trong các đồng tiền sau, đồng nào có lịch sử sử dụng lâu đời nhất?',
    a: ['Đô la Mỹ', 'Bảng Anh', 'Yên Nhật', 'Euro'], c: 1
  },

  {
    q: 'Tên gọi cà phê Moka gắn với vùng đất nào?',
    a: ['Ethiopia', 'Brazil', 'Yemen', 'Indonesia'], c: 2
  }

);


/* ===== LEVEL 10 ========================================================== */

QUESTIONS[10].push(

  {
    q: 'Công trình Atomium ở Brussels được thiết kế mô phỏng cấu trúc gì?',
    a: ['Tổ ong', 'Hệ Mặt Trời', 'Tinh thể kim loại', 'Phân tử ADN'], c: 2
  },

  {
    q: 'Theo phương ngữ, người làm nghề "hạ bạc" làm công việc gì?',
    a: ['Dệt vải', 'Đánh bắt thủy sản', 'Đóng tàu', 'Khai thác đá'], c: 1
  },

  {
    q: 'Titan là vệ tinh lớn nhất của hành tinh nào?',
    a: ['Sao Mộc', 'Sao Hỏa', 'Sao Thiên Vương', 'Sao Thổ'], c: 3
  },

  {
    q: 'Danh hiệu nào sau đây không phải danh hiệu chính thức do FIDE phong tặng?',
    a: ['Kiện tướng', 'Kiện tướng quốc tế', 'Đại kiện tướng', 'Siêu đại kiện tướng'], c: 3
  },

  {
    q: 'Trứng cá muối Caviar truyền thống chủ yếu lấy từ loài cá nào?',
    a: ['Cá hồi', 'Cá ngừ', 'Cá tầm', 'Cá kiếm'], c: 2
  },

  {
    q: '"Ngày của Phở" tại Việt Nam được tổ chức hằng năm vào ngày nào?',
    a: ['10 tháng 10', '11 tháng 11', '12 tháng 12', '1 tháng 1'], c: 2
  }

);


/* ===== LEVEL 11 ========================================================== */

QUESTIONS[11].push(

  {
    q: 'Ngôn ngữ quốc tế Esperanto do L. L. Zamenhof sáng tạo gắn với quốc gia nào?',
    a: ['Pháp', 'Đức', 'Nga', 'Ba Lan'], c: 3
  },

  {
    q: 'Ngày Thế giới tôn vinh người hiến máu được tổ chức vào ngày nào?',
    a: ['22 tháng 4', '12 tháng 5', '14 tháng 6', '20 tháng 7'], c: 2
  },

  {
    q: 'Triết gia Hy Lạp nào thường được nhắc tới trong những khảo cứu sớm về tĩnh điện?',
    a: ['Aristotle', 'Thales', 'Socrates', 'Plato'], c: 1
  },

  {
    q: 'Chân dung Alan Turing xuất hiện trên tờ polymer mệnh giá nào của Ngân hàng Anh từ năm 2021?',
    a: ['10 bảng', '50 bảng', '20 bảng', '5 bảng'], c: 1
  },

  {
    q: 'Giải thưởng và huy chương Dirac chủ yếu vinh danh thành tựu trong lĩnh vực nào?',
    a: ['Hóa học', 'Vật lý học', 'Sinh học', 'Thiên văn học'], c: 1
  },

  {
    q: 'Cung điện Mùa Đông ở Saint Petersburg được xây dựng nổi bật theo phong cách nào?',
    a: ['Gothic', 'Romanesque', 'Baroque', 'Art Nouveau'], c: 2
  }

);


/* ===== LEVEL 12 ========================================================== */

QUESTIONS[12].push(

  {
    q: 'Chữ cái nào đứng cuối bảng chữ cái Hy Lạp?',
    a: ['Sigma', 'Omega', 'Xi', 'Upsilon'], c: 1
  },

  {
    q: 'Cà phê chồn Kopi Luwak nổi tiếng có nguồn gốc từ quốc gia nào?',
    a: ['Ethiopia', 'Brazil', 'Indonesia', 'Colombia'], c: 2
  },

  {
    q: 'Con ngựa thần có cánh trong văn hóa Đông Á thường được gọi là gì?',
    a: ['Pegasus', 'Chollima', 'Sleipnir', 'Tulpar'], c: 1
  },

  {
    q: 'Đảo nào có diện tích lớn nhất trong bốn đảo chính của Nhật Bản?',
    a: ['Hokkaido', 'Honshu', 'Shikoku', 'Kyushu'], c: 1
  },

  {
    q: 'Danh sĩ nào thời Trần được gọi là "Lưỡng quốc Trạng nguyên"?',
    a: ['Mạc Đĩnh Chi', 'Nguyễn Trực', 'Phùng Khắc Khoan', 'Nguyễn Đăng Đạo'], c: 0
  },

  {
    q: 'Thành phố nào của Nga từng mang tên Gorky để vinh danh nhà văn Maxim Gorky?',
    a: ['Samara', 'Saratov', 'Yaroslavl', 'Nizhny Novgorod'], c: 3
  }

);


/* ===== LEVEL 13 ========================================================== */

QUESTIONS[13].push(

  {
    q: '"Quả cầu pha lê" là giải thưởng cao nhất của liên hoan phim quốc tế nào?',
    a: ['Tokyo', 'Cairo', 'Karlovy Vary', 'Moskva'], c: 2
  },

  {
    q: 'NSND Bùi Bài Bình từng hóa thân thành Chủ tịch Hồ Chí Minh trong bộ phim nào?',
    a: ['Nguyễn Ái Quốc ở Hồng Kông', 'Thầu Chín ở Xiêm', 'Nhà tiên tri', 'Hà Nội mùa đông năm 46'], c: 2
  },

  {
    q: 'Đảo Ti Tốp trên vịnh Hạ Long được đặt theo tên một người nổi tiếng trong lĩnh vực nào?',
    a: ['Hội họa', 'Văn học', 'Du hành vũ trụ', 'Triết học'], c: 2
  },

  {
    q: 'Đài Nghiên trước đền Ngọc Sơn được đặt trên lưng hình tượng con vật nào?',
    a: ['Cóc', 'Rùa', 'Hạc', 'Trâu'], c: 0
  },

  {
    q: 'Đồng tiền kim loại đầu tiên do nhà nước phong kiến Việt Nam phát hành có tên gì?',
    a: ['Thuận Thiên đại bảo', 'Thái Bình hưng bảo', 'Thiên Phúc trấn bảo', 'Thái Hòa thông bảo'], c: 1
  },

  {
    q: 'Cụm từ "văn hóa xứ Giồng" thường gắn với vùng đất nào?',
    a: ['An Giang', 'Sóc Trăng', 'Cà Mau', 'Đồng Tháp'], c: 1
  }

);


/* ===== LEVEL 14 ========================================================== */

QUESTIONS[14].push(

  {
    q: 'Nguyễn Thị Hinh là tên thật của nữ sĩ nào?',
    a: ['Hồ Xuân Hương', 'Bà Huyện Thanh Quan', 'Đoàn Thị Điểm', 'Sương Nguyệt Anh'], c: 1
  },

  {
    q: 'Chiếc máy bay mang số hiệu 4324, một bảo vật quốc gia Việt Nam, thuộc dòng nào?',
    a: ['An-2', 'Su-22', 'Yak-52', 'MiG-21'], c: 3
  },

  {
    q: '"Goong lu" là tên gọi của loại nhạc cụ nào ở Tây Nguyên?',
    a: ['Đàn đá', 'Đàn T\'rưng', 'Cồng chiêng', 'Kèn Đinh năm'], c: 0
  },

  {
    q: 'Theo cách gọi của người Xê Đăng, mùa "ning nơng" hoặc "ninh nông" nghĩa là gì?',
    a: ['Mùa nông nhàn', 'Mùa xuân', 'Mùa thu hoạch', 'Mùa sinh nở'], c: 0
  },

  {
    q: 'Bức tranh "Nhìn từ đỉnh đồi" là tác phẩm của họa sĩ Việt Nam nào?',
    a: ['Nguyễn Phan Chánh', 'Mai Trung Thứ', 'Lê Phổ', 'Tô Ngọc Vân'], c: 2
  },

  {
    q: 'Bức phù điêu mang dòng chữ "Tồn tại hay không tồn tại" nằm tại di tích nào?',
    a: ['Ngã ba Đồng Lộc', 'Thành cổ Quảng Trị', 'Địa đạo Vịnh Mốc', 'Địa đạo Củ Chi'], c: 2
  }

);


/* ===== LEVEL 15 ========================================================== */

QUESTIONS[15].push(

  {
    q: 'Tên thác Dambri trong truyền thuyết của người K\'Ho thường được giải thích mang ý nghĩa gì?',
    a: ['Đợi chờ', 'Chung thủy', 'Nước mắt', 'Tình yêu'], c: 0
  },

  {
    q: 'Trong các quốc gia sau, nước nào chưa từng là thành viên Khối Thịnh vượng chung?',
    a: ['Mozambique', 'Angola', 'Zimbabwe', 'Zambia'], c: 1
  },

  {
    q: '"Bắc Kỳ tạp lục" là công trình khảo cứu của tác giả nào?',
    a: ['Paul Giran', 'Henri Gourdon', 'Henri-Emmanuel Souvignet', 'Gustave Dumoutier'], c: 2
  },

  {
    q: 'Trong văn hóa các dân tộc Tây Nguyên, "Goong lu" còn mang nghĩa gần nhất với cụm nào?',
    a: ['Đá kêu như tiếng cồng', 'Tre hát trong gió', 'Chiêng gọi thần linh', 'Đàn của núi rừng'], c: 0
  },

  {
    q: 'Theo sử liệu và chương trình, tên gọi "min" của người Rắc Lây dùng để chỉ loài nào?',
    a: ['Sao la', 'Bò tót', 'Sơn dương', 'Tê giác'], c: 1
  },

  {
    q: 'Tác phẩm "Nhìn từ đỉnh đồi" của Lê Phổ được sáng tác vào năm ông rời Việt Nam sang Pháp, năm nào?',
    a: ['1931', '1934', '1937', '1940'], c: 2
  }

);



// ============================================================
// BATCH 5 — 60 QUESTIONS
// Chủ yếu khai thác Ai là triệu phú 2025–2026
// 4 câu / level
// ============================================================


// ==================== LEVEL 1 ====================

QUESTIONS[1].push(
  {
    q: 'Loài vật nào sau đây có môi trường sống chủ yếu khác ba loài còn lại?',
    a: ['Lợn', 'Bò', 'Gà', 'Cá'],
    c: 3
  },
  {
    q: 'Đông Tảo là tên của một giống vật nuôi nào?',
    a: ['Vịt', 'Gà', 'Lợn', 'Bò'],
    c: 1
  },
  {
    q: 'Đâu là một nhạc cụ truyền thống của Việt Nam?',
    a: ['Guitar', 'Piano', 'Đàn bầu', 'Violin'],
    c: 2
  },
  {
    q: 'Môn thể thao nào sau đây không sử dụng vợt?',
    a: ['Bóng rổ', 'Cầu lông', 'Bóng bàn', 'Pickleball'],
    c: 0
  }
);


// ==================== LEVEL 2 ====================

QUESTIONS[2].push(
  {
    q: 'Theo quan niệm Nho giáo xưa, "tam tòng, tứ đức" chủ yếu được đặt ra cho ai?',
    a: ['Trẻ em', 'Phụ nữ', 'Quan lại', 'Nhà sư'],
    c: 1
  },
  {
    q: 'Từ nào vừa chỉ một màu sắc vừa là tên của một kim loại?',
    a: ['Đen', 'Vàng', 'Hồng', 'Trắng'],
    c: 1
  },
  {
    q: 'Tên nào sau đây là một thể thơ truyền thống của Việt Nam?',
    a: ['Ngũ bát', 'Thất bát', 'Lục bát', 'Tam bát'],
    c: 2
  },
  {
    q: 'Thịt dùng phổ biến để làm món bún chả Hà Nội là thịt gì?',
    a: ['Thịt gà', 'Thịt bò', 'Thịt lợn', 'Thịt vịt'],
    c: 2
  }
);


// ==================== LEVEL 3 ====================

QUESTIONS[3].push(
  {
    q: 'Tên năm âm lịch nào sau đây không tồn tại trong hệ Can Chi?',
    a: ['Giáp Thìn', 'Bính Tuất', 'Mậu Mùi', 'Đinh Dậu'],
    c: 2
  },
  {
    q: 'Thành ngữ nào chỉ cách làm việc qua loa, thiếu trách nhiệm và mặc kệ kết quả?',
    a: ['Được chăng hay chớ', 'Bách phát bách trúng', 'Cầm tay chỉ việc', 'Có công mài sắt'],
    c: 0
  },
  {
    q: 'Dân ca quan họ gắn liền với vùng nào của Việt Nam?',
    a: ['Tây Nguyên', 'Bắc Bộ', 'Nam Bộ', 'Tây Nam Bộ'],
    c: 1
  },
  {
    q: 'Trên la bàn, hướng Nam thường được ký hiệu bằng chữ cái nào?',
    a: ['E', 'W', 'S', 'N'],
    c: 2
  }
);


// ==================== LEVEL 4 ====================

QUESTIONS[4].push(
  {
    q: 'Vũ khí nổi tiếng của Tôn Ngộ Không thường được gọi là gậy gì?',
    a: ['Kim Cang', 'Càn Khôn', 'Như Ý', 'Hỗn Nguyên'],
    c: 2
  },
  {
    q: 'Thành phố nào sau đây không nằm ở châu Âu?',
    a: ['Paris', 'Madrid', 'London', 'New York'],
    c: 3
  },
  {
    q: 'Tết Trung Thu ở Việt Nam thường gắn với nhân vật dân gian nào?',
    a: ['Thạch Sanh', 'Thánh Gióng', 'Sơn Tinh', 'Chú Cuội'],
    c: 3
  },
  {
    q: 'Bộ phận nào của thằn lằn có khả năng mọc lại sau khi bị đứt?',
    a: ['Đầu', 'Cổ', 'Đuôi', 'Mắt'],
    c: 2
  }
);


// ==================== LEVEL 5 ====================

QUESTIONS[5].push(
  {
    q: 'Trong truyền thuyết Việt Nam, công chúa Tiên Dung kết duyên với ai?',
    a: ['Sọ Dừa', 'Lang Liêu', 'Chử Đồng Tử', 'Mai An Tiêm'],
    c: 2
  },
  {
    q: 'Lớp vỏ ngoài của hạt lúa được tách ra khi xay xát gọi là gì?',
    a: ['Rơm', 'Trấu', 'Cám', 'Rạ'],
    c: 1
  },
  {
    q: 'Chương trình thi kiến thức nào có lịch sử phát sóng lâu nhất trong các chương trình sau trên VTV3?',
    a: ['Rung chuông vàng', 'Vua Tiếng Việt', 'Đường lên đỉnh Olympia', 'Bảy sắc cầu vồng'],
    c: 2
  },
  {
    q: 'Hiện tượng rung chuyển đột ngột của vỏ Trái Đất được gọi là gì?',
    a: ['Địa tầng', 'Địa chấn', 'Địa nhiệt', 'Địa từ'],
    c: 1
  }
);


// ==================== LEVEL 6 ====================

QUESTIONS[6].push(
  {
    q: 'Châu lục nào có lãnh thổ nằm trên cả Bắc bán cầu, Nam bán cầu, Đông bán cầu và Tây bán cầu?',
    a: ['Châu Á', 'Châu Phi', 'Châu Âu', 'Châu Đại Dương'],
    c: 1
  },
  {
    q: 'Rồng Komodo sống tự nhiên tại quốc gia nào?',
    a: ['Indonesia', 'Ấn Độ', 'Australia', 'Philippines'],
    c: 0
  },
  {
    q: 'Nghĩa trang Hàng Dương, nơi an nghỉ của nhiều chiến sĩ cách mạng, nằm ở đâu?',
    a: ['Cát Bà', 'Phú Quốc', 'Côn Đảo', 'Lý Sơn'],
    c: 2
  },
  {
    q: 'Bức họa Mona Lisa là tác phẩm nổi tiếng của danh họa nào?',
    a: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Botticelli'],
    c: 1
  }
);


// ==================== LEVEL 7 ====================

QUESTIONS[7].push(
  {
    q: 'Làng Trà Quế ở Hội An nổi tiếng với nghề truyền thống nào?',
    a: ['Làm gốm', 'Trồng rau', 'Đóng thuyền', 'Dệt lụa'],
    c: 1
  },
  {
    q: 'Bức tượng Hachiko nổi tiếng ở Shibuya, Tokyo được dựng theo hình mẫu của con vật nào?',
    a: ['Mèo', 'Chó', 'Ngựa', 'Chim'],
    c: 1
  },
  {
    q: 'Quốc gia châu Á nào có toàn bộ lãnh thổ nằm ở Nam bán cầu?',
    a: ['Brunei', 'Nhật Bản', 'Sri Lanka', 'Timor-Leste'],
    c: 3
  },
  {
    q: 'Loài vật nào được xem là một biểu tượng phổ biến của lễ Phục Sinh?',
    a: ['Cừu', 'Gà trống', 'Chim bồ câu', 'Thỏ'],
    c: 3
  }
);


// ==================== LEVEL 8 ====================

QUESTIONS[8].push(
  {
    q: 'Người đẹp Việt Nam đầu tiên đăng quang Miss International là ai?',
    a: ['Huỳnh Thị Thanh Thủy', 'Nguyễn Thúc Thùy Tiên', 'Nguyễn Cao Kỳ Duyên', 'Bùi Khánh Linh'],
    c: 0
  },
  {
    q: 'Quốc kỳ quốc gia nào có hình Angkor Wat, một Di sản Thế giới của UNESCO?',
    a: ['Campuchia', 'Thái Lan', 'Myanmar', 'Lào'],
    c: 0
  },
  {
    q: 'Màu vàng truyền thống trong tranh Đông Hồ thường được tạo từ nguyên liệu nào?',
    a: ['Hoa cúc', 'Nghệ', 'Hoa hòe', 'Đất sét'],
    c: 2
  },
  {
    q: 'Bộ phim "Bohemian Rhapsody" kể về ban nhạc nổi tiếng nào?',
    a: ['The Beatles', 'Queen', 'ABBA', 'Aerosmith'],
    c: 1
  }
);


// ==================== LEVEL 9 ====================

QUESTIONS[9].push(
  {
    q: 'Màu Mocha Mousse được Pantone chọn làm Màu của năm 2025 thuộc tông màu chủ đạo nào?',
    a: ['Vàng chanh', 'Tím', 'Nâu', 'Xanh ngọc'],
    c: 2
  },
  {
    q: 'Theo Readers’ Choice Awards 2025 của Condé Nast Traveler, đảo nào của Việt Nam đứng đầu châu Á?',
    a: ['Cát Bà', 'Phú Quốc', 'Côn Đảo', 'Nam Du'],
    c: 1
  },
  {
    q: 'Đâu không thuộc "Tứ đại phát minh" của Trung Quốc cổ đại?',
    a: ['La bàn', 'Thuốc súng', 'Đồng hồ nước', 'Giấy'],
    c: 2
  },
  {
    q: 'Quốc gia nào trở thành thành viên thứ 11 của ASEAN vào tháng 10/2025?',
    a: ['Papua New Guinea', 'Bhutan', 'Timor-Leste', 'Bangladesh'],
    c: 2
  }
);


// ==================== LEVEL 10 ====================

QUESTIONS[10].push(
  {
    q: 'COPD là tên viết tắt của một nhóm bệnh chủ yếu ảnh hưởng đến cơ quan nào?',
    a: ['Tim', 'Gan', 'Thận', 'Phổi'],
    c: 3
  },
  {
    q: 'Hình "Lục hoa ngư" được chạm trên Cửu Đỉnh ở Huế thể hiện loài cá nào?',
    a: ['Cá voi', 'Cá sấu', 'Cá rô', 'Cá lóc'],
    c: 3
  },
  {
    q: 'Schengen, ngôi làng đặt tên cho khu vực đi lại tự do Schengen, thuộc quốc gia nào?',
    a: ['Bỉ', 'Pháp', 'Luxembourg', 'Đức'],
    c: 2
  },
  {
    q: 'Làng nghề Kim Bồng ở Hội An nổi tiếng với nghề nào?',
    a: ['Làm đèn lồng', 'Trồng rau', 'Làm mộc', 'Làm gốm'],
    c: 2
  }
);


// ==================== LEVEL 11 ====================

QUESTIONS[11].push(
  {
    q: 'Lâu đài nào của Đức được cho là một nguồn cảm hứng cho lâu đài trong phim "Người đẹp ngủ trong rừng" của Disney?',
    a: ['Neuschwanstein', 'Versailles', 'Windsor', 'Pena'],
    c: 0
  },
  {
    q: 'Mozart được cho là đã sáng tác những tác phẩm đầu tiên khi mới khoảng bao nhiêu tuổi?',
    a: ['5 tuổi', '8 tuổi', '10 tuổi', '12 tuổi'],
    c: 0
  },
  {
    q: 'Trong "Côn Sơn ca", Nguyễn Trãi ví tiếng suối chảy với âm thanh của loại nhạc cụ nào?',
    a: ['Sáo', 'Chuông', 'Đàn cầm', 'Trống'],
    c: 2
  },
  {
    q: 'Tiếng Estonia, tiếng Phần Lan và tiếng Hungary đều thuộc ngữ hệ nào?',
    a: ['Slav', 'German', 'Ural', 'Balt'],
    c: 2
  }
);


// ==================== LEVEL 12 ====================

QUESTIONS[12].push(
  {
    q: 'Ai đứng đầu danh sách "Những phụ nữ quyền lực nhất thế giới" của Forbes năm 2025?',
    a: ['Christine Lagarde', 'Giorgia Meloni', 'Ursula von der Leyen', 'Claudia Sheinbaum'],
    c: 2
  },
  {
    q: 'Sao Bắc Cực hiện nằm trong chòm sao nào?',
    a: ['Đại Hùng', 'Tiểu Hùng', 'Thiên Nga', 'Tiên Hậu'],
    c: 1
  },
  {
    q: 'Nghệ thuật pháp lam ở Việt Nam phát triển đặc biệt rực rỡ dưới triều đại nào?',
    a: ['Nhà Lý', 'Nhà Nguyễn', 'Nhà Trần', 'Nhà Hồ'],
    c: 1
  },
  {
    q: 'Một hố va chạm mang tên họa sĩ Tô Ngọc Vân nằm trên hành tinh nào?',
    a: ['Sao Mộc', 'Sao Thủy', 'Sao Hỏa', 'Sao Kim'],
    c: 1
  }
);


// ==================== LEVEL 13 ====================

QUESTIONS[13].push(
  {
    q: 'Điểm thấp nhất trên lục địa châu Mỹ so với mực nước biển nằm tại quốc gia nào?',
    a: ['Argentina', 'Canada', 'Venezuela', 'Brazil'],
    c: 0
  },
  {
    q: 'Robert Koch nhận giải Nobel Y Sinh năm 1905 nhờ các nghiên cứu chủ yếu liên quan đến bệnh nào?',
    a: ['Bạch hầu', 'Sốt rét', 'Lao', 'Dịch hạch'],
    c: 2
  },
  {
    q: 'Đài thiên văn vô tuyến ALMA được đặt tại quốc gia Nam Mỹ nào?',
    a: ['Peru', 'Argentina', 'Bolivia', 'Chile'],
    c: 3
  },
  {
    q: 'Ai là tác giả phần lời của quốc ca Ấn Độ "Jana Gana Mana"?',
    a: ['Rudyard Kipling', 'Sarojini Naidu', 'Mahatma Gandhi', 'Rabindranath Tagore'],
    c: 3
  }
);


// ==================== LEVEL 14 ====================

QUESTIONS[14].push(
  {
    q: 'Virus Nipah được đặt tên theo địa danh nơi xảy ra một ổ dịch đầu tiên. "Nipah" trong trường hợp này là tên của gì?',
    a: ['Một con sông', 'Một ngôi làng', 'Một loài cây', 'Một loài dơi'],
    c: 1
  },
  {
    q: 'Loại công cụ vừa dùng trong lao động vừa có thể làm vũ khí của nhiều dân tộc Trường Sơn – Tây Nguyên được gọi là gì?',
    a: ['Pa điền xang', 'Đuống', 'Xà gạc', 'Thò'],
    c: 2
  },
  {
    q: 'Bài phú "Ngọc tỉnh liên" nổi tiếng thời Trần là tác phẩm của ai?',
    a: ['Trương Hán Siêu', 'Phạm Sư Mạnh', 'Mạc Đĩnh Chi', 'Chu Văn An'],
    c: 2
  },
  {
    q: 'Trong bố cục truyền thống của một bài văn tế, phần nào sau đây không phải tên một phần chính?',
    a: ['Lung khởi', 'Thích thực', 'Luận', 'Kết'],
    c: 2
  }
);


// ==================== LEVEL 15 ====================

QUESTIONS[15].push(
  {
    q: 'Câu "Đến ngày thắng lợi, nhân dân ta sẽ xây dựng lại đất nước ta đàng hoàng hơn, to đẹp hơn" xuất hiện trong văn kiện nào của Chủ tịch Hồ Chí Minh?',
    a: [
      'Lời kêu gọi đồng bào và chiến sĩ cả nước',
      'Lời kêu gọi toàn quốc kháng chiến',
      'Di chúc',
      'Đường Kách mệnh'
    ],
    c: 0
  },
  {
    q: 'Ai là người nhận giải Nobel Vật lý đầu tiên trong lịch sử vào năm 1901?',
    a: ['Wilhelm Conrad Röntgen', 'Max Planck', 'Hendrik Lorentz', 'Albert Einstein'],
    c: 0
  },
  {
    q: 'Bản giao hưởng số mấy của Beethoven có chương đầu được đưa vào Đĩa vàng Voyager gửi ra không gian?',
    a: ['Số 3', 'Số 5', 'Số 7', 'Số 9'],
    c: 1
  },
  {
    q: 'Trong 12 di sản đầu tiên được UNESCO ghi danh năm 1978, quốc gia nào có cả Quần đảo Galápagos và Thành phố Quito?',
    a: ['Ecuador', 'Canada', 'Ethiopia', 'Peru'],
    c: 0
  }
);