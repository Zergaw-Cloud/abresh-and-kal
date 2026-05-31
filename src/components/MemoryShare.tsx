import React from 'react';
import { Send, UploadCloud } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

export default function MemoryShare({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();

  if (!config.sections?.memoryShare) return null;

  const handleTelegramLink = () => {
    window.open(config.telegramUrl || 'https://t.me/AbruhasetKalkidanWeddingMemories', '_blank');
  };

  return (
    <section id="memories" className={`py-24 ${bgClass || 'bg-brand-cream-dark'} border-t border-[#E5E2D9]`}>
      <div className="max-w-6xl mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(47, 66, 55, 0.25)" }}
          className="max-w-3xl mx-auto bg-brand-primary text-brand-cream p-8 md:p-12 rounded-3xl border border-[#E5E2D9]/30 relative overflow-hidden text-center space-y-6 shadow-md transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary via-[#4A4A4A]/10 to-brand-primary pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-brand-accent mx-auto border border-brand-accent/20"
            >
              <UploadCloud className="w-6 h-6 text-brand-accent" />
            </motion.div>
            
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in">
              {config.sectionConfigs?.memoryshare?.title?.[language] || t('memoryShare.label', 'Share Your Memories')}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-cream font-light tracking-wide leading-tight">
              {config.sectionConfigs?.memoryshare?.subtitle?.[language] || t('memoryShare.title', 'Telegram Live Memory Box')}
            </h2>
            <div className="h-[1px] w-16 bg-brand-accent/30 mx-auto opacity-85" />
            <p className="font-body text-sm text-brand-cream/85 max-w-sm mx-auto leading-relaxed">
              {t('memoryShare.desc', 'Please share all snapshots you capture during our wedding program to our combined Telegram live channel.')}
            </p>

            <div className="pt-4">
              <motion.button
                onClick={handleTelegramLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-brand-accent text-white hover:bg-brand-accent/90 px-8 py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-md cursor-pointer font-sans"
              >
                <Send className="w-4 h-4 fill-current text-white animate-pulse" />
                <span>{t('memoryShare.btnText', 'Join Memory Box Group')}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
