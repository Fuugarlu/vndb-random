// components/Checkbox.tsx
import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 mx-2"
      />
      <label>{label}</label>
    </div>
  );
};

export default Checkbox;
