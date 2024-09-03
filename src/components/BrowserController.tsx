import Browser from "./Browser"
import Slice from "../utils/Slice"
import React, { ChangeEvent, useState } from "react"

interface BCProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const BrowserController: React.FC<BCProps> = ({slicesListState, highlightedSliceState}) => {
  const [ fileBlob, setFileBlob ] = useState<Blob | undefined>(undefined)
  
  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      const blob = new Blob([file], { type: file.type });
      fileBlob != blob && setFileBlob(blob);
    }
  }

  return (
    <>
      <input type="file" onChange={handleImportFile} accept="audio/*" />
      <Browser
        fileBlob={fileBlob}
        slicesListState={slicesListState}
        highlightedSliceState={highlightedSliceState}
      />
    </>
  )
}


export default BrowserController