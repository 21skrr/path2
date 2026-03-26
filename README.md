# HR Platform - Morocco 🇲🇦

A professional HR platform combining SHRM.org-style resources with DRH.ma-style news feed, tailored for the Moroccan market.

## 🎯 Features

- **News & Actualité**: Blog-style section for HR news, nominations, and interviews
- **Professional Resources**: Library of HR templates and how-to guides
- **Membership System**: Tiered access (Free vs. Premium) with content locking
- **Manual Payment Workflow**: RIB-based payment with receipt upload
- **Admin Dashboard**: Review and approve membership payments
- **Moroccan Focus**: Local city filters, prominent nominations section

## 📁 Project Structure

```
.
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/hrplatform/
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Spring Data repositories
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST APIs
│   │   ├── dto/            # Data transfer objects
│   │   └── config/         # Spring configuration
│   ├── pom.xml             # Maven configuration
│   └── application.properties
│
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API client
│   │   ├── styles/         # Global CSS
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── database_setup.sql       # PostgreSQL schema
```

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 16+
- PostgreSQL 12+
- Git

### Database Setup

1. Create database:
```bash
psql -U postgres -c "CREATE DATABASE hrplatform;"
```

2. Load schema:
```bash
psql -U postgres -d hrplatform -f database_setup.sql
```

3. Update backend connection string in `backend/src/main/resources/application.properties`

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: http://localhost:8080

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## 📊 API Endpoints

### Articles
- `GET /api/articles` - List all public articles
- `GET /api/articles/category/{category}` - Filter by category
- `POST /api/articles` - Create article (admin)

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/category/{category}` - Filter by category

### Membership Plans
- `GET /api/plans` - List all plans

### Payments
- `POST /api/payments/initiate` - Start payment process
- `PUT /api/payments/{id}/receipt` - Upload receipt
- `GET /api/payments/admin/pending` - List pending (admin)
- `PUT /api/payments/admin/{id}/approve` - Approve (admin)

## 💳 Payment Workflow

1. User selects membership plan
2. System generates unique `transaction_reference`
3. Modal displays RIB details + reference
4. User makes bank transfer with reference in notes
5. User uploads transfer receipt screenshot
6. Admin reviews and manually approves/rejects
7. On approval, user membership upgraded to PREMIUM

## 🎨 Design System

**Colors:**
- Navy: `#002f6c` (primary)
- White: `#ffffff`
- Accent Blue: `#1e90ff`
- Success Green: `#4caf50`
- Error Red: `#f44336`

**Typography:**
- Clean, corporate sans-serif
- Responsive mobile-first layout

## 📱 Key Pages

- **Home** - Hero section + featured nominations + articles grid
- **Articles** - Browse all news/nominations/interviews
- **Resources** - Download templates and guides
- **Membership** - Select plans + RIB modal checkout
- **Admin** - Review payment receipts and approve/reject

## 🔐 Security Notes

- Passwords should be hashed with bcrypt
- JWT tokens recommended for production auth
- File uploads should validate MIME types
- CORS configured for development

## 🔄 Moroccan Market Features

✅ Prominent "Nominations" section (local HR mobility)
✅ City filters (Casablanca, Rabat, Fes, Tanger)
✅ Manual RIB payment (local preference)
✅ DayOne onboarding tool integration (future)
✅ French/Arabic content support (structure ready)

## 📝 Database Schema Highlights

- **Users**: Role-based (ADMIN/MEMBER) + membership status tracking
- **PaymentSubmissions**: Complete audit trail with receipt URLs
- **Articles/Resources**: Premium flag for content gating
- **Profiles**: City + company + bio for member networking

## 🚧 Production Checklist

- [ ] Add JWT authentication
- [ ] Implement file upload service (S3/local storage)
- [ ] Add email notifications
- [ ] Setup logging and monitoring
- [ ] Add user registration flow
- [ ] Implement premium content gating
- [ ] Add rate limiting
- [ ] Setup database backups
- [ ] Configure CDN for assets

## 📞 Support

For questions or contributions, contact: info@hrplatform.ma

---

**Built with ❤️ for Morocco's HR Community**
