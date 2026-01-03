import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, ArrowLeft } from 'lucide-react';
import { PageHeader, FormInput, FormSelect, ConfirmationModal } from '../../components/shared';

export const AddMachinePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    location: '',
    serialNumber: '',
    purchaseDate: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.model && formData.location) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('model', formData.model);
      data.append('location', formData.location);
      data.append('serialNumber', formData.serialNumber);
      data.append('purchaseDate', formData.purchaseDate);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch('http://localhost:3000/machines', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setFormData({ name: '', model: '', location: '', serialNumber: '', purchaseDate: '' });
          setImageFile(null);
          setSubmitted(false);
          // Optional: navigate back automatically or stay?
          // navigate('/admin/machines'); 
        }, 2000);
      } else {
        console.error('Failed to add machine');
      }
    } catch (error) {
      console.error('Error adding machine:', error);
    }
    setShowConfirm(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/admin/machines')}
          className="text-slate-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Machines
        </button>

        <PageHeader title="Add New Machine" subtitle="Register a new machine in the system" />

        {submitted && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500"></div>
            <p className="text-green-300">Machine added successfully!</p>
          </div>
        )}

        <div className="bg-secondary-dark/30 backdrop-blur-sm rounded-lg border border-secondary-light/20 p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Machine Name"
              placeholder="e.g., CNC Machine A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <FormInput
              label="Model"
              placeholder="e.g., CNC-2000"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />

            <FormSelect
              label="Location"
              options={[
                { value: '', label: 'Select Location' },
                { value: 'Building A', label: 'Building A' },
                { value: 'Building B', label: 'Building B' },
                { value: 'Building C', label: 'Building C' },
                { value: 'Warehouse', label: 'Warehouse' },
              ]}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />

            <FormInput
              label="Serial Number"
              placeholder="SN-XXXXX"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />

            <FormInput
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-light">Machine Image (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-secondary-light/20 border-dashed rounded-lg cursor-pointer bg-primary-dark/50 hover:bg-primary-dark/80 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-secondary-light" />
                    <p className="mb-2 text-sm text-secondary-light"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-secondary-light/70">{imageFile ? imageFile.name : 'SVG, PNG, JPG or GIF'}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent-primary hover:bg-accent-primary/80 text-primary-dark font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Machine
            </button>
          </form>
        </div>

        <ConfirmationModal
          isOpen={showConfirm}
          title="Confirm Machine Addition"
          message={`Add ${formData.name} to the system?`}
          type="confirm"
          confirmText="Add Machine"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};
