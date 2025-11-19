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

## 📁 Project Structure

```
edulink360-frontend/
├── src/
│   ├── pages/
│   │   ├── Signup.jsx          # Signup page (Blaqbeard)
│   │   ├── TeacherDashboard.jsx # Teacher Dashboard (Blaqbeard) - TODO
│   │   ├── TeacherSettings.jsx  # Teacher Settings (Blaqbeard) - TODO
│   │   ├── Login.jsx            # Login page (Partner) - TODO
│   │   ├── StudentDashboard.jsx # Student Dashboard (Partner) - TODO
│   │   └── StudentSettings.jsx  # Student Settings (Partner) - TODO
│   ├── components/              # Shared components (if any)
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
└── index.html                  # HTML template
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
- **Dark Blue**: `#283447`
- **Green**: `#22C55E`

### Typography

- **Font Family**: Mulish (loaded from Google Fonts)
- **Body**: Mulish, system fonts fallback

## 📝 Current Implementation Status

### ✅ Completed
- [x] Project setup with Vite + React
- [x] Tailwind CSS configuration
- [x] React Router setup
- [x] Signup page with animations
- [x] Responsive design

### 🚧 In Progress
- [ ] Teacher Dashboard (Blaqbeard)
- [ ] Teacher Account Settings (Blaqbeard)
- [ ] Login page (Partner)
- [ ] Student Dashboard (Partner)
- [ ] Student Account Settings (Partner)

## 👥 Team Responsibilities

### Blaqbeard
- Signup page ✅
- Teacher Dashboard (in progress)
- Teacher Account Settings

### Partner
- Login page
- Student Dashboard
- Student Account Settings

## 🔗 Routes

- `/` - Redirects to `/signup`
- `/signup` - Signup page
- `/login` - Login page (TODO)
- `/teacher/dashboard` - Teacher Dashboard (TODO)
- `/teacher/settings` - Teacher Settings (TODO)
- `/student/dashboard` - Student Dashboard (TODO)
- `/student/settings` - Student Settings (TODO)

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

**Note**: This is an MVP (Minimum Viable Product) focused on core features for a one-month timeline.
