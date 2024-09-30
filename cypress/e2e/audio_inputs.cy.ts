context('Recordings', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
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
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
    //cy.get('[data-cy="browser"]').matchImageSnapshot("mic_rec");
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
    cy.visit(Cypress.config().baseUrl)
  })
  it("Import wav file", () => {
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("be.visible")
    cy.get('[data-cy="asFileInput"]').selectFile("cypress/fixtures/audiotest.wav")
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
    cy.wait(100)
    cy.get('[data-cy="browser"]').matchImageSnapshot("file_import");
  })
})

context('Download', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
  })

  it("Downloads yt audio", () => {
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("be.visible")
    cy.get('[data-cy="asURLInput"]').type("https://www.youtube.com/watch?v=jNQXAC9IVRw")
    cy.get('[data-cy="asURLButton"]').click()
    //cy.intercept("https://api.cobalt.tools/").as("cobaltCall")
    //cy.wait("@cobaltCall").then(({response}) => {
    //  cy.intercept(response.body.url).as("cobaltFetch")
    //})
    //cy.wait("@cobaltFetch", {responseTimeout: 80000})

    // wait for downloading / text change
    //cy.get('[data-cy="asURLButton"]').should("have.text", "Downloading")
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
    cy.wait(100)
    cy.get('[data-cy="browser"]').matchImageSnapshot("cobalt_dl");
  })

  it("Downloads an invalid URL", () => {
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("be.visible")
    cy.get('[data-cy="asURLInput"]').type("https://www.google.com")
    cy.get('[data-cy="asURLButton"]').click()
    cy.on("uncaught:exception", () => false)
    // cy.get('[data-cy="asURLButton"]').should("have.text", "Downloading")
    // should display error warning somewhere
    cy.get('[data-cy="asButton"]').click()
    cy.get('[data-cy="asList"]').should("not.be.visible")
  })
})