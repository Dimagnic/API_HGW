import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const rates = {
  USD: 1, MXN: 16.80, PEN: 3.75, ARS: 880.00, COP: 3900.00, BRL: 5.10, CLP: 940.00, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.52
};

const locales = {
  USD: 'en-US', MXN: 'es-MX', PEN: 'es-PE', ARS: 'es-AR', COP: 'es-CO', BRL: 'pt-BR', CLP: 'es-CL', EUR: 'de-DE', GBP: 'en-GB', CAD: 'en-CA', AUD: 'en-AU'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatCurrency = (amount) => {
    const rate = rates[currency] || 1;
    const converted = amount * rate;
    const locale = locales[currency] || 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);