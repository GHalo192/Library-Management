param(
  [int]$WebPort = 8080,
  [int]$DbPort = 13307,
  [string]$XamppPath = 'C:/xampp',
  [switch]$OpenBrowser
)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$storage = Join-Path $projectRoot 'backend/storage'
$dataDir = Join-Path $storage 'b1-mysql'
$dbName = 'ittv_b1_20261102_demo'
$php = Join-Path $XamppPath 'php/php.exe'
$mysql = Join-Path $XamppPath 'mysql/bin/mysql.exe'
$mysqld = Join-Path $XamppPath 'mysql/bin/mysqld.exe'
foreach ($binary in @($php,$mysql,$mysqld)) { if (-not (Test-Path -LiteralPath $binary)) { throw "Không tìm thấy $binary. Đặt lại -XamppPath." } }
if ($projectRoot.Contains(' ')) { throw 'Bản script demo yêu cầu đường dẫn dự án không có khoảng trắng. Dùng hướng dẫn chạy thủ công trong README_B1.md nếu cần.' }
New-Item -ItemType Directory -Force -Path $storage | Out-Null
$dbListener = Get-NetTCPConnection -State Listen -LocalPort $DbPort -ErrorAction SilentlyContinue
if ($dbListener) {
  $existing = Get-CimInstance Win32_Process -Filter "ProcessId=$($dbListener[0].OwningProcess)"
  if (-not $existing.CommandLine -or -not $existing.CommandLine.Replace('\','/').Contains($dataDir.Replace('\','/'))) { throw "Cổng DB $DbPort thuộc tiến trình khác. Dùng -DbPort khác; không sửa DB đang có." }
} else {
  if (-not (Test-Path -LiteralPath (Join-Path $dataDir 'mysql'))) {
    & (Join-Path $XamppPath 'mysql/bin/mysql_install_db.exe') "--datadir=$dataDir" "--port=$DbPort"
    if ($LASTEXITCODE -ne 0) { throw 'Khởi tạo MariaDB demo thất bại.' }
  }
  Start-Process -FilePath $mysqld -ArgumentList @('--no-defaults',"--basedir=$($XamppPath.Replace('\','/'))/mysql","--datadir=$($dataDir.Replace('\','/'))","--port=$DbPort",'--bind-address=127.0.0.1','--skip-name-resolve','--console') -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $storage 'b1-mysql.stdout.log') -RedirectStandardError (Join-Path $storage 'b1-mysql.stderr.log') | Out-Null
}
$connection = @('--protocol=TCP','--host=127.0.0.1',"--port=$DbPort",'--user=root')
$ready = $false
for ($attempt=0; $attempt -lt 30; $attempt++) {
  & $mysql @connection -e 'SELECT 1' *> $null
  if ($LASTEXITCODE -eq 0) { $ready=$true; break }
  Start-Sleep -Milliseconds 300
}
if (-not $ready) { throw 'MariaDB chưa sẵn sàng; xem log trong backend/storage.' }
$databaseExists = & $mysql @connection --batch --skip-column-names -e "SELECT COUNT(*) FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='$dbName'"
if ($LASTEXITCODE -ne 0) { throw 'Không kiểm tra được database.' }
if ($databaseExists -eq '0') {
  & $mysql @connection -e "CREATE DATABASE $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
  if ($LASTEXITCODE -ne 0) { throw 'Không tạo được database demo.' }
  Push-Location $projectRoot
  try {
    & $mysql @connection $dbName -e 'source database/schema.sql'
    if ($LASTEXITCODE -ne 0) { throw 'Nhập schema thất bại. Không tự xóa database để thử lại.' }
    & $mysql @connection $dbName -e 'source database/seed.sql'
    if ($LASTEXITCODE -ne 0) { throw 'Nhập seed thất bại. Không tự xóa database để thử lại.' }
  } finally { Pop-Location }
}
$env:DB_HOST='127.0.0.1'; $env:DB_PORT=[string]$DbPort; $env:DB_NAME=$dbName; $env:DB_USER='root'; $env:DB_PASSWORD=''; $env:SESSION_SECURE='0'
& $php (Join-Path $projectRoot 'database/migrations/001_b1.php')
if ($LASTEXITCODE -ne 0) { throw 'Migration B1 thất bại.' }
& $php (Join-Path $projectRoot 'database/migrations/002_three_roles.php')
if ($LASTEXITCODE -ne 0) { throw 'Migration vai trò thất bại.' }
$webListener=Get-NetTCPConnection -State Listen -LocalPort $WebPort -ErrorAction SilentlyContinue
if (-not $webListener) {
  Start-Process -FilePath $php -ArgumentList @('-S',"127.0.0.1:$WebPort",'-t', (Join-Path $projectRoot 'frontend'), (Join-Path $projectRoot 'backend/dev-router.php')) -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $storage "php-$WebPort.stdout.log") -RedirectStandardError (Join-Path $storage "php-$WebPort.stderr.log") | Out-Null
} else {
  $process=Get-CimInstance Win32_Process -Filter "ProcessId=$($webListener[0].OwningProcess)"
  if ($process.ExecutablePath -ne $php.Replace('/','\')) { throw "Cổng web $WebPort đang được dùng. Chọn -WebPort khác." }
  # Cùng chương trình PHP vẫn có thể phục vụ dự án khác; không dừng hay thay tiến trình đó.
  if (-not $process.CommandLine.Replace('\','/').Contains($projectRoot.Replace('\','/'))) { throw "Không xác nhận được PHP cổng $WebPort thuộc bản B1 này. Chọn -WebPort khác; không tự dừng tiến trình đang có." }
}
$url="http://127.0.0.1:$WebPort"
Write-Host "B1: $url — dữ liệu demo riêng tại $dataDir"
if ($OpenBrowser) { Start-Process $url }
