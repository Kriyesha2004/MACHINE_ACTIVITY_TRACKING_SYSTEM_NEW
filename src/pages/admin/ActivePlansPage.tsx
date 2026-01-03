import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/shared';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

export const ActivePlansPage: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/maintenance/plans/active')
            .then(res => res.json())
            .then(data => {
                // Filter for '8-Weekly' plans only
                const longTermPlans = data.filter((p: any) => p.templateId?.frequency === '8-Weekly');
                setPlans(longTermPlans);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="w-full p-6">
            <PageHeader title="8-Week Full Maintenance" subtitle="Monitor active full diagnostics cycles" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-slate-400 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p>No active plans found.</p>
                    </div>
                ) : (
                    plans.map(plan => (
                        <div key={plan._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                                    <p className="text-sm text-slate-400">{plan.templateId?.name}</p>
                                </div>
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full capitalize">
                                    {plan.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(plan.startDate).toLocaleDateString()}
                                </div>
                                <span>-</span>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(plan.endDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-slate-300">Allocations</h4>
                                {plan.allocations.map((alloc: any) => (
                                    <div key={alloc._id} className="flex justify-between items-center text-sm p-2 bg-slate-700/50 rounded">
                                        <span className="text-white">{alloc.machineId?.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">{alloc.assignedUserId?.name || 'Unassigned'}</span>
                                            {alloc.status === 'completed' ? (
                                                <CheckCircle size={14} className="text-emerald-400" />
                                            ) : (
                                                <Clock size={14} className="text-amber-400" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
