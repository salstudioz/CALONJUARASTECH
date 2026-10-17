"use client";

import { useEffect } from "react";

/**
 * DevOverlayKiller
 * Ensures development indicators, issue badges, and portal overlays
 * are completely eliminated from the DOM, providing a pristine,
 * deployment-ready UI preview in all environments.
 */
export function DevOverlayKiller() {
  useEffect(() => {
    const removeOverlay = () => {
      const selectors = [
        "nextjs-portal",
        "[data-nextjs-dev-overlay]",
        "[data-nextjs-portal]",
        "#nextjs-dev-overlay",
        "next-route-announcer",
      ];

      selectors.forEach((sel) => {
        const elements = document.querySelectorAll(sel);
        elements.forEach((el) => {
          try {
            (el as HTMLElement).style.setProperty("display", "none", "important");
            (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
            (el as HTMLElement).style.setProperty("opacity", "0", "important");
            (el as HTMLElement).style.setProperty("pointer-events", "none", "important");
            el.remove();
          } catch {
            // ignore if already removed
          }
        });
      });
    };

    // Run immediately
    removeOverlay();

    // Observe and intercept any runtime re-injections by Next.js client
    const observer = new MutationObserver(() => {
      removeOverlay();
    });

    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
