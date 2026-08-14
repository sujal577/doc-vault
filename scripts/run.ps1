# One-shot local start for Doc Vault
# Usage: .\scripts\run.ps1
Set-Location $PSScriptRoot\..

Write-Host ""
Write-Host "=== Doc Vault start ===" -ForegroundColor Cyan

Write-Host "Checking Docker..." -ForegroundColor Cyan
docker info 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Start Docker Desktop first, then run this again." -ForegroundColor Red
  exit 1
}

Write-Host "Starting Postgres..." -ForegroundColor Cyan
docker compose up -d postgres
Start-Sleep -Seconds 4

$env:DATABASE_URL = "postgresql://docvault:docvault@localhost:5432/docvault"

Write-Host "Waiting for Postgres..." -ForegroundColor Cyan
for ($i = 1; $i -le 30; $i++) {
  docker compose exec -T postgres pg_isready -U docvault -d docvault 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) { break }
  Start-Sleep -Seconds 2
}

Write-Host "Building shared packages + migrate + seed..." -ForegroundColor Cyan
pnpm --filter @doc-vault/shared build
pnpm --filter @doc-vault/crypto build
pnpm db:generate
pnpm db:migrate
pnpm db:seed

Write-Host ""
Write-Host "Starting API + Web in new windows..." -ForegroundColor Cyan
$root = (Get-Location).Path
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "Set-Location '$root'; pnpm --filter @doc-vault/api dev")
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "Set-Location '$root'; pnpm --filter @doc-vault/web dev")

Write-Host ""
Write-Host "=== Ready ===" -ForegroundColor Green
Write-Host "Wait about 10 seconds, then open: http://localhost:3000"
Write-Host "Login: demo@docvault.local / demo1234"
Write-Host ""
Write-Host "Keep the two new PowerShell windows open."
