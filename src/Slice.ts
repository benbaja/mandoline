import {Region} from 'wavesurfer.js/dist/plugins/regions.esm.js'

class Slice {
    public region : Region
    constructor(region: Region) {
        this.region = region
    }
} 

export default Slice