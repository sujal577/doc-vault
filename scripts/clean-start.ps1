# Clean reset: stop containers, wipe DB volume, start Postgres, migrate + seed.
# Does NOT delete your source code.
Set-Location $PSScriptRoot\..

Write-Host ""
Write-Host "=== Doc Vault clean start ===" -ForegroundColor Cyan
Write-Host "This will DELETE the local Postgres data volume." -ForegroundColor Yellow
Write-Host ""

Write-Host "1) Checking Docker..." -ForegroundColor Cyan
docker info 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker Desktop is NOT running." -ForegroundColor Red
  Write-Host "Open Docker Desktop, wait until it says Running, then run this script again."
  exit 1
}
Write-Host "   Docker OK" -ForegroundColor Green

Write-Host "2) Stopping old containers + wiping DB volume..." -ForegroundColor Cyan
docker compose down -v
Write-Host "   Done" -ForegroundColor Green

Write-Host "3) Starting Postgres only..." -ForegroundColor Cyan
docker compose up -d postgres
if ($LASTEXITCODE -ne 0) {
  Write-Host "Failed to start Postgres." -ForegroundColor Red
  exit 1
}

Write-Host "4) Waiting for Postgres..." -ForegroundColor Cyan
$ready = $false
for ($i = 1; $i -le 40; $i++) {
  docker compose exec -T postgres pg_isready -U docvault -d docvault 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 2
  Write-Host "   still waiting ($i)..."
}
if (-not $ready) {
  Write-Host "Postgres did not become ready. Run: docker compose logs postgres" -ForegroundColor Red
  exit 1
}
Write-Host "   Postgres ready" -ForegroundColor Green

Write-Host "5) Prisma generate + migrate + seed..." -ForegroundColor Cyan
$env:DATABASE_URL = "postgresql://docvault:docvault@localhost:5432/docvault"

pnpm db:generate
if ($LASTEXITCODE -ne 0) { Write-Host "db:generate failed" -ForegroundColor Red; exit 1 }

Write-Host "   Running migrate (showing full error if it fails)..." -ForegroundColor Cyan
pnpm --filter @doc-vault/db exec prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
  Write-Host "db:migrate failed" -ForegroundColor Red
  Write-Host "Common causes:" -ForegroundColor Yellow
  Write-Host "  - Postgres not ready yet"
  Write-Host "  - Wrong DATABASE_URL"
  Write-Host "Try: docker compose logs postgres"
  exit 1
}

pnpm db:seed
if ($LASTEXITCODE -ne 0) { Write-Host "db:seed failed" -ForegroundColor Red; exit 1 }
Write-Host "   Database ready" -ForegroundColor Green

Write-Host ""
Write-Host "=== Database is clean and ready ===" -ForegroundColor Green
Write-Host ""
Write-Host "Now open TWO new PowerShell windows and run:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Window 1:" -ForegroundColor White
Write-Host "    cd C:\Users\sujal\Projects\doc-vault"
Write-Host "    pnpm --filter @doc-vault/api dev"
Write-Host "    (wait for: API listening on http://localhost:4000)"
Write-Host ""
Write-Host "  Window 2:" -ForegroundColor White
Write-Host "    cd C:\Users\sujal\Projects\doc-vault"
Write-Host "    pnpm --filter @doc-vault/web dev"
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Login: demo@docvault.local / demo1234"
Write-Host ""
Write-Host "Do NOT run docker compose build. Postgres only is enough." -ForegroundColor Yellow
