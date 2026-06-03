import React, { useState } from 'react';
import { Mail, Music, Heart, CheckCircle2, Ticket, Users, RefreshCw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../utils/analytics';

export default function RsvpForm({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();
  
  const loadSavedRsvp = () => {
    try {
      const saved = localStorage.getItem('wedding_user_rsvp');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const savedRsvp = loadSavedRsvp();

  const [fullName, setFullName] = useState(savedRsvp?.fullName || '');
  const [attending, setAttending] = useState<'yes' | 'no' | null>(savedRsvp?.attending || null);
  const [plusOne, setPlusOne] = useState(savedRsvp?.plusOne || false);
  const [guestsCount, setGuestsCount] = useState(savedRsvp?.guestsCount || 1);
  const [dietary, setDietary] = useState(savedRsvp?.dietaryNotes || savedRsvp?.dietary || '');
  const [song, setSong] = useState(savedRsvp?.songRequest || savedRsvp?.song || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!savedRsvp?.isSubmitted);
  const [invitationCode, setInvitationCode] = useState(savedRsvp?.invitationCode || '');
  const [backendStatus, setBackendStatus] = useState<'sheet' | 'local'>(savedRsvp?.backendStatus || 'local');

  if (!config.sections?.rsvpForm) return null;

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || attending === null) return;

    setIsSubmitting(true);
    trackEvent('rsvp_submit_start', 'conversion', `Attending: ${attending}`);

    const randomTicketSuffix = Math.floor(1000 + Math.random() * 9000);
    const passCode = savedRsvp?.invitationCode || `AK-${attending === 'yes' ? 'YES' : 'NO'}-${randomTicketSuffix}`;
    setInvitationCode(passCode);

    const payload = {
      fullName: fullName.trim(),
      attending,
      guestsCount: attending === 'yes' ? guestsCount : 0,
      dietaryNotes: attending === 'yes' ? dietary.trim() : '',
      songRequest: attending === 'yes' ? song.trim() : '',
      invitationCode: passCode,
      timestamp: new Date().toISOString()
    };

    const saveToLocalStorageAll = (status: 'sheet' | 'local') => {
      const savedState = {
        fullName: fullName.trim(),
        attending,
        plusOne,
        guestsCount: attending === 'yes' ? guestsCount : 0,
        dietaryNotes: attending === 'yes' ? dietary.trim() : '',
        songRequest: attending === 'yes' ? song.trim() : '',
        isSubmitted: true,
        invitationCode: passCode,
        backendStatus: status
      };
      try {
        localStorage.setItem('wedding_user_rsvp', JSON.stringify(savedState));
      } catch {}
    };

    const sheetsUrl = config.googleSheetsRsvpUrl || '';
    const isPlaceholder = !sheetsUrl || sheetsUrl.includes('placeholder');

    if (isPlaceholder) {
      setTimeout(() => {
        saveRsvpLocally(payload);
        setBackendStatus('local');
        saveToLocalStorageAll('local');
        setIsSubmitting(false);
        setIsSubmitted(true);
        trackEvent('rsvp_submit_success', 'conversion', `Attending: ${attending} (local placeholder)`);
      }, 1000);
    } else {
      try {
        const response = await fetch(sheetsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Google Sheets submission failed');
        }

        saveRsvpLocally(payload);
        setBackendStatus('sheet');
        saveToLocalStorageAll('sheet');
        setIsSubmitted(true);
        trackEvent('rsvp_submit_success', 'conversion', `Attending: ${attending} (google_sheet)`);
      } catch (err: any) {
        saveRsvpLocally(payload);
        setBackendStatus('local');
        saveToLocalStorageAll('local');
        setIsSubmitted(true);
        trackEvent('rsvp_submit_success', 'conversion', `Attending: ${attending} (local fallback due to sheets error: ${err?.message || 'Error'})`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const saveRsvpLocally = (data: any) => {
    try {
      const existing = localStorage.getItem('wedding_rsvp_submissions') || '[]';
      const parsed = JSON.parse(existing);
      parsed.push(data);
      localStorage.setItem('wedding_rsvp_submissions', JSON.stringify(parsed));
    } catch {}
  };

  const resetForm = () => {
    trackEvent('rsvp_reset', 'interaction');
    try {
      localStorage.removeItem('wedding_user_rsvp');
    } catch {}
    setFullName('');
    setAttending(null);
    setPlusOne(false);
    setGuestsCount(1);
    setDietary('');
    setSong('');
    setIsSubmitted(false);
    setInvitationCode('');
  };

  return (
    <section id="rsvp" className={`py-24 ${bgClass || 'bg-brand-cream'} relative overflow-hidden linen-texture border-t border-[#E5E2D9]`}>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-brand-accent/5 font-serif italic text-9xl select-none pointer-events-none">
        RSVP
      </div>

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold">
            {config.sectionConfigs?.rsvpform?.title?.[language] || t('calendar.title', 'The Invitation')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary font-light">
            {isSubmitted 
              ? (language === 'am' ? 'ስለ ምላሽዎ እናመሰግናለን!' : 'Thank you for your response')
              : (config.sectionConfigs?.rsvpform?.subtitle?.[language] || t('calendar.heading', 'Kindly Respond'))
            }
          </h2>
          <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto" />
          <p className="font-body text-base text-[#4A4A4A]/70 max-w-sm mx-auto">
            {t('calendar.sub', 'Please respond to help us plan coordinates beautifully.')}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="rsvp-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmitRsvp}
              className="bg-white p-8 md:p-10 rounded-3xl border border-[#E5E2D9] space-y-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute inset-x-2 inset-y-2 border border-[#E5E2D9]/40 pointer-events-none rounded-2xl" />

              <div className="space-y-1.5 flex flex-col relative z-10">
                <label htmlFor="rsvp-fullName" className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1 mb-1">
                  {t('rsvpForm.fullName', 'Full Name')}
                </label>
                <input
                  id="rsvp-fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('rsvpForm.fullNamePl', 'e.g. Catherine Evans')}
                  className="w-full bg-brand-cream/30 border border-[#E5E2D9] rounded-2xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 transition-all text-brand-primary"
                />
              </div>

              <div className="space-y-3 relative z-10 flex flex-col">
                <label className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1">
                  {t('rsvpForm.attendingLabel', 'Will You Attend?')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAttending('yes');
                      if (guestsCount === 0) {
                        setGuestsCount(plusOne ? 2 : 1);
                      }
                    }}
                    className={`py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold border transition-all cursor-pointer ${
                      attending === 'yes'
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-brand-cream/20 text-brand-primary/70 border-[#E5E2D9] hover:border-brand-primary/35'
                    }`}
                  >
                    {t('rsvpForm.attendingYes', 'Gladly Accepts')}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAttending('no');
                      setGuestsCount(0);
                    }}
                    className={`py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold border transition-all cursor-pointer ${
                      attending === 'no'
                        ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                        : 'bg-brand-cream/20 text-brand-primary/70 border-[#E5E2D9] hover:border-brand-primary/35'
                    }`}
                  >
                    {t('rsvpForm.attendingNo', 'Regretfully Declines')}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {attending === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <span className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1 mb-1">
                          {t('rsvpForm.bringingGuest', 'Bringing a Guest?')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const willHavePlusOne = !plusOne;
                            setPlusOne(willHavePlusOne);
                            setGuestsCount(willHavePlusOne ? 2 : 1);
                          }}
                          className={`w-full py-3 px-4 rounded-full border font-sans text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                            plusOne
                              ? 'bg-brand-cream-dark text-brand-primary border-brand-sage'
                              : 'bg-brand-cream/10 text-brand-primary/60 border-[#E5E2D9] hover:border-brand-primary/20'
                          }`}
                        >
                          {plusOne 
                            ? t('rsvpForm.withGuest', 'Guest (Plus One) Included') 
                            : t('rsvpForm.noGuest', 'No Plus One')
                          }
                        </button>
                      </div>

                      <div className="space-y-1.5 flex flex-col">
                        <label htmlFor="rsvp-partySize" className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1 mb-1">
                          {t('rsvpForm.partySize', 'Total Party Size')}
                        </label>
                        <select
                          id="rsvp-partySize"
                          value={guestsCount}
                          onChange={(e) => {
                            const count = parseInt(e.target.value);
                            setGuestsCount(count);
                            setPlusOne(count > 1);
                          }}
                          className="w-full bg-brand-cream/30 border border-[#E5E2D9] rounded-2xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 text-brand-primary"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? (language === 'am' ? 'ሰው' : 'Guest') : (language === 'am' ? 'ሰዎች' : 'Guests')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                      <div className="space-y-1.5 flex flex-col">
                        <label htmlFor="rsvp-dietary" className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold block ml-1 mb-1">
                          {t('rsvpForm.dietary', 'Dietary Options')}
                        </label>
                        <input
                          id="rsvp-dietary"
                          type="text"
                          value={dietary}
                          onChange={(e) => setDietary(e.target.value)}
                          placeholder={t('rsvpForm.dietaryPl', 'e.g. Vegetarian, Gluten-Free')}
                          className="w-full bg-brand-cream/30 border border-[#E5E2D9] rounded-2xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 transition-all text-brand-primary"
                        />
                      </div>

                      <div className="space-y-1.5 flex flex-col">
                        <label htmlFor="rsvp-song" className="font-sans text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold ml-1 mb-1 flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-brand-accent" />
                          <span>{t('rsvpForm.song', 'Song Request')}</span>
                        </label>
                        <input
                          id="rsvp-song"
                          type="text"
                          value={song}
                          onChange={(e) => setSong(e.target.value)}
                          placeholder={t('rsvpForm.songPl', 'Song Title & Artist')}
                          className="w-full bg-brand-cream/30 border border-[#E5E2D9] rounded-2xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10 transition-all text-brand-primary"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-brand-primary text-white hover:bg-brand-accent py-4 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer z-10 relative disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    <span>{t('rsvpForm.saving', 'Submitting RSVP...')}</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-white" />
                    <span>{t('rsvpForm.submit', 'Submit RSVP Details')}</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white p-8 md:p-10 rounded-3xl border border-[#E5E2D9] text-center space-y-6 shadow-md relative overflow-hidden max-w-lg mx-auto"
            >
              <div className="absolute inset-x-2 inset-y-2 border border-[#E5E2D9]/40 pointer-events-none rounded-2xl" />
              
              <div className="absolute left-0 right-0 top-0 h-1 bg-[#E5E2D9]/50 flex justify-between gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-brand-cream rounded-full -mt-2" />
                ))}
              </div>

              <div className="w-16 h-16 bg-brand-cream-dark rounded-full flex items-center justify-center text-brand-accent mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-brand-primary">
                  {t('rsvpForm.successHeading', 'Thank You, {name}!').replace('{name}', fullName)}
                </h3>
                <p className="font-sans text-[11px] text-brand-accent uppercase tracking-[0.2em] font-bold">
                  {t('rsvpForm.successSub', 'Your response is safely recorded')}
                </p>
                <div className="h-[1px] w-24 bg-[#E5E2D9] mx-auto" />
              </div>

              {attending === 'yes' ? (
                <div className="p-6 bg-brand-cream border border-[#E5E2D9] rounded-2xl space-y-4 max-w-sm mx-auto shadow-sm relative">
                  <div className="absolute top-2 right-2 text-brand-accent/10 pointer-events-none select-none">
                    <Ticket className="w-12 h-12 rotate-[-15deg]" />
                  </div>

                  <div className="border-b border-[#E5E2D9] pb-3">
                    <p className="font-sans text-[9px] uppercase tracking-widest text-[#4A4A4A]/50 font-bold">
                      {t('rsvpForm.digitalPass', 'DIGITAL RSVP PASS')}
                    </p>
                    <p className="font-serif text-lg text-brand-primary mt-1 font-semibold">{invitationCode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 text-left text-[11px] font-sans">
                    <div>
                      <span className="text-[#4A4A4A]/60 block font-bold">
                        {t('rsvpForm.digitalPassLabel', 'ATTENDEE')}
                      </span>
                      <span className="text-brand-primary font-bold overflow-hidden text-ellipsis block whitespace-nowrap">{fullName}</span>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/60 block font-bold">
                        {t('rsvpForm.partyLabel', 'PARTY SIZE')}
                      </span>
                      <span className="text-brand-primary font-bold">{guestsCount} {language === 'am' ? 'ሰው' : 'Guest(s)'}</span>
                    </div>
                    {dietary && (
                      <div className="col-span-2">
                        <span className="text-[#4A4A4A]/60 block font-bold">
                          {t('rsvpForm.dietaryLabel', 'DIETARY REQUEST')}
                        </span>
                        <span className="text-brand-primary font-bold italic">{dietary}</span>
                      </div>
                    )}
                    {song && (
                      <div className="col-span-2">
                        <span className="text-[#4A4A4A]/60 block font-bold">
                          {t('rsvpForm.songLabel', 'SONG REQUESTED')}
                        </span>
                        <span className="text-brand-primary font-bold italic">“{song}”</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="font-body text-sm text-[#4A4A4A]/70 italic py-4 max-w-xs mx-auto">
                  {language === 'am' 
                    ? 'በዕለቱ መገኘቶ ማሳወቅዎ እናመሰግናለን፤ በአካል ባይኖሩም ምርቃቶ አይለየን።' 
                    : 'We will miss your presence on our sweet day, but we deeply appreciate your warm support and blessings.'
                  }
                </p>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[9px] font-sans tracking-wide text-brand-primary/45 uppercase font-bold pt-2">
                <Users className="w-3.5 h-3.5 text-brand-accent" />
                <span>
                  {backendStatus === 'sheet' 
                    ? t('rsvpForm.sheetStored', 'Sent to the organizers') 
                    : t('rsvpForm.localStored', 'Saved Offline (Demo Mode)')
                  }
                </span>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 border border-[#E5E2D9] hover:border-brand-accent bg-white text-brand-primary px-6 py-2.5 rounded-full font-sans text-[11px] uppercase tracking-widest font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <span>{t('rsvpForm.editBtn', 'Edit Response')}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
