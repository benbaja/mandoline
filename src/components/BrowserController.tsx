import Browser from "./Browser"
import BPMCounter from "./bpmCounter"
import { Tempo } from "./bpmCounter"
import Slice from "../utils/Slice"
import React, { useRef, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"
import AudioSource from "./AudioSource"
import Settings from "./Settings"
import styles from "../assets/styles.module.scss"

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

  const [tempo, setTempo] = useState<Tempo>()

  return (
    <>
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
      <BPMCounter 
        tempoState={[tempo, setTempo]} 
        fileBlob={fileBlob}
      />
      <Browser
        fileBlob={fileBlob}
        tempoState={[tempo, setTempo]} 
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
        recPlugin={recPlugin}
      />
    </>
  )
}


export default BrowserController