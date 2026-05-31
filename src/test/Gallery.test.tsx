import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

const mockConfig = {
  galleryImages: [
    {
      id: 'gal-one',
      url: 'https://images.unsplash.com/photo-1?q=80',
      category: 'moments',
      title: { en: 'Our Sunset Promise', am: 'ጣፋጭ ቃልኪዳን' },
      description: { en: 'Beautiful outdoor light', am: 'በውብ ጀምበር ስር' },
      badge: { en: 'MOMENTS', am: 'ትዝታ' }
    },
    {
      id: 'gal-two',
      url: 'https://images.unsplash.com/photo-2?q=80',
      category: 'adventure',
      title: { en: 'Scenic Mountain Heights', am: 'ደስ የሚሉ ተራሮች' },
      description: { en: 'Climbing up together', am: 'በጋራ ስንጓዝ' },
      badge: { en: 'ADVENTURES', am: 'ጉዞዎች' }
    }
  ],
  sectionConfigs: {
    gallery: {
      title: { en: 'Our Memory Bank' },
      subtitle: { en: 'Captured Moments' },
    }
  }
};

const mockUseLanguage = vi.fn(() => ({
  config: mockConfig,
  language: 'en',
  t: (key: string, def: string) => def || key,
}));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

// Mock motion elements to streamline layout executions
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, onClick, ...props }: any) => (
      <div className={className} style={style} onClick={onClick} {...props}>{children}</div>
    ),
    img: ({ src, className, ...props }: any) => <img src={src} className={className} {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Gallery photo grid and lightbox preview components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly maps and displays memory images from Configuration items', () => {
    render(<Gallery />);

    expect(screen.getByText('Our Memory Bank')).toBeInTheDocument();
    expect(screen.getByText('Captured Moments')).toBeInTheDocument();

    // Check specific gallery contents are loaded
    expect(screen.getByText('Our Sunset Promise')).toBeInTheDocument();
    expect(screen.getByText('Scenic Mountain Heights')).toBeInTheDocument();
  });

  it('activates full-screen Lightbox dialog on clicking an active category card', async () => {
    render(<Gallery />);

    // Since index matching is centered on filteredImages, index 1 ('Scenic Mountain Heights') is active initially
    const cardTrigger = screen.getByText('Scenic Mountain Heights');
    fireEvent.click(cardTrigger);

    // Lightbox must be triggered open
    expect(screen.getByText('Full Screen View • (2 / 2)')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Clicking next in full-screen Lightbox toggles image count
    const nextBtn = screen.getByLabelText('Next image');
    fireEvent.click(nextBtn);

    expect(screen.getByText('Full Screen View • (1 / 2)')).toBeInTheDocument();

    // Verify close icon safely hides the active lightbox dialog
    const closeBtn = screen.getByRole('button', { name: '' }); 
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('triggers lightbox exit when keyboard Escape is pressed', async () => {
    render(<Gallery />);

    const cardTrigger = screen.getByText('Scenic Mountain Heights');
    fireEvent.click(cardTrigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Fire Escape key press sequence on window
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
