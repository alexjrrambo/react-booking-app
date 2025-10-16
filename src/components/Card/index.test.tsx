import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./index";

describe("<Card />", () => {
  it("should render its children", () => {
    render(
      <Card>
        <span data-testid="child">Hello</span>
      </Card>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeVisible();
  });
});
