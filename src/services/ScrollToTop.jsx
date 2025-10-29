import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // 1. SCROLL TO HASH/ID
    if (hash) {
      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        // Use a smooth scroll behavior for a better user experience
        targetElement.scrollIntoView({ behavior: 'smooth' });
        return; // Stop here if we found a hash to scroll to
      }
    }

    // 2. SCROLL TO TOP ON PAGE CHANGE
    // 'key' is a unique identifier that changes for *every* navigation, 
    // even just a hash change. We only want to scroll to top 
    // if the actual 'pathname' (page) has changed.
    // However, for pure page changes (e.g., / to /checkout), 'pathname' is enough.
    // Resetting scroll to top *unless* there's a hash.
    if (!hash) {
      window.scrollTo(0, 0);
    }
    
  }, [pathname, hash, key]); // Re-run effect whenever location changes

  // This component renders nothing, it's purely for side effects (scroll management)
  return null;
}

export default ScrollToTop;