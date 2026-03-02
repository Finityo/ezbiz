import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import logoImage from "@/assets/logo-ezbiz-final.webp";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        {/* ENLARGED HERO LOGO */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="bg-white rounded-md overflow-hidden">
            <img
              src={logoImage}
              alt="EZ BIZ File Service Logo"
              className="w-64 md:w-80 object-contain"
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          Start Your Texas LLC the Right Way
        </motion.h1>

        {/* Subtext */}
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Fast. Compliant. Done For You. Veteran-Owned Filing Service.
        </p>

        {/* Veteran Eligibility */}
        <div className="mt-6 flex justify-center items-center gap-2 text-sm font-medium text-foreground">
          <Flag className="w-4 h-4 text-primary" />
          <span>
            Texas Veterans may qualify for filing fee waivers &amp; franchise tax exemptions.
          </span>
        </div>

        {/* Direct State Links */}
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          <Link
            to="/order-flow"
            className="bg-primary text-primary-foreground px-8 py-4 font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Order Now
          </Link>
          <Link
            to="/pricing"
            className="border border-border px-8 py-4 font-semibold rounded-lg hover:bg-muted transition"
          >
            View Packages
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
