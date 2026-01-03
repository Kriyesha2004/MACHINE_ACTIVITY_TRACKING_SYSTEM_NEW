import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/shared';

interface MachineStatus {
    machine: {
        _id: string;
        name: string;
        location: string;
    };
    status: 'pending' | 'completed' | 'skipped';
    logId: string | null;
    notes: string;
}

export const DailyMaintenancePage: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyPlans();
    }, []);

    const fetchDailyPlans = async () => {
        try {
            const response = await fetch('http://localhost:3000/maintenance/plans/active?frequency=Daily');
            if (!response.ok) throw new Error('Failed to fetch status');
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching daily maintenance:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (planId: string, status: 'completed' | 'skipped' | 'planned' | 'active', notes?: string) => {
        try {
            const response = await fetch(`http://localhost:3000/maintenance/plans/${planId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes })
            });

            if (response.ok) {
                fetchDailyPlans();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="w-full p-6">
            <PageHeader
                title="Daily Maintenance"
                subtitle={`Routine checks for ${new Date().toLocaleDateString()}`}
            />

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : plans.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No daily checks scheduled for today.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50 text-slate-300">
                            <tr>
                                <th className="p-4">Machine</th>
                                <th className="p-4">Plan / Template</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {plans.map((plan) => (
                                <tr key={plan._id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        {plan.machineId?.name || 'Unknown Machine'}
                                        <div className="text-xs text-slate-500">{plan.machineId?.serialNumber}</div>
                                    </td>
                                    <td className="p-4 text-slate-400">{plan.name}</td>
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
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(plan._id, 'completed')}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircle size={14} /> Complete
                                                </button>
                                                {/* Edit/Notes functionality could involve a modal, but keeping it simple for now */}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => updateStatus(plan._id, 'planned')} // Undo to planned
                                                className="text-sm text-slate-500 hover:text-white underline"
                                            >
                                                Undo
                                            </button>
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
