import React, { Dispatch, SetStateAction } from "react";

import Select from "react-select";

export interface LengthOption {
  readonly value: string;
  readonly label: string;
}

const lengthOptions: readonly LengthOption[] = [
  { value: "1", label: "Very Short" },
  { value: "2", label: "Short" },
  { value: "3", label: "Average" },
  { value: "4", label: "Long" },
  { value: "5", label: "Very Long" },
  { value: "0", label: "Unknown" },
];

type LengthSelectProps = {
  lengths: readonly LengthOption[];
  setLengths: Dispatch<SetStateAction<readonly LengthOption[]>>;
};

const LengthSelect = ({ lengths, setLengths }: LengthSelectProps) => {
  const updateLengths = (selectedOptions: readonly LengthOption[]) => {
    setLengths(selectedOptions);
  }
  return <div className="flex items-center gap-1">
    <div>VN length:</div>
    <Select
      defaultValue={lengths.length > 0 ? lengths : lengthOptions}
      isMulti
      required
      placeholder={"Select at least one length..."}
      name="lengths"
      options={lengthOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange ={(option: readonly LengthOption[]) => {updateLengths(option)}}
    />
  </div>
}
export default LengthSelect;
