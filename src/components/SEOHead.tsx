import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.ezbiz-fs.com";
const DEFAULT_TITLE = "EZ BIZ FILE SERVICE - Professional Business Formation";
const DEFAULT_DESCRIPTION =
  "Form your LLC, Corporation, or business entity online. Expert guidance, fast filings, and trusted nationwide service from EZ BIZ FILE SERVICE.";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/Qz9gBE0xxVYuqMA5hDpEauIykus2/social-images/social-1768619319988-IMG_2929.PNG";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | EZ BIZ FILE SERVICE` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const canonical = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
