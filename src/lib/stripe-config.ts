// Stripe product & price mappings
// All prices are one-time payments in USD

export const STRIPE_PACKAGES = {
  basic: {
    name: "Basic",
    price: 99,
    priceId: "price_1T0yVSIUysiSR1zwnXStH3WG",
    productId: "prod_TywOyXPTc9OxXn",
  },
  standard: {
    name: "Deluxe",
    price: 219,
    priceId: "price_1T0yVtIUysiSR1zwWe4ZNHvO",
    productId: "prod_TywOsLtrL7UU0D",
  },
  premium: {
    name: "Complete",
    price: 269,
    priceId: "price_1T0yW9IUysiSR1zwOI1uP20X",
    productId: "prod_TywOhEut1bAa6V",
  },
} as const;

export const STRIPE_ADDONS = {
  ein: {
    name: "Federal Tax ID (EIN)",
    price: 49,
    priceId: "price_1T0yWgIUysiSR1zwlqpnLd2h",
    productId: "prod_TywPCPQuBK0S1O",
  },
  "operating-agreement": {
    name: "Custom Operating Agreement",
    price: 99,
    priceId: "price_1T0yWvIUysiSR1zwFNao42mw",
    productId: "prod_TywPcIb6jgZPYA",
  },
  "s-corp-election": {
    name: "S-Corp Tax Election",
    price: 99,
    priceId: "price_1T0yYLIUysiSR1zwkctIi3Th",
    productId: "prod_TywRfPm2jgg2kM",
  },
  "business-license": {
    name: "Business License Research",
    price: 99,
    priceId: "price_1T0yXDIUysiSR1zw2G2KrhuH",
    productId: "prod_TywQZXnYU1Wofv",
  },
  "boi-reporting": {
    name: "FinCEN BOI Reporting",
    price: 99,
    priceId: "price_1T0yYZIUysiSR1zwAw4foab9",
    productId: "prod_TywR9n3paZq1VU",
  },
  "annual-report": {
    name: "Annual Report Filing (1 Year)",
    price: 149,
    priceId: "price_1T0yYkIUysiSR1zwlUldoxHO",
    productId: "prod_TywREDRvn416yT",
  },
  "corporate-kit": {
    name: "Corporate Kit & Seal",
    price: 59,
    priceId: "price_1T0yZ2IUysiSR1zwtEi8Qrsm",
    productId: "prod_TywRZKix11QCq9",
  },
  dba: {
    name: "DBA / Fictitious Name Filing",
    price: 99,
    priceId: "price_1T0yZCIUysiSR1zwkEsz4X9W",
    productId: "prod_TywS1XiMkAOyZE",
  },
  "registered-agent": {
    name: "Registered Agent Service",
    price: 149,
    priceId: "price_1T0yX4IUysiSR1zwwhfXa8XH",
    productId: "prod_TywP9XXMQrxczQ",
  },
  "compliance-alert": {
    name: "Compliance Alert",
    price: 79,
    priceId: "price_1T0yXMIUysiSR1zwV7ZYaYLh",
    productId: "prod_TywQmcxtBL8C31",
  },
  "consultation": {
    name: "Remote Business Consultation (2 Hours)",
    price: 150,
    priceId: "price_1T5zeAIUysiSR1zwCSTRJkb3",
    productId: "prod_U47tLDsQ2QFYO9",
  },
  "extra-consultation-hour": {
    name: "Extra Consultation Hour",
    price: 80,
    priceId: "price_1T5AqJIUysiSR1zwKPl6BGCU",
    productId: "prod_U3HP3yRkMhFyT1",
  },
  "white-glove": {
    name: "White Glove Mobile Filing (2 Hours)",
    price: 150,
    priceId: "price_1T5w3IIUysiSR1zwJyfILYm7",
    productId: "prod_U44BmuaUvPQn9V",
  },
} as const;

export type PackageId = keyof typeof STRIPE_PACKAGES;
export type AddonId = keyof typeof STRIPE_ADDONS;
