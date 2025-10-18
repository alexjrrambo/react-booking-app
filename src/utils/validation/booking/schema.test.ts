import { describe, expect, it } from "vitest";
import { bookingSchema } from "./schema";

const makeValidInput = () => ({
  bookingGuestName: "Alice Johnson",
  bookingProperty: "Mountain Cabin",
  bookingDates: {
    from: new Date(2030, 0, 10),
    to: new Date(2030, 0, 12),
  },
});

describe("bookingSchema", () => {
  it("accepts a valid payload", () => {
    const input = makeValidInput();
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects when guest name is too short", () => {
    const input = { ...makeValidInput(), bookingGuestName: "Al" };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.includes("Guest name must have at least 3 characters.")).toBe(true);
  });

  it("rejects when guest name is too long", () => {
    const input = { ...makeValidInput(), bookingGuestName: "A".repeat(51) };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.includes("Guest name must have at most 50 characters.")).toBe(true);
  });

  it("rejects when property is empty", () => {
    const input = { ...makeValidInput(), bookingProperty: "" };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.includes("Property is required.")).toBe(true);
  });

  it("rejects when from date is missing", () => {
    const input = { ...makeValidInput(), bookingDates: { from: undefined as unknown as Date, to: new Date(2030, 0, 12) } };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((i) => i.path.join("."));
    expect(paths.includes("bookingDates.from")).toBe(true);
  });

  it("rejects when to date is missing", () => {
    const input = { ...makeValidInput(), bookingDates: { from: new Date(2030, 0, 10), to: undefined as unknown as Date } };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((i) => i.path.join("."));
    expect(paths.includes("bookingDates.to")).toBe(true);
  });

  it("rejects when from is not a Date instance", () => {
    const input = { ...makeValidInput(), bookingDates: { from: "2030-01-10" as unknown as Date, to: new Date(2030, 0, 12) } };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((i) => i.path.join("."));
    expect(paths.includes("bookingDates.from")).toBe(true);
  });

  it("rejects when to is not a Date instance", () => {
    const input = { ...makeValidInput(), bookingDates: { from: new Date(2030, 0, 10), to: "2030-01-12" as unknown as Date } };
    const result = bookingSchema.safeParse(input);
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((i) => i.path.join("."));
    expect(paths.includes("bookingDates.to")).toBe(true);
  });
});
