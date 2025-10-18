describe("Bookings – filters", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show all bookings by default", () => {
    cy.get("[data-testid=\"booking-card\"]").should("have.length", 5);
  });

  it("should filter by property: Mountain Cabin", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Mountain Cabin").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 2);
    cy.get("[data-testid=\"booking-card\"]").each(($card) => {
      cy.wrap($card).should("contain.text", "Mountain Cabin");
      cy.wrap($card).should("not.contain.text", "Beach House");
    });
  });

  it("should clear property filter back to All properties", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "All properties").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 5);
  });

  it("should filter by date range only", () => {
    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-10-18\"]").find("button").click();
    cy.get("[data-day=\"2025-10-23\"]").find("button").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 2);
    cy.get("[data-testid=\"booking-card\"]").first().should("contain.text", "Mountain Cabin");
    cy.get("[data-testid=\"booking-card\"]").last().should("contain.text", "Beach House");
  });

  it("should clear dates from the date picker", () => {
    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-10-10\"]").find("button").click();
    cy.get("[data-day=\"2025-10-12\"]").find("button").click();

    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-testid=\"date-picker-clear\"]").click();
    cy.get("[data-testid=\"date-picker-close\"]").click();

    cy.get("[data-testid=\"apply-filters\"]").click();
    cy.get("[data-testid=\"booking-card\"]").should("have.length", 5);
  });

  it("should combine property and date range filters", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Mountain Cabin").click();

    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-11-01\"]").find("button").click();
    cy.get("[data-day=\"2025-11-03\"]").find("button").click();

    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 1);
    cy.get("[data-testid=\"booking-card\"]").first().should("contain.text", "Mountain Cabin");
    cy.get("[data-testid=\"booking-card\"]").first().should("not.contain.text", "Beach House");
  });

  it("should not apply dates when closed without confirming", () => {
    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-10-22\"]").find("button").click();
    cy.get("[data-testid=\"date-picker-close\"]").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 5);
  });

  it("should combine property and a non-overlapping date range and return none", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Mountain Cabin").click();

    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-10-13\"]").find("button").click();
    cy.get("[data-day=\"2025-10-17\"]").find("button").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 0);
  });

  it("should keep date filter when changing property", () => {
    cy.get("[data-testid=\"date-filter-button\"]").click();
    cy.get("[data-day=\"2025-10-18\"]").find("button").click();
    cy.get("[data-day=\"2025-10-23\"]").find("button").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Beach House").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"booking-card\"]").should("have.length", 1);
    cy.get("[data-testid=\"booking-card\"]").first().should("contain.text", "Beach House");
  });
});
