import { afterEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});
const revalidatePathMock = vi.fn();
const requireAdminMock = vi.fn();
const createPassMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: requireAdminMock,
}));

vi.mock("@/lib/passes", () => ({
  createPass: createPassMock,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("createPassAction in admin mode", () => {
  it("redirects admin-created passes to the admin detail page", async () => {
    createPassMock.mockResolvedValue({ id: "pass-123" });

    const { createPassAction } = await import("@/actions/pass-actions");
    const formData = new FormData();
    formData.set("mode", "admin");
    formData.set("type", "individual");
    formData.set("name", "Ada");
    formData.set("contactInfo", "ada@example.com");
    formData.set("identityNumber", "110101199001011234");
    formData.set("projectName", "Issued Pass");
    formData.set("role", "Builder");
    formData.set("projectSummary", "Created by admin");

    await expect(createPassAction(formData)).rejects.toThrow(
      "REDIRECT:/admin/pass/pass-123"
    );

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(createPassMock).toHaveBeenCalledTimes(1);
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/pass/pass-123");
    expect(revalidatePathMock).toHaveBeenCalledWith("/pass/pass-123");
  });

  it("redirects back to the admin form when validation fails", async () => {
    const { createPassAction } = await import("@/actions/pass-actions");
    const formData = new FormData();
    formData.set("mode", "admin");
    formData.set("type", "individual");
    formData.set("name", "Ada");
    formData.set("contactInfo", "ada@example.com");
    formData.set("identityNumber", "123");
    formData.set("projectName", "Issued Pass");
    formData.set("role", "Builder");
    formData.set("projectSummary", "Created by admin");

    await expect(createPassAction(formData)).rejects.toThrow(
      /REDIRECT:\/admin\/new\?(?:error=validation&type=individual|type=individual&error=validation)/
    );

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(createPassMock).not.toHaveBeenCalled();
  });
});
