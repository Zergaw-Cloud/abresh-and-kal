import { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export default function GoogleAnalytics() {
  const { config, language } = useLanguage();
  const measurementId = config.googleAnalyticsId;

  // 1. Dynamic Script Loading & Config Setup
  useEffect(() => {
    if (!measurementId || measurementId.trim() === '' || measurementId.startsWith('G-XXX')) {
      return;
    }

    // Initialize global dataLayer and gtag function first before appending the script
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_path: window.location.pathname,
      page_title: document.title,
      language: language,
    });

    const scriptId = 'ga-gtag-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    console.log(`[Google Analytics] Configured for Measurement ID: ${measurementId}`);
  }, [measurementId]);

  // 2. Track Page View on Language Change
  useEffect(() => {
    if (!measurementId || measurementId.trim() === '' || measurementId.startsWith('G-XXX') || !window.gtag) {
      return;
    }

    window.gtag('config', measurementId, {
      page_path: window.location.pathname,
      page_title: document.title,
      language: language,
    });
  }, [language, measurementId]);

  // 3. Dynamic Section View Tracking with IntersectionObserver
  useEffect(() => {
    if (!measurementId || measurementId.trim() === '' || measurementId.startsWith('G-XXX')) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.gtag) {
            const sectionId = entry.target.id;
            window.gtag('event', 'section_view', {
              event_category: 'navigation',
              event_label: sectionId,
              section_id: sectionId,
            });
            console.log(`[GA Section View] Visible in viewport: ${sectionId}`);
          }
        });
      },
      { 
        threshold: 0.20 // Trigger when at least 20% of section is visible
      }
    );

    // List of element IDs matching our SPA layout sections
    const sectionIds = [
      'story-intro',
      'calendar',
      'timeline',
      'gallery',
      'location',
      'memories',
      'guestbook',
      'rsvp'
    ];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [measurementId]);

  return null;
}
