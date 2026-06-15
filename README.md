# 🧬 Cell Spell 2.0 — Event Registration Website

A magical, dark-themed event registration website built with **React + Vite + Supabase**.

> Where Biology Meets Dark Magic ✨

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ and **npm** installed
- A **Supabase** project (already configured)

### 1. Set Up the Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor** → **New Query**
3. Paste the contents of `supabase.sql` and click **Run**
4. This creates both tables with proper constraints and RLS policies

### 2. Install Dependencies

```bash
cd cell-spell-2.0
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
cell-spell-2.0/
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── supabase.sql                # Database setup SQL
├── public/                     # Static assets
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component
    ├── index.css               # Global styles & theme
    ├── lib/
    │   └── supabaseClient.js   # Supabase client init
    ├── components/
    │   ├── LoadingScreen.jsx   # Animated loading screen
    │   ├── Navbar.jsx          # Fixed navigation bar
    │   ├── Particles.jsx       # Floating particle background
    │   ├── Footer.jsx          # Site footer
    │   ├── RegistrationForm.jsx # Reusable form component
    │   └── useScrollReveal.js  # Scroll animation hook
    └── pages/
        ├── HeroSection.jsx     # Hero with CTAs
        ├── EventsSection.jsx   # Event cards grid
        └── RegistrationSection.jsx # Registration forms
```

---

## 🎨 Design Features

- **Dark Magical Biology Theme** — Green + black palette with neon glow effects
- **Glowing Particles** — Floating green particles that drift upward
- **Cute Loading Animation** — Bouncing cell blob with sparkles
- **DNA Helix Decorations** — Animated DNA strands in the hero section
- **Scroll Reveal** — Elements animate into view as you scroll
- **Glassmorphism Navbar** — Blur effect on scroll
- **Responsive** — Fully mobile-friendly with hamburger menu

---

## 🗄️ Database Schema

### `industry_visit_registrations`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| full_name | TEXT | NOT NULL |
| registration_number | TEXT | NOT NULL, UNIQUE |
| faculty | TEXT | NOT NULL |
| year_semester | TEXT | NOT NULL |
| email | TEXT | NOT NULL |
| telephone | TEXT | NOT NULL |
| nic_number | TEXT | NOT NULL, UNIQUE |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### `bioinformatics_workshop_registrations`
Same schema as above.

---

## 🔒 Security

- **Row Level Security (RLS)** is enabled on both tables
- Only **INSERT** operations are allowed for anonymous (public) users
- No read/update/delete access from the client
- Unique constraints prevent duplicate registrations

---

## ✅ Form Validation

- All fields are required
- Email format validation
- Phone number format validation
- Duplicate registration detection (Registration Number & NIC)
- Loading state during submission
- Success/error messages with proper feedback

---

## 📝 License

Built for Cell Spell 2.0 event. All rights reserved.
