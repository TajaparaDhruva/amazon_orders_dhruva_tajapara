# VendorFlow 🚀

A full-stack multi-vendor marketplace platform where customers can browse and purchase products while sellers manage inventory, orders, revenue analytics, and shipping operations.

VendorFlow is built using the MERN Stack with a scalable backend architecture, JWT authentication, MongoDB aggregation pipelines, and a modern dashboard-based frontend.

---

# 🌟 Features

## 👤 Customer Features

* User Authentication (JWT)
* Browse Products
* Product Search & Filtering
* Sorting & Pagination
* Add to Cart
* Wishlist System
* Place Orders
* Track Orders
* Order History
* Product Reviews & Ratings
* Profile Management
* Notifications

---

## 🛍️ Seller Features

* Seller Authentication
* Seller Dashboard
* Product CRUD Operations
* Inventory Management
* Order Management
* Shipping Status Updates
* Revenue Analytics
* Sales Reports
* Top Selling Products
* Low Stock Alerts

---

# 📊 Analytics Features

* Monthly Revenue
* Revenue Growth
* Top Selling Products
* Total Orders
* Average Order Value
* Product Performance
* Order Status Analytics
* Sales Trends

---

# 🛠️ Tech Stack

## Frontend

* React + Vite
* Tailwind CSS
* Redux Toolkit
* React Router
* Axios
* Recharts

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

# 📂 Project Structure

## Backend Structure

```bash
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   └── app.js
│
├── package.json
└── server.js
```

---

## Frontend Structure

```bash
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── routes/
│   ├── hooks/
│   ├── services/
│   ├── features/
│   ├── store/
│   └── utils/
│
├── package.json
└── vite.config.js
```

---

# 🔐 Authentication & Authorization

VendorFlow uses JWT-based authentication.

## Roles

* Customer
* Seller

## Security Features

* Password Hashing using bcrypt
* Protected Routes
* JWT Token Verification
* Role-Based Access
* Secure API Handling

---

# 🗄️ Database Collections

```bash
users
products
orders
categories
carts
wishlists
payments
shipments
reviews
notifications
```

---

# ⚙️ Core Functionalities

## Product Management

* Create Product
* Update Product
* Delete Product
* Manage Inventory
* Product Categories

---

## Order System

* Place Orders
* Order Tracking
* Shipping Updates
* Cancel Orders
* Invoice Generation

---

## Advanced Query Features

* Search Functionality
* Filtering
* Sorting
* Pagination
* Regex Search

---

# 📈 MongoDB Aggregation Features

VendorFlow uses MongoDB Aggregation Pipelines for analytics dashboards.

## Implemented Analytics

* Monthly Revenue
* Top Products
* Sales Growth
* Customer Insights
* Revenue Reports

---

# 🎨 Frontend Features

* Responsive UI
* Dashboard Layout
* Dark/Light Theme
* Reusable Components
* Loading Skeletons
* Toast Notifications
* Error Handling UI

---

# 🚀 Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
```

---

## 2️⃣ Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3️⃣ Environment Variables

Create `.env` file inside backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 4️⃣ Run Backend

```bash
npm run dev
```

---

## 5️⃣ Run Frontend

```bash
npm run dev
```

---

# 🔥 API Features

## Authentication APIs

* Register
* Login
* Logout
* Forgot Password

## Product APIs

* Create Product
* Update Product
* Delete Product
* Get Products
* Search Products

## Order APIs

* Create Order
* Track Order
* Update Order Status
* Order History

## Analytics APIs

* Revenue Analytics
* Top Products
* Sales Reports

---

# 📦 Deployment

## Frontend Deployment

* Vercel

## Backend Deployment

* Render / Railway

## Database

* MongoDB Atlas

---

# 📌 Future Improvements

* Payment Gateway Integration
* Real-time Notifications
* AI-Based Recommendations
* Advanced Seller Insights
* Product Image Upload
* Email Notifications

---

# 🧠 Learning Outcomes

This project demonstrates:

* Full Stack MERN Development
* Scalable Backend Architecture
* JWT Authentication
* MongoDB Aggregation
* REST API Development
* Redux State Management
* Dashboard UI Development
* Advanced Query Optimization

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---


# 👨‍💻 Author

Developed by Dhruva Tajapara 🚀
