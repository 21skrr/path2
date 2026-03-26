@echo off
REM HR Platform - Setup Script for Windows

echo.
echo Starting HR Platform Setup...
echo.

REM Check Java
java -version >nul 2>&1
if errorlevel 1 (
    echo Error: Java not found. Please install Java 17+
    exit /b 1
)
echo [OK] Java installed

REM Check PostgreSQL
psql --version >nul 2>&1
if errorlevel 1 (
    echo Error: PostgreSQL not found. Please install PostgreSQL
    exit /b 1
)
echo [OK] PostgreSQL installed

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js 16+
    exit /b 1
)
echo [OK] Node.js installed

echo.
echo Creating database...
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS hrplatform;" 2>nul

echo Loading schema...
psql -U postgres -d hrplatform -f database_setup.sql

echo.
echo Setting up backend...
cd backend
call mvn clean install -q
cd ..
echo [OK] Backend ready

echo.
echo Setting up frontend...
cd frontend
call npm install -q
cd ..
echo [OK] Frontend ready

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Terminal 1: cd backend ^&^& mvn spring-boot:run
echo 2. Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
