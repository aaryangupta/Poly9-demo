import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Check, MessageSquare, ArrowLeft, ShieldCheck, Box, Anchor, Sparkles, Share2, ZoomIn, PackageCheck, Wand2, Palette } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSelection } from '../context/SelectionContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ui/ProductCard';

const SAMPLE_FINISH_SWATCHES = [
  { name: 'Antique Brass', color: '#d4af37' },
  { name: 'Matte Black', color: '#1e1e24' },
  { name: 'Polished Aluminium', color: '#d1d5db' },
  { name: 'Natural Mango', color: '#c19a6b' },
  { name: 'Dark Walnut', color: '#4a2c11' },
  { name: 'Verdigris Patina', color: '#2e8b57' },
  { name: 'Hammered Copper', color: '#b87333' },
];

export default function ProductDetailPage({ onInquire, onOpenAI, onCustomize }) {
  const { slug } = useParams();
  const { products } = useProducts();
  const { addToSelection, isInSelection } = useSelection();
  const { formatPrice } = useCurrency();
  const [qty, setQty] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Match by slug or id
  const product = products.find(p => p.slug === slug || p.id === slug) || products[0];
  const inSelection = product ? isInSelection(product.id) : false;

  // Related products from same category
  const related = product
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-zinc-900">Product not found</h2>
        <Link to="/products" className="text-sm text-zinc-600 underline mt-4 inline-block">Return to Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb back link */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link to="/" className="hover:text-zinc-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-zinc-900">Products</Link>
        <span>/</span>
        <span className="text-zinc-400">{product.category}</span>
        <span>/</span>
        <span className="text-zinc-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images with Zoom */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onClick={() => setZoomOpen(true)}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-md cursor-zoom-in group"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5 shadow-md">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Roll over to zoom · Click for expanded view</span>
            </div>
            <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              {product.category}
            </div>
          </div>

          {/* Customizer Callout Card under image */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 rounded-2xl border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-600 flex-shrink-0">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">Want a custom finish, material or dimension?</h4>
                <p className="text-[11px] text-zinc-600">
                  Configure this item in our AI Studio and see the finish rebuild in real-time.
                </p>
              </div>
            </div>

            <button
              onClick={() => onCustomize(product)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md flex-shrink-0"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Customize Product</span>
            </button>
          </div>
        </div>

        {/* Right: Product Specifications & Curation */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              SKU: {product.sku}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
              {product.name}
            </h1>
          </div>

          {/* Pricing Card */}
          <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 space-y-1">
            <span className="text-xs text-zinc-500 font-medium">Export FOB Price:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-900">
                {formatPrice(product.priceUSD)}
              </span>
              <span className="text-xs text-zinc-400">/ pc FOB Mundra / JNPT</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
              <span>Minimum Order Quantity (MOQ): <strong className="text-zinc-800">{product.moq} pcs</strong></span>
              <span className="text-emerald-600 font-semibold">● Production Ready</span>
            </div>
          </div>

          {/* Available Finishes Swatch Row */}
          <div className="space-y-2 p-3.5 bg-white rounded-2xl border border-zinc-200/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-800">Available Custom Finishes:</span>
              <button
                onClick={() => onCustomize(product)}
                className="text-[11px] text-amber-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Open in AI Studio</span>
                <span>→</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {SAMPLE_FINISH_SWATCHES.map((sw, i) => (
                <button
                  key={i}
                  onClick={() => onCustomize(product)}
                  className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-125 transition-transform"
                  style={{ backgroundColor: sw.color }}
                  title={`Customize with ${sw.name}`}
                />
              ))}
              <span className="text-[10px] text-zinc-400 pl-1">+ More</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Customizer Button */}
            <button
              onClick={() => onCustomize(product)}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg group"
            >
              <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Customize This Product in AI Studio (Finishes, Materials & 3D Render)</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => addToSelection(product, qty)}
                className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md ${
                  inSelection
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}
              >
                {inSelection ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Line Sheet</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Selection</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onInquire(product)}
                className="py-3.5 px-5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask about this product</span>
              </button>
            </div>

            <button
              onClick={onOpenAI}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ask SAG AI Assistant in English / Hindi / Hinglish</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">About this product</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specification Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200 text-xs">
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="text-zinc-500">Primary Material</span>
              <span className="font-semibold text-zinc-900">{product.material}</span>
            </div>
            {product.secondaryMaterial && (
              <div className="grid grid-cols-2 p-3 bg-zinc-50">
                <span className="text-zinc-500">Secondary Material</span>
                <span className="font-semibold text-zinc-900">{product.secondaryMaterial}</span>
              </div>
            )}
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="text-zinc-500">Surface Finish</span>
              <span className="font-semibold text-zinc-900">{product.finish}</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-zinc-50">
              <span className="text-zinc-500">Colour</span>
              <span className="font-semibold text-zinc-900">{product.color}</span>
            </div>
            {product.dimensions && (
              <div className="grid grid-cols-2 p-3 bg-white">
                <span className="text-zinc-500">Dimensions</span>
                <span className="font-semibold text-zinc-900">
                  {product.dimensions.length ? `L ${product.dimensions.length} ` : ''}
                  {product.dimensions.width ? `× W ${product.dimensions.width} ` : ''}
                  {product.dimensions.height ? `× H ${product.dimensions.height} ` : ''}
                  {product.dimensions.unit}
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 p-3 bg-zinc-50">
              <span className="text-zinc-500">Production Lead Time</span>
              <span className="font-semibold text-zinc-900">{product.leadTimeDays} days</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="text-zinc-500">Port of Loading</span>
              <span className="font-semibold text-zinc-900">{product.fobPort}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setZoomOpen(false)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <p className="text-center text-white text-xs mt-3">{product.name} · SKU: {product.sku}</p>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-zinc-200 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900">More in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(r => (
              <ProductCard key={r.id} product={r} onInquire={onInquire} onCustomize={onCustomize} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
