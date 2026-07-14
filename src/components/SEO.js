import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reusable SEO Component to dynamically manage page-level metadata.
 * Directly integrates with document and meta elements for lightweight,
 * dependency-free React client-side SEO management.
 */
const SEO = ({ title, description, keywords }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    if (title) {
      document.title = title;
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", title);

      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute("content", title);
    }

    // 2. Update Page Description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute("content", description);

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute("content", description);

      const twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute("content", description);
    }

    // 3. Update Keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute("content", keywords);
    }

    // 4. Update Canonical and Social URLs based on route
    const currentUrl = `https://legitempirerealestate.com${location.pathname}`;

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute("href", currentUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", currentUrl);

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute("content", currentUrl);

  }, [title, description, keywords, location]);

  return null; // Purely logical component, returns no visual UI elements
};

export default SEO;
