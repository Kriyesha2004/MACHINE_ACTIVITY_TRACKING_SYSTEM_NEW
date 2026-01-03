import React, { useState } from 'react';
import { Wrench, Calendar, AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  machineId: string;
  lastService: string;
  nextService: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const NormalServicePage: React.FC = () => {
  const [services] = useState<Service[]>([
    { id: '1', machineId: '1J', lastService: '2024-10-15', nextService: '2024-12-10', status: 'pending' },
    { id: '2', machineId: '2K', lastService: '2024-10-20', nextService: '2024-12-15', status: 'in-progress' },
    { id: '3', machineId: '3M', lastService: '2024-11-01', nextService: '2024-12-26', status: 'completed' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">8-Week Normal Service</h1>
          <p className="text-gray-400">Track routine maintenance schedules</p>
        </div>

        {/* Info Box */}
        <div className="mb-6 flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">Service Interval: 8 Weeks</p>
            <p className="text-xs text-blue-400">Regular maintenance ensures optimal machine performance</p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Wrench size={24} className="text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-2">Machine {service.machineId}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        Last: {new Date(service.lastService).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        Next: {new Date(service.nextService).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm">
                    {service.status === 'completed' ? 'View' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NormalServicePage;

