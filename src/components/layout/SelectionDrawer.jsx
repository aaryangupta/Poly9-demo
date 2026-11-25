import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ArrowRight, FileSpreadsheet, Send } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function SelectionDrawer({ onProceedToInquiry }) {
  const { selectedItems, isDrawerOpen, setIsDrawerOpen, removeFromSelection, updateQuantity, clearSelection } = useSelection();
  const { formatPrice } = useCurrency();

  if (!isDrawerOpen) return null;

  const totalEstimateUSD = selectedItems.reduce((acc, item) => {
    return acc + (item.priceUSD * (item.quantity || 1));
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Buyer Selection</h2>
              <p className="text-xs text-zinc-500">
                {selectedItems.length} product{selectedItems.length === 1 ? '' : 's'} curated for line sheet
              </p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            {selectedItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-zinc-900">Your selection is empty</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Click "Add to selection" on any product to curate a line sheet for quotation.
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-4 inline-block text-xs font-semibold text-zinc-900 underline"
                >
                  Browse catalog →
                </Link>
              </div>
            ) : (
              selectedItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-white border border-zinc-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-zinc-500">SKU: {item.sku}</p>
                    <p className="text-xs font-bold text-zinc-900 mt-1">
                      {formatPrice(item.priceUSD)} <span className="text-[10px] text-zinc-400 font-normal">FOB</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-zinc-300 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-zinc-800">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-400">MOQ: {item.moq}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromSelection(item.id)}
                    className="text-zinc-400 hover:text-red-500 p-1 self-start"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {selectedItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-200 bg-zinc-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Estimated FOB Value:</span>
                <span className="text-base font-bold text-zinc-900">
                  {formatPrice(totalEstimateUSD)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/col/me"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2.5 px-3 bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Line Sheet</span>
                </Link>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onProceedToInquiry) onProceedToInquiry(selectedItems);
                  }}
                  className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request RFQ</span>
                </button>
              </div>
              <button
                onClick={clearSelection}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-zinc-600 transition"
              >
                Clear all selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
