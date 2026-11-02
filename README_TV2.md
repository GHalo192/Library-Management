# TV2 — Nhật ký bàn giao theo tuần

Ngày 01/11/2026 được tính là **tuần 1** theo yêu cầu. Bản đầu vào lấy từ origin/tv2 tại `559e64967aec252f8c05c7f5555c47354ecb9bca`, trong thư mục làm việc riêng tv2. Tài liệu này bổ sung README chính, không thay kế hoạch hoặc đặc tả nghiệp vụ.

## Tuần 1 — đã triển khai và kiểm tra

- Trước sửa: readers/bookshelf chỉ có .gitkeep. Sau sửa: readers có màn hình danh sách, tìm kiếm, thêm/sửa hồ sơ, cấp/gia hạn/khóa thẻ và trạng thái hiệu lực.
- Dữ liệu thử trong bộ nhớ, tải lại trang để đặt lại; không gọi API đang viết của TV4 và không dùng LocalStorage prototype.
- Kiểm tra trường bắt buộc, mã tài khoản duy nhất, mã thẻ duy nhất, điện thoại, ngày cấp/hết hạn và gia hạn không rút ngắn. Không áp tuổi 18–55, thẻ X/Y hoặc hạn 6 tháng.
- Route `/readers`, mount nhận container/signal và trả cleanup; TV1 đăng ký vào app.js lúc tích hợp. Không sửa file chung của TV1.
- Các thao tác tuần 1 nằm trong một màn hình có hai form, không cần tạo bản sao HTML cho từng trạng thái. Model tách khỏi DOM để kiểm thử độc lập.

### Cách chạy và kiểm tra

Từ gốc nhánh chạy `C:/xampp/php/php.exe -S 127.0.0.1:8082 -t frontend`, mở `http://127.0.0.1:8082/readers/demo.html`; hoặc dùng Live Server trên trang đó. Không cần DB cho demo tuần 1. Route trên ứng dụng chính chưa được TV1 nối.

Chạy `node frontend/readers/week1.test.mjs`. Đã qua ca bắt buộc/trùng tài khoản, sửa hồ sơ, trùng mã thẻ, ngày sai, hết hạn, gia hạn và khóa. Đã thử bằng Edge: lỗi form trống, thêm hồ sơ, cấp thẻ, tìm không có kết quả; desktop 1280px và mobile 390px không tràn ngang, không có lỗi JavaScript.

### Thiết kế dữ liệu gửi TV1

| Dữ liệu giao diện | Cột nền | Ràng buộc |
|---|---|---|
| id / accountId | doc_gia_id / tai_khoan_id | FK tài khoản có thật, UNIQUE tài khoản |
| name / phone / address | ho_ten / dien_thoai / dia_chi | Họ tên bắt buộc, tối đa 150; điện thoại tối đa 20; địa chỉ 255 |
| card.code | ma_the | Duy nhất, tối đa 32 |
| issued / expires | ngay_cap / ngay_het_han | Ngày hợp lệ; hết hạn không trước ngày cấp |
| status | trang_thai | active hoặc locked |

Tuần 2 backend phải kiểm tra tài khoản tồn tại, quyền/chủ sở hữu và ràng buộc DB. Demo chỉ kiểm tra ID đầu vào, không chứng minh liên kết tài khoản thật. Không cần thêm bảng mới so với schema nền; TV1 xem xét migration nếu phát sinh thay đổi. Đề xuất thẻ dùng ngày hết hạn được nhân viên nhập rõ; thời hạn mặc định và chính sách cấp/gia hạn vẫn cần nhóm chốt, không suy ra từ fixture 01/11/2026.

### Hợp đồng API đề xuất cho tuần 2 (chưa tồn tại)

| Method/path | Input | Output/quyền |
|---|---|---|
| GET /api/readers | page, page_size, q | data[], meta; staff/admin |
| POST /api/readers | tai_khoan_id, ho_ten, dien_thoai, dia_chi | data.doc_gia_id; staff/admin |
| PATCH /api/readers/:id | ho_ten, dien_thoai, dia_chi | hồ sơ mới; staff/admin |
| PUT /api/readers/:id/card | ma_the, ngay_cap, ngay_het_han, trang_thai | thẻ mới; staff/admin |
| GET /api/readers/me | phiên backend | hồ sơ của chính tài khoản student |

Dùng envelope data/error của README, CSRF cho ghi; 401/403 khi sai phiên/quyền, 404 không tồn tại, 409 trùng tài khoản/thẻ, 422 dữ liệu sai. Không trả lịch sử giao dịch tự viết: TV3 cung cấp ở B4, TV2 dùng ở tuần 5. Ví dụ POST `{ "tai_khoan_id": 4, "ho_ten": "Nguyễn An" }` → 201 `{ "data": { "doc_gia_id": 2 }, "error": null }`. Đây là đề xuất, cần TV1 chốt trước làm hợp đồng nền.

## Kiểm tra chéo và sửa tiếp — 02/11/2026, vẫn thuộc tuần 1

- Đã rà soát mã và chạy lại ca kiểm tra thay nhóm theo yêu cầu người dùng.
- Sửa lỗi mã hồ sơ cập nhật sai (NaN, âm, thập phân hoặc 0 nhập tường minh) có thể bị hiểu thành tạo mới. Giờ từ chối trước khi đổi dữ liệu; test xác nhận store giữ nguyên.
- Không mount màn hình khi signal đã hủy; render cũng dừng sau cleanup.
- PASS test dữ liệu, thao tác Edge desktop/mobile; PASS gắn thử route readers với router nền thật ở môi trường kiểm tra cục bộ.
- Phần session/health của môi trường thử router là fixture; chưa kiểm thử backend/DB và chưa merge main. Không coi kết quả này là xác nhận chính sách thẻ.

## Tuần 2 — chưa thực hiện

Nối readers với API/PDO của chính TV2, kiểm tra quyền/chủ sở hữu và thẻ bằng schema nền. Chỉ bắt đầu phần phụ thuộc khi B1 chung được chốt; không gọi AccountService TV4 đang viết cùng tuần.

## Tuần 3 — chưa thực hiện

Liên kết hồ sơ với tài khoản đã bàn giao B2, hoàn thiện trường hợp biên.

## Tuần 4 — chưa thực hiện

Bookshelf: tủ sách, yêu thích, dấu trang, tiến độ/lịch sử đọc gắn tài khoản và phiên bản eBook.

## Tuần 5 — chưa thực hiện

Lịch sử mượn/trả cá nhân qua API TV3 B4, hoàn thiện tủ sách và dữ liệu đọc.

## Tuần 6 — chưa thực hiện

Kiểm tra hồi quy, quyền dữ liệu, đổi phiên bản PDF, hoàn thiện hướng dẫn và bàn giao.

## Điều kiện chuyển tuần

Đầu ra giao diện/thiết kế tuần 1 đã có để review. Chưa tuyên bố B1 toàn nhóm: cần TV1 xem xét hợp đồng/chính sách thẻ, tích hợp PR và kiểm tra chung. Bộ dữ liệu mẫu không thay nghiệm thu backend.
