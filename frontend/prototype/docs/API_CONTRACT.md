# API contract dự kiến (đề xuất, chưa phải API đã triển khai)

Base URL: `http://localhost:8080/api` (thay đổi theo backend). JSON UTF-8, thời gian ISO-8601, tiền tệ VNĐ dạng số nguyên.

| Method | Endpoint | Mục đích | UC |
|---|---|---|---|
| POST | /auth/login | Xác thực, trả user + token/phiên | 01 |
| GET | /books?search=&category= | Tra cứu, lọc sách | 03,08,13 |
| GET | /books/:id | Chi tiết sách | 13 |
| POST | /books | Thêm sách | 04,32 |
| PATCH | /books/:id | Cập nhật sách, tồn kho, vị trí | 33,35,36 |
| POST | /borrow-requests | Gửi đăng ký mượn | 02 |
| GET | /borrow-requests | Danh sách yêu cầu theo quyền | 30 |
| PATCH | /borrow-requests/:id/review | Duyệt/từ chối | 30 |
| GET | /loans | Danh sách phiếu mượn | 09,12,22 |
| POST | /loans | Thủ thư lập phiếu mượn | 24 |
| PATCH | /loans/:id/return | Xác nhận trả | 21 |
| POST | /renewals | Xin gia hạn | 10 |
| PATCH | /renewals/:id/review | Duyệt gia hạn | 25 |
| GET/POST | /fines | Xem/ghi nhận tiền phạt | 07,11,23,28 |
| PATCH | /fines/:id/payment | Ghi nhận thanh toán | 31 |
| GET | /ebooks | Danh mục ebook | 14,18,39 |
| GET | /ebooks/:id/content | Nội dung được cấp quyền | 14,17 |
| PUT | /ebooks/:id/progress | Lưu vị trí đọc | 17,19 |
| GET | /notifications | Thông báo | 20 |
| GET | /reports | Thống kê | 05,42 |
| GET/POST/PATCH | /accounts | Tài khoản, phân quyền | 44 |

Ví dụ tạo yêu cầu mượn:

```http
POST /api/borrow-requests
Content-Type: application/json
Authorization: Bearer <token>

{"bookId":"BK001"}
```

Phản hồi đề xuất:
```json
{"id":"REQ1002","bookId":"BK001","status":"PENDING","createdAt":"2026-10-21T06:00:00Z"}
```

Quy tắc: Backend phải kiểm tra quyền truy cập, tồn kho và điều kiện mượn ở thời điểm xử lý; frontend chỉ kiểm tra để hỗ trợ UX. Trạng thái trả về cần thống nhất (vd PENDING/APPROVED/REJECTED) trước khi tích hợp. Cần xử lý CORS nếu frontend/backend chạy khác cổng.
