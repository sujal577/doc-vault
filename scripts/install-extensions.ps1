# Install Cursor/VS Code extensions recommended for Doc Vault
$extensions = @(
  "Prisma.prisma",
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode",
  "expo.vscode-expo-tools",
  "usernamehw.errorlens"
)

$cli = $null
if (Get-Command cursor -ErrorAction SilentlyContinue) {
  $cli = "cursor"
} elseif (Get-Command code -ErrorAction SilentlyContinue) {
  $cli = "code"
} else {
  Write-Host "Neither 'cursor' nor 'code' CLI found in PATH." -ForegroundColor Red
  Write-Host "Open Cursor -> Ctrl+Shift+X and install manually from .vscode/extensions.json"
  exit 1
}

Write-Host "Using CLI: $cli" -ForegroundColor Cyan
foreach ($ext in $extensions) {
  Write-Host "Installing $ext ..."
  & $cli --install-extension $ext
}

Write-Host ""
Write-Host "Done. Installed extensions:" -ForegroundColor Green
& $cli --list-extensions
Write-Host ""
Write-Host "Reload Cursor window: Ctrl+Shift+P -> Developer: Reload Window"
