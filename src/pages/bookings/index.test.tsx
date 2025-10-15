import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BookingsPage } from "./index";

describe("BookingsPage", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<BookingsPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
