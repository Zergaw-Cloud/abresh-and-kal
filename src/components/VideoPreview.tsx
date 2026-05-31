import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Play } from 'lucide-react';

export default function VideoPreview({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();
  const videoId = config.youtubeVideoId;
  const [isInViewport, setIsInViewport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [videoId]);

  if (!config.sections?.videoPreview || !videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <section id="video-preview" className={`py-20 ${bgClass || 'bg-brand-cream-dark'} border-t border-b border-[#E5E2D9] relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="space-y-4 mb-12">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in">
            {config.sectionConfigs?.videopreview?.title?.[language] || t('videoPreview.label', 'Our Love Story Captured')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary font-light tracking-wide leading-tight">
            {config.sectionConfigs?.videopreview?.subtitle?.[language] || t('videoPreview.title', 'Pre-Wedding Moments')}
          </h2>
          <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto opacity-80" />
        </div>

        <div 
          ref={containerRef}
          className="relative group mx-auto max-w-3xl rounded-3xl overflow-hidden shadow-2xl bg-[#111] border-4 border-brand-cream ring-1 ring-brand-gold/15 transition-all duration-700 hover:scale-[1.01]"
        >
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-brand-gold/40 z-30 pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-brand-gold/40 z-30 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-brand-gold/40 z-30 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-brand-gold/40 z-30 pointer-events-none" />

          <div className="aspect-video w-full relative">
            {isInViewport ? (
              <iframe
                id="youtube-preview-player"
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                title="Pre-wedding Cinematic Video Preview"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div 
                style={{ backgroundImage: `url(${thumbnailUrl})` }}
                className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center justify-center filter brightness-90 animate-fade-in"
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                <div className="w-16 h-16 rounded-full bg-brand-primary/95 text-brand-gold hover:bg-brand-accent hover:text-brand-primary flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 z-10 border border-brand-gold/30">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
