/**
 * Build-time guard: scan checkout-critical files for forbidden references
 * to consultation, booking, scheduling, Acuity, or Calendly.
 *
 * Used by the `checkoutPurityPlugin` Vite plugin (vite.config.ts).
 *
 * To intentionally allow a match, add `// checkout-purity-allow` on the same line.
 */
import fs from "node:fs";
import path from "node:path";

// Files/directories that participate in the checkout funnel.
// These MUST NOT link to or render any consultation/booking/scheduling UI.
const CHECKOUT_PATHS = [
  "src/components/order",
  "src/pages/order",
  "src/pages/EnhancedOrderFlow.tsx",
  "src/pages/StartOrder.tsx",
  "src/pages/OrderSuccess.tsx",
  "src/hooks/useStripeCheckout.ts",
  "src/contexts/OrderContext.tsx",
  "src/lib/calculateOrderTotal.ts",
  "supabase/functions/create-checkout/index.ts",
  // High-traffic CTA surfaces that route into checkout
  "src/components/Hero.tsx",
  "src/components/FloatingCTA.tsx",
  "src/components/ChooseYourPath.tsx",
  "src/components/Navigation.tsx",
];

// Forbidden patterns. Each pattern is a regex (case-insensitive).
const FORBIDDEN = [
  { name: "Consultation route", re: /["'`]\/consultation["'`]/ },
  { name: "Acuity domain",       re: /acuityscheduling\.com/i },
  { name: "Acuity schedule.php", re: /schedule\.php/i },
  { name: "Calendly",            re: /calendly\.com/i },
  { name: "Book/booking link",   re: /["'`]\/(book|booking|schedule|appointments?)["'`]/i },
];

const ROOT = process.cwd();

function walk(p) {
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [abs];
  const out = [];
  for (const entry of fs.readdirSync(abs)) {
    out.push(...walk(path.join(p, entry)));
  }
  return out.filter((f) => /\.(t|j)sx?$/.test(f));
}

export function runCheckoutPurityCheck() {
  const violations = [];
  const files = CHECKOUT_PATHS.flatMap(walk);

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes("checkout-purity-allow")) return;
      for (const { name, re } of FORBIDDEN) {
        if (re.test(line)) {
          violations.push({
            file: path.relative(ROOT, file),
            line: i + 1,
            rule: name,
            snippet: line.trim().slice(0, 160),
          });
        }
      }
    });
  }

  if (violations.length) {
    const msg =
      `\n❌ Checkout purity check failed — ${violations.length} forbidden reference(s) in checkout-critical files:\n\n` +
      violations
        .map((v) => `  • ${v.file}:${v.line}  [${v.rule}]\n      ${v.snippet}`)
        .join("\n") +
      `\n\nCheckout must route directly to /order-flow + Stripe. Remove booking/consultation/scheduling links from these files,` +
      ` or add "// checkout-purity-allow" on the line if it is genuinely safe.\n`;
    throw new Error(msg);
  }
}
