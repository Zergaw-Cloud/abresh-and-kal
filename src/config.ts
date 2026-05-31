export interface MultilingualLanguage {
  code: string;
  label: string;
}

export interface ConfigType {
  groomName: Record<string, string>;
  brideName: Record<string, string>;
  monagramInitials: string;
  countdownTarget: string;
  weddingDate: Record<string, string>;
  weddingDateFormatted: Record<string, string>;
  weddingTime: Record<string, string>;
  venueName: Record<string, string>;
  venueLocation: Record<string, string>;
  venueDescription: Record<string, string>;
  addressQuery: string;
  formspreeId: string;
  googleSheetsRsvpUrl: string;
  backgroundMusicUrl: string;
  youtubeVideoId: string;
  telegramUrl: string;
  sections: {
    audioPlayer: boolean;
    story: boolean;
    countdown: boolean;
    videoPreview: boolean;
    saveTheDate: boolean;
    timeline: boolean;
    gallery: boolean;
    location: boolean;
    memoryShare: boolean;
    guestbook: boolean;
    rsvpForm: boolean;
  };
  sectionOrder: string[];
  sectionConfigs: Record<string, {
    title: Record<string, string>;
    subtitle: Record<string, string>;
    showInNavBar?: boolean;
  }>;
  multilingual: {
    enabled: boolean;
    defaultLanguage: string;
    languages: MultilingualLanguage[];
  };
  timelineImages: Record<string, string[]>;
  heroImages: string[];
  introImages: {
    engagement: string;
    adventure: string;
  };
  galleryImages: Array<{
    id: string;
    url: string;
    category: string;
    title?: Record<string, string>;
    description?: Record<string, string>;
    badge?: Record<string, string>;
  }>;
  familyRegistryNotes: Array<{
    id: string;
    author: Record<string, string>;
    text: Record<string, string>;
    role: Record<string, string>;
  }>;
  translations: Record<string, any>;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    goldColor?: string;
    creamColor?: string;
    creamDarkColor?: string;
    sageColor?: string;
    sageLightColor?: string;
    primaryFont?: string;
    secondaryFont?: string;
    bodyFont?: string;
  };
}

export const DEFAULT_CONFIG: ConfigType = {
  groomName: { en: "Abresh", am: "አብርሽ" },
  brideName: { en: "Kal", am: "ቃል" },
  monagramInitials: "A&K",
  countdownTarget: "2026-09-20T16:00:00Z",
  weddingDate: { en: "September 20, 2026", am: "መስከረም 10 ቀን 2019 ዓ.ም" },
  weddingDateFormatted: { en: "Sunday, Sept 20, 2026", am: "እሑድ፣ መስከረም 10 ቀን 2019" },
  weddingTime: { en: "4:00 PM UTC", am: "ከምሽቱ 12:00 ሰዓት ጀምሮ" },
  venueName: { en: "Feleke Teka Wedding Hall", am: "ፈለቀ ተካ የሠርግ አዳራሽ" },
  venueLocation: { en: "Beside Nifas Silk Lafto Technical and Professional Training College", am: "ንፋስ ስልክ ላፍቶ ቴክኒክና ሙያ ስልጠና ኮሌጅ አጠገብ" },
  venueDescription: {
    en: "Our wedding ceremony and reception is hosted at the magnificent Feleke Teka Wedding Hall.",
    am: "የሰርግ ስነ-ስርዓታችን እና የእራት ግብዣችን በንፋስ ስልክ በሚገኘው ታሪካዊው ፈለቀ ተካ የሠርግ አዳራሽ።"
  },
  addressQuery: "Feleke Teka Wedding Hall | ፈለቀ ተካ የሠርግ አዳራሽ",
  formspreeId: "xjgzaejz",
  googleSheetsRsvpUrl: "https://script.google.com/macros/s/AKfycbzVuUANOoVp_nqhz1aACI0S1Y717gFpPsWqgKrib-xviJtpQa6aq2RCFezD2uT-0NCT/exec",
  backgroundMusicUrl: "https://www.dropbox.com/scl/fi/iu4xpwcbezemguzfr1g8m/abinet-agonafir-yewune_-1.mp3?rlkey=b6p9kklmexpuqi5hga90kwz8k&st=t2lmd9zb&raw=1",
  youtubeVideoId: "x0U55UcW2Aw",
  telegramUrl: "https://t.me/AbruhasetKalkidanWeddingMemories",
  sections: {
    audioPlayer: true,
    story: true,
    countdown: true,
    videoPreview: true,
    saveTheDate: true,
    timeline: true,
    gallery: true,
    location: true,
    memoryShare: true,
    guestbook: true,
    rsvpForm: true
  },
  sectionOrder: [
    "countdown",
    "videopreview",
    "gallery",
    "timeline",
    "savethedate",
    "location",
    "memoryshare",
    "guestbook",
    "rsvpform"
  ],
  sectionConfigs: {
    story: {
      title: { en: "Our Story", am: "የፍቅር ታሪካችን" },
      subtitle: { en: "How we began", am: "ጅማሬያችን" },
      showInNavBar: true
    },
    countdown: {
      title: { en: "The countdown", am: "የቀናት ቆጠራ" },
      subtitle: { en: "Until We say 'I do'", am: "“ቃልኪዳን” እስክንገባ ድረስ" },
      showInNavBar: true
    },
    videopreview: {
      title: { en: "Our love story captured", am: "የፍቅር ታሪካችን በከፊል" },
      subtitle: { en: "Pre-wedding moments", am: "የቅድመ-ሰርግ ልዩ ትዝታዎች" },
      showInNavBar: true
    },
    savethedate: {
      title: { en: "The invitation", am: "የግብዣ ወረቀት" },
      subtitle: { en: "reserve the twentieth of september", am: "መስከረም አስርን ያስውቡልን" },
      showInNavBar: true
    },
    timeline: {
      title: { en: "The wedding day", am: "የሰርጉ እለት" },
      subtitle: { en: "schedule of events", am: "የመርሐግብር ሰሌዳ" },
      showInNavBar: true
    },
    gallery: {
      title: { en: "our memory bank", am: "የማይረሱ ትዝታዎች" },
      subtitle: { en: "captured moments", am: "የእኛ ውብ ትዝታዎች" },
      showInNavBar: true
    },
    location: {
      title: { en: "location", am: "ስነ-ስፍራ" },
      subtitle: { en: "feleke teka wedding hall", am: "ፈለቀ ተካ የሰርግ አዳራሽ (Feleke Teka)" },
      showInNavBar: true
    },
    memoryshare: {
      title: { en: "share your memory", am: "ትዝታዎን ያጋሩ" },
      subtitle: { en: "telegram live memory box", am: "የቴሌግራም የቀጥታ ትዝታ ማዕከል" },
      showInNavBar: true
    },
    guestbook: {
      title: { en: "leave a wish", am: "ምኞትዎን ይጻፉ" },
      subtitle: { en: "signing the guestbook", am: "የእንግዳ ማስታወሻ መጻፊያ" },
      showInNavBar: true
    },
    rsvpform: {
      title: { en: "the invitation", am: "የግብዣ መቀበያ" },
      subtitle: { en: "kindly respond", am: "እባክዎን ይመዝገቡ" },
      showInNavBar: true
    }
  },
  multilingual: {
    enabled: true,
    defaultLanguage: "en",
    languages: [
      { code: "en", label: "EN" },
      { code: "am", label: "አማ" }
    ]
  },
  timelineImages: {
    t1: ["/images/timeline01.jpg"],
    t2: ["/images/timeline02.jpg"],
    t3: ["/images/timeline03.jpg"],
    t4: ["/images/timeline04.jpg"]
  },
  heroImages: [
    "/images/hero06.jpg",
    "/images/hero05.jpg",
    "/images/hero07.jpg",
    "/images/hero02.jpg"
  ],
  introImages: {
    engagement: "/images/groom04.jpg",
    adventure: "/images/bride04.jpg"
  },
  galleryImages: [
    { 
      id: "gal-1", 
      url: "/images/gallery01.jpg", 
      category: "moments",
      title: { en: "Warm Sunlit Smiles", am: "ጣፋጭ ፈገግታዎች" },
      description: { en: "Captured in Addis Ababa, 2025", am: "አዲስ አበባ፣ ፳፻፲፯ ዓ.ም የተቀረጸ" },
      badge: { en: "MOMENTS", am: "ትዝታዎች" }
    },
    { 
      id: "gal-2", 
      url: "/images/gallery02.jpg", 
      category: "adventure",
      title: { en: "Spontaneous Adventures", am: "የጉዞዎቻችን ትዝታ" },
      description: { en: "Our favorite road trips", am: "ልዩ የጉዞ ትዝታዎቻችን" },
      badge: { en: "ADVENTURE", am: "ጉዞዎች" }
    },
    { 
      id: "gal-3", 
      url: "/images/gallery03.jpg", 
      category: "engagement",
      title: { en: "A Golden Promise We Made", am: "የእጮኝነት የተቀደሰ ኪዳን" },
      description: { en: "The sunset of our love", am: "ከአድማስ ባሻገር" },
      badge: { en: "ENGAGEMENT", am: "የእጮኝነት ጊዜ" }
    },
    { 
      id: "gal-4", 
      url: "/images/gallery04.jpg", 
      category: "adventure",
      title: { en: "Exploring Scenic Horizons Together", am: "በጋራ ህይወትን ስንቃኝ" },
      description: { en: "Nature escape", am: "የተፈጥሮ ውበት" },
      badge: { en: "ADVENTURE", am: "ጉዞዎች" }
    },
    { 
      id: "gal-5", 
      url: "/images/gallery05.jpg", 
      category: "moments",
      title: { en: "Gazing Into Our Beautiful Future", am: "ወደ ብሩህ ተስፋችን ስንመለከት" },
      description: { en: "Forever in your eyes", am: "ከአይንህ ስር" },
      badge: { en: "MOMENTS", am: "ትዝታዎች" }
    },
    { 
      id: "gal-6", 
      url: "/images/gallery06.jpg", 
      category: "engagement",
      title: { en: "Everlasting Devotion & Faith", am: "ዘላለማዊ ፍቅርና እምነት" },
      description: { en: "The ring of promise", am: "የቃልኪዳኑ ቀለበት" },
      badge: { en: "ENGAGEMENT", am: "እጮኝነት" }
    },
    { 
      id: "gal-7", 
      url: "/images/gallery07.jpg", 
      category: "moments",
      title: { en: "Everyday Laughter & Coffee", am: "የዕለት ተዕለት ጣፋጭ ጨዋታ" },
      description: { en: "Coffee date morning", am: "የጠዋት ፈገግታ" },
      badge: { en: "MOMENTS", am: "ትዝታዎች" }
    },
    { 
      id: "gal-8", 
      url: "/images/gallery08.jpg", 
      category: "adventure",
      title: { en: "Golden Hour Mountain Escapes", am: "በተራሮች ላይ መሳቅና መጫወት" },
      description: { en: "Mount Entoto hills", am: "በእንጦጦ ኮረብቶች ላይ" },
      badge: { en: "ADVENTURE", am: "ጉዞዎች" }
    }
  ],
  familyRegistryNotes: [
    {
      id: "parent-1",
      author: { en: "Groom's Father Blessing", am: "የሙሽራው አባት ምርቃት" },
      text: { en: "We are overjoyed to welcome Kalkidan into our family. May your love be a shining testament of commitment, mutual respect, and infinite blessings.", am: "ቃልኪዳንን ወደ ቤተሰባችን በመቀበላችን ታላቅ ደስታ ይሰማናል። ፍቅራችሁ የጽናት፣ የመከባበር እና የዘላቂ በረከት ማረጋገጫ ይሁን።" },
      role: { en: "Blessing from Ato Belayhun Keskes", am: "የአቶ በላይሁን ከስክስ ምርቃት" }
    },
    {
      id: "parent-2",
      author: { en: "Groom's Mother Blessing", am: "የሙሽራው እናት ምርቃት" },
      text: { en: "May the Almighty bless your home with peace, endless laughter, and understanding. Keep your hearts unified as one, and build a household on sincerity and grace.", am: "ፈጣሪ ቤታችሁን በሰላም፣ በሳቅ እና በምክክር ይባርከው። ልባችሁን በአንድነት አጽኑ፤ ትዳራችሁን በቅንነት እና በሞገስ ገንቡ።" },
      role: { en: "Blessings from Woizero Almaz Atlaw", am: "የወይዘሮ አልማዝ አጥላው ምርቃት" }
    },
    {
      id: "parent-3",
      author: { en: "Bride's Mother Blessing", am: "የሙሽሪት እናት ምርቃት" },
      text: { en: "My heart overflows with love seeing my beautiful Kalkidan and Abruhaset step into this lifetime covenant. May you stand strong together, looking out for each other every single day.", am: "ልጄ ቃልኪዳን እና አብሩሃሴት ይህንን የተቀደሰ የህይወት ቃልኪዳን ሲገቡ በማየቴ ልቤ በደስታ ይፈሳል። ሁልጊዜም እርስ በርስ እየተከባበራችሁና እየተደጋገፋችሁ በጽናት ቁሙ።" },
      role: { en: "Blessings from Woizero Alem Mamo", am: "ወ/ሮ አለም ማሞ - ጎርፌ ምርቃት" }
    }
  ],
  translations: {
    // Keep internal fallbacks empty, we will dynamically inject
  },
  theme: {
    primaryColor: "#2f4237",
    accentColor: "#C5A059",
    goldColor: "#C5A059",
    creamColor: "#FAF9F6",
    creamDarkColor: "#EAE7DF",
    sageColor: "#9A9587",
    sageLightColor: "#EAE7DF",
    primaryFont: "Playfair Display",
    secondaryFont: "Montserrat",
    bodyFont: "Source Serif 4"
  }
};

// Legacy support reference for unchanged components
export const CONFIG = DEFAULT_CONFIG;
