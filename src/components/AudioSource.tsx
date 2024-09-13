import React, { ChangeEvent, useState } from "react"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"

interface ASProps {
    fileBlobState: [ Blob | undefined, React.Dispatch<React.SetStateAction<Blob | undefined>> ]
    recPlugin: React.MutableRefObject<RecordPlugin>
    pickedMic: string | undefined
}

const AudioSource: React.FC<ASProps> = ({fileBlobState, recPlugin, pickedMic}) => {
    const [fileBlob, setFileBlob] = fileBlobState
    const [ cobaltURL, setCobaltURL ] = useState("")
    const [ isUrlValid, setIsUrlValid ] = useState(false)
    const [ isRecording, setIsRecording ] = useState(false)

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
        <div>
            <input type="file" onChange={handleImportFile} accept="audio/*" />
            <input type="url" value={cobaltURL} onChange={urlValidation}></input>
            <button onClick={async () => await handleColbaltAsync()}>Download</button>
            <button onClick={handleRec}>{isRecording ? "Stop" : "Rec"}</button>
        </div>
    )
}

export default AudioSource