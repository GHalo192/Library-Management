<?php
declare(strict_types=1);
$config = require dirname(__DIR__) . '/bootstrap.php';
if (!str_ends_with($config['db']['name'], '_test')) throw new RuntimeException('Chỉ dùng DB _test.');
$pdo = Database::connection($config['db']);
$policies = $pdo->query('SELECT khoa,gia_tri FROM cau_hinh')->fetchAll(PDO::FETCH_KEY_PAIR);
$expected = ['damage_surcharge'=>'0','business_timezone'=>'Asia/Ho_Chi_Minh','login_identifier'=>'email_or_mssv','card_duration'=>'12_months','overdue_day_method'=>'calendar_date_difference','renewal_unit'=>'copy','renewal_base'=>'previous_due_date','public_ebook_guest_access'=>'1','notice_days_before_due'=>'2','notice_channel'=>'in_app'];
foreach ($expected as $key=>$value) if (($policies[$key]??null)!==$value) throw new RuntimeException('Sai chính sách '.$key);
if (count(array_filter($policies, static fn($v)=>$v===null))!==0) throw new RuntimeException('Còn chính sách NULL');
if ((int)$pdo->query("SELECT COUNT(*) FROM schema_migrations WHERE version='001_b1_20261102'")->fetchColumn()!==1) throw new RuntimeException('Migration marker sai');
if ((int)$pdo->query('SELECT COUNT(*) FROM tai_khoan')->fetchColumn()!==4) throw new RuntimeException('Mất dữ liệu seed');
if ($pdo->query('SELECT ho_ten FROM tai_khoan WHERE tai_khoan_id=1')->fetchColumn()!=='Sinh viên mẫu') throw new RuntimeException('Không bảo toàn hồ sơ');
$pdo->beginTransaction();
try {
    $pdo->exec("UPDATE nhan_vien SET dien_thoai='0912345678',chuc_vu='Thủ thư',trang_thai='inactive' WHERE nhan_vien_id=1");
    if ($pdo->query('SELECT trang_thai FROM nhan_vien WHERE nhan_vien_id=1')->fetchColumn()!=='inactive') throw new RuntimeException('Thiếu trường nhân viên');
} finally { $pdo->rollBack(); }
echo "PASS: B1 policies, migration marker, preserved seed and employee schema\n";
