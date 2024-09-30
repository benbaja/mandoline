import { defineConfig } from "cypress";
import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin'

export default defineConfig({
  viewportWidth: 1400,
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on)
      // implement node event listeners here
    },
    baseUrl:"http://localhost:5173/mandoline/"
  },
});
