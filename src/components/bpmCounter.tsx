import { guess as guessTempo } from 'web-audio-beat-detector';

interface bpmProps {
    tempoState: [ Tempo | undefined, React.Dispatch<React.SetStateAction<Tempo | undefined>> ]
    fileBlob: Blob | undefined
}

interface Tempo {
    bpm: number | undefined
    offset: number | undefined
  }
  
  
const bpmCounter: React.FC<bpmProps> = ({tempoState, fileBlob}) => {
    const [tempo, setTempo] = tempoState

    const detectBPM = async () => {
        if (fileBlob) {
            const fileBuffer = await fileBlob.arrayBuffer()
            const audioCtx = new AudioContext
            const fileAudioBuffer = await audioCtx.decodeAudioData(fileBuffer)
            const results = await guessTempo(fileAudioBuffer)
            setTempo(results)
            audioCtx.close()
        } else {
            console.warn("fileBlob not found for BPM calculation")
        }
    }

    return (
        <div>
            <input type="number" min={0} max={999} value={tempo?.bpm} onChange={(event) => setTempo({bpm: event.target.valueAsNumber, offset:tempo?.offset})}></input>
            <button onClick={async () => await detectBPM()}>Detect</button>
        </div>
    )
}

export default bpmCounter
export type {Tempo}