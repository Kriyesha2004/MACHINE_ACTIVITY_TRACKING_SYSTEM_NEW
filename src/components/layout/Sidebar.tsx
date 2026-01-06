import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Wrench,
  AlertCircle,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Users,
  Plus,
  QrCode,
  Zap,
  TrendingUp,
  AlertTriangle,
  History,
  Calendar,
  List,
} from 'lucide-react';

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  adminOnly?: boolean;
  employeeOnly?: boolean;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Routine Maintenance', 'Machine Issues']);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard',
      icon: <Home size={20} />,
    },

    // Admin Navigation
    // Maintenance Group
    {
      label: 'Maintenance',
      icon: <Wrench size={20} />,
      adminOnly: true,
      children: [
        { label: 'Daily Checklist', path: '/admin/daily-maintenance', icon: <Calendar size={16} /> },
        { label: 'Monthly Checklist', path: '/admin/monthly-maintenance', icon: <Calendar size={16} /> },
        { label: '8-Week Checklist', path: '/admin/8-week-plan', icon: <TrendingUp size={16} /> },
        { label: 'Manage Templates', path: '/admin/templates', icon: <FileText size={16} /> },
        { label: 'Maintenance Planner', path: '/admin/8-week/planner', icon: <Calendar size={16} /> },

      ],
    },

    // 3. Machine Management
    {
      label: 'Machine Management',
      icon: <Zap size={20} />,
      adminOnly: true,
      children: [
        { label: 'Machines', path: '/admin/machines', icon: <List size={16} /> },
        { label: 'History', path: '/admin/machine-history', icon: <History size={16} /> },
        { label: 'Issues', path: '/admin/machine-issues', icon: <AlertTriangle size={16} /> },
      ],
    },

    // 4. Employee Management
    {
      label: 'Employee Management',
      icon: <Users size={20} />,
      adminOnly: true,
      children: [
        { label: 'Add Employee', path: '/admin/add-employee', icon: <Plus size={16} /> },
        { label: 'Manage Employees', path: '/admin/manage-employees', icon: <Users size={16} /> },
      ],
    },

    // 5. Reports & Settings
    {
      label: 'Reports',
      path: '/admin/generate-reports',
      icon: <FileText size={20} />,
      adminOnly: true,
    },
    {
      label: 'System Settings',
      path: '/admin/system-settings',
      icon: <Settings size={20} />,
      adminOnly: true,
    },

    // Employee Navigation
    {
      label: 'QR Code Scanner',
      path: '/employee/scan-qr',
      icon: <QrCode size={20} />,
      employeeOnly: true,
    },
    {
      label: 'Maintenance',
      icon: <Wrench size={20} />,
      employeeOnly: true,
      children: [
        { label: 'Maintenance Tasks', path: '/employee/maintenance', icon: <Wrench size={16} /> },
        { label: 'View Templates', path: '/employee/view-templates', icon: <FileText size={16} /> },
      ],
    },
    {
      label: 'Issues & Reports',
      icon: <AlertCircle size={20} />,
      employeeOnly: true,
      children: [
        { label: 'Report Issue', path: '/employee/add-issue', icon: <AlertTriangle size={16} /> },
        { label: 'Create Report', path: '/employee/report-creation', icon: <FileText size={16} /> },
      ],
    },
  ];

  const toggleExpand = (label: string) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      setExpandedItems((prev) => !prev.includes(label) ? [...prev, label] : prev);
      return;
    }
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const filteredItems = navItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    if (item.employeeOnly && user?.role !== 'employee') return false;
    return true;
  });

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    if (!item.path && !hasChildren) return null;

    return (
      <div key={item.label} className="relative group">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.label);
            } else if (item.path) {
              navigate(item.path);
              if (window.innerWidth < 1024 && depth === 0) setSidebarOpen(false);
            }
          }}
          title={!sidebarOpen ? item.label : ''}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
            ${depth > 0 && sidebarOpen ? 'ml-4 w-[calc(100%-1rem)]' : ''}
            ${depth === 0
              ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              : depth === 1
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
            }
          `}
        >
          <div className={`${!sidebarOpen ? 'mx-auto' : ''} shrink-0`}>
            {item.icon}
          </div>

          {sidebarOpen && (
            <>
              <span className={`flex-1 text-left text-sm font-medium truncate`}>
                {item.label}
              </span>
              {hasChildren && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </>
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isExpanded && sidebarOpen && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-gray-900 text-white shadow-lg border border-gray-800"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-950 border-r border-gray-800 transition-[width] duration-300 z-40 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'}
          lg:sticky lg:top-0
        `}
      >
        {/* Header / Logo / Desktop Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 shrink-0 relative">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-lg tracking-wide truncate">MATRIX</span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:flex items-center justify-center p-1.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors absolute ${sidebarOpen ? '-right-3 top-5' : '-right-3 top-5'} shadow-md z-50`}
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
              <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs">
                {user?.role?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs cursor-default" title={`${user?.name} (${user?.role})`}>
                {user?.role?.[0].toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
          {filteredItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 shrink-0">
          <button
            onClick={logout}
            title={!sidebarOpen ? 'Logout' : ''}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
