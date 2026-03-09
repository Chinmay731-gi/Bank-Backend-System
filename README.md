# 💳 Advanced Bank System Backend

A production-style banking backend API that simulates real-world digital banking features like user accounts, secure balance transfers, transaction history, and email notifications. Built with a scalable architecture and clean modular structure using Node.js, Express, and MongoDB.

## 🌐 Live API

Base URL:
https://bank-backend-system.onrender.com

Example API Endpoints:
`
POST /api/auth/register
POST /api/auth/login
POST /api/transfer
GET  /api/transactions
`

## 🚀 Features

🔐 User Authentication: JWT-based authentication with hashed passwords

👤 User Management: Registration and login

💰 Secure Transfers: Money transfer between users

📜 Transaction History: Track all transactions

📧 Email Notifications: Send email after successful transfer

🧾 Balance Management: Check and manage user balance

🛡 Validation & Error Handling: Centralized and secure

🧱 Modular MVC Architecture: Scalable folder structure

🌐 RESTful API Design: Clean and production-ready

🛠 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Nodemailer

Git & GitHub

## 📂 Project Structure
src/
 ├── controllers/      # API logic
 ├── models/           # Database schemas
 ├── routes/           # API endpoints
 ├── middleware/       # Auth & error handling
 ├── services/         # Email & other services
 └── app.js            # Main server

Views will be added later to provide a basic, user-friendly UI.

## 🔑 Core API Modules

Auth Module

User registration

User login

JWT authentication

Banking Module

Create account

Check balance

Transfer money

Transaction history

Services

Email notifications after transfers

Global error handling

⚙️ Environment Variables

Create a .env file in the root:

PORT=7310
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token
EMAIL_USER=your_email

## ▶️ Run Locally
git clone https://github.com/Chinmay731-gi/bank-system-backend.git
cd bank-system-backend
npm install
npm run dev

Server will run on: http://localhost:7310

## 🧠 Purpose of the Project

This project was built to simulate a real-world banking backend and demonstrate skills in:

Backend architecture

Authentication systems

Secure transaction handling

API design

Scalable folder structure

## 🔮 Future Improvements

Rate limiting & security enhancements

Redis caching

Docker containerization

WebSocket for live updates

Admin panel

Unit testing & CI/CD integration

Payment gateway integration

## 👨‍💻 Author

`Chinmay Ihare, Backend Developer (1st year), focused on building scalable real-world backend systems.`
