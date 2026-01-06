import React, { useState, useEffect } from 'react';
import { PageHeader, FormInput } from '../../components/shared';
import { useNavigate } from 'react-router-dom';
import { Save, Users, Zap } from 'lucide-react';
import { CycleCalendar } from '../../components/maintenance/CycleCalendar';

export const MaintenancePlannerPage: React.FC = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<any[]>([]);
    const [machines, setMachines] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        templateId: '',
        startDate: '',
        endDate: '',
        selectedMachines: [] as string[],
        allocations: {} as Record<string, string> // machineId -> userId
    });

    const selectedTemplate = templates.find(t => t._id === formData.templateId);
    const frequency = selectedTemplate?.frequency; // 'Daily', 'Monthly', '8-Weekly'

    useEffect(() => {
        // Fetch dependencies
        fetch('http://localhost:3000/maintenance/templates').then(r => r.json()).then(setTemplates);
        fetch('http://localhost:3000/machines').then(r => r.json()).then(setMachines);
        fetch('http://localhost:3000/users').then(r => r.json()).then(setUsers);
    }, []);

    const toggleMachine = (id: string) => {
        setFormData(prev => ({
            ...prev,
            selectedMachines: prev.selectedMachines.includes(id)
                ? prev.selectedMachines.filter(m => m !== id)
                : [...prev.selectedMachines, id]
        }));
    };

    const handleAssignUser = (machineId: string, userId: string) => {
        setFormData(prev => ({
            ...prev,
            allocations: { ...prev.allocations, [machineId]: userId }
        }));
    };

    const handleSubmit = async () => {
        if (!formData.templateId || formData.selectedMachines.length === 0) {
            alert('Please select a template and at least one machine.');
            return;
        }

        // 8-Weekly Mandatory Assignment Validation
        if (frequency === '8-Weekly') {
            const missingAssignments = formData.selectedMachines.some(mId => !formData.allocations[mId]);
            if (missingAssignments) {
                alert('For 8-Weekly plans, all machines MUST have an assigned employee.');
                return;
            }
        }

        const payload = {
            name: formData.name,
            templateId: formData.templateId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: 'active',
            allocations: formData.selectedMachines.map(mId => ({
                machineId: mId,
                assignedUserId: formData.allocations[mId] || null, // Daily plans will have null here
                status: 'pending',
                completedTasks: []
            }))
        };

        try {
            const res = await fetch('http://localhost:3000/maintenance/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert('Plan created successfully!');
                if (frequency === 'Daily') {
                    navigate('/admin/daily-maintenance');
                } else if (frequency === 'Monthly') {
                    navigate('/admin/monthly-maintenance');
                } else {
                    navigate('/admin/8-week/active');
                }
            } else {
                alert('Failed to create plan');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full p-6">
            <PageHeader title="Maintenance Planner" subtitle="Create a new 8-week maintenance cycle" />

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6 max-w-4xl">
                {/* Step 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <FormInput
                            label="Plan Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Q1 2025 Standard Maintenance"
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Template</label>
                            <select
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                                value={formData.templateId}
                                onChange={e => setFormData({ ...formData, templateId: e.target.value })}
                            >
                                <option value="">Select Template...</option>
                                {templates.map(t => <option key={t._id} value={t._id}>{t.name} ({t.frequency})</option>)}
                            </select>
                        </div>
                        <FormInput
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <FormInput
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        />
                         {frequency === '8-Weekly' && (
                            <p className="text-xs text-amber-500 mt-2">
                                Tip: Use the calendar to select an optimal end date aligned with 8-week cycles.
                            </p>
                        )}
                    </div>

                    {/* Calendar Column */}
                    <div>
                        {frequency === '8-Weekly' ? (
                            <div className="flex flex-col items-center">
                                <label className="block text-sm font-medium text-slate-300 mb-2 w-full text-left">Cycle Helper</label>
                                <CycleCalendar
                                    startDate={formData.startDate}
                                    selectedEndDate={formData.endDate}
                                    onSelectEndDate={(date: string) => setFormData(prev => ({ ...prev, endDate: date }))}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center border border-dashed border-slate-700 rounded-lg bg-slate-800/30 text-slate-500 p-6 text-center">
                                <div className="max-w-xs">
                                    <p className="mb-2">Select an <strong>8-Weekly</strong> template to see the cycle planner.</p>
                                    <p className="text-xs opacity-60">Daily and Monthly plans repeat automatically until the End Date.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 2: Select Machines & Assign Users */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-400" />
                        Select Machines & Assign Staff
                    </h3>
                    <div className="space-y-3">
                        {machines.map(m => (
                            <div key={m.id || m._id} className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${formData.selectedMachines.includes(m.id || m._id)
                                ? 'bg-blue-500/10 border-blue-500/50'
                                : 'bg-slate-700/30 border-slate-700'
                                }`}>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedMachines.includes(m.id || m._id)}
                                        onChange={() => toggleMachine(m.id || m._id)}
                                        className="w-5 h-5 rounded border-slate-500 bg-slate-700 text-blue-500"
                                    />
                                    <div>
                                        <p className="font-medium text-white">{m.name}</p>
                                        <p className="text-sm text-slate-400">{m.model}</p>
                                    </div>
                                </div>

                                {formData.selectedMachines.includes(m.id || m._id) && (
                                    <div className="flex items-center gap-2">
                                        {frequency === 'Daily' ? (
                                            <span className="text-xs text-slate-500 italic">No assignment needed</span>
                                        ) : (
                                            <>
                                                <Users size={16} className="text-slate-400" />
                                                <select
                                                    className={`bg-slate-800 border rounded p-1 text-sm text-white focus:outline-none focus:ring-1 ${frequency === '8-Weekly' && !formData.allocations[m.id || m._id]
                                                        ? 'border-amber-500/50 focus:ring-amber-500'
                                                        : 'border-slate-600 focus:ring-blue-500'
                                                        }`}
                                                    value={formData.allocations[m.id || m._id] || ''}
                                                    onChange={(e) => handleAssignUser(m.id || m._id, e.target.value)}
                                                >
                                                    <option value="">
                                                        {frequency === '8-Weekly' ? 'Required *' : 'Optional (Unassigned)'}
                                                    </option>
                                                    {users.map(u => <option key={u.id || u._id} value={u.id || u._id}>{u.name}</option>)}
                                                </select>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium"
                    >
                        <Save size={20} />
                        Create Plan
                    </button>
                </div>
            </div>
        </div>
    );
};
