import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mocks ─────────────────────────────────────────────────────────────
const trackClickMock = vi.fn();
vi.mock("@/hooks/useAnalytics", () => ({
  trackClick: (...args: unknown[]) => trackClickMock(...args),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, signOut: vi.fn() }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// PDF generators are heavy + irrelevant to nav tests
vi.mock("@/lib/pdf-generators/llc-guide", () => ({ generateLLCGuide: vi.fn() }));
vi.mock("@/lib/pdf-generators/corporation-handbook", () => ({ generateCorporationHandbook: vi.fn() }));
vi.mock("@/lib/pdf-generators/license-checklist", () => ({ generateLicenseChecklist: vi.fn() }));
vi.mock("@/lib/pdf-generators/tax-guide", () => ({ generateTaxGuide: vi.fn() }));

import Navigation from "./Navigation";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation />
    </MemoryRouter>,
  );

const openMobileMenu = () => {
  // The mobile menu toggle is the only icon button with no accessible name
  // adjacent to nav; query by lucide icon class isn't stable, so click the
  // last button in the nav header (the hamburger).
  const buttons = screen.getAllByRole("button");
  // First lg:hidden Menu toggle: find the button containing an svg with lucide-menu class
  const toggle = buttons.find((b) => b.querySelector("svg.lucide-menu, svg.lucide-x"));
  expect(toggle, "hamburger toggle should be present").toBeTruthy();
  fireEvent.click(toggle!);
};

describe("Navigation – mobile hamburger conversion paths", () => {
  beforeEach(() => trackClickMock.mockReset());

  it("opens the mobile menu and shows Pricing + White Glove Support", () => {
    renderAt("/");
    openMobileMenu();

    const pricing = screen.getAllByRole("link", { name: "Pricing" });
    const whiteGlove = screen.getByRole("link", { name: "White Glove Support" });

    // At least one mobile Pricing link
    expect(pricing.length).toBeGreaterThan(0);
    expect(pricing.some((l) => l.getAttribute("href") === "/pricing")).toBe(true);
    expect(whiteGlove.getAttribute("href")).toBe("/order-flow?mode=whiteglove");
  });

  it("fires mobile_nav_pricing tracking on Pricing click", () => {
    renderAt("/");
    openMobileMenu();
    // Mobile Pricing link is the one carrying the font-semibold mobile class
    const pricing = screen
      .getAllByRole("link", { name: "Pricing" })
      .find((l) => l.getAttribute("href") === "/pricing" && l.className.includes("font-semibold"))!;
    fireEvent.click(pricing);
    expect(trackClickMock).toHaveBeenCalledWith(
      "Pricing",
      "mobile_nav_pricing",
      "/pricing",
    );
  });

  it("fires mobile_nav_whiteglove tracking on White Glove click", () => {
    renderAt("/");
    openMobileMenu();
    fireEvent.click(screen.getByRole("link", { name: "White Glove Support" }));
    expect(trackClickMock).toHaveBeenCalledWith(
      "White Glove Support",
      "mobile_nav_whiteglove",
      "/order-flow?mode=whiteglove",
    );
  });

  it("marks mobile Pricing as aria-current=page on /pricing", () => {
    renderAt("/pricing");
    openMobileMenu();
    const pricing = screen
      .getAllByRole("link", { name: "Pricing" })
      .find((l) => l.getAttribute("href") === "/pricing")!;
    expect(pricing.getAttribute("aria-current")).toBe("page");
  });

  it("marks mobile White Glove as aria-current=page on /order-flow?mode=whiteglove", () => {
    renderAt("/order-flow?mode=whiteglove");
    openMobileMenu();
    const wg = screen.getByRole("link", { name: "White Glove Support" });
    expect(wg.getAttribute("aria-current")).toBe("page");
  });
});

describe("Navigation – desktop Pricing active state", () => {
  it("does not mark desktop Pricing as current on /", () => {
    renderAt("/");
    const links = screen
      .getAllByRole("link", { name: "Pricing" })
      .filter((l) => l.getAttribute("href") === "/pricing");
    expect(links.some((l) => l.getAttribute("aria-current") === "page")).toBe(false);
  });

  it("marks desktop Pricing as aria-current=page on /pricing", () => {
    renderAt("/pricing");
    const links = screen
      .getAllByRole("link", { name: "Pricing" })
      .filter((l) => l.getAttribute("href") === "/pricing");
    expect(links.some((l) => l.getAttribute("aria-current") === "page")).toBe(true);
  });
});
