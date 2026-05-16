# ApniMeal: A Hyper-Local Food Marketplace

ApniMeal is a specialized MERN stack application designed to bridge the gap between university hostel students and home cooks in neighboring village communities. It provides a platform for students to access nutritious, home-cooked meals while empowering local residents to digitize and grow their culinary businesses.

---

## 🌐 Live Deployment

### Frontend (AWS S3)

http://apnimeal.s3-website-us-east-1.amazonaws.com/

### Backend (AWS EC2 + Elastic IP)

Hosted on AWS EC2 with MongoDB integration.

---

## 🚀 Features

### For Students

* **Secure Authentication:** JWT-based signup and login.
* **Food Discovery:** Search for home-cooked dishes using MongoDB Text Indexing.
* **Order Management:** Place orders and track their lifecycle in real-time.
* **Order History:** View a persistent record of all past and active transactions.
* **Cart System:** Add and manage food items before checkout.

### For Cooks

* **Food Cataloging:** Create, update, and manage a digital menu with pricing and descriptions.
* **Order Dashboard:** Manage incoming orders through a state-driven machine:

  * Pending → Accepted → Preparing → Delivered
* **Sales Tracking:** View a dedicated dashboard for business performance.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* React Toastify
* Context API

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* Bcrypt Password Hashing

### Cloud & Deployment

* AWS EC2 (Backend)
* AWS S3 Static Hosting (Frontend)
* MongoDB Atlas

---

## 🛡️ Security & Optimization

* **Password Hashing:** Uses Bcrypt with 10 salt rounds.
* **Stateless Authentication:** Secure communication using JSON Web Tokens.
* **RBAC:** Role-Based Access Control for Students and Cooks.

---

## 🚦 Getting Started

### Prerequisites

* Node.js (v18.x or higher)
* NPM (v9.x or higher)
* MongoDB Atlas account or local MongoDB instance

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-organization/apnimeal.git
cd apnimeal
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint              | Description         | Access       |
| ------ | --------------------- | ------------------- | ------------ |
| POST   | `/api/users/register` | User registration   | Public       |
| POST   | `/api/users/login`    | User login          | Public       |
| GET    | `/api/foods`          | Get all food items  | Student/Cook |
| POST   | `/api/foods`          | Add new food item   | Cook Only    |
| POST   | `/api/orders`         | Place new order     | Student Only |
| PATCH  | `/api/orders/:id`     | Update order status | Cook Only    |
| GET    | `/api/cart`           | Fetch user cart     | Student      |

---

## ☁️ Deployment Architecture

```text
React Frontend (AWS S3)
        ↓
API Requests
        ↓
Node.js + Express Backend (AWS EC2)
        ↓
MongoDB Atlas Database
```

---

## 📌 Future Improvements

* Razorpay payment integration
* Image uploading for the foods
* Real-time order notifications
* Mobile responsiveness enhancements

---

## 👨‍💻 Author

Developed as a MERN Stack project focused on solving hyper-local food accessibility for hostel students while empowering rural home cooks through digital platforms.
