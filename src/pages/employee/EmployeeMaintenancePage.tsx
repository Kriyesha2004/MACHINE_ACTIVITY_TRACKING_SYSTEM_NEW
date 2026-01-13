import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/shared';
import { Activity, Play, CheckCircle } from 'lucide-react';
import { MaintenanceCompletionModal } from '../../components/maintenance/MaintenanceCompletionModal';

export const EmployeeMaintenancePage: React.FC = () => {
    const [dailyPlans, setDailyPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    useEffect(() => {
        fetchDailyPlans();
    }, []);

    const fetchDailyPlans = async () => {
        try {
            // Fetch only Daily plans as requested
            const response = await fetch('http://localhost:3000/maintenance/plans/active?frequency=Daily');
            const data = await response.json();
            setDailyPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePerformClick = (plan: any) => {
        setSelectedPlan(plan);
        setShowCompleteModal(true);
    };

    const handleCompletionSuccess = () => {
        setShowCompleteModal(false);
        fetchDailyPlans(); // Refresh list to remove completed or update status
    };

    return (
        <div className="w-full p-6">
            <PageHeader title="Daily Maintenance Plans" subtitle="Execute your assigned daily machine checks" />

            <div className="mt-6 space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading daily tasks...</div>
                ) : dailyPlans.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-slate-800/30 rounded-lg border border-slate-700">
                        No active daily maintenance tasks found.
                    </div>
                ) : (
                    dailyPlans.map(plan => (
                        <div key={plan._id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-600 transition-colors">
                            {/* Left: Info */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400">
                                    <Activity size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">{plan.name}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                            {plan.machineId?.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                            {plan.machineId?.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                            ID: {plan.machineId?.serialNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Action */}
                            <div className="flex-shrink-0">
                                {plan.status === 'completed' ? (
                                    <div className="px-6 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-2 font-medium">
                                        <CheckCircle size={20} />
                                        Completed
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handlePerformClick(plan)}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
                                    >
                                        <Play size={20} fill="currentColor" />
                                        Start Check
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <MaintenanceCompletionModal
                isOpen={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                plan={selectedPlan}
                onComplete={handleCompletionSuccess}
            />
        </div>
    );
};
