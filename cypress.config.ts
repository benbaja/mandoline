import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1400,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl:"http://localhost:5173/mandoline/"
  },
});
