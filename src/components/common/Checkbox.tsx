import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, title, className = '' }) => {
  return (
    <input
      type="checkbox"
      className={`custom-checkbox ${className}`}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      title={title}
    />
  );
};
