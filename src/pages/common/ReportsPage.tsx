import React, { useState } from 'react';
import { FileText, Download, BarChart3 } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'maintenance' | 'issues' | 'performance';
  generatedDate: string;
  machines: number;
}

const ReportsPage: React.FC = () => {
  const [reports] = useState<Report[]>([
    { id: '1', title: 'Monthly Maintenance Report', type: 'maintenance', generatedDate: '2024-12-01', machines: 45 },
    { id: '2', title: 'Issue Analysis - Q4 2024', type: 'issues', generatedDate: '2024-11-30', machines: 45 },
    { id: '3', title: 'Machine Performance Index', type: 'performance', generatedDate: '2024-11-28', machines: 42 },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return '🔧';
      case 'issues':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'issues':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Generate and view maintenance system reports</p>
        </div>

        {/* Generate Report Button */}
        <div className="mb-8 flex gap-3">
          <button className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg">
            <FileText size={20} />
            Generate New Report
          </button>
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3 rounded-lg transition-all duration-300">
            <BarChart3 size={20} />
            Analytics
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">{getTypeIcon(report.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <span className="text-gray-400">Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                      <span className="text-gray-400">Machines: {report.machines}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm shrink-0">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

