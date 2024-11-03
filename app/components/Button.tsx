// components/SubmitButton.tsx

import React from 'react';

type SubmitButton = {
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  customClasses?: string;
  children?: React.ReactNode;
};

const SubmitButton: React.FC<SubmitButton> = ({ label, disabled = false, fullWidth = false, customClasses = '' }) => {
  return (
    <button
    type="submit"
      className={`
        bg-gray-50
        border border-gray-300
        text-gray-900
        text-sm
        rounded-lg
        focus:ring-1 focus:ring-blue-500
        focus:border-1 focus:border-blue-500
        focus:outline-none
        block
        p-2.5
        transition-colors
        duration-500
        border
        border-gray-400
        ${fullWidth ? 'w-full' : 'w-1/3'}
        h-11
        ${customClasses}
      `}
      // onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
