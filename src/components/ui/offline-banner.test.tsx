import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OfflineBanner } from "./offline-banner";

vi.mock("@/hooks/use-online", () => ({
  useOnline: () => ({ online: false, offline: true }),
}));

describe("OfflineBanner", () => {
  it("shows the offline copy", () => {
    render(<OfflineBanner />);
    expect(
      screen.getByText(/You’re offline or the server is unreachable/i),
    ).toBeInTheDocument();
  });
});
