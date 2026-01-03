import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { PageHeader, FormSelect, FormTextArea, ConfirmationModal } from '../../components/shared';

interface ReportFormData {
  machineId: string;
  issueType: string;
  severity: string;
  description: string;
  images: File[];
}

export const AddMachineIssuePage: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    machineId: '',
    issueType: '',
    severity: 'medium',
    description: '',
    images: [],
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.machineId && formData.issueType && formData.description) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    console.log('Issue reported:', formData);
    setShowConfirm(false);
    setFormData({
      machineId: '',
      issueType: '',
      severity: 'medium',
      description: '',
      images: [],
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="w-full p-6">
      <PageHeader title="Report Machine Issue" subtitle="Report a mechanical or operational issue with a machine" />

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSelect
            label="Machine"
            options={[
              { value: 'mach_001', label: 'CNC Machine A' },
              { value: 'mach_002', label: 'Hydraulic Press B' },
              { value: 'mach_003', label: 'Drill C' },
            ]}
            value={formData.machineId}
            onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
            required
          />

          <FormSelect
            label="Issue Type"
            options={[
              { value: 'noise', label: 'Unusual Noise' },
              { value: 'leak', label: 'Fluid Leak' },
              { value: 'performance', label: 'Performance Issue' },
              { value: 'error', label: 'Error Code' },
              { value: 'other', label: 'Other' },
            ]}
            value={formData.issueType}
            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
            required
          />

          <FormSelect
            label="Severity Level"
            options={[
              { value: 'low', label: 'Low - Minor inconvenience' },
              { value: 'medium', label: 'Medium - Affects operation' },
              { value: 'high', label: 'High - Significant impact' },
              { value: 'critical', label: 'Critical - Emergency' },
            ]}
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
          />

          <FormTextArea
            label="Issue Description"
            placeholder="Describe the issue in detail..."
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Images (Optional)</label>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-gray-600">
                <Plus className="w-6 h-6 mx-auto mb-2" />
                Click to upload images
              </div>
            </label>

            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {formData.images.map((image, idx) => (
                  <div key={idx} className="relative bg-gray-100 rounded-lg p-2">
                    <p className="text-sm text-gray-600 truncate">{image.name}</p>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
          >
            <Send className="w-4 h-4" />
            Submit Issue Report
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Submit Issue Report"
        message="Are you sure you want to submit this issue report? An admin will review it shortly."
        type="confirm"
        confirmText="Submit"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
