import Slice from "../utils/Slice"
import SliceIndex from "./SliceIndex"

interface SlicesListProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}
const SlicesList: React.FC<SlicesListProps> = ({slicesListState, highlightedSliceState}) => {

  return (
    <>
      <SliceIndex />
    </>
  )
}


export default SlicesList