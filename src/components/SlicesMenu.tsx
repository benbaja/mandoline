import SlicesList from "./SlicesList"
import SliceController from "./SliceController"
import Slice from "../utils/Slice"

interface SlicesMenuProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SlicesMenu: React.FC<SlicesMenuProps> = ({slicesListState, highlightedSliceState}) => {

  return (
    <>
      <SlicesList
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
      />
      <SliceController
        highlightedSliceState={highlightedSliceState} 
      />
    </>
  )
}


export default SlicesMenu