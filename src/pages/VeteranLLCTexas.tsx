export default function VeteranPage() {
  return (
    <section style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>🇺🇸</span>
        <h2 style={{ fontSize: 28, fontWeight: "bold", margin: "10px 0" }}>
          Veteran-Owned Business Benefits
        </h2>
        <span style={{ fontSize: 28 }}>🇺🇸</span>
      </div>
      <p style={{ maxWidth: 700, margin: "0 auto 40px auto", lineHeight: 1.6 }}>
        If you are a qualified Texas Veteran, you may be eligible for
        franchise tax exemptions and filing benefits.
        EZ Biz handles your formation filing.
        The resources below are official state pages for independent verification.
      </p>
      <div style={{ marginBottom: 40 }}>
        <button
          style={{
            padding: "14px 28px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            transition: "0.2s ease"
          }}
        >
          ✓ You May Be Eligible
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, maxWidth: 800, margin: "0 auto" }}>
        <div style={{ border: "1px solid #e5e5e5", padding: 24, borderRadius: 14 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
            Texas Veteran Verification Letter (VVL)
          </h3>
          <p style={{ marginBottom: 16 }}>
            Request your official Veteran Verification Letter required when
            processing formation documents with the Secretary of State.
          </p>
          <a
            href="https://tvc.texas.gov/entrepreneurs/veteran-verification-letter/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              border: "1px solid #ccc",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Visit Texas Veterans Commission →
          </a>
        </div>
        <div style={{ border: "1px solid #e5e5e5", padding: 24, borderRadius: 14 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
            Texas Veteran Franchise Tax Exemption
          </h3>
          <p style={{ marginBottom: 16 }}>
            Review eligibility requirements and franchise tax exemption
            details directly from the Texas Comptroller.
          </p>
          <a
            href="https://comptroller.texas.gov/taxes/franchise/veteran-business.php"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              border: "1px solid #ccc",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Visit Texas Comptroller →
          </a>
        </div>
      </div>
    </section>
  );
}
