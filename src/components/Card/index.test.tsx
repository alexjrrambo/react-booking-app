import { renderWithTheme } from "@test/renderWithTheme";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./index";

describe("Component: Card", () => {
  it("should render its children", () => {
    renderWithTheme(
      <Card>
        <span data-testid="child">Hello</span>
      </Card>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeVisible();
  });
});
