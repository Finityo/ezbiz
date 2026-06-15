import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mocks ────────────────────────────────────────────────────────────
const authState: { user: { id: string; email: string } | null } = { user: null };
const adminState: { isAdmin: boolean; loading: boolean } = {
  isAdmin: false,
  loading: false,
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: authState.user, signOut: vi.fn() }),
}));

vi.mock("@/hooks/useAdminAuth", () => ({
  useAdminAuth: () => adminState,
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// PDF generators are heavy + irrelevant here
vi.mock("@/lib/pdf-generators/llc-guide", () => ({ generateLLCGuide: vi.fn() }));
vi.mock("@/lib/pdf-generators/corporation-handbook", () => ({ generateCorporationHandbook: vi.fn() }));
vi.mock("@/lib/pdf-generators/license-checklist", () => ({ generateLicenseChecklist: vi.fn() }));
vi.mock("@/lib/pdf-generators/tax-guide", () => ({ generateTaxGuide: vi.fn() }));

vi.mock("@/lib/analytics", () => ({
  trackPhoneClick: vi.fn(),
  trackEmailClick: vi.fn(),
}));

import Footer from "./Footer";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Footer />
    </MemoryRouter>,
  );

const findAdminLink = () =>
  screen.queryByRole("link", { name: /Admin (Access|Dashboard)/ });

describe("Footer – Admin Access link", () => {
  beforeEach(() => {
    cleanup();
    authState.user = null;
    adminState.isAdmin = false;
    adminState.loading = false;
  });

  it("logged-out: shows 'Admin Access' → /admin/login", () => {
    renderAt("/");
    const link = findAdminLink();
    expect(link).toBeTruthy();
    expect(link!.textContent).toBe("Admin Access");
    expect(link!.getAttribute("href")).toBe("/admin/login");
  });

  it("authenticated admin: shows 'Admin Dashboard' → /admin", () => {
    authState.user = { id: "u1", email: "christian@ezbiz-fs.com" };
    adminState.isAdmin = true;
    renderAt("/");
    const link = findAdminLink();
    expect(link).toBeTruthy();
    expect(link!.textContent).toBe("Admin Dashboard");
    expect(link!.getAttribute("href")).toBe("/admin");
  });

  it("authenticated non-admin client: hides the admin link entirely", () => {
    authState.user = { id: "u2", email: "client@example.com" };
    adminState.isAdmin = false;
    renderAt("/");
    expect(findAdminLink()).toBeNull();
  });

  it("hides the link while admin role check is still loading", () => {
    authState.user = { id: "u3", email: "staff@ezbiz-fs.com" };
    adminState.isAdmin = false;
    adminState.loading = true;
    renderAt("/");
    expect(findAdminLink()).toBeNull();
  });

  it("highlights with aria-current=page when on any /admin route (admin)", () => {
    authState.user = { id: "u1", email: "christian@ezbiz-fs.com" };
    adminState.isAdmin = true;
    renderAt("/admin/test-handoff-email");
    const link = findAdminLink();
    expect(link).toBeTruthy();
    expect(link!.getAttribute("aria-current")).toBe("page");
    expect(link!.className).toMatch(/text-primary/);
    expect(link!.className).toMatch(/font-semibold/);
  });

  it("highlights with aria-current=page on /admin/login (logged-out)", () => {
    renderAt("/admin/login");
    const link = findAdminLink();
    expect(link).toBeTruthy();
    expect(link!.getAttribute("aria-current")).toBe("page");
  });

  it("does not mark as current on non-admin routes", () => {
    renderAt("/about");
    const link = findAdminLink();
    expect(link).toBeTruthy();
    expect(link!.getAttribute("aria-current")).toBeNull();
  });

  it("renders the admin link as a client-side <a> (react-router Link), not a hard reload", () => {
    renderAt("/");
    const link = findAdminLink();
    // react-router Link still renders an <a>, but with relative href and no target=_blank.
    // We assert it's not a download/external link, which would defeat SPA navigation.
    expect(link!.tagName).toBe("A");
    expect(link!.hasAttribute("download")).toBe(false);
    expect(link!.getAttribute("target")).toBeNull();
    expect(link!.getAttribute("href")?.startsWith("/")).toBe(true);
  });
});
