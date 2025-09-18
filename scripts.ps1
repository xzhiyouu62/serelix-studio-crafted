param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

switch ($Command) {
    "dev" {
        Write-Host "🚀 Starting development server..." -ForegroundColor Green
        npm run dev
    }
    "build" {
        Write-Host "🔨 Building production version..." -ForegroundColor Yellow
        npm run build
    }
    "preview" {
        Write-Host "👀 Starting preview server..." -ForegroundColor Cyan
        npm run preview
    }
    "docker:build" {
        Write-Host "🐳 Building Docker image..." -ForegroundColor Blue
        docker build -t serelix-studio .
    }
    "docker:run" {
        Write-Host "🐳 Running Docker container on port 10019..." -ForegroundColor Blue
        docker run -p 10019:80 serelix-studio
    }
    "docker:compose" {
        Write-Host "🐳 Starting with Docker Compose..." -ForegroundColor Blue
        docker-compose up --build
    }
    "docker:stop" {
        Write-Host "🛑 Stopping Docker Compose..." -ForegroundColor Red
        docker-compose down
    }
    "lint" {
        Write-Host "🔍 Running linter..." -ForegroundColor Magenta
        npm run lint
    }
    "clean" {
        Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue dist, node_modules/.vite
    }
    default {
        Write-Host "Serelix Studio - Development Scripts" -ForegroundColor White
        Write-Host ""
        Write-Host "Usage: .\scripts.ps1 <command>" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Available commands:" -ForegroundColor White
        Write-Host "  dev             Start development server" -ForegroundColor Gray
        Write-Host "  build           Build production version" -ForegroundColor Gray
        Write-Host "  preview         Start preview server" -ForegroundColor Gray
        Write-Host "  docker:build    Build Docker image" -ForegroundColor Gray
        Write-Host "  docker:run      Run Docker container" -ForegroundColor Gray
        Write-Host "  docker:compose  Start with Docker Compose" -ForegroundColor Gray
        Write-Host "  docker:stop     Stop Docker Compose" -ForegroundColor Gray
        Write-Host "  lint            Run linter" -ForegroundColor Gray
        Write-Host "  clean           Clean build artifacts" -ForegroundColor Gray
        Write-Host ""
    }
}