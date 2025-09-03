🐛 Bug Tracker - Modern Issue Management System
A comprehensive full-stack bug tracking and project management application designed for development teams. Built with modern web technologies to provide an intuitive, responsive, and feature-rich experience for managing software issues and development workflows.

[
[
[

✨ Features
🔐 Authentication & Authorization
Multi-role support: Admin, Developer, Tester, Reporter

Secure JWT authentication with token-based sessions

Role-based access control for different functionalities

Profile management with avatar upload support

📊 Dashboard & Analytics
Real-time statistics and comprehensive bug metrics

Interactive charts for bug status distribution

Priority breakdown visualization with Chart.js

Role-specific dashboards with personalized content

🔔 Notification System
Real-time notifications for bug updates and assignments

Assignment alerts and status change notifications

Comment notifications with preview functionality

Mark as read/unread with persistent state

🌙 Modern UI/UX
Dark mode support with system preference detection

Fully responsive design optimized for all devices

Smooth animations and transitions with Framer Motion

Accessible components with ARIA support and keyboard navigation

🐛 Comprehensive Bug Management
Detailed bug forms with rich metadata and attachments

Priority and category classification system

Status tracking (Open, In Progress, Testing, Closed)

Assignment management to team members

Tags and advanced search functionality

👥 Team Collaboration
User management system for administrators

Comment system for bug discussions and updates

Activity timeline and comprehensive audit trails

Team member directory with role information

🛠️ Tech Stack
Frontend
React 19 - Modern UI library with latest features

Vite 4.2.2 - Lightning-fast build tool and dev server

TailwindCSS - Utility-first CSS framework

React Router v7 - Client-side routing

Context API - State management

Heroicons - Beautiful SVG icon library

Framer Motion - Animation library

Chart.js & Recharts - Data visualization

Backend
Node.js - JavaScript runtime environment

Express.js - Web application framework

MongoDB Atlas - Cloud NoSQL database

JWT - JSON Web Token authentication

bcryptjs - Password hashing

Deployment & DevOps
Frontend: Netlify (with automatic deployments)

Backend: Render (with automatic deployments)

Database: MongoDB Atlas (Cloud)

Version Control: Git & GitHub

🚀 Live Demo
Frontend Application: https://your-netlify-app.netlify.app

Backend API: https://bug-tracker-1d6m.onrender.com

Test Credentials
text
Email: test@example.com
Password: password123
Role: Developer
📁 Project Structure
text
bug-tracker/
├── package.json                 # Root package.json for monorepo
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React Context providers
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.mjs
├── server/                     # Node.js backend
│   ├── routes/                # API routes
│   ├── models/                # MongoDB models
│   ├── middleware/            # Express middleware
│   ├── config/                # Configuration files
│   └── package.json
└── README.md
🏃‍♂️ Quick Start
Prerequisites
Node.js (v18.0.0 or higher)

npm (v8.0.0 or higher)

MongoDB Atlas account (for database)

Installation
Clone the repository

bash
git clone https://github.com/yourusername/bug-tracker.git
cd bug-tracker
Install dependencies for both frontend and backend

bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install --legacy-peer-deps
Environment Configuration

Backend (.env in server/ folder):

bash
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker
CORS_ORIGINS=http://localhost:3000
Frontend (.env in client/ folder):

bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BugTracker
VITE_APP_VERSION=1.0.0
Run the application

bash
# Start backend server (from server/ directory)
cd server
npm run dev

# Start frontend development server (from client/ directory)
cd ../client
npm run dev
Access the application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

📸 Screenshots
Dashboard (Light Mode)
Dashboard (Dark Mode)
Bug Management Interface
Real-time Notifications
Mobile Responsive Design
🎯 Key Features Showcase
✅ Responsive Design - Seamless experience across desktop, tablet, and mobile

✅ Dark Mode - Eye-friendly dark theme with automatic system detection

✅ Real-time Updates - Instant notifications and live status changes

✅ Role-based Access - Different interfaces and permissions for different user roles

✅ Modern UI - Clean, intuitive interface with smooth micro-interactions

✅ Accessibility - WCAG compliant with full keyboard navigation support

✅ Performance - Optimized with lazy loading and efficient state management

🌟 Perfect For
Development Teams managing software projects and bug tracking

QA Teams organizing testing workflows and issue reporting

Project Managers overseeing development progress and team coordination

Startups requiring efficient and scalable issue management

Open Source Projects needing community-driven bug reporting

🚀 Deployment
Frontend (Netlify)
Connect your GitHub repository to Netlify

Set build command: cd client && npm install --legacy-peer-deps && npm run build

Set publish directory: client/dist

Add environment variables in Netlify dashboard

Backend (Render)
Connect your GitHub repository to Render

Set root directory: server

Set build command: npm install

Set start command: npm start

Add environment variables in Render dashboard

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow existing code style and conventions

Write meaningful commit messages

Add tests for new features

Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙋‍♂️ Author
Your Name

GitHub: @yourusername

LinkedIn: Your LinkedIn

Email: your.email@example.com

🌟 Acknowledgments
React - For the amazing UI library

Vite - For the blazing fast build tool

TailwindCSS - For the utility-first CSS framework

MongoDB Atlas - For the cloud database solution

Netlify & Render - For seamless deployment

📈 Project Status
🟢 Active Development - This project is actively maintained and new features are being added regularly.

Roadmap
 Email Notifications - Send email alerts for critical bugs

 Advanced Filtering - More sophisticated search and filter options

 File Attachments - Support for bug report attachments

 API Documentation - Interactive API docs with Swagger

 Mobile App - React Native mobile application

⭐ If you found this project helpful, please give it a star! ⭐

Built with ❤️ for the developer community
