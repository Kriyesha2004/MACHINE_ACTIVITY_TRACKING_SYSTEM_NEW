import React, { useState } from 'react';
import { AlertCircle, Filter } from 'lucide-react';

interface Issue {
  id: string;
  machineId: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  reportedDate: string;
  resolvedDate?: string;
}

const ActiveIssuesPage: React.FC = () => {
  const [issues] = useState<Issue[]>([
    { id: '1', machineId: '1J', title: 'Heating Issue', severity: 'high', status: 'active', reportedDate: '2024-12-03' },
    { id: '2', machineId: '2K', title: 'Belt Slipping', severity: 'medium', status: 'active', reportedDate: '2024-12-02' },
    { id: '3', machineId: '3M', title: 'Bearing Noise', severity: 'critical', status: 'active', reportedDate: '2024-12-04' },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400';
      case 'high':
        return 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400';
      case 'medium':
        return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400';
      default:
        return 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Active Issues</h1>
            <p className="text-gray-400">Currently reported machine issues</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all">
            <Filter size={20} />
            Filter
          </button>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {issues.filter(i => i.status === 'active').map((issue) => (
            <div
              key={issue.id}
              className={`bg-linear-to-br ${getSeverityColor(issue.severity)} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <AlertCircle size={24} className={getSeverityColor(issue.severity).split(' ').pop() || ''} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{issue.title}</h3>
                      <span className="text-xs font-semibold uppercase text-gray-400">Machine {issue.machineId}</span>
                    </div>
                    <p className="text-sm text-gray-400">Reported: {new Date(issue.reportedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm shrink-0">
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveIssuesPage;

