
# 🧺 Laundry Management System

### Full-Stack Web Application | NUML – Web Engineering Lab | Fall 2026

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-purple?logo=redux)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)

---

## 📌 1. Project Overview

The **Laundry Management System** is a web-based application designed to simplify and automate the daily operations of a laundry shop.

Traditional laundry businesses often depend on paper registers and manual calculations to manage customers, services, orders, and payments. These processes can result in incorrect billing, misplaced records, and difficulty tracking laundry orders.

This project provides a centralized digital platform where an administrator can manage customers, laundry services, orders, billing, and payments.

The system automatically calculates order totals, tracks laundry progress, maintains payment records, and displays important business statistics through an administrative dashboard.

**Academic Project:** Open Ended Lab (OEL)  
**Course:** Web Engineering Lab  
**University:** National University of Modern Languages (NUML)  
**Department:** Computer Science  
**Semester:** Fall 2026

---

## 🎯 2. Project Objectives

- Digitize customer records and laundry orders.
- Automate laundry bill calculations.
- Manage laundry services and their prices.
- Track order progress.
- Maintain paid and unpaid payment records.
- Provide business statistics through a dashboard.
- Reduce manual work and human errors.
- Implement secure administrator authentication.
- Demonstrate modern full-stack web development concepts.

---

## ✨ 3. Key Features

### 🔐 Admin Authentication
- Secure administrator login.
- Password hashing.
- JWT-based authentication.
- Protected application routes.
- Admin logout.

**Note:** The application has only one administrator role. Customers and employees do not need accounts.

### 👥 Customer Management
- Add new customers.
- View all customer records.
- Update customer information.
- Delete customer records.
- Search customers by name or phone number.
- View customer order history.

### 🧼 Laundry Services Management
- Add laundry services.
- View available services.
- Update service details and prices.
- Delete or deactivate services.

**Example Services:**
- Washing
- Ironing
- Dry Cleaning
- Washing and Ironing

### 📦 Order Management
- Create new laundry orders.
- Select an existing customer.
- Select a laundry service.
- Enter quantity and unit price.
- Automatically calculate total bills.
- Update order information.
- Track order progress.
- Search, filter, sort, and paginate orders.

**Order Status:**
- Pending
- In Progress
- Completed
- Delivered

### 💰 Payment Management
- View unpaid bills.
- Record cash payments.
- Update payment status.
- Maintain payment history.
- View payment dates and amounts.

**Payment Status:**
- Unpaid
- Paid

### 📊 Admin Dashboard

The dashboard provides an overview of business operations.

- Total customers.
- Total orders.
- Pending orders.
- Completed orders.
- Total paid revenue.
- Total unpaid amount.
- Recent orders.

### 🔎 Data Management
- Search records.
- Filter records by status.
- Sort records by date or amount.
- Pagination for large datasets.

### ⚡ User Experience
- Form validation.
- Custom error messages.
- Loading indicators.
- Success and error notifications.
- Confirmation before deleting records.
- Responsive user interface.

---

## 🛠️ 4. Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | Frontend development |
| JavaScript ES6+ | Programming language |
| React Hooks | Component state and behavior |
| React Router | Navigation and protected routes |
| Redux Toolkit | Global state management |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Relational database |
| TypeORM | Database interaction |
| JWT | Authentication |
| bcrypt | Password hashing |
| CSS / Bootstrap | UI styling |
| Git & GitHub | Version control |
| Postman | API testing |

---

## 🏗️ 5. System Architecture

The application follows a three-layer architecture.

```text
             ADMINISTRATOR
                    |
                    v
          +--------------------+
          |   React Frontend   |
          |      React 19      |
          +--------------------+
                    |
                    v
          +--------------------+
          |   Redux Toolkit    |
          |  State Management  |
          +--------------------+
                    |
                 REST APIs
                    |
                    v
          +--------------------+
          | Express.js / Node  |
          | Backend Logic      |
          | Authentication     |
          +--------------------+
                    |
                    v
          +--------------------+
          |       TypeORM      |
          +--------------------+
                    |
                    v
          +--------------------+
          |    PostgreSQL      |
          |      Database      |
          +--------------------+
```

### Architecture Description

- **Frontend:** React provides the user interface. React Hooks manage component behavior, React Router handles navigation, and Redux Toolkit manages shared state.
- **Backend:** Node.js and Express.js handle requests, authentication, validation, and business logic.
- **Database:** PostgreSQL stores application records, while TypeORM manages database operations.

The frontend communicates with the backend through REST APIs.

---

## 🗄️ 6. Database Structure

The application uses PostgreSQL with five main tables.

| Table | Description |
|---|---|
| Admin | Stores administrator login credentials |
| Customers | Stores customer information |
| Services | Stores laundry services and prices |
| Orders | Stores laundry order details |
| Payments | Stores payment information |

### Database Relationships

- One customer can have multiple orders.
- One service can be associated with multiple orders.
- Each order belongs to one customer.
- Each order uses one service.
- Each order has one associated payment record.

The unit price is stored with each order to preserve historical billing information when service prices change.

---

## 🔄 7. Application Workflow

1. The administrator opens the application.
2. The administrator logs in.
3. The dashboard displays business statistics.
4. The administrator registers a customer.
5. The administrator selects a laundry service.
6. The administrator enters the quantity and unit price.
7. The system automatically calculates the total bill.
8. The order is saved with Pending order status and Unpaid payment status.
9. The administrator updates the order status as the work progresses.
10. The customer returns and pays cash.
11. The administrator records the payment and marks it Paid.
12. Dashboard statistics are updated.

### Example Bill Calculation

| Detail | Value |
|---|---:|
| Service | Ironing |
| Quantity | 5 pairs |
| Price per pair | Rs. 30 |
| Total Bill | Rs. 150 |

**Formula:**

```javascript
totalAmount = quantity * unitPrice;
```

---

## 📂 8. Project Folder Structure

```text
LaundryManagementSystem/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   └── app/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── entities/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   │
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 9. Installation and Setup

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd LaundryManagementSystem
```

### Step 2: Setup Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

### Step 3: Setup Backend

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Example environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
DB_NAME=laundry_management
JWT_SECRET=your_secret_key
```

Configure these values according to your PostgreSQL installation.

Start the backend using the script defined in `backend/package.json`, for example:

```bash
npm run dev
```

### Step 4: Database Setup

1. Open PostgreSQL.
2. Create a database named `laundry_management`.
3. Configure the database connection in the backend `.env` file.
4. Start the backend after configuring TypeORM.
5. Ensure the required database tables are created.

**Important:** Never upload your actual `.env` file or database credentials to GitHub.

---

## 🔗 10. REST API Overview

The backend provides REST APIs for communication between React and PostgreSQL.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |

### Customers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/customers` | Get customers |
| POST | `/api/customers` | Add customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Services

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/services` | Get services |
| POST | `/api/services` | Add service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete/deactivate service |

### Orders

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/orders` | Get orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |
| PATCH | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

### Payments and Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/payments` | Get payments |
| POST | `/api/payments` | Record payment |
| GET | `/api/dashboard/stats` | Get statistics |

*Actual endpoints may be adjusted during implementation.*

---

## 🧪 11. Testing

The application will be tested to verify that all major functionalities work correctly.

Testing includes:

- Administrator authentication.
- Customer CRUD operations.
- Service CRUD operations.
- Order creation and bill calculation.
- Order status updates.
- Payment recording.
- Search and filtering.
- Sorting and pagination.
- Protected route access.
- Frontend and backend integration.
- Database operations.

Postman can be used to test backend REST APIs.

---

## 👨‍💻 12. Team Members

**National University of Modern Languages (NUML)**  
Department of Computer Science  
BS Computer Science – Semester 5  
Web Engineering Lab – Fall 2026

| Member | Name | Registration Number |
|---|---|---|
| 1 | [Member Name] | [Registration Number] |
| 2 | [Member Name] | [Registration Number] |
| 3 | [Member Name] | [Registration Number] |

**Submitted To:** [Instructor Name]

---

## 🔮 13. Future Improvements

Possible future enhancements include:

- Customer SMS notifications.
- Digital receipt generation.
- Advanced sales reports.
- Multiple payment methods.
- Customer order tracking.
- Online payment integration.

These features are outside the initial project scope.

---

## 📜 14. Conclusion

The Laundry Management System aims to replace manual laundry shop operations with a centralized digital platform.

It simplifies customer management, service management, order processing, automatic billing, and payment tracking.

The project demonstrates full-stack Web Engineering concepts through React 19, Node.js, Express.js, PostgreSQL, TypeORM, and Redux Toolkit.

By reducing manual work and improving record management, the system aims to make laundry shop operations more efficient.

---

**Developed as an Open Ended Lab (OEL) Project – Web Engineering Lab, Fall 2026.**
