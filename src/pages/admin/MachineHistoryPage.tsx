import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Filter, History, MapPin, Monitor, Search, User, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaintenanceRecord {
  _id: string;
  date: string;
  frequency: string;
  performedBy: { name: string } | null;
  machineId: { _id: string; name: string; location: string } | null;
  checklist: any[];
  overallNotes?: string;
}

export const MachineHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:3000/maintenance/history');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error("Error fetching global history", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record =>
    record.machineId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.performedBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-slate-900">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <History className="text-blue-500" />
              Global Maintenance History
            </h1>
            <p className="text-slate-400 mt-1">Timeline of all maintenance activities across the facility</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by machine name or technician..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-hidden focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Filter size={18} />
            Filter Date
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading history...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
              No maintenance records found.
            </div>
          ) : (
            <div className="relative pl-8 border-l-2 border-slate-700 space-y-8">
              {filteredRecords.map((record) => (
                <div key={record._id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full bg-slate-900 border-2 border-blue-500 group-hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/20"></div>

                  {/* Card */}
                  <div
                    onClick={() => record.machineId && navigate(`/admin/machines/${record.machineId._id}`)}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:border-blue-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/20">
                            Completed
                          </span>
                          <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(record.date).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {record.frequency} Maintenance
                        </h3>
                        <div className="flex items-center gap-2 text-blue-400 font-medium mb-4">
                          <Monitor size={16} />
                          {record.machineId?.name || 'Unknown Machine'}
                          <span className="text-slate-500 text-sm font-normal">• {record.machineId?.location}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            {record.performedBy?.name || 'Unknown Technician'}
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} />
                            {record.checklist.length} Tasks Checked
                          </div>
                        </div>
                      </div>

                      {/* Right: Divider & Notes */}
                      {record.overallNotes && (
                        <div className="md:w-1/3 pt-4 md:pt-0 md:pl-6 md:border-l border-slate-700">
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Notes</p>
                          <p className="text-slate-300 text-sm italic">"{record.overallNotes}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
