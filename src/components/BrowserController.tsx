import Browser from "./Browser"
import Slice from "../utils/Slice"
import React, { ChangeEvent, useState } from "react"

interface BCProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const BrowserController: React.FC<BCProps> = ({slicesListState, highlightedSliceState}) => {
  const [ fileBlob, setFileBlob ] = useState<Blob | undefined>(undefined)
  const [ cobaltURL, setCobaltURL ] = useState("")
  const [ isUrlValid, setisUrlValid ] = useState(false)

  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      const blob = new Blob([file], { type: file.type });
      fileBlob != blob && setFileBlob(blob);
    }
  }

  const urlValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setisUrlValid(event.target.validity.valid)
    setCobaltURL(event.target.value)
  }

  const handleCobalt = () => {
    if (isUrlValid) {
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

      fetch("https://api.cobalt.tools/api/json", initParams)
        .then((response) => response.json())
          .then(data => {
            if (data.status == "stream") {
              fetch(data.url).then((response) => {
                if (response.body instanceof ReadableStream) {
                  const reader = response.body.getReader()
                  const chunks : Uint8Array[] = []

                  reader.read().then(function pump ({done, value}) : Promise<ReadableStreamReadResult<Uint8Array>> {
                    if (done) {
                      const dataBlob = new Blob(chunks)
                      console.log(dataBlob.size)
                      setFileBlob(dataBlob)
                      return
                    }
                    value && chunks.push(value)
                    return reader.read().then(pump)
                  })
                } else {
                  console.log("Not a stream", data)
                }
              })
            } else {
              console.log("Cobalt error", data.status, data?.text)
            }
          })
    } else {
      console.log("Invalid URL")
    }
  }

  return (
    <>
      <input type="file" onChange={handleImportFile} accept="audio/*" />
      <input type="url" value={cobaltURL} onChange={urlValidation}></input>
      <button onClick={handleCobalt}>Download</button>
      <Browser
        fileBlob={fileBlob}
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
      />
    </>
  )
}


export default BrowserController