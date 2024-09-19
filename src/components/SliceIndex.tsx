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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliceName(event.target.value)
    slice.settings.name = event.target.value
  }


  return (
    <div onClick={() => highlightSlice(slice)} className={`${styles.sliceIndex} ${isHighlighted ? styles.highlightedSlice : ''}`}>
      <div className={styles.sliceIndexInfo}>
          <input onChange={handleNameChange} value={sliceName}></input>
          {slice.getLength()}
      </div>
      <div className={styles.sliceIndexButtons}>
        <button onClick={() => deleteSlice(slice)}>x</button>
        <a href={slice.downloadUrl} download={`${sliceName}.wav`}>
          <button>dl</button>
        </a>
      </div>
    </div>
  )
}


export default SliceIndex