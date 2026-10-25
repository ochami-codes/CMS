# CMS - Church Management System

A frontend platform for church management, modeled around the Seventh-day Adventist church workflow. My first deep dive into React and how a full-stack app really works.

> Built to organize members, departments, and church operations with role-based dashboards.

**Live Demo:** `https://your-cms.vercel.app` 
**Deployed on:** Vercel

---

### Why this project?

This was my first real React project. Before this I was dumping HTML files (see Advent-project). Here I learned:
- How React actually works
- State management, component structure
- Talking to a backend API
- Role-based access & dashboards

### Roles & Dashboards

The system is built around real Adventist church structure:

- **Admin Dashboard** - Overall control, user management, church settings
- **Pastor Dashboard** - Sermons, member pastoral care, appointments
- **Treasury Dashboard** - Offerings, expenses, financial reports
- **Clerk Dashboard** - Membership records, transfers, reports, baptism records
- **Department Leaders** - Manage their departments (Youth, Sabbath School etc.)
- **Members** - View profile, giving history, announcements

### Features

- Role-based authentication & routing
- Member management (add, edit, transfer, archive)
- Finance tracking for treasury
- Clerk records management
- Department management
- Responsive UI for desktop and mobile
- Protected routes per role

### Tech Stack

- **Frontend:** React + JavaScript
- **Data Fetching / State:** TanStack Query (React Query)
- **Routing:** React Router
- **Styling:**  CSS Modules
- **Forms:** React Hook Form
- **Backend:** Node/Express/Supabase
- **Deployment:** Vercel

### What I Learned 
 1. React component lifecycle and composition
 2. How to structure large frontend app
 3. Role-based dashboards in real-world workflow
 4. Tanstack query for caching, loading and error states
 5. Connecting frontend and backend securely
 ### License 
 MIT

 ### Author 
 Ian Ochami —
 First react project, now building full platforms.
    
