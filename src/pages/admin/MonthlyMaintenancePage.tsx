import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared';
import { Calendar, CheckCircle, Clock, User, XCircle, AlertCircle } from 'lucide-react';

export const MonthlyMaintenancePage: React.FC = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('http://localhost:3000/maintenance/plans/active?frequency=Monthly');
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching monthly plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`http://localhost:3000/maintenance/plans/${id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchPlans();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="w-full p-6">
            <PageHeader title="Monthly Maintenance" subtitle="Track monthly equipment inspections" />

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Checks</p>
                            <p className="text-2xl font-bold text-white">{plans.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-cyan-400" />
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Completed</p>
                            <p className="text-2xl font-bold text-emerald-400">{plans.filter(p => p.status === 'completed').length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div>
                        <p className="text-slate-400 text-sm mb-2">Overall Progress</p>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                            <div
                                className="bg-cyan-500 h-3 rounded-full transition-all"
                                style={{
                                    width: `${plans.length > 0
                                        ? Math.round((plans.filter(p => p.status === 'completed').length / plans.length) * 100)
                                        : 0}%`
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                            {plans.length > 0
                                ? Math.round((plans.filter(p => p.status === 'completed').length / plans.length) * 100)
                                : 0}% Complete
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : plans.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No active monthly plans found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50 text-slate-300">
                            <tr>
                                <th className="p-4">Machine</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Plan Name</th>
                                <th className="p-4">Assigned To</th>
                                <th className="p-4">Scheduled Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {plans.map((plan) => (
                                <tr key={plan._id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{plan.machineId?.name || 'Unknown Machine'}</div>
                                        <div className="text-xs text-slate-500">{plan.machineId?.serialNumber}</div>
                                    </td>
                                    <td className="p-4 text-slate-400">{plan.machineId?.location || 'N/A'}</td>
                                    <td className="p-4 text-slate-400">{plan.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <User size={14} />
                                            <span>{plan.assignedEmployeeId?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(plan.scheduledDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                                            ${plan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                plan.status === 'skipped' ? 'bg-red-500/10 text-red-400' :
                                                    'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {plan.status === 'completed' && <CheckCircle size={14} />}
                                            {plan.status === 'skipped' && <XCircle size={14} />}
                                            {(plan.status === 'active' || plan.status === 'planned') && <AlertCircle size={14} />}
                                            <span className="capitalize">{(plan.status === 'active' || plan.status === 'planned') ? 'Pending' : plan.status}</span>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {(plan.status === 'active' || plan.status === 'planned') ? (
                                            <button
                                                onClick={() => navigate(`/admin/maintenance/execute/${plan._id}`)}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                                            >
                                                <div className="flex items-center gap-1">Perform</div>
                                            </button>
                                        ) : (
                                            <span className="text-sm text-slate-500">Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
