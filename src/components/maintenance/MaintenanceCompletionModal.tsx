import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Camera, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MaintenanceCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: any;
    onComplete: () => void;
}

interface ChecklistItemState {
    task: string;
    isChecked: boolean;
    photoUrl?: string;
    notes?: string;
    uploading?: boolean;
}

export const MaintenanceCompletionModal: React.FC<MaintenanceCompletionModalProps> = ({
    isOpen,
    onClose,
    plan,
    onComplete
}) => {
    const { user } = useAuth();
    const [checklistItems, setChecklistItems] = useState<ChecklistItemState[]>([]);
    const [overallNotes, setOverallNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && plan) {
            // Initialize checking items from template tasks
            const tasks = plan.templateId?.tasks || plan.checklist || [];
            // Handle if tasks is just array of strings (template) or existing objects
            const initialItems = tasks.map((t: any) => ({
                task: typeof t === 'string' ? t : t.task,
                isChecked: false,
                photoUrl: '',
                notes: ''
            }));
            setChecklistItems(initialItems);
            setOverallNotes('');
        }
    }, [isOpen, plan]);

    const handleFileUpload = async (index: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Update state to show uploading for this item
        setChecklistItems(prev => prev.map((item, i) =>
            i === index ? { ...item, uploading: true } : item
        ));

        try {
            const response = await fetch('http://localhost:3000/maintenance/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            setChecklistItems(prev => prev.map((item, i) =>
                i === index ? { ...item, photoUrl: data.url, uploading: false } : item
            ));
        } catch (error) {
            console.error('Error uploading file:', error);
            setChecklistItems(prev => prev.map((item, i) =>
                i === index ? { ...item, uploading: false } : item
            ));
        }
    };

    const toggleCheck = (index: number) => {
        setChecklistItems(prev => prev.map((item, i) =>
            i === index ? { ...item, isChecked: !item.isChecked } : item
        ));
    };

    const handleSubmit = async () => {
        if (!plan) return;
        setSubmitting(true);

        try {
            const payload = {
                status: 'completed',
                checklist: checklistItems,
                notes: overallNotes,
                performedBy: user?.id
            };

            const response = await fetch(`http://localhost:3000/maintenance/plans/${plan._id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onComplete();
                onClose();
            } else {
                console.error('Failed to complete plan');
            }
        } catch (error) {
            console.error('Error submitting completion:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">Perform Maintenance</h3>
                        <p className="text-sm text-slate-400">{plan.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                    {/* Machine Info */}
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded text-blue-400">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Target Machine</p>
                                <p className="text-white font-medium">{plan.machineId?.name} <span className="text-slate-500">({plan.machineId?.serialNumber})</span></p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 ml-11">{plan.machineId?.location}</p>
                    </div>

                    {/* Checklist */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-emerald-500" />
                            Checklist & Evidence
                        </h4>

                        <div className="space-y-4">
                            {checklistItems.map((item, index) => (
                                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                                    <div className="flex flex-col sm:flex-row gap-4">

                                        {/* Checkbox Section */}
                                        <div className="flex-1 flex items-start gap-3">
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={item.isChecked}
                                                    onChange={() => toggleCheck(index)}
                                                    className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-700 cursor-pointer"
                                                />
                                            </div>
                                            <span className={`text-sm ${item.isChecked ? 'text-white' : 'text-slate-300'}`}>
                                                {item.task}
                                            </span>
                                        </div>

                                        {/* Evidence Section */}
                                        <div className="sm:w-1/3 flex flex-col gap-2">
                                            {item.photoUrl ? (
                                                <div className="relative group rounded-lg overflow-hidden border border-slate-600 bg-slate-900 aspect-video">
                                                    <img src={`http://localhost:3000/${item.photoUrl}`} alt="Evidence" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-xs text-white font-medium">Uploaded</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className={`
                                                    flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-all
                                                    ${item.uploading
                                                        ? 'bg-slate-800 border-slate-600 text-slate-500 cursor-wait'
                                                        : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700'
                                                    }
                                                `}>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files?.[0] && handleFileUpload(index, e.target.files[0])}
                                                        disabled={item.uploading}
                                                    />
                                                    {item.uploading ? (
                                                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <Camera size={16} />
                                                            <span className="text-xs font-medium">Add Photo</span>
                                                        </>
                                                    )}
                                                </label>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overall Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
                        <textarea
                            value={overallNotes}
                            onChange={(e) => setOverallNotes(e.target.value)}
                            placeholder="Any general observations or issues..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Complete Task
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
