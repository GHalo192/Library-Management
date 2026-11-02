<?php
declare(strict_types=1);
// CLI-only, forward migration. Không DROP hoặc làm mất dữ liệu đang có.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$config = require __DIR__ . '/../../backend/bootstrap.php';
$pdo = Database::connection($config['db']);
$pdo->exec('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(80) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)');
$version = '001_b1_20261102';
$exists = $pdo->prepare('SELECT COUNT(*) FROM schema_migrations WHERE version = ?');
$exists->execute([$version]);
if ((int)$exists->fetchColumn() > 0) { echo "SKIP: $version already applied\n"; exit; }
// DDL có thể implicit commit; kiểm tra từng cột giúp chạy lại an toàn nếu bị ngắt.
$columns = [
    ['tai_khoan', 'ho_ten', 'VARCHAR(150) NULL'],
    ['tai_khoan', 'dien_thoai', 'VARCHAR(20) NULL'],
    ['nhan_vien', 'dien_thoai', 'VARCHAR(20) NULL'],
    ['nhan_vien', 'chuc_vu', 'VARCHAR(80) NULL'],
    ['nhan_vien', 'trang_thai', "ENUM('active','inactive') NOT NULL DEFAULT 'active'"],
];
$columnExists = $pdo->prepare('SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?');
foreach ($columns as [$table, $column, $type]) {
    $columnExists->execute([$table, $column]);
    if ((int)$columnExists->fetchColumn() === 0) $pdo->exec("ALTER TABLE `$table` ADD COLUMN `$column` $type");
}
$policies = [
    'damage_surcharge' => ['0', 'B1: không thu phụ phí mất/hỏng'],
    'compensation_value_source' => ['cover_price_or_verified_repair', 'Mất/hỏng không phục hồi: giá bìa; sửa được: chi phí được xác nhận <= giá bìa'],
    'overdue_day_method' => ['calendar_date_difference', 'Số ngày lịch sau hạn trả; đúng hạn bằng 0'],
    'card_duration' => ['12_months', '12 tháng lịch; kẹp về ngày cuối tháng nếu thiếu ngày tương ứng'],
    'business_timezone' => ['Asia/Ho_Chi_Minh', 'Múi giờ nghiệp vụ'],
    'login_identifier' => ['email_or_mssv', 'Email hoặc MSSV và mật khẩu'],
    'renewal_unit' => ['copy', 'Đếm theo từng bản sách'],
    'renewal_base' => ['previous_due_date', 'Cộng từ hạn trả hiện tại'],
    'compensation_overdue' => ['through_incident_date', 'Cộng quá hạn đến ngày xác nhận mất/hỏng; sau đó dừng'],
    'public_ebook_guest_access' => ['1', 'Khách được đọc eBook công khai; loại giới hạn cần phiên/quyền'],
    'ebook_period_start' => ['approved_at', '14 x 24 giờ từ thời điểm cấp quyền/duyệt'],
    'ebook_duplicate_request' => ['reuse_pending_or_active', 'Không tạo yêu cầu trùng khi còn chờ/còn quyền'],
    'notice_days_before_due' => ['2', 'Nhắc trước hạn 2 ngày'],
    'notice_hour_local' => ['09:00', 'Lịch nhắc theo múi giờ nghiệp vụ'],
    'notice_channel' => ['in_app', 'Thông báo trong ứng dụng; email chưa thuộc phạm vi B1'],
];
$pdo->beginTransaction();
try {
    $save = $pdo->prepare('INSERT INTO cau_hinh(khoa,gia_tri,mo_ta) VALUES (?,?,?) ON DUPLICATE KEY UPDATE gia_tri=VALUES(gia_tri),mo_ta=VALUES(mo_ta)');
    foreach ($policies as $key => [$value, $description]) $save->execute([$key, $value, $description]);
    $pdo->exec('UPDATE tai_khoan t LEFT JOIN doc_gia d ON d.tai_khoan_id=t.tai_khoan_id LEFT JOIN nhan_vien n ON n.tai_khoan_id=t.tai_khoan_id SET t.ho_ten=COALESCE(d.ho_ten,n.ho_ten) WHERE t.ho_ten IS NULL');
    $pdo->prepare('INSERT INTO schema_migrations(version) VALUES (?)')->execute([$version]);
    $pdo->commit();
} catch (Throwable $e) { if ($pdo->inTransaction()) $pdo->rollBack(); throw $e; }
echo "PASS: $version applied\n";
