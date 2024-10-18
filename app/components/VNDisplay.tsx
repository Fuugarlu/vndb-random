// components/VNDisplay.tsx
import React from 'react';
import { vnType } from '../types';

interface VNDisplayProps {
  vn: vnType;
}

const VNDisplay: React.FC<VNDisplayProps> = ({ vn }) => {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-sm">You should read: </p>
      <h1 className="text-2xl font-bold">{vn.vn.title}</h1>
      {/* {vn.vn.alttitle && <p>{vn.vn.alttitle}</p>} */}
      <img
        className="max-w-lg max-h-96"
        src={vn.vn.image.url}
        alt={vn.vn.title}
      />
      <p className="mt-3 text-sm">I hear it's pretty cool.</p>
    </div>
  );
};

export default VNDisplay;
