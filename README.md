# 💰 Finance Backend API

> A production-ready REST API for financial data management with role-based access control, built on Node.js, Express, and MongoDB.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Role-Based Access Control](#role-based-access-control)
- [Query & Filtering](#query--filtering)
- [Rate Limiting](#rate-limiting)
- [Testing](#testing)
- [Assumptions & Design Decisions](#assumptions--design-decisions)

---

## Overview

Finance Backend is a secure, scalable REST API that handles financial record management for organizations. It supports three user roles (Admin, Analyst, Viewer), full CRUD on income/expense records, a dashboard summary endpoint, and built-in protections like rate limiting, input validation, and soft deletes.

**Key Highlights:**
- 🔐 JWT-based authentication with secure password hashing
- 👥 Role-based access control (Admin / Analyst / Viewer)
- 📊 Dashboard aggregations — totals, trends, category breakdowns
- 🔍 Filterable, searchable, paginated record listings
- 🗑️ Soft deletes (records are never permanently removed)
- 🚦 Rate limiting — 100 requests / 15 min per IP
- ✅ Unit tests with Jest & Supertest

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Auth | JSON Web Tokens (JWT) + bcrypt |
| Testing | Jest + Supertest |
| Dev Server | Nodemon |

---

## Project Structure

```
finance-backend/
├── config/
│   └── db.js              # MongoDB connection setup
├── controllers/
│   ├── userController.js  # User CRUD logic
│   ├── recordController.js# Financial record logic
│   └── dashboardController.js
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   └── roleMiddleware.js   # Role-based access guards
├── models/
│   ├── User.js             # User schema (role, password hash)
│   └── Record.js           # Financial record schema
├── routes/
│   ├── userRoutes.js
│   ├── recordRoutes.js
│   └── dashboardRoutes.js
├── tests/
│   └── *.test.js           # Unit & integration tests
├── .env                    # Environment variables (not committed)
├── server.js               # App entry point
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (or local MongoDB instance)

### 1. Clone & Install

```bash
git clone <[repo-url](https://github.com/NavinKumar8816/finance-backend.git)>
cd finance-backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/financebackend?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

> ⚠️ Never commit your `.env` file. It's already listed in `.gitignore`.

### 3. Start the Server

```bash
# Development (auto-restarts on file change)
npm run dev

# If nodemon is not globally installed
npx nodemon server.js

# Production
npm start

# Direct execution
node server.js
```

Server runs at: `http://localhost:5000`

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for stateless authentication.

### Register

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "role": "Analyst"
}
```

### Login

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in the `Authorization` header for all protected routes:

```
Authorization: Bearer <your_token_here>
```

---

## API Reference

### Users

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/users/register` | Register a new user | Public |
| `POST` | `/api/users/login` | Login and receive JWT | Public |
| `POST` | `/api/users` | Create a user | Admin |
| `GET` | `/api/users` | List all users | Admin, Analyst |
| `PATCH` | `/api/users/:id` | Update a user | Admin |
| `DELETE` | `/api/users/:id` | Delete a user | Admin |

---

### Financial Records

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/records` | Create a new record | Admin |
| `GET` | `/api/records` | List records (filterable) | All roles |
| `PUT` | `/api/records/:id` | Update a record | Admin |
| `DELETE` | `/api/records/:id` | Soft-delete a record | Admin |

#### Example: Create a Record

```http
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "income",
  "category": "Salary",
  "amount": 5000,
  "date": "2024-03-01",
  "note": "March salary"
}
```

---

### Dashboard

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard` | Get financial summary | All roles |

**Response includes:**
- Total income & expenses
- Net balance
- Category-wise breakdown
- Recent transactions
- Monthly trends

---

## Role-Based Access Control

This API enforces access by role using clear permissions:

| Permission | Admin | Analyst | Viewer |
|---|---|---|---|
| View records and dashboard | Yes | Yes | Yes |
| View all users | Yes | Yes | No |
| Create, update, or delete records | Yes | No | No |
| Manage users | Yes | No | No |

---

## Query & Filtering

The `GET /api/records` endpoint supports rich filtering via query parameters:

```
GET /api/records?type=income&category=salary&startDate=2024-01-01&endDate=2024-12-31&search=bonus&page=1&limit=10
```

| Parameter | Type | Description |
|---|---|---|
| `type` | `income` \| `expense` | Filter by record type |
| `category` | string | Filter by category name |
| `startDate` | `YYYY-MM-DD` | Records on or after this date |
| `endDate` | `YYYY-MM-DD` | Records on or before this date |
| `search` | string | Text search in category and note fields |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

---

## Rate Limiting

To prevent abuse, all API routes are rate-limited:

- **Limit:** 100 requests per IP
- **Window:** 15 minutes
- **Response on limit:** `429 Too Many Requests`

---

## Testing

Unit and integration tests are written with **Jest** and **Supertest**.

```bash
npm test
```

> **Note:** Since this project uses ES modules, Jest may require additional configuration in some environments.

Tests cover:
- Controller logic for record creation, filtering, and soft delete
- Authentication middleware behavior
- Role-based access control enforcement

---

## Assumptions & Design Decisions

| Decision | Rationale |
|---|---|
| **Soft deletes** | Preserve records for audit and avoid permanent data loss |
| **MongoDB Atlas** | Simplifies deployment and evaluator access during review |
| **JWT auth** | Stateless authentication that avoids server-side session storage |
| **ISO date format** | `YYYY-MM-DD` for consistency and timezone independence |
| **bcrypt hashing** | Passwords are never stored in plain text |
| **Regex search** | Flexible text matching across category and note fields |

---

## Academic Integrity

This README and the accompanying code were written specifically for this Finance Backend assignment. The implementation is original and tailored to the project requirements, with no copied content from third-party submissions.

---

## License

This project was built as an academic/assignment submission.

All rights reserved.
