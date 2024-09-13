
import { useState } from "react"
import Slice from "../utils/Slice"
import SliceWaveform from "./SliceWaveform"
import styles from "../assets/styles.module.scss"

interface SliceControllerProps {
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SliceController: React.FC<SliceControllerProps> = ({highlightedSliceState}) => {
  const [highlightedSlice, setHighlightedSlice] = highlightedSliceState
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooped, setIsLooped] = useState(highlightedSlice?.settings.isLooped || false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleLoop = () => {
    if (highlightedSlice) {
      highlightedSlice.settings.isLooped = !highlightedSlice.settings.isLooped
      setIsLooped(highlightedSlice.settings.isLooped)
    }
  }

  const handleReverse = () => {
    if (highlightedSlice) {
      highlightedSlice.settings.isReversed = !highlightedSlice.settings.isReversed
      highlightedSlice.reverse()
      setHighlightedSlice(highlightedSlice.shallowCopy())
    }
  }

  return (
    <div className={styles.sliceController}>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleLoop}>{highlightedSlice?.settings.isLooped ? "Looped" : "Loop"}</button>
      <button>Trim</button>
      <button onClick={handleReverse}>{highlightedSlice?.settings.isReversed ? "=>" : "<="}</button>
      <SliceWaveform
        highlightedSliceState={highlightedSliceState} 
        isPlayingState={[isPlaying, setIsPlaying]}
        isLooped={isLooped}
      />
    </div>
  )
}


export default SliceController