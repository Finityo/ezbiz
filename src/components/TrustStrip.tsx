export default function TrustStrip() {
  return (
    <section className="w-full border-y border-border bg-muted/40">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {/* Disabled Veteran Owned */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">🇺🇸</div>
          <div className="font-semibold">Disabled Veteran Owned</div>
          <p className="text-sm text-muted-foreground">
            Founded by a U.S. Marine veteran helping entrepreneurs file with confidence.
          </p>
        </div>

        {/* Transparent Pricing */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">💲</div>
          <div className="font-semibold">Transparent Pricing</div>
          <p className="text-sm text-muted-foreground">
            See package pricing and add-ons before you check out — no hidden surprises.
          </p>
        </div>

        {/* Guided Filing Support */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">💬</div>
          <div className="font-semibold">Guided Filing Support</div>
          <p className="text-sm text-muted-foreground">
            Step-by-step help preparing your formation documents from start to finish.
          </p>
        </div>

        {/* Secure Checkout */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">🔒</div>
          <div className="font-semibold">Secure Checkout</div>
          <p className="text-sm text-muted-foreground">
            Payments processed securely through Stripe with compliance-focused support.
          </p>
        </div>
      </div>
    </section>
  );
}
