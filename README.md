# 🏠 HouseHount - Real Estate Rental Platform

![HouseHount Banner](https://your-image-link-here)

## 🌐 Live Demo

🚀 Deployed Application:

https://househount.onrender.com/

---

## 📌 About The Project

HouseHount is a full-stack real estate rental platform built using the MERN stack.

The application allows users to discover properties, create accounts, manage properties, book properties, save favorites, and interact through reviews.

It provides a seamless experience for both users and administrators with authentication and role-based access control.

---

# 🚀 Features

## 👤 User Authentication

- User registration
- User login
- JWT-based authentication
- Secure password hashing
- User profile management
- Change password functionality


## 🏘️ Property Management

Users can:

- View available properties
- Add new properties
- Update property details
- Delete properties
- View their listed properties


## 📅 Booking System

- Create property bookings
- View personal bookings
- Manage received booking requests
- Update booking status


## ❤️ Favorites

- Add properties to favorites
- Remove favorites
- View saved properties


## ⭐ Reviews

- Add reviews for properties
- Delete reviews


## 👑 Admin Dashboard

Admin features:

- View statistics
- Manage users
- Manage bookings
- Approve/reject properties
- Monitor platform activities


---

# 🛠️ Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS
- React Router


## Backend

- Node.js
- Express.js


## Database

- MongoDB
- Mongoose


## Authentication

- JWT Authentication
- bcrypt password encryption


## Deployment

- Render


---

# 📂 Project Structure
HouseHount
│
├── src
│ ├── components
│ ├── pages
│ ├── context
│ ├── services
│ └── main.jsx
│
├── server
│ ├── controllers
│ ├── routes
│ ├── middleware
│ ├── models
│ └── server.js
│
├── package.json
├── README.md
└── .env


---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/PavaniMutyala/HouseHount.git

Move into project directory:

cd HouseHount

Install dependencies:

npm install
🔐 Environment Variables

Create a .env file:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASSWORD=your_password
▶️ Run Application
Start Development Server

Frontend + Backend:

npm run dev

or

Backend:

npm start
🔗 API Endpoints
Authentication
Method	Endpoint
POST	/api/auth/register
POST	/api/auth/login
GET	/api/auth/profile
Properties
Method	Endpoint
GET	/api/properties
POST	/api/properties
GET	/api/properties/:id
PUT	/api/properties/:id
DELETE	/api/properties/:id
Bookings
Method	Endpoint
POST	/api/bookings
GET	/api/bookings
PUT	/api/bookings/:id/status
Favorites
Method	Endpoint
POST	/api/favorites
GET	/api/favorites
Reviews
Method	Endpoint
POST	/api/reviews
DELETE	/api/reviews/:id
🔒 Security Features
JWT authentication
Protected routes
Role-based authorization
Password encryption
Secure API access
📸 Screenshots

(Add your application screenshots here)

Example:

Home Page
Login Page
Dashboard
Property Details
Admin Panel
🎯 Future Enhancements
Online payment integration
Google Maps property location
Chat between users and owners
Advanced search filters
Image cloud storage
Mobile application
👩‍💻 Author

Pavani Mutyala

GitHub:
https://github.com/PavaniMutyala
