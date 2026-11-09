import { useEffect } from 'react';

/**
 * Custom hook to update page title, meta description, canonical link,
 * Open Graph tags, and robots directive dynamically for client-side routing.
 */
export function useSEO({
  title,
  description,
  canonical,
  noindex = false,
  ogType = 'website',
  ogImage
} = {}) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title;
    }

    // 2. Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 3. Canonical Link
    const targetCanonical = canonical || (window.location.origin + window.location.pathname.replace(/\/+$/, '') || '/');
    let linkCanonical = document.querySelector('link[rel="canonical"]');

    if (noindex) {
      // Remove canonical on 404/noindex pages to prevent Soft 404 or false cross-canonicalization
      if (linkCanonical) {
        linkCanonical.remove();
      }
    } else {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', targetCanonical);
    }

    // 4. Robots Meta Directive
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    if (noindex) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      metaRobots.setAttribute(
        'content',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
    }

    // 5. Open Graph & Twitter Cards
    if (title) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', title);
    }
    if (description) {
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);
    }
    if (!noindex) {
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', targetCanonical);
    }
    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', ogImage);
    }

    // Cleanup on unmount if needed
    return () => {
      // Clean up noindex if navigated away
      if (noindex && metaRobots) {
        metaRobots.setAttribute(
          'content',
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        );
      }
    };
  }, [title, description, canonical, noindex, ogType, ogImage]);
}

export default useSEO;
