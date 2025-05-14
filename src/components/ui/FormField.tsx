import React, { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  name: string;
  type: string;
  error?: string;
  textarea?: boolean;
  options?: Array<{ value: string, label: string }>;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  error,
  textarea,
  options,
  ...rest
}) => {
  const baseInputClasses = "w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border";
  const errorClasses = error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "";
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {textarea ? (
        <textarea
          id={name}
          name={name}
          className={`${baseInputClasses} ${errorClasses}`}
          {...rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`${baseInputClasses} ${errorClasses}`}
          {...rest as React.SelectHTMLAttributes<HTMLSelectElement>}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`${baseInputClasses} ${errorClasses}`}
          {...rest as React.InputHTMLAttributes<HTMLInputElement>}
        />
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField; 