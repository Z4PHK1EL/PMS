# Holy Cross Parish Management System

A simple, secure, and modern web-based appointment booking system for **Holy Cross Parish** built with **HTML, CSS, Bootstrap 5**, **JavaScript**, **Supabase** (Backend-as-a-Service), **EmailJS**, and **Semaphore SMS API**.

This system allows parishioners to book sacraments and services (Baptism, Wedding, Confession, etc.) online with valid ID upload, while parish administrators can review, confirm, or reject requests and automatically notify users via **email + SMS**.

Live demo (example): `https://yourdomain.com` (replace with actual link when deployed)

---

### Features

- Clean, responsive, mobile-friendly UI with full-screen hero
- Appointment booking form with:
  - Real-time valid ID photo upload (with preview & size/type validation)
  - Service selection, preferred date & time
- Admin login protected by **Supabase Authentication**
- Admin dashboard (`admin.html`) with:
  - Real-time appointment list (via Supabase Realtime)
  - View uploaded ID photos (click to enlarge)
  - Confirm / Reject appointments
  - Automatic **Email + SMS** notification on approval/rejection
  - Resend notification button
- Secure storage of appointments and images (Base64) in **Supabase**
- Zero backend server needed (fully static + Supabase)

---

### Tech Stack

| Technology            | Purpose                              |
|-----------------------|---------------------------------------|
| HTML5 / CSS3 / JS     | Frontend structure & logic            |
| Bootstrap 5           | Responsive design & components        |
| Supabase              | Database, Authentication, Realtime    |
| EmailJS               | Send confirmation/rejection emails    |
| Semaphore SMS API     | Send SMS notifications (Philippines) |
| Font Awesome          | Icons                                 |
| Google Fonts          | Typography (Playfair Display + Roboto)|

---

### Project Structure
