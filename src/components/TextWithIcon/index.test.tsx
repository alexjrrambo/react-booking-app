import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextWithIcon } from "./index";

const TestIcon = () => <svg data-testid="icon" aria-hidden="true" />;

describe("<TextWithIcon />", () => {
  it("should render the provided text", () => {
    render(<TextWithIcon>All dates</TextWithIcon>);

    expect(screen.getByText("All dates")).toBeInTheDocument();
  });

  it("should render the icon when provided", () => {
    render(<TextWithIcon icon={<TestIcon />}>All dates</TextWithIcon>);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should not render an icon when none is provided", () => {
    render(<TextWithIcon>No icon</TextWithIcon>);

    expect(screen.queryByTestId("icon")).toBeNull();
  });
});
