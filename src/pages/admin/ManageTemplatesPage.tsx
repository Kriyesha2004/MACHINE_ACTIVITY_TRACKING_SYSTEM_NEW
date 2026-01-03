import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/shared';
import { useNavigate } from 'react-router-dom';

interface Template {
    _id: string;
    name: string;
    description: string;
    frequency: string;
    tasks: string[];
}

export const ManageTemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch('http://localhost:3000/maintenance/templates');
            if (response.ok) {
                const data = await response.json();
                setTemplates(data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="Maintenance Templates"
                    subtitle="Manage your 8-week maintenance checklists"
                />
                <button
                    onClick={() => navigate('/admin/add-template')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Create Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center text-slate-400 py-12">Loading templates...</div>
                ) : templates.length === 0 ? (
                    <div className="col-span-full text-center text-slate-400 py-12 bg-slate-800/50 rounded-lg border border-slate-700">
                        <FileText className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                        <p>No templates found. Create one to get started.</p>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div key={template._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <FileText className="text-blue-400" size={24} />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-slate-700 text-slate-300 rounded-full">
                                    {template.frequency}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{template.description}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                    {template.tasks.length} Checkpoints
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                                <button className="flex-1 text-sm font-medium text-slate-300 hover:text-white py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
