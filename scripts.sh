#!/bin/bash

# Serelix Studio Development Scripts

case "$1" in
  "dev")
    echo "🚀 Starting development server..."
    npm run dev
    ;;
  "build")
    echo "🔨 Building production version..."
    npm run build
    ;;
  "preview")
    echo "👀 Starting preview server..."
    npm run preview
    ;;
  "docker:build")
    echo "🐳 Building Docker image..."
    docker build -t serelix-studio .
    ;;
  "docker:run")
    echo "🐳 Running Docker container on port 10019..."
    docker run -p 10019:80 serelix-studio
    ;;
  "docker:compose")
    echo "🐳 Starting with Docker Compose..."
    docker-compose up --build
    ;;
  "docker:stop")
    echo "🛑 Stopping Docker Compose..."
    docker-compose down
    ;;
  "lint")
    echo "🔍 Running linter..."
    npm run lint
    ;;
  "clean")
    echo "🧹 Cleaning build artifacts..."
    rm -rf dist node_modules/.vite
    ;;
  *)
    echo "Serelix Studio - Development Scripts"
    echo ""
    echo "Usage: ./scripts.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  dev             Start development server"
    echo "  build           Build production version"
    echo "  preview         Start preview server"
    echo "  docker:build    Build Docker image"
    echo "  docker:run      Run Docker container"
    echo "  docker:compose  Start with Docker Compose"
    echo "  docker:stop     Stop Docker Compose"
    echo "  lint            Run linter"
    echo "  clean           Clean build artifacts"
    echo ""
    ;;
esac