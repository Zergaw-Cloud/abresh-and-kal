import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Monogram from '../components/Monogram';

const mockUseLanguage = vi.fn(() => ({
  config: {
    monagramInitials: 'G&M',
  },
  language: 'en',
  t: (key: string, def: string) => def || key,
}));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

describe('Monogram component tests', () => {
  it('correctly uses config.monagramInitials for the SVG text element', () => {
    const { container } = render(<Monogram size={120} />);
    const textElement = container.querySelector('text');
    
    expect(textElement).toBeInTheDocument();
    expect(textElement?.textContent).toBe('G&M');

    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '120');
    expect(svgElement).toHaveAttribute('height', '120');
  });
});
