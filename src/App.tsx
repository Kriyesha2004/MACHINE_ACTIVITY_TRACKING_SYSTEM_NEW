import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { AddEmployeePage } from './pages/admin/AddEmployeePage';
import { ManageEmployeesPage } from './pages/admin/ManageEmployeesPage';
import { AddMachinePage } from './pages/admin/AddMachinePage';
import { MachineListPage } from './pages/admin/MachineListPage';
import { MachineDetailsPage } from './pages/admin/MachineDetailsPage';
import { MachineHistoryPage } from './pages/admin/MachineHistoryPage';
import { RoutineMaintenancePage } from './pages/admin/RoutineMaintenancePage';
import { AddTemplatePage } from './pages/admin/AddTemplatePage';
import { ManageTemplatesPage } from './pages/admin/ManageTemplatesPage';
import { MaintenancePlannerPage } from './pages/admin/MaintenancePlannerPage';
import { EightWeekPlanPage } from './pages/admin/EightWeekPlanPage';
import { MechanicalIssuesPage } from './pages/admin/MechanicalIssuesPage';
import { GenerateReportsPage } from './pages/admin/GenerateReportsPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { DailyMaintenancePage } from './pages/admin/DailyMaintenancePage';
import { MonthlyMaintenancePage } from './pages/admin/MonthlyMaintenancePage';
import { MaintenanceExecutionPage } from './pages/admin/MaintenanceExecutionPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyTasksPage from './pages/employee/MyTasksPage';
import { ScanQRPage } from './pages/employee/ScanQRPage';
import { ViewTemplatesPage } from './pages/employee/ViewTemplatesPage';
import { ReportCreationPage } from './pages/employee/ReportCreationPage';
import { AddMachineIssuePage } from './pages/employee/AddMachineIssuePage';
import { EmployeeMaintenancePage } from './pages/employee/EmployeeMaintenancePage';






// Common Pages
import ActiveIssuesPage from './pages/common/ActiveIssuesPage';
import SolvedIssuesPage from './pages/common/SolvedIssuesPage';
import NormalServicePage from './pages/common/NormalServicePage';
import ReportsPage from './pages/common/ReportsPage';
import PlaceholderPage from './pages/PlaceholderPage';

// Main Layout Wrapper
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
};

// App Component
const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-employee"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <AddEmployeePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-employees"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <ManageEmployeesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-machine"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <AddMachinePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/machines"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MachineListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/machines/:machineId"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MachineDetailsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/machine-history"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MachineHistoryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/routine-maintenance"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <RoutineMaintenancePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {/* Template Management */}
      <Route
        path="/admin/templates"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <ManageTemplatesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/templates/add"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <AddTemplatePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-template"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <AddTemplatePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/8-week-plan"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <EightWeekPlanPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/daily-maintenance"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <DailyMaintenancePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/monthly-maintenance"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MonthlyMaintenancePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/maintenance/execute/:planId"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MaintenanceExecutionPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/8-week/templates"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <ManageTemplatesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/8-week/planner"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MaintenancePlannerPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/mechanical-issues"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <MechanicalIssuesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/generate-reports"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <GenerateReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/system-settings"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <SystemSettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <EmployeeDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/my-tasks"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <MyTasksPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/scan-qr"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <ScanQRPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/view-templates"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <ViewTemplatesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/report-creation"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <ReportCreationPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/add-issue"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <AddMachineIssuePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/maintenance"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <EmployeeMaintenancePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/assigned-machines"
        element={
          <ProtectedRoute requiredRole="employee">
            <AppLayout>
              <PlaceholderPage title="Assigned Machines" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Common Routes */}
      <Route
        path="/issues/active"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ActiveIssuesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues/solved"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SolvedIssuesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlaceholderPage title="Machine History" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/normal-service/set-plan"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NormalServicePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/normal-service/edit-plan"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlaceholderPage title="Edit Service Plan" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/normal-service/start-service"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlaceholderPage title="Start Service" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/overhaul-service"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlaceholderPage title="Overhaul Service" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
