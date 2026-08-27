# Rebuild module.zip for release
$moduleDir = $PSScriptRoot
$zipOutput = "$moduleDir\module.zip"

if (Test-Path $zipOutput) {
    Remove-Item $zipOutput -Force
}

$items = @(
    "$moduleDir\module.json",
    "$moduleDir\README.md",
    "$moduleDir\guide.md",
    "$moduleDir\anleitung.md",
    "$moduleDir\how-it-works.md",
    "$moduleDir\funktion.md",
    "$moduleDir\architecture.md",
    "$moduleDir\funktionen.md",
    "$moduleDir\Updates.md",
    "$moduleDir\LICENSE",
    "$moduleDir\languages",
    "$moduleDir\scripts",
    "$moduleDir\styles",
    "$moduleDir\templates",
    "$moduleDir\glossary",
    "$moduleDir\translations"
)

Compress-Archive -Path $items -DestinationPath $zipOutput -CompressionLevel Optimal -Force
Write-Host "module.zip successfully generated: $([math]::Round((Get-Item $zipOutput).Length / 1KB, 2)) KB" -ForegroundColor Green
