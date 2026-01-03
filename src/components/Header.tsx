import React, { useState } from 'react';
import { Menu, X, Bell, User, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 border-b-4 border-purple-400">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 text-white hover:scale-110"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-white">MATRIX</h1>
              <p className="text-xs text-blue-100">Machine Activity Tracking</p>
            </div>
          </div>
        </div>

        {/* Center Search */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input
              type="text"
              placeholder="Search machine, issue, or service..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all text-white hover:scale-110"
            >
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 backdrop-blur-md">
                <div className="px-4 py-3 border-b border-gray-700">
                  <h3 className="font-semibold text-white text-lg">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-800/50 border-b border-gray-700/30 transition-colors">
                    <p className="text-sm font-medium text-white">New Issue Reported</p>
                    <p className="text-xs text-gray-400">Machine ID: 1J - Section: Dye Polyester</p>
                    <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-800/50 border-b border-gray-700/30 transition-colors">
                    <p className="text-sm font-medium text-white">Service Due This Week</p>
                    <p className="text-xs text-gray-400">5 machines require 8-week service</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-white/20 rounded-lg transition-all text-white"
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <User size={20} className="text-white" />
              </div>
              <ChevronDown size={18} className="hidden md:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 backdrop-blur-md">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="font-semibold text-sm text-white">John Technician</p>
                  <p className="text-xs text-gray-400">Engineering Dept.</p>
                </div>
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800/50 transition-colors">Profile Settings</button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800/50 transition-colors">Change Password</button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-800/50 transition-colors border-t border-gray-700">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
