import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ResolvedIssue {
  id: string;
  machineId: string;
  title: string;
  resolvedDate: string;
  resolvedBy: string;
}

const SolvedIssuesPage: React.FC = () => {
  const [issues] = useState<ResolvedIssue[]>([
    { id: '1', machineId: '1J', title: 'Oil Leakage', resolvedDate: '2024-12-02', resolvedBy: 'John Doe' },
    { id: '2', machineId: '2K', title: 'Motor Failure', resolvedDate: '2024-12-01', resolvedBy: 'Jane Smith' },
  ]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Resolved Issues</h1>
          <p className="text-gray-400">Completed maintenance tickets</p>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-linear-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="text-green-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{issue.title}</h3>
                    <span className="text-xs font-semibold text-gray-400">Machine {issue.machineId}</span>
                  </div>
                  <p className="text-sm text-gray-400">Resolved by {issue.resolvedBy} on {new Date(issue.resolvedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolvedIssuesPage;

