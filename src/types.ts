export interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface RsvpData {
  id: string;
  fullName: string;
  email: string;
  attending: 'yes' | 'no';
  plusOne: boolean;
  guestsCount: number;
  dietaryNotes: string;
  songRequest: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
  images: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'engagement' | 'adventure' | 'moments';
}
