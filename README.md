<div align="center">

<img src="https://img.shields.io/badge/Terra%20Vanguard-Portal-39ff14?style=for-the-badge&logo=leaflet&logoColor=black" />

# 🌍 Terra Vanguard — Team Portal

**A unified command hub for the Terra Vanguard team.**  
Built to give every core member a voice, a stage, and a direct line to the action.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-terra--vanguard.vercel.app-39ff14?style=for-the-badge)](https://terra-vanguard.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://terravanguard.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://documenter.getpostman.com/view/50840847/2sBXqKp11y)
[![YouTube](https://img.shields.io/badge/▶%20Watch%20Demo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/ksyEEYLoHFU)
[![Figma](https://img.shields.io/badge/🎨%20Figma%20Design-View%20Prototype-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/zoPK3ZqCCAqQLczxujqp42/Untitled?node-id=190-14&t=b2pzU7l365UKZMVR-1)

</div>

---

## 🔥 The Problem

As a team, we had **no central place** to:
- Coordinate meetings and events
- Express our thoughts and ideas openly
- Recognize and celebrate each other's contributions
- Give core members a **direct, equal voice** in what happens next

Team discussions were scattered across chats, decisions were made informally, and participation felt uneven. There was no system that encouraged everyone — from new recruits to senior commanders — to step up and engage.

---

## 💡 The Solution — Terra Vanguard Portal

We built **Terra Vanguard** — our own dedicated team portal — to solve this from the ground up. It is a full-stack web platform that acts as a command center for the entire team, structured with a military-themed UI that makes participation feel purposeful and exciting.

### What it gives us:
- ✅ A **shared space** for ideas, proposals, and team discussions
- ✅ A **democratic upvote system** so the best ideas rise to the top naturally
- ✅ A **real-time chat** under every idea so conversations happen instantly
- ✅ An **events board** so no one misses an operation or activity
- ✅ A **Hall of Fame** that publicly recognizes top performers
- ✅ A **role-based access system** that keeps things organized without locking people out

---

# 📸 Screenshots

<div align="center">

### 🏠 Home — Landing Page
![Landing Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826413/team-terra.vercel.app__1_hluf5d.png)

### Public Hall Of Fame
![Public Hall Of Fame Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826411/team-terra.vercel.app_hall-of-fame_zn9g75.png)

### 📅 Vanguard Operations — Events
![Events Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826323/Screenshot_2026-05-03_220355_jgizyu.png)


## Users' Panel

### Operative Access — Login
![Login Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826323/Screenshot_2026-05-03_220400_neyu4j.png)

### User Dashboard
![Dashboard Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826323/Screenshot_2026-05-03_220516_r0lbtj.png)

### Events Ideas
![Ideas Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826322/Screenshot_2026-05-03_220528_ws3bbl.png)

### Hall of Fame
![Hall of Fame](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826412/team-terra.vercel.app_dashboard_hall-of-fame_vtnoyy.png)

### Profile
![Profile page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826324/Screenshot_2026-05-03_220617_shvggu.png)



## Admin's Panel

### Users Page
![User Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826324/Screenshot_2026-05-03_220653_njvotg.png)

### Ideas Page
![Ideas Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826324/Screenshot_2026-05-03_220700_xflgos.png)

### Events Page
![Events Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826324/Screenshot_2026-05-03_220700_xflgos.png)

### Hall Of Fame
![Hall Of fame Page](https://res.cloudinary.com/dzeyeqk8e/image/upload/v1777826324/Screenshot_2026-05-03_220704_iguqsd.png)


</div>

---

## ✨ Features

### 👤 User System
- Secure **JWT-based authentication** (stored in `sessionStorage`)
- Two roles: **Operative** (regular user) and **Commander** (admin)
- Separate login flows for Operatives and Commanders
- User profile with customizable **display name** and **avatar**
- Commander-level actions protected by a **master password**

### 💡 Ideas Board
- Any operative can **submit ideas** with a title, description, and rules
- **Upvote / un-vote** system to surface the most popular proposals
- Admins can **approve** or **delete** ideas
- Real-time **comment/chat section** under every idea (powered by Socket.IO)
- **@mention** other operatives or the entire admin group in comments
- **Reply threading** with reply-to-comment support
- Instant **notification** when you are tagged or replied to
- Deleting an idea automatically **purges all related chats and notifications**

### 📅 Events
- Public events board visible to everyone
- Admins can **create, edit, and delete** events
- **Live countdown timer** to upcoming deployments
- Event metadata: title, description, category, organizer, date

### 🏆 Hall of Fame
- Public-facing recognition board
- Admins can **add, edit, and delete** Hall of Fame entries
- Each entry shows: operative name, achievement, event, institution, date
- **Search and filter** by vanguard group

### 🔔 Notifications
- Real-time notification bell in the navbar
- Alerts for **@mentions** and **replies** to your comments
- Separate notification streams for individual users and admins
- Unread count badge

### 🛡️ Admin Panel
- Full **user management** — create, edit, promote, or remove operatives
- Promote operatives to Commander rank (requires master password)
- **Idea management** — approve or remove submitted ideas
- **Event management** — full CRUD
- **Hall of Fame management** — full CRUD
- Background polling every 5 seconds to keep admin views fresh

### 🌐 Public Pages
- Landing page accessible to all visitors
- Public Hall of Fame and Events pages (no login required)

---

## 🔮 Upcoming Features

- [ ] **Mobile app** (React Native)
- [ ] **Direct messaging** between operatives
- [ ] **Weekly polls and voting** for decisions
- [ ] **Leaderboard** based on participation, upvotes received, and ideas implemented
- [ ] **Image attachments** in ideas icon
- [ ] **Dark/Light mode toggle**
- [ ] **Email notifications** for critical updates
- [ ] **PWA support** for offline access and push notifications

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool and dev server |
| **React Router v7** | Client-side routing (SPA) |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **Axios** | HTTP requests to the backend |
| **Socket.IO Client** | Real-time bidirectional communication |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **React Helmet Async** | Dynamic SEO meta tags |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js v5** | REST API framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | MongoDB ODM |
| **Socket.IO** | Real-time WebSocket server |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **cookie-parser** | Cookie handling |
| **CORS** | Cross-origin request management |
| **dotenv** | Environment variable management |

### Deployment
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Database (cloud) |
| **Postman** | API Documenntation |

---

## 📁 Folder Structure

```
terraVanguard/
├── client/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Static assets
│   │   ├── components/             # Reusable UI components
│   │   │   ├── admin/              # Admin-specific components
│   │   │   │   ├── UsersTable.jsx
│   │   │   │   ├── UserModals.jsx
│   │   │   │   └── ...
│   │   │   ├── ideas/              # Idea-related components
│   │   │   │   └── CommentsSection.jsx
│   │   │   ├── events/             # Event-related components
│   │   │   ├── FloatingLogo.jsx
│   │   │   ├── LandingNav.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RulesSection.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── layouts/                # Page layout wrappers
│   │   ├── pages/
│   │   │   ├── admin/              # Admin-only pages
│   │   │   │   ├── AdminEvents.jsx
│   │   │   │   ├── AdminHallOfFame.jsx
│   │   │   │   ├── AdminIdeas.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── Landing.jsx         # Public landing page
│   │   │   ├── Login.jsx           # Operative / Commander login
│   │   │   ├── Dashboard.jsx       # Operative dashboard
│   │   │   ├── Ideas.jsx           # Ideas board
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── PublicEvents.jsx    # Public events page
│   │   │   └── PublicHallOfFame.jsx
│   │   ├── routes/
│   │   │   ├── AdminRoutes.jsx     # Protected admin routes
│   │   │   └── PublicRoutes.jsx    # Public routes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json                 # Vercel SPA rewrite rules
│   ├── vite.config.js
│   └── package.json
│
└── server/                         # Node.js Backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── controllers/
    │   ├── authController.js       # Register / Login logic
    │   ├── ideaController.js       # Ideas CRUD + comments
    │   ├── eventController.js      # Events CRUD
    │   ├── hallOfFameController.js # Hall of Fame CRUD
    │   ├── notificationController.js
    │   └── userController.js       # User management
    ├── middleware/
    │   └── authMiddleware.js       # JWT verification
    ├── models/
    │   ├── User.js
    │   ├── Idea.js
    │   ├── Comment.js
    │   ├── Event.js
    │   ├── HallOfFame.js
    │   └── Notification.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── ideaRoutes.js
    │   ├── eventRoutes.js
    │   ├── hallOfFameRoutes.js
    │   ├── notificationRoutes.js
    │   └── userRoutes.js
    ├── .env
    └── index.js                    # Express app + Socket.IO server
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Kumar-Deepak-DEV/terraVanguard.git
cd terraVanguard
```

### 2. Setup the backend
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/terra?appName=Cluster0
PORT=5000
JWT_SECRET=your_secret_key
MASTER_PASSWORD=your_master_password
```
Start the backend:
```bash
nodemon index.js
```

### 3. Setup the frontend
```bash
cd ../client
npm install
```
Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🌐 Deployed Links

| Service | URL |
|---|---|
| 🖥️ **Frontend (Vercel)** | [https://terra-vanguard.vercel.app](https://terra-vanguard.vercel.app) |
| ⚙️ **Backend API (Render)** | [https://terravanguard.onrender.com/api](https://terravanguard.onrender.com/api) |
| 📬 **API Documentation (Postman)** | [https://documenter.getpostman.com/view/50840847/2sBXqKp11y](https://documenter.getpostman.com/view/50840847/2sBXqKp11y) |

---

## 👨‍💻 Author

**Deepak Kumar** — Full Stack Developer  
Built with ❤️ for the Terra Vanguard team.

---

<div align="center">
  <sub>© 2026 Terra Vanguard. All rights reserved.</sub>
</div>
