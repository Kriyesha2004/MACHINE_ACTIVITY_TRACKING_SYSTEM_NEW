# 🔧 MATRIX - Role-Based Maintenance Management System

A modern, full-featured maintenance management system built with React, TypeScript, and TailwindCSS.

## 📋 Features

### 🔐 Authentication System
- **Hardcoded Demo Credentials** (for development):
  - Admin: password `1234`
  - Employee: password `12`
- Role-based access control
- Session persistence with localStorage
- Protected routes by user role

### 👨‍💼 User Roles

#### Admin Panel
- Dashboard with system metrics
- Add new employees
- Manage employees (view, edit, delete)
- Full system oversight
- Access to all features

#### Employee Panel
- Personal dashboard
- My tasks management
- Assigned machines view
- Task completion tracking

### 📊 Common Features (Both Roles)
- Dashboard overview
- Routine maintenance management
  - 8-week normal service scheduling
  - Overhaul service tracking
- Machine issues tracking
  - Active issues
  - Resolved issues
  - Machine history
- Reports & analytics
- Modern dark-themed UI

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx          # Navigation sidebar
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   ├── Header.tsx               # (Old - can be removed)
│   ├── Footer.tsx               # (Old - can be removed)
│   ├── Dashboard.tsx            # (Old - can be removed)
│   └── Sidebar.tsx              # (Old - can be removed)
├── contexts/
│   └── AuthContext.tsx          # Authentication context & hooks
├── pages/
│   ├── LoginPage.tsx            # Login page
│   ├── PlaceholderPage.tsx      # Placeholder for coming soon pages
│   ├── admin/
│   │   ├── AdminDashboard.tsx   # Admin dashboard
│   │   ├── AddEmployeePage.tsx  # Add employee form
│   │   └── ManageEmployeesPage.tsx # Employee management
│   ├── employee/
│   │   ├── EmployeeDashboard.tsx # Employee dashboard
│   │   └── MyTasksPage.tsx      # Task management
│   └── common/
│       ├── ActiveIssuesPage.tsx  # Active issues list
│       ├── SolvedIssuesPage.tsx  # Resolved issues
│       ├── NormalServicePage.tsx # Service tracking
│       └── ReportsPage.tsx       # Reports & analytics
├── types/
│   └── index.ts                 # TypeScript interfaces
├── index.css                    # Global styles
└── App.tsx                      # Main router & layout

```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Navigate to project directory**:
   ```bash
   cd my-react-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:5173
   ```

## 🔑 Demo Login Credentials

### Admin Account
- **Email**: admin@company.com
- **Password**: `1234`

### Employee Account
- **Email**: employee@company.com
- **Password**: `12`

## 🎨 UI/UX Features

- **Modern Dark Theme**: Professional dark interface with gradient accents
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Smooth Animations**: Transitions and hover effects
- **Responsive Design**: Mobile, tablet, and desktop support
- **Accessible**: Proper semantic HTML and ARIA labels
- **Icon Integration**: Lucide icons throughout the interface

## 🔌 API Integration Ready

The system is structured to easily connect to a backend:

1. **AuthContext** can be updated to call actual login endpoint
2. **Data fetching** can replace mock data in pages
3. **API calls** can be added through a service layer

## 📁 Folder Organization Guide

### Adding New Pages
1. Create page component in appropriate folder:
   - `/pages/admin/` for admin-only pages
   - `/pages/employee/` for employee-only pages
   - `/pages/common/` for shared pages
2. Import in `App.tsx`
3. Add route in the Routes section

### Adding New Routes
1. Create the page component
2. Add import in `App.tsx`
3. Add new `<Route>` in the appropriate section
4. Add navigation link in `Sidebar.tsx`

### Creating Protected Routes
All routes automatically wrap with:
```tsx
<ProtectedRoute requiredRole="admin">
  <AppLayout>
    <YourPage />
  </AppLayout>
</ProtectedRoute>
```

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **TailwindCSS** - Styling
- **Lucide Icons** - Icons
- **Vite** - Build tool

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.x.x",
  "lucide-react": "^latest",
  "typescript": "^5.x.x"
}
```

## 🔄 State Management

- **AuthContext** for global authentication state
- **useState** for component-level state
- **localStorage** for session persistence

## 🎯 Next Steps

### Phase 1 (Done ✅)
- ✅ Frontend structure setup
- ✅ Authentication system
- ✅ Role-based routing
- ✅ Core page templates
- ✅ Sidebar navigation

### Phase 2 (To-Do 🔜)
- Backend API integration
- Real database connection
- Employee CRUD operations
- Machine data management
- Task assignment system

### Phase 3 (To-Do 🔜)
- Notifications system
- Email integration
- Advanced reporting
- Dashboard analytics
- Export functionality

## 🔒 Security Notes

⚠️ **Development Only**: Hardcoded credentials are for demo purposes only.

For production:
1. Implement proper JWT authentication
2. Move credentials to secure backend
3. Use environment variables
4. Add password hashing
5. Implement refresh tokens
6. Add CSRF protection

## 📞 Support

For issues or questions, please refer to the code comments and component documentation.

## 📄 License

This project is part of the MATRIX Maintenance Management System.

---

**Ready to extend?** The codebase is modular and extensible. Follow the patterns established and add new features easily!
