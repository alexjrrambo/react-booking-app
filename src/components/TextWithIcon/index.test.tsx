import { renderWithTheme } from "@test/renderWithTheme";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextWithIcon } from "./index";

const TestIcon = () => <svg data-testid="icon" aria-hidden="true" />;

describe("Component: TextWithIcon", () => {
  it("should render the provided text", () => {
    renderWithTheme(<TextWithIcon>All dates</TextWithIcon>);

    expect(screen.getByText("All dates")).toBeInTheDocument();
  });

  it("should render the icon when provided", () => {
    renderWithTheme(<TextWithIcon icon={<TestIcon />}>All dates</TextWithIcon>);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should not render an icon when none is provided", () => {
    renderWithTheme(<TextWithIcon>No icon</TextWithIcon>);

    expect(screen.queryByTestId("icon")).toBeNull();
  });
});
