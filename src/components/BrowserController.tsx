import Browser from "./Browser"
import Slice from "../utils/Slice"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"

interface BCProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const BrowserController: React.FC<BCProps> = ({slicesListState, highlightedSliceState}) => {
  const [ fileBlob, setFileBlob ] = useState<Blob | undefined>(undefined)
  const [ cobaltURL, setCobaltURL ] = useState("")
  const [ isUrlValid, setIsUrlValid ] = useState(false)
  const [ isRecording, setIsRecording ] = useState(false)
  const recPlugin = useRef(RecordPlugin.create({renderRecordedAudio: true, scrollingWaveform: true}))
  const [ micDevices, setMicDevices ] = useState<{name: string, id: string}[]>([])
  const [ pickedMic, setPickedMic ] = useState<string>()

  useEffect(() => {
    navigator.permissions.query({ name: "microphone" as PermissionName }).then(permissionResult => {
      console.log("Mic permission: ", permissionResult.state)
      if (permissionResult.state != "granted") {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      }
    })
    RecordPlugin.getAvailableAudioDevices().then(devices => {
      const devicesList : {name: string, id: string}[] = []
      devices.forEach(device => {
        devicesList.push({name: device.label, id: device.deviceId})
      })
      setMicDevices(devicesList)
    })
    // cleanup
    return () => {
      setMicDevices([])
    }
  }, [])

  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      const blob = new Blob([file], { type: file.type });
      fileBlob != blob && setFileBlob(blob);
    }
  }

  const urlValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUrlValid(event.target.validity.valid)
    setCobaltURL(event.target.value)
  }

  const handleColbaltAsync = async () => {
    if (!isUrlValid) {
      throw new Error("Invalid URL")
    }
    const contentURL = encodeURI(cobaltURL)
    const initParams : RequestInit = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: contentURL,
        aFormat: "best",
        filenamePattern: "basic",
        isAudioOnly: true,
        isTTFullAudio: true
      })
    }

    const cobaltResponse = await fetch("https://api.cobalt.tools/api/json", initParams)
    const cobaltData = await cobaltResponse.json()
    if (cobaltData.status == "stream") {
      const urlResponse = await fetch(cobaltData.url)
      if (urlResponse.body instanceof ReadableStream) {
        const reader = urlResponse.body.getReader()
        const chunks : Uint8Array[] = []
        let done: boolean | undefined;
        let value: Uint8Array | undefined;

        while ({ done, value } = await reader.read(), !done) {
          if (value) {
            chunks.push(value);
          }
        } 
        const dataBlob = new Blob(chunks)
        console.log(dataBlob.size)
        setFileBlob(dataBlob)
      } else {
        console.log(urlResponse.body)
        throw new Error ("Not a stream")
      }
    } else {
      throw new Error(`Cobalt error, ${cobaltData.status}, ${cobaltData.text}`)
    }
  }

  const handleMicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPickedMic(event.target.value)
  }

  const handleRec = () => {
    if (!isRecording) {
      setIsRecording(true)
      recPlugin.current.startRecording({ deviceId: pickedMic })
    } else {
      recPlugin.current.stopRecording()
      setIsRecording(false)
    }
  }

  return (
    <>
      <input type="file" onChange={handleImportFile} accept="audio/*" />
      <input type="url" value={cobaltURL} onChange={urlValidation}></input>
      <button onClick={async () => await handleColbaltAsync()}>Download</button>
      <button onClick={handleRec}>{isRecording ? "Stop" : "Rec"}</button>
      <select onChange={handleMicChange}>
        {micDevices.map(device => {
          return <option value={device.id}>{device.name}</option>
        })}
      </select>
      <Browser
        fileBlob={fileBlob}
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
        recPlugin={recPlugin}
      />
    </>
  )
}


export default BrowserController