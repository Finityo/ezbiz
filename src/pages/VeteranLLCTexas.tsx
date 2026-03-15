import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";

const VETERAN_FAQS = [
  {
    question: "Who qualifies for Texas veteran-owned business benefits?",
    answer: "Businesses formed in Texas on or after January 1, 2022 that are 100% owned by one or more honorably discharged U.S. veterans qualify for filing fee relief and franchise tax exemption for up to five years."
  },
  {
    question: "What documents do I need for the Texas veteran LLC exemption?",
    answer: "You need a Texas Veterans Commission Verification Letter for each owner and Comptroller Certification Form 05-904, submitted along with your Certificate of Formation."
  },
  {
    question: "How long does the Texas veteran franchise tax exemption last?",
    answer: "Qualifying veteran-owned businesses are exempt from Texas franchise tax for up to five years from the date of formation."
  },
  {
    question: "How do I get a Texas Veteran Verification Letter?",
    answer: "Request your Veteran Verification Letter (VVL) through the Texas Veterans Commission at tvc.texas.gov. Each owner of the business must obtain their own letter."
  }
];

export default function VeteranLLCTexas() {
  const navigate = useNavigate();

  useEffect(() => {
    // No longer needed - SEOHead handles this
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ServiceJsonLd
        serviceName="Texas Veteran-Owned LLC Formation"
        description="Professional LLC formation services for Texas veterans. Qualify for filing fee relief and franchise tax exemption for up to five years."
        url="/veteran-llc-texas"
        priceRange="$$"
      />
      <FaqJsonLd faqs={VETERAN_FAQS} />
      <Navigation />
      <div className="px-6 py-16 max-w-5xl mx-auto flex-1">
      {/* Hero */}
      <section className="text-center mb-20">
        <div className="text-4xl mb-4">🇺🇸 Veterans 🇺🇸</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Texas Veteran-Owned Business Benefits
        </h1>
        <p className="max-w-2xl mx-auto mb-6 text-lg">
          If your Texas business is 100% owned by honorably discharged U.S.
          veterans and formed on or after January 1, 2022, you may qualify
          for relief from certain filing fees and Texas franchise tax for up
          to five years.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/order-flow")}
            className="px-6 py-3 bg-success text-success-foreground rounded-lg font-semibold"
          >
            Check My Eligibility
          </button>
          <button
            onClick={() => navigate("/order-flow")}
            className="px-6 py-3 border rounded-lg font-semibold"
          >
            Start My Texas LLC
          </button>
        </div>
      </section>

      {/* Qualification Requirements */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Who Qualifies?
        </h2>
        <ul className="space-y-4 max-w-3xl mx-auto">
          {[
            "Entity must be formed in Texas on or after January 1, 2022",
            "Must be 100% owned by one or more honorably discharged U.S. veterans",
            "Each owner must obtain a Texas Veterans Commission Verification Letter",
            "Must submit Comptroller Form 05-904 (Certification of New Veteran-Owned Business)"
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-success font-bold">✔</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Required Steps */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">
          How the Process Works
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {[
            {
              step: "1",
              title: "Obtain Veteran Verification Letter",
              description:
                "Request a Verification Letter from the Texas Veterans Commission for each owner."
            },
            {
              step: "2",
              title: "Complete Comptroller Certification",
              description:
                "Fill out Comptroller Certification Form 05-904."
            },
            {
              step: "3",
              title: "Submit Certificate of Formation",
              description:
                "Submit your Certificate of Formation along with required documents."
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="font-bold text-success text-xl">
                {item.step}
              </div>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm opacity-80">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Resources */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Official State Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-3">
              Texas Veteran Verification Letter (VVL)
            </h3>
            <p className="mb-4 text-sm opacity-80">
              Request your official Veteran Verification Letter required
              for processing documents.
            </p>
            <a
              href="https://tvc.texas.gov/entrepreneurs/veteran-verification-letter/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 border rounded-lg font-semibold"
            >
              Visit Texas Veterans Commission →
            </a>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-3">
              Texas Veteran Franchise Tax Exemption
            </h3>
            <p className="mb-4 text-sm opacity-80">
              Review eligibility requirements and franchise tax exemption details.
            </p>
            <a
              href="https://comptroller.texas.gov/taxes/franchise/veteran-business.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 border rounded-lg font-semibold"
            >
              Visit Texas Comptroller →
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Start Your Texas LLC?
        </h2>
        <button
          onClick={() => navigate("/order-flow")}
          className="px-8 py-3 bg-success text-success-foreground rounded-lg font-semibold"
        >
          Get Started Today
        </button>
      </section>
      </div>
      <FloatingCTA />
      <BackToTop />
      <Footer />
    </div>
  );
}
