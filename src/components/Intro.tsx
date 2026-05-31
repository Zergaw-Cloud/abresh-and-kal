import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Monogram from './Monogram';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { getOptimizedImageProps } from '../imageUtils';

export default function Intro() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [containerParallax, setContainerParallax] = useState({ x: 0, y: 0 });
  const { config, language, t } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateY((x - xc) / 30); // Significantly reduced 3D tilt sensitivity to prevent wild/unstable wobbling
    setRotateX((yc - y) / 30); // Significantly reduced 3D tilt sensitivity to prevent wild/unstable wobbling
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHoveredIndex(null);
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setContainerParallax({ x, y });
  };

  const handleStageMouseLeave = () => {
    setContainerParallax({ x: 0, y: 0 });
    setHoveredIndex(null);
  };

  const images = [
    {
      url: config.introImages?.engagement,
      caption: t('intro.photo1Caption', 'The moment she said yes'),
      title: t('intro.engagementTitle', 'The Engagement')
    },
    {
      url: config.introImages?.adventure,
      caption: t('intro.photo2Caption', 'Laughter in the countryside'),
      title: t('intro.adventureTitle', 'The Adventure')
    }
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null));
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  if (!config.sections?.story) return null;

  // Active foreground focus calculations
  const activeIdx = hoveredIndex !== null ? hoveredIndex : focusedIndex;

  return (
    <section id="story-intro" className="py-24 bg-brand-cream relative overflow-hidden linen-texture">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-brand-accent/15 pointer-events-none select-none">
        <Heart className="w-16 h-16 stroke-1 fill-none text-brand-accent animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary tracking-normal mb-2 pt-4">
            {t('intro.title', 'A Celebration of Love')}
          </h2>
          <div className="h-[1px] w-24 bg-brand-gold/60 mx-auto mt-4" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-body text-lg md:text-xl text-brand-primary leading-relaxed max-w-2xl mx-auto italic"
        >
          {t('intro.quote', '"Once in a while, right in the middle of an ordinary life, love gives us a fairy tale."')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-base md:text-lg text-brand-primary/80 lg:text-center leading-relaxed max-w-2xl mx-auto"
        >
          {t('intro.para1', 'We invite you to join us, our most cherished family and friends, as we exchange vows.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-6"
        >
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(197, 160, 89, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 border border-brand-accent/50 text-brand-accent hover:border-brand-primary hover:text-brand-primary px-8 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-colors duration-300 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>{t('intro.readBtn', 'Read Our Story')}</span>
          </motion.button>
        </motion.div>



        {/* Cinematic Split Reality Parallax Stage */}
        <div 
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="pt-12 pb-16 relative z-20 flex items-center justify-center w-full max-w-4xl mx-auto overflow-visible cursor-default select-none"
        >
          {/* Ambient organic glowing backdrops */}
          <motion.div 
            animate={{
              x: containerParallax.x * 60,
              y: containerParallax.y * 60,
            }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.8 }}
            className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-brand-accent/5 to-brand-gold/5 opacity-55 blur-3xl pointer-events-none z-0"
          />

          {/* Majestic Split Frame Aspect Container */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-h-[560px] rounded-[36px] sm:rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(154,149,135,0.18)] border border-[#E5E2D9] bg-brand-primary/5">
            
            {/* Compute activeSplit dynamically based on hoveredIndex */}
            {(() => {
              const activeSplit = hoveredIndex === 0 
                ? 62 
                : hoveredIndex === 1 
                  ? 38 
                  : 50;

              const leftClipPath = `polygon(0 0, ${activeSplit + 7}% 0, ${activeSplit - 7}% 100%, 0 100%)`;
              const rightClipPath = `polygon(${activeSplit + 7}% 0, 100% 0, 100% 100%, ${activeSplit - 7}% 100%)`;
              const dividerClipPath = `polygon(${activeSplit + 7}% 0, ${activeSplit + 7.4}% 0, ${activeSplit - 6.6}% 100%, ${activeSplit - 7}% 100%)`;

              return (
                <>
                  {/* Left Reality Slot (engagement) */}
                  <div 
                    style={{
                      clipPath: leftClipPath,
                      transition: "clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onMouseEnter={() => setHoveredIndex(0)}
                    onClick={() => handleOpenLightbox(0)}
                    className="absolute inset-0 z-10 cursor-zoom-in group"
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      {/* Interactive visual glare response */}
                      <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      
                      {(() => {
                        const opt = getOptimizedImageProps(images[0].url || '', 800, 1000);
                        return (
                          <motion.img
                            src={opt.src}
                            srcSet={opt.srcSet}
                            sizes="(max-width: 640px) 100vw, 50vw"
                            width={opt.width}
                            height={opt.height}
                            alt={images[0].caption}
                            animate={{
                              scale: hoveredIndex === 0 ? 1.05 : 1,
                              x: containerParallax.x * -18,
                              y: containerParallax.y * -18,
                              filter: hoveredIndex === 1 ? "brightness(0.55) blur(1.5px) grayscale(0.15)" : "brightness(1) blur(0px)"
                            }}
                            transition={{ type: "tween", ease: "easeOut", duration: 0.6 }}
                            className="w-full h-full object-cover absolute inset-0 pointer-events-none select-none"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })()}

                      {/* Editorial Context Label overlay (Left) */}
                      <div className="absolute bottom-6 sm:bottom-9 left-6 sm:left-12 text-left z-20 max-w-[200px] sm:max-w-[240px] pointer-events-none select-none">
                        <motion.div
                          animate={{ 
                            opacity: hoveredIndex === 1 ? 0.35 : 1,
                            y: hoveredIndex === 0 ? -4 : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="font-sans text-[8.5px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-gold font-extrabold block mb-1.5 animate-pulse">
                            {t('intro.proposalSubtitle', 'THE PROPOSAL // 01')}
                          </span>
                          <h4 className="font-serif italic text-base sm:text-xl text-white drop-shadow-md leading-tight">
                            {images[0].caption}
                          </h4>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Right Reality Slot (adventure) */}
                  <div 
                    style={{
                      clipPath: rightClipPath,
                      transition: "clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onMouseEnter={() => setHoveredIndex(1)}
                    onClick={() => handleOpenLightbox(1)}
                    className="absolute inset-0 z-10 cursor-zoom-in group"
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      {/* Interactive visual glare response */}
                      <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10" />

                      {(() => {
                        const opt = getOptimizedImageProps(images[1].url || '', 800, 1000);
                        return (
                          <motion.img
                            src={opt.src}
                            srcSet={opt.srcSet}
                            sizes="(max-width: 640px) 100vw, 50vw"
                            width={opt.width}
                            height={opt.height}
                            alt={images[1].caption}
                            animate={{
                              scale: hoveredIndex === 1 ? 1.05 : 1,
                              x: containerParallax.x * -18,
                              y: containerParallax.y * -18,
                              filter: hoveredIndex === 0 ? "brightness(0.55) blur(1.5px) grayscale(0.15)" : "brightness(1) blur(0px)"
                            }}
                            transition={{ type: "tween", ease: "easeOut", duration: 0.6 }}
                            className="w-full h-full object-cover absolute inset-0 pointer-events-none select-none"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })()}

                      {/* Editorial Context Label overlay (Right) */}
                      <div className="absolute bottom-6 sm:bottom-9 right-6 sm:right-12 text-right z-20 max-w-[200px] sm:max-w-[240px] pointer-events-none select-none">
                        <motion.div
                          animate={{ 
                            opacity: hoveredIndex === 0 ? 0.35 : 1,
                            y: hoveredIndex === 1 ? -4 : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="font-sans text-[8.5px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-gold font-extrabold block mb-1.5 animate-pulse">
                            {t('intro.adventureSubtitle', 'THE ADVENTURE // 02')}
                          </span>
                          <h4 className="font-serif italic text-base sm:text-xl text-white drop-shadow-md leading-tight">
                            {images[1].caption}
                          </h4>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Golden Glowing Linear Divider Thread */}
                  <div 
                    style={{
                      clipPath: dividerClipPath,
                      transition: "clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                      background: 'linear-gradient(to bottom, #d4af37, #f3e5ab, #9a8135, #f3e5ab, #d4af37)'
                    }}
                    className="absolute inset-0 z-30 pointer-events-none shadow-[0_0_20px_rgba(197,160,89,0.5)]"
                  />

                  {/* Central Dynamic Focal Badge */}
                  <div 
                    style={{
                      left: `${activeSplit}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      transition: "left 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    className="absolute z-40 p-1 bg-white rounded-full border border-brand-accent/40 shadow-2xl pointer-events-none hidden sm:flex select-none items-center justify-center w-14 h-14 md:w-18 md:h-18"
                  >
                    <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-brand-cream relative overflow-hidden">
                      <Heart className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                      <span className="font-sans text-[8px] tracking-widest text-[#9a8135] font-extrabold uppercase mt-1">
                        {t('intro.memoriesBadge', 'MEMORIES')}
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-brand-primary/65 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-brand-cream max-w-2xl w-full rounded-2xl p-8 relative border border-brand-gold/25 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-brand-primary/60 hover:text-brand-accent p-1 cursor-pointer transition-colors"
                aria-label="Close Story"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-center pt-4">
                <Monogram size={80} className="opacity-90 mx-auto" />
                <h3 className="font-serif text-2xl md:text-3xl text-brand-primary">
                  {t('intro.modalTitle', 'How We Met & Got Engaged')}
                </h3>
                <div className="h-[1px] w-16 bg-brand-gold/60 mx-auto" />

                <div className="space-y-4 text-left font-body text-base text-brand-primary/90 leading-relaxed">
                  <p dangerouslySetInnerHTML={{ __html: t('intro.modalBody1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('intro.modalBody2') }} />
                  <p className="text-center italic font-serif text-brand-accent pt-4">
                    {t('intro.modalFooter')}
                  </p>
                </div>

                <div className="pt-4">
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-brand-primary text-white hover:bg-brand-accent px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    {t('intro.closeBtn', 'Close Story')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Fullscreen Lightbox Backdrop */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseLightbox}
            className="fixed inset-0 bg-[#141d18]/95 z-[100] flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-md select-none"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 p-2.5 rounded-full cursor-pointer transition-all duration-300 z-[110] backdrop-blur-sm border border-white/10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Control */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 p-3 rounded-full cursor-pointer transition-all duration-300 z-[110] backdrop-blur-sm shadow-md border border-white/5"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Control */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 p-3 rounded-full cursor-pointer transition-all duration-300 z-[110] backdrop-blur-sm shadow-md border border-white/5"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* High-Fidelity Custom Frame */}
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative max-w-4xl max-h-[82vh] flex flex-col items-center justify-center p-2 rounded-[28px] bg-white/5 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const opt = getOptimizedImageProps(images[lightboxIndex].url || '', 1200, 900);
                return (
                  <img
                    src={opt.src}
                    srcSet={opt.srcSet}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    width={opt.width}
                    height={opt.height}
                    alt={images[lightboxIndex].caption}
                    className="max-w-full max-h-[66vh] md:max-h-[72vh] object-contain rounded-[20px] shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                );
              })()}
              
              {/* Detailed Context Row */}
              <div className="w-full text-center pt-4 pb-2 px-6 space-y-1 text-white">
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-accent font-bold">
                  {images[lightboxIndex].title}
                </span>
                <p className="font-serif italic text-base md:text-lg text-white/95">
                  {images[lightboxIndex].caption}
                </p>
              </div>
            </motion.div>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 flex gap-2.5 z-[110]">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === lightboxIndex ? 'bg-brand-accent scale-125' : 'bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
