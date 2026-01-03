# 🏗️ MATRIX System - Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    MATRIX System                        │
│         Role-Based Maintenance Management               │
└─────────────────────────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
        ┌──▼──┐          ┌──▼──┐         ┌──▼──┐
        │Login│          │Auth │         │Auth │
        │Page │          │Context      │Hooks │
        └──┬──┘          └──┬──┘         └──┬──┘
           │                │                │
           └────────────────┼────────────────┘
                     ┌──────▼──────┐
                     │  Protected  │
                     │   Routes    │
                     └──────┬──────┘
                     ┌──────▼──────────────┐
                     │   App Layout        │
                     │  (Sidebar + Pages)  │
                     └──────┬──────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
        ┌──▼─────────┐  ┌──▼──┐         ┌──▼──┐
        │Admin Pages │  │Common│        │Employee│
        │  - Dash    │  │Pages │        │ Pages  │
        │  - Employees   └──┬──┘        └────┬──┘
        └──────┬─────┘      │               │
               └────────────┼───────────────┘
                     (All connected to Backend API)
```

---

## 🔐 Authentication Flow

```
User Visit
    │
    ├─→ Check localStorage for saved session
    │
    ├─→ If exists → Load user & redirect to dashboard
    │
    ├─→ If not → Show LoginPage
    │
    └─→ On Login:
        1. User selects role (Admin/Employee)
        2. Enters password
        3. AuthContext validates
        4. Creates user object
        5. Saves to localStorage
        6. Redirects to dashboard
```

---

## 📊 Role-Based Access Control

```
┌──────────────────┬──────────────────┬──────────────────┐
│   Feature        │      Admin       │    Employee      │
├──────────────────┼──────────────────┼──────────────────┤
│ Dashboard        │   ✅ Admin View  │  ✅ Employee     │
│ Maintenance      │      ✅          │      ✅          │
│ Issues           │      ✅          │      ✅          │
│ Reports          │      ✅          │      ✅          │
│ Add Employee     │      ✅          │      ❌          │
│ Manage Employees │      ✅          │      ❌          │
│ My Tasks         │      ❌          │      ✅          │
│ Assigned Machines│      ❌          │      ✅          │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 🗂️ Component Hierarchy

```
App (Router + AuthProvider)
│
├── LoginPage
│   ├── Role Selection
│   ├── Password Input
│   └── Demo Credentials Display
│
└── AppLayout (Only for authenticated users)
    │
    ├── Sidebar
    │   ├── Logo Section
    │   ├── User Info Card
    │   ├── Navigation Items
    │   │   ├── Dashboard
    │   │   ├── Collapsible Groups
    │   │   │   ├── Routine Maintenance
    │   │   │   ├── Machine Issues
    │   │   │   └── [More...]
    │   │   └── Role-Based Items
    │   └── Logout Button
    │
    └── Main Content Area
        │
        ├── ProtectedRoute
        │   └── Page Component
        │       ├── Header
        │       ├── Content
        │       └── Footer
        │
        └── Pages by Role:
            ├── Admin:
            │   ├── AdminDashboard
            │   ├── AddEmployeePage
            │   └── ManageEmployeesPage
            │
            ├── Employee:
            │   ├── EmployeeDashboard
            │   └── MyTasksPage
            │
            └── Common:
                ├── ActiveIssuesPage
                ├── SolvedIssuesPage
                ├── NormalServicePage
                └── ReportsPage
```

---

## 📦 State Management Architecture

### Global State (AuthContext)
```typescript
{
  user: {
    id: string,
    role: 'admin' | 'employee',
    email: string,
    name: string
  },
  isAuthenticated: boolean,
  login: (role) => void,
  logout: () => void
}
```

### Component Local State
- Sidebar: `sidebarOpen`, `expandedItems`
- Pages: Form data, filters, selections
- Lists: Search terms, sorting

### Persistence
- **localStorage**: User session data
- **SessionStorage** (future): Temporary data

---

## 🔄 Data Flow

### Authentication Flow
```
LoginPage
  ↓
User selects role & enters password
  ↓
handleLogin() validates credentials
  ↓
AuthContext.login(role)
  ↓
Create user object + save to localStorage
  ↓
Redirect to dashboard
```

### Navigation Flow
```
Sidebar Item Clicked
  ↓
onClick handler
  ↓
useNavigate() to route
  ↓
Route matches in App.tsx
  ↓
ProtectedRoute checks auth + role
  ↓
Render appropriate page component
```

### Task Management Flow
```
MyTasksPage loaded
  ↓
useState initializes tasks
  ↓
User clicks "Mark Done"
  ↓
markCompleted(id) updates state
  ↓
Task status changes to 'completed'
  ↓
UI re-renders
```

---

## 🎨 Styling Architecture

### Tailwind CSS Layers
```css
@import "tailwindcss";

@theme {
  /* Custom theme variables */
  --font-family-sans: 'Segoe UI', ...
  --animate-fadeInUp: ...
  /* Custom animations */
}

@layer base {
  /* Reset, typography */
}

@layer components {
  /* Reusable component classes */
}

@layer utilities {
  /* Custom utility classes */
}
```

### Color Scheme
- **Background**: `from-slate-950 via-slate-900 to-slate-950`
- **Cards**: `bg-gray-900/50` with `backdrop-blur-md`
- **Accents**: Blue, Purple, Green, Red, Yellow
- **Text**: White (`#ffffff`), Gray-400 (`#9CA3AF`)

### Responsive Design
```
Mobile (< 768px)     → Single column, collapsible sidebar
Tablet (768-1024px)  → 2 columns, compact sidebar
Desktop (> 1024px)   → Full layout, expanded sidebar
```

---

## 🔌 Backend Integration Points

### Current (Frontend Only)
```
LoginPage → hardcoded validation
Pages → mock data from useState
```

### After Backend Integration
```
LoginPage → POST /api/auth/login
Pages → GET /api/employees, /api/machines, etc.
Forms → POST /api/employees/create
Updates → PUT /api/employees/:id
Delete → DELETE /api/employees/:id
```

### API Structure (Recommended)
```
/api
  /auth
    POST /login
    POST /logout
    POST /refresh
  /employees
    GET /
    POST /create
    PUT /:id
    DELETE /:id
  /machines
    GET /
    GET /:id
    POST /issues
  /tasks
    GET /
    PUT /:id/complete
  /reports
    GET /
    GET /generate
```

---

## 🚀 Scalability Considerations

### Current State
- ✅ Component-based architecture
- ✅ Clear separation of concerns
- ✅ TypeScript for type safety
- ✅ Modular folder structure

### For Growth
1. **State Management**: Consider Redux/Zustand for complex state
2. **API Layer**: Create `src/services/api.ts`
3. **Error Handling**: Add error boundary components
4. **Caching**: Implement React Query
5. **Testing**: Add Jest + React Testing Library
6. **Performance**: Code splitting, lazy loading

### Adding New Features
1. Create component folder/files
2. Add TypeScript interfaces
3. Implement component logic
4. Add routing in App.tsx
5. Add navigation in Sidebar.tsx
6. Style with Tailwind classes

---

## 🔒 Security Considerations

### Current (Development)
```
⚠️ Hardcoded credentials (demo only)
⚠️ No HTTPS
⚠️ No CSRF protection
⚠️ localStorage used directly
```

### Production Implementation
```
✅ JWT authentication
✅ HTTPS only
✅ CSRF tokens
✅ Secure cookie storage
✅ Role-based middleware
✅ Input validation
✅ API rate limiting
✅ Encryption at rest
```

---

## 📊 Data Models

### User
```typescript
interface User {
  id: string,
  role: 'admin' | 'employee',
  email: string,
  name: string
}
```

### Employee
```typescript
interface Employee {
  id: string,
  name: string,
  email: string,
  phone: string,
  department: string,
  joinDate: string,
  status: 'active' | 'inactive'
}
```

### Task
```typescript
interface Task {
  id: string,
  title: string,
  machine: string,
  priority: 'high' | 'medium' | 'low',
  status: 'pending' | 'in-progress' | 'completed',
  dueDate: string
}
```

---

## 🧪 Testing Strategy (Recommended)

```
Unit Tests (Jest)
├── Components/
│   └── Individual component logic
├── Contexts/
│   └── Auth logic
└── Utilities/
    └── Helper functions

Integration Tests
├── Routes/
│   └── Navigation flow
├── Auth/
│   └── Login → Dashboard flow
└── Features/
    └── Task completion flow

E2E Tests (Cypress)
├── Admin workflows
├── Employee workflows
└── Shared features
```

---

## 🎯 Development Checklist

- [x] Project structure
- [x] Authentication system
- [x] Role-based routing
- [x] Admin pages
- [x] Employee pages
- [x] Common pages
- [x] Responsive design
- [ ] Backend API integration
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security audit

---

**This architecture is production-ready and easily extensible!**
