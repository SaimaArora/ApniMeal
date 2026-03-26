# ApniMeal: A Hyper-Local Food Marketplace

ApniMeal is a specialized MERN stack application designed to bridge the gap between university hostel students and home cooks in neighboring village communities. It provides a platform for students to access nutritious, home-cooked meals while empowering local residents to digitize and grow their culinary businesses.

## 🚀 Features

### For Students
* **Secure Authentication:** JWT-based signup and login.
* **Food Discovery:** Search for home-cooked dishes using MongoDB Text Indexing.
* **Order Management:** Place orders and track their lifecycle in real-time.
* **Order History:** View a persistent record of all past and active transactions.

### For Cooks
* **Food Cataloging:** Create, update, and manage a digital menu with pricing and descriptions.
* **Order Dashboard:** Manage incoming orders through a state-driven machine (Pending → Accepted → Preparing → Delivered).
* **Sales Tracking:** View a dedicated dashboard for business performance.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Component-based UI, Custom Hooks for Auth)
* **Backend:** Node.js & Express.js (Asynchronous order processing)
* **Database:** MongoDB (Flexible document schemas, Text Indexing)
* **Security:** Bcrypt (Password hashing), JWT (Stateless authentication), and RBAC (Role-Based Access Control)

---

## 🚦 Getting Started

### Prerequisites
* Node.js (v16.x or higher)
* NPM (v7.x or higher)
* MongoDB Atlas account or a local MongoDB instance

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-organization/apnimeal.git
    cd apnimeal
    ```

2.  **Setup the Server**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `/server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_secret_key
    ```
    Start the backend:
    ```bash
    npm run dev
    ```

3.  **Setup the Client**
    ```bash
    cd ../client
    npm install
    npm start
    ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | User signup | Public |
| POST | `/api/auth/login` | User login & Token issuance | Public |
| GET | `/api/food` | Search/List food items | Student/Cook |
| POST | `/api/food` | Create new food listing | Cook Only |
| POST | `/api/orders` | Place a new order | Student Only |
| PATCH | `/api/orders/:id` | Update order status | Cook Only |

---

## 🛡️ Security & Optimization
* **Password Hashing:** Uses Bcrypt with 10 salt rounds.
* **Stateless Auth:** Secure communication using JSON Web Tokens.
* **Performance:** Implements `useAuth` custom hooks on the frontend to prevent redundant re-renders and centralized error-handling middleware on the backend.
* **Search:** Optimized via MongoDB Compound Text Indexes on food titles and descriptions.
