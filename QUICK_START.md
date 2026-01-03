# 🚀 Quick Start Guide - MATRIX System

## 5-Minute Setup

### 1. Start the Server
```bash
cd my-react-app
npm run dev
```

Open: `http://localhost:5173`

---

## 🔑 Login & Explore

### **Admin Account**
1. Click **Admin** button
2. Enter password: `1234`
3. Click **Sign In**

✨ **You'll see:**
- Admin Dashboard with metrics
- Add New Employee button
- Manage Employees page
- Full system access

### **Employee Account**
1. Click **Employee** button
2. Enter password: `12`
3. Click **Sign In**

✨ **You'll see:**
- Employee Dashboard
- My Tasks page
- Assigned Machines
- Limited feature access

---

## 🗂️ Navigation Guide

### Sidebar Menu Structure

```
MATRIX System
├── Dashboard          → Your role-specific dashboard
├── Routine Maintenance
│   ├── Normal Service (8-Week)
│   │   ├── Set Plan
│   │   ├── Edit Plan
│   │   └── Start Service
│   └── Overhaul Service
├── Machine Issues
│   ├── Active Issues
│   ├── Solved Issues
│   └── Machine History
├── Reports            → Analytics & Reports
├── Admin Panel (Admin Only)
│   ├── Add New Employee
│   └── Manage Employees
└── Employee Panel (Employee Only)
    ├── My Tasks
    └── Assigned Machines
```

---

## 🎯 Key Features to Try

### For Admins:
1. **View Dashboard** - See system metrics
2. **Add Employee** - Form to add new team members
3. **Manage Employees** - Edit, delete, search employees
4. **View Reports** - Generate and download reports

### For Employees:
1. **View Dashboard** - See your tasks and assignments
2. **My Tasks** - Manage your maintenance tasks
3. **Active Issues** - View current machine problems
4. **View Reports** - Access system analytics

### Both Roles:
1. **Active Issues** - See problematic machines
2. **Solved Issues** - Review completed maintenance
3. **Normal Service** - Track 8-week service schedules
4. **Reports** - Generate maintenance reports

---

## 💻 Technical Stack

- **React 18** - Component-based UI
- **TypeScript** - Type-safe code
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide Icons** - Beautiful icons

---

## 🔧 File Structure Quick Reference

```
Source Code (src/)
├── components/          # Reusable UI components
├── contexts/           # Global state (Auth)
├── pages/              # Page components by role
├── types/              # TypeScript interfaces
├── App.tsx             # Main router
└── index.css           # Global styles
```

---

## 📝 Mock Data

The system includes sample data:

**Employees:**
- John Doe (Engineering)
- Jane Smith (Maintenance)
- Mike Johnson (Operations)

**Machines:**
- Machine 1J, 2K, 3M, etc.

**Tasks:**
- 8-Week Services
- Belt replacements
- Oil changes
- Bearing maintenance

---

## 🎨 UI/UX Features

✨ **Modern Design**
- Dark theme with gradient accents
- Glassmorphism effects
- Smooth animations
- Responsive layout

📱 **Responsive**
- Desktop: Full sidebar navigation
- Tablet: Adaptive layout
- Mobile: Collapsible menu

♿ **Accessible**
- Semantic HTML
- Keyboard navigation
- ARIA labels

---

## 🔌 Ready for Backend?

The architecture is designed for easy backend integration:

**To connect your backend:**
1. Update `AuthContext.tsx` - Replace hardcoded login
2. Add API service layer in `src/services/`
3. Replace mock data with API calls
4. Update environment variables

---

## 📚 Code Examples

### Using Authentication
```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  return <p>Welcome {user?.name}</p>;
}
```

### Protected Routes
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>
```

### Navigation
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/admin/manage-employees');
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors?
```bash
npm install
```

### Port already in use?
```bash
# Kill the process on port 5173
# Then restart with different port:
npm run dev -- --port 3000
```

### Styling not working?
```bash
# Rebuild Tailwind CSS
npm run dev
```

---

## 📈 Next Steps

1. **Explore the code** - Check out component structure
2. **Try all pages** - Navigate through the system
3. **Read SYSTEM_GUIDE.md** - Full documentation
4. **Customize** - Add your own branding
5. **Connect backend** - Integrate your API

---

## 🎓 Learning Resources

Each component includes:
- TypeScript types
- Clear variable names
- Inline comments
- Logical organization

---

**Happy coding! 🚀**

Have questions? Check the code comments and component documentation.
