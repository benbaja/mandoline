import * as React from 'react'
const { useMemo, useRef, useEffect, useState } = React
import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import audioUrl from '../assets/audio.wav'
import Slice from '../utils/Slice'
import { Tempo } from './bpmCounter'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import styles from "../assets/styles.module.scss"

interface browserProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  isPlayingState: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
  timeState: [ number, React.Dispatch<React.SetStateAction<number>> ]
  zoomState: [ number, React.Dispatch<React.SetStateAction<number>> ]
  tempoState: [ Tempo | undefined, React.Dispatch<React.SetStateAction<Tempo | undefined>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
  fileBlob: Blob | undefined
  recPlugin: React.MutableRefObject<RecordPlugin>
}

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
const Browser: React.FC<browserProps> = ({
  slicesListState, tempoState, isPlayingState, timeState, zoomState, highlightedSliceState, fileBlob, recPlugin
}) => {
  const containerRef = useRef(null)

  const [ tempo, setTempo ] = tempoState
  const [ zoom, setZoom ] = zoomState
  const [ isPlaying, setIsPlaying] = isPlayingState
  const [ time, setTime ] = timeState

  const [ onMouse, setOnMouse ] = useState(false)
  const [ mousePos, setMousePos ] = useState({x: 0, y: 0})
  const [ firstMarkerTime, setFirstMarkerTime ] = useState(0)
  const [ highlightedSlice, setHighlightedSlice ] = highlightedSliceState
  const [ slicesList, setSlicesList ] = slicesListState
  const [ sliceIndex, setSliceIndex ] = useState(1)

  let browserBuffer : AudioBuffer | null = null
  const bpmTimeline = useRef<TimelinePlugin>()

  useEffect(() => {
    if (tempo?.bpm) {
      bpmTimeline.current = Timeline.create({insertPosition: 'beforebegin'})
    }

    return () => bpmTimeline.current && bpmTimeline.current.destroy()
  }, [tempo?.bpm])

  const { wavesurfer, currentTime } = useWavesurfer({
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
    plugins: useMemo(() => {
      const basePlugins = [regions, timeline, minimap, recPlugin.current]
      bpmTimeline.current && basePlugins.push(bpmTimeline.current)
      return basePlugins
    }, []),
  })

  useEffect(() => {
    // Effect for new file blob to load
    regions.clearRegions()
    setSlicesList([])
    setHighlightedSlice(undefined)
    setSliceIndex(1)
    wavesurfer?.setTime(0)
    fileBlob && wavesurfer?.loadBlob(fileBlob)
  }, [fileBlob])

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
    setMousePos({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    
    if (highlightedSlice && highlightedSlice.isBeingCreated) {
      // handle end section of region
      const mouseOverTime = xToSec(event.nativeEvent.offsetX)
      const sliceStart = firstMarkerTime
      const regionOptions = mouseOverTime > sliceStart ? {start: sliceStart, end: mouseOverTime} : {start: mouseOverTime, end: sliceStart}
      highlightedSlice.region.setOptions(regionOptions)
    }
  }

  // sync play state with ws
  useEffect(() => {
    isPlaying ? wavesurfer?.play() : wavesurfer?.pause()
  }, [isPlaying])

  // sync zoom state with ws
  useEffect(() => {
    if (wavesurfer?.getDecodedData()) {
      wavesurfer.zoom(zoom)
    }
  }, [zoom])

  // sync currentTime with controller
  useEffect(() => setTime(currentTime), [currentTime])

  return (
    <>
      <div 
        ref={containerRef} 
        className={styles.browser}
        onMouseEnter={() => setOnMouse(true)} 
        onMouseLeave={() => setOnMouse(false)}
        onMouseMove={handleMouseMove}
      />
    </>
  )
}


export default Browser