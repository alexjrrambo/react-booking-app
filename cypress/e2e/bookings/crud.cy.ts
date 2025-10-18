describe("Bookings – CRUD", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should open the create modal, validate fields, and create a new booking", () => {
    cy.get("[data-testid=\"create-booking-button\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("exist");
    cy.get("[data-testid=\"booking-form\"]").should("exist");

    cy.get("[data-testid=\"booking-guest-name\"]").clear().type("Al");
    cy.get("[data-testid=\"booking-save\"]").click();
    cy.contains("Guest name must have at least 3 characters.").should("exist");

    cy.get("[data-testid=\"booking-guest-name\"]").clear().type("Alice Johnson");

    cy.get("[data-testid=\"booking-property-select\"]").click();
    cy.contains("li", "Beach House").click();

    cy.get("[data-testid=\"booking-save\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("exist");
    cy.contains("Select your check-in and check-out dates").should("exist");

    cy.get("[data-testid=\"booking-form\"]").find("input[readonly]").first().click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");

    cy.get("[data-testid=\"date-picker-modal\"]").find("button.rdp-button_next").click();

    cy.get("[data-testid=\"date-picker-modal\"]").within(() => {
      cy.get("[data-day=\"2025-12-01\"]").find("button").click();
      cy.get("[data-day=\"2025-12-03\"]").find("button").click();
    });

    cy.get("[data-testid=\"booking-save\"]").click();

    cy.get("[data-testid=\"booking-modal\"]").should("not.exist");
    cy.get("[data-testid=\"booking-card\"]").should("have.length", 6);
    cy.get("[data-testid=\"booking-card\"]").last().as("lastCard");
    cy.get("@lastCard").should("contain.text", "Alice Johnson");
    cy.get("@lastCard").should("contain.text", "Beach House");
  });

  it("should edit the first booking and persist the new guest name", () => {
    cy.get("[data-testid=\"booking-card\"]").first().as("firstCard");
    cy.get("@firstCard").within(() => {
      cy.get("[data-testid=\"edit-booking-button\"]").click();
    });

    cy.get("[data-testid=\"booking-modal\"]").should("exist");
    cy.get("[data-testid=\"booking-form\"]").should("exist");

    cy.get("[data-testid=\"booking-guest-name\"]").clear().type("Alex J. Rambo");
    cy.get("[data-testid=\"booking-save\"]").click();

    cy.get("[data-testid=\"booking-modal\"]").should("not.exist");
    cy.get("@firstCard").should("contain.text", "Alex J. Rambo");
  });

  it("should not allow overlapping dates for the selected property (disabled days visible)", () => {
    cy.get("[data-testid=\"create-booking-button\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("exist");
    cy.get("[data-testid=\"booking-form\"]").should("exist");

    cy.get("[data-testid=\"booking-guest-name\"]").clear().type("Overlap Test");
    cy.get("[data-testid=\"booking-property-select\"]").click();
    cy.contains("li", "Mountain Cabin").click();

    cy.get("[data-testid=\"booking-form\"]").find("input[readonly]").first().click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");

    cy.get("[data-day=\"2025-11-03\"]").find("button").should("be.disabled");
    cy.get("[data-day=\"2025-11-04\"]").find("button").should("be.disabled");

    cy.get("[data-testid=\"date-picker-close\"]").click();
    cy.get("[data-testid=\"booking-cancel\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("not.exist");
  });

  it("should delete the first booking from the list", () => {
    cy.get("[data-testid=\"booking-card\"]").its("length").then((initialCount) => {
      cy.get("[data-testid=\"delete-booking\"]").first().click();
      cy.get("[data-testid=\"booking-card\"]").should("have.length", initialCount - 1);
    });
  });

  it("should not create when user cancels the create modal", () => {
    cy.get("[data-testid=\"booking-card\"]").its("length").then((initial) => {
      cy.get("[data-testid=\"create-booking-button\"]").click();
      cy.get("[data-testid=\"booking-modal\"]").should("exist");
      cy.get("[data-testid=\"booking-cancel\"]").click();
      cy.get("[data-testid=\"booking-modal\"]").should("not.exist");
      cy.get("[data-testid=\"booking-card\"]").should("have.length", initial);
    });
  });

  it("should validate property as required", () => {
    cy.get("[data-testid=\"create-booking-button\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("exist");

    cy.get("[data-testid=\"booking-guest-name\"]").clear().type("No Property");
    cy.get("[data-testid=\"booking-save\"]").click();

    cy.contains("Property is required.").should("exist");
    cy.get("[data-testid=\"booking-modal\"]").should("exist");
  });

  it("should reset form after a successful creation", () => {
    cy.get("[data-testid=\"create-booking-button\"]").click();
    cy.get("[data-testid=\"booking-guest-name\"]").clear().type("Reset Check");
    cy.get("[data-testid=\"booking-property-select\"]").click();
    cy.contains("li", "Beach House").click();

    cy.get("[data-testid=\"booking-form\"]").find("input[readonly]").first().click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");
    cy.get("[data-testid=\"date-picker-modal\"]").find("button.rdp-button_next").click();
    cy.get("[data-testid=\"date-picker-modal\"]").within(() => {
      cy.get("[data-day=\"2025-12-05\"]").find("button").click();
      cy.get("[data-day=\"2025-12-07\"]").find("button").click();
    });
    cy.get("[data-testid=\"booking-save\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("not.exist");

    cy.get("[data-testid=\"create-booking-button\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("exist");
    cy.get("[data-testid=\"booking-guest-name\"]").should("have.value", "");
    cy.get("[data-testid=\"booking-modal\"]").within(() => {
      cy.contains("Select your check-in and check-out dates").should("exist");
    });
    cy.get("[data-testid=\"booking-cancel\"]").click();
  });

  it("should be able to change property and dates to a valid non-overlapping range", () => {
    cy.get("[data-testid=\"booking-card\"]").first().within(() => {
      cy.get("[data-testid=\"edit-booking-button\"]").click();
    });

    cy.get("[data-testid=\"booking-modal\"]").should("exist");

    cy.get("[data-testid=\"booking-property-select\"]").click();
    cy.contains("li", "Mountain Cabin").click();

    cy.get("[data-testid=\"booking-form\"]").find("input[readonly]").first().click();
    cy.get("[data-testid=\"date-picker-modal\"]").should("exist");
    cy.get("[data-testid=\"date-picker-modal\"]").find("button.rdp-button_next").click();
    cy.get("[data-testid=\"date-picker-modal\"]").within(() => {
      cy.get("[data-day=\"2025-12-10\"]").find("button").should("be.visible").click();
      cy.get("[data-day=\"2025-12-10\"]").find("button").should("be.visible").click();
      cy.get("[data-day=\"2025-12-12\"]").find("button").should("be.visible").click();
    });

    cy.get("[data-testid=\"booking-save\"]").click();
    cy.get("[data-testid=\"booking-modal\"]").should("not.exist");

    cy.contains("[data-testid=\"booking-card\"]", "Alex Junior Rambo")
      .should("contain.text", "Mountain Cabin")
      .and("contain.text", "Dec 10")
      .and("contain.text", "Dec 12, 2025");
  });
});
