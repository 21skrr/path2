#!/bin/bash

# HR Platform - Setup Script
# This script automates the initial setup

set -e

echo "🚀 HR Platform Setup Starting..."

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 17+"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Please install PostgreSQL"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "✓ All prerequisites installed"

# Create database
echo ""
echo "📦 Creating database..."
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS hrplatform;" || true

# Load schema
echo "📋 Loading database schema..."
psql -U postgres -d hrplatform -f database_setup.sql

# Backend setup
echo ""
echo "🔨 Setting up backend..."
cd backend
mvn clean install -q
echo "✓ Backend ready"

# Frontend setup
echo ""
echo "⚛️  Setting up frontend..."
cd ../frontend
npm install -q
echo "✓ Frontend ready"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Terminal 1: cd backend && mvn spring-boot:run"
echo "2. Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
