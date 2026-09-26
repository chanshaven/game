/* ============================================================================
   Ô CHỮ BÍ MẬT — NGÂN HÀNG BỘ ĐỀ
   ----------------------------------------------------------------------------
   Mỗi bộ đề là một khối { } gồm 3 phần:

     topic    tên chủ đề, hiện ở góc trên màn hình
     keyword  TỪ KHOÁ hàng dọc (viết HOA, có dấu). Bỏ dấu cách ra thì mỗi
              chữ cái ứng với đúng một hàng ngang, theo thứ tự trên xuống.
     rows     danh sách hàng ngang, mỗi hàng viết theo dạng:

                  ["ĐÁP ÁN", k, "Câu hỏi"]

              k = vị trí chữ cái của hàng này nằm trên cột từ khoá,
                  ĐẾM TỪ 0 và KHÔNG tính dấu cách.

              Ví dụ hàng 1: từ khoá "THỰC VẬT" có chữ đầu là T.
              Đáp án "NHIỆT ĐỘ" bỏ dấu cách ra là  N H I Ệ T Đ Ộ
                                          vị trí:  0 1 2 3 4 5 6
              Chữ T nằm ở vị trí 4  ->  k = 4

              Lười đếm thì ghi  null  thay cho số, game sẽ tự dò. Nếu chữ đó
              xuất hiện nhiều lần trong đáp án, game lấy chỗ đầu tiên và báo
              trong Console (F12) để bạn kiểm lại.

   THÊM BỘ ĐỀ MỚI: chép nguyên một khối { ... }, dán xuống dưới, nhớ có dấu
   phẩy ngăn giữa các khối. Có từ 2 bộ trở lên, game tự hiện ô chọn chủ đề.

   SỐ HÀNG NGANG PHẢI BẰNG SỐ CHỮ CÁI CỦA TỪ KHOÁ. Sai chỗ nào, mở Console
   (F12) sẽ thấy báo đỏ chỉ rõ bộ đề nào, hàng nào.
   ========================================================================== */

(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. TỪ KHÓA: TITANIC
  
     Không câu hỏi nào nhắc Titanic.
     Các đáp án khi ghép lại mới dẫn người chơi tới Titanic.
     ========================================================= */
  {
    topic: "Sự kiện lịch sử",
    keyword: "TITANIC",
    rows: [

      ["WHITE STAR LINE", 3,
        "Hãng vận tải biển Anh nào từng là đối thủ lớn của Cunard Line đầu thế kỷ XX?"],

      ["ICEBERG", 0,
        "Khối băng lớn trôi nổi trên biển được gọi bằng từ tiếng Anh nào?"],

      ["ATLANTIC", 1,
        "Đại dương nằm giữa châu Mỹ với châu Âu và châu Phi có tên tiếng Anh là gì?"],

      ["CARPATHIA", 1,
        "Con tàu nào đã cứu hơn 700 người sống sót trong một thảm họa hàng hải nổi tiếng năm 1912?"],

      ["NEW YORK", 0,
        "Thành phố Mỹ có tượng Nữ thần Tự do nằm ở cửa ngõ cảng là thành phố nào?"],

      ["SMITH", 2,
        "Họ của thuyền trưởng Edward John, người thiệt mạng trong một thảm họa hàng hải năm 1912, là gì?"],

      ["CHERBOURG", 0,
        "Cảng biển của Pháp từng là điểm dừng trên nhiều tuyến vượt Đại Tây Dương đầu thế kỷ XX có tên là gì?"]

    ]
  },


  /* =========================================================
     2. TỪ KHÓA: BEATLES
  
     Không dùng "The Beatles" trong bất kỳ câu hỏi nào.
     ========================================================= */
  {
    topic: "Âm nhạc",
    keyword: "BEATLES",
    rows: [

      ["ABBEY ROAD", 1,
        "Album năm 1969 nào nổi tiếng với bìa ảnh bốn nhạc sĩ đang băng qua một vạch sang đường?"],

      ["HEY JUDE", 1,
        "Ca khúc nào được Paul McCartney viết với ý định an ủi Julian Lennon?"],

      ["PAUL MCCARTNEY", 1,
        "Nhạc sĩ người Anh nào là người sáng tác chính ca khúc Yesterday?"],

      ["RINGO STARR", 6,
        "Richard Starkey được công chúng biết đến nhiều hơn bằng nghệ danh nào?"],

      ["JOHN LENNON", 4,
        "Nhạc sĩ nào sáng tác và thể hiện ca khúc Imagine?"],

      ["GEORGE HARRISON", 1,
        "Ai là tác giả ca khúc While My Guitar Gently Weeps?"],

      ["YELLOW SUBMARINE", 6,
        "Ca khúc nổi tiếng nào lấy hình ảnh một chiếc tàu ngầm màu vàng làm chủ đề?"]

    ]
  },


  /* =========================================================
     3. TỪ KHÓA: PARIS
  
     Các hàng ngang là những biểu tượng, địa điểm và yếu tố
     cùng hội tụ vào một thành phố.
     ========================================================= */
  {
    topic: "Thành phố thế giới",
    keyword: "PARIS",
    rows: [

      ["PANTHÉON", 0,
        "Công trình nào là nơi an nghỉ của nhiều danh nhân Pháp như Victor Hugo, Voltaire và Rousseau?"],

      ["ARC DE TRIOMPHE", 0,
        "Khải hoàn môn nổi tiếng nằm tại quảng trường Charles de Gaulle có tên tiếng Pháp là gì?"],

      ["LOUVRE", 4,
        "Bảo tàng nào lưu giữ bức Mona Lisa của Leonardo da Vinci?"],

      ["SEINE", 2,
        "Dòng sông nào chảy dưới những cây cầu nổi tiếng như Pont Neuf và Pont Alexandre III?"],

      ["SACRÉ CŒUR", 0,
        "Vương cung thánh đường màu trắng nổi bật trên đồi Montmartre có tên là gì?"]

    ]
  }

);
