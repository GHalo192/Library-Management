# Chính sách triển khai đã chốt — B1, 02/11/2026

Người dùng đã giao chốt các điểm đang mở và tích hợp bản chung. Các lựa chọn dưới là **quyết định triển khai của đồ án**, không khẳng định là quy định được trích từ tài liệu nghiệp vụ cũ. Giữ các giới hạn BR đã xác nhận: 3 cuốn/lần, 7 đang mượn, 14 ngày, gia hạn tối đa 2 lần × 7 ngày, quá hạn tối đa 1 ngày được xét, 2.000đ/cuốn/ngày; eBook 3 cuốn/lần và 14 ngày.

## Quyết định dùng từ tuần 2

| Điểm trước đây còn mở | Quyết định |
|---|---|
| Đăng nhập | Email hoặc MSSV + mật khẩu. Email không phân biệt hoa thường; MSSV chuẩn hóa trim/uppercase. Không dùng MSSV làm mật khẩu. Đăng ký sinh viên bắt buộc MSSV duy nhất; nhân viên có thể null. Mật khẩu tối thiểu 8 ký tự; backend password_hash/password_verify. |
| Tài khoản chờ hồ sơ | Tài khoản vẫn active nhưng chưa có doc_gia/the_doc_gia thì chưa được mượn. Không thêm role hoặc trạng thái "pending" ngoài schema. Họ tên/điện thoại đăng ký lưu tại tai_khoan để TV2 liên kết hồ sơ sau. |
| Quyền quản lý sách | staff và admin được thêm/sửa; các vai trò khác tra cứu. Không xóa/ngừng bản đang mượn. |
| Vị trí | MA_THE_LOAI-KE; không đổi thể loại đầu sách đã có bản trong tuần 2. Chuyển thể loại/kệ sau này phải là nghiệp vụ đồng bộ có kiểm tra, không tắt FK. |
| Thẻ | Không áp loại X/Y, tuổi 18–55. Mặc định 12 tháng lịch từ ngày cấp; nếu thiếu ngày tương ứng thì lấy ngày cuối tháng. Có hiệu lực hết ngày hết hạn. Gia hạn từ max(hạn hiện tại, ngày thao tác), cộng 12 tháng; giữ ngày cấp gốc. staff/admin cấp/gia hạn/khóa, cần ghi nhật ký. |
| Ngày mượn/quá hạn | Asia/Ho_Chi_Minh. Hạn trả là ngày lịch, cuối ngày 23:59:59 vẫn đúng hạn. Hạn mượn = ngày bàn giao + số ngày (1–14). Ngày quá hạn = max(0, ngày xử lý - ngày hạn), không chia giây rồi làm tròn. Ví dụ hạn 01/11, trả 02/11 tính 1 ngày. |
| Gia hạn | Đếm theo từng bản; tối đa 2 lần, thêm 1–7 ngày từ hạn hiện tại. Chỉ thủ thư duyệt, và số ngày quá hạn theo công thức trên <=1. Yêu cầu chưa duyệt không đổi hạn. |
| Mất/hỏng | Phụ phí = 0. Mất hoặc hỏng không phục hồi: bồi thường 100% gia_bia hiện tại được chụp lại khi xác nhận vi phạm. Hỏng phục hồi được: chi phí sửa có căn cứ và được thủ thư xác nhận, không quá giá bìa. Không có giá hợp lệ hoặc căn cứ chi phí thì chặn xác nhận, yêu cầu quản lý bổ sung; không tự tính 0. |
| Cộng tiền quá hạn | Cộng phạt quá hạn đến ngày thủ thư xác nhận mất/hỏng; dừng đếm cho bản đó sau ngày này. Mỗi vi phạm chỉ sinh một khoản phạt; giữ snapshot giá/chính sách. Bản hỏng/mất không tự về available. |
| Thu phạt | Thu toàn bộ khoản đã xác nhận tại quầy, không thu từng phần, không cổng thanh toán. Khóa/chống trùng khi thu. |
| Hồ sơ nhân viên | Email lấy qua tai_khoan; ho_ten/ma_nhan_vien tại nhan_vien. Bổ sung dien_thoai, chuc_vu, trang_thai active/inactive; ngừng nhân viên phải khóa tài khoản liên kết trong cùng transaction khi backend được triển khai. Không xóa lịch sử. |

Điện thoại được chuẩn hóa về 0xxxxxxxxx. Kiểm tra trùng điện thoại trong demo chỉ là hỗ trợ nhập liệu; hợp đồng chính thức yêu cầu duy nhất email/MSSV/mã nhân viên, không coi số điện thoại là danh tính xác thực. Khi viết backend tuần 2, cập nhật validation cho phép số liên hệ dùng chung nếu có nhu cầu.

## Quyết định cho các tuần sau

- eBook công khai cho phép khách đọc; loại giới hạn bắt buộc tài khoản có quyền được duyệt. Quyền 14 × 24 giờ bắt đầu tại thời điểm cấp quyền. Lặp yêu cầu khi còn chờ/còn quyền trả lại yêu cầu/quyền hiện có; hết hạn mới được tạo yêu cầu mới. Không tự áp tổng hạn mức 7 sách giấy cho eBook.
- Thông báo trong ứng dụng khi duyệt/từ chối yêu cầu mượn hoặc gia hạn; nhắc lúc 09:00 trước hạn trả 2 ngày, theo múi giờ nghiệp vụ. Chạy bù cho trường hợp đến hạn nhắc nhưng chưa gửi; không gửi lại nếu đã trả hoặc đã có khóa chống trùng (loại sự kiện + ID giao dịch + hạn trả). Email là mở rộng chưa triển khai.
- Tiến độ đọc dùng ebook_id, file_version và page bắt đầu từ 1; thay tệp không tự áp tiến độ phiên bản cũ.

## Áp dụng vào dữ liệu và mã nguồn

`database/migrations/001_b1.php` bổ sung các trường nền và cập nhật cau_hinh, có version marker để không ghi đè cấu hình khi chạy lại. Cài mới: schema.sql → seed.sql → migration. Nâng cấp: chỉ chạy migration, không nhập lại schema/seed.

Các màn hình `/week1/*` vẫn là fixture để nghiệm thu giao diện độc lập của B1; ngày và số tiền mẫu không phải cơ chế áp chính sách sản phẩm. Mã API tuần 2–5 phải đọc chính sách từ DB, kiểm tra quyền backend và ghi snapshot phù hợp. Chốt chính sách không có nghĩa các nghiệp vụ tuần sau đã được viết.

Tài liệu này thay các nhắc “chưa chốt/chờ xác nhận” tương ứng trong README chính, README_TV2/3/4 và tài liệu lịch sử. Những giới hạn ngoài bảng không tự được mở rộng.
