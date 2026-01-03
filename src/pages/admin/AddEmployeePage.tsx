import React, { useState } from 'react';
import { PageHeader, FormInput, FormSelect } from '../../components/shared';

export const AddEmployeePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    role: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password && formData.department && formData.role) {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSubmitted(true);
          setTimeout(() => {
            setFormData({ name: '', email: '', password: '', department: '', role: '' });
            setSubmitted(false);
          }, 2000);
        } else {
          console.error('Failed to add employee');
        }
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-3xl mx-auto">
        <PageHeader
          title="Add New Employee"
          subtitle="Register a new employee in the system"
          action={<></>}
        />

        {submitted && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500"></div>
            <p className="text-green-300">Employee added successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-secondary-dark/30 rounded-lg border border-secondary-light/20 p-6 space-y-6 backdrop-blur-sm">
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Department' },
              { value: 'operations', label: 'Operations' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'admin', label: 'Administration' },
              { value: 'quality', label: 'Quality Control' },
            ]}
            required
          />

          <FormSelect
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Role' },
              { value: 'admin', label: 'Administrator' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'technician', label: 'Technician' },
              { value: 'employee', label: 'Employee' },
            ]}
            required
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!formData.name || !formData.email || !formData.password || !formData.department || !formData.role}
              className="px-6 py-2 bg-accent-primary hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-primary-dark font-bold rounded-lg transition-colors shadow-lg shadow-accent-primary/20"
            >
              Add Employee
            </button>
            <button
              type="reset"
              className="px-6 py-2 bg-secondary-dark hover:bg-secondary-dark/80 text-primary-light border border-secondary-light/20 rounded-lg transition-colors"
              onClick={() => setFormData({ name: '', email: '', password: '', department: '', role: '' })}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-lg">
          <p className="text-accent-primary text-sm">
            Once an employee is added, they will be able to log in with the credentials provided above.
          </p>
        </div>
      </div>
    </div>
  );
};
