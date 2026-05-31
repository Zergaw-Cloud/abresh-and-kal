import React, { useState } from 'react';
import { Send, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

export default function Guestbook({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!config.sections?.guestbook) return null;

  const handleSubmitFormspree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setShowSuccess(false);

    const formspreeEndpoint = `https://formspree.io/f/${config.formspreeId || 'xjgzaejz'}`;

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          wish: message.trim()
        })
      });

      if (response.ok) {
        setName('');
        setMessage('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 6000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Submission failed.');
      }
    } catch (err) {
      setErrorMessage(t('memoryShare.errorGeneric', 'A network error occurred. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const familyRegistryNotes = config.familyRegistryNotes || [];

  return (
    <section id="guestbook" className={`py-24 ${bgClass || 'bg-brand-cream'} border-t border-[#E5E2D9]`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Unified standard header */}
        <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in">
            {config.sectionConfigs?.guestbook?.title?.[language] || t('memoryShare.wishLabel', 'Leave a Wish')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary font-light tracking-wide leading-tight">
            {config.sectionConfigs?.guestbook?.subtitle?.[language] || t('memoryShare.wishTitle', 'Signing the Guestbook')}
          </h2>
          <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto opacity-80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <p className="font-body text-base text-[#4A4A4A]/70 text-center lg:text-left max-w-sm mx-auto lg:mx-0">
              {t('memoryShare.wishDesc', 'Write your congratulations note below to send your blessing directly.')}
            </p>

            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmitFormspree} 
              className="bg-white p-8 rounded-3xl border border-[#E5E2D9] space-y-4 shadow-sm relative"
            >
              <div className="space-y-1">
                <label htmlFor="gb-name" className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1 mb-1">
                  {t('memoryShare.inputName', 'Your Name')}
                </label>
                <input
                  id="gb-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('memoryShare.placeholderName', 'e.g. Grandma Helen')}
                  className="w-full bg-brand-cream/30 border border-[#E5E2D9] rounded-2xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 transition-all text-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="gb-wish" className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1 mb-1">
                  {t('memoryShare.inputWish', 'Congratulatory Wish')}
                </label>
                <textarea
                  id="gb-wish"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('memoryShare.placeholderWish', 'Writing your warm words here...')}
                  className="w-full bg-brand-cream/30 border border-[#E5E2D9] rounded-2xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 transition-all text-brand-primary min-h-[100px]"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-sans">
                  {errorMessage}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-brand-primary text-white hover:bg-brand-accent py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:bg-gray-400 font-sans"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>
                  {isSubmitting 
                    ? t('memoryShare.sending', 'Sending Wish...') 
                    : t('memoryShare.btnSend', 'Send Love & Wish')
                  }
                </span>
              </motion.button>

              {showSuccess && (
                <p className="font-sans text-[11px] text-brand-accent font-bold text-center animate-fade-in flex items-center justify-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin" />
                  <span>{t('memoryShare.success', 'Wish posted successfully! Thank you.')}</span>
                </p>
              )}
            </motion.form>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block text-center lg:text-left">
              {t('memoryShare.familyLabel', 'Family Registry')}
            </span>
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl md:text-3xl text-brand-primary font-light">
                {t('memoryShare.familyTitle', 'Family Blessing Notes')}
              </h3>
              <p className="font-body text-sm text-brand-primary/70 mt-2">
                {t('memoryShare.familyDesc', 'Blessings and wisdom conveyed by our loving parents.')}
              </p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {familyRegistryNotes.map((note) => {
                const authorName = note.author[language] || '';
                const noteText = note.text[language] || '';
                const noteRole = note.role[language] || '';

                return (
                  <motion.div
                    key={note.id}
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 18, stiffness: 120 } }
                    }}
                    whileHover={{ scale: 1.02, y: -4, borderColor: "var(--color-brand-accent)", boxShadow: "0 15px 30px rgba(154, 149, 135, 0.12)" }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-white rounded-3xl border border-[#E5E2D9] shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-350"
                  >
                    <span className="absolute top-2 right-4 text-brand-accent/15 select-none pointer-events-none text-xl font-serif">♥</span>
                    
                    <div className="space-y-4">
                      <p className="font-body text-sm text-brand-primary/90 leading-relaxed italic">
                        "{noteText}"
                      </p>
                      
                      <div className="space-y-0.5 pt-2">
                        <p className="font-serif text-sm text-brand-primary font-bold">
                          {authorName}
                        </p>
                        <p className="font-sans text-[9px] uppercase tracking-wider text-brand-accent font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-brand-accent" />
                          <span>{noteRole}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
