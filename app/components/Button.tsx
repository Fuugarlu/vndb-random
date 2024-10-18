// components/Button.tsx

import React from 'react';

type ButtonProps = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  customClasses?: string;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ onClick, label, disabled = false, fullWidth = false, customClasses = '', children }) => {
  return (
    <button
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
        ${fullWidth ? 'w-full' : 'w-1/4'}
        ${customClasses}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {label || children}
    </button>
  );
};

export default Button;
