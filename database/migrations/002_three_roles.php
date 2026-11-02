<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$config = require __DIR__ . '/../../backend/bootstrap.php';
$pdo = Database::connection($config['db']);
$pdo->exec('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(80) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)');
$version = '002_three_roles';
$exists = $pdo->prepare('SELECT COUNT(*) FROM schema_migrations WHERE version = ?');
$exists->execute([$version]);
if ((int)$exists->fetchColumn() > 0) { echo "SKIP: $version already applied\n"; exit; }
// Mở rộng enum trước khi chuyển dữ liệu; các bước có thể chạy lại nếu bị ngắt.
$pdo->exec("ALTER TABLE tai_khoan MODIFY vai_tro ENUM('student','user','librarian','staff','admin') NOT NULL");
$pdo->exec("UPDATE tai_khoan SET vai_tro = 'user' WHERE vai_tro = 'student'");
$pdo->exec("UPDATE tai_khoan SET vai_tro = 'librarian' WHERE vai_tro = 'staff'");
$pdo->exec("ALTER TABLE tai_khoan MODIFY vai_tro ENUM('user','librarian','admin') NOT NULL");
$pdo->prepare('INSERT INTO schema_migrations(version) VALUES (?)')->execute([$version]);
echo "PASS: $version applied\n";
