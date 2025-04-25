// Simple wrapper for Google Analytics
export const analyticsService = {
  // Track a page view
  pageView: (pagePath: string, pageTitle?: string) => {
    if (window.gtag) {
      window.gtag('config', 'G-T2C67MJY20', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  },

  // Track an event
  trackEvent: (eventName: string, eventParams: Record<string, any>) => {
    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  },

  // Track a search
  trackSearch: (searchTerm: string, searchType: 'city' | 'coordinates') => {
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        search_type: searchType
      });
    }
  },

  // Track a button click
  trackButtonClick: (buttonName: string, actionType?: string) => {
    if (window.gtag) {
      window.gtag('event', 'button_click', {
        button_name: buttonName,
        action_type: actionType || 'click'
      });
    }
  }
}; 