# TV3 — Nhật ký bàn giao theo tuần

Ngày 01/11/2026 là **tuần 1**. Lấy origin/tv3 tại `bf5dd472b1725d2f3945647ccd18d5a05ab7d41b` vào thư mục tv3 riêng trước khi sửa. README này ghi thay đổi và kế hoạch tiếp theo; kế hoạch chính thức là nguồn README gốc tham chiếu, không phải bản cũ trong personal/.

## Tuần 1 — đã triển khai và kiểm tra

- Trước sửa: HTML/JS/PHP chỉ là khung. Sau sửa: trang thử độc lập có chọn bản sách, gửi yêu cầu, duyệt/từ chối, bàn giao, xem phiếu và khoản phạt mẫu.
- Luồng pending → approved → issued hoặc pending → rejected. Duyệt không tạo phiếu và không đổi tồn; bàn giao mới tạo phiếu, bắt đầu hạn và đổi khả dụng.
- Kiểm tra 1–3 cuốn/lần, tổng tối đa 7 khi yêu cầu và khi giao, thẻ còn hiệu lực, hạn 1–14 ngày; từ chối giao lặp hoặc bản sách đã được yêu cầu khác nhận. Ngày giao 01/11/2026 là fixture, không là đồng hồ sản phẩm.
- Khoản phạt 12.000đ là fixture có giải thích 2 cuốn × 3 ngày × 2.000đ, cho phép xác nhận mẫu; chưa triển khai bộ tính hoặc thu tiền.
- Cung cấp routes/mount/cleanup cho loans và fines. TV1 nối router khi tích hợp; tuần 1 chạy độc lập, không cần API mới của TV1/TV2.
- Sửa chú thích sao chép nhầm module, đánh dấu kế hoạch personal là bản cũ. Hoàn trả thay đổi /personal/ trong .gitignore về bản nền để không giữ sửa file chung không cần thiết.
- PHP và màn hình trả/gia hạn/thu tiền tuần sau vẫn là khung, không ghi hoàn thành. Không triển khai backend giả trả thành công.

### Chạy và kiểm tra

Từ gốc nhánh: `C:/xampp/php/php.exe -S 127.0.0.1:8083 -t frontend`; mở `http://127.0.0.1:8083/loans/demo.html` hoặc Live Server. Dữ liệu trong bộ nhớ; tải lại để đặt lại. Chạy `node frontend/loans/week1.test.mjs`.

Đã qua: 4 cuốn bị chặn, thẻ sai, duyệt không giảm tồn/tạo phiếu, hạn 15 ngày bị chặn, giao hợp lệ, giao lặp, hai yêu cầu tranh cùng bản, kiểm tra lại tổng 7 lúc giao, từ chối và xác nhận phạt lặp. Đây là mô phỏng tuần 1, không chứng minh transaction/concurrency thật của DB. Đã thử Edge: gửi → duyệt → giao → xác nhận phạt; desktop 1280px/mobile 390px không tràn ngang, không lỗi JavaScript.

### Thiết kế gửi TV1

| Nhóm bảng đề xuất cho B2/B3 | Trường/ràng buộc |
|---|---|
| yeu_cau_muon | id, doc_gia_id, trang_thai, created_at, reviewed_by, reviewed_at |
| chi_tiet_yeu_cau_muon | yeu_cau_id, ban_sach_id; UNIQUE cặp |
| phieu_muon | id, yeu_cau_id UNIQUE, doc_gia_id, ngay_giao, created_by |
| chi_tiet_phieu_muon | id, phieu_muon_id, ban_sach_id, han_tra, ngay_tra nullable, tinh_trang |
| phieu_phat / chi_tiet_phieu_phat | doc_gia_id, chi_tiet_muon_id, loại vi phạm, số ngày, giá trị, trạng thái; khóa chống ghi trùng |

ID/FK theo nền BIGINT UNSIGNED; không cascade xóa lịch sử. TV1 trực tiếp làm migration sau khi chốt. Tuần 2 bộ tính nhận input độc lập, chưa cần bảng phiếu. Tuần 3 bàn giao phải dùng cùng PDO, khóa/kiểm tra lại bản sách và tổng đang mượn trong transaction, rollback cả phiếu/kho khi lỗi. Mô phỏng đồng bộ JS chưa đáp ứng tranh chấp đa người dùng.

### API đề xuất (chưa tồn tại)

- POST /api/borrow-requests: `{ "ban_sach_ids": [1,2] }`; doc_gia_id lấy từ phiên, không tin browser. Student tạo cho mình; thủ thư thao tác tại quầy theo hợp đồng riêng.
- PATCH /api/borrow-requests/:id/review: `{ "approved": true }`; librarian, đổi trạng thái, chưa tạo phiếu.
- POST /api/borrow-requests/:id/handover: `{ "so_ngay_muon": 14 }`; librarian, trả phieu_muon_id; chống giao lặp bằng UNIQUE yeu_cau_id và transaction.
- GET /api/loans: lọc/phân trang; student chỉ bản thân, librarian theo quyền. API lịch sử bàn giao B4.
- POST /api/fines/:id/confirm: librarian xác nhận số tiền backend tính, không nhận số tiền tùy ý từ giao diện.

Envelope data/error; 401/403 phiên/quyền, 404 không tồn tại, 409 trạng thái/tồn/hạn mức xung đột, 422 input; CSRF cho ghi. TV1 và chủ module chốt method/trường trước khi coi là hợp đồng nền.

### Chính sách cần chốt trước B1

Đề xuất để nhóm duyệt: múi giờ Asia/Ho_Chi_Minh; ngày mượn/hạn trả theo ngày lịch, quá hạn tính từ ngày kế tiếp hạn trả. Bộ tính tuần 2 nhận ngày và chính sách tường minh, không lấy timezone máy. Phụ phí mất/hỏng, nguồn giá sách và việc cộng phạt quá hạn chưa có quyết định; không tự đặt 50.000/100.000đ. Gia hạn theo từng bản và cộng từ hạn cũ là đề xuất, cần chốt trước B3. Thiếu chính sách thì không nghiệm thu nhánh tính phụ thuộc chính sách đó.

## Kiểm tra chéo và sửa tiếp — 02/11/2026, vẫn thuộc tuần 1

- Đã rà soát mã và chạy lại ca kiểm tra thay nhóm theo yêu cầu người dùng.
- Từ chối danh sách bản sách sai kiểu, mã sai hoặc trùng; không âm thầm gộp các bản trùng rồi nhận yêu cầu.
- Quyết định duyệt phải là boolean; chuỗi "false" không còn bị hiểu là duyệt. Hiệu lực thẻ phải là true tường minh ở cả yêu cầu và bàn giao.
- Không mount/render sau khi hủy; khi rời loans rồi quay lại, thao tác gửi chỉ tạo một yêu cầu.
- PASS test dữ liệu và Edge desktop/mobile; PASS chuyển loans → fines → loans với router nền, không lặp handler.
- Session/health ở môi trường thử router là fixture; chưa phải kiểm tra transaction hoặc concurrency DB thật, chưa merge main. Các chính sách bộ tính tuần 2 vẫn cần chốt.

## Tuần 2 — chưa thực hiện

Bộ tính phạt độc lập và màn hình xem trước; kiểm tra đúng hạn, 2 × 3 × 2.000 = 12.000 và ngày biên. Không tạo phiếu/thu tiền thật, không gọi API sách/thẻ đang viết cùng tuần.

## Tuần 3 — chưa thực hiện

Yêu cầu/duyệt/bàn giao thật với sách, thẻ và xác thực B2; transaction, kiểm tra quyền/hạn mức và đồng thời.

## Tuần 4 — chưa thực hiện

Trả từng bản, gia hạn, mất/hỏng, ghi nhận phạt và API lịch sử có quyền.

## Tuần 5 — chưa thực hiện

Thu toàn bộ tại quầy, chống thu trùng; kết nối sự kiện thông báo đã có B4.

## Tuần 6 — chưa thực hiện

Hồi quy, rollback, thao tác lặp/đồng thời, bằng chứng bảo toàn dữ liệu và bàn giao.

## Điều kiện chuyển tuần

Có đầu ra giao diện/thiết kế tuần 1 để review. Cần TV1 kiểm tra/tích hợp PR và nhóm chốt chính sách còn mở trước phát hành B1. Không dùng demo như API nguồn cho thành viên khác.
