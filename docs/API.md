# API Endpoint Documentation

Base URL: `http://localhost:5000/api`  
All endpoints except login require the header `Authorization: Bearer <token>`.  
Errors return `{ "message": "..." }` with status 400 (validation), 401 (not logged in), 404 (not found).

List endpoints accept: `search`, `sortBy`, `order` (ASC/DESC), `page`, `limit` (max 100) and return
`{ data, total, page, limit, totalPages }`.

## Authentication
| Method | Endpoint | Description | Body |
|---|---|---|---|
| POST | /auth/login | Admin login, returns `{ token, admin }` | `{ email, password }` |
| GET | /auth/me | Current admin | - |

## Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | /dashboard | totalCustomers, totalOrders, pending/inProgress/completed/delivered orders, paidBills, unpaidBills, totalRevenue |

## Customers
| Method | Endpoint | Description | Notes |
|---|---|---|---|
| GET | /customers | List | `search` (name/phone), `sortBy` = name \| date |
| POST | /customers | Create | `{ name, phone, address? }` |
| GET | /customers/:id | Get one | |
| PUT | /customers/:id | Update | same body |
| DELETE | /customers/:id | Delete (and their orders/payments) | |

## Services
| Method | Endpoint | Description | Notes |
|---|---|---|---|
| GET | /services | List | `search`, `sortBy` = name \| amount |
| POST | /services | Create | `{ name, price }` |
| GET | /services/:id | Get one | |
| PUT | /services/:id | Update | |
| DELETE | /services/:id | Delete | Blocked if used by orders |

## Orders
| Method | Endpoint | Description | Notes |
|---|---|---|---|
| GET | /orders | List with customer, service, payment | `search` (name/phone/order #), `status`, `sortBy` = date \| amount \| delivery |
| POST | /orders | Create (also creates an Unpaid payment) | `{ customerId, serviceId, quantity, pricePerItem, orderDate, expectedDeliveryDate, status? }` |
| GET | /orders/:id | Get one | |
| PUT | /orders/:id | Update | Paid orders: bill amount cannot change |
| PATCH | /orders/:id/status | Change status only | `{ status }` |
| DELETE | /orders/:id | Delete (and its payment) | |

`totalBill = quantity x pricePerItem` is calculated on the server.

## Payments
| Method | Endpoint | Description | Notes |
|---|---|---|---|
| GET | /payments | List payments with order/customer | `status` = Paid \| Unpaid, `search`, `sortBy` = date \| amount \| paid |
| PATCH | /payments/:id/pay | Record cash payment, mark Paid | `{ amount? }` - must equal the bill |
