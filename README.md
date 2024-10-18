# Project Name: CollabHub

CollabHub is a collaborative team workspace platform with role-based functionality, designed to streamline task management, track progress, and facilitate communication among teams.

## Features
- Role-based access (Admin, Team Lead, Team Member)
- Task assignment and tracking (Pending, In Progress, Completed)
- Workspace management (Add/Remove members)
- Time tracking and progress reporting
- User authentication and authorization

## Tech Stack
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication, bcrypt.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt for password hashing

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (You can use MongoDB Atlas or a local instance)
- npm (Node Package Manager)

### Clone the repository
```bash
git clone https://github.com/muaaz/collabHub
cd collabHub

cd frontend
npm install
npm run dev


cd backend
npm install
npm start

start both simultaneously to connect backend and frontend
