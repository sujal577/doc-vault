Write-Host "=== Doc Vault port check ===" -ForegroundColor Cyan
foreach ($port in @(4000, 3000, 5432)) {
  $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($conn) {
    Write-Host "Port $port : LISTENING" -ForegroundColor Green
  } else {
    Write-Host "Port $port : NOT listening" -ForegroundColor Red
  }
}
