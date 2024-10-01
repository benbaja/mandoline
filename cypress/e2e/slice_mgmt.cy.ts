context("Slice management", () => {
    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
        cy.get('[data-cy="asButton"]').click()
        cy.get('[data-cy="asFileInput"]').selectFile("cypress/fixtures/audiotest.wav")
        cy.get('[data-cy="asButton"]').click()
        cy.wait(100)
    })

    it("Adds slices to the list", () => {
        cy.get('[data-cy="sPlayPause"]').should("be.disabled")
        cy.get('[data-cy="sLoop"]').should("be.disabled")
        cy.get('[data-cy="sReverse"]').should("be.disabled")
        cy.get('[data-cy="sDeleteAll"]').should("be.disabled")
        cy.get('[data-cy="sDownloadAll"]').should("be.disabled")

        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()

        cy.get('[data-cy="sPlayPause"]').should("be.enabled")
        cy.get('[data-cy="sLoop"]').should("be.enabled")
        cy.get('[data-cy="sReverse"]').should("be.enabled")
        cy.get('[data-cy="sDeleteAll"]').should("be.disabled")
        cy.get('[data-cy="sDownloadAll"]').should("be.disabled")

        cy.get('[data-cy="sList"]').children().should("have.length", 1)
        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sLength"]').should("have.text", "01.000")

        cy.get("@browser").realMouseMove(50, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(387, 20)
        cy.get("@browser").realClick()
        cy.get('[data-cy="sList"]').children().should("have.length", 2)
        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sLength"]').should("have.text", "03.370")

        cy.get('[data-cy="sDeleteAll"]').should("be.enabled")
        cy.get('[data-cy="sDownloadAll"]').should("be.enabled")
    })

    it("Focuses slice from list", () => {
        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").click("bottom")
        cy.get("@browser").realMouseMove(450, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(812, 20)
        cy.get("@browser").realClick()

        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sLength"]').click()
        cy.get('[data-cy="sList"]').children().first().should("satisfy", (el: JQuery<HTMLElement>) => el.attr("class").includes("highlightedSlice"))
        cy.get('[data-cy="sList"]').children().last().should("not.satisfy", (el: JQuery<HTMLElement>) => el.attr("class").includes("highlightedSlice"))
        cy.get("@browser").matchImageSnapshot("browser_focus1")

        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sLength"]').click()
        cy.get('[data-cy="sList"]').children().last().should("satisfy", (el: JQuery<HTMLElement>) => el.attr("class").includes("highlightedSlice"))
        cy.get('[data-cy="sList"]').children().first().should("not.satisfy", (el: JQuery<HTMLElement>) => el.attr("class").includes("highlightedSlice"))
        cy.get("@browser").matchImageSnapshot("browser_focus2")
    })

    it("Deletes slices", () => {
        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").realMouseMove(68, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(202, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").click("bottom")
        cy.get("@browser").realMouseMove(450, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(812, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").realMouseMove(24, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(108, 20)
        cy.get("@browser").realClick()

        cy.get('[data-cy="sList"] > div').eq(0).find('[data-cy="sDelete"]').click()
        cy.get('[data-cy="sList"]').children().should("have.length", 3)

        cy.get('[data-cy="sList"] > div').eq(2).find('[data-cy="sDelete"]').click()
        cy.get('[data-cy="sList"]').children().should("have.length", 2)
        cy.get('[data-cy="sPlayPause"]').should("be.disabled")
        cy.get('[data-cy="sLoop"]').should("be.disabled")
        cy.get('[data-cy="sReverse"]').should("be.disabled")

        cy.get('[data-cy="sDeleteAll"]').click()
        cy.get('[data-cy="sList"]').children().should("have.length", 0)
        cy.get('[data-cy="sDeleteAll"]').should("be.disabled")
        cy.get('[data-cy="sDownloadAll"]').should("be.disabled")
        cy.get('[data-cy="sWaveform"]').matchImageSnapshot("empty_wave")
    })

    it("Plays slice", () => {
        cy.get('[data-cy="browser"]').as("browser")
        cy.get('[data-cy="sPlayPause"]').as("playPause")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()

        cy.get("@playPause").should("have.text", "Play")
        cy.wait(100)
        cy.get("@playPause").click()
        cy.get("@playPause").should("have.text", "Pause")
        cy.get("@playPause").click()
        cy.wait(1000)
        cy.get("@playPause").should("have.text", "Play")
    })

    it("Loops slice", () => {
        cy.get('[data-cy="browser"]').as("browser")
        cy.get('[data-cy="sLoop"]').as("loop")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").realMouseMove(68, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(202, 20)
        cy.get("@browser").realClick()

        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sLength"]').click()
        cy.get("@loop").should("have.text", "Loop")
        cy.get("@loop").click()
        cy.get("@loop").should("have.text", "Looped")
        cy.get('[data-cy="sPlayPause"]').click()
        cy.wait(1500)
        cy.get('[data-cy="sPlayPause"]').should("have.text", "Pause")
        // check audio if possible !

        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sLength"]').click()
        cy.get("@loop").should("have.text", "Loop")
        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sLength"]').click()
        cy.get("@loop").should("have.text", "Looped")

        cy.get("@loop").click()
        cy.get("@loop").should("have.text", "Loop")
        cy.get('[data-cy="sPlayPause"]').click()
        cy.wait(1500)
        cy.get('[data-cy="sPlayPause"]').should("have.text", "Play")
    })

    it("Reverses slice", () => {
        cy.get('[data-cy="browser"]').as("browser")
        cy.get('[data-cy="sReverse"]').as("reverse")

        cy.get("@browser").realMouseMove(500, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").realMouseMove(68, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(202, 20)
        cy.get("@browser").realClick()

        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sLength"]').click()
        cy.get("@reverse").should("have.text", "<=")
        cy.get("@reverse").click()
        cy.get("@reverse").should("have.text", "=>")
        cy.get('[data-cy="sWaveform"]').matchImageSnapshot("slice1_rev")

        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sLength"]').click()
        cy.get("@reverse").should("have.text", "<=")

        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sLength"]').click()
        cy.get("@reverse").should("have.text", "=>")
        cy.get("@reverse").click()
        cy.get("@reverse").should("have.text", "<=")
        cy.get('[data-cy="sWaveform"]').matchImageSnapshot("slice1")

    })

    it("Downloads slices", () => {
        const downloadsFolder = Cypress.config("downloadsFolder")
        cy.get('[data-cy="browser"]').as("browser")

        cy.get("@browser").realMouseMove(100, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(600, 20)
        cy.get("@browser").realClick()
        cy.get("@browser").realMouseMove(608, 20)
        cy.get("@browser").dblclick()
        cy.get("@browser").realMouseMove(896, 20)
        cy.get("@browser").realClick()

        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sNameInput"]').clear()
        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sNameInput"]').type("aA1")
        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sNameInput"]').clear()
        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sNameInput"]').type("bB2")

        cy.get('[data-cy="sList"]').children().first().find('[data-cy="sDownload"]').click()
        cy.readFile(`${downloadsFolder}/aA1.wav`)
        cy.get('[data-cy="sList"]').children().last().find('[data-cy="sDownload"]').click()
        cy.readFile(`${downloadsFolder}/bB2.wav`)

        cy.get('[data-cy="sDownloadAll"]').click()
        cy.readFile(`${downloadsFolder}/slices.zip`)
        // check file size/integrity ?
    })
})