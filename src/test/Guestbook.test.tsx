import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Guestbook from '../components/Guestbook';

const mockConfig = {
  sections: {
    guestbook: true,
  },
  sectionConfigs: {
    guestbook: {
      title: { en: 'Leave a Wish' },
      subtitle: { en: 'Signing the Guestbook' },
    }
  },
  familyRegistryNotes: [
    {
      id: 'note-1',
      author: { en: 'Abebe Kelemu', am: 'አበበ ከለሙ' },
      text: { en: 'May your covenant remain blessed.', am: 'ቃልኪዳናችሁ የተቀደሰ ይሁን' },
      role: { en: 'Father of the Groom', am: 'የሙሽራው አባት' }
    }
  ],
  formspreeId: 'mock-formspree-id'
};

const mockUseLanguage = vi.fn(() => ({
  config: mockConfig,
  language: 'en',
  t: (key: string, def: string) => def || key,
}));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

vi.mock('motion/react', () => ({
  motion: {
    form: ({ children, className, onSubmit, ...props }: any) => (
      <form className={className} onSubmit={onSubmit} {...props}>{children}</form>
    ),
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    button: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
  },
}));

describe('Guestbook and Registry blessing tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders standard Guestbook headers and registry widgets properly', () => {
    render(<Guestbook />);

    expect(screen.getByText('Leave a Wish')).toBeInTheDocument();
    expect(screen.getByText('Signing the Guestbook')).toBeInTheDocument();

    // Check Blessing Note list text
    expect(screen.getByText('"May your covenant remain blessed."')).toBeInTheDocument();
    expect(screen.getByText('Abebe Kelemu')).toBeInTheDocument();
    expect(screen.getByText('Father of the Groom')).toBeInTheDocument();
  });

  it('displays a success banner when a congratulatory wish is posted successfully', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    render(<Guestbook />);

    const nameInput = screen.getByPlaceholderText('e.g. Grandma Helen');
    const wishInput = screen.getByPlaceholderText('Writing your warm words here...');
    const submitBtn = screen.getByText('Send Love & Wish');

    fireEvent.change(nameInput, { target: { value: 'Brother Thomas' } });
    fireEvent.change(wishInput, { target: { value: 'So happy for you both!' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Sending Wish...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Wish posted successfully! Thank you.')).toBeInTheDocument();
    });

    // Check payload data matching form inputs
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://formspree.io/f/mock-formspree-id',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Brother Thomas',
          wish: 'So happy for you both!'
        }),
      })
    );
  });

  it('displays a detailed error message when Formspree endpoint rejects submission', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Form is closed' }),
      } as Response)
    );

    render(<Guestbook />);

    const nameInput = screen.getByPlaceholderText('e.g. Grandma Helen');
    const wishInput = screen.getByPlaceholderText('Writing your warm words here...');
    const submitBtn = screen.getByText('Send Love & Wish');

    fireEvent.change(nameInput, { target: { value: 'Failure Case' } });
    fireEvent.change(wishInput, { target: { value: 'This should fail' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Form is closed')).toBeInTheDocument();
    });
  });
});
