# Start Doc Vault API (keep this window open)
Set-Location $PSScriptRoot\..
Write-Host "Starting API on http://localhost:4000 ..." -ForegroundColor Cyan
pnpm --filter @doc-vault/crypto build 2>$null
pnpm --filter @doc-vault/shared build 2>$null
pnpm --filter @doc-vault/db build 2>$null
pnpm --filter @doc-vault/api dev
