import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-foreground text-background">
      <div className="container mx-auto px-6 py-24 text-center max-w-4xl">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-block bg-background text-foreground text-xs font-semibold px-4 py-2 rounded-full tracking-wide">
            🇺🇸 Veteran-Owned Texas Business
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Start Your Texas LLC The Right Way.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Transparent pricing. No hidden fees. Real support when you need it.
        </p>

        {/* Pricing Line */}
        <p className="text-sm text-muted-foreground mb-10">
          Service packages start at <span className="font-semibold text-background">$99</span> + Texas state filing fee.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link
            to="/order-flow"
            className="bg-background text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-muted transition"
          >
            Start My LLC
          </Link>
          <Link
            to="/pricing"
            className="border border-background px-8 py-4 rounded-lg font-semibold hover:bg-background hover:text-foreground transition"
          >
            See Pricing & What's Included
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div>✔ Secure Checkout</div>
          <div>✔ State Filing Included</div>
          <div>✔ Admin Dashboard Tracking</div>
          <div>✔ No Subscription Required</div>
        </div>
      </div>

      {/* Filing Options Section */}
      <div className="bg-muted/10 py-16 px-6 border-t border-muted/20">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold mb-10">
            Two Ways To File
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Self Service */}
            <div className="border border-muted/30 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4">
                Self-Service Filing
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete your filing online in minutes. We review and submit your documents to the state.
              </p>
              <Link
                to="/order-flow"
                className="inline-block bg-background text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition"
              >
                Start Filing
              </Link>
            </div>

            {/* White Glove */}
            <div className="border border-muted/30 rounded-xl p-8 opacity-80">
              <h3 className="text-xl font-semibold mb-4">
                White Glove (Coming Soon)
              </h3>
              <p className="text-muted-foreground mb-6">
                In-person filing assistance with guided support from start to finish.
              </p>
              <button
                disabled
                className="border border-background px-6 py-3 rounded-lg font-semibold cursor-not-allowed opacity-60"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
