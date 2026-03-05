export default function TrustStrip() {
  return (
    <section className="w-full border-y border-border bg-muted/40">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6 text-center">
        {/* Veteran Owned */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">🇺🇸</div>
          <div className="font-semibold">Veteran Owned</div>
          <p className="text-sm text-muted-foreground">
            Founded by a U.S. Marine veteran helping entrepreneurs launch businesses the right way.
          </p>
        </div>

        {/* Fast Formation */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="font-semibold">Fast Business Formation</div>
          <p className="text-sm text-muted-foreground">
            Start your LLC or corporation quickly through our trusted filing partner.
          </p>
        </div>

        {/* Texas Expertise */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">📍</div>
          <div className="font-semibold">Texas Filing Expertise</div>
          <p className="text-sm text-muted-foreground">
            Guidance tailored for Texas entrepreneurs including veteran benefits and exemptions.
          </p>
        </div>

        {/* Guided Support */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">💬</div>
          <div className="font-semibold">Real Guidance Available</div>
          <p className="text-sm text-muted-foreground">
            Schedule a consultation if you want help choosing the right structure.
          </p>
        </div>
      </div>
    </section>
  );
}
