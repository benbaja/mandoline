import Browser from "./Browser"
import Slice from "../utils/Slice"
import React from "react"

interface BCProps {
  slicesListState: [ Slice[] | [], React.Dispatch<React.SetStateAction<Slice[] | []>> ]
  highlightedSliceState: [ Slice | undefined, React.Dispatch<React.SetStateAction<Slice | undefined>> ]
}

const BrowserController: React.FC<BCProps> = ({slicesListState, highlightedSliceState}) => {
  
  return (
    <>
      <Browser
         slicesListState={slicesListState}
         highlightedSliceState={highlightedSliceState}
      />
    </>
  )
}


export default BrowserController