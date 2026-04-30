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

  describe.each(["basic", "deluxe", "complete"] as const)(
    "highlightPackage=%s",
    (highlight) => {
      it(`renders the MOST POPULAR badge exactly once, attached to the ${highlight} card`, () => {
        renderWithRouter(<PackagePricingCTA highlightPackage={highlight} />);

        // Badge text appears exactly once
        const badges = screen.getAllByText(/most popular/i);
        expect(badges).toHaveLength(1);
        const badge = badges[0];

        // Badge has the secondary-accent styling
        expect(badge.className).toMatch(/bg-secondary/);
        expect(badge.className).toMatch(/text-secondary-foreground/);

        // Badge lives inside the card whose CTA links to the highlighted package
        const card = badge.closest("div.relative");
        expect(card, "highlighted card should have relative wrapper").not.toBeNull();
        const ctaLink = within(card as HTMLElement).getByRole("link");
        expect(ctaLink.getAttribute("data-package")).toBe(highlight);
        expect(ctaLink.getAttribute("href")).toBe(
          `/order-flow?package=${highlight}`,
        );

        // Highlighted card carries the accent border + shadow classes
        expect((card as HTMLElement).className).toMatch(/border-secondary/);
        expect((card as HTMLElement).className).toMatch(/border-2/);
        expect((card as HTMLElement).className).toMatch(/shadow-xl/);

        // The highlighted CTA uses the filled "default" button variant
        // (non-highlighted cards use the "outline" variant which has border classes)
        expect(ctaLink.className).not.toMatch(/\bborder-input\b/);
      });

      it(`renders the other two cards as non-highlighted when highlightPackage=${highlight}`, () => {
        renderWithRouter(<PackagePricingCTA highlightPackage={highlight} />);
        const others = (["basic", "deluxe", "complete"] as const).filter(
          (p) => p !== highlight,
        );
        for (const pkg of others) {
          const link = document.querySelector<HTMLAnchorElement>(
            `a[data-package="${pkg}"]`,
          );
          expect(link).not.toBeNull();
          // Non-highlighted card wrapper should NOT have the accent border
          // Walk up to find the Card root (it has border-border/60)
          const card = link!.closest('[class*="border-border"]');
          expect(card, `${pkg} card should be non-highlighted`).not.toBeNull();
          expect((card as HTMLElement).className).not.toMatch(/border-secondary/);
          expect((card as HTMLElement).className).not.toMatch(/shadow-xl/);
        }
      });
    },
  );
});
