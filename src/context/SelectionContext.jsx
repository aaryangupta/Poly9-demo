import React, { createContext, useContext, useState, useEffect } from 'react';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sag_buyer_selection');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sag_buyer_selection', JSON.stringify(selectedItems));
  }, [selectedItems]);

  const addToSelection = (product, qty = 1) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty || product.moq || 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromSelection = (productId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromSelection(productId);
    } else {
      setSelectedItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isInSelection = (productId) => {
    return selectedItems.some(item => item.id === productId);
  };

  return (
    <SelectionContext.Provider value={{
      selectedItems,
      addToSelection,
      removeFromSelection,
      updateQuantity,
      clearSelection,
      isInSelection,
      isDrawerOpen,
      setIsDrawerOpen,
      totalCount: selectedItems.reduce((acc, curr) => acc + curr.quantity, 0)
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);
