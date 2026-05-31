import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Countdown from '../components/Countdown';

// Mock the LanguageContext hooks to control countdownTarget inputs
const mockConfig = {
  countdownTarget: '2026-09-20T16:00:00Z',
  sectionConfigs: {
    countdown: {
      title: { en: 'The Countdown' },
      subtitle: { en: 'Until We Say "I Do"' },
    },
  },
};

const mockUseLanguage = vi.fn(() => ({
  config: mockConfig,
  language: 'en',
  t: (key: string, def: string) => def || key,
}));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

// Mock framer-motion/motion elements nicely if we need to
vi.mock('motion/react', () => ({
  motion: {
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
    h3: ({ children, className, ...props }: any) => <h3 className={className} {...props}>{children}</h3>,
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  },
}));

describe('Countdown component tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('correctly calculates remaining time blocks for a future wedding date', () => {
    // Lock current time to exactly 2 days, 3 hours, 4 minutes and 5 seconds before 2026-09-20T16:00:00Z
    // Target: 2026-09-20T16:00:00Z (Unix time: 1787328000000)
    // Now: 2 days (172800000s) + 3 hours (10800000) + 4 minutes (240000) + 5 seconds (5000) before
    const targetMs = new Date('2026-09-20T16:00:00Z').getTime();
    const diffMs = (2 * 24 * 3600 + 3 * 3600 + 4 * 60 + 5) * 1000;
    const nowMs = targetMs - diffMs;
    
    vi.setSystemTime(new Date(nowMs));

    render(<Countdown />);

    // Check title layout
    expect(screen.getByText('The Countdown')).toBeInTheDocument();
    expect(screen.getByText('Until We Say "I Do"')).toBeInTheDocument();

    // Verify day, hour, minute, second values
    expect(screen.getByText('02')).toBeInTheDocument(); // Days
    expect(screen.getByText('03')).toBeInTheDocument(); // Hours
    expect(screen.getByText('04')).toBeInTheDocument(); // Minutes
    expect(screen.getByText('05')).toBeInTheDocument(); // Seconds
  });

  it('switches text structure to Happily Married if event time has already elapsed', () => {
    // Set system time to 1 day after the wedding target
    const targetMs = new Date('2026-09-20T16:00:00Z').getTime();
    const oneDayAfter = targetMs + 24 * 60 * 60 * 1000;
    
    vi.setSystemTime(new Date(oneDayAfter));

    render(<Countdown />);

    // Verify it renders elapsed "Happily Married For" title context (as resolved by helper fallback)
    expect(screen.getByText('Happily Married For')).toBeInTheDocument();
    
    // Elapsed calculations
    expect(screen.getByText('01')).toBeInTheDocument(); // 1 day elapsed
    expect(screen.getAllByText('00').length).toBe(3); // hours, minutes, seconds are all 00
  });
});
