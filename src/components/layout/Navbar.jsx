import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Globe, Menu, X, ShieldCheck, Sparkles, SlidersHorizontal, Wand2 } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts } from '../../context/ProductContext';

export default function Navbar({ onOpenAI, onOpenCustomizer }) {
  const { totalCount: selectionCount, setIsDrawerOpen } = useSelection();
  const { currency, setCurrency, RATES } = useCurrency();
  const { products, totalCount } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Export Notice Bar */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-white">SAG New Look Moradabad</span>
            <span className="hidden sm:inline text-zinc-400">· Handcrafted Aluminium, Iron, Wood & Glass Décor</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-300 text-[11px]">
            <span className="hidden md:inline">FOB Mundra / Nhava Sheva</span>
            <Link to="/admin" className="text-zinc-200 hover:text-white underline font-semibold transition">
              Backend Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex flex-col flex-shrink-0 group">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 transition">
              SAG NEW LOOK
            </span>
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-medium">
              Moradabad · India
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-600">
            <Link to="/" className="hover:text-zinc-900 transition">Home</Link>
            <Link to="/products" className="hover:text-zinc-900 transition flex items-center gap-1.5">
              Products
              <span className="text-[11px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-full font-semibold">{totalCount}</span>
            </Link>
            <Link to="/categories" className="hover:text-zinc-900 transition">Categories</Link>
            <Link to="/col/me" className="hover:text-zinc-900 transition">Line Sheets</Link>
            <Link to="/contact" className="hover:text-zinc-900 transition">Contact</Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search ${totalCount}+ products, SKU, finishes...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition"
            />
          </form>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Customizer Studio Trigger */}
            <button
              onClick={() => onOpenCustomizer && onOpenCustomizer(products[0])}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/90 text-amber-900 rounded-full hover:from-amber-100 hover:to-rose-100 transition shadow-sm"
              title="Open AI Product Customizer & Studio"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">AI Customizer</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-800 rounded-full hover:from-blue-100 hover:to-indigo-100 transition shadow-sm"
              title="Ask SAG AI Sales Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Assistant</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-xs bg-zinc-100 text-zinc-800 font-semibold border-0 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                {Object.keys(RATES).map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            {/* Selection / Cart Drawer Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition"
              aria-label="View Selection"
            >
              <ShoppingBag className="w-5 h-5" />
              {selectionCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {selectionCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </form>
            <div className="flex flex-col gap-2 pt-2 text-sm font-medium">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded-md hover:bg-zinc-100">Home</Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded-md hover:bg-zinc-100 flex items-center justify-between">
                <span>Products</span>
                <span className="text-xs bg-zinc-100 px-2 py-0.5 rounded-full">{totalCount}</span>
              </Link>
              <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded-md hover:bg-zinc-100">Categories</Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCustomizer) onOpenCustomizer(products[0]);
                }}
                className="text-left px-2 py-1.5 rounded-md hover:bg-zinc-100 text-amber-700 font-bold flex items-center gap-1.5"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Product Customizer</span>
              </button>
              <Link to="/col/me" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded-md hover:bg-zinc-100">Buyer Selection (Line Sheets)</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded-md hover:bg-zinc-100">Contact</Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded-md bg-zinc-900 text-white font-semibold text-center mt-2">
                Open Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
