# ROCA GYM Platform — Technical README

> Full-stack gym management web application built with Angular 18 + Firebase + Vercel.

---

## 🏗️ Architecture Overview

```
roca-gym-platform/
├── frontend/
│   └── roca-gym-web/            # Angular 18 SSR SPA
│       ├── src/app/
│       │   ├── core/
│       │   │   ├── firebase/    # Firebase config & initialization
│       │   │   └── services/    # Singleton Angular services
│       │   ├── features/
│       │   │   ├── home/        # Public landing page
│       │   │   │   └── components/
│       │   │   │       ├── hero/          # Cinematic tour slideshow
│       │   │   │       ├── about/         # About section
│       │   │   │       ├── facilities/    # Multi-slide facility cards
│       │   │   │       ├── plans/         # Membership plan cards
│       │   │   │       ├── location/      # Hours & map section
│       │   │   │       ├── store/         # Supplement & merch store
│       │   │   │       ├── dashboard/     # Authenticated member dashboard
│       │   │   │       ├── navbar/        # Responsive top navigation
│       │   │   │       ├── footer/        # Footer with social links
│       │   │   │       ├── cart-modal/    # Shopping cart drawer
│       │   │   │       ├── gym-radio/     # Procedural Beast Mode audio player
│       │   │   │       ├── workout-modal/ # Symmetry Pro 4-phase workout engine
│       │   │   │       └── idle-screen/   # Cinematic screensaver (10 min idle)
│       │   │   ├── auth/        # Login / Register pages
│       │   │   └── admin/       # Admin panel (orders, members, stats)
│       │   └── styles.css       # Global mobile-first CSS
│       ├── public/
│       │   └── images/          # Optimised WebP assets
│       ├── angular.json
│       └── package.json
├── database/
│   └── firestore.rules          # Firestore security rules
├── vercel.json                  # Vercel deployment config (SSR + rewrites)
└── README.md
```

---

## 🧰 Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 18 (standalone components) |
| Rendering | Angular SSR (Universal) | 18 |
| Styling | Tailwind CSS v4 | 4.x |
| Backend-as-a-Service | Firebase | 10.x |
| Auth | Firebase Authentication (Email/Password) | 10.x |
| Database | Cloud Firestore (NoSQL) | 10.x |
| Hosting | Vercel (Edge Network) | — |
| Audio | Web Audio API (procedural synthesis) | Native |
| Build | esbuild (via Angular CLI) | — |
| Package Manager | npm | — |

---

## ⚙️ Firebase Config

The Firebase config lives in:

```
frontend/roca-gym-web/src/app/core/firebase/firebase.config.ts
```

> ⚠️ **Never commit real secrets to a public repo.** Move these to environment variables before going fully public.

### Firestore Collections

| Collection | Description |
|---|---|
| `users` | Member profiles (name, email, plan, status, XP, role) |
| `orders` | Store orders (items, total COP, customer info, pickup code) |
| `attendances` | QR check-in records (userId, date, status) |
| `workoutSessions` | Symmetry Pro sessions (phases, volume kg, PR records) |

---

## 🚀 Local Development

```powershell
git clone https://github.com/JuSegu/roca-gym-platform.git
cd roca-gym-platform/frontend/roca-gym-web
npm install
npm start
# http://localhost:4200
```

### Test Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@rocagym.com` | `12345678` |
| Member | `maria@email.com` | `12345678` |
| Member | `carlos@email.com` | `12345678` |
| Member | `mateo@email.com` | `12345678` |
| Member | `sofia@email.com` | `12345678` |

---

## 🌐 Vercel Deployment

Auto-deploys on every `git push origin main`.

```powershell
git add .
git commit -m "feat: your change"
git push origin main
# Vercel builds in ~60s
```

---

## 🎵 Audio Engine (Web Audio API)

`AudioPlayerService` generates procedural gym phonk beats — **zero audio files**, 100% synthesized:

- **Kick drum**: Oscillator 140Hz → 35Hz exponential ramp
- **Snare**: White noise buffer + highpass filter 1kHz
- **Hi-hat**: Square oscillator 8kHz
- **Phonk bass**: Triangle oscillator 41–82Hz

**Cycle**: Plays 3 min → pauses 3 min → repeats. Respects browser autoplay policy.

---

## 🏋️ Symmetry Pro Workout Engine

| Phase | What it does |
|---|---|
| **1 Warmup** (8-10 min) | Joint mobility drills + target muscle map + countdown timer |
| **2 Lifting** | Set logging (kg × reps), rest timer (ring animation), PR detector |
| **3 Cardio** | Machine recommendation (Treadmill 12% / StairMaster) + calorie estimate |
| **4 Symmetry AI** | Score 0-100, rank (Titán/Diamante/Platino), +350 XP reward |

---

## 🎬 Idle Screensaver

`IdleScreen` component — triggers after **10 minutes** of inactivity:

- Rotating gym scenes (Ken Burns + scanline overlay)
- Staggered ROCA GYM logo reveal (subtitle → ROCA → GYM → tagline)
- Dismiss on any click / tap / keypress

---

## 🛒 Guest Checkout

Non-registered users provide name + phone. Order saved in Firestore with `customerPhone`. Admin sees full details. Digital receipt with WhatsApp one-click sender.

---

## 🔐 Security Checklist

- [x] Firestore rules: users read/write own data only
- [x] Admin gated by email + `role` field in Firestore
- [x] Guest orders require name + phone
- [x] QR denied for `Pendiente`/`Inactivo` members
- [ ] TODO: Firebase config to env vars before public launch
- [ ] TODO: Firebase App Check (reCAPTCHA) for production

---

## 📦 Image Assets (WebP)

```
public/images/
├── facilities/   # zona_entrenamiento, pesos_libres, maquinas, cardio, ambiente
├── store/        # whey_protein, creatine, preworkout, tshirt, belt, shaker
└── hero/         # entrance, machines, freeweights, powerzone
```

---

## 🧪 Simulation

```powershell
node brain/.../scratch/simulate_1_week_audit.js
# 56 QR check-ins | 56 workouts | 10 orders | $1,350,250 COP
```