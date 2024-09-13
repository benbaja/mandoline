import SlicesList from "./SlicesList"
import SliceController from "./SliceController"
import Slice from "../utils/Slice"
import styles from "../assets/styles.module.scss"

interface SlicesMenuProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SlicesMenu: React.FC<SlicesMenuProps> = ({slicesListState, highlightedSliceState}) => {

  return (
    <div className={styles.slicesMenu}>
      <SlicesList
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
      />
      <SliceController
        highlightedSliceState={highlightedSliceState} 
      />
    </div>
  )
}


export default SlicesMenu