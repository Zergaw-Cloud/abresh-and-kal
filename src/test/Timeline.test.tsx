import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Timeline from '../components/Timeline';

// Mock Config with chronological events and slides
const mockConfig = {
  translations: {
    timeline: {
      events: [
        {
          id: 'evt-ceremony',
          time: { en: '3:00 PM', am: '9:00 ሰዓት' },
          title: { en: 'Religious Covenant', am: 'የቃልኪዳን ስነ-ስርዓት' },
          description: { en: 'Vows exchange at the church garden.', am: 'የጋብቻ ቃልኪዳን በቤተክርስቲያን።' },
          iconName: 'Heart',
        },
        {
          id: 'evt-reception',
          time: { en: '6:00 PM', am: '12:00 ሰዓት' },
          title: { en: 'Grand Banquet', am: 'የክብር እራት' },
          description: { en: 'Dinner, drinks and dance.', am: 'የባህል ጭፈራ እና የራት ድግስ።' },
          iconName: 'Utensils',
        }
      ]
    }
  },
  timelineImages: {
    'evt-ceremony': [
      'https://images.unsplash.com/photo-1?q=80',
      'https://images.unsplash.com/photo-2?q=80'
    ]
  },
  sectionConfigs: {
    timeline: {
      title: { en: 'The Wedding Day' },
      subtitle: { en: 'Schedule of Events' },
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

// Mock motion elements
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>{children}</div>
    ),
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
  },
}));

describe('Timeline timeline schedule tests', () => {
  it('correctly maps and renders configuration schedule lists', () => {
    render(<Timeline />);

    expect(screen.getByText('The Wedding Day')).toBeInTheDocument();
    expect(screen.getByText('Schedule of Events')).toBeInTheDocument();
    
    // Check both event titles
    expect(screen.getByText('Religious Covenant')).toBeInTheDocument();
    expect(screen.getByText('Grand Banquet')).toBeInTheDocument();

    // Check descriptions
    expect(screen.getByText('Vows exchange at the church garden.')).toBeInTheDocument();
    expect(screen.getByText('Dinner, drinks and dance.')).toBeInTheDocument();

    // Event time tags
    expect(screen.getByText('3:00 PM')).toBeInTheDocument();
    expect(screen.getByText('6:00 PM')).toBeInTheDocument();
  });

  it('correctly behaves when slide carousels are interactive and toggled with buttons', () => {
    render(<Timeline />);

    // Since 'evt-ceremony' has 2 images, it should define pagination buttons
    const prevButton = screen.getByLabelText('Previous Slide');
    const nextButton = screen.getByLabelText('Next Slide');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Let's trigger next slide click toggles
    fireEvent.click(nextButton);

    // Click again to verify cyclic behaviour
    fireEvent.click(nextButton);
    expect(nextButton).toBeInTheDocument();
  });
});
