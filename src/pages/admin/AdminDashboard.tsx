import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats] = useState([
    { label: 'Total Employees', value: '45', icon: Users, color: 'blue' },
    { label: 'Active Issues', value: '12', icon: AlertCircle, color: 'red' },
    { label: 'Completed Services', value: '156', icon: CheckCircle, color: 'green' },
    { label: 'Performance Score', value: '94%', icon: TrendingUp, color: 'purple' },
  ]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-light mb-2">Admin Dashboard</h1>
          <p className="text-secondary-light">Manage employees and oversee maintenance operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses: Record<string, string> = {
              blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
              red: 'from-accent-secondary/20 to-accent-secondary/10 border-accent-secondary/30 text-accent-secondary',
              green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
              purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
            };

            return (
              <div
                key={index}
                className={`bg-linear-to-br ${colorClasses[stat.color]} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-secondary-light font-medium text-sm">{stat.label}</h3>
                  <Icon size={24} className={colorClasses[stat.color].split(' ').pop() || ''} />
                </div>
                <p className="text-3xl font-bold text-primary-light">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-secondary-dark/30 backdrop-blur-md border border-secondary-light/10 rounded-xl p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-primary-light mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 bg-secondary-dark/50 rounded-lg border border-secondary-light/10">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-light truncate">Employee added to system</p>
                    <p className="text-xs text-secondary-light">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-secondary-dark/30 backdrop-blur-md border border-secondary-light/10 rounded-xl p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-primary-light mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-linear-to-r from-accent-primary/80 to-accent-primary hover:from-accent-primary hover:to-accent-primary/80 text-primary-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/20">
                ➕ Add New Employee
              </button>
              <button className="w-full px-4 py-3 bg-secondary-dark hover:bg-secondary-dark/80 text-primary-light font-semibold rounded-lg transition-all duration-300 border border-secondary-light/20">
                👥 Manage Employees
              </button>
              <button className="w-full px-4 py-3 bg-secondary-dark hover:bg-secondary-dark/80 text-primary-light font-semibold rounded-lg transition-all duration-300 border border-secondary-light/20">
                📊 View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

