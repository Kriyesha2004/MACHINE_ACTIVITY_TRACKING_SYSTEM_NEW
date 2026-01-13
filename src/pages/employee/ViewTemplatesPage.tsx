import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/shared';
import { FileText, Play, Activity } from 'lucide-react';
import { AdHocStartModal } from '../../components/maintenance/AdHocStartModal';
import { MaintenanceCompletionModal } from '../../components/maintenance/MaintenanceCompletionModal';

export const ViewTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [createdPlan, setCreatedPlan] = useState<any | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:3000/maintenance/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = (template: any) => {
    setSelectedTemplate(template);
    setShowStartModal(true);
  };

  const handlePlanCreated = (plan: any) => {
    setShowStartModal(false);
    setCreatedPlan(plan);
    setShowCompleteModal(true);
  };

  const handleCompletionSuccess = () => {
    setShowCompleteModal(false);
    // Refresh templates logic if needed, but templates are static usually.
  };

  return (
    <div className="w-full p-6">
      <PageHeader title="Maintenance Templates" subtitle="View details of maintenance procedures" />

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div key={template._id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${template.frequency === 'Daily' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {template.frequency === 'Daily' ? <Activity size={24} /> : <FileText size={24} />}
                </div>
                <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 border border-slate-600">
                  {template.frequency}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{template.description || 'No description provided.'}</p>

              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Checklist Preview</h4>
                <ul className="space-y-1">
                  {template.tasks.slice(0, 3).map((task: string, i: number) => (
                    <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      <span className="truncate">{task}</span>
                    </li>
                  ))}
                  {template.tasks.length > 3 && (
                    <li className="text-xs text-slate-500 pl-3.5">+ {template.tasks.length - 3} more tasks</li>
                  )}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-700 flex gap-3">
                <button
                  className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors font-medium text-center"
                  onClick={() => {/* Maybe view full details modal later */ }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleStartClick(template)}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AdHocStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        template={selectedTemplate}
        onPlanCreated={handlePlanCreated}
      />

      <MaintenanceCompletionModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        plan={createdPlan}
        onComplete={handleCompletionSuccess}
      />
    </div>
  );
};
