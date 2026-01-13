import React, { useState, useEffect } from 'react';
import { X, Play, AlertCircle } from 'lucide-react';


interface AdHocStartModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: any;
    onPlanCreated: (plan: any) => void;
}

export const AdHocStartModal: React.FC<AdHocStartModalProps> = ({
    isOpen,
    onClose,
    template,
    onPlanCreated
}) => {
    const [machines, setMachines] = useState<any[]>([]);
    const [selectedMachineId, setSelectedMachineId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchMachines();
            setSelectedMachineId('');
            setError('');
        }
    }, [isOpen]);

    const fetchMachines = async () => {
        try {
            const res = await fetch('http://localhost:3000/machines');
            const data = await res.json();
            setMachines(data);
        } catch (err) {
            console.error('Error fetching machines:', err);
            setError('Failed to load machines');
        }
    };

    const handleStart = async () => {
        if (!selectedMachineId) {
            setError('Please select a machine');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create an immediate active plan
            const today = new Date().toISOString();

            const payload = {
                name: `${template.name} (Ad-hoc)`,
                templateId: template._id,
                startDate: today,
                endDate: today,
                allocations: [
                    { machineId: selectedMachineId, assignedUserId: undefined } // Ad-hoc is usually self-assigned or just unassigned initially
                ]
            };

            const response = await fetch('http://localhost:3000/maintenance/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const createdPlans = await response.json();
                if (createdPlans && createdPlans.length > 0) {
                    onPlanCreated(createdPlans[0]);
                } else {
                    setError('Failed to create plan instance');
                }
            } else {
                setError('Failed to start maintenance check');
            }
        } catch (err) {
            console.error('Error starting check:', err);
            setError('Error starting maintenance check');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !template) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">Start Maintenance</h3>
                        <p className="text-sm text-slate-400">{template.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Select Machine
                    </label>
                    <div className="relative">
                        <select
                            value={selectedMachineId}
                            onChange={(e) => setSelectedMachineId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">-- Choose a machine --</option>
                            {machines.map(m => (
                                <option key={m._id} value={m._id}>
                                    {m.name} - {m.location}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleStart}
                        disabled={loading}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Play size={18} fill="currentColor" />
                                Start Check
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
