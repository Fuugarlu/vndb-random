// components/VNDisplay.tsx
import React from "react";
import { vnType } from "../types";
import Image from "next/image";

interface VNDisplayProps {
  vn: vnType;
}

const VNDisplay: React.FC<VNDisplayProps> = ({ vn }) => {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-sm">You should read: </p>
      <a href={`https://vndb.org/${vn.id}`} className="mb-1">
        <h1 className="text-2xl font-bold">{vn.vn.title}</h1>
        {/* {vn.vn.alttitle && <p>{vn.vn.alttitle}</p>} */}
      </a>
      <a href={`https://vndb.org/${vn.id}`}>
        {/* <Image */}
        <img
          className="max-w-lg max-h-96"
          src={vn.vn.image.url}
          alt={vn.vn.title}
        />
      </a>
      <p className="mt-3 text-sm">I hear it's pretty cool.</p>
      <p className="text-xs">(Click the cover for the vndb page)</p>
    </div>
  );
};

export default VNDisplay;
