import Browser from "./Browser"
import BPMCounter from "./bpmCounter"
import { Tempo } from "./bpmCounter"
import Slice from "../utils/Slice"
import React, { useRef, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"
import AudioSource from "./AudioSource"
import Settings from "./Settings"

interface BCProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const BrowserController: React.FC<BCProps> = ({slicesListState, highlightedSliceState}) => {
  const [ fileBlob, setFileBlob ] = useState<Blob | undefined>(undefined)
  const recPlugin = useRef(RecordPlugin.create({renderRecordedAudio: true, scrollingWaveform: true}))
  const [ pickedMic, setPickedMic ] = useState<string>()

  const [tempo, setTempo] = useState<Tempo>()

  return (
    <>
      <AudioSource 
        fileBlobState={[ fileBlob, setFileBlob ]} 
        recPlugin={recPlugin} 
        pickedMic={pickedMic}
      />
      <Settings 
        pickedMicState = {[ pickedMic, setPickedMic ]}
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