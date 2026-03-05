const CORPNET_AFFILIATE_LINK = "https://www.corpnet.com/?pid=16443";

export default function HowItWorks() {
  return (
    <section className="w-full py-16 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          Start Your Business in 3 Simple Steps
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Whether you're launching an LLC or corporation, our process helps
          you start quickly while avoiding common mistakes.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Step 1 */}
          <div className="p-6 border border-border rounded-xl">
            <div className="text-4xl mb-4">1️⃣</div>
            <h3 className="font-semibold text-lg mb-2">
              Choose Your Business Structure
            </h3>
            <p className="text-sm text-muted-foreground">
              Decide whether an LLC, S-Corp, or C-Corp best fits your goals.
              If you're unsure, schedule a consultation for guidance.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 border border-border rounded-xl">
            <div className="text-4xl mb-4">2️⃣</div>
            <h3 className="font-semibold text-lg mb-2">
              File Your Formation Documents
            </h3>
            <p className="text-sm text-muted-foreground">
              Submit your business formation documents quickly through our
              trusted partner filing system.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 border border-border rounded-xl">
            <div className="text-4xl mb-4">3️⃣</div>
            <h3 className="font-semibold text-lg mb-2">
              Launch Your Business
            </h3>
            <p className="text-sm text-muted-foreground">
              Once approved by the state, your business is officially formed
              and ready to operate.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() =>
              window.open(CORPNET_AFFILIATE_LINK, "_blank", "noopener,noreferrer")
            }
            className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Start Your Business Now
          </button>
        </div>
      </div>
    </section>
  );
}
