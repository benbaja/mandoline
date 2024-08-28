import Slice from "../utils/Slice"
import SliceIndex from "./SliceIndex"

interface SlicesListProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}
const SlicesList: React.FC<SlicesListProps> = ({slicesListState, highlightedSliceState}) => {
  const [ slicesList, setSlicesList ] = slicesListState
  const [ highlightedSlice, setHighlightedSlice ] = highlightedSliceState

  const deleteSlice = (sliceToDelete: Slice) => {
    sliceToDelete.region.remove()
    const updatedSlicesList : Slice[] | [] = slicesList.filter((item: Slice) => {
      if (item !== sliceToDelete) {
        return item
      }
    })
    setSlicesList(updatedSlicesList)
  }

  const highlightSlice = (clickedSlice: Slice) => {
    setHighlightedSlice(clickedSlice)
  }

  return (
    <>
      {slicesList.map((slice) => {
          return(
            <SliceIndex key={slice.id}
                        slice={slice} 
                        highlightSlice={highlightSlice}
                        deleteSlice={deleteSlice}
                        isHighlighted={
                          highlightedSlice 
                          ? slice.id == highlightedSlice.id 
                          : false
                        }
            />
          )
        })                            
      }
    </>
  )
}


export default SlicesList