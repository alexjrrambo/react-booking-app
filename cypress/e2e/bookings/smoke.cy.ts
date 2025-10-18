describe("Bookings – smoke", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the page and shows primary UI elements", () => {
    cy.contains("Bookings").should("exist");

    cy.get("[data-testid=\"create-booking-button\"]").should("exist").and("be.enabled");
    cy.get("button").contains("Availability").should("exist");

    cy.get("[data-testid=\"date-filter-button\"]").should("exist");
    cy.get("[data-testid=\"filter-property-button\"]").should("exist");
    cy.get("[data-testid=\"apply-filters\"]").should("exist");

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 5);

    cy.get("[data-testid=\"booking-card\"]").first().as("first");
    cy.get("@first").should("contain.text", "Dates");
    cy.get("@first").should("contain.text", "Alex Junior Rambo");
    cy.get("@first").should("contain.text", "Beach House");
    cy.get("@first").find("[data-testid=\"edit-booking-button\"]").should("exist").and("be.enabled");
    cy.get("@first").find("[data-testid=\"delete-booking\"]").should("exist").and("be.enabled");
  });
});
