import React, { useState } from 'react';
import { Heart, GlassWater, Utensils, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { getOptimizedImageProps } from '../imageUtils';

export default function Timeline({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { language, config, t } = useLanguage();
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});

  const nextSlide = (eventId: string, maxImages: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) + 1) % maxImages
    }));
  };

  const prevSlide = (eventId: string, maxImages: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Heart':
        return <Heart className="w-4 h-4 text-brand-accent stroke-[2]" />;
      case 'Wine':
        return <GlassWater className="w-4 h-4 text-brand-accent stroke-[2]" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-brand-accent stroke-[2]" />;
      case 'Music':
        return <Music className="w-4 h-4 text-brand-accent stroke-[2]" />;
      default:
        return <Heart className="w-4 h-4 text-brand-accent" />;
    }
  };

  const events = config.translations?.timeline?.events || [];

  return (
    <section id="timeline" className={`py-24 ${bgClass || 'bg-brand-cream'} linen-texture border-t border-[#E5E2D9]`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in">
            {config.sectionConfigs?.timeline?.title?.[language] || t('timeline.label', 'The Wedding Day')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary font-light tracking-wide leading-tight">
            {config.sectionConfigs?.timeline?.subtitle?.[language] || t('timeline.title', 'Schedule of Events')}
          </h2>
          <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto opacity-80" />
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[1px] bg-[#E5E2D9] -translate-x-1/2" />

          <div className="space-y-16">
            {events.map((event: any, index: number) => {
              const activeSlide = carouselIndices[event.id] || 0;
              const isEven = index % 2 === 0;
              const eventImages = config.timelineImages?.[event.id] || [];
              const hasImages = eventImages.length > 0;
              const eventTime = event.time?.[language] || '';
              const eventTitle = event.title?.[language] || '';
              const eventDesc = event.description?.[language] || '';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-stretch gap-8 md:gap-0 ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, backgroundColor: "var(--color-brand-cream-dark)" }}
                    className="absolute left-4 md:left-1/2 w-10 h-10 rounded-full bg-white border-2 border-brand-accent flex items-center justify-center -translate-x-1/2 z-10 shadow-md cursor-help transition-colors"
                  >
                    {renderIcon(event.iconName)}
                  </motion.div>

                  {/* Left Side (Descriptive Info) */}
                  <div className={`pl-16 md:pl-0 md:w-1/2 flex flex-col justify-center ${
                    !hasImages 
                      ? 'md:text-center md:items-center w-full text-left' 
                      : isEven ? 'md:pr-16 text-left md:text-right md:items-end' : 'md:pl-16 text-left md:items-start'
                  }`}>
                    <span className="font-sans text-xs uppercase tracking-widest text-brand-accent font-bold mb-1">
                      {eventTime}
                    </span>
                    <h3 className="font-serif text-2xl text-brand-primary mb-3">
                      {eventTitle}
                    </h3>
                    <p className={`font-body text-sm text-brand-primary/80 leading-relaxed max-w-md ${
                      !hasImages ? 'mx-auto text-left md:text-center' : ''
                    }`}>
                      {eventDesc}
                    </p>
                  </div>

                  {/* Right Side (Active dynamic Carousel, empty states collapse gracefully to text-only) */}
                  {hasImages ? (
                    <div className="pl-16 md:pl-0 md:w-1/2 flex justify-center items-center">
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px rgba(154, 149, 135, 0.12)" }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-sm rounded-[2rem] overflow-hidden p-3 bg-white shadow-md border border-[#E5E2D9] relative group transition-all"
                      >
                        <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-[#FAF9F6]">
                          {eventImages.map((img: string, imgIndex: number) => {
                            const opt = getOptimizedImageProps(img, 800, 600);
                            return (
                              <div
                                key={img}
                                className={`absolute inset-0 w-full h-full transition-all duration-[900ms] ease-out ${
                                  imgIndex === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                }`}
                              >
                                <img
                                  src={opt.src}
                                  srcSet={opt.srcSet}
                                  sizes="(max-width: 640px) 100vw, 400px"
                                  width={opt.width}
                                  height={opt.height}
                                  alt={eventTitle}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            );
                          })}

                          {eventImages.length > 1 && (
                            <>
                              <button
                                onClick={() => prevSlide(event.id, eventImages.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm cursor-pointer z-20"
                                aria-label="Previous Slide"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => nextSlide(event.id, eventImages.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm cursor-pointer z-20"
                                aria-label="Next Slide"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {eventImages.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                              {eventImages.map((_: string, imgIdx: number) => (
                                <span
                                  key={imgIdx}
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    imgIdx === activeSlide ? 'bg-brand-primary scale-110 w-3' : 'bg-brand-primary/40'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-1/2" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
