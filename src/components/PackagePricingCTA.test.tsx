import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PackagePricingCTA from "./PackagePricingCTA";
import { PACKAGE_PRICES } from "@/lib/pricing";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("PackagePricingCTA", () => {
  it("renders one card per canonical package with a deep-link to /order-flow?package=<id>", () => {
    renderWithRouter(<PackagePricingCTA />);

    for (const pkg of ["basic", "deluxe", "complete"] as const) {
      const link = document.querySelector<HTMLAnchorElement>(
        `a[data-package="${pkg}"]`,
      );
      expect(link, `link for ${pkg} should render`).not.toBeNull();
      expect(link!.getAttribute("href")).toBe(`/order-flow?package=${pkg}`);
      // Visible CTA text matches the canonical package name
      expect(link!.textContent).toContain(PACKAGE_PRICES[pkg].name);
    }
  });

  it("appends optional state and entity params when provided", () => {
    renderWithRouter(<PackagePricingCTA stateCode="TX" entityType="llc" />);

    const link = document.querySelector<HTMLAnchorElement>(
      'a[data-package="deluxe"]',
    );
    expect(link).not.toBeNull();
    const href = link!.getAttribute("href")!;
    expect(href).toContain("package=deluxe");
    expect(href).toContain("state=TX");
    expect(href).toContain("entity=llc");
    expect(href.startsWith("/order-flow?")).toBe(true);
  });

  it("never falls back to /pricing on package CTAs", () => {
    renderWithRouter(<PackagePricingCTA />);
    const packageLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[data-package]"),
    );
    expect(packageLinks).toHaveLength(3);
    for (const a of packageLinks) {
      expect(a.getAttribute("href")).not.toBe("/pricing");
      expect(a.getAttribute("href")).toMatch(/^\/order-flow\?/);
    }
  });

  it("shows the highlighted package badge", () => {
    renderWithRouter(<PackagePricingCTA highlightPackage="complete" />);
    expect(screen.getByText(/most popular/i)).toBeInTheDocument();
  });
});
