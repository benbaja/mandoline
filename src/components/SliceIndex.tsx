import { useState } from "react"
import Slice from "../utils/Slice"
import styles from "../assets/styles.module.scss"

interface sliceIdxProps {
  slice: Slice
  isHighlighted: boolean
  highlightSlice: (clickedSlice: Slice) => void
  deleteSlice: (sliceToDelete: Slice) => void
}

const SliceIndex: React.FC<sliceIdxProps> = ({slice, isHighlighted, highlightSlice, deleteSlice}) => {
  const [ sliceName, setSliceName ] = useState(slice.settings.name)
  
  const handleDelete = () => deleteSlice(slice)
  const handleClick = () => highlightSlice(slice)
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliceName(event.target.value)
    slice.settings.name = event.target.value
  }


  return (
    <div onClick={handleClick} className={`${styles.sliceIndex} ${isHighlighted ? styles.highlightedSlice : ''}`}>
      <div className={styles.sliceIndexInfo}>
          <input onChange={handleNameChange} value={sliceName}></input>
          {slice.getLength()}
      </div>
      <div className={styles.sliceIndexButtons}>
        <button onClick={handleDelete}>x</button>
        <button>dl</button>
      </div>
    </div>
  )
}


export default SliceIndex