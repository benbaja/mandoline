
import { useState } from "react"
import Slice from "../utils/Slice"
import SliceWaveform from "./SliceWaveform"

interface SliceControllerProps {
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SliceController: React.FC<SliceControllerProps> = ({highlightedSliceState}) => {
  useState
  return (
    <>
      <button>Play</button>
      <button>Loop</button>
      <button>Trim</button>
      <button>Reverse</button>
      <SliceWaveform
        highlightedSliceState={highlightedSliceState} 
      />
    </>
  )
}


export default SliceController