# Bản tích hợp B1 — 02/11/2026

Đã tích hợp TV2 `8d5c3e3`, TV3 `e6df102`, TV4 `40ca173` với nền TV1; chốt các điểm nghiệp vụ mở tại [CHINH_SACH_B1.md](CHINH_SACH_B1.md). Đây là mốc cuối tuần 1, đủ đầu vào để bắt đầu tuần 2 theo kế hoạch. Không tuyên bố đã hoàn thành chức năng backend của tuần 2–5.

## Chạy thử nhanh trên máy Windows có XAMPP

Tại thư mục gốc bản main, chạy PowerShell:

```powershell
.\START_B1.ps1 -OpenBrowser
```

Script dùng PHP/MariaDB trong C:/xampp, mở web 8080 và DB 13307, chỉ bind 127.0.0.1. DB được đặt riêng dưới backend/storage/b1-mysql và không sửa DB XAMPP đang có. Có thể đổi -WebPort, -DbPort, -XamppPath. Thư mục storage/log không được commit. Script không tự xóa database nếu có lỗi nhập dở.

Máy đang được chuẩn bị trong lần bàn giao này đã có bản chạy tại [http://127.0.0.1:8080](http://127.0.0.1:8080). Sau khi khởi động lại máy, chạy script trên để bật lại.

## Cách thử

1. Mở trang sẽ hiện đăng nhập trước. Dùng admin / 123456 (hoặc tài khoản mẫu khác), sau đó vào Tổng quan với các liên kết truy cập nhanh.
2. Menu **Độc giả / thẻ**: tìm, thêm/sửa hồ sơ và cấp/gia hạn/khóa thẻ mẫu.
3. **Mượn / bàn giao**: chọn bản sách, gửi → duyệt → bàn giao. Duyệt chưa giảm tồn hoặc tạo phiếu.
4. **Khoản phạt**: xác nhận khoản mẫu; chưa phải thu tiền.
5. **Tài khoản / nhân viên**: dùng tài khoản vừa đăng nhập để thử quản lý tài khoản/nhân viên; tài khoản student có thể thử đổi mật khẩu; hoặc đăng ký với email/MSSV mới.

Các trang /readers, /loans, /fines và /accounts dùng dữ liệu trong bộ nhớ. Đường dẫn /week1/* cũ được chuyển sang đường dẫn mới. Reload đặt lại dữ liệu; đăng nhập mẫu không đổi phiên máy chủ và không cấp quyền API. Nhãn tài khoản trên giao diện ghi rõ (mẫu), không đại diện cho quyền API máy chủ. Các routes có quyền của sản phẩm chỉ được nối khi backend thật được triển khai ở tuần 2. Không dùng fixture làm cơ sở dữ liệu giao dịch thật.

## Cài/nâng cấp thủ công

- Cài mới trên DB trống: nhập database/schema.sql, database/seed.sql, rồi đặt biến DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD theo README và chạy `php database/migrations/001_b1.php`.
- Nâng cấp DB nền cũ: chỉ chạy migration trên. Nó bổ sung cột, chốt cấu hình một lần và ghi schema_migrations; chạy lại in SKIP, không ghi đè chính sách đã chỉnh sau đó. Không chạy lại schema/seed trên DB có dữ liệu.
- MariaDB 10.4.32 và PHP 8.2.12 đã kiểm tra. SQL nền dùng PDO MySQL; chưa xác nhận độc lập trên Oracle MySQL.
- Chạy web thủ công: `php -S 127.0.0.1:8080 -t frontend backend/dev-router.php`. Dùng document root frontend, không phải toàn repository.

## Kết quả nghiệm thu B1

- Ba bộ test dữ liệu module PASS, gồm ràng buộc và hủy thao tác.
- Cài mới hai DB riêng test/demo, migration lần đầu PASS, chạy lần hai SKIP.
- 19 ca PHP nền PASS: router, phiên, quyền, khóa, CSRF, FK/unique/check và tồn khả dụng.
- B1 DB test PASS: chính sách không còn NULL, marker duy nhất, seed không mất, trường nhân viên ghi/rollback được.
- HTTP thật PASS: health/db/session, CSRF, 404/405 và không lộ config/SQL/.env.
- API client PASS: 204, Blob, 401, lỗi mạng/HTTP, abort, CSRF.
- Edge với PHP/DB thật PASS: menu bốn module, nhập liệu/gửi/duyệt/giao/thêm tài khoản, cleanup, desktop 1440px, tablet 800px, mobile 390px, không tràn ngang hoặc lỗi JavaScript. Thao tác module vẫn dùng fixture như phạm vi B1; các API nền không bị mock.

Lệnh chạy lại (DB thử mới có tên kết thúc _test, đã nhập schema/seed/migration):

```powershell
php backend/tests/week1.php
php backend/tests/b1.php
node frontend/readers/week1.test.mjs
node frontend/loans/week1.test.mjs
node frontend/accounts/week1.test.mjs
node backend/tests/http.mjs
node backend/tests/api-client.mjs
node backend/tests/b1-browser.cjs
```

Đặt DB_* và TEST_URL cùng DB/server thử. Kiểm tra trình duyệt cần Playwright trong môi trường và BROWSER_PATH nếu dùng Edge. Ảnh/log ở backend/storage. Không chạy các test DB trên dữ liệu sản phẩm.

## Bắt đầu tuần 2

Mỗi thành viên cập nhật main đã tích hợp vào nhánh mình trước khi làm:

- TV1: API và giao diện sách/bản sách/danh mục.
- TV2: readers API và thẻ theo chính sách 12 tháng, dùng tài khoản fixture nền; không chờ API accounts TV4 cùng tuần.
- TV3: bộ tính phạt độc lập đọc chính sách, thử biên ngày và bồi thường; chưa tạo phiếu/thu tiền.
- TV4: accounts/nhân viên, password_hash, Auth/session/CSRF thật; không gọi ReaderService TV2 đang viết.

Giữ nguyên quy tắc chỉ dùng đầu ra người khác đã chốt trước tuần; demo tuần 1 không thay API tuần 2. README_TV2/3/4 giữ lịch sử sửa; các phần “còn chờ chốt” trước ngày 02/11 được thay bằng CHINH_SACH_B1.md.

## Cập nhật trang đầu — 02/11/2026

Ứng dụng mở bằng màn hình đăng nhập toàn trang, chỉ dựng menu sau khi đăng nhập mẫu thành công. Tài khoản mẫu được dùng chung giữa màn hình đầu và module tài khoản, không yêu cầu đăng nhập lần hai. Đăng xuất quay về đăng nhập; truy cập hash nội bộ khi chưa đăng nhập cũng quay về đăng nhập. Reload làm mất phiên mẫu trong bộ nhớ và yêu cầu đăng nhập lại. Đăng ký từ trang đầu có thể dùng ngay trong lượt chạy đó.

Đã kiểm tra mật khẩu sai/đúng, không có sidebar trước đăng nhập, chuyển trang sau đăng nhập, đăng xuất, đường dẫn nội bộ và reload trên Edge, cùng các thao tác B1. Đây vẫn là đăng nhập mô phỏng tuần 1; backend login/session nghiệp vụ thuộc tuần 2. Tag base-w1 giữ nguyên bản nghiệm thu ban đầu, cập nhật giao diện nằm trong commit tiếp theo trên main.
## Dọn giao diện — 02/11/2026

Đã bỏ liên kết prototype, trang khung chưa hoạt động và bảng kiểm tra kết nối khỏi bản web. Các đường dẫn HTML cũ không còn được phục vụ. Menu chỉ giữ Tổng quan, Độc giả/thẻ, Mượn/bàn giao, Khoản phạt và Tài khoản/nhân viên. Giao diện không còn nhãn tuần hoặc chú thích tiến độ; vẫn thông báo dữ liệu chạy thử sẽ đặt lại khi tải lại trang. Mã nguồn tạm ngưng và tài liệu lịch sử được giữ để phát triển tiếp.

## Ba loại tài khoản — 02/11/2026

User (`user`), Nhân viên thư viện (`librarian`), Admin (`admin`). Tài khoản chạy thử tương ứng: user / librarian / admin, mật khẩu 123456. Tự đăng ký luôn là User; chỉ Admin quản lý tài khoản và nhân viên. Giữ MSSV cho User theo phạm vi thư viện sinh viên. Phân quyền nghiệp vụ phía máy chủ vẫn cần triển khai cùng API thật.

Nâng cấp dữ liệu cũ: chạy `php database/migrations/002_three_roles.php` sau migration 001. Chuyển student thành user, staff thành librarian; giữ nguyên ID và dữ liệu liên kết. START_B1.ps1 tự chạy cả hai migration.

## Giao diện theo vai trò — 03/11/2026

- User: trang chủ độc giả, gửi và xem yêu cầu/sách mượn của mình, xem khoản phạt riêng, đổi mật khẩu. Không chọn mã độc giả, không duyệt/bàn giao/xác nhận phạt hoặc sửa hồ sơ người khác.
- Nhân viên thư viện: trang chủ nghiệp vụ, quản lý độc giả/thẻ, duyệt/bàn giao, xác nhận phạt; tài khoản cá nhân chỉ đổi mật khẩu.
- Admin: trang chủ quản trị, quản lý tài khoản/nhân viên và truy cập nghiệp vụ thư viện.

Menu, liên kết trang chủ và kiểm tra đường dẫn dùng cùng vai trò đăng nhập thử. Dữ liệu cá nhân được lọc theo liên kết độc giả trong bộ nhớ (user mẫu có mã 1, tài khoản mới có mã riêng); đây chưa phải cấp hồ sơ/thẻ thật. Quyền máy chủ và kiểm tra thẻ thật cần được triển khai cùng API, không coi ẩn nút là bảo mật backend.
