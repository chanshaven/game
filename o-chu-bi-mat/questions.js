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

      ["SACRÉ COEUR", 0,
        "Vương cung thánh đường màu trắng nổi bật trên đồi Montmartre có tên là gì?"]

    ]
  }

);


(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. AMAZON
     ========================================================= */
  {
    topic: "Thiên nhiên thế giới",
    keyword: "AMAZON",
    rows: [
      ["PIRANHA", 3,
        "Loài cá nước ngọt Nam Mỹ nào nổi tiếng với hàm răng sắc và khỏe?"],

      ["MANAUS", 0,
        "Thành phố lớn của Brazil nằm gần nơi hai dòng Rio Negro và Solimões gặp nhau là đâu?"],

      ["ANDES", 0,
        "Dãy núi dài chạy dọc phía tây Nam Mỹ có tên là gì?"],

      ["BRAZIL", 3,
        "Quốc gia nào sở hữu phần lớn diện tích rừng mưa nhiệt đới lớn nhất Nam Mỹ?"],

      ["CÁ HEO HỒNG", 4,
        "Loài thú có vú nước ngọt nổi tiếng ở lưu vực Nam Mỹ với màu da có thể chuyển hồng là gì?"],

      ["ANACONDA", 1,
        "Loài trăn nước khổng lồ sống ở Nam Mỹ thường được gọi bằng tên nào?"]
    ]
  },


  /* =========================================================
     2. EVEREST
     ========================================================= */
  {
    topic: "Chinh phục đỉnh cao",
    keyword: "EVEREST",
    rows: [
      ["NEPAL", 1,
        "Quốc gia có thủ đô Kathmandu và là điểm xuất phát của tuyến leo núi nổi tiếng từ phía nam là đâu?"],

      ["SEVEN SUMMITS", 2,
        "Thử thách chinh phục đỉnh núi cao nhất của mỗi châu lục thường được gọi bằng tên tiếng Anh nào?"],

      ["SHERPA", 2,
        "Cộng đồng dân tộc vùng Himalaya nổi tiếng với kỹ năng leo núi được gọi là gì?"],

      ["HILLARY", 5,
        "Họ của nhà leo núi New Zealand cùng Tenzing Norgay thực hiện cuộc chinh phục lịch sử năm 1953 là gì?"],

      ["TENZING NORGAY", 1,
        "Nhà leo núi người Sherpa đồng hành cùng Edmund Hillary năm 1953 là ai?"],

      ["SOUTH COL", 0,
        "Yên núi cao nằm giữa hai đỉnh Everest và Lhotse được gọi bằng tên tiếng Anh nào?"],

      ["TIBET", 0,
        "Cao nguyên ở phía bắc dãy Himalaya thuộc khu vực nào?"]
    ]
  },


  /* =========================================================
     3. VENICE
     ========================================================= */
  {
    topic: "Thành phố châu Âu",
    keyword: "VENICE",
    rows: [
      ["VAPORETTO", 0,
        "Phương tiện giao thông công cộng đường thủy đặc trưng ở một thành phố đầm phá của Ý gọi là gì?"],

      ["BRIDGE OF SIGHS", 5,
        "Cây cầu kín nổi tiếng nối Dinh Tổng trấn với khu nhà tù cũ có tên tiếng Anh là gì?"],

      ["GRAND CANAL", 3,
        "Tuyến đường thủy lớn uốn cong hình chữ S xuyên qua thành phố đầm phá nổi tiếng của Ý gọi là gì?"],

      ["RIALTO", 1,
        "Cây cầu đá nổi tiếng bắc qua Grand Canal có tên là gì?"],

      ["CARNIVAL", 0,
        "Lễ hội hóa trang nổi tiếng với những chiếc mặt nạ cầu kỳ thường được gọi bằng từ tiếng Anh nào?"],

      ["DOGE", 3,
        "Tước hiệu lịch sử dành cho người đứng đầu một số cộng hòa hàng hải của Ý là gì?"]
    ]
  },


  /* =========================================================
     4. MOZART
     ========================================================= */
  {
    topic: "Âm nhạc cổ điển",
    keyword: "MOZART",
    rows: [
      ["MAGIC FLUTE", 0,
        "Vở opera có nhân vật Tamino, Pamina và Nữ hoàng Bóng đêm mang tên tiếng Anh là gì?"],

      ["DON GIOVANNI", 1,
        "Vở opera nổi tiếng kể về một quý tộc quyến rũ phụ nữ có tên là gì?"],

      ["SALZBURG", 3,
        "Thành phố Áo nổi tiếng là nơi sinh của một thần đồng âm nhạc năm 1756 là đâu?"],

      ["AMADEUS", 0,
        "Tên đệm nổi tiếng xuất hiện trong tên đầy đủ Wolfgang ... Mozart là gì?"],

      ["REQUIEM", 0,
        "Tác phẩm thánh lễ cầu hồn còn dang dở khi nhà soạn nhạc qua đời được gọi là gì?"],

      ["JUPITER", 4,
        "Biệt danh thường dùng cho bản Giao hưởng số 41 là gì?"]
    ]
  },


  /* =========================================================
     5. HOLMES
     ========================================================= */
  {
    topic: "Trinh thám văn học",
    keyword: "HOLMES",
    rows: [
      ["HOUND OF BASKERVILLES", 0,
        "Tiểu thuyết trinh thám nào xoay quanh lời nguyền về một con chó săn khổng lồ?"],

      ["WATSON", 4,
        "Bác sĩ và cựu quân y nào thường kể lại các vụ án của người bạn thám tử nổi tiếng?"],

      ["LONDON", 0,
        "Phần lớn những cuộc điều tra trong loạt truyện của Arthur Conan Doyle diễn ra ở thành phố nào?"],

      ["MORIARTY", 0,
        "Giáo sư tội phạm được xem là đối thủ nguy hiểm nhất của vị thám tử nổi tiếng tên là gì?"],

      ["BAKER STREET", 3,
        "Con phố gắn với địa chỉ 221B nổi tiếng trong văn học trinh thám là phố nào?"],

      ["SCOTLAND YARD", 0,
        "Cơ quan cảnh sát nổi tiếng của thủ đô Anh thường xuất hiện trong các truyện trinh thám được gọi là gì?"]
    ]
  },


  /* =========================================================
     6. EINSTEIN
     ========================================================= */
  {
    topic: "Danh nhân khoa học",
    keyword: "EINSTEIN",
    rows: [
      ["RELATIVITY", 1,
        "Lý thuyết vật lý làm thay đổi quan niệm về không gian và thời gian có tên tiếng Anh là gì?"],

      ["PRINCETON", 2,
        "Thành phố đại học của Mỹ nơi một nhà vật lý nổi tiếng làm việc những năm cuối đời là đâu?"],

      ["NOBEL", 0,
        "Giải thưởng quốc tế mà nhà vật lý này nhận năm 1921 thuộc hệ giải nào?"],

      ["SWITZERLAND", 0,
        "Quốc gia châu Âu nơi ông từng làm việc tại một văn phòng sáng chế là nước nào?"],

      ["PATENT OFFICE", 2,
        "Nơi làm việc của ông tại Bern trước khi nổi tiếng trong giới học thuật có tên tiếng Anh là gì?"],

      ["PHOTOELECTRIC EFFECT", 5,
        "Hiện tượng vật lý nào là cơ sở chính cho giải Nobel Vật lý mà ông được trao?"],

      ["ZURICH", 3,
        "Thành phố Thụy Sĩ nơi ETH, ngôi trường ông từng theo học, tọa lạc là đâu?"],

      ["BROWNIAN MOTION", 4,
        "Chuyển động ngẫu nhiên của các hạt nhỏ trong chất lỏng được gọi bằng tên tiếng Anh nào?"]
    ]
  },


  /* =========================================================
     7. DARWIN
     ========================================================= */
  {
    topic: "Sinh học",
    keyword: "DARWIN",
    rows: [
      ["DOWN HOUSE", 0,
        "Ngôi nhà ở Anh nơi một nhà tự nhiên học nổi tiếng sống và làm việc trong nhiều thập kỷ có tên là gì?"],

      ["GALAPAGOS", 1,
        "Quần đảo ngoài khơi Ecuador nổi tiếng với các loài đặc hữu có tên là gì?"],

      ["NATURAL SELECTION", 4,
        "Cơ chế trong đó những đặc điểm thích nghi giúp sinh vật có khả năng sinh tồn và sinh sản tốt hơn gọi là gì?"],

      ["WALLACE", 0,
        "Nhà tự nhiên học Alfred Russel nào độc lập phát triển ý tưởng về chọn lọc tự nhiên?"],

      ["FINCHES", 1,
        "Nhóm chim nhỏ trên các đảo Thái Bình Dương thường được nhắc đến trong nghiên cứu về thích nghi gọi là gì?"],

      ["ON THE ORIGIN OF SPECIES", 1,
        "Cuốn sách năm 1859 trình bày lập luận về sự biến đổi của các loài có tên tiếng Anh là gì?"]
    ]
  },


  /* =========================================================
     8. SATURN
     ========================================================= */
  {
    topic: "Hệ Mặt Trời",
    keyword: "SATURN",
    rows: [
      ["HÀNH TINH THỨ SÁU", 11,
        "Nếu đếm từ Mặt Trời ra ngoài, thiên thể nổi tiếng với hệ vành rộng đứng ở vị trí thứ mấy?"],

      ["CASSINI", 1,
        "Tàu thăm dò nào từng nghiên cứu một hành tinh khí khổng lồ và các vệ tinh của nó trong hơn một thập kỷ?"],

      ["TITAN", 0,
        "Vệ tinh lớn có khí quyển dày và những hồ hydrocarbon lỏng mang tên gì?"],

      ["ENCELADUS", 7,
        "Vệ tinh băng giá nổi tiếng với các cột hơi nước phun ra từ vùng cực nam tên là gì?"],

      ["RHEA", 0,
        "Vệ tinh lớn thứ hai của hành tinh có Titan mang tên vị nữ thần nào?"],

      ["HEXAGON", 6,
        "Dòng khí quyển nổi tiếng quanh cực bắc của hành tinh có Titan mang hình dạng gì?"]
    ]
  },


  /* =========================================================
     9. HOGWARTS
     ========================================================= */
  {
    topic: "Thế giới phù thủy",
    keyword: "HOGWARTS",
    rows: [
      ["HAGRID", 0,
        "Người khổng lồ lai rất yêu sinh vật huyền bí và là bạn thân của Harry tên là gì?"],

      ["DUMBLEDORE", 7,
        "Phù thủy cao tuổi nổi tiếng với bộ râu dài và cây đũa phép Cơm nguội là ai?"],

      ["GRYFFINDOR", 0,
        "Nhà có biểu tượng sư tử và màu đỏ vàng mang tên gì?"],

      ["HEDWIG", 3,
        "Con cú tuyết của Harry tên là gì?"],

      ["ASTRONOMY TOWER", 0,
        "Tòa tháp cao dùng cho việc quan sát các thiên thể được gọi bằng tên tiếng Anh nào?"],

      ["ROOM OF REQUIREMENT", 0,
        "Căn phòng chỉ xuất hiện khi người sử dụng thực sự cần nó có tên tiếng Anh là gì?"],

      ["SORTING HAT", 3,
        "Chiếc mũ có nhiệm vụ phân loại học sinh mới vào bốn nhà được gọi là gì?"],

      ["SLYTHERIN", 0,
        "Nhà có biểu tượng con rắn và màu xanh lá bạc mang tên gì?"]
    ]
  },


  /* =========================================================
     10. BATMAN
     ========================================================= */
  {
    topic: "Siêu anh hùng",
    keyword: "BATMAN",
    rows: [
      ["BRUCE WAYNE", 0,
        "Tỷ phú sở hữu Wayne Enterprises và bí mật hoạt động về đêm tên là gì?"],

      ["GOTHAM", 4,
        "Thành phố hư cấu thường xuyên bị những tên tội phạm như Joker đe dọa có tên là gì?"],

      ["TWO FACE", 0,
        "Harvey Dent sau khi trở thành phản diện được biết đến với biệt danh nào?"],

      ["WAYNE MANOR", 5,
        "Dinh thự của gia đình Bruce Wayne được gọi bằng tên gì?"],

      ["ALFRED", 0,
        "Người quản gia trung thành đã chăm sóc Bruce Wayne từ nhỏ tên là gì?"],

      ["NIGHTWING", 0,
        "Dick Grayson sử dụng danh tính siêu anh hùng nào sau khi trưởng thành?"]
    ]
  },


  /* =========================================================
     11. PICASSO
     ========================================================= */
  {
    topic: "Hội họa",
    keyword: "PICASSO",
    rows: [
      ["BLUE PERIOD", 4,
        "Giai đoạn hội họa đầu thế kỷ XX nổi bật với gam xanh lạnh thường được gọi bằng tên tiếng Anh nào?"],

      ["GUERNICA", 5,
        "Bức tranh khổ lớn phản ánh sự tàn phá của một thị trấn Tây Ban Nha năm 1937 có tên là gì?"],

      ["CUBISM", 0,
        "Trường phái nghệ thuật phân tách đối tượng thành các hình khối và nhiều góc nhìn gọi là gì?"],

      ["MALAGA", 1,
        "Thành phố miền nam Tây Ban Nha nơi một danh họa thế kỷ XX sinh ra là đâu?"],

      ["SPAIN", 0,
        "Quốc gia quê hương của danh họa sáng tác Guernica là nước nào?"],

      ["ROSE PERIOD", 2,
        "Giai đoạn sáng tác sau Blue Period với nhiều gam hồng và cam được gọi là gì?"],

      ["AVIGNON", 5,
        "Địa danh xuất hiện trong tên tác phẩm Les Demoiselles d'... là gì?"]
    ]
  },


  /* =========================================================
     12. MARIO
     ========================================================= */
  {
    topic: "Trò chơi điện tử",
    keyword: "MARIO",
    rows: [
      ["MUSHROOM KINGDOM", 0,
        "Vương quốc giả tưởng nơi Công chúa Peach cai trị có tên tiếng Anh là gì?"],

      ["DAISY", 1,
        "Công chúa cai trị Sarasaland và thường xuất hiện trong các trò chơi thể thao tên là gì?"],

      ["PRINCESS PEACH", 1,
        "Công chúa thường bị Bowser bắt cóc mang tên gì?"],

      ["YOSHI", 4,
        "Chú khủng long màu xanh thường giúp người thợ sửa ống nước trong các cuộc phiêu lưu tên là gì?"],

      ["BOWSER", 1,
        "Vua Koopa thường đóng vai trò phản diện chính tên là gì?"]
    ]
  },


  /* =========================================================
     13. DISNEY
     ========================================================= */
  {
    topic: "Điện ảnh và hoạt hình",
    keyword: "DISNEY",
    rows: [
      ["DONALD DUCK", 0,
        "Chú vịt nóng tính thường mặc áo thủy thủ nhưng không mặc quần tên là gì?"],

      ["MICKEY MOUSE", 1,
        "Nhân vật chuột nổi tiếng xuất hiện lần đầu trong Steamboat Willie tên là gì?"],

      ["SNOW WHITE", 0,
        "Nàng công chúa sống cùng bảy chú lùn trong một bộ phim hoạt hình kinh điển tên là gì?"],

      ["FROZEN", 5,
        "Bộ phim có hai chị em Elsa và Anna mang tên tiếng Anh là gì?"],

      ["CINDERELLA", 4,
        "Nàng công chúa để lại chiếc giày thủy tinh tại buổi dạ hội tên là gì?"],

      ["MARY POPPINS", 3,
        "Cô bảo mẫu có phép thuật trong bộ phim ca nhạc nổi tiếng năm 1964 tên là gì?"]
    ]
  },


  /* =========================================================
     14. TOLKIEN
     ========================================================= */
  {
    topic: "Văn học kỳ ảo",
    keyword: "TOLKIEN",
    rows: [
      ["THE HOBBIT", 0,
        "Tiểu thuyết kể chuyến phiêu lưu của Bilbo Baggins có tên là gì?"],

      ["OXFORD", 0,
        "Thành phố đại học Anh nơi tác giả của Middle Earth từng giảng dạy là đâu?"],

      ["LORD OF THE RINGS", 0,
        "Bộ tiểu thuyết xoay quanh hành trình tiêu hủy One Ring có tên tiếng Anh là gì?"],

      ["INKLINGS", 2,
        "Nhóm văn học tại Oxford có C S Lewis và tác giả của Middle Earth là thành viên được gọi là gì?"],

      ["SILMARILLION", 1,
        "Tác phẩm kể nhiều thần thoại và lịch sử thời kỳ đầu của Middle Earth mang tên gì?"],

      ["MIDDLE EARTH", 5,
        "Thế giới giả tưởng nơi Gondor, Mordor và Shire cùng tồn tại được gọi là gì?"],

      ["NUMENOR", 0,
        "Vương quốc đảo của loài người trong truyền thuyết về Second Age có tên là gì?"]
    ]
  },


  /* =========================================================
     15. NEWTON
     ========================================================= */
  {
    topic: "Lịch sử khoa học",
    keyword: "NEWTON",
    rows: [
      ["PRINCIPIA", 3,
        "Tác phẩm trình bày các định luật chuyển động và hấp dẫn thường được gọi ngắn gọn bằng tên Latin nào?"],

      ["APPLE", 4,
        "Loại quả gắn với giai thoại nổi tiếng về ý tưởng hấp dẫn có tên tiếng Anh là gì?"],

      ["WOOLSTHORPE", 0,
        "Trang viên tại Lincolnshire nơi một nhà khoa học Anh sinh ra có tên là gì?"],

      ["GRAVITATION", 5,
        "Lực hút giữa các vật có khối lượng được gọi bằng từ tiếng Anh nào?"],

      ["OPTICS", 0,
        "Tác phẩm xuất bản năm 1704 nghiên cứu ánh sáng mang tên tiếng Anh là gì?"],

      ["BINOMIAL THEOREM", 2,
        "Định lý dùng để khai triển lũy thừa của tổng hai số có tên tiếng Anh là gì?"]
    ]
  },


  /* =========================================================
     16. GALILEO
     ========================================================= */
  {
    topic: "Thiên văn học",
    keyword: "GALILEO",
    rows: [
      ["GANYMEDE", 0,
        "Vệ tinh lớn nhất Hệ Mặt Trời mang tên một chàng trai trong thần thoại Hy Lạp là gì?"],

      ["CALLISTO", 1,
        "Vệ tinh lớn phủ đầy hố va chạm, là một trong bốn vệ tinh lớn được quan sát năm 1610, tên là gì?"],

      ["LEANING TOWER", 0,
        "Công trình nghiêng nổi tiếng của thành phố Pisa có tên tiếng Anh là gì?"],

      ["INQUISITION", 0,
        "Tòa án tôn giáo từng xét xử một nhà thiên văn Ý nổi tiếng thường được gọi bằng tên tiếng Anh nào?"],

      ["LUNAR MOUNTAINS", 0,
        "Những địa hình nhô cao trên bề mặt Mặt Trăng được quan sát qua kính thiên văn thời kỳ đầu có thể gọi là gì bằng tiếng Anh?"],

      ["EUROPA", 0,
        "Vệ tinh băng giá được cho là có đại dương bên dưới bề mặt tên là gì?"],

      ["IO", 1,
        "Vệ tinh có hoạt động núi lửa mạnh nhất Hệ Mặt Trời tên là gì?"]
    ]
  },


  /* =========================================================
     17. LEONARDO
     ========================================================= */
  {
    topic: "Thời kỳ Phục Hưng",
    keyword: "LEONARDO",
    rows: [
      ["LAST SUPPER", 0,
        "Bức bích họa mô tả bữa ăn cuối cùng của Chúa Jesus với các môn đồ có tên tiếng Anh là gì?"],

      ["VERROCCHIO", 1,
        "Nghệ sĩ Andrea del nào từng là thầy của một thiên tài thời Phục Hưng?"],

      ["MONA LISA", 1,
        "Bức chân dung nổi tiếng với nụ cười bí ẩn đang được trưng bày tại Louvre có tên là gì?"],

      ["VINCI", 2,
        "Thị trấn Toscana gắn với nơi sinh của một thiên tài Phục Hưng mang tên gì?"],

      ["ANATOMY", 0,
        "Lĩnh vực nghiên cứu cấu tạo cơ thể mà nhiều bản vẽ khoa học thời Phục Hưng tập trung vào gọi là gì bằng tiếng Anh?"],

      ["VITRUVIAN MAN", 3,
        "Bản vẽ một người đàn ông trong hình vuông và hình tròn có tên tiếng Anh là gì?"],

      ["CODEX ATLANTICUS", 2,
        "Bộ sưu tập lớn gồm các bản thảo và bản vẽ kỹ thuật được lưu tại Milan có tên là gì?"],

      ["ORNITHOPTER", 0,
        "Loại máy bay giả tưởng dùng cánh đập mô phỏng chim được gọi là gì?"]
    ]
  },


  /* =========================================================
     18. CHOPIN
     ========================================================= */
  {
    topic: "Âm nhạc cổ điển",
    keyword: "CHOPIN",
    rows: [
      ["CONCERTO", 0,
        "Thể loại tác phẩm dành cho nhạc cụ độc tấu cùng dàn nhạc được gọi là gì?"],

      ["SCHERZO", 2,
        "Thể loại tác phẩm có tên tiếng Ý mang nghĩa gần với “trò đùa” được gọi là gì?"],

      ["POLONAISE", 1,
        "Điệu nhảy trang trọng có nguồn gốc Ba Lan thường xuất hiện trong các tác phẩm piano gọi là gì?"],

      ["PIANO", 0,
        "Nhạc cụ phím nào gắn đặc biệt mật thiết với sự nghiệp của nhà soạn nhạc Ba Lan thế kỷ XIX?"],

      ["PARIS", 3,
        "Thành phố nào trở thành trung tâm cuộc đời nghệ thuật của ông từ đầu thập niên 1830?"],

      ["NOCTURNE", 0,
        "Thể loại tiểu phẩm âm nhạc mang tính trữ tình, gợi không khí ban đêm được gọi là gì?"]
    ]
  },


  /* =========================================================
     19. SHAKESPEARE
     ========================================================= */
  {
    topic: "Sân khấu và văn học",
    keyword: "SHAKESPEARE",
    rows: [
      ["SONNET", 0,
        "Thể thơ 14 dòng mà một đại văn hào Anh để lại hơn một trăm bài được gọi là gì?"],

      ["HAMLET", 0,
        "Hoàng tử Đan Mạch nổi tiếng với câu hỏi về tồn tại và cái chết tên là gì?"],

      ["MACBETH", 1,
        "Vị tướng Scotland bị tham vọng quyền lực và lời tiên tri dẫn đến bi kịch tên là gì?"],

      ["KING LEAR", 0,
        "Bi kịch kể về một vị vua chia vương quốc cho các con gái mang tên gì?"],

      ["ROMEO", 3,
        "Chàng trai thuộc gia đình Montague yêu Juliet tên là gì?"],

      ["STRATFORD", 0,
        "Thị trấn bên sông Avon nổi tiếng là quê hương của một đại văn hào Anh có tên gì?"],

      ["PROSPERO", 0,
        "Nhà pháp thuật và công tước bị lưu đày trong The Tempest tên là gì?"],

      ["GLOBE", 4,
        "Nhà hát nổi tiếng bên sông Thames gắn với nhiều vở kịch thời Elizabeth có tên là gì?"],

      ["AVON", 0,
        "Con sông chảy qua Stratford upon Avon có tên là gì?"],

      ["ROMEO AND JULIET", 0,
        "Bi kịch về đôi tình nhân thuộc hai gia đình Montague và Capulet có tên là gì?"],

      ["OTHELLO", 3,
        "Vị tướng người Moor bị Iago thao túng bởi lòng ghen tuông tên là gì?"]
    ]
  },


  /* =========================================================
     20. BEETHOVEN
     ========================================================= */
  {
    topic: "Âm nhạc cổ điển",
    keyword: "BEETHOVEN",
    rows: [
      ["BONN", 0,
        "Thành phố Đức bên sông Rhine nơi một nhà soạn nhạc vĩ đại sinh năm 1770 là đâu?"],

      ["EROICA", 0,
        "Biệt danh tiếng Ý của bản Giao hưởng số 3 là gì?"],

      ["FIDELIO", 3,
        "Vở opera duy nhất của nhà soạn nhạc này có tên là gì?"],

      ["NINTH SYMPHONY", 3,
        "Bản giao hưởng nổi tiếng sử dụng hợp xướng trong chương cuối thường được gọi bằng tên tiếng Anh nào?"],

      ["HEILIGENSTADT", 0,
        "Địa danh xuất hiện trong tên bức di chúc nổi tiếng mà một nhà soạn nhạc viết năm 1802 là gì?"],

      ["ODE TO JOY", 0,
        "Phần hợp xướng nổi tiếng dựa trên thơ của Schiller thường được gọi bằng tên tiếng Anh nào?"],

      ["VIENNA", 0,
        "Thành phố châu Âu nơi nhà soạn nhạc này sống phần lớn sự nghiệp trưởng thành là đâu?"],

      ["EMPEROR", 0,
        "Biệt danh tiếng Anh thường gắn với Piano Concerto số 5 là gì?"],

      ["MOONLIGHT", 3,
        "Biệt danh tiếng Anh nổi tiếng của Piano Sonata số 14 là gì?"]
    ]
  }

);


(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. VAN GOGH
     ========================================================= */
  {
    topic: "Danh họa thế giới",
    keyword: "VAN GOGH",
    rows: [
      ["VINCENT", 0,
        "Tên riêng của người họa sĩ Hà Lan có người em trai tên Theo là gì?"],

      ["ARLES", 0,
        "Thành phố miền nam nước Pháp nổi tiếng với đấu trường La Mã cổ có tên là gì?"],

      ["SUNFLOWERS", 2,
        "Tên tiếng Anh của loài hoa có hạt thường dùng làm thực phẩm và dầu ăn là gì?"],

      ["GAUGUIN", 0,
        "Họa sĩ Pháp nào từng sống và làm việc cùng một họa sĩ Hà Lan tại Arles?"],

      ["PROVENCE", 2,
        "Vùng lịch sử ở đông nam nước Pháp nổi tiếng với hoa oải hương gọi là gì?"],

      ["GACHET", 0,
        "Vị bác sĩ nào trở thành nhân vật trong một bức chân dung nổi tiếng cuối thế kỷ XIX?"],

      ["THE HAGUE", 1,
        "Thành phố Hà Lan là nơi đặt Tòa án Công lý Quốc tế có tên tiếng Anh là gì?"]
    ]
  },


  /* =========================================================
     2. APOLLO
     ========================================================= */
  {
    topic: "Chinh phục Mặt Trăng",
    keyword: "APOLLO",
    rows: [
      ["ARMSTRONG", 0,
        "Họ của người đầu tiên đặt chân lên Mặt Trăng là gì?"],

      ["KENNEDY SPACE CENTER", 8,
        "Trung tâm không gian ở Florida nơi Saturn V được phóng năm 1969 có tên là gì?"],

      ["MOON", 1,
        "Tên tiếng Anh của vệ tinh tự nhiên duy nhất của Trái Đất là gì?"],

      ["ALDRIN", 1,
        "Họ của người thứ hai đặt chân lên Mặt Trăng là gì?"],

      ["COLLINS", 2,
        "Phi hành gia nào ở lại trên quỹ đạo Mặt Trăng trong khi hai đồng đội xuống bề mặt?"],

      ["COLUMBIA", 1,
        "Mô-đun chỉ huy đưa ba phi hành gia trở về Trái Đất năm 1969 có tên là gì?"]
    ]
  },


  /* =========================================================
     3. STAR WARS
     ========================================================= */
  {
    topic: "Điện ảnh khoa học viễn tưởng",
    keyword: "STAR WARS",
    rows: [
      ["SKYWALKER", 0,
        "Luke và Anakin có chung họ gì?"],

      ["TATOOINE", 0,
        "Hành tinh sa mạc nơi Luke lớn lên có tên là gì?"],

      ["DARTH VADER", 1,
        "Danh tính Sith của Anakin sau khi sa vào mặt tối là gì?"],

      ["ENDOR", 4,
        "Mặt trăng rừng nơi diễn ra trận chiến quan trọng với Death Star thứ hai tên là gì?"],

      ["WOOKIEE", 0,
        "Chewbacca thuộc chủng loài nào?"],

      ["ALDERAAN", 0,
        "Hành tinh quê hương của Công chúa Leia có tên là gì?"],

      ["REY", 0,
        "Cô gái nhặt phế liệu lớn lên trên Jakku tên là gì?"],

      ["SITH", 0,
        "Những người sử dụng mặt tối của Thần Lực thường thuộc tổ chức nào?"]
    ]
  },


  /* =========================================================
     4. SAHARA
     ========================================================= */
  {
    topic: "Sa mạc thế giới",
    keyword: "SAHARA",
    rows: [
      ["SAND", 0,
        "Từ tiếng Anh nào có nghĩa là cát?"],

      ["AFRICA", 0,
        "Châu lục nào có đường xích đạo đi qua gần giữa lãnh thổ?"],

      ["HOGGAR", 0,
        "Khối núi lớn nằm ở miền nam Algeria có tên là gì?"],

      ["ATLAS", 0,
        "Dãy núi chạy qua Morocco, Algeria và Tunisia có tên là gì?"],

      ["TUAREG", 3,
        "Cộng đồng du mục Berber nổi tiếng với trang phục màu chàm được gọi là gì?"],

      ["ALGERIA", 0,
        "Quốc gia có diện tích lớn nhất châu Phi hiện nay là nước nào?"]
    ]
  },


  /* =========================================================
     5. ANTARCTICA
     ========================================================= */
  {
    topic: "Thế giới băng giá",
    keyword: "ANTARCTICA",
    rows: [
      ["AMUNDSEN", 0,
        "Nhà thám hiểm Na Uy đầu tiên tới Nam Cực có họ là gì?"],

      ["PENGUIN", 2,
        "Tên tiếng Anh của loài chim biển không biết bay, thích nghi với khí hậu lạnh là gì?"],

      ["TREATY", 0,
        "Từ tiếng Anh chỉ một hiệp ước quốc tế là gì?"],

      ["ROSS SEA", 6,
        "Vùng biển lớn mang tên nhà thám hiểm James Clark Ross được gọi là gì?"],

      ["ROSS ICE SHELF", 0,
        "Thềm băng khổng lồ ở Nam bán cầu mang tên James Clark Ross gọi là gì?"],

      ["MCMURDO", 1,
        "Trạm nghiên cứu lớn của Hoa Kỳ ở vùng cực nam có tên là gì?"],

      ["VOSTOK", 3,
        "Trạm nghiên cứu của Nga nổi tiếng với nhiệt độ cực thấp mang tên gì?"],

      ["ICE SHEET", 0,
        "Khối băng phủ một vùng đất cực rộng được gọi bằng thuật ngữ tiếng Anh nào?"],

      ["CAPE CROZIER", 0,
        "Mũi đất ở đảo Ross nổi tiếng với quần thể chim cánh cụt hoàng đế tên là gì?"],

      ["ADELIE", 0,
        "Loài chim cánh cụt được đặt theo tên vợ của nhà thám hiểm Jules Dumont d'Urville gọi là gì?"]
    ]
  },


  /* =========================================================
     6. NASA
     ========================================================= */
  {
    topic: "Khám phá không gian",
    keyword: "NASA",
    rows: [
      ["NEIL ARMSTRONG", 0,
        "Ai là người đầu tiên bước lên bề mặt Mặt Trăng?"],

      ["APOLLO", 0,
        "Chương trình không gian nào đã đưa con người lên Mặt Trăng trong thế kỷ XX?"],

      ["SPACE SHUTTLE", 0,
        "Hệ thống tàu vũ trụ có thể tái sử dụng của Hoa Kỳ được gọi bằng tên tiếng Anh nào?"],

      ["ARTEMIS", 0,
        "Chương trình không gian mới được xây dựng với mục tiêu đưa con người trở lại Mặt Trăng có tên là gì?"]
    ]
  },


  /* =========================================================
     7. TESLA
     ========================================================= */
  {
    topic: "Nhà phát minh",
    keyword: "TESLA",
    rows: [
      ["ALTERNATING CURRENT", 2,
        "Dòng điện đổi chiều tuần hoàn được gọi bằng thuật ngữ tiếng Anh nào?"],

      ["EDISON", 0,
        "Nhà phát minh gắn với phòng thí nghiệm Menlo Park có họ là gì?"],

      ["SMILJAN", 0,
        "Ngôi làng thuộc Croatia nơi một nhà phát minh nổi tiếng về dòng điện xoay chiều sinh năm 1856 tên là gì?"],

      ["COLORADO SPRINGS", 2,
        "Thành phố Mỹ nơi một phòng thí nghiệm điện cao thế nổi tiếng được xây dựng năm 1899 là đâu?"],

      ["WARDENCLYFFE", 1,
        "Tòa tháp thử nghiệm truyền năng lượng và tín hiệu không dây trên Long Island có tên là gì?"]
    ]
  },


  /* =========================================================
     8. MICHELANGELO
     ========================================================= */
  {
    topic: "Nghệ thuật Phục Hưng",
    keyword: "MICHELANGELO",
    rows: [
      ["MOSES", 0,
        "Bức tượng tại San Pietro in Vincoli mô tả nhà tiên tri nào trong Kinh Thánh?"],

      ["PIETA", 1,
        "Tác phẩm điêu khắc mô tả Đức Mẹ ôm thi hài Chúa Jesus có tên tiếng Ý là gì?"],

      ["SISTINE CHAPEL", 7,
        "Nhà nguyện tại Vatican nổi tiếng với trần bích họa Phục Hưng có tên tiếng Anh là gì?"],

      ["THE CREATION OF ADAM", 1,
        "Bích họa nổi tiếng mô tả hai bàn tay gần chạm nhau có tên tiếng Anh là gì?"],

      ["FLORENCE", 4,
        "Thành phố Ý nơi tượng David nguyên bản hiện được trưng bày là đâu?"],

      ["MEDICI CHAPEL", 11,
        "Nhà nguyện tại Florence chứa nhiều lăng mộ của gia tộc Medici có tên tiếng Anh là gì?"],

      ["DAVID", 1,
        "Tượng cẩm thạch cao hơn 5 mét tại Galleria dell'Accademia mô tả nhân vật Kinh Thánh nào?"],

      ["RENAISSANCE", 2,
        "Thời kỳ văn hóa nghệ thuật châu Âu kế tiếp Trung Cổ được gọi bằng tên tiếng Anh nào?"],

      ["LAST JUDGMENT", 7,
        "Bích họa lớn trên bức tường bàn thờ Nhà nguyện Sistine có tên tiếng Anh là gì?"],

      ["SLAVES", 4,
        "Nhóm tượng dang dở còn được gọi là Prisoners thường mang tên tiếng Anh nào khác?"],

      ["JULIUS II", 2,
        "Vị giáo hoàng đầu thế kỷ XVI đặt hàng nhiều công trình nghệ thuật lớn tên là gì?"],

      ["ROME", 1,
        "Thành phố nơi Vương cung thánh đường Thánh Peter tọa lạc bên trong một quốc gia nhỏ độc lập là đâu?"]
    ]
  },


  /* =========================================================
     9. VIVALDI
     ========================================================= */
  {
    topic: "Âm nhạc Baroque",
    keyword: "VIVALDI",
    rows: [
      ["VENICE", 0,
        "Thành phố Ý nổi tiếng với Grand Canal và những chiếc gondola có tên tiếng Anh là gì?"],

      ["VIOLIN", 1,
        "Nhạc cụ dây được chơi bằng vĩ, nhỏ nhất trong họ đàn dây giao hưởng phổ biến gọi là gì?"],

      ["VIRTUOSO", 0,
        "Thuật ngữ chỉ một nghệ sĩ biểu diễn có kỹ thuật đặc biệt điêu luyện là gì?"],

      ["FOUR SEASONS", 6,
        "Bộ bốn concerto mô tả xuân, hạ, thu và đông có tên tiếng Anh là gì?"],

      ["OSPEDALE DELLA PIETA", 6,
        "Cơ sở từ thiện và đào tạo âm nhạc nữ nổi tiếng ở Venice thời Baroque có tên là gì?"],

      ["RED PRIEST", 2,
        "Biệt danh tiếng Anh của một linh mục tóc đỏ đồng thời là nhà soạn nhạc nổi tiếng là gì?"],

      ["GLORIA", 4,
        "Tác phẩm hợp xướng tôn giáo nổi tiếng mang mã RV 589 có tên là gì?"]
    ]
  },


  /* =========================================================
     10. TOKYO
     ========================================================= */
  {
    topic: "Thành phố châu Á",
    keyword: "TOKYO",
    rows: [
      ["TSUKIJI", 0,
        "Khu chợ từng nổi tiếng toàn thế giới về buôn bán cá và hải sản ở Nhật Bản tên là gì?"],

      ["EDO", 2,
        "Tên cũ của thủ đô Nhật Bản trước cuộc Minh Trị Duy Tân là gì?"],

      ["KABUKI", 0,
        "Loại hình sân khấu truyền thống Nhật Bản nổi tiếng với hóa trang cầu kỳ gọi là gì?"],

      ["SHIBUYA", 5,
        "Giao lộ dành cho người đi bộ nổi tiếng với dòng người băng qua từ nhiều hướng mang tên gì?"],

      ["SUMO", 3,
        "Môn vật truyền thống nổi tiếng của Nhật Bản được gọi là gì?"]
    ]
  },


  /* =========================================================
     11. NEW YORK
     ========================================================= */
  {
    topic: "Thành phố Hoa Kỳ",
    keyword: "NEW YORK",
    rows: [
      ["MANHATTAN", 2,
        "Quận đảo tập trung Times Square, Broadway và nhiều tòa nhà chọc trời gọi là gì?"],

      ["EMPIRE STATE BUILDING", 0,
        "Tòa nhà chọc trời Art Deco nổi tiếng hoàn thành năm 1931 có tên là gì?"],

      ["WALL STREET", 0,
        "Con phố được xem là biểu tượng của ngành tài chính Hoa Kỳ có tên là gì?"],

      ["BROOKLYN", 6,
        "Quận đông dân nằm phía bên kia East River so với Manhattan có tên là gì?"],

      ["BROADWAY", 2,
        "Khu vực sân khấu nổi tiếng của Mỹ gắn với các vở nhạc kịch lớn được gọi là gì?"],

      ["CENTRAL PARK", 4,
        "Công viên đô thị rộng lớn nằm giữa Manhattan có tên là gì?"],

      ["KNICKS", 0,
        "Đội bóng rổ NBA thi đấu tại Madison Square Garden thường được gọi ngắn gọn là gì?"]
    ]
  },


  /* =========================================================
     12. LONDON
     ========================================================= */
  {
    topic: "Thủ đô châu Âu",
    keyword: "LONDON",
    rows: [
      ["ELIZABETH TOWER", 1,
        "Tòa tháp chứa chiếc chuông Big Ben chính thức mang tên gì?"],

      ["OXFORD STREET", 0,
        "Con phố mua sắm nổi tiếng ở khu West End có tên là gì?"],

      ["WESTMINSTER ABBEY", 6,
        "Nhà thờ nơi diễn ra nhiều lễ đăng quang của các quân vương Anh có tên là gì?"],

      ["DOUBLE DECKER", 0,
        "Xe buýt hai tầng đặc trưng của Anh thường được gọi bằng cụm từ tiếng Anh nào?"],

      ["SOHO", 1,
        "Khu phố trung tâm nổi tiếng với nhà hát, nhà hàng và đời sống về đêm có tên là gì?"],

      ["CAMDEN", 5,
        "Khu vực nổi tiếng với chợ, âm nhạc và văn hóa đường phố có tên là gì?"]
    ]
  },


  /* =========================================================
     13. ROME
     ========================================================= */
  {
    topic: "Thành phố cổ đại",
    keyword: "ROME",
    rows: [
      ["TREVI FOUNTAIN", 1,
        "Đài phun nước Baroque nổi tiếng nơi du khách thường tung đồng xu có tên là gì?"],

      ["COLOSSEUM", 1,
        "Đấu trường cổ đại khổng lồ từng tổ chức các cuộc đấu võ sĩ có tên tiếng Anh là gì?"],

      ["VATICAN MUSEUMS", 7,
        "Quần thể bảo tàng lưu giữ Nhà nguyện Sistine được gọi bằng tên tiếng Anh nào?"],

      ["PANTHEON", 5,
        "Công trình cổ nổi tiếng với mái vòm lớn và lỗ tròn oculus có tên là gì?"]
    ]
  },


  /* =========================================================
     14. MARS
     ========================================================= */
  {
    topic: "Khám phá hành tinh",
    keyword: "MARS",
    rows: [
      ["OLYMPUS MONS", 3,
        "Ngọn núi lửa lớn nhất được biết đến trong Hệ Mặt Trời có tên là gì?"],

      ["MARINER", 1,
        "Dòng tàu thăm dò của Hoa Kỳ có chiếc số 4 thực hiện chuyến bay qua một hành tinh năm 1965 mang tên gì?"],

      ["CURIOSITY", 2,
        "Xe tự hành hạ cánh tại miệng hố Gale năm 2012 có tên là gì?"],

      ["SPIRIT", 0,
        "Xe tự hành song sinh với Opportunity có tên là gì?"]
    ]
  },


  /* =========================================================
     15. NARNIA
     ========================================================= */
  {
    topic: "Văn học kỳ ảo",
    keyword: "NARNIA",
    rows: [
      ["ASLAN", 4,
        "Sư tử quyền năng tượng trưng cho điều thiện trong bộ truyện của C S Lewis tên là gì?"],

      ["WARDROBE", 1,
        "Đồ nội thất nào trở thành lối đi tới một thế giới kỳ ảo trong The Lion, the Witch and the Wardrobe?"],

      ["CAIR PARAVEL", 3,
        "Lâu đài nơi bốn anh chị em Pevensie được đăng quang có tên là gì?"],

      ["TUMNUS", 3,
        "Nhân vật faun đầu tiên Lucy gặp sau khi bước qua lối đi kỳ lạ tên là gì?"],

      ["WHITE WITCH", 2,
        "Phản diện khiến vùng đất chìm trong mùa đông kéo dài được gọi bằng tên tiếng Anh nào?"],

      ["CASPIAN", 1,
        "Vị hoàng tử trẻ trở thành vua trong một phần của bộ truyện tên là gì?"]
    ]
  },


  /* =========================================================
     16. OLYMPUS
     ========================================================= */
  {
    topic: "Thần thoại Hy Lạp",
    keyword: "OLYMPUS",
    rows: [
      ["POSEIDON", 1,
        "Vị thần Hy Lạp cai quản biển cả tên là gì?"],

      ["APOLLO", 3,
        "Vị thần gắn với âm nhạc, tiên tri và cây đàn lyre tên là gì?"],

      ["DIONYSUS", 4,
        "Vị thần Hy Lạp gắn với rượu nho và lễ hội tên là gì?"],

      ["HERMES", 3,
        "Vị thần đưa tin thường được mô tả với đôi dép có cánh tên là gì?"],

      ["HEPHAESTUS", 2,
        "Vị thần thợ rèn và lửa trong thần thoại Hy Lạp tên là gì?"],

      ["MUSES", 1,
        "Các nữ thần bảo trợ nghệ thuật và khoa học được gọi chung bằng tên tiếng Anh nào?"],

      ["ARES", 3,
        "Vị thần chiến tranh, con của Zeus và Hera, tên là gì?"]
    ]
  },


  /* =========================================================
     17. HARRY POTTER
     ========================================================= */
  {
    topic: "Thế giới phù thủy",
    keyword: "HARRY POTTER",
    rows: [
      ["HERMIONE", 0,
        "Nữ phù thủy nổi tiếng thông minh, là bạn thân của Ron Weasley, tên là gì?"],

      ["AZKABAN", 0,
        "Nhà tù phù thủy được các Dementor canh giữ có tên là gì?"],

      ["RON WEASLEY", 0,
        "Người con trai tóc đỏ, bạn thân của Hermione Granger, tên là gì?"],

      ["RAVENCLAW", 0,
        "Nhà có biểu tượng đại bàng và nổi tiếng coi trọng trí tuệ mang tên gì?"],

      ["POLYJUICE", 3,
        "Loại độc dược cho phép người uống tạm thời mang hình dạng người khác có tên tiếng Anh là gì?"],

      ["PRIVET DRIVE", 0,
        "Con đường nơi gia đình Dursley sinh sống có tên là gì?"],

      ["VOLDEMORT", 1,
        "Phù thủy hắc ám còn được gọi là Kẻ-mà-ai-cũng-biết-là-ai tên là gì?"],

      ["DEMENTOR", 5,
        "Sinh vật hút niềm vui và có thể thực hiện Nụ hôn đáng sợ được gọi là gì?"],

      ["TRIWIZARD", 0,
        "Giải đấu giữa ba trường pháp thuật được gọi bằng tên tiếng Anh nào?"],

      ["HEDWIG", 1,
        "Con cú tuyết trắng trung thành của một cậu bé phù thủy tên là gì?"],

      ["GRYFFINDOR", 1,
        "Nhà có biểu tượng sư tử và màu đỏ vàng mang tên gì?"]
    ]
  },


  /* =========================================================
     18. POMPEII
     ========================================================= */
  {
    topic: "Thành phố cổ",
    keyword: "POMPEII",
    rows: [
      ["PLINY THE YOUNGER", 0,
        "Nhân chứng La Mã để lại hai bức thư mô tả vụ phun trào năm 79 tên là ai?"],

      ["VOLCANIC ASH", 1,
        "Vật chất dạng hạt rất nhỏ bị núi lửa phun vào không khí gọi bằng tiếng Anh là gì?"],

      ["MOUNT VESUVIUS", 0,
        "Núi lửa nổi tiếng nằm gần vịnh Naples có tên tiếng Anh là gì?"],

      ["PLASTER CASTS", 0,
        "Kỹ thuật đổ thạch cao vào các khoảng rỗng trong lớp tro tạo nên những hình người được gọi là gì?"],

      ["HERCULANEUM", 1,
        "Thành phố La Mã cổ khác cũng bị chôn vùi trong vụ phun trào năm 79 có tên là gì?"],

      ["ITALY", 0,
        "Quốc gia có thành phố Naples nằm trên bán đảo hình chiếc ủng là nước nào?"],

      ["CAMPANIA", 6,
        "Vùng hành chính của Ý có Naples là thủ phủ mang tên gì?"]
    ]
  },


  /* =========================================================
     19. MACHU PICCHU
     ========================================================= */
  {
    topic: "Di sản Nam Mỹ",
    keyword: "MACHU PICCHU",
    rows: [
      ["HIRAM BINGHAM", 4,
        "Nhà sử học Mỹ đưa một di tích Inca ở Peru đến sự chú ý quốc tế năm 1911 tên là ai?"],

      ["INCA", 3,
        "Đế chế bản địa lớn từng thống trị vùng Andes trước người Tây Ban Nha được gọi là gì?"],

      ["CUSCO", 0,
        "Thành phố từng là thủ đô của đế chế lớn ở vùng Andes có tên là gì?"],

      ["QUECHUA", 4,
        "Ngôn ngữ bản địa được sử dụng rộng rãi ở vùng Andes gọi là gì?"],

      ["URUBAMBA", 0,
        "Con sông chảy qua Thung lũng Thiêng ở Peru có tên là gì?"],

      ["PERU", 0,
        "Quốc gia Nam Mỹ có thủ đô Lima là nước nào?"],

      ["INTIHUATANA", 0,
        "Khối đá nghi lễ có tên mang nghĩa gần với “nơi buộc Mặt Trời” gọi là gì?"],

      ["TERRACES", 5,
        "Các bậc đất nhân tạo trên sườn núi dùng cho canh tác được gọi bằng từ tiếng Anh nào?"],

      ["SACRED VALLEY", 2,
        "Thung lũng nổi tiếng của người Inca quanh sông Urubamba có tên tiếng Anh là gì?"],

      ["TEMPLE OF THE SUN", 9,
        "Công trình nghi lễ dành cho thần Mặt Trời thường được gọi bằng tên tiếng Anh nào?"],

      ["HUAYNA PICCHU", 1,
        "Ngọn núi nhọn nổi bật phía sau khu di tích nổi tiếng ở Andes có tên là gì?"]
    ]
  },


  /* =========================================================
     20. CHERNOBYL
     ========================================================= */
  {
    topic: "Lịch sử hạt nhân",
    keyword: "CHERNOBYL",
    rows: [
      ["CESIUM", 0,
        "Nguyên tố hóa học có đồng vị phóng xạ Cs-137 tên tiếng Anh là gì?"],

      ["GRAPHITE", 4,
        "Dạng thù hình của carbon được dùng làm chất làm chậm neutron trong lò RBMK gọi là gì?"],

      ["REACTOR", 1,
        "Thiết bị duy trì phản ứng phân hạch hạt nhân có kiểm soát được gọi bằng tiếng Anh là gì?"],

      ["RBMK", 0,
        "Kiểu lò phản ứng graphite làm mát bằng nước từng được Liên Xô sử dụng được gọi tắt là gì?"],

      ["UKRAINE", 5,
        "Quốc gia Đông Âu có thủ đô Kyiv là nước nào?"],

      ["IODINE", 1,
        "Nguyên tố có đồng vị I-131 thường được quan tâm sau sự cố phóng xạ tên tiếng Anh là gì?"],

      ["BELARUS", 0,
        "Quốc gia nằm ngay phía bắc Ukraine có thủ đô Minsk là nước nào?"],

      ["PRYPIAT", 2,
        "Thành phố được xây dựng cho công nhân nhà máy điện hạt nhân và sơ tán năm 1986 có tên là gì?"],

      ["LIQUIDATORS", 0,
        "Tên tiếng Anh thường dùng cho lực lượng tham gia dọn dẹp và khắc phục hậu quả sau tai nạn năm 1986 là gì?"]
    ]
  }

);



(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. HÀ NỘI
     ========================================================= */
  {
    topic: "Dấu ấn đô thị",
    keyword: "HÀ NỘI",
    rows: [

      ["HỒ GƯƠM", 0,
        "Hồ nước nào gắn với truyền thuyết vua Lê trả lại thanh gươm báu cho Rùa Vàng?"],

      ["NHÀ HÁT LỚN", 2,
        "Công trình kiến trúc kiểu Pháp nằm tại số 1 Tràng Tiền thường được gọi là gì?"],

      ["BÚN CHẢ", 2,
        "Món ăn gồm bún, thịt nướng, rau sống và nước chấm chua ngọt gọi là gì?"],

      ["CỘT CỜ", 1,
        "Công trình quân sự cổ cao nổi bật nằm trên đường Điện Biên Phủ thường được gọi là gì?"],

      ["LONG BIÊN", 5,
        "Cây cầu thép bắc qua sông Hồng, từng mang tên Doumer, nay có tên là gì?"]

    ]
  },


  /* =========================================================
     2. HỘI AN
     ========================================================= */
  {
    topic: "Di sản đô thị",
    keyword: "HỘI AN",
    rows: [

      ["CHÙA CẦU", 1,
        "Cây cầu cổ có mái che, gắn với cộng đồng thương nhân Nhật Bản, được gọi là gì?"],

      ["MỘC KIM BỒNG", 1,
        "Làng nghề bên sông Thu Bồn nổi tiếng với nghề đóng thuyền và chạm khắc gỗ có tên là gì?"],

      ["HỘI QUÁN PHÚC KIẾN", 2,
        "Hội quán nổi tiếng do cộng đồng người Hoa Phúc Kiến xây dựng có tên là gì?"],

      ["AN BÀNG", 0,
        "Bãi biển nổi tiếng nằm gần khu đô thị cổ và làng rau Trà Quế có tên là gì?"],

      ["ĐÈN LỒNG", 2,
        "Vật trang trí nhiều màu thường được treo dày đặc trên các con phố cổ vào buổi tối là gì?"]

    ]
  },


  /* =========================================================
     3. SA PA
     ========================================================= */
  {
    topic: "Miền núi phía Bắc",
    keyword: "SA PA",
    rows: [

      ["FANSIPAN", 3,
        "Đỉnh núi cao nhất Việt Nam có tên là gì?"],

      ["LAO CHẢI", 1,
        "Bản nằm trong thung lũng Mường Hoa, nơi có đông đồng bào H'Mông sinh sống, tên là gì?"],

      ["TẢ PHÌN", 2,
        "Bản nổi tiếng với văn hóa Dao đỏ và nghề dệt thổ cẩm có tên là gì?"],

      ["MƯỜNG HOA", 7,
        "Thung lũng nổi tiếng với ruộng bậc thang và bãi đá cổ có tên là gì?"]

    ]
  },


  /* =========================================================
     4. HẠ LONG
     ========================================================= */
  {
    topic: "Biển đảo Đông Bắc",
    keyword: "HẠ LONG",
    rows: [

      ["HÒN GÀ CHỌI", 0,
        "Hai khối đá tự nhiên có hình dáng như đôi gà đang chọi nhau được gọi là gì?"],

      ["CỬA VẠN", 4,
        "Làng chài nổi tiếng nằm giữa những đảo đá vôi có tên là gì?"],

      ["BÁI TỬ LONG", 5,
        "Vùng vịnh nằm về phía đông bắc, có nhiều đảo đá và cảnh quan tương tự vùng di sản lân cận, tên là gì?"],

      ["ĐẢO TUẦN CHÂU", 2,
        "Hòn đảo du lịch nổi tiếng có bến cảng lớn đón tàu tham quan vịnh tên là gì?"],

      ["HANG SỬNG SỐT", 2,
        "Hang động lớn nổi tiếng trên đảo Bồ Hòn có tên là gì?"],

      ["HANG ĐẦU GỖ", 3,
        "Hang động nổi tiếng với nhiều nhũ đá, nằm gần động Thiên Cung, có tên là gì?"]

    ]
  },


  /* =========================================================
     5. BÁNH CHƯNG
     ========================================================= */
  {
    topic: "Tết cổ truyền",
    keyword: "BÁNH CHƯNG",
    rows: [

      ["BẾP LỬA", 0,
        "Trong gian bếp truyền thống, nơi dùng củi để nấu và sưởi thường được gọi là gì?"],

      ["LÁ DONG", 1,
        "Loại lá bản rộng thường được dùng để gói món ăn truyền thống dịp Tết là gì?"],

      ["ĐẬU XANH", 5,
        "Loại đậu thường được đồ chín, giã nhuyễn để làm phần nhân màu vàng là gì?"],

      ["THỊT LỢN", 1,
        "Loại thịt thường được đặt ở giữa phần nhân cùng đậu xanh là gì?"],

      ["MÂM CỖ", 3,
        "Mâm thức ăn được chuẩn bị trang trọng trong ngày lễ, Tết thường gọi là gì?"],

      ["HÌNH VUÔNG", 0,
        "Hình có bốn cạnh bằng nhau và bốn góc vuông gọi là gì?"],

      ["DƯA HÀNH", 1,
        "Món hành muối chua thường xuất hiện trong mâm cơm ngày Tết miền Bắc gọi là gì?"],

      ["LANG LIÊU", 2,
        "Nhân vật trong truyền thuyết được giao làm lễ vật dâng vua cha vào dịp đầu năm là ai?"],

      ["GẠO NẾP", 0,
        "Loại gạo dẻo, thơm thường dùng để làm xôi và nhiều món truyền thống ngày Tết là gì?"]

    ]
  },


  /* =========================================================
     6. TRUNG THU
     ========================================================= */
  {
    topic: "Lễ hội dân gian",
    keyword: "TRUNG THU",
    rows: [

      ["TRĂNG RẰM", 0,
        "Mặt Trăng tròn sáng vào đêm ngày mười lăm âm lịch thường được gọi là gì?"],

      ["TRẺ EM", 1,
        "Đối tượng được xem là trung tâm của nhiều hoạt động vui chơi, rước đèn và phá cỗ là ai?"],

      ["CHÚ CUỘI", 4,
        "Nhân vật dân gian được kể rằng ngồi dưới gốc cây đa trên Mặt Trăng là ai?"],

      ["BÁNH NƯỚNG", 2,
        "Loại bánh có lớp vỏ được nướng vàng, thường ăn cùng bánh dẻo vào dịp rằm tháng Tám gọi là gì?"],

      ["CHỊ HẰNG", 6,
        "Nhân vật nữ trong dân gian thường được nhắc cùng Chú Cuội vào đêm rằm tháng Tám là ai?"],

      ["TRỐNG LÂN", 0,
        "Loại trống tạo nhịp sôi động cho các màn múa lân thường được gọi là gì?"],

      ["BÁNH DẺO", 3,
        "Loại bánh có lớp vỏ trắng mềm, không cần nướng, thường xuất hiện cùng bánh nướng gọi là gì?"],

      ["ĐÈN KÉO QUÂN", 7,
        "Loại đèn truyền thống có các hình bên trong tự quay khi thắp sáng gọi là gì?"]

    ]
  },


  /* =========================================================
     7. LÀNG QUÊ
     ========================================================= */
  {
    topic: "Hình ảnh Việt Nam",
    keyword: "LÀNG QUÊ",
    rows: [

      ["LŨY TRE", 0,
        "Hàng tre dày bao quanh khu dân cư nông thôn xưa thường được gọi là gì?"],

      ["ĐÌNH LÀNG", 5,
        "Công trình cộng đồng truyền thống dùng để thờ thành hoàng và tổ chức sinh hoạt chung gọi là gì?"],

      ["GIẾNG NƯỚC", 3,
        "Công trình đào sâu xuống đất để lấy nước sinh hoạt gọi là gì?"],

      ["GIẾNG LÀNG", 0,
        "Nguồn nước chung nằm trong khu dân cư truyền thống thường được gọi là gì?"],

      ["QUÁN NƯỚC", 0,
        "Điểm dừng chân nhỏ bên đường bán trà, nước và đồ ăn đơn giản thường gọi là gì?"],

      ["CON TRÂU", 6,
        "Loài vật gắn với việc kéo cày và hình ảnh người nông dân Việt Nam là gì?"],

      ["ĐÊ LÀNG", 1,
        "Công trình đất dài dùng để ngăn nước và bảo vệ khu dân cư, ruộng đồng gọi là gì?"]

    ]
  },


  /* =========================================================
     8. VĂN MIẾU
     ========================================================= */
  {
    topic: "Giáo dục xưa",
    keyword: "VĂN MIẾU",
    rows: [

      ["KHUÊ VĂN CÁC", 4,
        "Công trình gác gỗ với bốn cửa sổ tròn đặc trưng, thường được xem là biểu tượng của truyền thống hiếu học, tên là gì?"],

      ["THĂNG LONG", 2,
        "Tên gọi lịch sử xuất hiện trong cụm “Hoàng thành ...” là gì?"],

      ["BIA TIẾN SĨ", 6,
        "Những tấm bia đá đặt trên lưng rùa và ghi danh người đỗ đại khoa được gọi là gì?"],

      ["ĐẠI THÀNH MÔN", 8,
        "Cổng lớn dẫn vào khu điện thờ Khổng Tử có tên là gì?"],

      ["NHÀ THÁI HỌC", 6,
        "Công trình phía sau khu thờ chính, gợi lại truyền thống giáo dục và khoa cử, gọi là gì?"],

      ["GIẾNG THIÊN QUANG", 2,
        "Hồ nước hình vuông nằm giữa khu bia tiến sĩ có tên là gì?"],

      ["QUỐC TỬ GIÁM", 1,
        "Cơ sở giáo dục bậc cao nổi tiếng thời phong kiến Việt Nam có tên là gì?"]

    ]
  },


  /* =========================================================
     9. CA DAO
     ========================================================= */
  {
    topic: "Văn học dân gian",
    keyword: "CA DAO",
    rows: [

      ["CON CÒ", 0,
        "Hình ảnh loài chim nào thường xuất hiện trong những câu hát về người nông dân và thân phận con người?"],

      ["DÂN GIAN", 5,
        "Những sáng tác được lưu truyền trong cộng đồng và thường không xác định tác giả thuộc loại văn học nào?"],

      ["ĐỒNG DAO", 4,
        "Những câu hát có vần điệu trẻ em thường đọc hoặc hát khi vui chơi được gọi là gì?"],

      ["GIA ĐÌNH", 2,
        "Chủ đề về cha mẹ, vợ chồng và anh chị em thuộc phạm vi quan hệ nào?"],

      ["PHONG TỤC", 2,
        "Những tập quán được cộng đồng duy trì qua nhiều thế hệ thường được gọi chung là gì?"]

    ]
  }

);


(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. ĐÀ LẠT
     ========================================================= */
  {
    topic: "Cao nguyên và du lịch",
    keyword: "ĐÀ LẠT",
    rows: [
      ["ĐỒI CHÈ CẦU ĐẤT", 0,
        "Vùng trồng chè lâu đời nổi tiếng với những đồi chè xanh trải rộng ở độ cao lớn có tên là gì?"],

      ["NHÀ THỜ CON GÀ", 2,
        "Công trình tôn giáo có biểu tượng một con gà trên đỉnh tháp chuông thường được gọi bằng tên gì?"],

      ["THUNG LŨNG TÌNH YÊU", 5,
        "Khu du lịch có tên gợi một không gian lãng mạn dành cho các đôi lứa là gì?"],

      ["TRẠI MÁT", 2,
        "Khu vực ngoại ô nổi tiếng với ga nhỏ, nhà kính và những vùng trồng rau hoa có tên là gì?"],

      ["THÁC DATANLA", 0,
        "Thác nước nổi tiếng với hệ thống máng trượt xuyên rừng có tên là gì?"]
    ]
  },


  /* =========================================================
     2. NHA TRANG
     ========================================================= */
  {
    topic: "Biển và thành phố",
    keyword: "NHA TRANG",
    rows: [
      ["HÒN MUN", 2,
        "Hòn đảo nổi tiếng với hệ sinh thái san hô và hoạt động lặn biển có tên là gì?"],

      ["HÒN TRE", 0,
        "Hòn đảo lớn nằm ngoài khơi, nổi tiếng với nhiều khu du lịch và nghỉ dưỡng, có tên là gì?"],

      ["ALEXANDRE YERSIN", 0,
        "Nhà khoa học đã phát hiện vi khuẩn gây bệnh dịch hạch Yersinia pestis là ai?"],

      ["THÁP BÀ PONAGAR", 0,
        "Quần thể đền tháp Chăm thờ nữ thần Po Nagar thường được gọi bằng tên gì?"],

      ["VIỆN PASTEUR", 10,
        "Cơ sở nghiên cứu y học được Alexandre Yersin thành lập năm 1895 thuộc hệ thống nào?"],

      ["ĐẦM NHA PHU", 5,
        "Đầm nước lớn nằm giữa vùng vịnh Nha Trang và Vân Phong có tên là gì?"],

      ["HÒN CHỒNG", 2,
        "Quần thể đá ven biển nổi tiếng với dấu lõm lớn giống hình bàn tay được gọi là gì?"],

      ["THÁP TRẦM HƯƠNG", 12,
        "Công trình biểu tượng nằm gần quảng trường 2 tháng 4, lấy cảm hứng từ một loại gỗ thơm quý, có tên là gì?"]
    ]
  },


  /* =========================================================
     3. CỬU LONG
     ========================================================= */
  {
    topic: "Miền sông nước",
    keyword: "CỬU LONG",
    rows: [
      ["CẦN THƠ", 0,
        "Địa danh miền Tây nổi tiếng với bến Ninh Kiều và chợ nổi Cái Răng là đâu?"],

      ["CỬA TIỂU", 1,
        "Một trong những cửa sông chính đưa nước của sông Tiền ra biển có tên là gì?"],

      ["SÔNG HẬU", 6,
        "Một trong hai nhánh sông lớn chảy qua vùng đồng bằng phía Nam có tên là gì?"],

      ["LONG XUYÊN", 0,
        "Đô thị bên bờ sông Hậu nổi tiếng với chợ nổi cùng tên là đâu?"],

      ["MỸ THO", 4,
        "Địa danh miền Tây nổi tiếng với món hủ tiếu mang cùng tên là đâu?"],

      ["CỒN PHỤNG", 2,
        "Cù lao du lịch trên sông Tiền từng gắn với công trình của Đạo Dừa có tên là gì?"],

      ["ĐỒNG THÁP MƯỜI", 3,
        "Vùng đất ngập nước rộng lớn nổi tiếng với sen và mùa nước nổi được gọi là gì?"]
    ]
  },


  /* =========================================================
     4. QUAN HỌ
     ========================================================= */
  {
    topic: "Dân ca Bắc Bộ",
    keyword: "QUAN HỌ",
    rows: [
      ["NÓN QUAI THAO", 3,
        "Loại nón rộng vành thường xuất hiện cùng trang phục truyền thống của các nữ nghệ nhân Bắc Bộ gọi là gì?"],

      ["TRẦU CAU", 3,
        "Hai thứ thường được têm và mời khách như một nét giao duyên truyền thống là gì?"],

      ["LIỀN ANH", 4,
        "Những người nam tham gia hát đối đáp trong loại hình dân ca này thường được gọi là gì?"],

      ["LIỀN CHỊ", 3,
        "Những người nữ tham gia hát đối đáp trong loại hình dân ca này thường được gọi là gì?"],

      ["ÁO TỨ THÂN", 5,
        "Trang phục nữ truyền thống gồm bốn thân áo, thường kết hợp với yếm và khăn mỏ quạ, gọi là gì?"],

      ["GIỌNG LỀ LỐI", 2,
        "Nhóm bài bản cổ, trang trọng, thường được hát ở phần đầu một cuộc hát được gọi là gì?"]
    ]
  },


  /* =========================================================
     5. CA TRÙ
     ========================================================= */
  {
    topic: "Âm nhạc truyền thống",
    keyword: "CA TRÙ",
    rows: [
      ["PHÁCH", 3,
        "Nhạc cụ gõ nhỏ bằng tre hoặc gỗ dùng để giữ nhịp cho người hát gọi là gì?"],

      ["CA NƯƠNG", 1,
        "Người nữ đảm nhiệm phần hát chính trong loại hình nghệ thuật cổ truyền này được gọi là gì?"],

      ["HÁT CỬA ĐÌNH", 2,
        "Hình thức biểu diễn gắn với không gian đình làng và các dịp tế lễ được gọi là gì?"],

      ["TRỐNG CHẦU", 1,
        "Loại trống được người nghe có hiểu biết dùng để đánh thưởng và bình phẩm cuộc hát gọi là gì?"],

      ["DÙI TRỐNG", 1,
        "Vật cầm tay dùng để đánh vào mặt trống được gọi là gì?"]
    ]
  },


  /* =========================================================
     6. ĐỘNG ĐẤT
     ========================================================= */
  {
    topic: "Khoa học Trái Đất",
    keyword: "ĐỘNG ĐẤT",
    rows: [
      ["ĐỊA CHẤN KẾ", 0,
        "Thiết bị dùng để ghi lại dao động của mặt đất được gọi là gì?"],

      ["CƯỜNG ĐỘ", 6,
        "Đại lượng mô tả mức độ rung lắc và tác động tại một địa điểm thường được gọi là gì?"],

      ["SÓNG P", 2,
        "Loại sóng địa chấn truyền nhanh nhất và có thể đi qua cả chất rắn lẫn chất lỏng là gì?"],

      ["ĐỨT GÃY", 3,
        "Cấu trúc địa chất nơi các khối đá bị phá vỡ và dịch chuyển tương đối gọi là gì?"],

      ["ĐỚI HÚT CHÌM", 0,
        "Vùng nơi một mảng kiến tạo chìm xuống dưới một mảng khác được gọi là gì?"],

      ["TÂM CHẤN", 5,
        "Điểm trên bề mặt Trái Đất nằm thẳng phía trên nơi phát sinh chấn động gọi là gì?"],

      ["THANG RICHTER", 0,
        "Thang đo thường được nhắc đến khi biểu thị độ lớn của một trận địa chấn có tên là gì?"]
    ]
  },


  /* =========================================================
     7. QUANG HỢP
     ========================================================= */
  {
    topic: "Sinh học thực vật",
    keyword: "QUANG HỢP",
    rows: [
      ["KHÍ QUYỂN", 3,
        "Lớp khí bao quanh Trái Đất, nơi cây lấy một trong những nguyên liệu dạng khí cần thiết, gọi là gì?"],

      ["GLUCOZƠ", 2,
        "Loại đường đơn được cây tạo ra và sử dụng như một nguồn năng lượng gọi là gì?"],

      ["CACBON DIOXIT", 1,
        "Khí có công thức CO2 được cây hấp thụ qua lá gọi là gì?"],

      ["NƯỚC", 0,
        "Chất được rễ hút từ đất và vận chuyển lên lá là gì?"],

      ["ÁNH SÁNG", 6,
        "Nguồn năng lượng từ Mặt Trời được lá hấp thụ để tạo chất hữu cơ là gì?"],

      ["KHÍ KHỔNG", 1,
        "Những lỗ nhỏ trên biểu bì lá giúp trao đổi khí và thoát hơi nước gọi là gì?"],

      ["HỢP CHẤT HỮU CƠ", 1,
        "Nhóm chất giàu năng lượng được cây tạo thành từ các nguyên liệu vô cơ gọi chung là gì?"],

      ["LỤC LẠP", 5,
        "Bào quan chứa diệp lục và là nơi diễn ra quá trình tạo chất hữu cơ ở tế bào thực vật gọi là gì?"]
    ]
  },


  /* =========================================================
     8. CỐ ĐÔ HUẾ
     ========================================================= */
  {
    topic: "Di sản miền Trung",
    keyword: "CỐ ĐÔ HUẾ",
    rows: [
      ["CẦU TRƯỜNG TIỀN", 0,
        "Cây cầu sáu vài mười hai nhịp nổi tiếng bắc qua một dòng sông thơ mộng có tên là gì?"],

      ["PHỐ CỔ BAO VINH", 2,
        "Khu phố từng là thương cảng sầm uất bên sông Hương có tên là gì?"],

      ["ĐẠI NỘI", 0,
        "Khu vực gồm Hoàng thành và Tử Cấm Thành thường được gọi chung bằng tên gì?"],

      ["NGỌ MÔN", 4,
        "Cổng chính ở phía nam Hoàng thành với lầu Ngũ Phụng phía trên có tên là gì?"],

      ["SÔNG HƯƠNG", 4,
        "Dòng sông nổi tiếng chảy qua trung tâm vùng đất kinh kỳ có tên là gì?"],

      ["CUNG AN ĐỊNH", 1,
        "Cung điện mang phong cách giao thoa Á - Âu, từng là nơi ở của vua Khải Định khi còn là hoàng tử, có tên là gì?"],

      ["THẾ MIẾU", 2,
        "Công trình thờ các vị vua triều Nguyễn nằm trong Hoàng thành được gọi là gì?"]
    ]
  },


  /* =========================================================
     9. BÁNH MÌ
     ========================================================= */
  {
    topic: "Ẩm thực đường phố",
    keyword: "BÁNH MÌ",
    rows: [
      ["BƠ", 0,
        "Chất béo từ sữa thường được phết một lớp mỏng để tăng độ béo và thơm gọi là gì?"],

      ["XÁ XÍU", 1,
        "Món thịt có nguồn gốc Hoa, thường có màu đỏ nâu và vị ngọt mặn, gọi là gì?"],

      ["THỊT NƯỚNG", 4,
        "Phần thịt được ướp gia vị rồi làm chín trên than hoặc vỉ nóng thường gọi là gì?"],

      ["CHẢ LỤA", 1,
        "Món làm từ thịt heo xay nhuyễn, gói và hấp chín, phổ biến trong ẩm thực Việt Nam, gọi là gì?"],

      ["MAYONNAISE", 0,
        "Loại sốt béo làm chủ yếu từ dầu, lòng đỏ trứng và thành phần tạo vị chua gọi là gì?"],

      ["BÌ", 1,
        "Phần da heo thái sợi, thường trộn cùng thính và thịt, được gọi ngắn gọn là gì?"]
    ]
  },


  /* =========================================================
     10. CÀ PHÊ
     ========================================================= */
  {
    topic: "Hương vị và nông sản",
    keyword: "CÀ PHÊ",
    rows: [
      ["CAFEIN", 0,
        "Chất kích thích tự nhiên có tác dụng làm tăng sự tỉnh táo thường được gọi là gì?"],

      ["ĐÀ LẠT", 1,
        "Vùng cao nguyên nổi tiếng với giống Arabica Cầu Đất và khí hậu mát mẻ là đâu?"],

      ["PHIN", 0,
        "Dụng cụ lọc nhỏ bằng kim loại, cho nước nóng nhỏ giọt chậm xuống cốc, gọi là gì?"],

      ["HẠT ROBUSTA", 0,
        "Loại hạt có vị đậm, đắng và hàm lượng cafein tương đối cao thường được gọi là gì?"],

      ["Ê ĐÊ", 0,
        "Dân tộc bản địa có cộng đồng đông tại Đắk Lắk và gắn bó lâu đời với văn hóa Tây Nguyên là dân tộc nào?"]
    ]
  },


  /* =========================================================
     11. MÁY TÍNH
     ========================================================= */
  {
    topic: "Công nghệ",
    keyword: "MÁY TÍNH",
    rows: [
      ["RAM", 2,
        "Bộ nhớ tạm thời dùng để lưu dữ liệu đang được chương trình sử dụng thường được gọi tắt là gì?"],

      ["CÁP HDMI", 1,
        "Loại dây thường dùng để truyền đồng thời hình ảnh và âm thanh số tới màn hình gọi là gì?"],

      ["BYTE", 1,
        "Đơn vị dữ liệu thường gồm tám bit được gọi là gì?"],

      ["CHUỘT", 4,
        "Thiết bị cầm tay dùng để di chuyển con trỏ và nhấp chọn trên màn hình gọi là gì?"],

      ["BÀN PHÍM", 5,
        "Thiết bị gồm nhiều phím chữ, số và chức năng dùng để nhập dữ liệu gọi là gì?"],

      ["MÀN HÌNH", 2,
        "Thiết bị hiển thị hình ảnh và giao diện cho người dùng gọi là gì?"],

      ["THẺ ĐỒ HỌA", 1,
        "Linh kiện chuyên xử lý và xuất hình ảnh, thường chứa GPU, gọi là gì?"]
    ]
  }

);


(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. TÂY NGUYÊN
     ========================================================= */
  {
    topic: "Văn hóa cao nguyên",
    keyword: "TÂY NGUYÊN",
    rows: [

      ["ĐẤT BAZAN", 2,
        "Loại đất màu đỏ, hình thành từ đá núi lửa và rất thích hợp trồng cây công nghiệp gọi là gì?"],

      ["CÂY KƠ NIA", 1,
        "Loài cây thân gỗ lớn thường xuất hiện trong những bài hát và hình ảnh về vùng cao nguyên miền Trung là cây gì?"],

      ["CÂY CÀ PHÊ", 2,
        "Loại cây công nghiệp lâu năm được trồng với diện tích lớn tại Đắk Lắk là cây gì?"],

      ["NHÀ RÔNG", 0,
        "Công trình cộng đồng có mái cao vút của nhiều dân tộc bản địa được gọi là gì?"],

      ["CỒNG CHIÊNG", 3,
        "Loại nhạc cụ bằng hợp kim đồng, thường được diễn tấu thành dàn trong các lễ hội cộng đồng, gọi là gì?"],

      ["BUÔN ĐÔN", 1,
        "Địa danh nổi tiếng với truyền thống săn bắt và thuần dưỡng voi có tên là gì?"],

      ["YALY", 0,
        "Nhà máy thủy điện lớn trên sông Sê San mang tên gì?"],

      ["Ê ĐÊ", 0,
        "Dân tộc có truyền thống ở nhà dài và tổ chức gia đình theo chế độ mẫu hệ là dân tộc nào?"],

      ["NHÀ DÀI", 0,
        "Kiểu nhà truyền thống có thể được nối dài khi gia đình có thêm thành viên được gọi là gì?"]

    ]
  },


  /* =========================================================
     2. ÁO DÀI
     ========================================================= */
  {
    topic: "Trang phục Việt Nam",
    keyword: "ÁO DÀI",
    rows: [

      ["ÁO NGŨ THÂN", 0,
        "Loại trang phục truyền thống gồm năm thân, được xem là một tiền thân quan trọng của trang phục nữ Việt Nam hiện đại, gọi là gì?"],

      ["CỔ CAO", 4,
        "Kiểu cổ ôm quanh phần cổ người mặc thường được gọi là kiểu gì?"],

      ["DÁNG ÔM", 0,
        "Kiểu phom được thiết kế theo đường nét cơ thể thường được gọi là gì?"],

      ["TÀ ÁO", 1,
        "Phần vải dài buông xuống phía trước hoặc sau của một số loại trang phục gọi là gì?"],

      ["THIẾU NỮ", 2,
        "Cách gọi phổ biến dành cho người con gái trẻ thường xuất hiện trong nhiều tranh và ảnh nghệ thuật Việt Nam là gì?"]

    ]
  },


  /* =========================================================
     3. HOA MAI
     ========================================================= */
  {
    topic: "Tết phương Nam",
    keyword: "HOA MAI",
    rows: [

      ["HOA VÀNG", 0,
        "Loại hoa mang màu sắc tượng trưng cho sự sung túc, thường được ưa chuộng vào dịp đầu năm ở miền Nam, có màu gì?"],

      ["NỤ HOA", 3,
        "Bộ phận chưa nở, được người trồng chăm sóc để bung cánh đúng dịp được gọi là gì?"],

      ["NAM BỘ", 1,
        "Vùng văn hóa Việt Nam thường gắn mạnh với hình ảnh sắc vàng ngày Tết là vùng nào?"],

      ["MÙNG MỘT", 0,
        "Ngày đầu tiên của năm mới âm lịch thường được gọi là ngày gì?"],

      ["CÁNH HOA", 6,
        "Bộ phận mỏng, nhiều màu sắc bao quanh nhị và nhụy gọi là gì?"],

      ["MIỀN NAM", 1,
        "Khu vực Việt Nam thường chuộng sắc vàng hơn sắc hồng trong trang trí hoa Tết là đâu?"]

    ]
  },


  /* =========================================================
     4. CON TRÂU
     ========================================================= */
  {
    topic: "Đồng ruộng Việt Nam",
    keyword: "CON TRÂU",
    rows: [

      ["CÀY RUỘNG", 0,
        "Công việc làm đất bằng cách kéo lưỡi cày qua mặt ruộng gọi là gì?"],

      ["CON NGHÉ", 1,
        "Con non của loài gia súc kéo cày truyền thống được gọi là gì?"],

      ["NÔNG DÂN", 0,
        "Người trực tiếp làm các công việc trồng trọt và chăn nuôi gọi là gì?"],

      ["THỔI SÁO", 0,
        "Hoạt động âm nhạc dân gian thường gắn với hình ảnh mục đồng trên cánh đồng là gì?"],

      ["RƠM", 0,
        "Phần thân cây lúa còn lại sau khi tuốt lấy hạt thường được gọi là gì?"],

      ["CÂY LÚA", 1,
        "Loại cây lương thực chủ yếu tạo ra hạt gạo ở Việt Nam là cây gì?"],

      ["RUỘNG", 1,
        "Khoảnh đất được chuẩn bị để trồng lúa thường được gọi là gì?"]

    ]
  },


  /* =========================================================
     5. ÂM THANH
     ========================================================= */
  {
    topic: "Vật lý quanh ta",
    keyword: "ÂM THANH",
    rows: [

      ["ÂM THOA", 0,
        "Dụng cụ kim loại hình chữ U thường dùng trong thí nghiệm về dao động và tần số gọi là gì?"],

      ["MICRO", 0,
        "Thiết bị chuyển dao động trong không khí thành tín hiệu điện để thu tiếng nói gọi là gì?"],

      ["TẦN SỐ", 0,
        "Đại lượng cho biết số dao động thực hiện trong một giây gọi là gì?"],

      ["HỘP CỘNG HƯỞNG", 0,
        "Bộ phận giúp khuếch đại dao động trong nhiều nhạc cụ được gọi là gì?"],

      ["DAO ĐỘNG", 1,
        "Chuyển động lặp đi lặp lại quanh một vị trí cân bằng được gọi là gì?"],

      ["NỐT NHẠC", 0,
        "Các ký hiệu như Đô, Rê, Mi, Fa, Sol được gọi chung là gì?"],

      ["HERTZ", 0,
        "Đơn vị SI dùng để đo tần số có tên là gì?"]

    ]
  },


  /* =========================================================
     6. GIÓ MÙA
     ========================================================= */
  {
    topic: "Khí hậu và thời tiết",
    keyword: "GIÓ MÙA",
    rows: [

      ["GIÓ ĐÔNG BẮC", 0,
        "Luồng không khí lạnh thường ảnh hưởng mạnh đến miền Bắc Việt Nam vào mùa đông được gọi là gì?"],

      ["NHIỆT ĐỘ", 2,
        "Đại lượng thể hiện mức độ nóng hoặc lạnh của không khí gọi là gì?"],

      ["ĐỚI NÓNG", 4,
        "Vùng khí hậu nằm chủ yếu giữa hai chí tuyến thường được gọi là gì?"],

      ["MÙA MƯA", 0,
        "Khoảng thời gian trong năm có lượng mưa tập trung cao được gọi là gì?"],

      ["MÙA KHÔ", 1,
        "Khoảng thời gian trong năm có lượng mưa thấp rõ rệt được gọi là gì?"],

      ["LA NINA", 1,
        "Hiện tượng nước bề mặt vùng xích đạo trung tâm và đông Thái Bình Dương lạnh hơn bình thường gọi là gì?"]

    ]
  },


  /* =========================================================
     7. ROBOT
     ========================================================= */
  {
    topic: "Tự động hóa",
    keyword: "ROBOT",
    rows: [

      ["TRÍ TUỆ NHÂN TẠO", 1,
        "Lĩnh vực nghiên cứu giúp máy móc thực hiện những nhiệm vụ đòi hỏi khả năng nhận biết, học và suy luận gọi là gì?"],

      ["SERVO", 4,
        "Loại động cơ có khả năng điều khiển chính xác vị trí hoặc góc quay thường được gọi là gì?"],

      ["BỘ XỬ LÝ", 0,
        "Bộ phận tiếp nhận dữ liệu và thực hiện các lệnh tính toán trong một hệ thống điện tử gọi là gì?"],

      ["ENCODER", 3,
        "Thiết bị dùng để đo vị trí, góc quay hoặc tốc độ của trục chuyển động thường được gọi là gì?"],

      ["THUẬT TOÁN", 0,
        "Một chuỗi các bước rõ ràng dùng để giải quyết một bài toán được gọi là gì?"]

    ]
  },


  /* =========================================================
     8. VITAMIN
     ========================================================= */
  {
    topic: "Dinh dưỡng",
    keyword: "VITAMIN",
    rows: [

      ["VI CHẤT", 0,
        "Nhóm chất cơ thể chỉ cần với lượng nhỏ nhưng vẫn rất cần thiết cho hoạt động bình thường gọi chung là gì?"],

      ["DINH DƯỠNG", 1,
        "Quá trình cơ thể tiếp nhận và sử dụng chất từ thức ăn để duy trì sự sống gọi là gì?"],

      ["THỰC PHẨM", 0,
        "Những sản phẩm con người ăn hoặc uống để cung cấp chất cho cơ thể gọi chung là gì?"],

      ["AXIT ASCORBIC", 0,
        "Tên hóa học phổ biến của chất dinh dưỡng thường được ký hiệu bằng chữ C là gì?"],

      ["MIỄN DỊCH", 0,
        "Hệ thống bảo vệ cơ thể chống lại tác nhân gây bệnh được gọi là gì?"],

      ["BIOTIN", 1,
        "Chất dinh dưỡng tan trong nước còn được gọi là B7 có tên là gì?"],

      ["NIACIN", 0,
        "Chất dinh dưỡng còn được gọi là B3 có tên thông dụng là gì?"]

    ]
  },


  /* =========================================================
     9. PROTEIN
     ========================================================= */
  {
    topic: "Sinh học và dinh dưỡng",
    keyword: "PROTEIN",
    rows: [

      ["PEPTIT", 0,
        "Chuỗi ngắn gồm nhiều axit amin liên kết với nhau được gọi là gì?"],

      ["ARGININ", 1,
        "Axit amin có ký hiệu ba chữ Arg mang tên gì?"],

      ["COLLAGEN", 1,
        "Thành phần cấu trúc phổ biến trong da, gân và mô liên kết có tên là gì?"],

      ["THỊT", 0,
        "Nhóm thực phẩm từ động vật thường cung cấp lượng lớn chất xây dựng cơ bắp là gì?"],

      ["ENZYME", 0,
        "Chất xúc tác sinh học giúp tăng tốc các phản ứng trong cơ thể thường được gọi là gì?"],

      ["INSULIN", 0,
        "Hormone do tuyến tụy tiết ra giúp điều hòa đường huyết mang tên gì?"],

      ["DINH DƯỠNG", 2,
        "Lĩnh vực nghiên cứu mối quan hệ giữa thức ăn và sức khỏe được gọi là gì?"]

    ]
  },


  /* =========================================================
     10. VIRUS
     ========================================================= */
  {
    topic: "Vi sinh vật và bệnh học",
    keyword: "VIRUS",
    rows: [

      ["VẮC XIN", 0,
        "Chế phẩm giúp hệ miễn dịch nhận biết và tạo khả năng bảo vệ trước một tác nhân gây bệnh gọi là gì?"],

      ["MIỄN DỊCH", 1,
        "Khả năng của cơ thể nhận biết và chống lại tác nhân lạ được gọi là gì?"],

      ["RNA", 0,
        "Loại axit nucleic có đường ribose và thường chỉ gồm một mạch được viết tắt là gì?"],

      ["NUÔI CẤY TẾ BÀO", 1,
        "Kỹ thuật duy trì tế bào sống trong môi trường nhân tạo ngoài cơ thể được gọi là gì?"],

      ["SAO CHÉP", 0,
        "Quá trình tạo ra bản sao mới của vật chất di truyền được gọi là gì?"]

    ]
  }

);



(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. THẠCH SANH
     ========================================================= */
  {
    topic: "Truyện cổ tích Việt Nam",
    keyword: "THẠCH SANH",
    rows: [

      ["LÝ THÔNG", 2,
        "Kẻ kết nghĩa anh em nhưng nhiều lần lừa hại người em trong truyện là ai?"],

      ["HANG ĐẠI BÀNG", 0,
        "Nơi con chim dữ bắt công chúa về giam giữ được gọi là gì?"],

      ["ĐẠI BÀNG", 1,
        "Con vật khổng lồ bắt công chúa mang đi là con gì?"],

      ["CÔNG CHÚA", 0,
        "Người con gái của nhà vua bị bắt cóc rồi mất tiếng là ai?"],

      ["CHẰN TINH", 1,
        "Quái vật hung dữ từng gieo tai họa cho dân làng được gọi là gì?"],

      ["QUÂN SĨ", 4,
        "Những người cầm vũ khí tham gia đội quân của các nước chư hầu được gọi chung là gì?"],

      ["VUA", 2,
        "Người cha tổ chức việc kén chồng cho con gái giữ ngôi vị gì?"],

      ["NIÊU CƠM", 0,
        "Vật nhỏ kỳ lạ có thể đãi cả một đội quân ăn mãi không hết là gì?"],

      ["HOÀNG CUNG", 0,
        "Nơi nhà vua và công chúa sinh sống thường được gọi là gì?"]

    ]
  },


  /* =========================================================
     2. TRÁI TIM
     ========================================================= */
  {
    topic: "Cơ thể người",
    keyword: "TRÁI TIM",
    rows: [

      ["TÂM NHĨ", 0,
        "Hai buồng phía trên có nhiệm vụ tiếp nhận máu được gọi chung là gì?"],

      ["TÂM TRƯƠNG", 4,
        "Giai đoạn cơ quan bơm máu giãn ra để nhận máu được gọi là gì?"],

      ["VAN HAI LÁ", 7,
        "Van nằm giữa nhĩ trái và thất trái có tên là gì?"],

      ["NHỊP TIM", 5,
        "Số lần cơ quan bơm máu co bóp trong một khoảng thời gian thường được gọi là gì?"],

      ["TÂM THẤT", 0,
        "Hai buồng phía dưới có nhiệm vụ đẩy máu ra khỏi cơ quan tuần hoàn trung tâm gọi là gì?"],

      ["ĐIỆN TÂM ĐỒ", 1,
        "Bản ghi hoạt động điện của cơ quan tuần hoàn trung tâm được gọi là gì?"],

      ["ĐỘNG MẠCH CHỦ", 4,
        "Mạch máu lớn nhất đưa máu từ thất trái đi tới cơ thể gọi là gì?"]

    ]
  },


  /* =========================================================
     3. SAO HỎA
     ========================================================= */
  {
    topic: "Khám phá hành tinh",
    keyword: "SAO HỎA",
    rows: [

      ["SPIRIT", 0,
        "Xe tự hành nào hạ cánh tại hố Gusev vào năm 2004?"],

      ["NASA", 1,
        "Cơ quan nào vận hành các xe tự hành Spirit, Opportunity, Curiosity và Perseverance?"],

      ["OLYMPUS MONS", 0,
        "Ngọn núi lửa lớn nhất được biết đến trong Hệ Mặt Trời có tên là gì?"],

      ["HẺM MARINERIS", 0,
        "Hệ thống hẻm núi khổng lồ dài hàng nghìn kilômét được tàu Mariner 9 quan sát có tên là gì?"],

      ["ĐỎ", 1,
        "Oxit sắt khiến bề mặt hành tinh này mang màu sắc đặc trưng nào?"],

      ["PERSEVERANCE", 8,
        "Xe tự hành hạ cánh xuống miệng hố Jezero năm 2021 có tên là gì?"]

    ]
  },


  /* =========================================================
     4. LÚA NƯỚC
     ========================================================= */
  {
    topic: "Nông nghiệp truyền thống",
    keyword: "LÚA NƯỚC",
    rows: [

      ["LÚA NẾP", 0,
        "Giống lúa cho loại gạo dẻo, thường dùng để nấu xôi và làm bánh gọi là gì?"],

      ["LÚA TẺ", 1,
        "Giống lúa cho loại gạo được sử dụng phổ biến trong bữa cơm hằng ngày gọi là gì?"],

      ["PHÙ SA", 4,
        "Lớp vật liệu màu mỡ do sông mang theo và bồi đắp cho đồng ruộng gọi là gì?"],

      ["NÔNG DÂN", 0,
        "Người trực tiếp trồng trọt và chăm sóc mùa màng gọi là gì?"],

      ["TƯỚI TIÊU", 1,
        "Hoạt động chủ động cung cấp và điều tiết nước cho đồng ruộng gọi là gì?"],

      ["NƯỚC NGỌT", 2,
        "Loại nước có hàm lượng muối rất thấp, thích hợp cho nhiều cây trồng gọi là gì?"],

      ["CẤY LÚA", 0,
        "Việc đưa cây mạ xuống ruộng theo từng khóm được gọi là gì?"]

    ]
  },


  /* =========================================================
     5. MÚA RỐI NƯỚC
     ========================================================= */
  {
    topic: "Nghệ thuật dân gian",
    keyword: "MÚA RỐI NƯỚC",
    rows: [

      ["MẶT NƯỚC", 0,
        "Không gian nào đóng vai trò như sân khấu tự nhiên cho một loại hình biểu diễn dân gian độc đáo?"],

      ["CHÚ TỄU", 2,
        "Nhân vật vui tính, thường xuất hiện để mở màn và giao lưu với khán giả, tên là gì?"],

      ["AO LÀNG", 0,
        "Không gian sinh hoạt cộng đồng truyền thống nào từng là nơi thuận lợi để tổ chức biểu diễn?"],

      ["MÀNH TRE", 5,
        "Tấm che bằng vật liệu dân gian giúp giấu người điều khiển phía sau sân khấu gọi là gì?"],

      ["CON RỐI", 4,
        "Nhân vật bằng gỗ được nghệ nhân điều khiển để thực hiện các động tác gọi là gì?"],

      ["BIỂU DIỄN", 1,
        "Hoạt động trình bày một tiết mục trước khán giả được gọi là gì?"],

      ["NGHỆ NHÂN", 0,
        "Người có kỹ năng cao và gìn giữ một nghề hoặc loại hình nghệ thuật truyền thống gọi là gì?"],

      ["PHƯỜNG RỐI", 2,
        "Nhóm nghệ nhân cùng tổ chức và thực hiện các tiết mục thường được gọi là gì?"],

      ["NƯỚC", 2,
        "Chất lỏng vừa che cơ cấu điều khiển vừa tạo hiệu ứng chuyển động trên sân khấu là gì?"],

      ["CHÙA THẦY", 0,
        "Ngôi chùa nổi tiếng ở Hà Nội gắn lâu đời với loại hình biểu diễn dân gian này có tên là gì?"]

    ]
  },


  /* =========================================================
     6. MÁY BAY
     ========================================================= */
  {
    topic: "Hàng không",
    keyword: "MÁY BAY",
    rows: [

      ["MÔ PHỎNG", 0,
        "Hoạt động tái tạo điều kiện vận hành thực tế để huấn luyện phi công được gọi là gì?"],

      ["CÁNH", 1,
        "Bộ phận tạo phần lớn lực nâng khi phương tiện chuyển động trong không khí gọi là gì?"],

      ["TAY LÁI", 2,
        "Bộ phận điều khiển mà phi công sử dụng để thay đổi hướng hoặc tư thế bay thường gọi là gì?"],

      ["BUỒNG LÁI", 0,
        "Khoang phía trước nơi phi công điều khiển phương tiện được gọi là gì?"],

      ["RADAR", 1,
        "Hệ thống sử dụng sóng vô tuyến để phát hiện vị trí và khoảng cách của vật thể gọi là gì?"],

      ["DÂY AN TOÀN", 2,
        "Trang bị giữ hành khách cố định trên ghế khi cất cánh, hạ cánh hoặc gặp nhiễu động gọi là gì?"]

    ]
  },


  /* =========================================================
     7. PHƯƠNG TRÌNH
     ========================================================= */
  {
    topic: "Toán học",
    keyword: "PHƯƠNG TRÌNH",
    rows: [

      ["VẾ PHẢI", 2,
        "Phần biểu thức nằm sau dấu bằng được gọi là gì?"],

      ["HỆ SỐ", 0,
        "Con số đứng trước và nhân với một biến thường được gọi là gì?"],

      ["PHƯƠNG PHÁP THẾ", 2,
        "Trong hệ hai ẩn, cách rút một ẩn rồi thay vào biểu thức còn lại được gọi là gì?"],

      ["ĐƠN THỨC", 1,
        "Biểu thức đại số chỉ gồm một số, một biến hoặc tích của số và các biến gọi là gì?"],

      ["NGHIỆM", 0,
        "Giá trị của ẩn khiến hai vế của một đẳng thức có chứa ẩn bằng nhau gọi là gì?"],

      ["GIẢI", 0,
        "Thao tác tìm tất cả giá trị của ẩn thỏa mãn một quan hệ đại số được gọi là gì?"],

      ["VẾ TRÁI", 2,
        "Phần biểu thức nằm trước dấu bằng được gọi là gì?"],

      ["TRỤC SỐ", 1,
        "Đường thẳng có gốc, chiều và đơn vị dùng để biểu diễn các số gọi là gì?"],

      ["BÌNH PHƯƠNG", 1,
        "Lũy thừa bậc hai của một số thường được gọi là gì?"],

      ["NGHIỆM KÉP", 0,
        "Trong bài toán bậc hai, một giá trị nghiệm xuất hiện hai lần được gọi là gì?"],

      ["HÀM SỐ", 0,
        "Quy tắc gán cho mỗi giá trị đầu vào một giá trị đầu ra xác định gọi là gì?"]

    ]
  },


  /* =========================================================
     8. HỆ SINH THÁI
     ========================================================= */
  {
    topic: "Sinh thái học",
    keyword: "HỆ SINH THÁI",
    rows: [

      ["CHUỖI THỨC ĂN", 1,
        "Dãy sinh vật trong đó mỗi loài là nguồn thức ăn cho loài tiếp theo gọi là gì?"],

      ["NHIỆT ĐỘ", 3,
        "Yếu tố môi trường biểu thị mức độ nóng hoặc lạnh được gọi là gì?"],

      ["SINH CẢNH", 0,
        "Nơi sống tự nhiên đặc trưng của một loài hoặc một nhóm sinh vật gọi là gì?"],

      ["SINH VẬT", 1,
        "Các cơ thể sống như động vật, thực vật và vi sinh vật được gọi chung là gì?"],

      ["NĂNG LƯỢNG", 0,
        "Đại lượng được truyền từ sinh vật sản xuất qua các bậc dinh dưỡng gọi là gì?"],

      ["PHÂN HỦY", 1,
        "Quá trình chất hữu cơ chết được biến đổi thành các chất đơn giản hơn gọi là gì?"],

      ["QUẦN THỂ", 4,
        "Tập hợp các cá thể cùng loài sống trong một khu vực và thời gian xác định gọi là gì?"],

      ["THỨC ĂN", 1,
        "Nguồn vật chất mà sinh vật sử dụng để thu nhận chất dinh dưỡng và năng lượng gọi là gì?"],

      ["ÁNH SÁNG", 0,
        "Yếu tố từ Mặt Trời rất quan trọng đối với sinh vật sản xuất gọi là gì?"],

      ["VI SINH VẬT", 1,
        "Những sinh vật có kích thước rất nhỏ, nhiều loài tham gia phân giải chất hữu cơ, gọi chung là gì?"]

    ]
  },


  /* =========================================================
     9. PHIM CÂM
     ========================================================= */
  {
    topic: "Lịch sử điện ảnh",
    keyword: "PHIM CÂM",
    rows: [

      ["CHARLIE CHAPLIN", 10,
        "Danh hài người Anh nổi tiếng với nhân vật The Tramp là ai?"],

      ["THE KID", 1,
        "Tác phẩm năm 1921 kể về tình cảm giữa một người lang thang và một cậu bé có tên là gì?"],

      ["INTERTITLE", 0,
        "Những tấm chữ được chèn giữa các cảnh để truyền lời thoại hoặc thông tin được gọi bằng thuật ngữ tiếng Anh nào?"],

      ["MIME", 0,
        "Hình thức biểu diễn chủ yếu bằng cử chỉ, nét mặt và chuyển động cơ thể gọi là gì?"],

      ["CINEMA", 0,
        "Từ tiếng Anh nào thường dùng để chỉ nghệ thuật và ngành công nghiệp hình ảnh chuyển động?"],

      ["ÂM NHẠC", 0,
        "Yếu tố thường được nghệ sĩ chơi trực tiếp trong rạp để tạo cảm xúc cho khán giả thời kỳ đầu là gì?"],

      ["MÁY QUAY", 0,
        "Thiết bị dùng để ghi lại liên tiếp các hình ảnh chuyển động được gọi là gì?"]

    ]
  },


  /* =========================================================
     10. DUNG NHAM
     ========================================================= */
  {
    topic: "Địa chất và núi lửa",
    keyword: "DUNG NHAM",
    rows: [

      ["DÒNG CHẢY", 0,
        "Khối vật chất nóng chảy di chuyển xuống sườn sau một đợt phun trào tạo thành dạng gì?"],

      ["PUMICE", 1,
        "Loại đá núi lửa rất nhẹ và có nhiều lỗ khí được gọi bằng tên tiếng Anh nào?"],

      ["NHAM THẠCH", 0,
        "Tên gọi chung của vật chất đá nóng chảy hoặc đã đông đặc có nguồn gốc núi lửa là gì?"],

      ["MAGMA", 2,
        "Vật chất đá nóng chảy còn nằm bên dưới bề mặt Trái Đất được gọi là gì?"],

      ["NÚI LỬA", 0,
        "Cấu trúc địa chất có thể phun khí, tro và vật chất nóng chảy lên bề mặt gọi là gì?"],

      ["PHUN TRÀO", 1,
        "Hiện tượng vật chất từ bên trong Trái Đất thoát mạnh ra ngoài được gọi là gì?"],

      ["BASALT", 1,
        "Loại đá magma phun trào màu sẫm, rất phổ biến trong lớp vỏ đại dương, có tên tiếng Anh là gì?"],

      ["MIỆNG NÚI LỬA", 0,
        "Phần mở ở đỉnh hoặc sườn nơi khí và vật chất nóng thoát ra được gọi là gì?"]

    ]
  }

);



(window.DEBANK = window.DEBANK || []).push(

  /* =========================================================
     1. BÓNG ĐÁ
     ========================================================= */
  {
    topic: "Thể thao",
    keyword: "BÓNG ĐÁ",
    rows: [

      ["BÀN THẮNG", 0,
        "Khi quả bóng hoàn toàn vượt qua vạch giữa hai cột dọc và dưới xà ngang, kết quả đó gọi là gì?"],

      ["ĐỘI BÓNG", 4,
        "Một tập thể cầu thủ cùng thi đấu cho một câu lạc bộ hoặc quốc gia được gọi là gì?"],

      ["NGOẠI HẠNG", 0,
        "Hạng đấu cao nhất của một hệ thống giải quốc gia thường được gọi là gì?"],

      ["GÔN", 0,
        "Trong cách nói thông dụng, khung thành còn được nhiều người gọi ngắn gọn là gì?"],

      ["ĐÁ PHẠT", 0,
        "Hình thức đưa bóng trở lại cuộc chơi sau khi đối phương phạm lỗi gọi là gì?"],

      ["ÁO ĐẤU", 0,
        "Trang phục có số áo và màu sắc đại diện cho đội của vận động viên gọi là gì?"]

    ]
  },


  /* =========================================================
     2. ĐIỆN ẢNH
     ========================================================= */
  {
    topic: "Nghệ thuật thứ bảy",
    keyword: "ĐIỆN ẢNH",
    rows: [

      ["ĐẠO DIỄN", 0,
        "Người chịu trách nhiệm chính về cách kể chuyện và dàn dựng một bộ phim được gọi là gì?"],

      ["PHIM", 2,
        "Tác phẩm gồm chuỗi hình ảnh chuyển động được trình chiếu cho khán giả gọi là gì?"],

      ["HIỆU ỨNG", 2,
        "Những kỹ thuật tạo ra hình ảnh hoặc âm thanh đặc biệt ngoài cảnh quay thông thường gọi chung là gì?"],

      ["NHẠC PHIM", 0,
        "Phần âm nhạc được sáng tác hoặc lựa chọn để đồng hành với một tác phẩm màn ảnh gọi là gì?"],

      ["HÌNH ẢNH", 4,
        "Phần nội dung mà khán giả trực tiếp nhìn thấy trên màn hình được gọi chung là gì?"],

      ["NHÂN VẬT", 0,
        "Người hoặc hình tượng tham gia vào diễn biến của một câu chuyện được gọi là gì?"],

      ["HẬU KỲ", 0,
        "Giai đoạn dựng, chỉnh màu, xử lý âm thanh sau khi hoàn tất quay hình gọi là gì?"]

    ]
  },


  /* =========================================================
     3. NƯỚC MẮM
     ========================================================= */
  {
    topic: "Gia vị Việt Nam",
    keyword: "NƯỚC MẮM",
    rows: [

      ["NAM Ô", 0,
        "Làng nghề ven biển Đà Nẵng nổi tiếng lâu đời với một loại gia vị lên men truyền thống có tên là gì?"],

      ["Ủ CHƯỢP", 3,
        "Quá trình để cá và muối lên men trong thời gian dài thường được gọi là gì?"],

      ["NƯỚC CỐT", 2,
        "Phần chất lỏng đậm đặc được rút ra ở những lượt đầu thường được gọi là gì?"],

      ["CÁ CƠM", 0,
        "Loài cá nhỏ sống thành đàn, thường được sử dụng làm nguyên liệu cho nhiều sản phẩm lên men ven biển là cá gì?"],

      ["MUỐI", 0,
        "Khoáng chất có vị mặn được trộn với cá để bảo quản và lên men là gì?"],

      ["NẮNG", 1,
        "Yếu tố thời tiết nào cung cấp nhiệt tự nhiên cho những thùng chượp đặt ngoài trời?"],

      ["MÙI THƠM", 0,
        "Khi quá trình lên men đạt yêu cầu, một đặc điểm cảm quan dễ nhận biết bằng khứu giác là gì?"]

    ]
  },


  /* =========================================================
     4. HỘI LIM
     ========================================================= */
  {
    topic: "Lễ hội Bắc Bộ",
    keyword: "HỘI LIM",
    rows: [

      ["HÁT ĐỐI", 0,
        "Hình thức hai bên thay nhau cất lời ca để giao lưu và đáp lại nhau gọi là gì?"],

      ["BỘ ÁO TỨ THÂN", 1,
        "Trang phục nữ truyền thống Bắc Bộ gồm bốn thân áo thường được gọi là gì?"],

      ["LIỀN ANH", 1,
        "Cách gọi những người nam tham gia một lối hát giao duyên nổi tiếng ở vùng Kinh Bắc là gì?"],

      ["LIỀN CHỊ", 0,
        "Cách gọi tương ứng dành cho những người nữ trong lối hát giao duyên Kinh Bắc là gì?"],

      ["MỜI TRẦU", 2,
        "Nghi thức trao miếng trầu để thể hiện tình cảm và sự hiếu khách thường được gọi là gì?"],

      ["MÙA XUÂN", 0,
        "Mùa nào trong năm tập trung nhiều lễ hội truyền thống ở miền Bắc Việt Nam?"]

    ]
  },


  /* =========================================================
     5. ĐÔNG SƠN
     ========================================================= */
  {
    topic: "Khảo cổ Việt Nam",
    keyword: "ĐÔNG SƠN",
    rows: [

      ["ĐỒNG THAU", 0,
        "Hợp kim của đồng với thiếc, được người xưa sử dụng rộng rãi để đúc công cụ và đồ nghi lễ, gọi là gì?"],

      ["SÔNG MÃ", 1,
        "Con sông lớn chảy qua Thanh Hóa trước khi đổ ra Biển Đông có tên là gì?"],

      ["NGỌC LŨ", 0,
        "Tên một hiện vật bằng đồng nổi tiếng được phát hiện ở Hà Nam và hiện lưu giữ tại Bảo tàng Lịch sử Quốc gia là gì?"],

      ["HÌNH NGƯỜI", 5,
        "Ngoài chim và động vật, hình tượng nào thường xuất hiện trong các cảnh sinh hoạt được trang trí trên cổ vật?"],

      ["SAO NHIỀU CÁNH", 0,
        "Họa tiết hình học thường nằm ở chính giữa mặt của nhiều chiếc trống cổ có dạng gì?"],

      ["HƯƠU", 2,
        "Loài thú có sừng từng xuất hiện trong một số mô típ trang trí cổ được gọi là gì?"],

      ["VĂN LANG", 2,
        "Nhà nước cổ thường được nhắc tới khi nghiên cứu đời sống cư dân Việt cổ thời các vua Hùng có tên là gì?"]

    ]
  },


  /* =========================================================
     6. XE ĐẠP
     ========================================================= */
  {
    topic: "Phương tiện",
    keyword: "XE ĐẠP",
    rows: [

      ["XÍCH", 0,
        "Bộ phận gồm nhiều mắt kim loại nối tiếp nhau, truyền chuyển động từ bàn đạp tới bánh sau, gọi là gì?"],

      ["PEDAL", 1,
        "Bộ phận người sử dụng dùng chân tác động để tạo chuyển động thường được gọi bằng từ tiếng Anh nào?"],

      ["ĐÈN", 0,
        "Thiết bị giúp chiếu sáng phía trước khi di chuyển trong điều kiện thiếu sáng gọi là gì?"],

      ["BẠC ĐẠN", 1,
        "Chi tiết cơ khí gồm các viên bi hoặc con lăn giúp trục quay giảm ma sát gọi là gì?"],

      ["PHANH", 0,
        "Bộ phận giúp giảm tốc độ hoặc dừng phương tiện gọi là gì?"]

    ]
  },


  /* =========================================================
     7. TÀU HỎA
     ========================================================= */
  {
    topic: "Đường sắt",
    keyword: "TÀU HỎA",
    rows: [

      ["THAN ĐÁ", 0,
        "Nhiên liệu rắn từng được sử dụng phổ biến cho đầu máy hơi nước là gì?"],

      ["NHÀ GA", 2,
        "Công trình nơi hành khách chờ lên phương tiện chạy trên đường ray thường được gọi là gì?"],

      ["ĐẦU MÁY", 2,
        "Phần phương tiện tạo lực kéo cho các toa phía sau được gọi là gì?"],

      ["HÀNH KHÁCH", 0,
        "Người mua vé để di chuyển bằng một phương tiện công cộng được gọi là gì?"],

      ["ĐỎ", 1,
        "Trong tín hiệu giao thông đường sắt, màu nào thường mang ý nghĩa dừng lại?"],

      ["GA", 1,
        "Địa điểm nơi đoàn phương tiện dừng để đón, trả người hoặc hàng hóa được gọi ngắn gọn là gì?"]

    ]
  },


  /* =========================================================
     8. ĐIỆN THOẠI
     ========================================================= */
  {
    topic: "Công nghệ hằng ngày",
    keyword: "ĐIỆN THOẠI",
    rows: [

      ["ĐÈN FLASH", 0,
        "Nguồn sáng nhỏ hỗ trợ chụp ảnh trong điều kiện thiếu sáng thường được gọi là gì?"],

      ["SIM", 1,
        "Thẻ nhỏ chứa thông tin thuê bao mạng di động thường được gọi bằng ba chữ cái nào?"],

      ["HIỆU ỨNG RUNG", 2,
        "Phản hồi xúc giác khiến thiết bị dao động nhẹ khi có thông báo hoặc thao tác được gọi là gì?"],

      ["NÚT NGUỒN", 0,
        "Nút vật lý dùng để bật, tắt hoặc khóa thiết bị thường được gọi là gì?"],

      ["TAI NGHE", 0,
        "Phụ kiện dùng để nghe âm thanh riêng tư mà không phát ra loa ngoài gọi là gì?"],

      ["HỆ ĐIỀU HÀNH", 0,
        "Phần mềm nền tảng như Android hoặc iOS được gọi chung là gì?"],

      ["LOA", 1,
        "Bộ phận biến tín hiệu điện thành âm thanh để người dùng nghe được gọi là gì?"],

      ["MẠNG DI ĐỘNG", 1,
        "Hệ thống viễn thông cho phép thiết bị kết nối qua các trạm phát sóng được gọi là gì?"],

      ["WIFI", 1,
        "Công nghệ thường dùng để kết nối thiết bị với mạng không dây trong nhà có tên là gì?"]

    ]
  },


  /* =========================================================
     9. VIOLIN
     ========================================================= */
  {
    topic: "Nhạc cụ",
    keyword: "VIOLIN",
    rows: [

      ["VĨ CẦM", 0,
        "Tên gọi tiếng Việt của nhạc cụ dây được đặt dưới cằm và chơi bằng vĩ là gì?"],

      ["DÂY MI", 4,
        "Trong cách lên dây phổ biến, dây cao nhất của nhạc cụ này mang tên nốt nào?"],

      ["ORCHESTRA", 0,
        "Dàn nhạc lớn gồm nhiều nhóm nhạc cụ dây, hơi và gõ được gọi bằng tiếng Anh là gì?"],

      ["LUTHIER", 0,
        "Nghệ nhân chuyên chế tác và sửa chữa các nhạc cụ dây như violin hoặc cello được gọi là gì?"],

      ["ITALY", 0,
        "Quốc gia quê hương của những dòng đàn nổi tiếng do Stradivari và Guarneri chế tác là nước nào?"],

      ["NHỰA THÔNG", 0,
        "Chất được chà lên lông vĩ để tăng ma sát với dây đàn gọi là gì?"]

    ]
  },


  /* =========================================================
     10. SUSHI
     ========================================================= */
  {
    topic: "Ẩm thực thế giới",
    keyword: "SUSHI",
    rows: [

      ["SASHIMI", 0,
        "Món Nhật gồm những lát hải sản sống được thái đẹp mắt và thường ăn cùng nước tương gọi là gì?"],

      ["UMAMI", 0,
        "Vị cơ bản thường được mô tả là vị ngon đậm đà trong ẩm thực Nhật Bản gọi là gì?"],

      ["SHOYU", 0,
        "Tên tiếng Nhật của loại nước tương thường dùng làm nước chấm là gì?"],

      ["HOSOMAKI", 0,
        "Loại cuộn nhỏ, thường chỉ có một loại nhân ở giữa, được gọi là gì?"],

      ["NIGIRI", 1,
        "Món gồm một miếng cơm nắm nhỏ phủ cá hoặc hải sản phía trên gọi là gì?"]

    ]
  }

);