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

  it("Import files", () => {

  })
})