import { defineConfig } from "cypress";
import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin'
import {downloadFile} from "cypress-downloadfile/lib/addPlugin"

export default defineConfig({
  viewportWidth: 1400,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {downloadFile})
      addMatchImageSnapshotPlugin(on)
      // implement node event listeners here
    },
    baseUrl:"http://localhost:5173/mandoline/"
  },
});
