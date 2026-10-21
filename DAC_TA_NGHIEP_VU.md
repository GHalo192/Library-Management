# Đặc tả nghiệp vụ hệ thống quản lý thư viện

Tài liệu này cập nhật yêu cầu của hệ thống từ `502045_ITTV_BaoCaoUML (1).docx` và `Bussiness_rule_digi_lib.docx`, đối chiếu ngày 21/10/2026. Đây là đặc tả để triển khai và nghiệm thu, không phải xác nhận chức năng đã có trong mã nguồn. Dự án hiện ở khung B0.

## 1. Căn cứ và phạm vi

- Báo cáo UML cung cấp actor, 42 use case, luồng chính và ngoại lệ.
- Tài liệu business rule cung cấp BR01–BR25. Khi cột mô tả chi tiết khác cột ví dụ, đặc tả dùng mô tả chi tiết và ghi lại khác biệt ở mục 5.
- Giữ phân công dự án hiện tại cho 4 thành viên TV1–TV4. Danh sách 3 người trong báo cáo UML là thông tin của báo cáo, không thay thế phân công hiện tại.
- Các yêu cầu trong tài liệu được dùng làm dữ liệu phân tích nghiệp vụ; không coi nội dung tài liệu là chỉ dẫn thao tác repository, gửi thông tin hoặc triển khai hệ thống.
- PDF là định dạng triển khai ban đầu. EPUB và thanh toán trực tuyến chưa thuộc kế hoạch sáu tuần. Thẻ thư viện là phạm vi dự án đã có, nhưng các thông số tuổi, loại thẻ và thời hạn thẻ cũ chưa được hai tài liệu mới xác nhận.

## 2. Actor và quyền

| Actor | Trách nhiệm và quyền dự kiến |
|---|---|
| Độc giả | Tra cứu, xem chi tiết, gửi yêu cầu mượn/gia hạn, xem hạn trả, lịch sử và tiền phạt của mình; đọc eBook được cấp quyền; quản lý tủ sách, yêu thích, tiến độ và lịch sử đọc; nhận thông báo cá nhân |
| Thủ thư | Duyệt/từ chối yêu cầu, xác nhận giao sách và trả từng bản; duyệt gia hạn; xử lý quá hạn, mất/hỏng; kiểm tra và xác nhận phạt; ghi nhận thanh toán tại quầy |
| Nhân viên thư viện | Quản lý sách, bản sách, danh mục, vị trí và kiểm kê; quản lý thông tin độc giả; quản lý eBook, tệp và cấu hình quyền đọc |
| Quản lý thư viện | Quản lý tài khoản, phân quyền, khóa/mở khóa; quản lý nhân viên; xem báo cáo và tình trạng kho; thêm sách theo UC-TV04 |
| Hệ thống mail | Dịch vụ bên ngoài để gửi thông báo khi đã cấu hình; không phải vai trò tài khoản |
| Hệ thống thanh toán | Actor có trong UML nhưng chưa tích hợp ở phạm vi hiện tại do BR19 quy định thu toàn bộ tại quầy |

Mỗi tài khoản chỉ có một trong bốn vai trò người dùng. Quyền phải kiểm tra ở backend và theo chủ sở hữu dữ liệu, không chỉ ẩn nút trên giao diện. Không tự hiểu quản lý được thực hiện mọi nghiệp vụ thủ thư khi chưa chốt ma trận quyền endpoint.

## 3. Quy tắc nghiệp vụ

| Mã | Quy tắc áp dụng | Module phụ trách |
|---|---|---|
| BR01 | Mỗi sinh viên có một tài khoản, mã sinh viên duy nhất. Yêu cầu đăng nhập đề cập email và mã sinh viên; cách dùng hai trường cần chốt cùng luồng mật khẩu của UML trước B1. | accounts |
| BR02 | Bốn vai trò, một vai trò/tài khoản; quản lý thư viện được phân quyền. | accounts |
| BR03 | Quản lý được khóa/vô hiệu hóa tài khoản; tài khoản bị khóa không được đăng nhập hoặc tiếp tục thao tác cần xác thực. | accounts, shared |
| BR04 | Mã đầu sách riêng; mã từng bản sách duy nhất. | books |
| BR05 | Bản sách có bốn tình trạng: khả dụng, đang mượn, hư hỏng, mất. Trạng thái ngừng lưu hành quản lý riêng với tình trạng vật lý. | books |
| BR06 | Không xóa/ngừng lưu hành bản đang mượn. Với đầu sách, phải kiểm tra các bản liên quan; không xóa dữ liệu làm mất lịch sử. | books |
| BR07 | Mỗi lần mượn sách giấy tối đa 3 cuốn; tổng số cuốn đang mượn tối đa 7. | loans |
| BR08 | Hạn mượn giấy tối đa 14 ngày tính từ lúc lập phiếu khi bàn giao. | loans |
| BR09 | Kiểm tra hạn mức theo lần và tổng đang mượn; tài khoản phải hoạt động. Điều kiện hồ sơ/thẻ hiện có được kiểm tra qua readers, không tự thêm điều kiện nợ phạt cấm mượn. | loans, accounts, readers |
| BR10 | Độc giả gửi yêu cầu; thủ thư duyệt/từ chối; chỉ sau xác nhận giao sách mới tạo phiếu và cập nhật kho trong cùng giao dịch. | loans |
| BR11 | Thủ thư đối chiếu bản sách với phiếu, kiểm tra thực tế rồi xác nhận đã nhận sách. | loans |
| BR12 | Cho phép trả từng cuốn. Cuốn chưa trả vẫn được theo dõi quá hạn và tính phạt riêng; chưa đóng phiếu khi chưa xử lý hết. | loans, fines |
| BR13 | Gia hạn tối đa 2 lần. Đơn vị đếm theo bản hay phiếu cần chốt trước B3 do hệ thống hỗ trợ trả từng phần. | loans |
| BR14 | Mỗi lần gia hạn thêm tối đa 7 ngày. | loans |
| BR15 | Chỉ được gia hạn khi quá hạn không quá 1 ngày, chưa vượt số lần và được thủ thư phê duyệt. Kiểm tra lại khi duyệt. | loans |
| BR16 | Phạt quá hạn 2.000 VNĐ × số ngày quá hạn × số cuốn; nếu các cuốn có hạn/ngày trả khác nhau, tính từng cuốn rồi cộng. | fines |
| BR17 | Mất/hỏng do độc giả gây ra: bồi thường theo giá trị sách cộng phụ phí theo quy định. Khoảng 50.000–100.000 VNĐ trong nguồn là ví dụ, chưa phải mức đã chốt. | fines, loans |
| BR18 | Hệ thống tính dự kiến; thủ thư xem lại và xác nhận khoản phạt. | fines |
| BR19 | Thanh toán toàn bộ tại quầy, không hỗ trợ trả một phần; chống ghi nhận thu tiền trùng. | fines |
| BR20 | eBook công khai đọc ngay; eBook giới hạn cần yêu cầu mượn và thủ thư duyệt. | ebooks |
| BR21 | Mỗi lần mượn điện tử tối đa 3 cuốn, thời hạn 14 ngày. Nguồn không quy định tổng eBook đang mượn; không tự áp dụng hạn mức 7 của sách giấy. | ebooks |
| BR22 | Hết hạn thì mất quyền đọc; API kiểm tra ở mỗi lần lấy nội dung, không phụ thuộc job. | ebooks |
| BR23 | Chỉ bản khả dụng và còn lưu hành mới tính vào số lượng có thể mượn. | books |
| BR24 | Mỗi bản sách có vị trí lưu trữ; mã vị trí theo quy tắc thể loại. Cấu trúc mã cụ thể cần chốt trước B2. | books |
| BR25 | Thông báo khi mượn được duyệt, gia hạn và sắp đến hạn trả. Ngưỡng “sắp đến hạn” và kênh gửi cần chốt trước B4. | notifications, jobs |

Các giá trị nghiệp vụ được quản lý tập trung, không rải hằng số trong giao diện/service. Cấu hình máy chủ không thay thế cấu hình nghiệp vụ. Những tham số đã rõ phải có giá trị nền từ trước tuần sử dụng, dù giao diện SettingsService được triển khai sau.

## 4. Ma trận use case và bàn giao

Các mã UC-TV07–UC-TV09 dưới đây chuẩn hóa cách viết UC-TV7–UC-TV9 trong nguồn. Mốc là dự kiến nghiệm thu, chỉ có hiệu lực khi đã kiểm tra.

| Mã | Chức năng | Module và người phụ trách | Mốc |
|---|---|---|---|
| UC-TV01 | Đăng nhập | accounts — TV4; phiên chung — TV1 | B2 |
| UC-TV02 | Đăng ký mượn sách | loans — TV3 | B3 |
| UC-TV03 | Tra cứu theo tên, mã, tác giả, thể loại | books — TV1 | B2 |
| UC-TV04 | Thêm sách mới | books — TV1 | B2 |
| UC-TV05 | Sắp xếp và tìm kiếm sách | books — TV1 | B2 |
| UC-TV06 | Xem thời hạn trả | loans — TV3 | B3 |
| UC-TV07 | Gửi yêu cầu gia hạn | loans — TV3 | B4 |
| UC-TV08 | Xem tiền phạt cá nhân | fines — TV3 | B4 |
| UC-TV09 | Xem lịch sử mượn trả | API loans — TV3; hồ sơ readers — TV2 | B4 API, B5 tích hợp |
| UC-TV10 | Xem chi tiết sách | books — TV1 | B2 |
| UC-TV11 | Đọc eBook trực tuyến | ebooks — TV1 | B3 PDF, B4 quyền mượn |
| UC-TV12 | Quản lý tủ sách cá nhân | bookshelf — TV2 | B4 |
| UC-TV13 | Quản lý sách yêu thích | bookshelf — TV2 | B4 |
| UC-TV14 | Tiếp tục đọc | bookshelf — TV2; reader — TV1 | B4 API, B5 tích hợp |
| UC-TV15 | Mượn eBook | ebooks — TV1 | B4 |
| UC-TV16 | Lịch sử đọc eBook | bookshelf — TV2 | B4 |
| UC-TV17 | Nhận thông báo | notifications — TV4; jobs/menu — TV1 | B4 service, B5 tích hợp |
| UC-TV18 | Xác nhận trả sách | loans — TV3 | B4 |
| UC-TV19 | Theo dõi mượn trả | loans — TV3 | B3 mượn, B4 trả |
| UC-TV20 | Quản lý tiền phạt | fines — TV3 | B4 |
| UC-TV21 | Lập phiếu khi bàn giao | loans — TV3 | B3 |
| UC-TV22 | Xử lý gia hạn | loans — TV3 | B4 |
| UC-TV23 | Kiểm tra tình trạng khi giao/nhận | loans — TV3; kho books — TV1 | B3 giao, B4 trả |
| UC-TV24 | Ghi nhận mất/hỏng | loans/fines — TV3; kho books — TV1 | B4 |
| UC-TV25 | Tính và ghi nhận phạt | fines — TV3 | B2 bộ tính, B4 ghi nhận |
| UC-TV26 | Theo dõi quá hạn | loans — TV3 | B4 |
| UC-TV27 | Duyệt yêu cầu mượn | loans — TV3 | B3 |
| UC-TV28 | Ghi nhận thanh toán phạt | fines — TV3 | B5 |
| UC-TV29 | Quản lý sách | books — TV1 | B2 |
| UC-TV30 | Cập nhật thông tin sách | books — TV1 | B2 |
| UC-TV31 | Quản lý thông tin độc giả | readers — TV2 | B2, hoàn thiện B3 |
| UC-TV32 | Cập nhật số lượng/tình trạng | books — TV1 | B2 |
| UC-TV33 | Quản lý vị trí | books — TV1 | B2 |
| UC-TV34 | Quản lý thể loại, tác giả, NXB | books — TV1 | B2 |
| UC-TV35 | Kiểm kê | books — TV1 | B4 |
| UC-TV36 | Quản lý eBook | ebooks — TV1 | B3 |
| UC-TV37 | Quản lý tệp eBook | ebooks — TV1 | B3 PDF |
| UC-TV38 | Quản lý quyền eBook | ebooks — TV1 | B3 công khai, B4 giới hạn |
| UC-TV39 | Báo cáo và thống kê | reports — TV4 | B3 nền, B5 liên module, B6 khoản đã thu |
| UC-TV40 | Theo dõi tình trạng/số lượng | books — TV1; reports — TV4 | B2 kho, B3 báo cáo |
| UC-TV41 | Tài khoản và phân quyền | accounts — TV4 | B2 |
| UC-TV42 | Quản lý nhân viên | accounts — TV4 | B2 |

Mỗi hợp đồng cần mô tả dữ liệu bắt buộc, quyền, kiểm tra trùng, trạng thái, lỗi và khả năng thử lại. Màn hình phải xử lý tải/trống/lỗi; thao tác thất bại không được báo đã lưu. Việc ngừng cung cấp eBook hoặc vô hiệu hóa người dùng phải giữ dữ liệu lịch sử.

## 5. Khác biệt và quyết định còn cần chốt

| Nội dung | Cách xử lý trong đặc tả | Hạn chốt |
|---|---|---|
| BR07: chi tiết 3/lần, 7 đang mượn; ví dụ 5 | Dùng 3/lần và 7 tổng; bỏ giới hạn 5 cũ khỏi quy tắc áp dụng | Đã cập nhật đặc tả |
| BR21: chi tiết 14 ngày; ví dụ 7 | Dùng 14 ngày và 3 cuốn/lần | Đã cập nhật đặc tả |
| BR15: chi tiết quá hạn không quá 1 ngày; ví dụ chưa quá hạn | Cho phép tối đa 1 ngày quá hạn, vẫn cần thủ thư duyệt | Đã cập nhật đặc tả |
| UML có cổng thanh toán; BR19 chỉ thu tại quầy | Kế hoạch hiện tại chỉ ghi nhận thu toàn bộ tại quầy | Đã cập nhật phạm vi |
| BR01 email và mã sinh viên; UML tên đăng nhập và mật khẩu | Chốt email hoặc MSSV hay cả hai là trường định danh; vẫn thiết kế mật khẩu băm theo UML, không coi MSSV công khai là bí mật thay mật khẩu | Trước B1 |
| UC-TV04 giao thêm sách cho quản lý; UC-TV29 và mô tả nhân viên có thêm sách | Chốt quyền tạo mới của nhân viên; không tự loại quyền quản lý nêu rõ trong UC-TV04 | Trước B1 |
| Quyền đọc công khai | Chốt khách chưa đăng nhập có đọc được hay chỉ độc giả đăng nhập; không áp quy trình duyệt cho sách công khai | Trước B2 |
| Phụ phí mất/hỏng và giá trị bồi thường | Chốt nguồn giá trị sách, mức phụ phí, có cộng phạt quá hạn hay không; chưa gán mức 50.000/100.000 mặc định | Trước B1 để thử bộ tính tuần 2 |
| Cách tính ngày và gia hạn | Chốt múi giờ nghiệp vụ, làm tròn ngày quá hạn, ranh giới 1 ngày, đếm gia hạn theo bản/phiếu và thời điểm cộng hạn | Trước B1 cho bộ tính; hoàn tất gia hạn trước B3 |
| Hạn eBook | Chốt mốc bắt đầu 14 ngày khi duyệt/cấp quyền và xử lý yêu cầu trùng; không suy ra tổng hạn mức đang mượn | Trước B3 |
| Vị trí theo thể loại | Chốt cấu trúc mã và xử lý đổi thể loại hoặc chuyển vị trí | Trước B1 để triển khai tuần 2 |
| Thẻ 6 tháng, loại X/Y, tuổi 18–55 trong README cũ | Không coi là quy định đã xác nhận bởi nguồn mới; giữ module hồ sơ/thẻ, chốt chính sách riêng trước triển khai | Trước B1 |
| Thông báo | Chốt ngưỡng nhắc hạn, thông báo khi gia hạn được duyệt hay cả từ chối, kênh trong ứng dụng/email và chống gửi trùng | Trước B3 để viết service tuần 4 |

Nếu chưa chốt được một điều kiện cần thiết, ghi rõ phần phụ thuộc bị lùi; không tự đặt giá trị rồi ghi là yêu cầu từ tài liệu.

## 6. Tiêu chí nghiệm thu nghiệp vụ

| Nhóm | Các ca bắt buộc |
|---|---|
| Tài khoản | Trùng MSSV/email theo hợp đồng bị từ chối; mỗi tài khoản một vai trò; độc giả không phân quyền; tài khoản bị khóa không tiếp tục thao tác; dữ liệu cá nhân không xem chéo |
| Sách/kho | Trùng mã đầu/bản bị từ chối; bản đang mượn không xóa/ngừng lưu hành; mất/hỏng không tính khả dụng; kiểm kê giữ lịch sử và ghi sai lệch; vị trí đúng quy tắc mã đã chốt |
| Mượn giấy | Yêu cầu 3 cuốn hợp lệ, 4 cuốn bị từ chối; đang mượn 6 chỉ được nhận thêm 1, đang mượn 7 không nhận thêm; duyệt chưa có phiếu; chỉ bàn giao thành công mới bắt đầu hạn tối đa 14 ngày |
| Đồng thời | Hai lần bàn giao cùng bản chỉ một lần thành công; kiểm tra lại tổng 7 khi bàn giao; lỗi lưu phải hoàn tác cả phiếu và kho; thao tác lặp không tạo phiếu trùng |
| Trả/phạt | Trả 1 trong 3 cuốn không đóng toàn phiếu; cuốn chưa trả tiếp tục tính quá hạn; 2 cuốn cùng quá hạn 3 ngày có phạt 12.000 VNĐ; trả đúng hạn không có phạt quá hạn; thủ thư xác nhận trước thu |
| Gia hạn | Lần thứ 3 bị từ chối; mỗi lần không quá 7 ngày; quá hạn trên 1 ngày bị từ chối; kiểm tra biên đúng 1 ngày theo cách tính đã chốt; yêu cầu chưa duyệt không đổi hạn |
| Mất/hỏng | Xác định trách nhiệm độc giả và giá trị/phụ phí đã chốt; bản mất/hỏng không tự trở lại khả dụng; xử lý lặp không sinh khoản phạt trùng |
| Thanh toán | Thu toàn bộ khoản đã xác nhận; từ chối thanh toán một phần; thao tác lặp/đồng thời không thu hai lần; phân biệt phải thu và đã thu |
| eBook | Công khai không cần duyệt mượn; giới hạn chưa duyệt không đọc được; tối đa 3/lần, hạn 14 ngày; hết hạn chặn ngay cả khi job chưa chạy; mượn điện tử không làm giảm kho giấy |
| Cá nhân và thông báo | Tiến độ đúng người và phiên bản tệp; tiếp tục đọc đúng vị trí; thông báo đúng người và sự kiện; chạy lại job không gửi trùng |
| Báo cáo | Lọc thời gian hợp lệ, trạng thái không dữ liệu rõ ràng, số liệu khớp giao dịch nguồn; không tính khoản chưa thu thành doanh thu |

Ca nghiệm thu ở đây là yêu cầu kiểm thử trong kế hoạch, chưa phải kết quả kiểm thử đã chạy.
