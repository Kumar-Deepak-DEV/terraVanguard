# 🚀 Terra Vanguard | Class Command Center

The ultimate tactical portal for our class! A fun, military-themed hub built to manage our class operations, vote on goofy ideas, track events, and hang out with the squad. 

## 🌐 Live Links
- **Frontend App**: `[Insert Frontend Deployment Link Here]`
- **Backend API**: `[Insert Backend Deployment Link Here]`

## ✨ Features

- **Role-Based Access Control**: Separate views and permissions for "Commanders" (Admins) and "Operatives" (Standard Users).
- **Operations (Events)**: Track upcoming class events, tournaments, and hangouts with a live countdown timer. Admins can schedule and manage operations.
- **Tactical Proposals (Ideas)**: Operatives can submit ideas/proposals for class activities. Upvote your favorites!
- **Real-Time Communication**: A live, Socket.io-powered Discussion Hub for every proposal. Chat in real-time, reply to messages, and @mention other users.
- **Live Notifications**: Get instant alerts via the navigation bell when someone replies to you or tags you in the discussion hub.
- **Hall of Fame**: Honoring the elite operatives who have demonstrated exceptional skill, strategy, and dominance in our events.
- **Responsive & Dynamic UI**: Built with a sleek "glassmorphism" military aesthetic, fully responsive for desktop and mobile devices.

## 🛠 Tech Stack

**Frontend (Client)**:
- React 19 (Vite)
- TailwindCSS (Styling & Glassmorphism UI)
- Framer Motion (Animations)
- React Router (Routing)
- React Helmet Async (SEO)
- Socket.io-client (Real-time WebSockets)
- Axios (HTTP Client)

**Backend (Server)**:
- Node.js & Express.js
- MongoDB & Mongoose (Database & Models)
- Socket.IO (Real-time WebSocket Server)
- JSON Web Tokens (JWT Authentication)
- bcryptjs (Password Hashing)

## 💻 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/terra-vanguard.git
cd terra-vanguard
```

### 2. Setup the Backend Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the server:
```bash
npm run dev
```

### 3. Setup the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory and add:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the client:
```bash
npm run dev
```

## 🔐 Admin Setup (For Local Testing)
To access the Commander dashboard, you must register via the backdoor initialization route:
1. Navigate to `/admin-setup` (or click "Back to Base" on the login screen and follow the hidden links).
2. Enter the **Master Override Code** (configured in your environment or database) to authorize the creation of a new Commander account.

---
*Built with ❤️ for our class squad!*
