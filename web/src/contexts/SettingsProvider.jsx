import React from 'react';
import { ThemeProvider } from './ThemeContext.jsx';
import { LanguageProvider } from './LanguageContext.jsx';
import { CurrencyProvider } from './CurrencyContext.jsx';

export const SettingsProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};