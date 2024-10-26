import React from 'react'
import { labelType, listLabelsType, vnListType } from '../types';
import VNDisplay from './VNDisplay';

interface VNAreaProps {
    list: vnListType;
    selectedLabel: number;
    listLabels: listLabelsType;
    randomNumber?: number;
  }

const VNArea:React.FC<VNAreaProps> = ({list, selectedLabel, listLabels, randomNumber=-1}) => {
  return (
    <div>
        {randomNumber == -1 && <p>Error!</p>}
        {list && list.length !== 0 && <VNDisplay vn={list[randomNumber]} />}
        {list && list.length === 0 && (
        <div>
          <p>There doesn't seem to be anything here?</p>
          <p>{`Go add stuff to your ${listLabels !== null ? listLabels.find((option: labelType) => option.id == selectedLabel)?.label : ""} list!`}</p>
        </div>
      )}
    </div>
  )
}

export default VNArea