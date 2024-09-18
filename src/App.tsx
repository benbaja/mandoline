import { StrictMode, useState } from "react"
import BrowserController from "./components/BrowserController"
import SlicesMenu from "./components/SlicesMenu"
import Slice from "./utils/Slice"
import styles from "./assets/styles.module.scss"



// A React component that will render wavesurfer
const App = () => {
  const [ highlightedSlice, setHighlightedSlice ] = useState<Slice | undefined>()
  const [ slicesList, setSlicesList ] = useState<Slice[] | []>([])

  return (
    <>
      <StrictMode>
        <h1 className={styles.title}>mandoline</h1>
        <div className={styles.mainWindow}>
          <BrowserController
             slicesListState={[slicesList, setSlicesList]}
             highlightedSliceState={[highlightedSlice, setHighlightedSlice]}
          />
          <SlicesMenu
             slicesListState={[slicesList, setSlicesList]}
             highlightedSliceState={[highlightedSlice, setHighlightedSlice]}
          />
        </div>
      </StrictMode>
    </>
  )
}


export default App