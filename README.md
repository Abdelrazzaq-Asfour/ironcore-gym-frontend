```markdown
# IronCore Gym | Enterprise Management Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.x-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-orange?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An enterprise-grade, zero-trust full-stack management platform engineered for serious bodybuilding and raw strength training facilities. Features a robust Spring Boot 3.x backend architecture, a high-performance Next.js 16 App Router frontend, role-based access control (RBAC), and dynamic mock/real API toggling.

---

## 🏗️ Architectural Overview

```text
ironCore/
├── ironcore-frontend/          # Next.js 16 App Router Frontend Client Layer
│   ├── app/                    # App router segments (Auth, Admin, Coach, Member, Staff dashboards)
│   ├── components/             # Reusable atomic UI components & layout wrappers
│   ├── data/                   # Production-ready mock datasets (mockData.js)
│   └── services/               # Centralized API service facade with Mock/Real toggle
│
└── src/main/java/com/ironcore/ # Spring Boot 3.x Enterprise Backend Core
    ├── audit/                  # Spring AOP security logging & transaction tracking
    ├── config/                 # Security, CORS, OpenAPI, and Async configurations
    ├── controller/             # RESTful API endpoints (Auth, Booking, Subscriptions, Users)
    ├── model/                  # JPA Entities (User, Role, Booking, Subscription, RefreshToken)
    ├── repository/             # Spring Data JPA persistence interfaces
    ├── security/               # JWT filters, Rate-limiting, and Custom UserDetailsService
    └── service/                # Business logic implementation core

```

---

## 🚀 Core Tech Stack

### Frontend Architecture

* **Framework:** Next.js 16 (App Router) with Hybrid Server/Client Components.
* **Styling & UI:** Tailwind CSS configured with a custom high-contrast dark bodybuilding aesthetic.
* **State & Networking:** Axios/Fetch abstraction layer supporting seamless fallback between local Mock Databases and a live REST Backend.

### Backend Architecture

* **Framework:** Spring Boot 3.x (Java) delivering high-performance RESTful APIs.
* **Persistence & ORM:** Spring Data JPA, Hibernate, and MySQL 8.0 with strict InnoDB engine configurations.
* **Security & Access Control:** Spring Security, JWT-based stateless authentication, and Role-Based Access Control (RBAC).

---

## 👥 Role-Based Access Control (RBAC) & Portals

The platform enforces strict privilege isolation across four distinct operational tiers:

1. **Administrator (`ROLE_ADMIN`):** Full system control, dynamic user role management, system-wide analytics, and audit log tracking.
2. **Staff (`ROLE_STAFF`):** Frontline membership assistance, attendance monitoring, and check-in management.
3. **Coach (`ROLE_COACH`):** Personal trainer interface managing assigned class rosters and member schedules.
4. **Member (`ROLE_USER`):** Public registration portal, package subscription management, and interactive session booking.

---

## 🗄️ Database Schema & Architecture (`ironcore_db`)

Engineered with strict session configurations, foreign key cascades, and performance indexes:

* **`users`**: Core identity storage with bcrypt/argon2 credential hashes, account locking protection, and login telemetry.
* **`roles` & `user_roles**`: Normalized many-to-many junction mapping supporting multi-tier privilege assignments.
* **`subscriptions`**: Tracks active JOD-priced membership tiers (*Iron Starter*, *Pro Titan*, *Ultimate Core VIP*).
* **`bookings`**: Manages class schedules, trainer allocations, and booking status rotations.
* **`audit_logs`**: Spring AOP-driven change tracking capturing actor actions and payload snapshots.

---

## ⚡ Quick Start & Installation

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/ironcore-gym.git](https://github.com/your-username/ironcore-gym.git)
cd ironcore-gym

```

### 2. Configure Frontend

```bash
cd ironcore-frontend
npm install
npm run dev

```

*Access the frontend client locally at `http://localhost:3000`.*

### 3. Configure Backend

* Import `src/main/resources/ironcore_db.sql` into your local MySQL 8.0 server.
* Configure your database credentials in `application.properties`.
* Run the Spring Boot application using your preferred IDE (IntelliJ IDEA / Eclipse) or via Maven:

```bash
mvn spring-boot:run

```

---

## 🔑 Demo Access Credentials

To test the application instantly using mock data (`USE_MOCK_DATA = true`), use the following pre-seeded credentials (Password for all accounts: `123456`):

* **Administrator:** `admin_abdelrazzaq`
* **Staff:** `staff_mahmoud`
* **Coach:** `coach_mahmoud`
* **Member:** `mohammed`

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

```

```
