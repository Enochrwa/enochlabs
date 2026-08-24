import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useDocumentTitle(title: string, description?: string) {
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title.includes("EnochLabs") ? title : `${title} — EnochLabs`;

    let descriptionTag: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;

    if (description) {
      descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        previousDescription = descriptionTag.getAttribute("content");
        descriptionTag.setAttribute("content", description);
      }
    }

    // Keep the canonical link in sync with the current route so each page
    // points at itself instead of only ever pointing at the site root.
    const canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonicalTag?.getAttribute("href") ?? null;
    if (canonicalTag) {
      canonicalTag.setAttribute("href", `${window.location.origin}${location.pathname}`);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== null) {
        descriptionTag.setAttribute("content", previousDescription);
      }
      if (canonicalTag && previousCanonical !== null) {
        canonicalTag.setAttribute("href", previousCanonical);
      }
    };
  }, [title, description, location.pathname]);
}
