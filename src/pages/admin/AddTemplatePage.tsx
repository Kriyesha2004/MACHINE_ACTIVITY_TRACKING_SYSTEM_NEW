import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PageHeader, FormInput, FormSelect, FormTextArea, ConfirmationModal } from '../../components/shared';

interface ChecklistItem {
  id: string;
  text: string;
}

export const AddTemplatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    frequency: '',
    description: '',
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const addChecklistItem = () => {
    if (newItem.trim()) {
      setChecklist([...checklist, { id: Date.now().toString(), text: newItem }]);
      setNewItem('');
    }
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.frequency && checklist.length > 0) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:3000/maintenance/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          frequency: formData.frequency,
          description: formData.description,
          tasks: checklist.map(item => item.text),
        }),
      });

      if (response.ok) {
        setShowConfirm(false);
        setFormData({ name: '', frequency: '', description: '' });
        setChecklist([]);
        alert('Template created successfully!');
      } else {
        alert('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Error creating template');
    }
  };

  const frequencyOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Monthly', label: 'Monthly' },
    { value: '8-Weekly', label: '8-Weekly' },
  ];

  return (
    <div className="w-full p-6">
      <PageHeader
        title="Create Maintenance Template"
        subtitle="Create a new routine maintenance template"
      />

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Template Name"
            placeholder="e.g., Weekly Oil Change"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <FormSelect
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            options={frequencyOptions}
            required
          />

          <FormTextArea
            label="Description"
            placeholder="Describe the maintenance template..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Checklist Items</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add checklist item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg border border-slate-600/50 group hover:border-slate-500/50 transition-colors">
                    <span className="text-slate-200">{item.text}</span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-700">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all transform hover:scale-[1.02]"
            >
              <Plus size={20} />
              Create Template
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Template Creation"
        message={`Create template "${formData.name}" with ${checklist.length} checklist items?`}
        type="confirm"
        confirmText="Create"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
