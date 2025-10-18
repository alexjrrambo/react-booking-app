describe("Bookings – list", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows seeded items with labels", () => {
    cy.get("[data-testid=\"booking-card\"]").should("have.length", 5);
    cy.get("[data-testid=\"booking-card\"]").first().as("firstCard");

    cy.get("@firstCard").should("contain.text", "Dates");
    cy.get("@firstCard").should("contain.text", "Alex Junior Rambo");
    cy.get("@firstCard").should("contain.text", "Beach House");
  });

  it("shows empty state when no results match", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();

    cy.get("[data-testid=\"property-menu\"]").should("be.visible");

    cy.contains("li", "Mountain Cabin").click();
    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-10-13\"]").find("button").click();
    cy.get("[data-day=\"2025-10-17\"]").find("button").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 0);
    cy.contains("No bookings found").should("exist");
    cy.contains("Try adjusting the filters or create a new booking.").should("exist");
    cy.get("[data-testid=\"create-booking-button\"]").should("exist");
  });
});
