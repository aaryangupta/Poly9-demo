import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const RATES = {
  USD: { symbol: '$', rate: 1.0, name: 'USD ($)' },
  INR: { symbol: '₹', rate: 83.2, name: 'INR (₹)' },
  EUR: { symbol: '€', rate: 0.92, name: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, name: 'GBP (£)' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (usdPrice) => {
    if (usdPrice === null || usdPrice === undefined || isNaN(usdPrice)) return 'Inquire for price';
    const info = RATES[currency] || RATES.USD;
    const converted = usdPrice * info.rate;
    return `${info.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
