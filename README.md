
<img src="https://socialify.git.ci/juniorSarh/The_Vellum/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="The_Vellum" width="640" height="320" />

# The Vellum Hotel Booking Platform

A full-stack hotel reservation platform with a customer-facing site, an admin CMS, and a Node/Express backend powered by PostgreSQL.

---

## 1. Project Overview

**Project Title:** The Vellum Hotel Booking Platform  

**One-Sentence Description:**  
A modern hotel booking system where customers can discover hotels, make secure reservations, leave reviews, and mark favourites, while admins manage hotels, rooms, bookings, and customers via a dedicated CMS.

---

## 2. Key Project Links 🔗

- **Live App (Customer-Facing):**  
  https://the-vellum-frontend.onrender.com

- **Live Admin Panel (CMS):**  
  https://the-vellum-frontend.onrender.com

- **Live Backend (API Server):**  
  https://the-vellum.onrender.com  
  (The backend should respond on `/` with a simple health or welcome page.)

- **Figma (UI / Wireframes):**  
  https://www.figma.com/design/VKrezOPrqTdPSNuQWvpD2j/The-vellum?node-id=0-1&t=s32EQBeJE5ShZqTg-1

- **FigJam (User Flows):**  
  https://www.figma.com/board/WXeXsQ6j4KLKwOyeriTJNx/User-flow?node-id=0-1&t=AtaOgWghMnRyURCg-1

- **Project Management (Plane.so Board):**  
  https://app.plane.so/your-team/projects/your-board

- **Documentation (Plane.so Pages – API & DB Schema):**  
  https://docs.google.com/document/d/17svie8KV8ar2i4IJrg1sm6EkkYJdeu8mpa_4R44lLCE/edit?usp=sharing

---

## 3. Tech Stack 🛠️

**Frontend – Customer App:**
- React + TypeScript
- React Router
- Redux Toolkit (customers, bookings, rooms, favourites, payments)
- Custom CSS

**Frontend – Admin CMS:**
- React + TypeScript
- Redux Toolkit
- Protected/admin pages for hotel, room, and reservation management

**Backend API:**
- Node.js
- Express.js
- PostgreSQL
- SQL via tagged template (`sql` from `config/db`)
- RESTful endpoints for:
  - Customers
  - Hotels
  - Rooms
  - Bookings (with customer/hotel joins)
  - Favourites
  - Reviews
  - Payments (Paystack integration)

**Database:**
- PostgreSQL (local or hosted: Neon, Supabase, etc.)

**Tooling:**
- npm / pnpm
- ESLint + Prettier
- Concurrent dev scripts

---

## 4. Repository Structure 📂

```txt
.
├─ backend/                 # Node/Express API
│  ├─ src/
│  │  ├─ config/            # DB connection, env config
│  │  ├─ models/            # TS interfaces (Booking, Hotel, Room, Customer, Review, Favourite)
│  │  ├─ services/          # Data access (booking.service, hotel.service, review.service, etc.)
│  │  ├─ controllers/       # Express controllers for each feature
│  │  ├─ routes/            # /api/bookings, /api/hotels, /api/rooms, /api/reviews, /api/favourites, /api/payments
│  │  └─ index.ts           # App entry
│  └─ package.json
│
├─ customer-app/            # Customer-facing React SPA
│  ├─ src/
│  │  ├─ public_pages/      # Landing, HotelDetails, BookingHistory, Payment pages
│  │  ├─ components/        # NavBar, HotelCard, SearchBar, Button, etc.
│  │  ├─ storeSlices/       # bookingSlice, customerSlice, roomSlice, favouritesSlice, paymentSlice
│  │  ├─ assets/            # CSS + images
│  │  └─ main.tsx
│  └─ package.json
│
├─ admin-app/               # Admin CMS
│  ├─ src/
│  │  ├─ pages/             # AddHotel, ReservationList, etc.
│  │  ├─ components/        # PrivateNav, modals, forms
│  │  └─ storeSlices/       # Admin-related slices if separated
│  └─ package.json
│
├─ shared/                  # (Optional) Shared types / helpers
│  └─ types/
│
├─ README.md
└─ package.json             # Root scripts (to run all subapps)
```

---

## 5. Prerequisites ✅

Make sure you have:

- **Node.js** v18+ (20+ recommended)
- **npm** or **pnpm**
- **PostgreSQL** v13+
- **Git**

Optional:

- Plane.so workspace
- Figma & FigJam accounts

---

## 6. Installation & Setup ⚙️

```bash
# 1. Clone the repository
git clone https://github.com/juniorSarh/The_Vellum
cd The_Vellum

# 2. Install dependencies
cd backend
npm install

cd ../Frontend
npm install

```

### 6.1 Environment Variables

Create `.env` files based on these examples.

**backend/.env**

```env
PORT=4040
NODE_ENV=development

DATABASE_URL=postgres://username:password@localhost:5432/vellum_db

PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

**customer-app/.env**

```env
VITE_API_BASE_URL=http://localhost:4040/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

**admin-app/.env**

```env
VITE_API_BASE_URL=http://localhost:4040/api
```

### 6.2 Database Migration / Setup

From `backend/`:

```bash
cd backend

# Create tables
npm run db:migrate

# (Optional) Seed sample data
npm run db:seed
```

---

## 7. Running the Application (Development) 🚀

### Option A – Run each service separately

```bash
# Backend API
cd backend
npm run dev

# Customer App
cd customer-app
npm run dev

# Admin CMS
cd admin-app
npm run dev
```

Typical dev URLs:

- Customer app: http://localhost:5173
- Admin app: http://localhost:5174
- Backend API: http://localhost:4040

### Option B – Run everything with one command (concurrently)

At the repository root, your `package.json` can include:

```json
{
  "scripts": {
    "dev": "concurrently "npm:dev:backend" "npm:dev:customer" "npm:dev:admin"",
    "dev:backend": "cd backend && npm run dev",
    "dev:customer": "cd customer-app && npm run dev",
    "dev:admin": "cd admin-app && npm run dev"
  }
}
```

Then:

```bash
npm run dev
```

---

## 8. Available Scripts 📜

**Backend (`backend/`):**

- `npm run dev` – Start the API in development mode
- `npm run build` – Build TypeScript to JavaScript (if configured)
- `npm run start` – Start the compiled server
- `npm run db:migrate` – Run DB migrations
- `npm run db:seed` – Seed the database
- `npm run lint` – Lint backend code
- `npm test` – Run backend tests (if configured)

**Customer App (`customer-app/`):**

- `npm run dev` – Start React dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – Lint frontend code

**Admin App (`admin-app/`):**

- `npm run dev` – Start admin dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – Lint admin code

**Root:**

- `npm run dev` – Run backend + customer + admin concurrently

---

## 9. Contribution Guidelines 🤝

### Branching

- **main** – Always stable and deployable.
- **develop** – Integration branch for new features.
- **feature/*** – Feature-specific branches, e.g.:

  - `feature/hotel-search`
  - `feature/booking-history`
  - `feature/reviews-and-ratings`

### Workflow

1. Branch off from `develop`:

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Implement your feature:
   - Ensure everything builds and runs.
   - Run linters where available.

3. Commit with clear messages:

   ```bash
   git commit -m "feat: add booking history per customer"
   ```

4. Push and open a Pull Request into `develop`.
5. After review and testing, `develop` is merged into `main` for releases.

---

Happy hacking! 💛  
The Vellum Hotel Booking Platform


*** Use cases for customers and admin***
https://docs.google.com/document/d/17svie8KV8ar2i4IJrg1sm6EkkYJdeu8mpa_4R44lLCE/edit?tab=t.0