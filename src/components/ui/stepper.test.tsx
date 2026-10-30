import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stepper } from "./stepper";

describe("Stepper", () => {
  it("announces the current step", () => {
    render(<Stepper current={2} />);
    expect(screen.getByLabelText("Step 2 of 4")).toBeInTheDocument();
  });
});
