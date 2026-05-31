import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { getOptimizedImageProps } from '../imageUtils';

interface RichMetadata {
  title: Record<string, string>;
  description: Record<string, string>;
  badge: Record<string, string>;
}

export default function Gallery({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lightboxIndex !== null) {
      const el = document.getElementById('lightbox-dialog');
      el?.focus();
    }
  }, [lightboxIndex]);

  // Read images directly from dynamic config
  const galleryImages = config.galleryImages || [];

  // Filtered images list
  const filteredImages = activeTab === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeTab);

  // Background shifting colors to match active slide, creating a luxury atmosphere just like the video
  const bgColors = [
    'rgba(47, 66, 55, 0.05)',   // Soft Slate Sage
    'rgba(197, 160, 89, 0.07)',  // Soft Vintage Gold
    'rgba(154, 149, 135, 0.09)', // Soft Sandy Taupe
    'rgba(74, 108, 89, 0.06)',   // Soft Teal Moss
  ];
  
  const activeBgColor = bgColors[activeIndex % bgColors.length];

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  // Center scroll container on mount to the middle image instead of the first one
  useEffect(() => {
    if (scrollContainerRef.current && filteredImages.length > 0) {
      const middleIdx = Math.floor(filteredImages.length / 2);
      setActiveIndex(middleIdx);
      setTimeout(() => {
        scrollToCard(middleIdx);
      }, 300);
    }
  }, [activeTab, filteredImages.length]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;

    const children = container.children;
    let closestIndex = 0;
    let minDifference = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const difference = Math.abs(childCenter - containerCenter);

      if (difference < minDifference) {
        minDifference = difference;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeIndex && closestIndex >= 0 && closestIndex < filteredImages.length) {
      setActiveIndex(closestIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const children = container.children;
    const child = children[index] as HTMLElement;
    
    if (child) {
      const containerWidth = container.offsetWidth;
      const scrollLeftGoal = child.offsetLeft - (containerWidth - child.offsetWidth) / 2;
      container.scrollTo({
        left: scrollLeftGoal,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    const targetIdx = activeIndex > 0 ? activeIndex - 1 : filteredImages.length - 1;
    scrollToCard(targetIdx);
  };

  const handleNext = () => {
    const targetIdx = activeIndex < filteredImages.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(targetIdx);
  };

  const handleLightboxPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const handleLightboxNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  // Safe checks for empty gallery
  if (galleryImages.length === 0) return null;

  return (
    <section 
      id="gallery" 
      className={`py-24 border-y border-[#E5E2D9] relative select-none overflow-hidden ${bgClass || 'bg-brand-cream'}`}
    >
      {/* Shifting dynamic background tinted overlay to match active slide, keeping alternating background container intact */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 z-0 pointer-events-none"
        style={{ backgroundColor: activeBgColor }}
      />
      
      {/* Background texture overlay */}
      <div className="absolute inset-0 linen-texture opacity-30 pointer-events-none z-0" />

      {/* Rotating thin aesthetic golden ring overlapping behind the active centered card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-brand-accent/15 pointer-events-none animate-[spin_40s_linear_infinite] z-0" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-brand-accent/5 pointer-events-none animate-[spin_20s_linear_infinite] z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Elegant Header and Descriptions */}
        <div className="text-center max-w-2xl mx-auto mb-14 px-6 space-y-4">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in">
            {config.sectionConfigs?.gallery?.title?.[language] || t('gallery.label', 'Our Memory Bank')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary font-light tracking-wide leading-tight">
            {config.sectionConfigs?.gallery?.subtitle?.[language] || t('gallery.title', 'Captured Moments')}
          </h2>
          <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto opacity-80" />
        </div>

        {/* Carousel Outer Wrapper */}
        <div className="relative w-full px-4 overflow-visible">
          
          {/* Main Horizontal Snapping Scrollable Track */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-12 pt-6 px-[10%] sm:px-[25%] md:px-[33%] scrollbar-none snap-x snap-mandatory scroll-smooth relative z-10"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filteredImages.map((img, index) => {
              const isActive = index === activeIndex;
              const cardTitle = img.title?.[language] || img.title?.en || t('gallery.defaultImgTitle', 'Gilded Marriage Path');
              const cardDesc = img.description?.[language] || img.description?.en || t('gallery.defaultImgDesc', 'A beautifully curated snapshot');
              const cardTag = img.badge?.[language] || img.badge?.en || t('gallery.defaultImgTag', 'GALLERY');

              return (
                <div
                  key={img.id}
                  role="button"
                  tabIndex={0}
                  aria-label={cardTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isActive) {
                        setLightboxIndex(index);
                      } else {
                        scrollToCard(index);
                      }
                    }
                  }}
                  onClick={() => {
                    if (isActive) {
                      setLightboxIndex(index);
                    } else {
                      scrollToCard(index);
                    }
                  }}
                  className="snap-center shrink-0 cursor-pointer focus:outline-none transition-all duration-700 select-none pb-4 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 rounded-[2rem]"
                >
                  <div 
                    className={`relative overflow-hidden shadow-2xl bg-brand-cream border border-[#E5E2D9] rounded-[2rem] transition-all duration-500 ${
                      isActive 
                        ? 'translate-y-[-10px] scale-102 border-brand-accent/40 shadow-brand-accent/10' 
                        : 'scale-90 opacity-60 filter blur-[0.6px]'
                    }`}
                    style={{
                      width: 'min(82vw, 360px)',
                      height: 'min(115vw, 470px)'
                    }}
                  >
                    {/* Background Wedding Image */}
                    {(() => {
                      const opt = getOptimizedImageProps(img.url, 800, 1100);
                      return (
                        <img
                          src={opt.src}
                          srcSet={opt.srcSet}
                          sizes="(max-width: 640px) 100vw, 360px"
                          width={opt.width}
                          height={opt.height}
                          alt={cardTitle}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      );
                    })()}

                    {/* Gradient Screen Mask overlay from the video */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-1" />

                    {/* Badge Pill in TOP-LEFT */}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="font-sans text-[9px] uppercase tracking-[0.25em] font-bold bg-white text-brand-primary px-3 py-1.5 rounded-full shadow-md">
                        {cardTag}
                      </span>
                    </div>

                    {/* Content on bottom-left, exact reflection of the video layout */}
                    <div className="absolute bottom-8 inset-x-8 z-10 flex flex-col items-start text-white">
                      <span className="font-sans text-[10px] text-[#FAF9F6]/60 uppercase tracking-[0.25em] font-medium mb-1">
                        {cardDesc}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-5 drop-shadow-md">
                        {cardTitle}
                      </h3>

                      {/* Aesthetic "Read more" / "View image" trigger button exact as in video */}
                      <div className="flex items-center gap-2 group/btn">
                        <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 group-hover/btn:border-brand-accent group-hover/btn:bg-white/10">
                          <ArrowRight className="w-3.5 h-3.5 text-[#Eeae96] transition-transform group-hover/btn:translate-x-0.5" />
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#E5E2D9] group-hover/btn:text-white transition-colors">
                          {t('gallery.expandPhoto', 'Expand Photo')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Arrow Button Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/80 hover:bg-white text-brand-primary shadow-lg border border-[#E5E2D9] hover:border-brand-accent transition-all z-20 cursor-pointer hidden sm:block"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button Controls */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/80 hover:bg-white text-brand-primary shadow-lg border border-[#E5E2D9] hover:border-brand-accent transition-all z-20 cursor-pointer hidden sm:block"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Aesthetic Visual Indicators and Count */}
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="flex gap-2 mb-3">
            {filteredImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === activeIndex ? 'w-6 bg-brand-primary' : 'w-1.5 bg-brand-primary/20 hover:bg-brand-primary/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-brand-primary/50 font-bold block">
            {t('gallery.archiveStatus', 'ARCHIVE • {index} OF {total} MOMENTS')
              .replace('{index}', (activeIndex + 1).toString())
              .replace('{total}', filteredImages.length.toString())}
          </p>
        </div>
      </div>

      {/* Lightbox / Full screen slider Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            id="lightbox-dialog"
            role="dialog"
            aria-modal="true"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setLightboxIndex(null);
              } else if (e.key === 'ArrowLeft') {
                handleLightboxPrev();
              } else if (e.key === 'ArrowRight') {
                handleLightboxNext();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#161a18]/98 backdrop-blur-lg flex flex-col items-center justify-center p-4 select-none focus:outline-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar Inside Overlay */}
            <div className="absolute top-6 inset-x-0 px-6 flex justify-between items-center text-white z-50">
              <span className="font-sans text-xs uppercase tracking-widest font-bold text-[#E5E2D9]">
                {t('gallery.lightboxHeader', 'Full Screen View')} • ({lightboxIndex + 1} / {filteredImages.length})
              </span>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-[#E5E2D9]/10 hover:bg-[#E5E2D9]/20 transition-all border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Lightbox Navigation Left */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxPrev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#E5E2D9]/5 hover:bg-[#E5E2D9]/15 border border-white/5 text-white/80 hover:text-white transition-all z-50 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Navigation Right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#E5E2D9]/5 hover:bg-[#E5E2D9]/15 border border-white/5 text-white/80 hover:text-white transition-all z-50 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Picture canvas */}
            <div 
              className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {(() => {
                  const opt = getOptimizedImageProps(filteredImages[lightboxIndex].url, 1200, 900);
                  return (
                    <motion.img
                      key={filteredImages[lightboxIndex].id}
                      src={opt.src}
                      srcSet={opt.srcSet}
                      sizes="(max-width: 768px) 100vw, 80vw"
                      width={opt.width}
                      height={opt.height}
                      alt="Wedding memory preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl border border-white/10 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Labels under Full View */}
            <div 
              className="mt-6 text-center max-w-lg px-6 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-brand-accent mb-2 block">
                {filteredImages[lightboxIndex].badge?.[language] || filteredImages[lightboxIndex].badge?.en || t('gallery.defaultImgTag', 'GALLERY')}
              </span>
              <p className="font-sans text-xs text-white tracking-widest leading-relaxed mb-1 font-serif text-lg">
                {filteredImages[lightboxIndex].title?.[language] || filteredImages[lightboxIndex].title?.en || t('gallery.defaultImgTitle', 'Gilded Marriage Path')}
              </p>
              <p className="font-sans text-[11px] text-white/60 tracking-wider">
                {filteredImages[lightboxIndex].description?.[language] || filteredImages[lightboxIndex].description?.en || t('gallery.defaultImgDesc', 'A beautifully curated snapshot')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
