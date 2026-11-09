param(
    [int]$Port = 8000,
    [switch]$NoReload
)

$ErrorActionPreference = "Stop"
$backendDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$pythonExecutable = Join-Path $backendDirectory ".venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $pythonExecutable)) {
    throw "Virtual environment not found. Run: py -3.12 -m venv .venv"
}

Set-Location -LiteralPath $backendDirectory

# SQLAlchemy 2.0's C extensions are optional. Some managed Windows machines
# block locally installed .pyd modules, so local development uses its pure
# Python implementation. Linux/Docker keeps the accelerated implementation.
$env:DISABLE_SQLALCHEMY_CEXT_RUNTIME = "1"

if (-not $env:DATABASE_URL) {
    $env:DATABASE_URL = "sqlite:///./datamind.db"
}

if (-not $env:JWT_SECRET_KEY) {
    $env:JWT_SECRET_KEY = "local-development-secret-key-change-before-production"
}

Write-Host "Applying database migrations..." -ForegroundColor Cyan
& $pythonExecutable -m alembic upgrade head
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "Starting DataMind API at http://127.0.0.1:$Port" -ForegroundColor Green
$uvicornArguments = @("-m", "uvicorn", "main:application", "--port", $Port.ToString())
if (-not $NoReload) {
    $uvicornArguments += "--reload"
}

& $pythonExecutable @uvicornArguments
exit $LASTEXITCODE
