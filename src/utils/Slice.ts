import { encodeWavFileFromAudioBuffer } from 'wav-file-encoder'
import {Region} from 'wavesurfer.js/dist/plugins/regions.esm.js'
const audioCtx = new AudioContext()

interface sliceSettings {
    name: string
    isLooped: boolean
    isReversed: boolean
}

class Slice {
    public region : Region
    public settings: sliceSettings
    private sliceBuffer: AudioBuffer | undefined
    public sliceBlob: Blob | undefined
    public isBeingCreated: boolean


    constructor(region: Region, name: string) {
        this.isBeingCreated = true
        this.region = region
        this.settings = {
            name: name,
            isLooped: false,
            isReversed: false
        }
        this.sliceBuffer = undefined
        this.sliceBlob = undefined
    }

    public setBuffer(browserBuffer: AudioBuffer | null): void {
        if (browserBuffer) {
            console.log('updated buffer')
            this.sliceBuffer = this.extractBuffer(browserBuffer)
            if (this.settings.isReversed) {
                this.reverse()
            } else {
                // blob generation already handled in the reverse method, maybe find a more elegant solution...
                this.sliceBlob = new Blob([encodeWavFileFromAudioBuffer(this.sliceBuffer, 1)], {type: "audio/wav"})
            }
        }
    }

    private extractBuffer(wsBuffer: AudioBuffer): AudioBuffer {
        const sampleRate = wsBuffer.sampleRate
        const numberOfChannels = wsBuffer.numberOfChannels
        const startSample = Math.floor(this.region.start * sampleRate)
        const endSample = Math.floor(this.region.end * sampleRate)
        const frameCount = endSample - startSample

        const slicedBuffer = audioCtx.createBuffer(numberOfChannels, frameCount, sampleRate)
        
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const slicedChannel = wsBuffer.getChannelData(channel).slice(startSample, endSample)
            slicedBuffer.copyToChannel(slicedChannel, channel)
        }

        return slicedBuffer
    }

    public reverse(): void {
        if (this.sliceBuffer) {
            const numberOfChannels = this.sliceBuffer.numberOfChannels
            const revBuffer = audioCtx.createBuffer(
                numberOfChannels, 
                this.sliceBuffer.length, 
                this.sliceBuffer.sampleRate)

            for (let channel = 0; channel < numberOfChannels; channel++) {
                const revChannel = this.sliceBuffer.getChannelData(channel).reverse()
                revBuffer.copyToChannel(revChannel, channel)
            }
            this.sliceBuffer = revBuffer
            this.sliceBlob = new Blob([encodeWavFileFromAudioBuffer(revBuffer, 1)], {type: "audio/wav"})
        }
    }

    public getLength(): string {
        const roundedLength = Math.round((this.region.end - this.region.start) * 1000) / 1000
        const ms = (roundedLength % 1).toFixed(3).slice(2)
        const sec = Math.floor(roundedLength % 60).toString().padStart(2, "0")
        const min = Math.floor(roundedLength / 60).toString().padStart(2, "0")
        return min == '00' ? `${sec}.${ms}` : `${min}:${sec}.${ms}`
    }

    // used in some cases to trigger component re-render after property modification
    public shallowCopy() {
        const template = Object.create(Object.getPrototypeOf(this))
        return Object.assign(template, this)
    }

    public toggleLoop() {

    }
} 

export default Slice