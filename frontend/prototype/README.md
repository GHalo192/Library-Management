# UniLib — Modular Frontend (HTML/CSS/JavaScript)

## Chạy trên VS Code
1. Mở thư mục `unilib-refactored` trong VS Code.
2. Dùng extension **Live Server**, nhấn Go Live trên `index.html`.
3. Đăng nhập với `student`, `librarian`, `staff`, hoặc `admin`, mật khẩu `123456`.
4. Để đổi vai trò, bấm **Đăng xuất** rồi đăng nhập lại.

> Cần chạy bằng HTTP/Live Server, không mở `file://`, vì dự án dùng JavaScript ES modules.

## Tổ chức source
- `index.html`: trang đăng nhập.
- `pages/<role>/*.html`: file HTML riêng cho từng màn hình.
- `assets/css/main.css`: design system, responsive.
- `assets/js/main.js`: shell, render UI và xử lý sự kiện. Đây là entry point dùng chung cho các trang.
- `assets/js/core/routes.js`: menu và quyền hiển thị theo vai trò.
- `assets/js/core/storage.js`: dữ liệu demo và LocalStorage.
- `assets/js/api/apiClient.js`: cấu hình endpoint, adapter mock/HTTP.
- `assets/js/api/services.js`: các nghiệp vụ mượn, trả, gia hạn, thêm/cập nhật sách.
- `docs/API_CONTRACT.md`: hợp đồng API đề xuất.
- `docs/UC_MATRIX.md`: ánh xạ Use Case với màn hình.

## Đổi sang Backend thật
1. Thống nhất API theo `docs/API_CONTRACT.md`.
2. Đổi `USE_MOCK=false`, cập nhật `API_BASE_URL` trong `assets/js/api/apiClient.js`.
3. Các hàm trong `services.js` đã có ví dụ nhánh HTTP; mở rộng cho các chức năng còn dùng dữ liệu demo trực tiếp.
4. Backend chịu trách nhiệm xác thực, phân quyền, kiểm tra tồn kho, tính tiền phạt, xử lý giao dịch; không tin dữ liệu do browser gửi.

## Phạm vi thực hiện
Đây là **bản frontend module hóa có dữ liệu demo**. Đã có nhiều màn hình và luồng tương tác cốt lõi, nhưng **chưa phải 45/45 UC hoàn thiện**, chưa tích hợp API, chưa upload ebook thật, chưa xác thực thật, chưa test end-to-end. Các màn hình nghiệp vụ nâng cao có thể mới là khung xem dữ liệu; xem `docs/UC_MATRIX.md`.
