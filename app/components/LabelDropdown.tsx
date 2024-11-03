import React from 'react';
import { labelType } from '../types';
import { UseFormRegister } from 'react-hook-form';

interface LabelDropdownProps {
  listLabels: labelType[] | null;
  register: UseFormRegister<any>; // TODO: remove any
  label: string;
  readableLabel: string;
}

const LabelDropdown: React.FC<LabelDropdownProps> = ({
  label,
  register,
  listLabels,
  readableLabel
}) => {
  return (
    <div>
      <label
        htmlFor="labelDropdown"
        className="block text-sm font-medium text-gray-900 text-left"
      >
        {readableLabel}
      </label>
      <select
        id="labelDropdown"
        {...register(label)}
        defaultValue=""
        required
        className="h-11 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-1 focus:border-blue-500 focus:outline-none block p-2.5 w-full"
      >
        <option value="" disabled>
          -- Select a label --
        </option>
        {listLabels &&
          listLabels.map((label: labelType) => (
            <option key={label.id} value={label.id}>
              {label.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default LabelDropdown;
