# 🚀 PromptGenius - AI Prompt Generator SaaS

<div align="center">

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Material Design](https://img.shields.io/badge/Material_Design-757575?style=for-the-badge&logo=material-design&logoColor=white)

**A modern, full-stack SaaS application for generating optimized AI prompts with advanced authentication and responsive design.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-1976D2?style=for-the-badge&logo=vercel&logoColor=white)](https://promptgenius-demo.vercel.app)
[![Documentation](https://img.shields.io/badge/Documentation-4CAF50?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://github.com/Biershoot/SaaS_generador_de_prompts_frontend/wiki)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture](#️-architecture)
- [🔐 Security Features](#-security-features)
- [📱 Responsive Design](#-responsive-design)
- [🎨 UI/UX Highlights](#-uiux-highlights)
- [📊 Project Structure](#-project-structure)
- [🔧 Development](#-development)
- [📈 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **AI Prompt Generation**: Create optimized prompts for multiple AI providers (OpenAI, Claude, Gemini)
- **Smart Categorization**: Organize prompts by category (Chat, Creative, Business, Technical, etc.)
- **Real-time Validation**: Character counter and input validation with instant feedback
- **History Management**: Track and manage all generated prompts
- **Favorites System**: Save and organize your best prompts

### 🔐 Advanced Authentication
- **JWT-based Security**: Secure token-based authentication
- **Refresh Token Strategy**: Automatic token refresh with HttpOnly cookies
- **Route Protection**: Guarded routes with role-based access control
- **Session Management**: Persistent login sessions with automatic validation

### 📱 Modern UI/UX
- **Dark Theme Design**: Professional dark interface with Material Design
- **Responsive Layout**: Fully responsive across all devices
- **Real-time Feedback**: Loading states, animations, and notifications
- **Accessibility**: WCAG compliant with keyboard navigation support

---

## 🛠️ Tech Stack

### Frontend
- **Angular 20.2.1** - Modern reactive framework with standalone components
- **TypeScript 5.9.2** - Type-safe development with strict configuration
- **Angular Material** - Professional UI components and theming
- **RxJS** - Reactive programming for state management
- **ESLint** - Code quality and consistency

### Backend
- **Spring Boot 3.x** - Enterprise-grade Java framework
- **Spring Security** - Comprehensive security framework
- **JWT Authentication** - Stateless authentication with refresh tokens
- **Spring Data JPA** - Data persistence and ORM
- **H2 Database** - In-memory database for development

### DevOps & Tools
- **Git** - Version control with conventional commits
- **Angular CLI** - Development and build tools
- **Material Design Icons** - Consistent iconography
- **Responsive Design** - Mobile-first approach

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Biershoot/SaaS_generador_de_prompts_frontend.git
cd SaaS_generador_de_prompts_frontend

# Install dependencies
npm install

# Start development server
ng serve

# Open http://localhost:4200
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Run with Maven
mvn spring-boot:run

# Backend will be available at http://localhost:8080
```

---

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── app/
│   ├── core/                 # Core services and utilities
│   │   ├── auth.service.ts   # Authentication service
│   │   ├── config.service.ts # Configuration management
│   │   └── token.service.ts  # JWT token handling
│   ├── components/           # Reusable components
│   │   └── prompt-generator/ # Main prompt generator
│   ├── pages/               # Page components
│   │   ├── login/           # Authentication pages
│   │   └── dashboard/       # Main dashboard
│   ├── interceptors/        # HTTP interceptors
│   ├── guards/              # Route guards
│   └── shared/              # Shared components
├── environments/            # Environment configuration
└── assets/                 # Static assets
```

### Security Architecture
- **JWT Access Tokens**: Stored in localStorage for API calls
- **Refresh Tokens**: HttpOnly cookies for automatic renewal
- **CORS Configuration**: Secure cross-origin requests
- **Route Guards**: Protected routes with authentication checks
- **HTTP Interceptors**: Automatic token injection and refresh

---

## 🔐 Security Features

### Authentication Flow
1. **Login/Register**: Secure credential validation
2. **Token Generation**: JWT access + refresh token pair
3. **Automatic Refresh**: Seamless token renewal
4. **Session Validation**: Backend token verification
5. **Secure Logout**: Token cleanup and cookie removal

### Security Best Practices
- ✅ HttpOnly cookies for refresh tokens
- ✅ CORS configuration with credentials
- ✅ Input validation and sanitization
- ✅ Route protection with guards
- ✅ Secure HTTP headers
- ✅ Token expiration handling

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px - Full feature set
- **Tablet**: 768px - Optimized layout
- **Mobile**: < 480px - Mobile-first design

### Mobile Features
- Touch-friendly interface
- Swipe gestures for navigation
- Optimized form inputs
- Collapsible navigation
- Responsive typography

---

## 🎨 UI/UX Highlights

### Design System
- **Material Design 3**: Latest design guidelines
- **Dark Theme**: Professional dark interface
- **Consistent Spacing**: 8px grid system
- **Typography**: Roboto font family
- **Color Palette**: Blue primary with semantic colors

### User Experience
- **Loading States**: Skeleton screens and spinners
- **Animations**: Smooth transitions and micro-interactions
- **Feedback**: Toast notifications and error handling
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Lazy loading and code splitting

---

## 📊 Project Structure

```
SaaS_generador_de_prompts_frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── interceptors/            # HTTP interceptors
│   │   ├── guards/                  # Route guards
│   │   └── shared/                  # Shared components
│   ├── environments/                # Environment configs
│   └── assets/                      # Static assets
├── docs/                           # Documentation
├── README.md                       # This file
└── package.json                    # Dependencies
```

---

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix

# Run tests
npm test

# Build for production
npm run build
```

### Git Workflow
- **Conventional Commits**: Structured commit messages
- **Feature Branches**: Isolated development
- **Pull Requests**: Code review process
- **Semantic Versioning**: Version management

---

## 📈 Performance

### Optimization Techniques
- **Lazy Loading**: Route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Bundle Optimization**: Compressed and minified builds
- **Caching Strategy**: Browser and service worker caching
- **Image Optimization**: WebP format and lazy loading

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Angular Team** for the amazing framework
- **Material Design** for the design system
- **Spring Boot** for the robust backend
- **OpenAI** for AI integration inspiration

---

<div align="center">

**Built with ❤️ by [Alejandro](https://github.com/Biershoot)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/alejandro-dev)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Biershoot)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://alejandro-portfolio.com)

</div>
