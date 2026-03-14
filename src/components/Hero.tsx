import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag, Zap, Globe, MessageCircle, BookOpen } from "lucide-react";
import { trackClick } from "@/hooks/useAnalytics";
import { trackHeroPath, trackCorpNetClick, trackConsultationClickHero, trackLearnClick } from "@/lib/analytics";
import logoImage from "@/assets/logo-ezbiz-final.webp";

const CORPNET_AFFILIATE_LINK = "https://www.corpnet.com/?pid=16443";

export default function Hero() {
  const navigate = useNavigate();

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
          Start Your Business the Right Way
        </motion.h1>

        {/* Subtext */}
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Veteran-owned business formation guidance. File instantly through our
          partner or get expert help launching your company.
        </p>

        {/* Veteran Eligibility */}
        <div className="mt-6 flex justify-center items-center gap-2 text-sm font-medium text-foreground">
          <Flag className="w-4 h-4 text-primary" />
          <span>
            Texas Veterans may qualify for filing fee waivers &amp; franchise tax exemptions.
          </span>
        </div>

        {/* Direct State Links */}
        <div className="mt-4 text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
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

        {/* 3-PATH ACTION ROUTER */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
        >
          {/* FILE INSTANTLY (CorpNet) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative group"
          >
            <span className="absolute inset-0 rounded-lg bg-secondary/50 blur-xl animate-pulse" />
            <button
              onClick={() => {
                trackHeroPath("file_instantly");
                trackCorpNetClick();
                trackClick("File Instantly", "hero_file_instantly", CORPNET_AFFILIATE_LINK);
              }}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-secondary via-secondary-light to-secondary px-10 py-5 font-bold text-lg rounded-lg shadow-hero text-secondary-foreground overflow-hidden transition-all duration-300 hover:shadow-elegant cursor-pointer"
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              <Zap className="w-5 h-5 fill-current animate-bounce" style={{ animationDuration: '1.5s' }} />
              File Instantly
              <Globe className="w-5 h-5" />
            </button>
          </motion.div>

          {/* TALK TO AN EXPERT */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              onClick={() => {
                trackHeroPath("talk_expert");
                trackConsultationClickHero();
                trackClick("Talk to an Expert", "hero_talk_expert", "/consultation");
              }}
              className="inline-flex items-center gap-2 border border-primary bg-primary text-primary-foreground px-8 py-4 font-semibold rounded-lg hover:bg-primary-light transition cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to an Expert
            </button>
          </motion.div>

          {/* LEARN FIRST */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              onClick={() => {
                trackHeroPath("learn_first");
                trackLearnClick();
                trackClick("Learn First", "hero_learn_first", "/business-guide");
              }}
              className="inline-flex items-center gap-2 border border-border px-8 py-4 font-semibold rounded-lg hover:bg-muted transition cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              Learn First
            </button>
          </motion.div>
        </motion.div>

        {/* CorpNet disclosure */}
        <p className="mt-4 text-[10px] text-muted-foreground/60 max-w-md mx-auto leading-snug">
          "File Instantly" redirects to CorpNet, our trusted filing partner.
          EZ BIZ File Service, LLC may earn a referral commission at no additional cost to you.
        </p>
      </div>
    </section>
  );
}
