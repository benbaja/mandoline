
import { useState } from "react"
import Slice from "../utils/Slice"
import SliceWaveform from "./SliceWaveform"

interface SliceControllerProps {
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SliceController: React.FC<SliceControllerProps> = ({highlightedSliceState}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooped, setIsLooped] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleLoop = () => {
    setIsLooped(!isLooped)
  }

  return (
    <>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleLoop}>{isLooped ? "Looped" : "Loop"}</button>
      <button>Trim</button>
      <button>Reverse</button>
      <SliceWaveform
        highlightedSliceState={highlightedSliceState} 
        isPlayingState={[isPlaying, setIsPlaying]}
        isLooped={isLooped}
      />
    </>
  )
}


export default SliceController