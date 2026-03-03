import React from "react";

const VeteranEligibilitySection = () => {
  return (
    <section className="w-full py-16 px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-3xl">🇺🇸</span>
        <h2 className="text-3xl font-bold">
          Veteran-Owned Business Benefits
        </h2>
        <span className="text-3xl">🇺🇸</span>
      </div>
      <p className="max-w-2xl mx-auto text-lg mb-8 opacity-80">
        If you are a qualified Texas Veteran, you may be eligible for
        franchise tax exemptions and filing benefits.
        EZ Biz handles your entity filing. The resources below are
        official state pages for independent veteran verification.
      </p>
      <div className="mb-10">
        <button className="px-8 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition">
          ✓ You May Be Eligible
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">
            Texas Veteran Verification Letter (VVL)
          </h3>
          <p className="mb-4 text-sm opacity-70">
            Request your official Veteran Verification Letter required
            when processing formation documents.
          </p>
          <a
            href="https://tvc.texas.gov/entrepreneurs/veteran-verification-letter/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg border font-semibold hover:bg-gray-100 transition"
          >
            Visit Texas Veterans Commission →
          </a>
        </div>
        <div className="border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">
            Texas Veteran Franchise Tax Exemption
          </h3>
          <p className="mb-4 text-sm opacity-70">
            Review eligibility requirements and franchise tax exemption
            details directly from the Texas Comptroller.
          </p>
          <a
            href="https://comptroller.texas.gov/taxes/franchise/veteran-business.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg border font-semibold hover:bg-gray-100 transition"
          >
            Visit Texas Comptroller →
          </a>
        </div>
      </div>
    </section>
  );
};

export default VeteranEligibilitySection;
