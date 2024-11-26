import React, { useState } from "react";
import { vnListType, vnType } from "../types";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

interface VNHistoryProps {
  vns: vnListType;
}

export const VNHistory: React.FC<VNHistoryProps> = ({ vns }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col items-center mt-4">
      <div
        onClick={() => setShowHistory(!showHistory)}
        className="p-1 cursor-pointer text-blue-600 hover:text-blue-800"
      >
        <p className="flex items-center">
          <span className="text-xl">{showHistory === false ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}</span>
          {showHistory === false ? "Show" : "Hide"} History
          <span className="text-xl">{showHistory === false ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}</span>{" "}
        </p>
      </div>

      {showHistory && <div className="flex flex-col">{vns && vns.map((vn: vnType, counter: number) => <p key={vn.id}>{`${counter + 1}. ${vn.vn.title}`}</p>)}</div>}
    </div>
  );
};
