import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared';
import { CheckCircle, ArrowLeft, Camera, FileText, XCircle } from 'lucide-react';

export const MaintenanceExecutionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Structure: { [taskName]: { isChecked: boolean, photoUrl: string | null } }
    const [checklistData, setChecklistData] = useState<Record<string, { isChecked: boolean, photoUrl: string | null }>>({});

    const [notes, setNotes] = useState('');
    const [uploadingTask, setUploadingTask] = useState<string | null>(null);

    useEffect(() => {
        if (planId) {
            fetchPlanDetails();
        }
    }, [planId]);

    const fetchPlanDetails = async () => {
        try {
            const res = await fetch(`http://localhost:3000/maintenance/plans/${planId}`);
            const data = await res.json();
            setPlan(data);
            setNotes(data.notes || '');

            if (data.templateId?.tasks) {
                const initialData: Record<string, { isChecked: boolean, photoUrl: string | null }> = {};
                data.templateId.tasks.forEach((task: string) => {
                    // Check if previously completed (rough check against plan.completedTasks string array for backward compat)
                    const isDone = data.completedTasks?.includes(task) || false;
                    initialData[task] = { isChecked: isDone, photoUrl: null };
                });
                setChecklistData(initialData);
            }
        } catch (error) {
            console.error('Error fetching plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = (task: string) => {
        setChecklistData(prev => ({
            ...prev,
            [task]: { ...prev[task], isChecked: !prev[task].isChecked }
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, task: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingTask(task);
        try {
            const res = await fetch('http://localhost:3000/maintenance/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setChecklistData(prev => ({
                    ...prev,
                    [task]: { ...prev[task], photoUrl: data.url }
                }));
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploadingTask(null);
        }
    };

    const removePhoto = (task: string) => {
        setChecklistData(prev => ({
            ...prev,
            [task]: { ...prev[task], photoUrl: null }
        }));
    };

    const handleComplete = async () => {
        try {
            // Transform state to array format expected by backend
            const checklistArray = Object.keys(checklistData).map(task => ({
                task: task,
                isChecked: checklistData[task].isChecked,
                photoUrl: checklistData[task].photoUrl || undefined,
                notes: '' // Future: Add per-task notes if needed
            }));

            await fetch(`http://localhost:3000/maintenance/plans/${planId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'completed',
                    notes: notes,
                    checklist: checklistArray
                })
            });
            navigate(-1);
        } catch (error) {
            console.error('Error completing maintenance:', error);
        }
    };

    // Calculate progress
    const totalTasks = plan?.templateId?.tasks?.length || 0;
    const completedCount = Object.values(checklistData).filter(i => i.isChecked).length;
    const canComplete = totalTasks > 0 && completedCount === totalTasks;

    if (loading) return <div className="p-12 text-center text-slate-400">Loading plan details...</div>;
    if (!plan) return <div className="p-12 text-center text-red-400">Plan not found</div>;

    return (
        <div className="w-full p-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={16} /> Back to List
            </button>

            <PageHeader
                title={`Perform Maintenance: ${plan.machineId?.name}`}
                subtitle={`Plan: ${plan.name} | SN: ${plan.machineId?.serialNumber}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Checklist */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Maintenance Checklist</h3>
                            <span className="text-sm text-slate-400">{completedCount} / {totalTasks} Tasks Completed</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(completedCount / totalTasks) * 100}%` }}
                            ></div>
                        </div>

                        <div className="space-y-4">
                            {plan.templateId?.tasks?.map((task: string, index: number) => {
                                const itemData = checklistData[task] || { isChecked: false, photoUrl: null };
                                const isUploading = uploadingTask === task;

                                return (
                                    <div key={index} className={`p-4 rounded-lg border transition-all duration-200
                                        ${itemData.isChecked
                                            ? 'bg-emerald-500/10 border-emerald-500/30'
                                            : 'bg-slate-700/30 border-slate-700'
                                        }
                                    `}>
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Checkbox Section */}
                                            <label className="flex items-start gap-4 cursor-pointer flex-1">
                                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors
                                                     ${itemData.isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}
                                                `}>
                                                    {itemData.isChecked && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={itemData.isChecked}
                                                    onChange={() => handleCheck(task)}
                                                />
                                                <span className={itemData.isChecked ? 'text-emerald-100 line-through decoration-emerald-500/50' : 'text-slate-300'}>
                                                    {task}
                                                </span>
                                            </label>

                                            {/* Action Section: Camera */}
                                            <div className="shrink-0 flex items-center gap-2">
                                                <label className={`p-2 rounded-lg cursor-pointer transition-colors
                                                    ${itemData.photoUrl
                                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                                                    }
                                                 `}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        disabled={isUploading}
                                                        onChange={(e) => handleFileUpload(e, task)}
                                                    />
                                                    <Camera size={20} className={isUploading ? "animate-spin" : ""} />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Evidence Preview */}
                                        {itemData.photoUrl && (
                                            <div className="mt-4 ml-9 relative inline-block group">
                                                <img
                                                    src={`http://localhost:3000${itemData.photoUrl}`}
                                                    alt="Evidence"
                                                    className="h-20 w-20 object-cover rounded-md border border-slate-600 cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => window.open(`http://localhost:3000${itemData.photoUrl}`, '_blank')}
                                                />
                                                <button
                                                    onClick={() => removePhoto(task)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove photo"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {(!plan.templateId?.tasks || plan.templateId.tasks.length === 0) && (
                                <p className="text-slate-500 italic">No checklist tasks defined for this template.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Global Notes */}
                <div className="space-y-6">
                    {/* Notes Section */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText size={18} /> Overall Notes
                        </h3>
                        <textarea
                            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-hidden focus:border-blue-500 transition-colors resize-none"
                            placeholder="Add optional notes about the maintenance..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleComplete}
                        disabled={totalTasks > 0 && !canComplete}
                        className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all
                            ${(totalTasks === 0 || canComplete)
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }
                        `}
                    >
                        <CheckCircle size={20} />
                        Complete Maintenance
                    </button>
                    {!canComplete && totalTasks > 0 && (
                        <p className="text-xs text-center text-amber-500/80">
                            Please complete all checklist items before finishing.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
