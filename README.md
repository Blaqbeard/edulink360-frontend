# EduLink360 Frontend

A collaborative educational platform frontend built with React and Vite for the Flexisaf Internship final project.

## 🎯 Project Overview

EduLink360 aims to solve pressing challenges facing Nigerian students and educators by delivering an integrated, accessible, and empowering edtech platform. The project addresses gaps in career guidance, academic record portability, and meaningful feedback loops.

### Core Features

1. **Career Guidance & Mentorship** - AI-powered career quiz combined with a mentor chat system
2. **Student-Owned Digital Academic Portfolio** - Secure platform for students to upload achievements
3. **Continuous Feedback & Communication Loop** - Two-way messaging between teachers and students

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **React Router DOM 7.9.6** - Client-side routing
- **Bootstrap Icons** - Icon library (via CDN)
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon components

## 📁 Project Structure

```
edulink360-frontend/
├── src/
│   ├── pages/                    # Page components
│   │   ├── Login.jsx             # Authentication
│   │   ├── Signup.jsx            # User registration
│   │   ├── Dashboard.jsx         # Student dashboard
│   │   ├── Profile.jsx          # Student profile
│   │   ├── Settings.jsx         # Student settings
│   │   ├── Assignments.jsx       # Student assignments
│   │   ├── Messages.jsx         # Student messaging
│   │   ├── Notifications.jsx    # Student notifications
│   │   ├── Portfolio.jsx        # Digital portfolio
│   │   ├── CareerGuidance.jsx   # Career quiz & guidance
│   │   ├── TeacherDashboard.jsx # Teacher dashboard
│   │   ├── TeacherProfile.jsx   # Teacher profile
│   │   ├── TeacherSettings.jsx  # Teacher settings
│   │   ├── TeacherMessages.jsx # Teacher messaging
│   │   ├── TeacherNotifications.jsx # Teacher notifications
│   │   ├── TeacherAssignments.jsx # Assignment management
│   │   └── Upskilling.jsx       # Professional development
│   ├── components/               # Reusable components
│   │   ├── auth/                # Authentication components
│   │   ├── common/              # Shared UI components
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── layout/              # Layout components
│   │   ├── messages/            # Messaging components
│   │   ├── settings/            # Settings components
│   │   ├── Student/             # Student-specific components
│   │   └── Teacher/             # Teacher-specific components
│   ├── services/                # API service layer
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── routes/                  # Route configuration
│   ├── utils/                   # Utility functions
│   ├── config/                  # Configuration files
│   └── assets/                  # Static assets
├── public/                      # Public static files
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
└── index.html                   # HTML template
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Blaqbeard/edulink360-frontend.git
cd edulink360-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Colors

- **Primary Blue**: `#00B4D8`
- **Orange Accent**: `#FF8A56`
- **Dark Blue**: `#283447` / `#0b1633`
- **Green**: `#22C55E`

### Typography

- **Font Family**: Mulish (loaded from Google Fonts)
- **Body**: Mulish, system fonts fallback

## 📝 Implementation Status

### ✅ Completed Features

#### Authentication & Authorization
- [x] User signup with role selection (Student/Teacher)
- [x] User login with email/password
- [x] Protected routes with role-based access control
- [x] Session management with localStorage

#### Student Features
- [x] Student dashboard with stats and progress tracking
- [x] Assignment viewing and submission
- [x] Two-way messaging with teachers
- [x] Real-time notifications
- [x] Digital portfolio for achievements
- [x] Career guidance quiz
- [x] Profile management with courses/classes selection
- [x] Account settings

#### Teacher Features
- [x] Teacher dashboard with class performance metrics
- [x] Assignment creation and management
- [x] Student submission review and grading
- [x] Two-way messaging with students
- [x] Real-time notifications
- [x] Profile management with subject/class selection
- [x] Account settings
- [x] Professional development page

#### Core Functionality
- [x] Responsive design (mobile, tablet, desktop)
- [x] Real-time message updates
- [x] Unread notification tracking
- [x] Error handling and user feedback
- [x] Loading states and optimistic UI updates
- [x] Form validation

### 🚧 Future Enhancements

- [ ] AI-powered mentor chat (Career Guidance)
- [ ] Advanced analytics and reporting
- [ ] File sharing in messages
- [ ] Push notifications
- [ ] Multi-language support (UI framework in place)

## 🔗 Routes

### Public Routes
- `/login` - Login page
- `/signup` - Signup page

### Student Routes (Protected)
- `/` - Student dashboard
- `/profile` - Student profile
- `/settings` - Account settings
- `/assignments` - View and submit assignments
- `/messages` - Messaging with teachers
- `/notifications` - View notifications
- `/portfolio` - Digital academic portfolio
- `/career` - Career guidance and quiz

### Teacher Routes (Protected)
- `/teacher/dashboard` - Teacher dashboard
- `/teacher/profile` - Teacher profile
- `/teacher/settings` - Account settings
- `/teacher/assignments` - Create and manage assignments
- `/teacher/messages` - Messaging with students
- `/teacher/notifications` - View notifications
- `/teacher/upskilling` - Professional development

## 🏗️ Building for Production

1. Build the production bundle:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 📄 License

This project is part of the Flexisaf Internship program.

## 🤝 Contributing

This is a collaborative project. Please coordinate with your team partner before making major changes.

### Workflow
1. Pull latest changes before starting work
2. Create feature branches if needed
3. Test your changes locally
4. Commit with clear messages
5. Push and coordinate with partner

---

**Note**: This is an MVP (Minimum Viable Product) focused on core features for a one-month timeline. The platform is production-ready and meets all core requirements.
