import * as React from 'react'
const { useMemo, useCallback, useRef, useEffect, useState } = React
import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import audioUrl from '../assets/audio.wav'
import Slice from '../utils/Slice'

interface browserProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const formatTime = (seconds: number) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

const regions = Regions.create()
const timeline = Timeline.create()
const minimap = Minimap.create({
  height: 20,
  waveColor: '#ddd',
  progressColor: '#999',
  dragToSeek: {debounceTime: 0.01},
  // the Minimap takes all the same options as the WaveSurfer itself
})

// A React component that will render wavesurfer
const Browser: React.FC<browserProps> = ({slicesListState, highlightedSliceState}) => {
  const containerRef = useRef(null)
  const [ zoom, setZoom ] = useState(100)
  const [ onMouse, setOnMouse ] = useState(false)
  const [ mousePos, setMousePos ] = useState({x: 0, y: 0})
  const [ firstMarkerTime, setFirstMarkerTime ] = useState(0)
  const [ highlightedSlice, setHighlightedSlice ] = highlightedSliceState
  const [ slicesList, setSlicesList ] = slicesListState
  const [ sliceIndex, setSliceIndex ] = useState(1)
  let browserBuffer : AudioBuffer | null = null

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrl,
    hideScrollbar: true,
    minPxPerSec: 100,
    dragToSeek: true,
    autoCenter: true,
    autoScroll: true,
    sampleRate: 44100,
    plugins: useMemo(() => [regions, timeline, minimap], []),
  })

  useEffect(() => {
    if (wavesurfer) {
      browserBuffer = wavesurfer.getDecodedData() 
    }
  })

  useEffect(() => {
    if (highlightedSlice) {
      wavesurfer?.setTime(highlightedSlice.region.start)
    }
  }, [highlightedSlice])

  const xToSec = (x: number) => {
    return wavesurfer ? (wavesurfer.getScroll() + x) / zoom : 0
  }

  useEffect(() => {
    // set-up region events
    regions.on('region-clicked', (region) => {
      const selectedSlice = slicesList.find(slice => slice.region.id === region.id)
      setHighlightedSlice(selectedSlice)
    })
    regions.on('region-updated', (region) => {
      const selectedSlice = slicesList.find(slice => slice.region.id === region.id)
      selectedSlice?.setBuffer(browserBuffer)
      selectedSlice && console.log("region updated")
      setHighlightedSlice(selectedSlice?.shallowCopy())
    })
    regions.on('region-removed', (region) => {
      const updatedSlicesList = slicesList.filter((slice) => {
        if (slice.region.id != region.id) {slice}
      })
      setSlicesList(updatedSlicesList)
    })

    return () => regions.unAll()
})

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    // cleanup function
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [onMouse, mousePos])

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key == "r" && onMouse) {
      console.log(onMouse)
      createNewSlice()
    }
  }

  const createNewSlice = () => {
      const startSec = xToSec(mousePos.x)

      const newSlice = new Slice(
        regions.addRegion({start: startSec, end: startSec+0.1}), 
        `slice ${sliceIndex}`
      )
      setSliceIndex(sliceIndex + 1)
      setHighlightedSlice(newSlice)
      setSlicesList([...slicesList, newSlice] as [Slice])
      setFirstMarkerTime(startSec)
      // add click event listener to stop region "dragging" via clicking
      wavesurfer?.once('click', () => {
        newSlice.isBeingCreated = false
        newSlice.setBuffer(browserBuffer)
        setHighlightedSlice(newSlice.shallowCopy())
        setFirstMarkerTime(0)
      })
    }

  useEffect(() => wavesurfer?.on('dblclick', () => {
    createNewSlice()
  })
)
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    setMousePos({x: event.clientX, y: event.clientY})
    
    if (highlightedSlice && highlightedSlice.isBeingCreated) {
      // handle end section of region
      const mouseOverTime = xToSec(event.clientX)
      const sliceStart = firstMarkerTime
      const regionOptions = mouseOverTime > sliceStart ? {start: sliceStart, end: mouseOverTime} : {start: mouseOverTime, end: sliceStart}
      highlightedSlice.region.setOptions(regionOptions)
    }
  }

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause()
  }, [wavesurfer])

  const onZoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zoomLevel = event.target.valueAsNumber
    setZoom(zoomLevel)
    if (wavesurfer?.getDecodedData()) {
      wavesurfer.zoom(zoomLevel)
    }
  }

  return (
    <>
      <div 
        ref={containerRef} 
        style={{ overflowX: 'hidden', width: "580px"}} 
        onMouseEnter={() => setOnMouse(true)} 
        onMouseLeave={() => setOnMouse(false)}
        onMouseMove={handleMouseMove}
      />

      <input type="range" min="10" max="2000" value={zoom} onChange={onZoom} />

      <p>Current time: {formatTime(currentTime)}</p>

      <div style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>

        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </>
  )
}


export default Browser