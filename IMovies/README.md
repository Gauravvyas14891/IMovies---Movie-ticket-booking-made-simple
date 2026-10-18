# IMovies — Movie Ticket Booking Made Simple

A full-stack, production-grade movie discovery, real-time seat reservation, and ticket booking application.

---

## 1. Confirmed Configuration

- **Root Directory:** `IMovies/`
- **Frontend Directory:** `client/` (React + Vite, Port 5173)
- **Backend Directory:** `server/` (Node.js + Express MVC, Port 8000)
- **Database:** MongoDB (`Imovies`)
- **Connection Variable:** `MONGO_URI=mongodb://127.0.0.1:27017/Imovies` (exclusive)

---

## 2. Directory Structure

```text
IMovies/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── bookingController.js
    │   ├── favoriteController.js
    │   ├── movieController.js
    │   ├── paymentController.js
    │   ├── reviewController.js
    │   ├── seatController.js
    │   ├── showController.js
    │   └── theatreController.js
    ├── middlewares/
    │   ├── checkAdmin.js
    │   ├── errorHandler.js
    │   └── fetchUser.js
    ├── models/
    │   ├── adminModel.js
    │   ├── bookingModel.js
    │   ├── favoriteModel.js
    │   ├── movieModel.js
    │   ├── paymentModel.js
    │   ├── reviewModel.js
    │   ├── seatModel.js
    │   ├── showModel.js
    │   ├── theatreModel.js
    │   └── userModel.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── bookingRoutes.js
    │   ├── favoriteRoutes.js
    │   ├── movieRoutes.js
    │   ├── paymentRoutes.js
    │   ├── reviewRoutes.js
    │   ├── seatRoutes.js
    │   ├── showRoutes.js
    │   └── theatreRoutes.js
    ├── utils/
    │   ├── cleanupService.js
    │   ├── db.js
    │   ├── mailer.js
    │   ├── seedData.js
    │   └── tokenHelper.js
    ├── .env
    ├── .env.example
    ├── package.json
    └── server.js
```

---

## 3. How to Run Locally (3 Terminals)

### Terminal 1: MongoDB Daemon
```bash
# Start MongoDB service
mongod --dbpath <path-to-data-directory>
# OR on macOS: brew services start mongodb-community
# OR on Linux: sudo systemctl start mongod
```

### Terminal 2: Backend REST API Server
```bash
cd IMovies/server

# Install dependencies
npm install

# (Optional) Seed initial movies, theatres, and shows
node utils/seedData.js

# Start backend development server
npm run dev
# Server runs on: http://localhost:8000
```

### Terminal 3: Frontend Client Application
```bash
cd IMovies/client

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Client runs on: http://localhost:5173
```

---

## 4. Key Architectural & Concurrency Features

1. **Double-Booking Prevention:** 
   - When a customer selects seats, the server checks if any seat is already booked or currently locked by another user.
   - If available, seats are atomically locked with a **10-minute Time-To-Live (TTL)**.
   - A background sweeper (`cleanupService.js`) automatically unlocks expired seats and marks stale checkout sessions as expired.
2. **Cryptographic Payment Verification:**
   - Client is never trusted to confirm a booking directly. Only verified gateway responses or signed webhooks transition seat state from `LOCKED` to `BOOKED`.
3. **MVC Architecture:**
   - Models (`models/`), Controllers (`controllers/`), Routes (`routes/`), and Middlewares (`middlewares/`) remain strictly isolated.
4. **Visual Fidelity:**
   - 100% reproduction of the supplied screenshots: Deep navy canvas (`#1E293B`), `#0F172A` cards, vivid red/crimson accents (`#E90B3C`), dark input surfaces (`#202A3D`), exact typography, and layouts.
