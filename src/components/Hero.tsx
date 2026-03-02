import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImage from "@/assets/logo-ezbiz-final.webp";

export default function Hero() {
  return (
    <section className="relative bg-background text-foreground">
      <div className="container mx-auto px-6 py-20 text-center max-w-4xl">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="bg-white rounded-md overflow-hidden">
            <img
              src={logoImage}
              alt="EZ BIZ File Service Logo"
              className="h-28 md:h-36 object-contain"
            />
          </div>
        </motion.div>

        {/* Veteran Badge */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="inline-block bg-muted text-foreground text-xs font-semibold px-4 py-2 rounded-full tracking-wide">
            🇺🇸 Veteran-Owned Texas Business
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          Start Your Texas LLC The Right Way.
        </motion.h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Transparent pricing. No hidden fees. Real support when you need it.
        </p>

        {/* Pricing Line */}
        <p className="text-sm text-muted-foreground mb-10">
          Service packages start at <span className="font-semibold">$99</span> + Texas state filing fee.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link
            to="/order-flow"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Start My LLC
          </Link>
          <Link
            to="/pricing"
            className="border border-border px-8 py-4 rounded-lg font-semibold hover:bg-muted transition"
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
      <div className="bg-muted py-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold mb-10">
            Two Ways To File
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Self Service */}
            <div className="border border-border rounded-xl p-8 bg-background">
              <h3 className="text-xl font-semibold mb-4">
                Self-Service Filing
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete your filing online in minutes. We review and submit your documents to the state.
              </p>
              <Link
                to="/order-flow"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Start Filing
              </Link>
            </div>

            {/* White Glove */}
            <div className="border border-border rounded-xl p-8 bg-background opacity-80">
              <h3 className="text-xl font-semibold mb-4">
                White Glove (Coming Soon)
              </h3>
              <p className="text-muted-foreground mb-6">
                In-person filing assistance with guided support from start to finish.
              </p>
              <button
                disabled
                className="border border-border px-6 py-3 rounded-lg font-semibold opacity-60 cursor-not-allowed"
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
