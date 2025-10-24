# Improve My City

## Overview

**Improve My City** is a citizen engagement web application designed to let users report, track, and resolve civic issues such as potholes, garbage, and streetlight failures.
The app ensures **transparency**, **security**, and **real-time progress tracking** between citizens and authorities.

Now enhanced with **Multi-Factor Authentication (MFA)** for stronger account security.

---

## Tech Stack

### **Frontend (React.js)**

- React.js (Vite or Create React App)
- React Router for navigation
- Context API or Redux Toolkit for global state
- Axios for API communication
- Formik + Yup for form validation
- Tailwind CSS or Material UI for styling
- Chart.js / Recharts for data visualization
- Dark/Light mode toggle

### **Backend (ASP.NET Core 8)**

- ASP.NET Core Web API
- Clean Architecture / Onion Architecture pattern
- Entity Framework Core (SQL Server)
- JWT Authentication + **MFA (Multi-Factor Authentication)**
- Role-based Authorization (RBAC)
- Google OAuth Login
- Email OTP verification for MFA
- Logging using Serilog / NLog
- DTOs for secure data transfer
- Cloudinary / Azure Blob for image uploads

### **Testing**

- Backend: xUnit / NUnit
- Frontend: Jest / React Testing Library
- End-to-End: Cypress / Playwright
- Manual: Postman API collection

---

## Project Architecture

```
ImproveMyCity/
│
├── backend/
│   ├── ImproveMyCity.API/             # Controllers
│   ├── ImproveMyCity.Application/     # Business logic (Auth, MFA, Complaints)
│   ├── ImproveMyCity.Infrastructure/  # EF Core, Repositories, Email service
│   ├── ImproveMyCity.Domain/          # Entities, DTOs, Interfaces
│   └── ImproveMyCity.Tests/           # Unit & integration tests
│
├── frontend/
│   ├── src/
│   │   ├── pages/                     # All pages (Login, Dashboard, MFA, etc.)
│   │   ├── components/                # UI components (Navbar, Cards, etc.)
│   │   ├── services/                  # API handlers using Axios
│   │   ├── context/                   # Auth and Theme management
│   │   ├── hooks/                     # Custom React hooks
│   │   └── assets/                    # Images, icons
│
└── README.md
```

---

## Core Modules & Features

### 1. Authentication & MFA Security

**Key Features:**

- Email + password login using JWT
- Google OAuth login
- Role-based access (Admin | Officer | User)
- **Multi-Factor Authentication (MFA):**

  - After valid login, OTP is sent to registered email or generated via Google Authenticator (TOTP)
  - User must verify OTP within 2 minutes to access dashboard
  - Backup codes for account recovery

**MFA Endpoints:**

- `POST /api/auth/login` → Primary login (JWT generation)
- `POST /api/auth/mfa/send-otp` → Send OTP to email
- `POST /api/auth/mfa/verify` → Verify OTP
- `GET /api/auth/mfa/setup` → Generate QR for Google Authenticator setup

---

### 2. Complaint Management

- Submit complaints with title, description, photo, and location (Google Maps)
- Complaint lifecycle: **Pending → In Progress → Resolved**
- Filter and search by status, date, or location
- Role-based controls:

  - **User** – create & view own complaints
  - **Officer** – update complaint status
  - **Admin** – assign officers and monitor progress

---

### 3. Dashboard & Analytics

**Admin Dashboard:**

- Displays total, active, and resolved complaints
- Visual analytics using Recharts / Chart.js
- Officer activity insights

**Officer Dashboard:**

- Assigned complaints list
- Progress update panel

**Public Dashboard:**

- Shows resolved issues for public transparency

---

### 4. Notifications

- Email notifications on complaint status updates
- Officer notifications when assigned a new complaint
- MFA OTP emails (secure & time-bound)

---

### 5. Audit Logging

- Tracks every user activity (login, MFA verification, complaint updates)
- Stores entries in `AuditLogs` table with timestamp

---

### 6. User Experience

- Fully responsive design (desktop + mobile)
- Dark/Light theme toggle
- Integrated Google Maps location picker
- Chatbot for quick queries:

  - Example: “What’s the status of my complaint?” → retrieves status via API

---

## Database Design

**Entities:**

- **Users** → Id, Name, Email, PasswordHash, RoleId, MFAEnabled, MFASecretKey, CreatedAt, UpdatedAt
- **Roles** → Id, Name (Admin, Officer, User)
- **Complaints** → Id, Title, Description, Status, Location, ImageUrl, CreatedBy, AssignedTo, CreatedAt, UpdatedAt, IsDeleted
- **AuditLogs** → Id, UserId, ActionType, Entity, EntityId, Timestamp
- **OTPRequests** → Id, UserId, OTPCode, ExpiresAt, IsUsed

**Relationships:**

- One-to-many: Roles → Users
- One-to-many: Users → Complaints
- One-to-many: Users → OTPRequests

---

## API Endpoints

### Authentication & MFA

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/googlelogin
GET    /api/auth/googlecallback
POST   /api/auth/mfa/send-otp
POST   /api/auth/mfa/verify
GET    /api/auth/mfa/setup
```

### User Management

```
GET    /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### Complaints

```
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/{id}
PUT    /api/complaints/{id}
DELETE /api/complaints/{id}
```

### Analytics

```
GET /api/analytics/summary
GET /api/analytics/status
```

### Audit Logs

```
GET /api/auditlogs
```

---

## Testing Strategy

### Backend (ASP.NET Core)

- **Unit Tests (xUnit)** – Services, repositories, and MFA logic
- **Integration Tests** – Using InMemory database

### Frontend (React)

- **Component Tests (Jest + RTL)** – Form validation, MFA screens, API calls
- **End-to-End Tests (Cypress)** – Full login → MFA → dashboard → complaint flow

### Manual Testing

- Postman for endpoint validation
- Role-based access and authentication verification

---

## Future Scope

- Real-time updates using SignalR (live complaint tracking)
- AI Chatbot using ChatGPT API
- Mobile App (React Native)
- Push Notifications via Firebase
- Multi-language support (English, Hindi, Marathi)
- Gamification (badges for active users)
- QR-code-based complaint tracking posters

---

## Summary

**Improve My City** provides:

- Secure Authentication (JWT + MFA)
- Role-based dashboards
- Complaint reporting & tracking
- Real-time analytics & notifications
- Clean, modular architecture
