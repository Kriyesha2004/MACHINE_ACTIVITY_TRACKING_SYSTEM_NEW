import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, MapPin, Calendar, CheckCircle, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { StatusBadge } from '../../components/shared';

interface Machine {
    _id: string;
    name: string;
    model: string;
    location: string;
    serialNumber: string;
    purchaseDate: string;
    status: string;
    imagePath?: string;
    lastMaintenance?: string;
    assignedTo?: string;
}

interface MaintenanceRecord {
    _id: string;
    date: string;
    frequency: string;
    performedBy: { name: string } | null;
    status?: string; // Derived or explicitly stored
    checklist: any[];
    overallNotes?: string; // Added for modal content
}

export const MachineDetailsPage: React.FC = () => {
    const { machineId } = useParams<{ machineId: string }>();
    const navigate = useNavigate();
    const [machine, setMachine] = useState<Machine | null>(null);
    const [history, setHistory] = useState<MaintenanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
    const [upcoming, setUpcoming] = useState<any[]>([]);

    useEffect(() => {
        if (machineId) {
            fetchMachineDetails();
            fetchHistory();
            fetchUpcoming();
        }
    }, [machineId]);

    const fetchMachineDetails = async () => {
        try {
            const res = await fetch(`http://localhost:3000/machines/${machineId}`);
            if (res.ok) {
                const data = await res.json();
                setMachine(data);
            }
        } catch (error) {
            console.error("Error fetching machine details", error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`http://localhost:3000/maintenance/history/${machineId}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Error fetching history", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcoming = async () => {
        try {
            const res = await fetch(`http://localhost:3000/maintenance/upcoming/${machineId}`);
            if (res.ok) {
                const data = await res.json();
                setUpcoming(data);
            }
        } catch (error) {
            console.error("Error fetching upcoming plans", error);
        }
    };

    const getHealthStatus = () => {
        if (!machine) return { status: 'Unknown', color: 'text-slate-500', bg: 'bg-slate-500/10' };
        if (machine.status === 'maintenance') return { status: 'Under Maintenance', color: 'text-amber-400', bg: 'bg-amber-500/10' };
        if (machine.status === 'inactive') return { status: 'Inactive', color: 'text-red-400', bg: 'bg-red-500/10' };

        // Check if any upcoming plan is overdue (simple check against today)
        const isOverdue = upcoming.some(plan => new Date(plan.scheduledDate) < new Date());
        if (isOverdue) return { status: 'Attention Needed', color: 'text-amber-400', bg: 'bg-amber-500/10' };

        return { status: 'Good Condition', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    };

    if (loading) return <div className="p-8 text-slate-400">Loading details...</div>;
    if (!machine) return <div className="p-8 text-red-400">Machine not found.</div>;

    const health = getHealthStatus();

    return (
        <div className="flex-1 overflow-auto bg-slate-900">
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/admin/machines')}
                        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Machines
                    </button>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-sm font-medium transition-colors">
                            Download Report
                        </button>
                        <button
                            onClick={() => navigate('/admin/planner')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Schedule Maintenance
                        </button>
                    </div>
                </div>

                {/* Top Row: Profile & Health */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Machine Profile Card */}
                    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 bg-slate-700/30 relative min-h-[200px]">
                            {machine.imagePath ? (
                                <img
                                    src={`http://localhost:3000/${machine.imagePath.replace(/\\/g, '/')}`}
                                    alt={machine.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    <Monitor size={64} strokeWidth={1} />
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">{machine.name}</h1>
                                        <p className="text-blue-400 font-medium">{machine.model}</p>
                                    </div>
                                    <StatusBadge status={machine.status as any} />
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <MapPin size={16} className="text-slate-500" />
                                            {machine.location}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Serial Number</p>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <AlertTriangle size={16} className="text-slate-500" />
                                            {machine.serialNumber || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Purchase Date</p>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar size={16} className="text-slate-500" />
                                            {machine.purchaseDate ? new Date(machine.purchaseDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned Team</p>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Wrench size={16} className="text-slate-500" />
                                            Maintenance Team A
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Health Status Card */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Health</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${health.bg} ${health.color}`}>
                                <Monitor size={32} />
                            </div>
                            <div>
                                <p className={`text-xl font-bold ${health.color}`}>{health.status}</p>
                                <p className="text-sm text-slate-500">Based on recent activity</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Uptime (30d)</span>
                                <span className="text-white font-medium">98.5%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[98.5%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Row: Upcoming & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Next Scheduled Maintenance */}
                    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="text-blue-500" size={20} />
                            Upcoming Maintenance
                        </h3>
                        {upcoming.length > 0 ? (
                            <div className="space-y-3">
                                {upcoming.map((plan: any) => (
                                    <div key={plan._id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded text-sm font-semibold uppercase">
                                                {plan.frequency}
                                            </div>
                                            <div>
                                                <p className="text-slate-200 font-medium">Scheduled for {new Date(plan.scheduledDate).toLocaleDateString()}</p>
                                                <p className="text-sm text-slate-500">Assigned to: {plan.assignedEmployeeId?.name || 'Unassigned'}</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-800 text-slate-400 text-sm rounded border border-slate-600">
                                            {plan.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 bg-slate-700/20 rounded-lg border-2 border-dashed border-slate-700">
                                No upcoming maintenance scheduled.
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-700/30 rounded-lg text-center">
                                <p className="text-2xl font-bold text-white">{history.length}</p>
                                <p className="text-xs text-slate-500 uppercase mt-1">Total Services</p>
                            </div>
                            <div className="p-4 bg-slate-700/30 rounded-lg text-center">
                                <p className="text-2xl font-bold text-emerald-400">100%</p>
                                <p className="text-xs text-slate-500 uppercase mt-1">Compliance</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-700/30 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase mb-2">Last Service</p>
                            <p className="text-white font-medium">
                                {history.length > 0 ? new Date(history[0].date).toLocaleDateString() : 'Never'}
                            </p>
                            <p className="text-sm text-slate-400">
                                {history.length > 0 ? `${history[0].frequency} Check` : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Third Row: Maintenance History */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="text-slate-400" />
                        Maintenance History Log
                    </h3>

                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <div className="text-slate-500 text-center py-8">No maintenance records found.</div>
                        ) : (
                            history.map(record => (
                                <div key={record._id} className="relative pl-6 border-l-2 border-slate-700 pb-6 last:pb-0 last:border-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-blue-500"></div>
                                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Wrench size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{record.frequency} Maintenance</p>
                                                <p className="text-sm text-slate-400">
                                                    By {record.performedBy?.name || 'Unknown'} • {new Date(record.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRecord(record)}
                                            className="text-sm text-blue-400 hover:text-blue-300 font-medium px-3 py-1.5 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Record Details Modal */}
                {selectedRecord && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Maintenance Record Details</h3>
                                    <p className="text-slate-400 text-sm">
                                        {selectedRecord.frequency} Maintenance • {new Date(selectedRecord.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="rotate-180" size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {/* Overall Notes */}
                                {selectedRecord.overallNotes && (
                                    <div className="mb-8 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                                        <h4 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Overall Notes</h4>
                                        <p className="text-slate-300">{selectedRecord.overallNotes}</p>
                                    </div>
                                )}

                                {/* Checklist & Evidence */}
                                <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Checklist & Evidence</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedRecord.checklist.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex flex-col gap-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.isChecked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                                                        {item.isChecked && <CheckCircle size={12} />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${item.isChecked ? 'text-slate-200' : 'text-slate-500'}`}>
                                                        {item.task}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Photo Evidence */}
                                            {item.photoUrl && (
                                                <div className="mt-2">
                                                    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-black/20">
                                                        <img
                                                            src={`http://localhost:3000/${item.photoUrl.replace(/\\/g, '/')}`}
                                                            alt="Evidence"
                                                            className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 pointer-events-none">
                                                            <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full backdrop-blur-md">
                                                                Evidence Photo
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Task Notes */}
                                            {item.notes && (
                                                <div className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700/50 italic">
                                                    "{item.notes}"
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end">
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
