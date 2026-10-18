# IMovies — Local Execution Setup and Architecture Implementation Plan

IMovies is a full-stack movie discovery, real-time seat reservation, and ticket booking web application designed to deliver cinema lovers a seamless ticket purchasing experience with zero double-booking hazards and verified payment reconciliation.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following critical configuration parameters have been confirmed by the user and locked for implementation:

- **Confirmed Decision 1 (Backend Entry Point & Port):** Standardized on `server.js` listening on port `8000` (`http://localhost:8000`), with `package.json` scripts configured for `nodemon server.js`.
- **Confirmed Decision 2 (Directory Structure):** Standardized on lowercase directories `client/` (React + Vite) and `server/` (Node.js + Express MVC) directly under the root project directory `IMovies/`.
- **Confirmed Decision 3 (Exclusive Database Environment Configuration):** Standardized exclusively on `MONGO_URI` pointing to the `Imovies` database:
  `MONGO_URI=mongodb://127.0.0.1:27017/Imovies`
  *(Note: `MONGO_URI` is used exclusively across all connection logic, `.env` files, and documentation; any legacy `MONGODB_CONNECTION_LINK` references are completely eliminated).*

---

### 1. Overview & Core Concept

- **What It Does:** Enables cinema audiences to browse movies currently showing or upcoming, filter by genre, language, and city, inspect high-fidelity seat layouts across tiered pricing (Balcony, Middle, Lower), temporarily lock chosen seats with a live 10-minute countdown, complete secure transactions via server-verified payment gateways, and manage booking receipts and personal watchlists.
- **Target Audience / Persona:** Moviegoers seeking effortless ticket purchases without reservation conflicts, and cinema managers needing operational control over showtimes, screen configurations, pricing tiers, and revenue analytics.
- **Key Value:** Eliminates double-booking hazards through server-authoritative atomic seat locking and automated TTL cleanup, while maintaining a responsive, modern interface.

---

### 2. User Experience & Visual Design

- **Key User Flows:**
  1. *Discovery & Exploration:* User lands on the homepage, filters by city/genre, clicks a movie to view cast, trailer, and aggregated reviews.
  2. *Showtime & Screening Selection:* User selects a date and cinema venue; showtimes are presented in clean 12-hour AM/PM format.
  3. *Interactive Seat Reservation:* User views screen positioning and tier breakdowns (Balcony, Middle, Lower), selects preferred seats, and acquires a 10-minute temporary server lock.
  4. *Checkout & Ticket Issuance:* Order summary shows ticket pricing, service tax, and fees; user selects payment method; server verifies gateway response and issues digital ticket receipt with QR verification code.
  5. *Administrative Operations:* Theater admins manage film catalogs, create auditorium seating maps, schedule showtimes, and monitor occupancy metrics.

- **Visual Identity & Theme:**
  - *Aesthetic Direction:* Sophisticated cinematic dark theme with warm golden/amber accents (`#F59E0B` / amber-500) and deep obsidian surfaces (`#09090B` neutral canvas, `#18181B` structural cards).
  - *Typography:* Characterful geometric display sans (`Plus Jakarta Sans` or `Outfit`) for titles paired with highly legible body prose (`DM Sans` or `Inter`) and tabular monospace figures (`font-mono tabular-nums`) for pricing, seat coordinates, and countdown timers.
  - *Spatial Math & Layout:* Strict adherence to 1440px desktop baseline with fluid mobile adaptation, single-elevation cards, hairline subtle dividers (`border-zinc-800`), and zero-pill metadata discipline (clean inline text separated by `·` rather than colored candy badges).

- **Interactive Feedback & Motion:**
  - Responsive seat selection micro-interactions ($\le 150\text{ms}$) with distinct states: Available, Selected, Locked (held by another session), and Booked.
  - Suspense loading fallbacks using smooth branded cinema loaders.
  - Toast notifications (`react-toastify`) for lock confirmations, session expiration warnings, and payment outcomes.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Authoritative Concurrency & Lock TTL**
  - *Chosen Approach:* All seat status transitions (`AVAILABLE` $\to$ `LOCKED` $\to$ `BOOKED`) are guarded by atomic conditional database updates. Seats locked during checkout expire automatically after 10 minutes via background sweep routines (`cleanupService.js`).
  - *Why:* Prevents race conditions during blockbuster ticket drops. Frontend state is treated as purely representational.
  - *Alternatives Considered:* Client-only reservation timers (rejected due to double-booking vulnerabilities).

- **Decision 2: Server-Side Cryptographic Payment Verification**
  - *Chosen Approach:* Ticket issuance occurs exclusively when the server verifies the cryptographic webhook signature from the payment gateway (Stripe/Razorpay).
  - *Why:* Guarantees financial reconciliation and prevents fraudulent client-side success spoofing.

- **Decision 3: Independent Client & Server Execution Runtimes**
  - *Chosen Approach:* The frontend SPA (`http://localhost:5173`) and Express REST API (`http://localhost:8000`) run in decoupled processes communicating across CORS and proxy channels.
  - *Why:* Preserves clean architectural boundaries, matches modern production deployment models (Vercel/Netlify for client, containerized compute for server), and enables independent testing.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT RUNTIME (Vite SPA)                       │
│                         http://localhost:5173                          │
│                                                                        │
│  React Router (v6+) ────► Auth & Booking Context ────► Axios Client    │
│  ├── / (Landing)            ├── Token in Cookies        ├── Bearer JWT │
│  ├── /shows/:movieName      ├── Active Seat Locks       └── Base URL   │
│  ├── /booking/:showId       └── 10-min Countdown            (Port 8000)│
│  └── /admin/*                                                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST (JSON) + CORS
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SERVER RUNTIME (Express)                        │
│                         http://localhost:8000                          │
│                                                                        │
│  server.js (Bootstrapper & Listener)                                   │
│  ├── Middlewares: cors, express.json, fetchUser, checkAdmin            │
│  ├── Routes: /api/auth, /api/movies, /api/shows, /api/bookings, etc.   │
│  ├── Controllers: Business logic & Atomic Concurrency Coordinators     │
│  └── Utils: cleanupService (TTL sweeper), mailer, tokenHelper          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose Connection
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER (MongoDB)                        │
│                  MONGO_URI=mongodb://127.0.0.1:27017/Imovies           │
│                                                                        │
│  Users | Admins | Movies | Theatres | Shows | Seats | Bookings | ...   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Local Execution Startup Sequence & Terminal Arrangement

To test and execute the application locally in development:

1. **Terminal 1: MongoDB Daemon**
   ```bash
   mongod --dbpath <data-directory-path>
   # Verify listening on 127.0.0.1:27017
   ```

2. **Terminal 2: Express Backend Server**
   ```bash
   cd IMovies/server
   # Verify server/.env contains:
   # PORT=8000
   # MONGO_URI=mongodb://127.0.0.1:27017/Imovies
   # JWT_SECRET=your_jwt_secret_key
   npm install
   npm run dev    # runs: nodemon server.js
   # Output: Connected to MongoDB: Imovies | Server listening on port 8000
   ```

3. **Terminal 3: React Vite Client**
   ```bash
   cd IMovies/client
   npm install
   npm run dev
   # Output: Local: http://localhost:5173/
   ```

#### Common Startup Errors & Troubleshooting

| Symptom / Error | Root Cause | Remediation Step |
| :--- | :--- | :--- |
| `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB service is stopped or unreachable. | Start local MongoDB service via `brew services start mongodb-community` or `sudo systemctl start mongod`. |
| `Error: Cannot find module 'server.js'` | Terminal opened in root `IMovies/` instead of `server/`. | Navigate to `cd server` before running `nodemon server.js`. |
| `CORS Error: No 'Access-Control-Allow-Origin' header` | Server CORS whitelist does not include client origin. | Ensure `server.js` configures `cors({ origin: 'http://localhost:5173', credentials: true })`. |
| `EADDRINUSE: address already in use :::8000` | Port 8000 is occupied by an orphaned node process. | Terminate process on port 8000 (`lsof -ti:8000 | xargs kill -9`) or verify `PORT=8000` in `.env`. |
| `401 Unauthorized on seat locking or checkout` | User token missing or expired in client storage. | Log in via `/login` to obtain an active JWT token. |

---

### 5. Verification Checklist

- [ ] Directory layout strictly follows `IMovies/client` and `IMovies/server`.
- [ ] Backend runs on port `8000` via `server.js` using `MONGO_URI` exclusively.
- [ ] No fallback to `MONGODB_CONNECTION_LINK` exists in backend configuration or code.
- [ ] Frontend development server launches on `http://localhost:5173`.
- [ ] CORS permits seamless REST API communication between client (`:5173`) and server (`:8000`).
- [ ] Database connection verifies successfully to `mongodb://127.0.0.1:27017/Imovies` before Express listens on port 8000.
- [ ] All 10 core entities and models are aligned with the MVC directory structure.
