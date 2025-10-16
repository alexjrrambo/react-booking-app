import { renderWithTheme } from "@test/renderWithTheme";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./index";

describe("Component: Modal", () => {
  it("should render title, subtitle and children when open", () => {
    renderWithTheme(
      <Modal
        open
        onClose={() => {}}
        title="Test Title"
        subtitle="Subtitle"
      >
        <p>Child content</p>
      </Modal>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("should call onClose when clicking outside the dialog", () => {
    const onClose = vi.fn();

    renderWithTheme(
      <Modal open onClose={onClose}>
        <p>Inside</p>
      </Modal>,
    );

    const backdrop = document.querySelector(".MuiBackdrop-root") as HTMLElement;
    expect(backdrop).not.toBeNull();

    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
