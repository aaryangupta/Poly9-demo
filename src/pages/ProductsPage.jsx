import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../context/ProductContext';
import categoriesData from '../data/categories.json';

const MATERIALS = ['Aluminium', 'Iron', 'Wood', 'Glass', 'Brass'];

export default function ProductsPage({ onInquire, onCustomize }) {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (category !== 'All' && !product.categoryFull.toLowerCase().includes(category.toLowerCase())) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== 'All' && !product.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.categoryFull.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-high') return b.priceUSD - a.priceUSD;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [category, selectedMaterial, searchTerm, sortBy]);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const resetFilters = () => {
    setCategory('All');
    setSelectedMaterial('All');
    setSearchTerm('');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Export Catalog</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Showing {filteredProducts.length} of {products.length} handcrafted products with FOB pricing
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, SKU, finish, dimensions..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Material Select */}
          <div className="md:col-span-3">
            <select
              value={selectedMaterial}
              onChange={(e) => { setSelectedMaterial(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-700 font-medium"
            >
              <option value="All">All Materials</option>
              {MATERIALS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-700 font-medium"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">FOB Price: Low to High</option>
              <option value="price-high">FOB Price: High to Low</option>
              <option value="name">Alphabetical: A-Z</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="md:col-span-1 flex items-center">
            <button
              onClick={resetFilters}
              className="w-full py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => { setCategory('All'); setCurrentPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
              category === 'All'
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.name); setCurrentPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
                category === cat.name
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80 p-8">
          <h3 className="text-base font-bold text-zinc-900">No products match your criteria</h3>
          <p className="text-xs text-zinc-500 mt-1">Try resetting filters or searching for different keywords.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onInquire={onInquire} onCustomize={onCustomize} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 bg-white disabled:opacity-40 hover:bg-zinc-50"
          >
            Previous
          </button>

          <span className="text-xs text-zinc-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 bg-white disabled:opacity-40 hover:bg-zinc-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
