import { renderWithTheme } from "@test/renderWithTheme";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./index";

describe("Component: DatePicker", () => {
  it("should render with label and helper text", () => {
    renderWithTheme(<DatePicker label="When?" helperText="Select your dates" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Select your dates")).toBeInTheDocument();
  });

  it("should open modal when clicking on text field", () => {
    renderWithTheme(<DatePicker label="When?" />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input);
    expect(screen.getByText("Select booking dates")).toBeInTheDocument();
  });

  it("should call onChange(undefined) when clicking Clear dates", () => {
    const handleChange = vi.fn();
    renderWithTheme(<DatePicker label="When?" onChange={handleChange} />);

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Clear dates"));

    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it("should respect disabled prop", () => {
    renderWithTheme(<DatePicker label="When?" disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
});
