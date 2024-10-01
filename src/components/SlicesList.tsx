import Slice from "../utils/Slice"
import SliceIndex from "./SliceIndex"
import JSZip from 'jszip';
import FileSaver from 'file-saver'
import styles from "../assets/styles.module.scss"


interface SlicesListProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}
const SlicesList: React.FC<SlicesListProps> = ({slicesListState, highlightedSliceState}) => {
  const [ slicesList, setSlicesList ] = slicesListState
  const [ highlightedSlice, setHighlightedSlice ] = highlightedSliceState

  const deleteSlice = (sliceToDelete: Slice) => {
    if (sliceToDelete === highlightedSlice) {
      setHighlightedSlice(undefined)
    }
    
    sliceToDelete.region.remove()
    const updatedSlicesList : Slice[] | [] = slicesList.filter((item: Slice) => {
      if (item !== sliceToDelete) {
        return item
      }
    })
    setSlicesList(updatedSlicesList)
  }

  const deleteAll = () => {
    slicesList.forEach( (slice) => {
      slice.region.remove()
    })
    setSlicesList([])
    setHighlightedSlice(undefined)
  }

  const downloadAllSlices = () => {
    const zip = new JSZip();
    slicesList.forEach(slice => zip.file(`${slice.settings.name}.wav`, slice.sliceBlob))
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      FileSaver.saveAs(content, 'slices.zip');
  });
  }

  const highlightSlice = (clickedSlice: Slice) => {
    setHighlightedSlice(clickedSlice)
  }

  return (
    <div className={styles.slicesListContainer}>
      <div className={styles.slicesListHeader}>
        Slices 
        <button onClick={deleteAll}>Delete all</button>
        <button onClick={downloadAllSlices}>Download all</button>
      </div>
      <div className={styles.slicesList} data-cy="sList">
        {slicesList.map((slice) => {
            return(
              <SliceIndex key={slice.region.id}
                          slice={slice} 
                          highlightSlice={highlightSlice}
                          deleteSlice={deleteSlice}
                          isHighlighted={
                            highlightedSlice 
                            ? slice.region.id == highlightedSlice.region.id 
                            : false
                          }
              />
            )
          })                            
        }
      </div>
    </div>
  )
}


export default SlicesList