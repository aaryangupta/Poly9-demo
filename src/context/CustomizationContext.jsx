import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomizationContext = createContext();

const INITIAL_CUSTOMIZATIONS = [
  {
    id: "CUST-WSWTLC-001",
    baseSku: "WSWTLC-001",
    productName: "Wood Sideboard with Tapered Legs",
    buyerName: "Helena Vance",
    buyerEmail: "h.vance@nordicliving.de",
    company: "Nordic Living GmbH",
    country: "Germany",
    material: "Distressed Dark Walnut",
    finish: "Espresso Antique Wax",
    accent: "Brushed Brass Handles & Feet Caps",
    color: "Deep Walnut / Satin Gold",
    dimensions: "W 175 cm × H 85 cm × L 45 cm (+10% Custom Sizing)",
    notes: "Requires FSC certified mango wood and reinforced packaging for German distribution.",
    aiPrompt: "Distressed dark walnut stained wood with slim tapered legs capped in satin brushed brass.",
    estimatedFobUsd: 68.50,
    quantity: 50,
    status: "Reviewing Spec",
    createdAt: "2026-11-21",
    customImageUrl: "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/3e935d58-8027-40a0-8386-c136c57a198a/packshot.png"
  },
  {
    id: "CUST-TTV-09",
    baseSku: "TTV-09",
    productName: "Tall Textured Vase",
    buyerName: "Marcus Sterling",
    buyerEmail: "m.sterling@ateliermodern.co.uk",
    company: "Atelier Modern London",
    country: "United Kingdom",
    material: "Antique Brass / Hammered Gold",
    finish: "Hand-Hammered Specular Gold",
    accent: "Black Felt Padded Base",
    color: "Warm Antique Brass",
    dimensions: "H 60 cm × Dia 22 cm",
    notes: "We need matching floor urns for luxury hotel project in Mayfair.",
    aiPrompt: "Heavy artisanal hand-hammered indentations with aged brushed antique gold finish.",
    estimatedFobUsd: 12.80,
    quantity: 200,
    status: "Sample In Production",
    createdAt: "2026-11-20",
    customImageUrl: "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/36906fb6-7df7-5eac-ab36-b9fb1a3219aa/packshot-1791572488248.png"
  }
];

export const CustomizationProvider = ({ children }) => {
  const [customizations, setCustomizations] = useState(() => {
    try {
      const saved = localStorage.getItem('sag_customizations');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMIZATIONS;
    } catch {
      return INITIAL_CUSTOMIZATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('sag_customizations', JSON.stringify(customizations));
  }, [customizations]);

  const saveCustomization = (customData) => {
    const id = `CUST-${(customData.baseSku || 'CUSTOM').replace(/[^a-zA-Z0-9]/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newEntry = {
      id,
      createdAt: new Date().toISOString().split('T')[0],
      status: "New Custom Request",
      ...customData
    };
    setCustomizations(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateCustomizationStatus = (id, newStatus) => {
    setCustomizations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <CustomizationContext.Provider value={{
      customizations,
      saveCustomization,
      updateCustomizationStatus,
      totalCustomizations: customizations.length
    }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => useContext(CustomizationContext);
