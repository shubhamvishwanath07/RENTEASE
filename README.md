# 🏠 RentEase – House Rental Management System

> A full-stack web application built with AngularJS, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
rentease/
├── backend/
│   ├── models/          → MongoDB Mongoose models
│   ├── routes/          → Express API routes
│   ├── middleware/       → JWT auth middleware
│   ├── uploads/         → Uploaded property images
│   ├── server.js        → Main Express server
│   ├── seed.js          → Database seeder
│   ├── .env             → Environment variables
│   └── package.json
└── frontend/
    ├── views/           → AngularJS HTML views
    ├── js/              → app.js, services.js, controllers.js
    ├── css/             → style.css
    └── index.html       → Main SPA shell
```

---

## ⚙️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | AngularJS 1.8, Bootstrap 5, Font Awesome |
| Backend    | Node.js, Express.js |
| Database   | MongoDB + Mongoose  |
| Auth       | JWT (JSON Web Token)|
| File Upload| Multer              |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally (or MongoDB Atlas URI)

### Step 1 – Install Dependencies
```bash
cd rentease/backend
npm install
```

### Step 2 – Configure Environment
Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/rentease
JWT_SECRET=rentease_super_secret_jwt_2024
PORT=5000
```

### Step 3 – Seed the Database
```bash
node seed.js
```

### Step 4 – Start the Server
```bash
node server.js
```

### Step 5 – Open in Browser
```
http://localhost:5000
```

---

## 👤 Demo Login Credentials

| Role   | Email                    | Password     |
|--------|--------------------------|--------------|
| Admin  | admin@rentease.com       | password123  |
| Owner  | rajesh@rentease.com      | password123  |
| Owner  | priya@rentease.com       | password123  |
| Tenant | amit@rentease.com        | password123  |
| Tenant | neha@rentease.com        | password123  |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/auth/register    | Register user      |
| POST   | /api/auth/login       | Login user         |
| GET    | /api/auth/profile     | Get own profile    |
| PUT    | /api/auth/profile     | Update profile     |

### Properties
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/properties                   | Get all (with filters)   |
| GET    | /api/properties/:id               | Get single property      |
| POST   | /api/properties                   | Create (owner only)      |
| PUT    | /api/properties/:id               | Update (owner only)      |
| DELETE | /api/properties/:id               | Delete (owner/admin)     |
| GET    | /api/properties/owner/my-listings | Owner's listings         |

### Bookings
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | /api/bookings                 | Create inquiry           |
| GET    | /api/bookings/my-bookings     | Tenant's bookings        |
| GET    | /api/bookings/owner-inquiries | Owner's inquiries        |
| PUT    | /api/bookings/:id             | Update status            |
| DELETE | /api/bookings/:id             | Cancel booking           |

### Admin
| Method | Endpoint                            | Description          |
|--------|-------------------------------------|----------------------|
| GET    | /api/admin/stats                    | Platform stats       |
| GET    | /api/admin/users                    | All users            |
| DELETE | /api/admin/users/:id                | Delete user          |
| GET    | /api/admin/properties               | All properties       |
| PUT    | /api/admin/properties/:id/approve   | Approve/reject       |
| DELETE | /api/admin/properties/:id           | Delete property      |

---

## ✅ Features Implemented

- [x] User Registration & Login with JWT Authentication
- [x] Role-based access (Tenant / Owner / Admin)
- [x] Property Listings with image gallery
- [x] Search & Filters (city, BHK, furnished, price range)
- [x] Featured Properties section
- [x] Send & manage rental inquiries (bookings)
- [x] Owner Dashboard (add/edit/delete listings)
- [x] Admin Dashboard (approve listings, manage users)
- [x] Reviews & Ratings system
- [x] Save / Favorite properties
- [x] Rent Calculator widget
- [x] Fully responsive (mobile-friendly)
- [x] Property image upload (Multer)

---

## 📌 Academic Title

**Online House Rental Management System using AngularJS, Node.js and MongoDB**

---

*Built for full-stack web application development practical — RentEase © 2024*
