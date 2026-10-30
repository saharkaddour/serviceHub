import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordField } from "./password-field";

describe("PasswordField", () => {
  it("toggles visibility", async () => {
    const user = userEvent.setup();
    render(
      <PasswordField label="Password *" value="secret" onChange={() => undefined} />,
    );
    expect(screen.getByLabelText("Password *")).toHaveAttribute("type", "password");
    await user.click(screen.getByText("Show password"));
    expect(screen.getByLabelText("Password *")).toHaveAttribute("type", "text");
  });
});
