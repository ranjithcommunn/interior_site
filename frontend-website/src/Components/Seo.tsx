import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Vibrer";
const SITE_URL = "https://vibrer.co.in";
const DEFAULT_TITLE = "Vibrer | Premium Custom Furniture for Home & Office";
const DEFAULT_DESCRIPTION =
  "Vibrer by SREGA Electronics & Furniture LLP offers premium, customisable furniture for living rooms, dining, bedrooms, office, storage, study and outdoor spaces. Design and order your dream furniture online.";
const DEFAULT_KEYWORDS =
  "Vibrer, custom furniture, premium furniture India, living room furniture, dining furniture, bedroom furniture, office furniture, storage furniture, study room furniture, outdoor furniture, mattress, furniture customisation, Bengaluru furniture, SREGA Electronics and Furniture";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  path = "/",
  type = "website",
  noindex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
export { SITE_NAME, SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS };
