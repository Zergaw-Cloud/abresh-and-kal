import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../utils/analytics';

export default function AudioPlayer() {
  const { config } = useLanguage();
  const [sourceIndex, setSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackRequestedRef = useRef<boolean>(false);

  // Fallback track list prioritizing user config
  const playSources = [
    config.backgroundMusicUrl || "",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Chopin_Nocturne_in_E_flat_major%2C_Op._9_No._2.ogg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e5/Kanon_in_D-Dur_%28Pachelbel%29.ogg"
  ].filter(Boolean);

  const handleAudioError = () => {
    if (sourceIndex < playSources.length - 1) {
      setSourceIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    if (playbackRequestedRef.current) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => handleAudioError());
    }
  }, [sourceIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    const startAudio = () => {
      if (audioRef.current && !playbackRequestedRef.current) {
        playbackRequestedRef.current = true;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            cleanup();
          })
          .catch(() => {});
      } else {
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('scroll', startAudio);
    };

    window.addEventListener('click', startAudio, { passive: true });
    window.addEventListener('touchstart', startAudio, { passive: true });
    window.addEventListener('scroll', startAudio, { passive: true });

    audio.play()
      .then(() => {
        setIsPlaying(true);
        playbackRequestedRef.current = true;
        cleanup();
      })
      .catch(() => {});

    return cleanup;
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      playbackRequestedRef.current = false;
      trackEvent('pause_music', 'interaction', 'Background Track');
    } else {
      playbackRequestedRef.current = true;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          trackEvent('play_music', 'interaction', 'Background Track');
        })
        .catch(() => handleAudioError());
    }
  };

  if (!config.sections?.audioPlayer) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", damping: 15 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      <audio
        ref={audioRef}
        src={playSources[sourceIndex]}
        loop
        preload="auto"
        onError={handleAudioError}
      />
      
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-primary text-brand-cream hover:bg-brand-accent transition-colors duration-300 shadow-xl border border-brand-gold/40 relative group cursor-pointer"
        aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
      >
        <AnimatePresence mode="popLayout">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              className="relative flex items-center justify-center"
            >
              <span className="absolute inset-x-0 inset-y-0 w-8 h-8 rounded-full bg-brand-accent/20 animate-ping" />
              <Volume2 className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
            >
              <VolumeX className="w-5 h-5 text-brand-cream/80 group-hover:scale-110 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
