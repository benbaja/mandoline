import {Region} from 'wavesurfer.js/dist/plugins/regions.esm.js'

class Slice {
    public region : Region
    public id: string
    constructor(region: Region) {
        this.region = region
        this.id = this.region.id
    }
} 

export default Slice