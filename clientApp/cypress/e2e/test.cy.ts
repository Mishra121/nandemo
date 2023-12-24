describe("My First Test", () => {
	it("Visits the app root url", () => {
		cy.visit("/");
		// cy.contains("ion-content", "Tab 1 page");
		cy.wait(3000);
		cy.get("[data-testid='test-header-nandemo']").should("exist");
	});
});
