import { useState } from "react"
import BrowserController from "./components/BrowserController"
import SlicesMenu from "./components/SlicesMenu"
import Slice from "./utils/Slice"

// A React component that will render wavesurfer
const App = () => {
  const [ highlightedSlice, setHighlightedSlice ] = useState<Slice | undefined>()
  const [ slicesList, setSlicesList ] = useState<Slice[] | []>([])

  return (
    <>
      <BrowserController
         slicesListState={[slicesList, setSlicesList]}
         highlightedSliceState={[highlightedSlice, setHighlightedSlice]}
      />
      <SlicesMenu
         slicesListState={[slicesList, setSlicesList]}
         highlightedSliceState={[highlightedSlice, setHighlightedSlice]}
      />
    </>
  )
}


export default App