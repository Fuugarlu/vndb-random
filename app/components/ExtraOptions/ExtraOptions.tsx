import React, { Dispatch, SetStateAction, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import LengthSelect, { LengthOption } from './LengthSelect';

type LengthSelectProps = {
  lengths: readonly LengthOption[];
  setLengths: Dispatch<SetStateAction<readonly LengthOption[]>>;
};

const ExtraOptions = ({ lengths, setLengths }: LengthSelectProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="flex flex-col justify-start">
      <div className="pb-1 flex">
        <span
          onClick={() => setShowOptions(!showOptions)}
          className="inline-flex items-center select-none text-blue-600 hover:text-blue-800 cursor-pointer ">
          {showOptions === false ? "Show" : "Hide"} more options
          <span className="text-xl">{showOptions === false ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}</span>{" "}
        </span>
      </div>
      {showOptions && <LengthSelect lengths={lengths} setLengths={setLengths} />}
    </div>
  )
}

export default ExtraOptions