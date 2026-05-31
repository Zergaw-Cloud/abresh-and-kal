import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function Countdown({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();
  const [isPassed, setIsPassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const targetDate = new Date(config.countdownTarget).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      let difference = targetDate - now;

      if (difference <= 0) {
        setIsPassed(true);
        // Calculate positive difference for counting elapsed time instead
        difference = Math.abs(difference);
      } else {
        setIsPassed(false);
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [config.countdownTarget]);

  const timeBlocks = [
    { id: 'days', label: t('countdown.days', 'Days'), value: timeLeft.days },
    { id: 'hours', label: t('countdown.hours', 'Hours'), value: timeLeft.hours },
    { id: 'minutes', label: t('countdown.minutes', 'Minutes'), value: timeLeft.minutes },
    { id: 'seconds', label: t('countdown.seconds', 'Seconds'), value: timeLeft.seconds }
  ];

  return (
    <section id="countdown" className={`py-20 ${bgClass || 'bg-brand-cream-dark'} text-brand-primary relative overflow-hidden border-y border-[#E5E2D9]`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cream/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10">
        <motion.span 
          initial={{ opacity: 0, tracking: "0.1em" }}
          whileInView={{ opacity: 1, tracking: "0.3em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in"
        >
          {config.sectionConfigs?.countdown?.title?.[language] || t('countdown.label', 'The Countdown')}
        </motion.span>
        
        <motion.h3 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl md:text-5xl text-brand-primary font-light tracking-wide leading-tight"
        >
          {isPassed
            ? t('countdown.headingHappilyMarried', 'Happily Married For')
            : (config.sectionConfigs?.countdown?.subtitle?.[language] || t('countdown.heading', 'Until We Say "I Do"'))
          }
        </motion.h3>
        
        <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto opacity-80" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto pt-4"
        >
          {timeBlocks.map((block) => (
            <motion.div
              key={block.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } }
              }}
              whileHover={{ 
                y: -6, 
                scale: 1.02, 
                boxShadow: "0 15px 30px rgba(154, 149, 135, 0.15)",
                borderColor: "var(--color-brand-accent)"
              }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E5E2D9] p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm relative group transition-colors"
            >
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-accent font-light leading-none select-none tracking-tight">
                {block.value}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-primary/60 mt-4 font-bold text-center">
                {block.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
