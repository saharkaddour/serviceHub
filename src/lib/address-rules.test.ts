import { describe, expect, it } from "vitest";
import {
  isDuplicateAddress,
  nextDefaultId,
  withSingleDefault,
} from "./address-rules";

const home = { id: "1", street: "24 Maple", city: "Austin", zip: "78701", isDefault: true };
const work = { id: "2", street: "1 Congress", city: "Austin", zip: "78701", isDefault: false };

describe("address rules", () => {
  it("detects duplicates on street + city + zip", () => {
    expect(
      isDuplicateAddress([home], {
        street: "24 maple",
        city: "Austin",
        zip: "78701",
      }),
    ).toBe(true);
  });

  it("makes the first address the default", () => {
    const saved = withSingleDefault([], {
      street: "24 Maple",
      city: "Austin",
      zip: "78701",
      isDefault: false,
    });
    expect(saved.isDefault).toBe(true);
  });

  it("promotes the next address when the default is deleted", () => {
    expect(nextDefaultId([work], "1")).toBe("2");
  });
});
