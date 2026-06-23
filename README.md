<div align="center">

# &nbsp;NOVA

**A full-stack e-commerce platform built for speed, simplicity, and scale.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge&logo=vercel)](https://e-commerce-app-two-xi.vercel.app)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)

> 🚀 **[Try it live →](https://e-commerce-app-two-xi.vercel.app)**

</div>

---

## What is NOVA?

NOVA is a production-grade e-commerce web application built on the MERN stack. It covers the full shopping lifecycle — browsing and searching products, managing a cart and wishlist, placing orders, and paying securely via Razorpay — alongside a complete admin dashboard for inventory, order, and user management.

---

## Features

### Storefront
- Product listing with **search**, **category filtering**, and **sort** (price, rating, newest)
- Individual product pages with image gallery, description, stock status, and reviews
- **Wishlist** — save products across sessions
- **Cart management** — add, remove, update quantity, view running total
- Responsive design across mobile, tablet, and desktop

### Authentication & Accounts
- **JWT-based authentication** with HTTP-only cookies for secure session management
- **Role-based access control** — separate flows for customers and admins
- Password encryption with bcrypt
- Protected routes on both frontend and backend
- User profile with order history and saved addresses

### Checkout & Payments
- **Razorpay payment gateway** integration for card, UPI, net banking, and wallets
- Order summary with itemised breakdown, delivery charges, and applied coupons
- Order confirmation page with order ID and estimated delivery

### Admin Dashboard
- **Product management** — add, edit, delete products with Cloudinary image upload and optimisation
- **Order management** — view all orders, update fulfilment status, filter by status
- **Inventory tracking** — stock level monitoring with low-stock alerts
- **User management** — view registered users, manage roles
- **AI Assistant** — conversational chatbot embedded in the dashboard; ask questions like "Which products are low on stock?" or "How many orders were placed this week?" and get instant answers from your live store data
- Sales overview with order count and revenue figures

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, HTML5, CSS3 |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (HTTP-only cookies), bcrypt |
| Payments | Razorpay |
| Image Storage | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
nova/
├── frontend/                    # React.js client
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx
│   │   │       └── Users.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── context/
│   │       ├── AuthContext.jsx
│   │       └── CartContext.jsx
│
└── backend/                     # Express.js API
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── users.js
    │   └── payments.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Order.js
    ├── middleware/
    │   ├── auth.js              # JWT verification
    │   └── adminOnly.js         # Role guard
    └── utils/
        ├── cloudinary.js
        └── razorpay.js
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Razorpay account ([sign up free](https://dashboard.razorpay.com/signup))
- Cloudinary account ([sign up free](https://cloudinary.com/users/register_free))

### 1 — Clone

```bash
git clone https://github.com/your-username/nova.git
cd nova
```

### 2 — Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nova
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 3 — Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables Reference

### Backend

| Variable | Description |
|---|---|
| `PORT` | Express server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `CLIENT_URL` | Frontend URL (CORS origin) |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend REST API base URL |
| `REACT_APP_RAZORPAY_KEY_ID` | Razorpay public key (for client-side checkout) |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET` | `/api/auth/me` | Get current authenticated user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products (supports search, filter, sort) |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/products` | Create product *(admin only)* |
| `PUT` | `/api/products/:id` | Update product *(admin only)* |
| `DELETE` | `/api/products/:id` | Delete product *(admin only)* |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/my` | Get current user's orders |
| `GET` | `/api/orders` | Get all orders *(admin only)* |
| `PUT` | `/api/orders/:id/status` | Update order status *(admin only)* |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments/create-order` | Create Razorpay order |
| `POST` | `/api/payments/verify` | Verify payment signature |

---

## Contributing

Pull requests are welcome. For significant changes please open an issue first.

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

<div align="center">

Built with the MERN stack by **Ananya** &nbsp;·&nbsp; [Live Demo](https://e-commerce-app-two-xi.vercel.app)

</div>
