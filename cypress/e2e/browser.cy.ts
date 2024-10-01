context("Browser", () => {
    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
        cy.get('[data-cy="asButton"]').click()
        cy.get('[data-cy="asFileInput"]').selectFile("cypress/fixtures/audiotest.wav")
        cy.get('[data-cy="asButton"]').click()
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
        cy.wait(1000)
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

    // test BPM grid

    it("Creates slices", () => {
        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        cy.get('[data-cy="sWaveform"]').as("sWaveform")
        cy.get("@sWaveform").matchImageSnapshot("slice1")

        cy.get("@browser").realMouseMove(50, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(387, 20)
        cy.get("@browser").realClick()
        cy.get("@sWaveform").matchImageSnapshot("slice2")

        cy.get("@browser").click("bottom")
        cy.get("@browser").realMouseMove(450, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(812, 20)
        cy.get("@browser").realClick()
        cy.get("@sWaveform").matchImageSnapshot("slice3")

        cy.get("@browser").realMouseMove(765, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(12, 20)
        cy.get("@browser").realClick()
        cy.get("@sWaveform").matchImageSnapshot("slice4")

        // try additional slices with zoomed in & out values
    })

    it("Focuses slice with the browser", () => {
        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(150, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(300, 20)
        cy.get("@browser").realClick()

        cy.get("@browser").realMouseMove(450, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()

        cy.get("@browser").realMouseMove(220, 20)
        cy.get("@browser").realClick({x: 220, y:20})
        cy.get('[data-cy="sList"]').children().first().should("satisfy", (el: JQuery<HTMLElement>) => el.attr("class").includes("highlightedSlice"))
        cy.get('[data-cy="sList"]').children().last().should("not.satisfy", (el: JQuery<HTMLElement>) => el.attr("class").includes("highlightedSlice"))
        
    })

    it("Changes slice", () => {
        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        
        // drag left
        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").realMouseDown({x:500, y:20})
        cy.get("@browser").realMouseMove(420, 20)
        cy.get("@browser").realMouseUp({x:420, y:20})
        cy.get('[data-cy="sWaveform"]').matchImageSnapshot("slice_drag_left")
        // drag right
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realMouseDown({x:600, y:20})
        cy.get("@browser").realMouseMove(578, 20)
        cy.get("@browser").realMouseUp({x:578, y:20})
        cy.get('[data-cy="sWaveform"]').matchImageSnapshot("slice_drag_right")
        //move slice
        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").realMouseDown({x:500, y:20})
        cy.get("@browser").realMouseMove(750, 20)
        cy.get("@browser").realMouseUp({x:750, y:20})
        cy.get('[data-cy="sWaveform"]').matchImageSnapshot("slice_moved")
    })
})