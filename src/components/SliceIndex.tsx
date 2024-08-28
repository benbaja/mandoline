import { useState } from "react"
import Slice from "../utils/Slice"

interface sliceIdxProps {
  slice: Slice
  isHighlighted: boolean
  highlightSlice: (clickedSlice: Slice) => void
  deleteSlice: (sliceToDelete: Slice) => void
}

const SliceIndex: React.FC<sliceIdxProps> = ({slice, isHighlighted, highlightSlice, deleteSlice}) => {
  const [ sliceName, setSliceName ] = useState(slice.name)
  
  const handleDelete = () => deleteSlice(slice)
  const handleClick = () => highlightSlice(slice)
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliceName(event.target.value)
  }


  return (
    <div onClick={handleClick}>
      {isHighlighted ? '*' : ''}
      <input onChange={handleNameChange} value={sliceName}></input>
      {slice.getLength()}
      <button onClick={handleDelete}>x</button>
      <button>dl</button>
    </div>
  )
}


export default SliceIndex