import {Region} from 'wavesurfer.js/dist/plugins/regions.esm.js'
const audioCtx = new AudioContext()

class Slice {
    public region : Region
    public id: string
    public name: string
    private sliceBuffer: AudioBuffer | undefined

    constructor(region: Region, name: string, browserBuffer: AudioBuffer | null) {
        this.region = region
        this.id = this.region.id
        this.name = name
        if (browserBuffer) {
            this.sliceBuffer = this.extractBuffer(browserBuffer)
        } 
    }

    public updateBuffer(browserBuffer: AudioBuffer | null) {
        if (browserBuffer) {
            this.sliceBuffer = this.extractBuffer(browserBuffer)
        }
    }

    private extractBuffer(wsBuffer: AudioBuffer) {
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

    public getSliceBuffer() {
        return this.sliceBuffer
    }

    public getLength() {
        const roundedLength = Math.round((this.region.end - this.region.start) * 1000) / 1000
        const ms = (roundedLength % 1).toFixed(3).slice(2)
        const sec = Math.floor(roundedLength % 60).toString().padStart(2, "0")
        const min = Math.floor(roundedLength / 60).toString().padStart(2, "0")
        return min == '00' ? `${sec}.${ms}` : `${min}:${sec}.${ms}`
    }
} 

export default Slice