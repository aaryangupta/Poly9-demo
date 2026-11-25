import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { SelectionProvider } from './context/SelectionContext';
import { InquiryProvider } from './context/InquiryContext';
import { CustomizationProvider } from './context/CustomizationContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SelectionDrawer from './components/layout/SelectionDrawer';
import InquiryModal from './components/ui/InquiryModal';
import AIAssistantModal from './components/ui/AIAssistantModal';
import ProductCustomizerModal from './components/customizer/ProductCustomizerModal';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import SelectionPage from './pages/SelectionPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminCustomizations from './pages/admin/AdminCustomizations';
import AdminSettings from './pages/admin/AdminSettings';

function StorefrontLayout({ onInquire, onInquireSelection, onOpenAI, onOpenCustomizer }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar onOpenAI={onOpenAI} onOpenCustomizer={onOpenCustomizer} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SelectionDrawer onProceedToInquiry={onInquireSelection} />
    </div>
  );
}

export default function App() {
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [inquirySelection, setInquirySelection] = useState([]);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // Customizer modal state
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const handleInquireProduct = (product) => {
    setInquiryProduct(product);
    setInquirySelection([]);
    setIsInquiryModalOpen(true);
  };

  const handleInquireSelection = (selection) => {
    setInquiryProduct(null);
    setInquirySelection(selection);
    setIsInquiryModalOpen(true);
  };

  const handleOpenCustomizer = (product) => {
    setCustomizerProduct(product);
    setIsCustomizerOpen(true);
  };

  return (
    <ProductProvider>
      <CurrencyProvider>
        <SelectionProvider>
          <InquiryProvider>
            <CustomizationProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route
                    element={
                      <StorefrontLayout
                        onInquire={handleInquireProduct}
                        onInquireSelection={handleInquireSelection}
                        onOpenAI={() => setIsAIOpen(true)}
                        onOpenCustomizer={handleOpenCustomizer}
                      />
                    }
                  >
                    <Route
                      path="/"
                      element={
                        <HomePage
                          onInquire={handleInquireProduct}
                          onOpenAI={() => setIsAIOpen(true)}
                          onCustomize={handleOpenCustomizer}
                        />
                      }
                    />
                    <Route
                      path="/products"
                      element={
                        <ProductsPage
                          onInquire={handleInquireProduct}
                          onCustomize={handleOpenCustomizer}
                        />
                      }
                    />
                    <Route
                      path="/products/:slug"
                      element={
                        <ProductDetailPage
                          onInquire={handleInquireProduct}
                          onOpenAI={() => setIsAIOpen(true)}
                          onCustomize={handleOpenCustomizer}
                        />
                      }
                    />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route
                      path="/col/me"
                      element={<SelectionPage onInquireSelection={handleInquireSelection} />}
                    />
                    <Route path="/contact" element={<ContactPage />} />
                  </Route>

                  {/* Admin Panel Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="catalog" element={<AdminCatalog />} />
                    <Route path="inquiries" element={<AdminInquiries />} />
                    <Route path="customizations" element={<AdminCustomizations />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>

                {/* Global Modals */}
                {isInquiryModalOpen && (
                  <InquiryModal
                    product={inquiryProduct}
                    selectedItems={inquirySelection}
                    onClose={() => setIsInquiryModalOpen(false)}
                  />
                )}

                {isAIOpen && (
                  <AIAssistantModal onClose={() => setIsAIOpen(false)} />
                )}

                {isCustomizerOpen && customizerProduct && (
                  <ProductCustomizerModal
                    product={customizerProduct}
                    onClose={() => setIsCustomizerOpen(false)}
                  />
                )}
              </BrowserRouter>
            </CustomizationProvider>
          </InquiryProvider>
        </SelectionProvider>
      </CurrencyProvider>
    </ProductProvider>
  );
}
