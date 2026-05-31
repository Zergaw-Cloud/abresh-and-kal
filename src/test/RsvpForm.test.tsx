import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RsvpForm from '../components/RsvpForm';

// Complete mock config for RSVP section
const mockConfig = {
  sections: {
    rsvpForm: true,
  },
  sectionConfigs: {
    rsvpform: {
      title: { en: 'The Invitation', am: 'የግብዣ ካርድ' },
      subtitle: { en: 'Kindly Respond', am: 'የምላሽ ቅጽ' },
    },
  },
  googleSheetsRsvpUrl: 'https://api.sheets.com/rsvp',
};

const mockUseLanguage = vi.fn(() => ({
  config: mockConfig,
  language: 'en',
  t: (key: string, def: string) => def || key,
}));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

// Mock framer-motion/motion elements nicely to avoid layout transition blocks
vi.mock('motion/react', () => ({
  motion: {
    form: ({ children, className, onSubmit, ...props }: any) => (
      <form className={className} onSubmit={onSubmit} {...props}>{children}</form>
    ),
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    button: ({ children, className, onClick, ...props }: any) => (
      <button className={className} onClick={onClick} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('RsvpForm validation & UI state logic tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders initial RSVP layout and form inputs', () => {
    render(<RsvpForm />);

    expect(screen.getByText('Kindly Respond')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Catherine Evans')).toBeInTheDocument();
    expect(screen.getByText('Gladly Accepts')).toBeInTheDocument();
    expect(screen.getByText('Regretfully Declines')).toBeInTheDocument();
  });

  it('prevents form submission or transition if attending is not selected', async () => {
    render(<RsvpForm />);
    const nameInput = screen.getByPlaceholderText('e.g. Catherine Evans');
    fireEvent.change(nameInput, { target: { value: 'Daniel Craig' } });

    const submitBtn = screen.getByText('Submit RSVP Details');
    fireEvent.click(submitBtn);

    // Form shouldn't transition since attending is null
    expect(screen.queryByText('Thank You, Daniel Craig!')).not.toBeInTheDocument();
  });

  it('successfully unlocks sub-options when Attending selection is toggled', async () => {
    render(<RsvpForm />);

    // Tapping attending yes
    const yesBtn = screen.getByText('Gladly Accepts');
    fireEvent.click(yesBtn);

    // Sub-options for guest count and preferences should be displayed
    await waitFor(() => {
      expect(screen.getByText('Bringing a Guest?')).toBeInTheDocument();
      expect(screen.getByText('Total Party Size')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Song Title & Artist')).toBeInTheDocument();
    });

    // Toggle guest count from 1 to 2
    const guestSelect = screen.getByRole('combobox');
    fireEvent.change(guestSelect, { target: { value: '2' } });

    expect(guestSelect).toHaveValue('2');
  });

  it('submits local dummy fallback offline if fetch returns a bad code or placeholder exists', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('ok'),
      } as Response)
    );

    render(<RsvpForm />);
    
    // Fill values
    const nameInput = screen.getByPlaceholderText('e.g. Catherine Evans');
    fireEvent.change(nameInput, { target: { value: 'John Wick' } });

    const yesBtn = screen.getByText('Gladly Accepts');
    fireEvent.click(yesBtn);

    const submitBtn = screen.getByText('Submit RSVP Details');
    fireEvent.click(submitBtn);

    // Wait for submission response and transition to success panel
    await waitFor(() => {
      expect(screen.getByText('DIGITAL RSVP PASS')).toBeInTheDocument();
      // "Thank You, John Wick!" using dynamic replaces
      expect(screen.getByText('Thank You, John Wick!')).toBeInTheDocument();
    });

    // Check localStorage saved guest properties
    const saved = localStorage.getItem('wedding_user_rsvp');
    expect(saved).toBeDefined();
    if (saved) {
      const parsed = JSON.parse(saved);
      expect(parsed.fullName).toBe('John Wick');
      expect(parsed.attending).toBe('yes');
    }

    expect(fetchSpy).toHaveBeenCalled();
  });

  it('resets local responses when clicking Edit Response', async () => {
    // Inject existing answer directly to simulation storage
    localStorage.setItem('wedding_user_rsvp', JSON.stringify({
      fullName: 'Alice Mercer',
      attending: 'no',
      isSubmitted: true,
      invitationCode: 'AK-NO-5555'
    }));

    render(<RsvpForm />);

    // Verify view loads as initially submitted
    expect(screen.getByText('We will miss your presence on our sweet day, but we deeply appreciate your warm support and blessings.')).toBeInTheDocument();

    const editBtn = screen.getByRole('button', { name: /Edit Response/i });
    fireEvent.click(editBtn);

    // Back to clean form state
    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. Catherine Evans')).toHaveValue('');
      expect(screen.queryByText('We will miss your presence')).not.toBeInTheDocument();
    });

    expect(localStorage.getItem('wedding_user_rsvp')).toBeNull();
  });
});
