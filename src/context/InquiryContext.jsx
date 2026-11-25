import React, { createContext, useContext, useState, useEffect } from 'react';

const InquiryContext = createContext();

const INITIAL_INQUIRIES = [
  {
    id: "inq-001",
    productName: "Tall Textured Vase",
    productSku: "TTV-09",
    buyerName: "Jay showroom",
    buyerEmail: "jay@homedecorimports.com",
    country: "United States",
    status: "Quoted",
    date: "2026-10-25",
    quantity: 150,
    message: "Interested in 150 pcs for spring collection. Can you ship CIF Long Beach?",
    targetDelivery: "Jan 2027"
  },
  {
    id: "inq-002",
    productName: "Wood Sideboard with Tapered Legs",
    productSku: "WSWTLC-001",
    buyerName: "Helena Vance",
    buyerEmail: "h.vance@nordicliving.de",
    country: "Germany",
    status: "Quoted",
    date: "2026-10-26",
    quantity: 25,
    message: "Looking for sample approval first. Can we get natural oiled finish swatch?",
    targetDelivery: "Feb 2027"
  },
  {
    id: "inq-003",
    productName: "Grey Sheet Metal Planter",
    productSku: "GSMP-14",
    buyerName: "Marcello Rossi",
    buyerEmail: "m.rossi@giardinidesign.it",
    country: "Italy",
    status: "New",
    date: "2026-11-15",
    quantity: 500,
    message: "Seeking bulk container pricing with customized drainage holes.",
    targetDelivery: "March 2027"
  }
];

export const InquiryProvider = ({ children }) => {
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('sag_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('sag_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const submitInquiry = (inquiryData) => {
    const newInq = {
      id: `inq-${Date.now().toString(36)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      ...inquiryData
    };
    setInquiries(prev => [newInq, ...prev]);
    return newInq;
  };

  const updateInquiryStatus = (id, newStatus) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <InquiryContext.Provider value={{ inquiries, submitInquiry, updateInquiryStatus }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiries = () => useContext(InquiryContext);
