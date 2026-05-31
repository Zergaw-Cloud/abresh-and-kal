import React, { createContext, useContext, useState, useEffect } from 'react';
import { load as yamlLoad } from 'js-yaml';
import { DEFAULT_CONFIG, ConfigType } from './config';

interface LanguageContextType {
  config: ConfigType;
  language: string;
  setLanguage: (lang: string) => void;
  t: (path: string, defaultValue?: string) => string;
  groom: string;
  bride: string;
  weddingDate: string;
  weddingDateFormatted: string;
  weddingTime: string;
  venueName: string;
  venueLocation: string;
  loading: boolean;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function validateConfig(parsed: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, errors: ['Configuration is not an object'] };
  }

  const translatables = ['groomName', 'brideName', 'weddingDate', 'weddingDateFormatted', 'weddingTime', 'venueName', 'venueLocation'];
  for (const field of translatables) {
    if (parsed[field] !== undefined && (typeof parsed[field] !== 'object' || parsed[field] === null)) {
      errors.push(`"${field}" must be an object (e.g. { en: "Name", am: "ስም" })`);
    }
  }

  if (parsed.sections !== undefined && (typeof parsed.sections !== 'object' || parsed.sections === null)) {
    errors.push('"sections" must be an object mapping keys to true/false');
  }

  if (parsed.sectionOrder !== undefined && !Array.isArray(parsed.sectionOrder)) {
    errors.push('"sectionOrder" must be an array of string identifiers');
  }

  if (parsed.countdownTarget !== undefined && typeof parsed.countdownTarget === 'string') {
    const parsedTime = Date.parse(parsed.countdownTarget.trim());
    if (isNaN(parsedTime)) {
      errors.push('"countdownTarget" must be a valid ISO-8601 date string');
    }
  }

  if (parsed.multilingual !== undefined) {
    if (typeof parsed.multilingual !== 'object' || parsed.multilingual === null) {
      errors.push('"multilingual" must be a configuration object');
    } else {
      if (parsed.multilingual.enabled !== undefined && typeof parsed.multilingual.enabled !== 'boolean') {
        errors.push('"multilingual.enabled" must be a boolean');
      }
      if (parsed.multilingual.languages !== undefined && !Array.isArray(parsed.multilingual.languages)) {
        errors.push('"multilingual.languages" must be an array');
      }
    }
  }

  if (parsed.galleryImages !== undefined) {
    if (!Array.isArray(parsed.galleryImages)) {
      errors.push('"galleryImages" must be an array');
    } else {
      parsed.galleryImages.forEach((img: any, idx: number) => {
        if (!img || typeof img !== 'object') {
          errors.push(`galleryImages[${idx}] is not a valid object`);
        } else {
          if (!img.id) errors.push(`galleryImages[${idx}] is missing the "id" field`);
          if (!img.url) errors.push(`galleryImages[${idx}] is missing the "url" field`);
          if (!img.category) errors.push(`galleryImages[${idx}] is missing the "category" field`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState('en');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const baseUrl = (import.meta as any).env?.BASE_URL || '/';
        const configUrl = `${baseUrl.replace(/\/$/, '')}/config/main.yaml`;
        const response = await fetch(configUrl);
        if (!response.ok) {
          throw new Error('Config file fallback to default settings.');
        }
        const text = await response.text();
        
        let parsed: any;
        try {
          parsed = yamlLoad(text);
        } catch (parseError: any) {
          throw new Error(`YAML syntax error: ${parseError.message}`);
        }

        const validation = validateConfig(parsed);
        if (!validation.valid) {
          throw new Error(`YAML schema validation failed: ${validation.errors.join(' | ')}`);
        }
        
        const KEY_MAP: Record<string, string> = {
          countdown: 'countdown',
          videoPreview: 'videopreview',
          gallery: 'gallery',
          timeline: 'timeline',
          saveTheDate: 'savethedate',
          location: 'location',
          memoryShare: 'memoryshare',
          guestbook: 'guestbook',
          rsvpForm: 'rsvpform',
        };

        const sectionsObj = parsed.sections || DEFAULT_CONFIG.sections || {};
        const derivedOrder: string[] = [];
        const seenMapped = new Set<string>();

        for (const key of Object.keys(sectionsObj)) {
          const mappedKey = KEY_MAP[key];
          if (mappedKey && !seenMapped.has(mappedKey)) {
            derivedOrder.push(mappedKey);
            seenMapped.add(mappedKey);
          }
        }

        for (const key of Object.keys(DEFAULT_CONFIG.sections || {})) {
          const mappedKey = KEY_MAP[key];
          if (mappedKey && !seenMapped.has(mappedKey)) {
            derivedOrder.push(mappedKey);
            seenMapped.add(mappedKey);
          }
        }

        // Deep merge configuration properties with default model fallback
        const mergedConfig: ConfigType = {
          ...DEFAULT_CONFIG,
          ...parsed,
          sections: {
            ...DEFAULT_CONFIG.sections,
            ...(parsed.sections || {}),
          },
          sectionOrder: derivedOrder,
          sectionConfigs: {
            ...DEFAULT_CONFIG.sectionConfigs,
            ...(parsed.sectionConfigs || {}),
          },
          multilingual: {
            ...DEFAULT_CONFIG.multilingual,
            ...(parsed.multilingual || {}),
          },
          introImages: {
            ...DEFAULT_CONFIG.introImages,
            ...(parsed.introImages || {}),
          },
          theme: {
            ...DEFAULT_CONFIG.theme,
            ...(parsed.theme || {}),
          },
          translations: {}, // Reset translations for clean merge from files
          groomName: {},
          brideName: {},
          weddingDate: {},
          weddingDateFormatted: {},
          weddingTime: {},
          venueName: {},
          venueLocation: {},
          venueDescription: {},
          familyRegistryNotes: [],
        };

        // Recursive helper to merge translation paths into deep objects
        const mergeTranslations = (target: any, source: any, lang: string) => {
          if (!source || typeof source !== 'object') return;
          for (const key of Object.keys(source)) {
            const val = source[key];
            if (Array.isArray(val)) {
              if (target[key] === undefined) {
                target[key] = [];
              }
              const targetArr = target[key];
              for (const sourceItem of val) {
                if (sourceItem && typeof sourceItem === 'object' && sourceItem.id) {
                  let targetItem = targetArr.find((item: any) => item.id === sourceItem.id);
                  if (!targetItem) {
                    targetItem = { id: sourceItem.id };
                    for (const sKey of Object.keys(sourceItem)) {
                      if (sKey !== 'id' && typeof sourceItem[sKey] !== 'string') {
                        targetItem[sKey] = {};
                      } else if (sKey === 'iconName' || sKey === 'category') {
                        targetItem[sKey] = sourceItem[sKey];
                      }
                    }
                    targetArr.push(targetItem);
                  }
                  
                  for (const sKey of Object.keys(sourceItem)) {
                    if (sKey === 'id' || sKey === 'iconName' || sKey === 'category') {
                      continue;
                    }
                    if (typeof sourceItem[sKey] === 'string') {
                      if (targetItem[sKey] === undefined || typeof targetItem[sKey] !== 'object') {
                        targetItem[sKey] = {};
                      }
                      targetItem[sKey][lang] = sourceItem[sKey];
                    }
                  }
                } else if (typeof sourceItem === 'string') {
                  if (!targetArr.includes(sourceItem)) {
                    targetArr.push(sourceItem);
                  }
                }
              }
            } else if (val && typeof val === 'object') {
              if (target[key] === undefined) {
                target[key] = {};
              }
              mergeTranslations(target[key], val, lang);
            } else if (typeof val === 'string') {
              if (target[key] === undefined || typeof target[key] !== 'object') {
                target[key] = {};
              }
              target[key][lang] = val;
            }
          }
        };

        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const activeLangs = mergedConfig.multilingual?.enabled
          ? (mergedConfig.multilingual?.languages || []).map((l: any) => l.code)
          : [mergedConfig.multilingual?.defaultLanguage || 'en'];

        for (const lang of activeLangs) {
          try {
            const langUrl = `${cleanBaseUrl}/config/${lang}.yaml`;
            const langResponse = await fetch(langUrl);
            if (!langResponse.ok) {
              console.warn(`Language file for "${lang}" not found. Using defaults.`);
              continue;
            }
            const langText = await langResponse.text();
            let langParsed: any;
            try {
              langParsed = yamlLoad(langText);
            } catch (err: any) {
              console.error(`YAML parse error in ${lang}.yaml: ${err.message}`);
              continue;
            }

            if (langParsed && typeof langParsed === 'object') {
              // 1. Merge top-level translatable fields
              const translatables = [
                'groomName', 'brideName', 'weddingDate', 'weddingDateFormatted', 
                'weddingTime', 'venueName', 'venueLocation', 'venueDescription'
              ];
              for (const field of translatables) {
                if (langParsed[field] !== undefined) {
                  mergedConfig[field][lang] = langParsed[field];
                }
              }

              // 2. Merge sectionConfigs translations
              if (langParsed.sectionConfigs && typeof langParsed.sectionConfigs === 'object') {
                for (const sectionId of Object.keys(langParsed.sectionConfigs)) {
                  const sConf = langParsed.sectionConfigs[sectionId];
                  if (!mergedConfig.sectionConfigs[sectionId]) {
                    mergedConfig.sectionConfigs[sectionId] = { title: {}, subtitle: {} };
                  }
                  if (!mergedConfig.sectionConfigs[sectionId].title) mergedConfig.sectionConfigs[sectionId].title = {};
                  if (!mergedConfig.sectionConfigs[sectionId].subtitle) mergedConfig.sectionConfigs[sectionId].subtitle = {};

                  if (sConf.title) mergedConfig.sectionConfigs[sectionId].title[lang] = sConf.title;
                  if (sConf.subtitle) mergedConfig.sectionConfigs[sectionId].subtitle[lang] = sConf.subtitle;
                }
              }

              // 3. Merge galleryImages title/description
              if (langParsed.galleryImages && typeof langParsed.galleryImages === 'object') {
                mergedConfig.galleryImages = (mergedConfig.galleryImages || []).map((imgObj) => {
                  const langImg = langParsed.galleryImages[imgObj.id];
                  if (langImg) {
                    const title = imgObj.title || {};
                    const description = imgObj.description || {};
                    const badge = imgObj.badge || {};
                    if (langImg.title) title[lang] = langImg.title;
                    if (langImg.description) description[lang] = langImg.description;
                    if (langImg.badge) badge[lang] = langImg.badge;
                    return {
                      ...imgObj,
                      title,
                      description,
                      badge
                    };
                  }
                  return imgObj;
                });
              }

              // 4. Merge familyRegistryNotes parent blessings
              if (langParsed.familyRegistryNotes && typeof langParsed.familyRegistryNotes === 'object') {
                const currentNotes = mergedConfig.familyRegistryNotes || [];
                for (const noteId of Object.keys(langParsed.familyRegistryNotes)) {
                  const langNote = langParsed.familyRegistryNotes[noteId];
                  if (langNote) {
                    let noteObj = currentNotes.find(n => n.id === noteId);
                    if (!noteObj) {
                      noteObj = {
                        id: noteId,
                        author: {},
                        text: {},
                        role: {}
                      };
                      currentNotes.push(noteObj);
                    }
                    if (langNote.author) noteObj.author[lang] = langNote.author;
                    if (langNote.text) noteObj.text[lang] = langNote.text;
                    if (langNote.role) noteObj.role[lang] = langNote.role;
                  }
                }
                mergedConfig.familyRegistryNotes = currentNotes;
              }

              // 5. Merge deep translations key-values
              if (langParsed.translations && typeof langParsed.translations === 'object') {
                mergeTranslations(mergedConfig.translations, langParsed.translations, lang);
              }
            }
          } catch (langErr: any) {
            console.warn(`Could not load or merge translation file for "${lang}":`, langErr.message || langErr);
          }
        }

        setConfig(mergedConfig);

        // Determine initial language based on settings
        const defaultLang = mergedConfig.multilingual?.defaultLanguage || 'en';
        const saved = localStorage.getItem('wedding_invitation_lang');
        const availableCodes = (mergedConfig.multilingual?.languages || []).map(l => l.code);
        
        if (saved && availableCodes.includes(saved)) {
          setLanguageState(saved);
        } else {
          setLanguageState(defaultLang);
        }
      } catch (error: any) {
        console.warn('Unable to load external YAML config, utilizing internal defaults:', error.message || error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const setLanguage = (lang: string) => {
    if (!config.multilingual?.enabled) return;
    const availableCodes = (config.multilingual?.languages || []).map(l => l.code);
    if (!availableCodes.includes(lang)) return;
    if (lang === language) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setLanguageState(lang);
      localStorage.setItem('wedding_invitation_lang', lang);
      document.documentElement.lang = lang;
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 200);
  };



  const t = (path: string, defaultValue = ''): string => {
    try {
      const parts = path.split('.');
      let current: any = config.translations;
      
      for (const part of parts) {
        if (current && current[part] !== undefined) {
          current = current[part];
        } else {
          // Look inside DEFAULT_CONFIG fallback first
          let fallbackVal: any = DEFAULT_CONFIG.translations;
          for (const subPart of parts) {
            if (fallbackVal && fallbackVal[subPart] !== undefined) {
              fallbackVal = fallbackVal[subPart];
            } else {
              fallbackVal = null;
              break;
            }
          }
          if (fallbackVal && typeof fallbackVal === 'object' && fallbackVal[language] !== undefined) {
            return fallbackVal[language];
          }
          return defaultValue || path;
        }
      }

      if (current && typeof current === 'object') {
        if (current[language] !== undefined) {
          return current[language];
        }
        // Fallback to English if translation is missing
        if (current['en'] !== undefined) {
          return current['en'];
        }
      }

      return typeof current === 'string' ? current : (defaultValue || path);
    } catch (e) {
      return defaultValue || path;
    }
  };

  const safeTranslateKey = (obj: Record<string, string> | undefined, lang: string, fallback: string): string => {
    if (!obj) return fallback;
    return obj[lang] || obj['en'] || fallback;
  };

  const groom = safeTranslateKey(config.groomName, language, 'Abresh');
  const bride = safeTranslateKey(config.brideName, language, 'Kal');
  const weddingDate = safeTranslateKey(config.weddingDate, language, 'September 20, 2026');
  const weddingDateFormatted = safeTranslateKey(config.weddingDateFormatted, language, 'Sunday, Sept 20, 2026');
  const weddingTime = safeTranslateKey(config.weddingTime, language, '6:00 PM UTC');
  const venueName = safeTranslateKey(config.venueName, language, 'Feleke Teka');
  const venueLocation = safeTranslateKey(config.venueLocation, language, '');

  useEffect(() => {
    if (!loading && config.theme) {
      const {
        primaryColor,
        accentColor,
        goldColor,
        creamColor,
        creamDarkColor,
        sageColor,
        sageLightColor,
        primaryFont,
        secondaryFont,
        bodyFont
      } = config.theme;

      const root = document.documentElement;
      if (primaryColor) root.style.setProperty('--color-brand-primary', primaryColor);
      if (accentColor) root.style.setProperty('--color-brand-accent', accentColor);
      if (goldColor) root.style.setProperty('--color-brand-gold', goldColor);
      if (creamColor) root.style.setProperty('--color-brand-cream', creamColor);
      if (creamDarkColor) root.style.setProperty('--color-brand-cream-dark', creamDarkColor);
      if (sageColor) root.style.setProperty('--color-brand-sage', sageColor);
      if (sageLightColor) root.style.setProperty('--color-brand-sage-light', sageLightColor);

      // Dynamically load Google Fonts if customized (skip standard fonts pre-loaded statically in index.css)
      const STATIC_FONTS = ["Playfair Display", "Montserrat", "Source Serif 4"];
      const fontsToLoad: string[] = [];
      if (primaryFont) {
        root.style.setProperty('--font-serif', `"${primaryFont}", Georgia, serif`);
        if (!STATIC_FONTS.includes(primaryFont)) {
          fontsToLoad.push(primaryFont);
        }
      }
      if (secondaryFont) {
        root.style.setProperty('--font-sans', `"${secondaryFont}", sans-serif`);
        if (!STATIC_FONTS.includes(secondaryFont)) {
          fontsToLoad.push(secondaryFont);
        }
      }
      if (bodyFont) {
        root.style.setProperty('--font-body', `"${bodyFont}", Georgia, serif`);
        if (!STATIC_FONTS.includes(bodyFont)) {
          fontsToLoad.push(bodyFont);
        }
      }

      if (fontsToLoad.length > 0) {
        const fontId = 'dynamic-google-fonts';
        let linkElement = document.getElementById(fontId) as HTMLLinkElement;
        if (!linkElement) {
          linkElement = document.createElement('link');
          linkElement.id = fontId;
          linkElement.rel = 'stylesheet';
          document.head.appendChild(linkElement);
        }
        const families = fontsToLoad.map(f => `family=${f.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800`).join('&');
        linkElement.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
      }
    }
  }, [loading, config.theme]);

  useEffect(() => {
    if (!loading) {
      document.documentElement.lang = language;
      const customTitle = t('common.websiteTitle');
      if (customTitle && customTitle !== 'common.websiteTitle') {
        document.title = customTitle;
      } else {
        const connector = language === 'am' ? ' እና ' : ' & ';
        document.title = `${groom}${connector}${bride}`;
      }
    }
  }, [language, loading, groom, bride]);

  return (
    <LanguageContext.Provider
      value={{
        config,
        language,
        setLanguage,
        t,
        groom,
        bride,
        weddingDate,
        weddingDateFormatted,
        weddingTime,
        venueName,
        venueLocation,
        loading,
        isTransitioning,
      }}
    >
      {loading ? (
        <div className="min-h-screen linen-texture flex flex-col items-center justify-center space-y-4 animate-fade-in bg-brand-cream select-none">
          <div className="w-12 h-12 rounded-full border-2 border-brand-accent/20 border-t-brand-accent animate-spin" />
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-primary/60 font-medium">
            Loading Invitation...
          </p>
        </div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
