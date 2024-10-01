import { useEffect, useRef } from "react"
import Slice from "../utils/Slice"
import { useWavesurfer } from "@wavesurfer/react"
import styles from "../assets/styles.module.scss"

interface SliceWaveformProps {
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
  isPlayingState: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
  isLooped: boolean
}

const SliceWaveform: React.FC<SliceWaveformProps> = ({highlightedSliceState, isPlayingState, isLooped}) => {
  const containerRef = useRef(null)
  const [ highlightedSlice, _ ] = highlightedSliceState
  const [ isPlaying, setIsPlaying] = isPlayingState

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    waveColor: 'rgb(0, 200, 200)',
    progressColor: 'rgb(100, 0, 100)',
    hideScrollbar: true,
    dragToSeek: true,
    autoCenter: true,
    autoScroll: true,
    fillParent: true
  })

  useEffect(() => {
    const sliceBlob = highlightedSlice?.sliceBlob
    if (wavesurfer && sliceBlob) {
      wavesurfer.pause()
      setIsPlaying(false)
      wavesurfer.loadBlob(sliceBlob)
    }
  }, [highlightedSlice])

  useEffect(() => {
    isPlaying ? wavesurfer?.play() : wavesurfer?.pause()
  }, [isPlaying])

  useEffect(() => {
    wavesurfer?.on('finish', () => {
      // isLooped ? wavesurfer.play : setIsPlaying(false)
      if (highlightedSlice?.settings.isLooped) {
        wavesurfer.play()
      } else {
        setIsPlaying(false)
      }
    })

    return () => wavesurfer?.unAll()
  }, [highlightedSlice, isLooped])

  return (
      <div 
        ref={containerRef} 
        className={styles.sliceWaveform}
        data-cy="sWaveform"
      />
  )
}


export default SliceWaveform