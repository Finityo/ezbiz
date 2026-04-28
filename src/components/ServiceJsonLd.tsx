import { SITE_URL, siteUrl } from "@/lib/site";

interface ServiceJsonLdProps {
  serviceName: string;
  description: string;
  url: string;
  priceRange?: string;
}

const ServiceJsonLd = ({ serviceName, description, url, priceRange = "$$" }: ServiceJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "url": siteUrl(url),
    "provider": {
      "@type": "ProfessionalService",
      "name": "EZ BIZ FILE SERVICE",
      "url": SITE_URL,
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States",
    },
    "priceRange": priceRange,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ServiceJsonLd;
