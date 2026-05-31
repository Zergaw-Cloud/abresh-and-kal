import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';
import { DEFAULT_CONFIG } from '../config';

// Temporary testing component to consume context
function TestUser() {
  const { groom, bride, language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="groom">{groom}</span>
      <span data-testid="bride">{bride}</span>
      <span data-testid="lang">{language}</span>
      <span data-testid="trans-and">{t('common.and')}</span>
      <button data-testid="btn-am" onClick={() => setLanguage('am')}>
        Amharic
      </button>
    </div>
  );
}

describe('LanguageContext system tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should fall back to default configuration and default language (en) if network files are missing', async () => {
    // Stub fetch to return a failed promise (config files not found)
    vi.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.reject(new Error('Network error loading assets'))
    );

    render(
      <LanguageProvider>
        <TestUser />
      </LanguageProvider>
    );

    // Verify loading transitions out and defaults are resolved
    await waitFor(() => {
      expect(screen.getByTestId('groom')).toBeInTheDocument();
    });

    // Default configuration values
    expect(screen.getByTestId('groom').textContent).toBe(DEFAULT_CONFIG.groomName?.en || 'Abruhaset');
    expect(screen.getByTestId('bride').textContent).toBe(DEFAULT_CONFIG.brideName?.en || 'Kalkidan');
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('trans-and').textContent).toBe('common.and'); // Since translations are empty in defaults
  });

  it('should correctly parse successfully loaded languages and support language swaps if enabled', async () => {
    // Mock successful main.yaml and en.yaml/am.yaml loads
    const mainYamlMock = `
sections:
  countdown: true
  gallery: true
multilingual:
  enabled: true
  defaultLanguage: en
  languages:
    - code: en
      label: EN
    - code: am
      label: አማ
`;

    const enYamlMock = `
groomName: "Abruhaset"
brideName: "Kalkidan"
translations:
  common:
    and: "and"
`;

    const amYamlMock = `
groomName: "አብሩሃሴት"
brideName: "ቃልኪዳን"
translations:
  common:
    and: "እና"
`;

    vi.spyOn(global, 'fetch').mockImplementation((url) => {
      const path = url.toString();
      let fileContent = '';
      if (path.endsWith('main.yaml')) {
        fileContent = mainYamlMock;
      } else if (path.endsWith('en.yaml')) {
        fileContent = enYamlMock;
      } else if (path.endsWith('am.yaml')) {
        fileContent = amYamlMock;
      }

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(fileContent),
      } as Response);
    });

    render(
      <LanguageProvider>
        <TestUser />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('groom').textContent).toBe('Abruhaset');
    });

    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('trans-and').textContent).toBe('and');

    // Click language option to toggle to Amharic ("am")
    screen.getByTestId('btn-am').click();

    // Wait for the state to update and re-render the language-specific values
    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('am');
    });

    expect(screen.getByTestId('groom').textContent).toBe('አብሩሃሴት');
    expect(screen.getByTestId('trans-and').textContent).toBe('እና');
  });
});
