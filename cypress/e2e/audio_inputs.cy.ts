context('Recordings', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/mandoline/')
  })
  
  it("Starts and stops recording", () => {
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("be.visible")
    cy.get('[data-cy="asRecButton"]').as("recBtn")
    cy.get('@recBtn').should("have.text", "Start")
    cy.get('@recBtn').click()
    cy.get('@recBtn').should("have.text", "Stop")
    cy.wait(3000)
    cy.get('@recBtn').click()
    cy.get('@recBtn').should("have.text", "Start")
    // visual testing
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
  })

  it("Change recording source", () => {
    cy.get('[data-cy="settingsButton"]').click()
    cy.get('[data-cy="settingsPanel"]').should("be.visible")
    cy.get('[data-cy="sMicOptions"]').as("micOpts")
    cy.get('@micOpts').should('have.length.at.least', 1)
    cy.get('@micOpts').find('option').last().then(lastOpt => {
      cy.get('@micOpts').select(lastOpt.text())
    })
    cy.get('[data-cy="sCloseBtn"]').click()
    cy.get('[data-cy="settingsPanel"]').should("not.be.visible")
  })
})

context('Files', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/mandoline/')
  })
  const fileExtensions = ["aiff", "flac", "m4a", "mp3", "ogg", "opus", "wav"]
  fileExtensions.forEach(ext => {
    it(`Import ${ext} file`, () => {
      cy.get('[data-cy="asButton"]').click()
      cy.get('[data-cy="asList"]').should("be.visible")
      cy.get('[data-cy="asFileInput"]').selectFile(`cypress/fixtures/audio_files/audiotest.${ext}`)
      cy.get('[data-cy="asButton"]').click()
      cy.get('[data-cy="asList"]').should("not.be.visible")
      // visual testing
    })
  })
})

context('Download', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/mandoline/')
  })

  it("Downloads yt audio", () => {
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("be.visible")
    cy.get('[data-cy="asURLInput"]').type("https://www.youtube.com/watch?v=jNQXAC9IVRw")
    cy.get('[data-cy="asURLButton"]').click()
    // wait for downloading / text change
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
    // visual testing
  })

  it("Downloads an invalid URL", () => {
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("be.visible")
    cy.get('[data-cy="asURLInput"]').type("https://www.google.com")
    cy.get('[data-cy="asURLButton"]').click()
    // wait for downloading
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
    // visual testing
  })
})