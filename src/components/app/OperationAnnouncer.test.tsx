import { render, screen } from "@testing-library/react";
import OperationAnnouncer from "./OperationAnnouncer";

describe("OperationAnnouncer", () => {
  it("AC-SH-1: renders a polite status region with the message", () => {
    render(<OperationAnnouncer message="Inserted 5" />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region).toHaveTextContent("Inserted 5");
  });

  it("AC-SH-1: updates the text when the message changes, in the same element", () => {
    const { rerender } = render(<OperationAnnouncer message="Counting" />);
    const region = screen.getByRole("status");
    rerender(<OperationAnnouncer message="Placing" />);
    expect(screen.getByRole("status")).toBe(region);
    expect(region).toHaveTextContent("Placing");
    expect(region).not.toHaveTextContent("Counting");
  });

  it("AC-SH-1: is visually hidden", () => {
    render(<OperationAnnouncer message="x" />);
    expect(screen.getByRole("status")).toHaveClass("sr-only");
  });
});
