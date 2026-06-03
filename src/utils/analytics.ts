declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Send a custom event to Google Analytics (GA4) if initialized.
 * @param action Event name/action (e.g., 'play_music', 'submit_rsvp')
 * @param category Event category (e.g., 'interaction', 'conversion')
 * @param label Optional description label (e.g., 'Amharic', 'Accepted')
 * @param value Optional numeric value associated with the event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      non_interaction: false,
    });
    console.log(`[GA Event] Tracked: ${action} (${category}) -> ${label || ''}`);
  }
}
