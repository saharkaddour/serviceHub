import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  it("persists JSON values", async () => {
    window.localStorage.setItem("k", JSON.stringify("hello"));
    const { result } = renderHook(() => useLocalStorage("k", "fallback"));
    await waitFor(() => expect(result.current[0]).toBe("hello"));
  });
});
