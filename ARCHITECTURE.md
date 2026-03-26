# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                   │
│  React SPA (http://localhost:3000)                          │
│                                                              │
│  ├─ Home (Featured Nominations + Articles Feed)             │
│  ├─ Articles (Filter by Category)                           │
│  ├─ Resources (Template Library)                            │
│  ├─ Membership (Plan Selection + RIB Modal)                 │
│  └─ Admin Dashboard (Payment Review)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS (CORS enabled)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  REST API LAYER                              │
│  Spring Boot 3.1 (http://localhost:8080)                    │
│                                                              │
│  Controllers:                                               │
│  ├─ /api/articles (ArticleController)                       │
│  ├─ /api/resources (ResourceController)                     │
│  ├─ /api/plans (MembershipPlanController)                   │
│  └─ /api/payments (PaymentController)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ JDBC
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                         │
│                                                              │
│  Services:                                                  │
│  ├─ ArticleService (CRUD + Access Control)                  │
│  ├─ ResourceService (CRUD + Access Control)                 │
│  ├─ MembershipPlanService (Plan Management)                 │
│  └─ PaymentSubmissionService (Payment Workflow)             │
│                                                              │
│  ├─ Transaction Management via @Transactional               │
│  ├─ Data Validation via @Valid                              │
│  └─ Exception Handling (Global)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ Hibernate JPA
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA ACCESS LAYER (Repositories)               │
│                                                              │
│  ├─ UserRepository                                          │
│  ├─ ProfileRepository                                       │
│  ├─ ArticleRepository (Custom @Query)                       │
│  ├─ ResourceRepository (Custom @Query)                      │
│  ├─ MembershipPlanRepository                                │
│  └─ PaymentSubmissionRepository                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ TCP/IP
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (PostgreSQL)                    │
│  hrplatform (Database)                                      │
│                                                              │
│  Tables:                                                    │
│  ├─ users (Role-based + Membership Status)                  │
│  ├─ profiles (Job Info + Bio)                               │
│  ├─ articles (NEWS/NOMINATION/ARTICLE)                      │
│  ├─ resources (LEGAL/TEMPLATE/ONBOARDING)                   │
│  ├─ membership_plans (Price + Billing Period)               │
│  └─ payment_submissions (RIB Manual Payment Workflow)       │
│                                                              │
│  Indexes on: category, is_premium, user_id, status          │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow - Membership Purchase Example

```
User                    React Frontend               Spring Boot Backend              PostgreSQL
  │                          │                              │                            │
  ├─ Click "Select Plan"────▶│                              │                            │
  │                          ├─ POST /api/payments/initiate─│                            │
  │                          │                              ├─ Generate TX Ref           │
  │                          │                              ├─ Create PaymentSubmission──│
  │                          │                              │   (status=PENDING)         │
  │                          │                              │                            ├─ INSERT
  │                          │◀─ Return TX Ref + RIB────────│                            │
  │                          │                              │                            │
  ├─◀─ Show RIB Modal────────│                              │                            │
  │   + TX Reference         │                              │                            │
  │                          │                              │                            │
  ├─ Upload Receipt IMG──────│                              │                            │
  │                          ├─ PUT /api/payments/receipt───│                            │
  │                          │                              ├─ Save Receipt URL─────────│
  │                          │                              │   UPDATE payment_submissions
  │                          │◀─ Confirm Submission─────────│                            │
  │◀─ Success Message────────│                              │                            │
  │                          │                              │                            │
  
  [Admin Reviews Payment]                                                               │
  │                          │                              │                            │
  ├─ Visit Admin Panel──────▶│                              │                            │
  │                          ├─ GET /api/payments/pending───│                            │
  │                          │                              ├─ Query PENDING submissions─│
  │                          │                              │                            ├─ SELECT
  │                          │◀─ Return List + Images───────│                            │
  ├─◀─ Review Receipts───────│                              │                            │
  │                          │                              │                            │
  ├─ Click Approve──────────▶│                              │                            │
  │                          ├─ PUT /api/payments/approve───│                            │
  │                          │                              ├─ Update status=APPROVED───│
  │                          │                              ├─ Upgrade user to PREMIUM──│
  │                          │                              │                            ├─ UPDATE users SET
  │                          │◀─ Success──────────────────┤│                            │   membership_status='PREMIUM'
  │                          │                              │                            │
  └─ Gets Premium Access─────└──────────────────────────────└────────────────────────────┘
```

## Security Architecture

```
┌────────────────────────────────────────────────────┐
│  Frontend Security (React)                         │
├────────────────────────────────────────────────────┤
│ ✓ HTTPS only (production)                          │
│ ✓ XSS Protection via React's auto-escaping         │
│ ✓ CSRF via Axios headers                           │
│ ✓ Local storage for session (future JWT)           │
│ ✓ Environment variables for API URLs               │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Backend Security (Spring Boot)                    │
├────────────────────────────────────────────────────┤
│ ✓ CORS configured for dev (restrict in prod)       │
│ ✓ @Valid for input validation                      │
│ ✓ SQL Injection protection (Hibernate parameterized queries)
│ ✓ Password hashing ready (bcrypt)                  │
│ ✓ JWT tokens ready for implementation              │
│ ✓ Role-based access control (RBAC)                 │
│ ✓ Global exception handling                        │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Database Security (PostgreSQL)                    │
├────────────────────────────────────────────────────┤
│ ✓ User roles and permissions                       │
│ ✓ Unique constraints (email, transaction_ref)      │
│ ✓ Foreign key constraints                          │
│ ✓ Indexed queries for performance                  │
│ ✓ Audit timestamps (created_at, updated_at)        │
│ ✓ Soft delete ready                                │
└────────────────────────────────────────────────────┘
```

## Data Flow - Premium Content Access

```
User Requests Premium Article
    │
    ▼
React Frontend: Check user.membershipStatus
    │
    ├─ If membershipStatus = "PREMIUM"
    │   └─► Load article with isPremium=true
    │
    ├─ If membershipStatus = "FREE"
    │   └─► Show lock icon + "Upgrade" button
    │       └─ Redirect to /membership page
    │
    └─ If membershipStatus = "PENDING"
        └─ Show "Payment pending approval"
           └─ Redirect to payment history
```

## Error Handling Flow

```
HTTP Request
    │
    ▼
Spring Controller
    │
    ├─ Input Validation (@Valid)
    │   ├─ Valid ✓ → Service
    │   └─ Invalid ✗ → 400 Bad Request
    │
    ▼
Service Layer
    │
    ├─ Business Logic
    │   ├─ Success ✓ → Repository
    │   └─ Error ✗ → RuntimeException
    │
    ▼
Repository Layer
    │
    ├─ Database Query
    │   ├─ Success ✓ → Return data
    │   └─ Error ✗ → DataAccessException
    │
    ▼
Global Exception Handler
    │
    ├─ ValidationException → 400
    ├─ EntityNotFoundException → 404
    ├─ DataAccessException → 500
    └─ Generic Exception → 500 + Logging
    │
    ▼
Response to Client (JSON)
```

## Deployment Architecture (Production Ready)

```
┌─────────────────────────────────────────────────────────┐
│ Load Balancer (Nginx / Cloudflare)                      │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Frontend│     │ Backend │     │ Backend │
│ Pod 1   │     │ Pod 1   │     │ Pod 2   │
│ (React) │     │(Spring) │     │(Spring) │
└─────────┘     └────┬────┘     └────┬────┘
                     │               │
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
  ┌─────────────────────────────────────┐
  │   PostgreSQL (Master-Slave Setup)   │
  │   - Primary: Read + Write           │
  │   - Replica: Read-only (Backup)     │
  │   - Automated backups               │
  │   - Point-in-time recovery          │
  └─────────────────────────────────────┘
     │
     ▼
  ┌──────────────────┐
  │ Object Storage   │
  │ (S3 / MinIO)     │
  │                  │
  │ - Receipt images │
  │ - Resource files │
  │ - Article images │
  └──────────────────┘
```

## CI/CD Pipeline (Future)

```
Git Push
  │
  ├─► GitHub Actions
  │   │
  │   ├─ Build Java (mvn clean package)
  │   ├─ Build JavaScript (npm run build)
  │   ├─ Unit Tests
  │   ├─ Integration Tests
  │   └─ Security Scan (OWASP)
  │
  ├─ If all pass ✓
  │  │
  │  ├─► Build Docker Images
  │  ├─► Push to Registry
  │  └─► Deploy to Kubernetes / Docker Compose
  │
  └─ If fails ✗
     └─ Notify dev team
```

---

**This architecture ensures:**
- Scalability (stateless services)
- Reliability (transaction management)
- Security (input validation + RBAC)
- Maintainability (layered design)
- Performance (indexed queries)
- Moroccan market fit (manual RIB payment)
