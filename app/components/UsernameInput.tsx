// UsernameInput.tsx
import React, { Component } from 'react';
import { userType } from '../types';
import SubmitButton from './Button';


interface UsernameInputProps {
  readableLabel: string;
  register: any
  label: string;
}

class UsernameInput extends Component<UsernameInputProps> {
  render() {
    const { readableLabel, register, label } = this.props;

    return (
      <div className='w-full'>
        <label className="block text-sm font-medium text-gray-900 text-left">
          {readableLabel}
        </label>
            <input
              type="text"
              {...register(label)}
              className="h-11 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-1 focus:border-blue-500 focus:outline-none block p-2.5 w-full"
              placeholder="Fuugarlu"
              required={true}
            />
      </div>
    );
  }
}

export default UsernameInput;