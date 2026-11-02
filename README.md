# UnityCare — Community Action & Volunteer Platform

**UnityCare** is a modern, community-driven event management and volunteering platform. It connects socially conscious citizens, volunteers, and grassroots organizers to plan, join, and execute impactful local social development initiatives such as winter relief, cleanup drives, tree plantations, meal sharing, and free health camps.


## ✨ Key Features

- **Community-Led Event Creation & Publishing:** Organizers can easily create grassroots community drives (e.g., Winter Relief, Park Cleanup, Tree Plantation, Food Distribution) complete with title, location, preset thumbnails, and default today's date picker that prevents past-date selection.
- **One-Click Participation & RSVP:** Logged-in volunteers can join verified initiatives with a single click. The system prevents duplicate sign-ups and honors maximum participant limits.
- **Dedicated "Joined Events" Dashboard:** Volunteers have a personal dashboard (`/events/joined`) to review all initiatives they have signed up for, complete with join dates and the ability to cancel an RSVP with an alert confirmation.
- **Organizer Event Management (Full CRUD):** Creators can view and manage their initiatives under `Manage My Events` (`/events/manage`), allowing in-place edits and deletion of events with secure owner authorization.
- **Smart Upcoming-Only Event Discovery:** The public discovery page (`/events`) automatically filters out past dates and enables fast search by event title, location, and cause category (Donation, Cleanup, Plantation, Winter Relief, Food Drive, Health Camp, Education).
- **Persistent Authentication & Protected Routes:** Powered by Better-Auth with MongoDB adapter and JWT tokens. Full session persistence ensures logged-in users are never prematurely booted to the login page on browser reload.
- **Responsive Design & Dark/Light Theme:** Built using Tailwind CSS v4 and accessible `@base-ui/react` components with seamless dark/light theme switching and custom toast notifications.

---

## 🛠️ Technology Stack

### Client Side
- **Framework:** Next.js 16.4 (App Router)
- **Library:** React 19 + React Compiler (`babel-plugin-react-compiler`)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (Base-Nova style, `@base-ui/react`)
- **Icons:** Lucide React
- **Notifications:** Custom Toast system (no default browser alerts)
- **Auth Client:** Better-Auth Client with JWT plugin

### Server / Backend
- **Server:** Node.js + Express
- **Database:** MongoDB Native Driver
- **Authentication:** Better-Auth + JOSE (JWT verification)
- **Security:** CORS, JWT Bearer Token verification

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- MongoDB instance running locally or on MongoDB Atlas

### 1. Clone the repository
```bash
git clone https://github.com/NurulAlam0/unity-care.git
cd UnityCare(Client)
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
# Better-Auth Secret & URL
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# MongoDB Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/UnityCare

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

---

## 📂 Project Structure

```text
├── public/                 # Static assets and SVGs
├── src/
│   ├── app/                # Next.js App Router routes & pages
│   │   ├── api/auth/       # Better-Auth catch-all route handler
│   │   ├── events/         # Public event browsing, create, manage, joined, & details
│   │   ├── login/          # User authentication (Login)
│   │   ├── register/       # User registration
│   │   ├── layout.tsx      # Root layout with Navbar and Footer
│   │   └── page.tsx        # Landing page
│   ├── assets/             # Brand logos and illustration assets
│   ├── components/
│   │   ├── auth/           # Login/Register auth forms
│   │   ├── home/           # Hero, Platform Features, Recent Events, Visual Stories, Alerts
│   │   ├── layout/         # Sticky Navbar and Footer
│   │   └── ui/             # Accessible Base-UI / Shadcn UI components
│   ├── hooks/              # Custom utility hooks
│   └── lib/                # Better-auth config, backend-api helpers, and utils
└── package.json            # Project dependencies and scripts
```

---

## 📜 License
This project is licensed under the MIT License.
