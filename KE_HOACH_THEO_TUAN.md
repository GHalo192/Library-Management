# Kế hoạch theo tuần — Làm độc lập theo bản nền tuần trước

Cập nhật ngày 21/10/2026 theo [đặc tả nghiệp vụ](DAC_TA_NGHIEP_VU.md), bao gồm UC-TV01–UC-TV42 và BR01–BR25. Đã bổ sung prototype để tái sử dụng giao diện theo từng module. Giữ phân công TV1–TV4 và trạng thái B0; các mốc dưới đây là kế hoạch, chưa phải chức năng đã triển khai. Cột quy tắc chi tiết được ưu tiên khi ví dụ trong tài liệu nguồn mâu thuẫn.

### Mốc thời gian áp dụng cho mọi tuần

| Thời điểm tương đối | Công việc và hạn bàn giao |
|---|---|
| Trước Ngày 1 | TV1 chốt nền đầu vào, SQL và API; nếu nền chưa đạt thì chưa bắt đầu việc phụ thuộc |
| Ngày 1–2 | Mỗi người thực hiện nhóm việc đầu trong bảng tiến độ của tuần |
| Ngày 3–4 | Hoàn thiện nhóm việc tiếp theo, chỉ dùng nền trước và code tự làm |
| Ngày 5 | Tự kiểm tra; cuối ngày nộp Pull request, cách thử và giới hạn; gửi nhu cầu SQL/API cho tuần sau |
| Ngày 6 | Kiểm tra chéo phần đã bàn giao; TV1 tích hợp từng Pull request và sửa file chung |
| Ngày 7 | Chạy luồng tích hợp/cài mới/nâng cấp; TV1 chốt nền mới hoặc ghi phần phải lùi |

Ngày 1–5 không yêu cầu chờ hoặc duyệt code đang viết của nhau. Ngày 6–7 là giai đoạn phối hợp được dự trù riêng. Các thời điểm là kế hoạch dự kiến, không phải công việc đã hoàn thành.

## 1. Quy tắc và bước chuẩn bị B0

**Trong tuần N, không chờ hoặc gọi phần người khác đang viết ở tuần N. Chỉ dùng đầu ra đã kiểm tra của tuần trước hoặc tự hoàn thành phần thuộc module mình.**

Trước tuần 1, TV1 ghi cấu trúc folder, quyền sửa file, tên trường dự kiến và định dạng route/API; mọi người thống nhất nhu cầu chức năng. Tạo repository tối thiểu B0 để mỗi người có cùng điểm xuất phát. B0 có prototype chạy độc lập bằng dữ liệu mẫu; khung ứng dụng chính chưa cần hoạt động. TV1 đưa prototype vào main qua PR và kiểm tra trước khi nhóm dùng làm đầu vào; chỉ push trên tv1 chưa tạo thành nền chung.

Cuối mỗi tuần có khoảng thời gian tích hợp riêng: bàn giao → kiểm tra chéo → TV1 sửa file chung/SQL cần thiết → kiểm tra PR vào main → gộp từng phần đạt → kiểm tra bản tích hợp → phát hành nền mới nếu đạt. Không coi thời gian kiểm tra tích hợp là không cần thiết chỉ vì các thành viên làm độc lập trong tuần.

Mọi file chung do TV1 sửa: khởi động/route tổng/shared/cấu hình, database, jobs, thư viện/công cụ, README và kế hoạch. TV2–TV4 gửi đề xuất qua Pull request/trao đổi, không tự sửa file chung. TV4 vẫn sở hữu accounts/notifications/reports, TV2 sở hữu readers/bookshelf, TV3 sở hữu loans/fines; TV1 sở hữu books/ebooks.

### Quy định thực hiện 4 điểm đã thống nhất

- **Ranh giới TV2/TV3:** TV2 viết hồ sơ/thẻ và giao diện lịch sử trong readers; TV3 viết API và truy vấn lịch sử mượn/trả trong loans. TV3 hoàn tất và bàn giao API lịch sử vào B4; TV2 dùng B4 để hiển thị trong tuần 5. Lịch sử đọc điện tử thuộc bookshelf của TV2.
- **Thiết kế và tự kiểm tra:** mỗi thành viên chuẩn bị bảng/trường/khóa, hợp đồng API, dữ liệu mẫu và ca kiểm tra cho phần mình. Chậm nhất Ngày 5 tuần trước, gửi thiết kế đầu vào cần cho tuần sau; Ngày 6–7 TV1 xem xét, trực tiếp tạo/cập nhật SQL và file chung, rồi kiểm tra để chốt nền. Đề xuất chưa được đưa vào nền không được coi là đã sẵn sàng.
- **Ưu tiên:** tuần 1–2 ưu tiên khung, xác thực, sách và thẻ; tuần 3–4 ưu tiên mượn/trả/phạt và đọc PDF. TV4 chỉ làm báo cáo nền đơn giản khi phần tài khoản đã đạt; báo cáo liên module/xuất tệp nằm ở tuần 5–6 khi dữ liệu nguồn đã có. Nếu thiếu thời gian, lùi báo cáo nâng cao trước, không bỏ xác thực hay chức năng đọc PDF đã nhận.
- **Kiểm tra định kỳ:** Ngày 1–5 mỗi người tự kiểm tra; Ngày 6 kiểm tra chéo; Ngày 7 kiểm tra bản tích hợp và điều kiện nền. Không yêu cầu thành viên chờ đầu ra đang viết của nhau trong Ngày 1–5, cũng không dồn kiểm thử đến tuần cuối.

### Quy trình tái sử dụng giao diện xuyên suốt kế hoạch

- Tuần 1 chuyển màn hình ưu tiên; tuần 2–4 chuyển tiếp theo chức năng, bổ sung phần thiếu và nối API. Giao diện có sẵn không thay thế thiết kế dữ liệu, backend hoặc kiểm thử.
- TV1 quản lý prototype tham khảo; cả nhóm không cùng sửa main.js của bộ mẫu. Mỗi người chuyển phần hiển thị/xử lý vào module mình. Các HTML trong pages chủ yếu là vỏ nạp JavaScript, chỉ chép HTML là chưa đủ.
- Tuần 1 thử độc lập theo quy ước B0, không chờ khung TV1 đang viết. Từ tuần 2 dùng khung B1 đã nghiệm thu; không tạo menu/API client riêng cho sản phẩm.
- Tài liệu prototype/docs và dữ liệu mẫu chỉ để tham khảo. Chủ module đối chiếu UC-TV01–UC-TV42, BR01–BR25; TV1 tổng hợp màn hình đích, chủ sở hữu và trạng thái nghiệm thu trong tài liệu chính thức.
- Bắt buộc sửa khác biệt: duyệt không tạo phiếu/trừ tồn; hạn mượn tối đa 14 ngày thay tối thiểu 7 ngày của demo; gia hạn/phạt/quyền đọc do backend kiểm tra; PDF thật thay văn bản mẫu.
- API chưa có trong nền thì thử giao diện bằng dữ liệu riêng và ghi rõ trạng thái. API đã có thì bỏ luồng mô phỏng trong module; không chỉ đổi USE_MOCK rồi coi là hoàn thành.
- Cuối tuần kiểm tra thao tác, tải/trống/lỗi, quyền và nghiệp vụ. Không đánh dấu B1–B6 hoàn thành chỉ vì đã có màn hình.

## 2. Ma trận đầu ra nền

| Mốc đã kiểm tra | Nội dung bắt buộc để tuần sau dùng |
|---|---|
| B0 | Folder, quy ước tên/API/route, phạm vi sửa và prototype tham khảo đã bàn giao; chưa có nghiệp vụ thật |
| B1 — cuối tuần 1 | Khung chạy, API client/router/PDO/phiên, schema + dữ liệu thử cho tuần 2, giao diện ưu tiên đã tách về module, thử độc lập và đối chiếu use case |
| B2 — cuối tuần 2 | API sách/bản sách, kiểm tra thẻ/hồ sơ, đăng nhập/tài khoản, bộ tính phạt độc lập; schema cho eBook và mượn giấy |
| B3 — cuối tuần 3 | PDF có quyền và metadata phiên bản; yêu cầu/duyệt/bàn giao; hồ sơ/thẻ hoàn chỉnh; cấu hình và báo cáo dữ liệu nền |
| B4 — cuối tuần 4 | API tủ sách/tiến độ, trả/gia hạn/phạt và API lịch sử mượn/trả có phân quyền, quyền mượn eBook, service thông báo; đủ dữ liệu cho tuần 5 |
| B5 — cuối tuần 5 | Trình đọc nối tiến độ, lịch sử cá nhân, thu tiền, nhắc hạn và báo cáo tích hợp |
| B6 — cuối tuần 6 | Bản đã kiểm tra toàn bộ, hướng dẫn cài/chạy và giới hạn được ghi nhận |

B là mốc logic; có thể dùng tag base-w1…base-w6. Mốc không phát hành chỉ vì đã hết tuần. Nếu B3 thiếu metadata eBook, không giao TV2 việc phụ thuộc metadata đó ở tuần 4; đổi việc độc lập hoặc lùi lịch.

## 3. Tuần 1 — Tiếp nhận giao diện, xây khung và tách màn hình ưu tiên

**Chốt yêu cầu cho B1:** TV4 đề xuất cách đăng nhập email/MSSV và mật khẩu, bốn vai trò và quyền khóa/phân quyền (BR01–BR03); TV1 chốt quyền thêm sách giữa quản lý/nhân viên và mã vị trí theo thể loại. TV2 đề xuất chính sách thẻ, không mặc định tuổi 18–55, loại X/Y hoặc hạn 6 tháng. TV3 đề xuất cách tính ngày, giá trị bồi thường và phụ phí để kiểm tra bộ tính ở tuần 2. TV1 đưa các thông số đã rõ (3/lần, 7 đang mượn, 14 ngày, 2 lần gia hạn, 7 ngày/lần, 2.000 VNĐ/cuốn/ngày, eBook 3/lần trong 14 ngày) vào thiết kế cấu hình nền; không chờ giao diện cấu hình tuần 3.

**Đầu vào duy nhất: B0. Không cần code mới của nhau trong tuần.**

| Người | Frontend | Backend/dữ liệu | Tự kiểm tra và bàn giao |
|---|---|---|---|
| TV1 | Tách bố cục/CSS mẫu vào shared; xây index.html, app.js, config.js và mẫu nạp module | Khung PHP, PDO, response/lỗi, cơ chế phiên/quyền dùng chung; schema/seed đủ cho tuần 2 | Trang đầu vào, API kiểm tra, kết nối DB; cấu hình môi trường và hướng dẫn chạy |
| TV2 | Chuyển staff/readers vào readers; bổ sung form hồ sơ/thẻ, thử bằng dữ liệu riêng | Soạn trường dữ liệu/điều kiện thẻ gửi TV1; chưa cần API đang viết của ai | Trường bắt buộc, danh sách trống, lỗi nhập; gửi giao diện độc lập và nhu cầu SQL |
| TV3 | Tách màn hình student/librarian vào loans/fines; sửa luồng mẫu thành yêu cầu → duyệt → bàn giao, thử độc lập | Mô tả trạng thái/điều kiện và bảng đề xuất | Thử luồng màn hình, trạng thái và dữ liệu sai; không coi là mượn thật |
| TV4 | Tách đăng nhập và admin/accounts, employees vào accounts; bổ sung đăng ký/đổi mật khẩu còn thiếu | Soạn hợp đồng xác thực/tài khoản, đề xuất bảng và dữ liệu thử | Thử form và lỗi; không cần phiên thật từ TV1 để tự thử UI |

## 4. Tuần 2 — Các module nền không gọi nhau

**Nghiệm thu B2:** kiểm tra mã đầu sách/bản sách duy nhất, bốn tình trạng và ngăn xóa/ngừng lưu hành bản đang mượn (BR04–BR06); chỉ bản khả dụng còn lưu hành tính vào tồn, vị trí theo mã thể loại đã chốt (BR23–BR24). Tài khoản một vai trò, MSSV duy nhất, khóa có hiệu lực và kiểm tra quyền backend. Bộ tính phạt thử 2 cuốn × 3 ngày × 2.000 = 12.000 VNĐ, đúng hạn bằng 0; phần bồi thường chỉ nghiệm thu khi đã chốt phụ phí và nguồn giá trị sách. Chốt khách chưa đăng nhập có đọc eBook công khai hay không để tuần 3 triển khai.

**Đầu vào: B1.**

| Người | Frontend | Backend | Không phụ thuộc cùng tuần |
|---|---|---|---|
| TV1 | Chuyển catalog, quản lý sách/danh mục vào books; bổ sung từng bản sách và nối API của mình | API CRUD và tra cứu; thao tác kho và cập nhật có điều kiện cho tuần 3 | Dùng schema/fixture B1, không chờ tài khoản hoặc thẻ mới |
| TV2 | Nối readers với API của chính mình | Hồ sơ/thẻ, kiểm tra hiệu lực; dùng tài khoản mẫu B1 | Không gọi AccountService TV4 đang viết |
| TV3 | Hoàn thiện fines với công cụ xem trước phép tính; loans tiếp tục chuẩn bị giao diện | Bộ tính phạt độc lập nhận ngày/vi phạm/chính sách, chưa tạo phiếu/thu tiền; tự kiểm tra biên ngày/tiền | Không chờ API sách hoặc thẻ; chưa làm bàn giao thật |
| TV4 | Nối accounts với API của chính mình | Đăng nhập/đăng xuất, mật khẩu, tài khoản/nhân viên; dùng cơ chế phiên B1 | Không gọi ReaderService mới; đăng ký tạo tài khoản chờ hồ sơ |

## 5. Tuần 3 — Dùng sách/thẻ/tài khoản có sẵn

**Nghiệm thu B3:** mượn giấy tối đa 3 cuốn/lần, 7 cuốn đang mượn, hạn tối đa 14 ngày; duyệt chưa tạo phiếu, bàn giao mới tạo phiếu và giảm tồn trong cùng giao dịch (BR07–BR10). Thử hai yêu cầu cùng bản cuối, kiểm tra lại tổng đang mượn lúc giao và hoàn tác khi lưu lỗi. eBook công khai đọc không qua duyệt; eBook giới hạn chưa có quyền phải bị chặn. Trước khi chốt B3, thống nhất đếm gia hạn theo bản/phiếu, mốc cộng hạn, mốc bắt đầu quyền eBook 14 ngày và ngưỡng/kênh thông báo cho tuần 4.

**Đầu vào: B2.**

| Người | Frontend | Backend | Phụ thuộc đã có |
|---|---|---|---|
| TV1 | Chuyển màn hình vào ebooks; thay trình đọc văn bản mẫu bằng upload/đọc PDF thật có quyền | Metadata, phiên bản tệp, quyền đọc trực tiếp và truyền nội dung riêng tư | Sách và xác thực B2; chưa nối tiến độ của TV2 |
| TV2 | Hoàn thiện hồ sơ cá nhân và thẻ | Liên kết hồ sơ với tài khoản, kiểm tra quyền dữ liệu; làm sạch trường hợp biên | Tài khoản B2; chưa làm tủ sách dựa vào eBook mới |
| TV3 | Nối loans với API yêu cầu/duyệt/bàn giao; bỏ cập nhật tồn và phiếu qua LocalStorage | Kiểm tra thẻ/hạn mức, tạo phiếu lúc giao, cập nhật kho cùng transaction | Sách/thẻ/xác thực B2; không chờ thông báo mới |
| TV4 | Chuyển dashboard/báo cáo mẫu vào reports, dùng dữ liệu nền thật; bổ sung form chính sách | Truy vấn dữ liệu nền và SettingsService; hoàn thiện accounts nếu cần | Bảng/API B2; chưa báo cáo phiếu đang được TV3 xây |

## 6. Tuần 4 — Tủ sách, trả sách và thông báo độc lập

**Nghiệm thu B4:** trả từng bản, không đóng phiếu còn sách chưa xử lý; gia hạn tối đa 2 lần, thêm tối đa 7 ngày/lần, quá hạn không quá 1 ngày và phải được thủ thư duyệt (BR11–BR15). Mất/hỏng không tự về khả dụng; thủ thư xác nhận khoản phạt hệ thống tính (BR16–BR18). eBook giới hạn có yêu cầu và màn hình thủ thư duyệt, tối đa 3 cuốn/lần, quyền 14 ngày theo mốc đã chốt, hết hạn bị chặn ngay tại API (BR20–BR22). TV4 kiểm tra service thông báo bằng sự kiện mẫu duyệt mượn/gia hạn/nhắc hạn, không gọi module mới của người khác trong tuần (BR25).

**Đầu vào: B3.**

| Người | Frontend | Backend | Phụ thuộc đã có |
|---|---|---|---|
| TV1 | ebooks: mượn điện tử, hiển thị hạn/quyền; books: kiểm kê | Quyền mượn có hạn, thu hồi, kiểm kê; chưa tích hợp tiến độ đang viết | Metadata/PDF B3 |
| TV2 | Chuyển shelf/favorites/reading-history vào bookshelf, nối API riêng; bổ sung dấu trang và trang thử tiến độ | API lưu/lấy tiến độ và lịch sử đọc gắn phiên bản; tự thử bằng API/màn hình của mình | Metadata/tệp B3; không cần TV1 sửa reader.js tuần này |
| TV3 | loans: trả/gia hạn/quá hạn; fines: xác nhận phạt | Trả từng bản, gia hạn, mất/hỏng; dùng bộ tính B2 để ghi phạt chống trùng; hoàn thiện API lịch sử mượn/trả có lọc và phân quyền | Phiếu/bàn giao B3 |
| TV4 | Chuyển notifications vào module, thay dữ liệu mẫu bằng API; báo cáo yêu cầu/bàn giao | Service tạo/xem/đánh dấu thông báo; thống kê từ phiếu đã có; thử thông báo bằng fixture sự kiện B3 | Yêu cầu/phiếu B3; chưa gọi trả/phạt mới |

## 7. Tuần 5 — Nối các chức năng đã hoàn thành

**Nghiệm thu B5:** chỉ thu toàn bộ khoản phạt đã xác nhận tại quầy, từ chối trả một phần, chống thu trùng và không tích hợp cổng thanh toán (BR19). Nối thông báo duyệt mượn, gia hạn và sắp đến hạn vào nghiệp vụ đã bàn giao; chạy lại job không tạo thông báo trùng. Kiểm tra tiến độ, yêu thích, lịch sử đọc theo tài khoản/phiên bản và lịch sử mượn theo quyền chủ sở hữu. Báo cáo phân biệt khoản phải thu với khoản đã thu; dữ liệu thanh toán mới chỉ dùng cho báo cáo ở tuần 6.

**Đầu vào: B4.**

Rà soát module đã chuyển: không còn đọc/ghi kho, phiếu, phạt hoặc quyền người dùng qua LocalStorage trong luồng sản phẩm. Prototype giữ riêng để tham khảo; không import mã từ prototype vào module chính. Kiểm tra tải, trống, lỗi API và hết phiên.

| Người | Frontend | Backend/file liên quan | Phụ thuộc đã có |
|---|---|---|---|
| TV1 | Nối reader.js với tiến độ/dấu trang; tích hợp menu chung | Tạo jobs nhắc hạn/hết hạn bằng service nguồn; điều phối shared | Tiến độ TV2, trả/phạt TV3, thông báo TV4 đều thuộc B4 |
| TV2 | Lịch sử mượn/trả cá nhân; hoàn thiện tủ sách | Dùng API lịch sử của TV3 trong B4; không viết lại truy vấn/bảng giao dịch; kiểm tra chủ dữ liệu/phiên bản; cung cấp dữ liệu đọc cho báo cáo | Không cần thay đổi reader.js của TV1 tuần này |
| TV3 | fines/payment.html: thu tiền và lịch sử thanh toán | Ghi nhận thu tiền chống trùng; tự kiểm tra các luồng hoàn tác/đồng thời | Khoản phạt B4 |
| TV4 | Báo cáo trả/quá hạn/phạt/đọc điện tử, xuất tệp | Truy vấn dữ liệu B4; hoàn thiện thông báo | Báo cáo tiền phạt đã ghi nhận, chưa yêu cầu báo cáo khoản thu mới tuần 5 |

## 8. Tuần 6 — Ổn định và bàn giao

**Nghiệm thu B6:** đối chiếu đủ 42 use case trong mục 4 và các ca kiểm tra ở mục 6 của đặc tả. Ghi rõ use case đạt, bị lùi hoặc chỉ đạt một phần (PDF trước EPUB, service trước tích hợp). Kiểm tra các biên 3/4 cuốn mỗi lần, tổng 7/8, gia hạn lần 2/3, quá hạn đúng/trên 1 ngày, quyền eBook trước/sau hết hạn, trả từng phần, bàn giao và thu tiền đồng thời. Không đánh dấu hoàn thành phần còn thiếu chính sách ở mục 5 của đặc tả.

**Đầu vào: B5.**

Demo và ảnh báo cáo lấy từ ứng dụng đã nối backend; ghi rõ phần còn mô phỏng. Bản triển khai sản phẩm bỏ liên kết demo và không phục vụ prototype; có thể giữ bản mẫu trong mã nguồn. Đối chiếu đủ 42 UC chính thức, không dùng bảng 45 UC của prototype để thay nghiệm thu.

| Người | Phần riêng thực hiện | Kết quả |
|---|---|---|
| TV1 | Sửa books/ebooks và file chung; chốt SQL/cấu hình/tài liệu; kiểm tra nâng cấp và cài mới | Bản triển khai, hướng dẫn, dữ liệu demo và danh sách giới hạn |
| TV2 | Sửa readers/bookshelf; kiểm tra mất quyền, sai phiên bản, hồ sơ/thẻ; gửi nhận xét hướng dẫn | Module cá nhân ổn định và kết quả tự kiểm tra |
| TV3 | Sửa loans/fines; thử giao/trả/thu lặp, tranh chấp bản cuối, lỗi lưu dữ liệu | Bằng chứng bảo toàn dữ liệu và các lỗi đã sửa |
| TV4 | Sửa accounts/notifications/reports; thêm báo cáo đã thu nếu cần từ dữ liệu B5 | Báo cáo khớp nguồn, đúng quyền, không trộn số phải thu và đã thu |

## 9. Nhánh và lịch tích hợp
### Các nhánh cố định

| Nhánh | Người phụ trách | Mục đích |
|---|---|---|
| main | TV1 quản lý | Nhánh chính, chứa code đã kiểm tra và tích hợp |
| tv1 | TV1 — trưởng nhóm | File chung, SQL, cấu hình, tài liệu, sách và eBook |
| tv2 | TV2 | Độc giả, thẻ thư viện và tủ sách |
| tv3 | TV3 | Mượn, trả, gia hạn và tiền phạt |
| tv4 | TV4 | Tài khoản, nhân viên, thông báo và báo cáo |

### Làm việc trong tuần

1. Đầu tuần, TV1 xác nhận bản main ổn định dùng làm nền.
2. Mỗi thành viên cập nhật bản main đã chốt vào nhánh của mình.
3. Trong tuần, viết code, tự kiểm tra, commit và push trên nhánh cố định.
4. Không lấy code đang viết của người khác làm đầu vào trong cùng tuần.
5. Chỉ TV1 trực tiếp sửa file dùng chung; thành viên khác gửi đề xuất.
6. Cuối tuần, mở Pull Request từ nhánh thành viên vào main.

### Kiểm tra và gộp cuối tuần

1. Mỗi người bàn giao phần đã tự kiểm tra, ghi bản nền sử dụng, file thay đổi, màn hình nguồn/đích, UC tương ứng, API thật hay dữ liệu mẫu, cách chạy và lỗi còn lại.
2. Người liên quan xem pull request. pull request của TV1 cũng cần thành viên khác xem lại.
3. TV1 sắp xếp thứ tự gộp theo phụ thuộc. Nếu cần SQL/cấu hình để chức năng chạy, TV1 chuẩn bị thay đổi tương thích trước; không gộp chức năng đang thiếu điều kiện chạy.
4. Trước mỗi lần gộp, cập nhật main hiện tại vào nhánh sắp được gộp, xử lý xung đột và kiểm tra lại phần bị ảnh hưởng.
5. Khi pull request đạt yêu cầu, TV1 gộp vào main bằng Create a merge commit.
6. Sau mỗi lần gộp, chạy lại chức năng vừa thêm và các luồng liên quan. Nếu có lỗi, ưu tiên sửa hoặc hoàn tác thay đổi gây lỗi trước khi gộp tiếp.
7. Sau khi tích hợp các phần đạt yêu cầu, cả nhóm kiểm tra luồng tổng thể và cơ sở dữ liệu.
8. TV1 cập nhật README và tạo tag như base-w1, base-w2 để đánh dấu bản nền cuối tuần đã kiểm tra.

Trong giai đoạn tích hợp cuối tuần, các thành viên không tự lấy trạng thái main đang thay đổi làm nền mới. Chờ TV1 xác nhận bản đã kiểm tra.

### Bắt đầu tuần tiếp theo

- Mỗi người cập nhật bản main đã chốt vào nhánh cố định của mình.
- Tiếp tục làm trên đúng nhánh của mình; không cần tạo lại nhánh.
- Nếu phần tuần trước chưa được gộp, ghi rõ và xử lý trước khi đưa thêm thay đổi vào pull request tiếp theo.
- Nếu bản tích hợp chưa đạt, chưa tạo tag nền mới; sửa lỗi hoặc điều chỉnh công việc phụ thuộc.

### Quy định tránh xung đột

- Không push trực tiếp vào main; mọi thay đổi đi qua pull request.
- Không force-push main hoặc tự ý viết lại lịch sử các nhánh.
- Thống nhất dùng Create a merge commit; không dùng squash/rebase merge tùy tiện với các nhánh được tái sử dụng.
- Không bật tự động xóa nhánh thành viên sau khi gộp.
- TV1 tách thay đổi file chung và nghiệp vụ sách/eBook thành các commit rõ mục đích.
- Khi pull request đang được kiểm tra, chỉ bổ sung sửa lỗi hoặc thay đổi thuộc phần bàn giao, chưa đẩy việc tuần sau vào cùng pull request.
- Tag chỉ đánh dấu phiên bản, không phải nhánh mới và không tự ngăn lỗi.
- Git gộp thành công không đồng nghĩa ứng dụng chạy đúng; luôn kiểm tra sau khi gộp.
