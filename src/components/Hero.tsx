import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Start Your Texas LLC the Right Way
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Fast. Compliant. Done For You. Veteran-Owned Filing Service.
        </motion.p>

        {/* Veteran Eligibility Section */}
        <div className="mt-6 flex justify-center items-center gap-2 text-sm font-medium text-foreground">
          <Flag className="w-4 h-4 text-primary" />
          <span>
            Texas Veterans may qualify for filing fee waivers &amp; franchise tax exemptions.
          </span>
        </div>

        {/* Direct Government Links */}
        <div className="mt-4 text-sm text-muted-foreground space-x-4">
          <a
            href="https://www.sos.state.tx.us/corp/veterans.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition"
          >
            Texas SOS Veteran Info
          </a>
          <a
            href="https://comptroller.texas.gov/taxes/franchise/veterans/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition"
          >
            Texas Comptroller Veteran Exemption
          </a>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/order-flow"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Order Now
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/pricing"
              className="inline-block border border-border px-8 py-4 font-semibold rounded-lg hover:bg-muted transition"
            >
              View Packages
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}