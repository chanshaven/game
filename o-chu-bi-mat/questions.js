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

{
  topic: "Thế giới thực vật",
  keyword: "THỰC VẬT",
  rows: [
    ["NHIỆT ĐỘ",    4, "Đây là một yếu tố mà khi tăng quá cao hoặc hạ quá thấp cây sẽ ngừng quang hợp và hô hấp."],
    ["ÁNH SÁNG",    2, "Đây là yếu tố quan trọng giúp cho cây trồng thực hiện được quá trình quang hợp."],
    ["SỰ SỐNG",     1, "Điền vào chỗ trống: Cây cần đủ nước, chất khoáng, không khí, ánh sáng và nhiệt độ thích hợp để duy trì …… và phát triển."],
    ["NƯỚC",        3, "Chất này thoát ra ở lá cây dưới dạng hơi."],
    ["VỪA ĐỦ",      0, "Khi tưới nước cho cây, em cần lưu ý tưới một lượng nước như thế nào?"],
    ["CHẬU",        2, "Em thường trồng cây cảnh vào đâu?"],
    ["CHẤT KHOÁNG", 3, "Ngoài nước, rễ cây còn vận chuyển chất gì lên thân và lá?"]
  ]
}

);
