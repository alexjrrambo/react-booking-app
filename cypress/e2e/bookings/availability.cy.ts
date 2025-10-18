describe("Bookings – availability", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should keep Availability disabled with tooltip when no property is selected", () => {
    cy.get("[data-testid=\"availability-button\"]").should("be.disabled");
    cy.get("[data-testid=\"availability-button\"]").parent().trigger("mouseover");
    cy.get("[role=\"tooltip\"]").should("contain.text", "Select a property first");
  });

  it("should enable Availability after selecting a property and open the modal with correct title", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Beach House").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"availability-button\"]").should("be.enabled").click();

    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");
    cy.contains("Check availability | Beach House").should("exist");
  });

  it("should disable dates before the selected start date (disabledBefore)", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Mountain Cabin").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"availability-button\"]").click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");

    cy.get("[data-day=\"2025-10-21\"]").find("button").should("not.be.disabled").click();
    cy.get("[data-day=\"2025-10-20\"]").find("button").should("be.disabled");
  });

  it("should show existing booked dates as disabled for the selected property", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Mountain Cabin").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"availability-button\"]").click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");
    cy.contains("Check availability | Mountain Cabin").should("exist");

    cy.get("[data-day=\"2025-11-03\"]").find("button").should("be.disabled");
    cy.get("[data-day=\"2025-11-04\"]").find("button").should("be.disabled");
  });

  it("should keep modal open after selecting a full range (enableCreateBooking) and allow closing", () => {
    cy.get("[data-testid=\"filter-property-button\"]").click();
    cy.get("[data-testid=\"property-menu\"]").should("be.visible");
    cy.contains("li", "Mountain Cabin").click();
    cy.get("[data-testid=\"apply-filters\"]").click();

    cy.get("[data-testid=\"availability-button\"]").click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");

    cy.get("[data-day=\"2025-10-21\"]").find("button").click();
    cy.get("[data-day=\"2025-10-24\"]").find("button").click();

    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");
    cy.get("[data-testid=\"date-picker-close\"]").click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("not.exist");
  });
});
