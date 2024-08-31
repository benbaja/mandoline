import { useEffect, useRef } from "react"
import Slice from "../utils/Slice"
import { useWavesurfer } from "@wavesurfer/react"

interface SliceWaveformProps {
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const SliceWaveform: React.FC<SliceWaveformProps> = ({highlightedSliceState}) => {
  const containerRef = useRef(null)
  const [ highlightedSlice, _ ] = highlightedSliceState

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: 'rgb(0, 200, 200)',
    progressColor: 'rgb(100, 0, 100)',
    hideScrollbar: true,
    dragToSeek: true,
    autoCenter: true,
    autoScroll: true,
  })

  useEffect(() => {
    const sliceBlob = highlightedSlice?.sliceBlob
    if (wavesurfer && sliceBlob) {
      console.log(sliceBlob)
      wavesurfer.loadBlob(sliceBlob)
    }
  }, [highlightedSlice])

  return (
    <>
      <div 
        ref={containerRef} 
        style={{ overflowX: 'hidden', width: "580px"}} 
      />
    </>
  )
}


export default SliceWaveform