# Laundry Management System

Web-based admin system for a laundry shop: customers, services, orders, cash payments, dashboard and reports.
Built for BSCS Semester 5 - Web Engineering.

**Stack:** React 19 + Redux Toolkit + React Router + Bootstrap | Node.js + Express + TypeORM + JWT | PostgreSQL

```
LaundryManagementSystem/
  backend/    Express REST API (TypeORM + PostgreSQL)
  frontend/   React app (Vite)
  docs/       Architecture, ER diagram, API docs, Redux state docs
```

## 1. Requirements
- Node.js 18 or newer
- PostgreSQL 14 or newer (pgAdmin optional)

## 2. Create the database
Open pgAdmin or `psql` and run:
```sql
CREATE DATABASE laundry_db;
```
Tables are created automatically by TypeORM the first time the backend starts.

## 3. Run the backend
```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
```
Open `backend/.env` and set `DB_PASSWORD` to your PostgreSQL password. Then:
```bash
npm run dev               # or: npm start
```
You should see: `PostgreSQL connected` and `Server running on http://localhost:5000`.
On first run it creates the admin account and 4 default services.

## 4. Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev
```
Open http://localhost:5173

## 5. Login
| Email | Password |
|---|---|
| admin@laundry.com | admin123 |

(Change it in `backend/.env` before the first run: `ADMIN_EMAIL`, `ADMIN_PASSWORD`.)
Passwords are stored hashed with bcrypt.

## 6. Typical workflow
1. Login -> Customers -> Add customer
2. Orders -> New Order -> choose customer + service, enter quantity (price auto-fills) -> total = quantity x price
3. Order is saved as **Unpaid**
4. Customer returns and pays cash -> Payments -> Unpaid Bills -> **Record Cash Payment**
5. Payments -> Payment History shows all paid bills

## 7. Testing with Postman
Import nothing - just `POST http://localhost:5000/api/auth/login`, copy the `token`, and send it as
`Authorization: Bearer <token>` on every other request. Endpoints are listed in `docs/API.md`.

## 8. Notes / design decisions
- Creating an order also creates its Payment row with status `Unpaid` (keeps the database to exactly 5 tables).
- A paid order's bill amount cannot be edited. A service used by orders cannot be deleted.
- Deleting a customer also deletes their orders and payments (asked for in the confirmation dialog).
- "Completed Orders" on the dashboard counts status = Completed; Delivered is shown separately.
- Customer/service dropdowns in the order form load up to 100 records.
