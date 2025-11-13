import React from "react";
import { vnType } from "../types";
// import Image from "next/image";

interface VNDisplayProps {
  vnInfo: vnType;
  sameRandomNumberCount: number;
}

const VNDisplay = ({ vnInfo, sameRandomNumberCount }: VNDisplayProps) => {
  const vnId = vnInfo.id;
  const vn = vnInfo.vn;
  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-sm">You should read: </p>
      <a
        href={`https://vndb.org/${vnId}`}
        className="mb-1"
      >
        <h1 className="text-2xl font-bold">{vn.title}</h1>
        {/* {vn.alttitle && <p>{vn.alttitle}</p>} */}
      </a>
      <a href={`https://vndb.org/${vnId}`}>
        {vn.image && (
          <img
            className="max-w-lg max-h-96 max-w-full"
            src={vn.image.url}
            alt={vn.title}
          />
        )}
        {!vn.image && <p className="italic hover:bg-blue-300 border-blue-500 border-2 p-3">This VN doesn't have a cover picture.<br/>Click here for the VNDB page.</p>}
      </a>

      {sameRandomNumberCount > 0 && <p className="mt-3 text-sm">This VN showed up {sameRandomNumberCount > 0 && sameRandomNumberCount + 1} times in a row!</p>}
      <p className="mt-3 text-sm">I hear it's pretty cool.</p>
      <p className="text-xs">(Click the cover for the vndb page)</p>
    </div>
  );
};

export default VNDisplay;
