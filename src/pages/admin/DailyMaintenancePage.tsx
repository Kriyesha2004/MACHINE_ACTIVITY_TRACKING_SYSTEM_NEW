import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/shared';

import {
    ChevronDown,
    ChevronUp,
    FileText,
    CheckCircle,
    Clock,
    X,
    Activity
} from 'lucide-react';

interface MaintenancePlan {
    _id: string;
    name: string;
    machineId: { _id: string; name: string; location: string };
    templateId: string;
    frequency: string;
    scheduledDate: string;
    status: string;
    assignedEmployeeId: { _id: string; name: string } | null;
    evidenceUrl?: string;
    notes?: string;
    performedBy?: any;
}

interface GroupedPlan {
    key: string;
    planName: string;
    machineName: string;
    machineLocation: string;
    cycles: MaintenancePlan[];
}

export const DailyMaintenancePage: React.FC = () => {
    const [groupedPlans, setGroupedPlans] = useState<GroupedPlan[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [selectedProof, setSelectedProof] = useState<{ url: string; notes?: string } | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('http://localhost:3000/maintenance/plans/active?frequency=Daily');
            const data = await response.json();
            groupPlans(data);
        } catch (error) {
            console.error('Error fetching daily plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupPlans = (plans: MaintenancePlan[]) => {
        const groups: Record<string, GroupedPlan> = {};

        plans.forEach(plan => {
            const key = `${plan.templateId}-${plan.machineId?._id}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    planName: plan.name.split(' (Cycle')[0] || plan.name, // Clean name
                    machineName: plan.machineId?.name || 'Unknown',
                    machineLocation: plan.machineId?.location || '',
                    cycles: []
                };
            }
            groups[key].cycles.push(plan);
        });

        // Sort cycles ascending (earliest first)
        Object.values(groups).forEach(group => {
            group.cycles.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
        });

        setGroupedPlans(Object.values(groups));
    };

    const toggleGroup = (key: string) => {
        setExpandedGroups(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };


    return (
        <div className="w-full p-6">
            <PageHeader
                title="Daily Maintenance"
                subtitle="Track daily checks, assignments and history"
            />

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-slate-400 py-12">Loading plans...</div>
                ) : groupedPlans.length === 0 ? (
                    <div className="text-center text-slate-400 py-12">No daily plans found.</div>
                ) : (
                    groupedPlans.map(group => (
                        <div key={group.key} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
                                onClick={() => toggleGroup(group.key)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white">{group.planName}</h3>
                                        <p className="text-sm text-slate-400">{group.machineName} - {group.machineLocation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-white font-medium">{group.cycles.filter(c => c.status === 'completed').length} Completed</p>
                                        <p className="text-xs text-slate-500">{group.cycles.length} Total Checks</p>
                                    </div>
                                    {expandedGroups.includes(group.key) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                </div>
                            </div>

                            {expandedGroups.includes(group.key) && (
                                <div className="border-t border-slate-700 bg-slate-900/30">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-slate-500 bg-slate-900/50 uppercase font-medium">
                                            <tr>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Performed By / Assigned</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {group.cycles.map(cycle => (
                                                <tr key={cycle._id} className="hover:bg-slate-800/50">
                                                    <td className="p-4 text-slate-300">
                                                        {new Date(cycle.scheduledDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                                            ${cycle.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                cycle.status === 'planned' ? 'bg-slate-700 text-slate-400' : 'bg-amber-500/10 text-amber-400'}
                                                        `}>
                                                            {cycle.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                            <span className="capitalize">{cycle.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-300">
                                                        {cycle.status === 'completed' && cycle.performedBy ? (
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle size={14} className="text-emerald-400" />
                                                                <span className="text-white">{typeof cycle.performedBy === 'object' ? (cycle.performedBy as any).name : 'Unknown User'}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-500 italic">Shared Task</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {/* View Proof Action */}
                                                            {cycle.status === 'completed' && cycle.evidenceUrl && (
                                                                <button
                                                                    onClick={() => setSelectedProof({ url: cycle.evidenceUrl!, notes: cycle.notes })}
                                                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                                                                >
                                                                    <FileText size={14} /> Proof
                                                                </button>
                                                            )}

                                                            {/* No Assign Button for Daily Tasks */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Proof View Modal */}
            {selectedProof && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
                    <div className="bg-slate-900 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-semibold text-white">Maintenance Proof</h3>
                            <button onClick={() => setSelectedProof(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-0 flex-1 overflow-auto bg-black flex items-center justify-center">
                            <img
                                src={(() => {
                                    const url = selectedProof.url;
                                    if (url.startsWith('http')) return url;

                                    // Remove leading slashes to avoid double slash
                                    const cleanPath = url.replace(/^\/+/, '');

                                    // If path doesn't start with 'uploads/', add it (fixes legacy data)
                                    // But be careful not to add it if it's arguably a different path intent.
                                    // Given our system, all uploads should be in 'uploads/'.
                                    if (!cleanPath.startsWith('uploads/')) {
                                        return `http://localhost:3000/uploads/${cleanPath}`;
                                    }

                                    return `http://localhost:3000/${cleanPath}`;
                                })()}
                                alt="Evidence"
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                        </div>
                        {selectedProof.notes && (
                            <div className="p-4 bg-slate-800 border-t border-slate-700">
                                <h4 className="text-sm font-medium text-slate-400 mb-1">Notes:</h4>
                                <p className="text-white text-sm">{selectedProof.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
