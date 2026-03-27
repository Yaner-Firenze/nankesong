import { describe, expect, it } from "vitest";

describe("getEnv", () => {
  it("throws when required environment variables are missing", async () => {
    const { getEnv } = await import("@/lib/env");

    expect(() => getEnv()).toThrow();
  });
});
