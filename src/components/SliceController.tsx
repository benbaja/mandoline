
import Slice from "../utils/Slice"
import SliceWaveform from "./SliceWaveform"

interface SliceControllerProps {
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SliceController: React.FC<SliceControllerProps> = ({highlightedSliceState}) => {

  return (
    <>
      <SliceWaveform
        highlightedSliceState={highlightedSliceState} 
      />
    </>
  )
}


export default SliceController