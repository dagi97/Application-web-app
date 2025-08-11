# A2SV Application Platform

A comprehensive web application platform designed to manage the application process for A2SV (Africa to Silicon Valley), an elite program that fast-tracks Africa's brightest talent to software engineering careers at leading tech companies.

## 🌟 Overview

This platform serves as the central hub for prospective applicants to join the A2SV program. It provides a complete application management system with role-based access control for applicants, reviewers, managers, and administrators.

### Key Features

- **Multi-role Application System**: Supports applicants, reviewers, managers, and administrators
- **Comprehensive Application Process**: Personal info, coding profiles, essays, and resume submission
- **Real-time Application Tracking**: Monitor application status and progress
- **Review and Management Dashboard**: Streamlined review process for evaluators
- **Analytics and Reporting**: Data-driven insights for administrators
- **Secure Authentication**: NextAuth.js integration for secure user management

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with modern features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library

### State Management & Data
- **Redux Toolkit** - State management with RTK Query
- **React Hook Form** - Form handling with validation
- **Axios** - HTTP client for API requests

### Authentication
- **NextAuth.js** - Complete authentication solution
- **JWT Decode** - Token handling and validation

### Development Tools
- **ESLint** - Code linting and quality
- **Turbopack** - Fast bundler for development

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── applicant/         # Applicant-specific pages
│   ├── manager/           # Manager dashboard pages
│   ├── reviewer/          # Reviewer pages
│   ├── admin/             # Admin pages
│   └── components/        # Shared components
├── lib/                   # Utility libraries
│   ├── redux/             # Redux store and slices
│   └── context/           # React contexts
├── hooks/                 # Custom React hooks
├── providers/             # React providers
└── styles/                # Global styles
```

## 🎯 User Roles

### Applicants
- Create and manage application profiles
- Submit personal information, coding profiles, essays, and resumes
- Track application progress and status
- Receive notifications and updates

### Reviewers
- Access assigned applications for evaluation
- Provide structured feedback and ratings
- Track review progress and completion
- Collaborate with other reviewers

### Managers
- Oversee application workflow and processes
- Monitor team performance and analytics
- Manage application cycles and deadlines
- Generate reports and insights

### Administrators
- Complete system control and configuration
- User management and role assignments
- System analytics and monitoring
- Platform maintenance and updates

## 📋 Application Process

The application process is structured into several phases:

1. **Registration** - Create account and basic profile
2. **Personal Information** - Submit personal details and background
3. **Coding Profiles** - Link coding platform profiles (GitHub, LeetCode, etc.)
4. **Essays & Resume** - Submit written essays and resume/CV
5. **Review Process** - Applications evaluated by review team
6. **Decision** - Final acceptance decision and notification

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Clone the Repository
```bash
git clone https://github.com/dagi97/Application-web-app.git
cd Application-web-app
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Environment Setup
Create a `.env.local` file in the root directory with the following environment variables:

```env
NEXTAUTH_SECRET=your-secret-key-here
```

Optional development variables (for development testing):
```env
REACT_APP_DEV_ACCESS_TOKEN=your-dev-access-token
REACT_APP_DEV_REFRESH_TOKEN=your-dev-refresh-token
```

### Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production
```bash
npm run build
npm start
```

## 🌐 Key Pages

### Landing Page
- Hero section with program overview
- Application call-to-action
- Success stories and alumni testimonials
- Program journey and phases

### Authentication
- User registration and login
- Password reset functionality
- Role-based access control

### Applicant Dashboard
- Application progress tracking
- Profile management
- Document submission
- Status updates

### Management Dashboards
- Application overview and analytics
- Team performance metrics
- Review assignment management
- Reporting and insights

## 📊 Analytics & Features

- **Real-time Dashboard**: Live updates on application metrics
- **Performance Tracking**: Monitor reviewer efficiency and completion rates
- **Application Analytics**: Comprehensive data on application trends
- **User Management**: Complete control over user accounts and permissions
- **Cycle Management**: Create and manage application cycles
- **Document Management**: Secure file upload and storage

## 🔧 Configuration

### Backend Integration
The application connects to a remote backend API at `https://a2sv-application-platform-backend-team2.onrender.com/` for all data operations including:
- User authentication and session management
- Application submissions and document storage
- Review feedback and ratings
- System analytics and reporting

### API Integration
- RESTful API with RTK Query for efficient data fetching
- JWT token-based authentication with automatic refresh
- Comprehensive error handling and loading states
- Request/response interceptors for authentication headers

## 🤝 Contributing

We welcome contributions to improve the A2SV Application Platform. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint for code quality
- Write clean, documented code
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.