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

  return (
    <>
      <input type="file" onChange={handleImportFile} accept="audio/*" />
      <input type="url" value={cobaltURL} onChange={urlValidation}></input>
      <button onClick={async () => await handleColbaltAsync()}>Download</button>
      <Browser
        fileBlob={fileBlob}
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
      />
    </>
  )
}


export default BrowserController