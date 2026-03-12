Holy Cross Parish Appointment Booking System
Project Features & Key Features (Full Detailed Documentation)
1. Project Overview
A modern, responsive, and fully functional web-based appointment booking platform for Holy Cross Parish.
It allows parishioners to book sacraments and services online while providing the parish admin team with a secure, real-time dashboard for managing appointments and automatically generating official sacramental certificates.
Built with:

HTML5, CSS3 (Bootstrap 5 + custom glassmorphism design)
Supabase (backend, database, authentication, realtime)
EmailJS + Semaphore SMS (notifications)
docxtemplater (automated .docx certificate generation)

2. Key Features (Public Website – index.html)
Hero Section & Booking Experience

Stunning full-screen hero with fixed altar background image and dark overlay
Prominent “Book an Appointment” card with glassmorphism effect (semi-transparent white background)
Clean booking form with floating labels and real-time validation
Fields: Full Name, Email, Phone, Service Type (dropdown), Preferred Date, Preferred Time, Notes, Optional Document Upload
Live image preview when user uploads supporting documents
Minimum date restriction (cannot book in the past)
Gold accent buttons with smooth hover animations

Smart Modals

Announcement Modal – Automatically opens on every page load/refresh
Displays important Lenten Season 2026 notice (no weddings until after Easter)
Confession schedule, Stations of the Cross, Recollection dates

Requirements Modal – Opens only when user clicks the “Requirements” button (replaces old “Our Services” button)
General requirements + accordion sections for:
Baptism
Wedding
House Blessing
Other services (Confession, Mass Intention, etc.)



Services Section

Beautiful transparent glassmorphism cards with the same altar background visible behind them
Four highlighted services: Baptism, Wedding, House Blessing, Pastoral Counseling
Hover effects, equal-height cards, gold icons

Additional UX Features

Toast notifications for successful submissions
Fully responsive (mobile-first design)
Lucide icons throughout
Professional footer with copyright

3. Key Features (Admin Dashboard – admin.html)
Secure Login

Supabase Authentication (email + password)
Protected dashboard (only logged-in admins can access)

Real-time Appointments Management

Live statistics cards: Total, Pending, Approved, Rejected
Filter buttons: All / Pending / Approved / Rejected
Realtime table (updates instantly when someone books)
Columns: Name, Service, Date & Time, Contact, Status, Actions
Actions per row:
View full details (modal)
View uploaded document (image modal)
Approve / Reject (with one click)

Automatic notifications:
Email via EmailJS (different templates for approved/rejected)
SMS via Semaphore (Philippines-ready with +63 formatting)


Automated Certificate Generator (New Major Feature)

Dedicated Certificates tab (separate from Appointments)
Supports three official certificate types:
Baptismal Certificate (full fields: name, parents, birth place, baptism date, minister, sponsors male/female, book/page/line)
Confirmation Certificate (name, confirmation date, minister, sponsors, book/page/line)
First Communion Certificate (only name + date of first communion – simplified form)

Dynamic form: fields automatically appear/disappear based on selected type
Uses your own .docx template files stored in Supabase Storage
One-click “Save & Generate Certificate” button
Instant .docx download with correct placeholders filled
Realtime Certificates table (sortable by Type, Name, Date, Minister)
Download button on every saved record

4. Technical & Security Features

All data stored in Supabase (appointments + certificates tables)
Realtime subscriptions (appointments and certificates update live)
Image upload converted to base64 and stored safely
Row Level Security enabled
Clean, maintainable code structure
No external paid hosting required (Supabase free tier is sufficient)
Mobile-optimized admin interface
