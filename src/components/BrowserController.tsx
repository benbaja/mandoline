import Browser from "./Browser"
import BPMCounter from "./bpmCounter"
import { Tempo } from "./bpmCounter"
import Slice from "../utils/Slice"
import React, { useRef, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"
import AudioSource from "./AudioSource"
import Settings from "./Settings"
import styles from "../assets/styles.module.scss"

const formatTime = (seconds: number) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

interface BCProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const BrowserController: React.FC<BCProps> = ({slicesListState, highlightedSliceState}) => {
  const [ fileBlob, setFileBlob ] = useState<Blob | undefined>(undefined)
  const recPlugin = useRef(RecordPlugin.create({renderRecordedAudio: true, scrollingWaveform: true}))
  const [ pickedMic, setPickedMic ] = useState<string>()

  const [ showAudioSource, setShowAudioSource ] = useState(false)
  const [ showSettings, setShowSettings ] = useState(false)

  const [ isPlaying, setIsPlaying] = useState(false)
  const [ time, setTime ] = useState(0)
  const [ zoom, setZoom ] = useState(100)
  const [ tempo, setTempo ] = useState<Tempo>()

  return (
    <div className={styles.browserController}>
      <div className={styles.browserToolbar}>
        <div className={styles.bcToolbarLeft}>
          <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div>current time: {formatTime(time)}</div>

          <label>zoom: </label>
          <input type="range" min="10" max="2000" value={zoom} onChange={(e) => setZoom(e.target.valueAsNumber)} />

          <BPMCounter 
            tempoState={[tempo, setTempo]} 
            fileBlob={fileBlob}
          />
        </div>

        <div className={styles.bcToolbarRight}>
          <div className={styles.asDropdown}>
            <button onClick={() => setShowAudioSource(!showAudioSource)}>Audio Source</button>
            <AudioSource 
              fileBlobState={[ fileBlob, setFileBlob ]} 
              recPlugin={recPlugin} 
              pickedMic={pickedMic}
              show={showAudioSource}
            />
          </div>
          <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
          <Settings 
            pickedMicState = {[ pickedMic, setPickedMic ]}
            showState={[ showSettings, setShowSettings ]}
          />
        </div>
      </div>
      <Browser
        fileBlob={fileBlob}
        tempo={tempo} 
        isPlaying={isPlaying}
        setTime={setTime}
        zoom={zoom}
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
        recPlugin={recPlugin}
      />
    </div>
  )
}


export default BrowserController