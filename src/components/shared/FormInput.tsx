import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-secondary-light mb-2">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 bg-secondary-dark/30 border rounded-md text-primary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition ${error ? 'border-accent-secondary' : 'border-secondary-light/20'
            } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-accent-secondary">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-secondary-light">{helperText}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-secondary-light mb-2">{label}</label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2 bg-secondary-dark/30 border rounded-md text-primary-light focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition ${error ? 'border-accent-secondary' : 'border-secondary-light/20'
            } ${className}`}
          {...props}
        >
          <option value="" className="bg-primary-dark">Select an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-primary-dark text-primary-light">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-accent-secondary">{error}</p>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-secondary-light mb-2">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2 bg-secondary-dark/30 border rounded-md text-primary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition resize-none ${error ? 'border-accent-secondary' : 'border-secondary-light/20'
            } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-accent-secondary">{error}</p>}
      </div>
    );
  }
);

FormTextArea.displayName = 'FormTextArea';
