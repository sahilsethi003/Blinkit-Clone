# Grocify - Full-Stack Blinkit Clone (MERN)

[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-64748B.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4-000000.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF.svg?logo=stripe)](https://stripe.com/)

Grocify is a modern, high-performance, and feature-rich full-stack e-commerce application modeled after the popular instant grocery delivery app **Blinkit**. Built using the MERN stack (MongoDB, Express, React, Node.js), this project demonstrates a highly responsive storefront, robust state management, a comprehensive admin dashboard, secure JWT authentication with email validation, and Stripe payment integration.

---

## 🚀 Key Features

### 🛒 Customer Storefront & Navigation
*   **Dynamic Product Catalog:** Categorized and sub-categorized grocery catalog with search & filter capabilities.
*   **Isolated Product Interactions:** Smooth image zoom and title hover effects scoped independently per product card.
*   **Blinkit-Style Header:** Clean navbar featuring an instant search bar, location picker, Blinkit-style crisp white pill **Login** badge, and a login-guarded **My Cart** button.
*   **Interactive Cart System:** Instant item additions, quantity modifications, price summaries, and real-time validation.
*   **Stripe Checkout:** Secure payment processing with Stripe checkout sessions, order logging, and callback handling.
*   **Address Management:** Save, retrieve, and select multiple shipping addresses.
*   **Order History:** Detailed view of past orders with invoice summaries.

### 🔐 Security & Auth System
*   **Double-Token JWT Auth Architecture:**
    *   **Access Token:** Short-lived token (`5 Hours` validity) signed with `SECRET_KEY_ACCESS_TOKEN`.
    *   **Refresh Token:** Long-lived token (`7 Days` validity) signed with `SECRET_KEY_REFRESH_TOKEN` and persisted in MongoDB.
*   **Fresh Light Glassmorphism Auth UI:** Standardized light-themed authentication container (`AuthLayout.jsx`) with ambient glowing mint/amber light orbs, geometric grid overlay, and floating grocery/security badges across **Login**, **Register**, **Forgot Password**, **OTP Verification**, and **Reset Password** pages.
*   **Email Verification:** Registration validation and account verification emails powered by **Resend**.
*   **Password Reset Pipeline:** 6-digit numeric OTP-based verification flow for forgotten passwords.
*   **Secure API Access:** Helmet protection, CORS policy limits, and standard sanitization middleware.

### 🛡️ Admin Dashboard
*   **Category & Subcategory Management:** Add and manage categories with custom images.
*   **Product Manager:** Create, update, and upload products using a high-performance grid table powered by **TanStack Table**.
*   **Cloudinary Image Uploads:** Instant media uploads via Cloudinary with dynamic base64 fallbacks.

---

## 🛠️ Tech Stack

### Client (Frontend)
*   **Framework:** React (Vite, ES Modules)
*   **State Management:** Redux Toolkit & React-Redux
*   **Routing:** React Router DOM (v6)
*   **Styling:** TailwindCSS (Vanilla PostCSS config)
*   **Forms & Validation:** React Hook Form
*   **Table Data Grid:** TanStack React Table (v8)
*   **Feedback & Popups:** SweetAlert2 & React Hot Toast
*   **HTTP Client:** Axios (Interceptors for credentials sharing)

### Server (Backend)
*   **Runtime:** Node.js (Express framework)
*   **Database:** MongoDB via Mongoose ODM
*   **Authentication:** JSON Web Tokens (Access Token: `5h`, Refresh Token: `7d`)
*   **File Handling:** Multer (Memory Storage) & Cloudinary Node SDK
*   **Emails:** Resend API
*   **Security:** Helmet, CORS, Cookie Parser, BcryptJS

---

## 📁 Project Structure

```
BlinkIt-Clone-Full-Stack-Ecommerce/
│
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Cart, Header, CardProduct, etc.)
│   │   ├── layouts/            # AuthLayout and application wrappers
│   │   ├── pages/              # Page views (Home, Login, Register, Checkout, Admin, etc.)
│   │   ├── store/              # Redux slices and store configuration
│   │   ├── utils/              # Client-side helpers and API configurations
│   │   └── App.jsx             # Main Application Routing
│   ├── .env                    # Client Environment variables
│   └── package.json            
│
├── server/                     # Express Backend
│   ├── config/                 # Mongoose DB connection scripts
│   ├── controllers/            # Controller logic (Auth, Product, Orders)
│   ├── middleware/             # Route guards (Auth, Admin verification)
│   ├── models/                 # Mongoose schemas (User, Product, Order)
│   ├── route/                  # REST APIs endpoints mapping
│   ├── utils/                  # Token generators (5h access / 7d refresh) & email templates
│   ├── seed.js                 # Initial Database Seed Script
│   ├── vercel.json             # Deployment settings
│   ├── .env                    # Server Environment variables
│   └── package.json            
│
└── README.md                   # Project documentation
```

---

## ⚙️ Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/BlinkIt-Clone-Full-Stack-Ecommerce.git
cd BlinkIt-Clone-Full-Stack-Ecommerce
```

### 2. Configure Environment Variables
You will need to set up environment variables for both the **client** and **server** directories.

#### Server Settings (`server/.env`)
Create a file named `.env` inside the `server/` directory:
```env
PORT=8080
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/blinkit-clone

SECRET_KEY_ACCESS_TOKEN=your_jwt_access_secret_key
SECRET_KEY_REFRESH_TOKEN=your_jwt_refresh_secret_key

RESEND_API=re_your_resend_api_key

CLODINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLODINARY_API_KEY=your_cloudinary_api_key
CLODINARY_API_SECRET_KEY=your_cloudinary_api_secret_key

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_ENPOINT_WEBHOOK_SECRET_KEY=whsec_your_stripe_webhook_secret_key
```

#### Client Settings (`client/.env`)
Create a file named `.env` inside the `client/` directory:
```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
```

### 3. Install Dependencies & Run

#### Backend Setup
Open a terminal in the root directory:
```bash
cd server
npm install
# Seed the initial mock product catalog data (optional)
npm run seed
# Start development server
npm run dev
```

#### Frontend Setup
Open a second terminal window in the root directory:
```bash
cd client
npm install
# Start development client
npm run dev
```

Your storefront will be running at [http://localhost:5173](http://localhost:5173) and your server at [http://localhost:8080](http://localhost:8080).

---

## 📊 Database Seeding
To populate your newly created MongoDB instance with dummy products, categories, and subcategories, run:
```bash
cd server
npm run seed
```

---

## 🛡️ License
Distributed under the ISC License. See `LICENSE` for more information.