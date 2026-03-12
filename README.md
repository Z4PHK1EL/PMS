# Holy Cross Parish Appointment Booking System

A modern, secure, and user-friendly web application for **Holy Cross Parish** that allows parishioners to book sacraments and pastoral services online, while providing parish administrators with a powerful dashboard to manage appointments and automatically generate official sacramental certificates.

**Admin Dashboard:** `/admin.html` (protected with email/password login)

## ✨ Key Features

### Public-Facing Website (index.html)
- Beautiful full-screen hero section with fixed altar background and glassmorphism booking card
- Easy appointment booking form with:
  - Full name, email, phone
  - Service type dropdown (Baptism, Wedding, House Blessing, etc.)
  - Preferred date & time (past dates blocked)
  - Optional notes & document upload (with live preview)
- Automatic **Announcement Modal** on page load (Lenten 2026 restrictions)
- **Requirements Modal** (opens on button click) with accordion-style sacrament requirements
- Transparent glassmorphism **Services** section highlighting main offerings
- Toast notifications for form submission feedback
- Fully responsive & mobile-friendly design

### Admin Dashboard (admin.html)
- Secure login using Supabase Authentication
- Real-time **Appointments** overview:
  - Live stats (Total, Pending, Approved, Rejected)
  - Filterable & searchable table
  - Approve / Reject buttons with automatic EmailJS + Semaphore SMS notifications
  - View full details & uploaded documents in modals
- **Certificates Generator** module:
  - Supports **Baptism**, **Confirmation**, and **First Communion** certificates
  - Dynamic form fields (First Communion only shows name + date)
  - Uses your own `.docx` templates stored in Supabase Storage
  - One-click save + automatic `.docx` generation & download
  - Real-time certificates table with sorting

### Technical Highlights
- **Backend:** Supabase (PostgreSQL database, authentication, realtime subscriptions, storage)
- **Frontend:** Bootstrap 5 + custom glassmorphism + Lucide icons
- **Notifications:** EmailJS (email) + Semaphore (SMS – Philippines-ready)
- **Certificate Generation:** docxtemplater + PizZip (client-side `.docx` rendering)
- **Realtime:** Live updates for both appointments and certificates
- **Security:** Row Level Security + email/password auth

## Tech Stack

- HTML5 / CSS3 / JavaScript (ES6+)
- Bootstrap 5.3
- Supabase (database, auth, realtime, storage)
- EmailJS
- Semaphore SMS API
- docxtemplater + PizZip
- Lucide Icons

## Project Structure

```text
holy-cross-parish-booking/
├── index.html               # Public booking website
├── admin.html               # Admin dashboard
├── css/
│   ├── style.css            # Public site styles
├── js/
│   ├── supabase.js          #supabase config
├── assets/
│   └── Altar.jpg            # Hero background image
└── README.md
