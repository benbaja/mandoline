context("Browser", () => {
    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
        cy.get('[data-cy="asButton"]').click()
        cy.get('[data-cy="asList"]').should("be.visible")
        cy.get('[data-cy="asFileInput"]').selectFile("cypress/fixtures/audiotest.wav")
        cy.get('[data-cy="asButton"]').click()
        cy.get('[data-cy="asList"]').should("not.be.visible")
        cy.wait(100)
    })

    it("Plays and pauses main browser", () => {
        cy.get('[data-cy="bcPlayPause"]').as("playPauseBtn")
        cy.get("@playPauseBtn").click()
        cy.wait(500)
        cy.get("@playPauseBtn").should("have.text", "Pause")
        cy.wait(500)
        cy.get("@playPauseBtn").click()
        cy.get("@playPauseBtn").should("have.text", "Play")
        cy.get('[data-cy="browser"]').click("bottomRight")
        cy.get("@playPauseBtn").click()
        cy.wait(3000)
        cy.get("@playPauseBtn").should("have.text", "Play")
    })

    it("Checks for current time", () => {
        cy.get('[data-cy="bcCurrentTime"]').should("have.text", "00:00 / 00:42")
        cy.get('[data-cy="browser"]').click("bottom")
        cy.get('[data-cy="bcCurrentTime"]').should("have.text", "00:21 / 00:42")
        cy.get('[data-cy="bcPlayPause"]').click()
        cy.wait(2000)
        cy.get('[data-cy="bcPlayPause"]').click()
        cy.get('[data-cy="bcCurrentTime"]').should("have.text", "00:23 / 00:42")
    })

    it("Zooms browser")

    it("Checks for BPM detection", () => {
        cy.get('[data-cy="bpmButton"]').click()
        cy.wait(1000)
        cy.get('[data-cy="bpmInput"]').should("have.value", 93)
    })

    it("Checks for impossible BPM")

    it("Creates slices", () => {
        cy.wait(500)
        cy.get('[data-cy="browser"]').dblclick(500, 60)
        // dbl click
        // check for slice creation
        // move and click
        // check for slice size
        // check for slice in list
        // check for slice waveform
        // rinse and repeat
    })
})