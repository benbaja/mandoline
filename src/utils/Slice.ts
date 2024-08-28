import {Region} from 'wavesurfer.js/dist/plugins/regions.esm.js'

class Slice {
    public region : Region
    public id: string
    public name: string
    constructor(region: Region, name: string) {
        this.region = region
        this.id = this.region.id
        this.name = name
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