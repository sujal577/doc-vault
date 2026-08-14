# Start Postgres only (local API/web run via pnpm). Requires Docker Desktop.
Set-Location $PSScriptRoot\..

Write-Host "Checking Docker..." -ForegroundColor Cyan
docker info 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker Desktop is not running." -ForegroundColor Red
  Write-Host "1) Open Docker Desktop and wait until it says 'Running'"
  Write-Host "2) Re-run: .\scripts\start-db.ps1"
  exit 1
}

Write-Host "Starting Postgres only (no API/web image build)..." -ForegroundColor Cyan
docker compose up -d postgres
if ($LASTEXITCODE -ne 0) {
  Write-Host "Failed to start Postgres." -ForegroundColor Red
  exit 1
}

Write-Host "Waiting for Postgres health..." -ForegroundColor Cyan
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  $status = docker compose ps postgres --format json 2>$null
  if ($status -match '"Healthy"|healthy') {
    $ready = $true
    break
  }
  # Fallback: try pg_isready inside container
  docker compose exec -T postgres pg_isready -U docvault -d docvault 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 2
}

if (-not $ready) {
  Write-Host "Postgres did not become ready in time. Check: docker compose logs postgres" -ForegroundColor Yellow
}

Write-Host "Running migrations..." -ForegroundColor Cyan
pnpm db:migrate
if ($LASTEXITCODE -ne 0) {
  Write-Host "Migration failed." -ForegroundColor Red
  exit 1
}

Write-Host "Seeding demo data..." -ForegroundColor Cyan
pnpm db:seed

Write-Host ""
Write-Host "Database ready." -ForegroundColor Green
Write-Host "Demo login: demo@docvault.local / demo1234"
Write-Host ""
Write-Host "Next (two terminals):"
Write-Host "  pnpm --filter @doc-vault/api dev"
Write-Host "  pnpm --filter @doc-vault/web dev"
Write-Host "Then open http://localhost:3000"
