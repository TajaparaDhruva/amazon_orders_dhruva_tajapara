<div align="center">

<img src="https://img.shields.io/badge/VenderFlow-Your%20Orders.%20Your%20Insights.%20In%20Flow.-1e293b?style=for-the-badge&logo=shoppingcart&logoColor=10b981" alt="VenderFlow Banner" width="100%"/>

# 📦 VenderFlow

### *Your Orders. Your Insights. In Flow.*

**E-Commerce Order & Vendor Management Dashboard** — Manage, Analyze & Track 10,000+ orders across products, customers, sellers, and categories — all in one powerful platform.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Coming%20Soon-4f46e5?style=for-the-badge)]()
[![Frontend](https://img.shields.io/badge/▲%20Vercel-Frontend%20Deploy-000000?style=for-the-badge&logo=vercel)]()
[![Backend](https://img.shields.io/badge/🚀%20Render-Backend%20API-46e3b7?style=for-the-badge&logo=render)]()
[![YouTube](https://img.shields.io/badge/▶%20YouTube-Demo%20Video-FF0000?style=for-the-badge&logo=youtube)]()
[![GitHub Repo](https://img.shields.io/badge/⭐%20GitHub-Source%20Code-181717?style=for-the-badge&logo=github)]()

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 🔗 Quick Links

| Resource | Link |
|---|---|
| 🌐 **Live App (Production)** | Coming Soon |
| ▲ **Frontend Deploy (Vercel)** | Coming Soon |
| 🚀 **Backend API (Render)** | Coming Soon |
| 📦 **Frontend Repository** | Coming Soon |
| 🗄️ **Backend Repository** | Coming Soon |
| ▶️ **YouTube Demo** | Coming Soon |
| 📄 **API Health Check** | Coming Soon |

---

## 📖 About the Project

**VenderFlow** is a full-stack e-commerce order management and analytics dashboard built for admins, business analysts, and users who need fast, structured access to order data. It manages **10,000+ order records** across **products, customers, sellers, categories, and geographies** — all inside a single clean, role-based dashboard interface.

Built over 30 days (13 May – 13 June 2026) as a production-grade MERN application with:

- Role-based access control (Admin & User)
- Full-text search across orders, products, and customers
- Advanced filtering by category, status, country, payment method, and date range
- Admin analytics dashboard with Recharts visualizations (revenue trends, top products, geographic breakdown)
- CI/CD via GitHub Actions → Vercel (frontend) + Render (backend)

---

## 🎬 Demo

<div align="center">

[![VenderFlow Demo Video](https://img.shields.io/badge/▶%20Watch%20Full%20Demo%20on%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)]()

> Demo video coming soon.

</div>

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server & routing |
| **MongoDB Atlas** | Cloud NoSQL database (M0 free → M2 production) |
| **Mongoose** | ODM — schema modeling & query building |
| **JWT + bcryptjs** | Authentication & password hashing (saltRounds: 12) |
| **express-validator** | Request input validation & sanitization |
| **Helmet.js** | Security HTTP headers |
| **express-rate-limit** | Rate limiting (100 req / 15 min) |
| **Morgan** | HTTP request logging |
| **GitHub Actions** | CI/CD pipeline — lint → test → deploy |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 (Vite)** | Component-based UI framework |
| **Tailwind CSS + MUI** | Utility-first styling + Material Design components |
| **Redux Toolkit** | Global state management |
| **React Router v6** | Client-side routing with protected routes |
| **Axios** | HTTP client with interceptors |
| **Formik + Yup** | Form handling & schema validation |
| **Recharts** | Data visualization — bar, line, pie charts |

### Deployment & Infrastructure
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting with instant CDN |
| **Render** | Backend Node.js hosting |
| **MongoDB Atlas** | Managed cloud database |
| **GitHub Actions** | Automated CI/CD pipelines |

---

## ✨ Features

### 👤 User Features
- 🔐 **JWT Authentication** — Secure register/login with token-based sessions
- 📦 **Orders Browser** — Browse all orders with live pagination and search
- 🔍 **Full-Text Search** — Search across orders, products, and customers with debounce (300ms)
- 🗂️ **Advanced Filters** — Filter by category, status, country, payment method, and date range
- 📋 **Order Detail View** — Full order information: product, customer, pricing, shipping, and status
- 🏷️ **Products Catalog** — Browse all products with category and brand filters
- 👥 **Customers & Sellers** — View customer and seller profiles with order history
- 👤 **Profile Management** — Edit name, email; change password securely
- 🌙 **Dark / Light Mode** — Theme toggle persisted via localStorage

### 🛡️ Admin Features
- 📊 **Analytics Dashboard** — Live stats: total orders, total revenue, customers, sellers
- 📈 **Recharts Visualizations** — Bar (revenue by category), Line (monthly revenue trend), Pie (orders by status), Bar (top products/customers/sellers), Pie (payment methods), Bar (geographic distribution)
- 📦 **Order Management** — Full CRUD: create, edit, update status, soft delete orders
- 🏷️ **Product Management** — Create, update, and manage product records
- 👥 **Customer Management** — View, edit, and manage customer profiles
- 🏪 **Seller Management** — View, manage, and track seller revenue
- 👤 **User Management** — CRUD app users, toggle roles (admin/user), activate/deactivate
- 🗂️ **Audit Logs** — All admin mutations tracked with IP and timestamp

### ⚙️ Platform Features
- 🔐 **RBAC** — Role-based access control (`admin` | `user`)
- 📄 **Pagination** — All listing endpoints paginated (configurable limit)
- 🛡️ **Security** — Helmet, rate limiting, CORS whitelist, parameterized queries
- 📡 **Standard API Responses** — Consistent `success/message/data/meta` envelope
- 🔄 **Idempotent Seeding** — Safe re-run seeder using `bulkWrite` upserts
- 📱 **Responsive Design** — Desktop-first with mobile and tablet optimization

---

## 📊 Dataset Coverage

VenderFlow is powered by a real-world Amazon Orders dataset with **10,000+ order records**:

| Field | Values / Range |
|---|---|
| 📦 **Order Statuses** | Delivered, Pending, Processing, Shipped, Cancelled, Returned |
| 🏷️ **Categories** | Books, Clothing, Home & Kitchen, Electronics, and more |
| 💳 **Payment Methods** | Debit Card, Credit Card, Amazon Pay, UPI, Net Banking |
| 🌍 **Countries** | India, United States, and more |
| 🏪 **Sellers** | 1,900+ unique seller IDs |
| 👥 **Customers** | 1,000+ unique customer profiles |
| 🛍️ **Products** | 50+ unique products across multiple brands |
| 📅 **Date Range** | 2022 – 2023 order history |

---

## 🏗 Architecture

```
                    ┌──────────────────────┐
                    │       Vercel          │
                    │   (Frontend Hosting)  │
                    │   React 18 + Vite     │
                    └──────────┬───────────┘
                               │ HTTPS (REST)
                    ┌──────────▼───────────┐
                    │       Render          │
                    │   (Backend Hosting)   │
                    │   Node.js + Express   │
                    └──────────┬───────────┘
                               │ Mongoose Driver
                    ┌──────────▼───────────┐
                    │    MongoDB Atlas      │
                    │  (Cloud Database)     │
                    └──────────────────────┘

CI/CD: GitHub → Actions → lint → test → deploy
```

### Middleware Chain

```
Request → morgan → helmet → cors → express.json
       → verifyToken → roleGuard → validate → controller → response
```

### Authentication Flow

```
POST /register → bcrypt hash (saltRounds: 12) → create user → JWT (7d)
POST /login    → verify password              → JWT issued  → store in localStorage
Protected APIs → Authorization: Bearer <token> → verifyToken middleware
POST /logout   → client clears token
```

---

## 📡 API Documentation

**Base URL:** `/api/v1`

All responses follow this envelope:

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 10000,
    "totalPages": 500
  }
}
```

### 🔐 Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `GET` | `/auth/me` | Protected | Get current user profile |
| `POST` | `/auth/logout` | Protected | Logout and invalidate token |

### 📦 Orders Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/orders` | Protected | All orders — paginated, filterable, sortable |
| `GET` | `/orders/:id` | Protected | Single order by ID |
| `GET` | `/orders/recent` | Protected | Last 20 orders (newest first) |
| `GET` | `/orders/by-status/:status` | Protected | Filter orders by status |
| `POST` | `/orders` | Admin | Create new order |
| `PUT` | `/orders/:id` | Admin | Full update of order |
| `PATCH` | `/orders/:id` | Admin | Partial update (e.g. status change) |
| `DELETE` | `/orders/:id` | Admin | Soft delete (`isDeleted: true`) |

**Query Parameters:**
```
?category=Books              — filter by category
?orderStatus=Delivered       — filter by status
?country=India               — filter by country
?sellerId=SELL01967          — filter by seller
?paymentMethod=Debit+Card    — filter by payment method
?page=1&limit=20             — pagination
?sortBy=orderDate&sortOrder=desc
?q=Drone                     — full-text search
?startDate=2023-01-01&endDate=2023-12-31
?minAmount=100&maxAmount=500 — price range filter
?category=Books,Clothing     — multi-value filter
```

### 🏷️ Products Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Protected | All products — paginated, filterable |
| `GET` | `/products/:productId` | Protected | Single product details |
| `GET` | `/products/categories` | Protected | All unique categories |
| `GET` | `/products/brands` | Protected | All unique brands |
| `GET` | `/products/top-selling` | Protected | Top 10 products by order count |
| `POST` | `/products` | Admin | Create product record |
| `PATCH` | `/products/:productId` | Admin | Update product info |
| `DELETE` | `/products/:productId` | Admin | Soft delete |

### 👥 Customers Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/customers` | Protected | All customers — paginated, searchable |
| `GET` | `/customers/:customerId` | Protected | Customer details + order history |
| `GET` | `/customers/top` | Admin | Top customers by total spend |
| `PATCH` | `/customers/:customerId` | Admin | Update customer info |
| `DELETE` | `/customers/:customerId` | Admin | Soft delete |

### 🏪 Sellers Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/sellers` | Protected | All sellers — paginated |
| `GET` | `/sellers/:sellerId` | Protected | Seller details + revenue |
| `GET` | `/sellers/top` | Admin | Top 10 sellers by revenue |
| `PATCH` | `/sellers/:sellerId` | Admin | Update seller info |

### 🔍 Search Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/search?q=` | Protected | Global search across orders, products, customers |
| `GET` | `/search/orders?q=` | Protected | Search within orders |
| `GET` | `/search/products?q=` | Protected | Search within products |

### 👤 Users Endpoints (Admin)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | Admin | List all users (paginated) |
| `GET` | `/users/:id` | Admin | Get single user |
| `PATCH` | `/users/:id/role` | Admin | Update user role |
| `PATCH` | `/users/:id/status` | Admin | Toggle active/inactive |
| `DELETE` | `/users/:id` | Admin | Soft delete user |
| `GET` | `/users/stats` | Admin | User counts aggregation |
| `PATCH` | `/users/me` | Protected | Self-profile update + password change |

### 📊 Analytics Endpoints (Admin)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/analytics/overview` | Admin | Total orders, revenue, customers, sellers |
| `GET` | `/analytics/revenue-by-category` | Admin | Revenue breakdown per category |
| `GET` | `/analytics/orders-by-status` | Admin | Order count per status |
| `GET` | `/analytics/orders-by-country` | Admin | Geographic distribution |
| `GET` | `/analytics/revenue-trend` | Admin | Monthly revenue over time |
| `GET` | `/analytics/top-products` | Admin | Top 10 products by revenue |
| `GET` | `/analytics/top-customers` | Admin | Top 10 customers by spend |
| `GET` | `/analytics/top-sellers` | Admin | Top 10 sellers by revenue |
| `GET` | `/analytics/payment-methods` | Admin | Order distribution by payment type |

### ⚙️ System

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server health check |

---

## 🗄 Database Design

### Collections Overview

```
orders     — Primary collection: all 10,000+ order records
products   — Derived: unique products with aggregated stats
customers  — Derived: unique customers with totals
sellers    — Derived: unique sellers with revenue stats
users      — Auth, roles, profile
auditLogs  — Admin mutation tracking with IP
```

### Relationships

```
orders  ── (customerId) ──► customers
orders  ── (productId)  ──► products
orders  ── (sellerId)   ──► sellers
users   ── (admin)      ──► auditLogs
```

### Orders Schema (Primary)

```json
{
  "orderId":       "string (unique, required — e.g. 'ORD0000001')",
  "orderDate":     "Date (required)",
  "customerId":    "string (required)",
  "customerName":  "string (required)",
  "productId":     "string (required)",
  "productName":   "string (required)",
  "category":      "string (required)",
  "brand":         "string (required)",
  "quantity":      "number (required, min: 1)",
  "unitPrice":     "number (required, min: 0)",
  "discount":      "number (default: 0, min: 0, max: 1)",
  "tax":           "number (default: 0)",
  "shippingCost":  "number (default: 0)",
  "totalAmount":   "number (required)",
  "paymentMethod": "string (required)",
  "orderStatus":   "enum: ['Pending','Processing','Shipped','Delivered','Cancelled','Returned']",
  "city":          "string",
  "state":         "string",
  "country":       "string",
  "sellerId":      "string (required)",
  "isDeleted":     "boolean, default: false"
}
```

**Indexes:** `orderId` (unique), `customerId`, `sellerId`, `productId`, `category`, `orderStatus`, `orderDate`, `country`, `{ category, orderStatus }` (compound), `{ sellerId, orderDate }` (compound), `$text` on `productName + customerName`

---

## 📁 Project Structure

### Backend

```
venderflow-backend/
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   │   └── v1/
│   ├── middlewares/
│   ├── validators/
│   ├── utils/
│   └── scripts/
│       └── seed.js
├── server.js
├── .env
├── .env.example
└── package.json
```

### Frontend

```
venderflow-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── customers/
│   │   ├── sellers/
│   │   ├── users/
│   │   ├── analytics/
│   │   └── search/
│   ├── hooks/
│   ├── pages/
│   │   ├── public/
│   │   └── dashboard/
│   │       ├── admin/
│   │       └── user/
│   ├── services/
│   ├── store/
│   │   └── slices/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repositories

```bash
# Backend
git clone https://github.com/YOUR_USERNAME/venderflow-backend.git
cd venderflow-backend

# Frontend
git clone https://github.com/YOUR_USERNAME/venderflow-frontend.git
cd venderflow-frontend
```

### 2. Backend Setup

```bash
cd venderflow-backend
npm install
cp .env.example .env
# fill in your .env values

node src/scripts/seed.js        # seed full Amazon Orders dataset
npm run dev                     # runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd venderflow-frontend
npm install
cp .env.example .env
# fill in your .env values

npm run dev                     # runs on http://localhost:5173
```

---

## 🔧 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/venderflow
JWT_SECRET=your-super-strong-random-secret-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=VenderFlow
```

---

## 🌐 Deployment

### Frontend → Vercel

```bash
npm i -g vercel
cd venderflow-frontend
vercel --prod
```

Set `VITE_API_BASE_URL` to your Render backend URL in the Vercel dashboard.

### Backend → Render

1. Push backend repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your `venderflow-backend` repository
4. Build command: `npm install` | Start command: `node server.js`
5. Add all environment variables from `.env`

### CI/CD — GitHub Actions

```
Push to main
  → Lint (ESLint)
  → Test (Jest)
  → Deploy Frontend to Vercel
  → Deploy Backend to Render
```

---

## 🖼 Screenshots

| Page | Preview |
|---|---|
| 🏠 User Dashboard | _(coming soon)_ |
| 📦 Orders Listing | _(coming soon)_ |
| 📋 Order Detail | _(coming soon)_ |
| 🔍 Search Results | _(coming soon)_ |
| 🏷️ Products Catalog | _(coming soon)_ |
| 📊 Admin Dashboard | _(coming soon)_ |
| 📈 Analytics Page | _(coming soon)_ |
| 👥 Admin Users | _(coming soon)_ |

---

## 🔒 Security

- ✅ Helmet.js for secure HTTP headers
- ✅ Rate limiting: 100 requests / 15 minutes per IP
- ✅ bcrypt password hashing (saltRounds: 12)
- ✅ JWT expiry: 7 days (configurable)
- ✅ Input validation via express-validator
- ✅ CORS restricted to whitelisted client URL
- ✅ No raw queries — all access via Mongoose ODM
- ✅ Audit log on all admin mutations with IP tracking
- ✅ Soft deletes — no data is permanently destroyed

---

## 🗺 Roadmap

- [ ] CSV / Excel export for orders and analytics
- [ ] Real-time order status updates (WebSockets)
- [ ] Email notifications on order status change
- [ ] Multi-currency support
- [ ] Seller portal with dedicated login
- [ ] Mobile app (React Native)
- [ ] AI-powered demand forecasting
- [ ] Invoice PDF generation per order
- [ ] Public API access with API key management

---

## 🤝 Contributing

Contributions are welcome! Please follow this workflow:

```bash
git checkout -b feat/your-feature-name
git commit -m "feat(orders): add multi-value category filter"
git push origin feat/your-feature-name
```

Commit convention: `feat | fix | chore | docs | refactor | test`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Built with ❤️ for smart order management**


> *"Your Orders. Your Insights. In Flow."*

⭐ **Star this repo if you found it useful!**

</div>
