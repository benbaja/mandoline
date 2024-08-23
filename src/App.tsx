import * as React from 'react'
const { useMemo, useCallback, useRef, useEffect, useState } = React
import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Regions, { Region } from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import audioUrl from './assets/audio.wav'

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
const App = () => {
  const containerRef = useRef(null)
  const [ zoom, setZoom ] = useState(100)
  const [ onMouse, setOnMouse ] = useState(false)
  const [ mousePos, setMousePos ] = useState({x: 0, y: 0})
  const newRegion = useRef<Region | undefined>(undefined)
  const [ firstMarkerTime, setFirstMarkerTime ] = useState(0)

  const xToSec = (x: number) => {
    return wavesurfer?.getScroll()  + x / zoom
  }

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
    plugins: useMemo(() => [regions, timeline, minimap], []),
  })

  useEffect(() => {
    document.addEventListener("keydown", createNewRegion)
    // cleanup function
    return () => document.removeEventListener('keydown', createNewRegion)
  }, [onMouse, mousePos])

  const createNewRegion = (event: KeyboardEvent) => {
    if (event.key == "r" && onMouse) {
      const seconds = xToSec(mousePos.x)
      newRegion.current = regions.addRegion({start: seconds, end: seconds+0.1})
      setFirstMarkerTime(seconds)

      wavesurfer?.once('click', () => {
        newRegion.current = undefined
        setFirstMarkerTime(0)
      })
    }
  }
  
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    setMousePos({x: event.clientX, y: event.clientY})
    
    if (newRegion.current) {
      // handle end section of region
      const mouseOverTime = xToSec(event.clientX)
      const regionOptions = mouseOverTime > firstMarkerTime ? {start: firstMarkerTime, end: mouseOverTime} : {start: mouseOverTime, end: firstMarkerTime}
      newRegion.current.setOptions(regionOptions)
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

      <p>Current audio: {audioUrl}</p>

      <p>Current time: {formatTime(currentTime)}</p>

      <p>{mousePos.x} {mousePos.y}</p>
      <div style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>

        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </>
  )
}


export default App