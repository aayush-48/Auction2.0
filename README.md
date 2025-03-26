# Auction2.0 - IPL Auction Management System 

## 🎉 Dynamic IPL Auction Platform 🏆

Auction2.0 is an advanced real-time auction management system designed specifically for the IPL auction event. This platform facilitates live bidding, player acquisitions, and seamless team management for franchises. With a highly interactive UI and support for up to 130 players simultaneously, it ensures a smooth and engaging experience for participants. 

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Folder Structure](#-folder-structure)
- [Debugging and Troubleshooting](#-debugging-and-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

DEMO Video: https://drive.google.com/file/d/1dGnHVQqQP1GW8vmX5PJTUvtQ9cUli3Oj/view?usp=sharing

---

## 🔍 Overview
Auction2.0 is a feature-rich dynamic web application that streamlines the IPL auction process by enabling real-time bidding, tracking player purchases, and managing franchise budgets. Built with a robust backend and an intuitive UI, it provides a professional auction environment with live updates.

---

## 🌟 Features

- **Real-Time Bidding** – Live auction with dynamic price updates and bid placements.
- **Team Management** – Allows franchises to strategize and organize their player roster.
- **Budget Tracking** – Ensures each team adheres to financial constraints.
- **Admin Panel** – Controls bidding start/stop and player listing.
- **Responsive UI** – Seamless user experience across all devices.

---

## 💻 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- WebSockets for real-time updates

### Backend:
- Node.js with Express.js
- WebSocket (Socket.io) for live interactions
- MongoDB for data storage

### Dependencies:
- `axios`, `socket.io-client` (Frontend)
- `express`, `socket.io`, `mongoose` (Backend)

---

## ⚙️ Prerequisites

- **Node.js** (v14+ recommended)
- **MongoDB** (Local/Atlas for data storage)
- **Git** (For cloning the repository)
- **npm/yarn** (For package management)

---

## 🔧 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/aayush-48/Auction2.0.git
cd Auction2.0
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file and configure database and server settings.
- Start the backend server:
```bash
npm start
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

- The frontend should now be running at `http://localhost:3000`

---

## 🚀 Usage

1. **Admin Login** – Controls the auction process.
2. **Team Owners** – Participate in real-time bidding.
3. **Budget Management** – Each team must stay within its allocated budget.
4. **Real-Time Updates** – Players’ status and bids update instantly.

---

## 🗂 Folder Structure
```
Auction2.0/
├── backend/           # Node.js server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── server.js     # Main server entry
│   └── .env          # Environment variables
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/       # Screens
│   │   ├── App.js       # Main App entry
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🛠 Debugging and Troubleshooting

### Common Issues & Fixes

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running locally or verify connection to MongoDB Atlas.

2. **WebSocket Not Connecting:**
   - Check if backend is running properly and WebSocket ports are correctly configured.

3. **Frontend Not Loading Data:**
   - Verify API calls and update `.env` if needed.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository.
2. **Create a branch** (`git checkout -b feature-branch`).
3. **Commit changes** (`git commit -m "Added feature"`).
4. **Push** the branch (`git push origin feature-branch`).
5. **Open a pull request** and describe your changes.

---

## 📜 License

MIT License

Copyright (c) 2025 Auction2.0

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

