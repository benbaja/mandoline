import * as React from 'react'
const { useMemo, useCallback, useRef, useEffect, useState } = React
import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
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

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrl,
    hideScrollbar: true,
    minPxPerSec: 100,
    dragToSeek: true,
    plugins: useMemo(() => [regions, timeline, minimap], []),
  })

  useEffect(() => wavesurfer?.on('dblclick', () => {
      const clickTime = wavesurfer.getCurrentTime()
      console.log(clickTime)
      const addedRegion = regions.addRegion({start: clickTime})
      wavesurfer.on('drag', (dragX: number) => {
        console.log(dragX)
      })
    })
  )
  // regions.enableDragSelection({drag: false})

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause()
  }, [wavesurfer])

  const newRegion = () => {
    const start = wavesurfer?.getCurrentTime() as number;
    const end = start + 2;
    regions.addRegion({start: start, end: end})
  }

  const onZoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zoomLevel = event.target.valueAsNumber
    setZoom(zoomLevel)
    if (wavesurfer?.getDecodedData()) {
      wavesurfer.zoom(zoomLevel)
    }
  }

  return (
    <>
      <button onClick={newRegion} style={{ minWidth: '1em' }}>+</button>
      <div ref={containerRef} style={{ overflowX: 'hidden', width: "400px"}} />

      <input type="range" min="10" max="2000" value={zoom} onChange={onZoom} />

      <p>Current audio: {audioUrl}</p>

      <p>Current time: {formatTime(currentTime)}</p>

      <div style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>

        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </>
  )
}


export default App