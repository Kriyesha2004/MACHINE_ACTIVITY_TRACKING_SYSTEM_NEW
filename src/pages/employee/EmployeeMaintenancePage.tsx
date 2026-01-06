import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/shared';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, X, FileText, Camera, ChevronDown, ChevronUp, Lock, Activity } from 'lucide-react';

interface MaintenancePlan {
    _id: string;
    name: string;
    machineId: { _id: string; name: string; location: string };
    templateId: string;
    frequency: string;
    scheduledDate: string;
    status: string;
    assignedEmployeeId: any;
}

interface GroupedPlan {
    key: string; // templateId + machineId
    planName: string;
    machineName: string;
    machineLocation: string;
    frequency: string;
    cycles: MaintenancePlan[];
}

export const EmployeeMaintenancePage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'daily' | 'assigned'>('daily');
    const [groupedDailyPlans, setGroupedDailyPlans] = useState<GroupedPlan[]>([]);
    
    // Grouped State
    const [groupedAssignedPlans, setGroupedAssignedPlans] = useState<GroupedPlan[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    
    // Completion Modal State
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'daily') {
                const res = await fetch('http://localhost:3000/maintenance/plans/active?frequency=Daily');
                const data = await res.json();
                groupPlans(data, setGroupedDailyPlans);
            } else {
                // Fetch Monthly and 8-Weekly
                const [monthlyRes, eightWeekRes] = await Promise.all([
                    fetch('http://localhost:3000/maintenance/plans/active?frequency=Monthly'),
                    fetch('http://localhost:3000/maintenance/plans/active?frequency=8-Weekly')
                ]);
                const monthlyData = await monthlyRes.json();
                const eightWeekData = await eightWeekRes.json();
                
                // Filter by assigned user
                const allAssigned = [...monthlyData, ...eightWeekData].filter((plan: any) => 
                    plan.assignedEmployeeId?._id === user?.id || plan.assignedEmployeeId === user?.id
                );
                
                groupPlans(allAssigned, setGroupedAssignedPlans);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupPlans = (plans: MaintenancePlan[], setState: React.Dispatch<React.SetStateAction<GroupedPlan[]>>) => {
        const groups: Record<string, GroupedPlan> = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        plans.forEach(plan => {
            const key = `${plan.templateId}-${plan.machineId?._id}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    planName: plan.name.split(' (Cycle')[0] || plan.name, // Clean name
                    machineName: plan.machineId?.name || 'Unknown',
                    machineLocation: plan.machineId?.location || '',
                    frequency: plan.frequency,
                    cycles: []
                };
            }
            groups[key].cycles.push(plan);
        });

        // Sort cycles by date within groups
        Object.values(groups).forEach(group => {
            group.cycles.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
        });

        setState(Object.values(groups));
    };

    const toggleGroup = (key: string) => {
        setExpandedGroups(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const handleCompleteClick = (plan: any) => {
        setSelectedPlan(plan);
        setNotes('');
        setFile(null);
        setShowCompleteModal(true);
    };

    const handleFileUpload = async (fileToUpload: File) => {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        
        try {
            const response = await fetch('http://localhost:3000/maintenance/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const handleSubmitCompletion = async () => {
        if (!selectedPlan) return;
        setUploading(true);

        try {
            let evidenceUrl = '';
            if (file) {
                evidenceUrl = await handleFileUpload(file);
            }

            const response = await fetch(`http://localhost:3000/maintenance/plans/${selectedPlan._id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'completed',
                    notes,
                    evidenceUrl,
                    performedBy: user?.id,
                    checklist: [] 
                })
            });

            if (response.ok) {
                setShowCompleteModal(false);
                fetchData();
            } else {
                console.error('Failed to complete plan');
            }
        } catch (error) {
            console.error('Error submitting completion:', error);
        } finally {
            setUploading(false);
        }
    };

    const isLocked = (plan: MaintenancePlan) => {
        // Create dates and strip time components for accurate date-only comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const scheduled = new Date(plan.scheduledDate);
        scheduled.setHours(0, 0, 0, 0);
        
        // Locked if scheduled date is strictly in the future
        return scheduled.getTime() > today.getTime();
    };

    return (
        <div className="w-full p-6">
            <PageHeader title="Maintenance Tasks" subtitle="Perform your scheduled maintenance checks" />

            <div className="flex gap-4 mb-6 border-b border-slate-700 pb-2">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'daily'
                            ? 'text-blue-400 border-blue-400'
                            : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                >
                    Daily Checks
                </button>
                <button
                    onClick={() => setActiveTab('assigned')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'assigned'
                            ? 'text-blue-400 border-blue-400'
                            : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                >
                    My Assignments
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading tasks...</div>
                ) : (
                    // Unified View for both tabs
                    (activeTab === 'daily' ? groupedDailyPlans : groupedAssignedPlans).length === 0 ? (
                         <div className="p-12 text-center text-slate-400 bg-slate-800/50 border border-slate-700 rounded-lg">
                            {activeTab === 'daily' ? 'No daily checks available.' : 'No maintenance plans assigned to you.'}
                         </div>
                    ) : (
                        (activeTab === 'daily' ? groupedDailyPlans : groupedAssignedPlans).map(group => (
                            <div key={group.key} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                                <div 
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
                                    onClick={() => toggleGroup(group.key)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${group.frequency === 'Monthly' ? 'bg-blue-500/20 text-blue-400' : group.frequency === '8-Weekly' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {group.frequency === 'Daily' ? <Activity size={24} /> : <FileText size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-white">{group.planName}</h3>
                                            <p className="text-sm text-slate-400">{group.machineName} - {group.machineLocation} ({group.frequency})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <span className="text-sm text-slate-500">Next Due:</span>
                                            <p className="text-white font-medium">
                                                {new Date(group.cycles.find(c => c.status !== 'completed')?.scheduledDate || new Date()).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {expandedGroups.includes(group.key) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>
                                </div>

                                {expandedGroups.includes(group.key) && (
                                    <div className="border-t border-slate-700 bg-slate-900/30">
                                        {group.cycles.map(cycle => {
                                            const locked = isLocked(cycle);
                                            const completed = cycle.status === 'completed';
                                            
                                            // Ensure we ignore time for today comparison visual
                                            const scheduledDate = new Date(cycle.scheduledDate);
                                            
                                            return (
                                                <div key={cycle._id} className="p-4 flex items-center justify-between border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition-colors">
                                                    <div>
                                                        <p className="text-white font-medium">{cycle.name}</p>
                                                        <p className="text-xs text-slate-500">Scheduled: {scheduledDate.toLocaleDateString()}</p>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize
                                                            ${completed ? 'bg-emerald-500/10 text-emerald-400' : 
                                                              locked ? 'bg-slate-700 text-slate-500' : 'bg-amber-500/10 text-amber-400'}
                                                        `}>
                                                            {completed ? 'Completed' : locked ? 'Locked' : 'Pending'}
                                                        </span>

                                                        {!completed && (
                                                            <button
                                                                onClick={() => !locked && handleCompleteClick(cycle)}
                                                                disabled={locked}
                                                                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1
                                                                    ${locked 
                                                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                                                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'}
                                                                `}
                                                            >
                                                                {locked ? <Lock size={14} /> : <CheckCircle size={14} />} 
                                                                {locked ? `Available ${scheduledDate.toLocaleDateString()}` : 'Complete'}
                                                            </button>
                                                        )}
                                                        {completed && (
                                                             <span className="text-sm text-slate-500 italic px-3">Submitted</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))
                    )
                )}
            </div>

            {/* Completion Modal - Same as before */}
            {showCompleteModal && selectedPlan && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-lg font-semibold text-white">Complete Maintenance</h3>
                            <button onClick={() => setShowCompleteModal(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-medium text-white mb-1">{selectedPlan.name}</h4>
                                <p className="text-sm text-slate-400">{selectedPlan.machineId?.name} ({selectedPlan.machineId?.serialNumber})</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Notes / Observations
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter any notes about the maintenance check..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Evidence (Photo/Document)
                                </label>
                                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:bg-slate-800/50 transition-colors relative">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    {file ? (
                                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                                            <FileText size={20} />
                                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Camera size={24} />
                                            <span className="text-sm">Click to upload proof</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitCompletion}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={16} />
                                            Submit Completion
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
