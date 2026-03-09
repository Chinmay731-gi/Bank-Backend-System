💳 Advanced Bank System Backend

A production-style banking backend API that simulates real-world digital banking features like user accounts, secure balance transfers, transaction history, and email notifications. Built with a scalable architecture and clean modular structure using Node.js, Express, and MongoDB.

---

🌐 Live API
Base URL:

https://bank-backend-system.onrender.com

Example API:

<<<<<<< HEAD
POST /api/auth/register
POST /api/auth/login
POST /api/transfer
=======
POST /api/auth/register 

POST /api/auth/login

POST /api/transfer

>>>>>>> a739787 (Complete Bank System Project)
GET  /api/transactions

---

🚀 Features

🔐 User authentication (JWT + hashed passwords)

👤 User registration & login

💰 Secure money transfer between users

📜 Transaction history tracking

📧 Email notification after successful transfer

🧾 Balance management system

🛡 Input validation & centralized error handling

🧱 Modular MVC architecture

🌐 RESTful API design

🚀 Deployment-ready backend

<<<<<<< HEAD
=======
🖥️ UI
>>>>>>> a739787 (Complete Bank System Project)

---

🛠 Tech Stack
<<<<<<< HEAD
=======

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Nodemailer

Git & GitHub


---

📂 Project Structure

src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── services/
 └── app.js

Clean and scalable folder structure following real-world backend practices.
views to be added with basic, user-friendly UI.
---

🔑 Core API Modules

Auth

Register user

Login user

JWT-based authentication

Banking

Create account

Check balance

Transfer money

Transaction history

Services

Email notification after transfer

Global error handling


---

⚙️ Environment Variables

Create a .env file in the root:

PORT=7310

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLIET_ID = your client id

CLIENT_SECRET= your client secret

REFRESH_TOKEN = refresh token

EMAIL_USER=your_email


---

▶️ Run Locally

git clone https://github.com/Chinmay731-gi/bank-system-backend.git
cd bank-system-backend
npm install
npm run dev

Server runs on:

http://localhost:7310


---

🧠 Purpose of Project

This project was built to simulate a real-world banking backend and demonstrate skills in:

Backend architecture

Authentication systems

Secure transaction handling

API design

Scalable folder structure


---

🔮 Future Improvements

Rate limiting

Redis caching

Docker setup

WebSocket live updates

Admin panel

Unit testing

Payment gateway integration


---

👨‍💻 Author

Chinmay Ihare
Backend Developer (1st year) focused on building scalable real-world backend systems.
>>>>>>> a739787 (Complete Bank System Project)
