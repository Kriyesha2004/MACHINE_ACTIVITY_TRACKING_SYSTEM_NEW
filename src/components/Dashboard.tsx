import React from 'react';
import { AlertCircle, BarChart3, Calendar, Wrench } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Active Issues',
      value: '12',
      icon: AlertCircle,
      classes: {
        border: 'border-red-500',
        bg: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        text: 'text-red-400'
      }
    },
    {
      label: 'Solved This Week',
      value: '28',
      icon: BarChart3,
      classes: {
        border: 'border-green-500',
        bg: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        text: 'text-green-400'
      }
    },
    {
      label: 'Services Due',
      value: '5',
      icon: Calendar,
      classes: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        text: 'text-yellow-400'
      }
    },
    {
      label: 'Total Machines',
      value: '156',
      icon: Wrench,
      classes: {
        border: 'border-blue-500',
        bg: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        text: 'text-blue-400'
      }
    }
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-sm text-gray-300">Last updated: {new Date().toLocaleString()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div key={index} className={`bg-linear-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-l-4 ${stat.classes.border} hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 ${stat.classes.bg} rounded-full flex items-center justify-center border ${stat.classes.borderColor}`}>
                  <StatIcon className={stat.classes.text} size={32} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-white">Recent Issues</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2 shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-white">Machine ID: 1J - Heating Issue</p>
                  <p className="text-xs text-gray-400">Section: Dye Polyester</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-white">Upcoming Services</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-white">Machine ID: 2K - 8 Week Service</p>
                  <p className="text-xs text-gray-400">Due: Nov 30, 2024</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
