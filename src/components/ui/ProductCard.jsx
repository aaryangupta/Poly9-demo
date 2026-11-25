import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Check, MessageSquare, Maximize2, Wand2 } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function ProductCard({ product, onInquire, onCustomize }) {
  const { addToSelection, isInSelection } = useSelection();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const inSelection = isInSelection(product.id);

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container - Clickable */}
      <div
        onClick={handleCardClick}
        className="relative aspect-[4/3] bg-zinc-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 bg-white/90 backdrop-blur-md text-zinc-800 rounded-full shadow-sm">
            {product.category}
          </span>
          {product.material && (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-900/80 backdrop-blur-md text-zinc-100 rounded-full">
              {product.material}
            </span>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.slug}`);
            }}
            className="p-2.5 bg-white text-zinc-900 rounded-full shadow-lg hover:scale-110 transition"
            title="View Details"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {onCustomize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCustomize(product);
              }}
              className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition"
              title="Customize Finishes & Materials in AI Studio"
            >
              <Wand2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onInquire(product);
            }}
            className="p-2.5 bg-zinc-900 text-white rounded-full shadow-lg hover:scale-110 transition"
            title="Ask about this product"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div onClick={handleCardClick} className="cursor-pointer">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span>SKU: {product.sku}</span>
            {product.moq && <span>MOQ: {product.moq} pcs</span>}
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-sm font-semibold text-zinc-900 hover:text-blue-600 transition line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Dimensions preview */}
          {product.dimensions && (product.dimensions.length || product.dimensions.width) && (
            <p className="text-[11px] text-zinc-500 mt-1">
              {product.dimensions.width ? `W ${product.dimensions.width}` : ''}
              {product.dimensions.height ? ` × H ${product.dimensions.height}` : ''}
              {product.dimensions.length ? ` × L ${product.dimensions.length}` : ''} {product.dimensions.unit}
            </p>
          )}
        </div>

        {/* Pricing & Add to Selection */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-400 block -mb-0.5">FOB Price</span>
            <span className="text-sm font-bold text-zinc-900">
              {formatPrice(product.priceUSD)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onCustomize && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomize(product);
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition flex items-center gap-1"
                title="Customize Finishes"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Customize</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToSelection(product);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                inSelection
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            >
              {inSelection ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
