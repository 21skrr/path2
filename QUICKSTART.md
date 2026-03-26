# HR Platform - Quick Start Guide

## Prerequisites Installation

### 1. Java 17+
```bash
# Check version
java -version

# Download from: https://www.oracle.com/java/technologies/downloads/
```

### 2. PostgreSQL
```bash
# Windows: Download installer from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Start service and verify
psql --version
```

### 3. Node.js 16+
```bash
# Download from https://nodejs.org/
node --version
npm --version
```

## Environment Configuration

### Backend (.env)
Create `backend/.env`:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/hrplatform
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
```

### Frontend (.env)
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:8080
```

## Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE hrplatform;"

# Load schema
psql -U postgres -d hrplatform -f database_setup.sql

# Verify
psql -U postgres -d hrplatform -c "\dt"
```

## Run Project

### Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Test the Flow

1. **View Home Page**
   - http://localhost:3000
   - See featured nominations and articles

2. **Browse Articles**
   - http://localhost:3000/articles
   - Filter by category

3. **View Resources**
   - http://localhost:3000/resources
   - See templates (some marked as premium)

4. **Test Membership**
   - http://localhost:3000/membership
   - Select a plan
   - See RIB modal with transaction reference

5. **Admin Panel** (Test only)
   - http://localhost:3000/admin
   - View pending payments
   - Approve/reject flows

## API Development

Backend API docs available at:
http://localhost:8080/swagger-ui.html

(After adding Springdoc OpenAPI dependency)

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080
# Kill it
kill -9 <PID>

# For port 3000
lsof -i :3000
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready -U postgres -d hrplatform

# Verify credentials in application.properties
# Default: postgres / postgres
```

### CORS Issues
- Backend CORS is configured for * (development)
- Frontend proxy is configured in vite.config.ts

### Module Not Found (Frontend)
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules frontend/package-lock.json
npm install
```

## Development Tips

- **Backend**: Every edit triggers recompile
- **Frontend**: Hot reload enabled on file save
- **Database**: Schema auto-updates on Hibernate DDL mode: update
- **Logging**: Check console for detailed request/response traces

## Production Build

### Backend
```bash
cd backend
mvn clean package -DskipTests
# Creates JAR in target/
```

### Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder
# Deploy to Nginx/Apache
```

---

Need help? Check README.md for architecture overview.
