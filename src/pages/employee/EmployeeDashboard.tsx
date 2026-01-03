import React, { useState } from 'react';
import { Wrench, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const [stats] = useState([
    { label: 'Assigned Machines', value: '8', icon: Wrench, color: 'blue' },
    { label: 'Active Tasks', value: '3', icon: Clock, color: 'yellow' },
    { label: 'Pending Issues', value: '5', icon: AlertCircle, color: 'red' },
    { label: 'Completed Tasks', value: '24', icon: CheckCircle, color: 'green' },
  ]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Employee Dashboard</h1>
          <p className="text-gray-400">Your maintenance tasks and machine status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses: Record<string, string> = {
              blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
              red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
              green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
              yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
            };

            return (
              <div
                key={index}
                className={`bg-linear-to-br ${colorClasses[stat.color]} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium text-sm">{stat.label}</h3>
                  <Icon size={24} className={colorClasses[stat.color].split(' ').pop() || ''} />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-white mb-4">My Tasks Today</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Machine 1J - 8-Week Service</p>
                    <p className="text-xs text-gray-400">Priority: High | Due: Today</p>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded shrink-0">Pending</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Machines */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-white mb-4">Assigned Machines</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div>
                    <p className="text-sm font-medium text-white">Machine {String.fromCharCode(64 + item)}J</p>
                    <p className="text-xs text-gray-400">Status: Active</p>
                  </div>
                  <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-all">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

