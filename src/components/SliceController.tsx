
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
      <div className={styles.sliceControllerToolbar}>
        <button onClick={handlePlayPause} disabled={highlightedSlice ? false : true}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleLoop} disabled={highlightedSlice ? false : true}>
          {highlightedSlice?.settings.isLooped ? "Looped" : "Loop"}
        </button>
        <button onClick={handleReverse} disabled={highlightedSlice ? false : true}>
          {highlightedSlice?.settings.isReversed ? "=>" : "<="}
        </button>

        <div className={styles.sliceControllerToolbarSpacer}></div>
      </div>
      <SliceWaveform
        highlightedSliceState={highlightedSliceState} 
        isPlayingState={[isPlaying, setIsPlaying]}
        isLooped={isLooped}
      />
    </div>
  )
}


export default SliceController