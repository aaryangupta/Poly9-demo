import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, FileSpreadsheet, Send, ArrowLeft, Download, ShoppingBag } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useSelection } from '../context/SelectionContext';
import { useCurrency } from '../context/CurrencyContext';

export default function SelectionPage({ onInquireSelection }) {
  const { selectedItems, removeFromSelection, updateQuantity, clearSelection } = useSelection();
  const { formatPrice, currency } = useCurrency();

  const totalEstimateUSD = selectedItems.reduce((acc, item) => {
    return acc + (item.priceUSD * (item.quantity || 1));
  }, 0);

  // Export to Excel line sheet
  const handleExportExcel = () => {
    if (selectedItems.length === 0) return;

    const dataToExport = selectedItems.map((item, idx) => ({
      "Item #": idx + 1,
      "SKU": item.sku,
      "Product Name": item.name,
      "Category": item.category,
      "Material": item.material,
      "Finish": item.finish,
      "Color": item.color,
      "FOB Price (USD)": item.priceUSD,
      "Quantity": item.quantity || 1,
      "Extended Total (USD)": (item.priceUSD * (item.quantity || 1)).toFixed(2),
      "Dimensions": item.dimensions ? `${item.dimensions.length || ''}x${item.dimensions.width || ''}x${item.dimensions.height || ''} ${item.dimensions.unit || 'cm'}` : '',
      "MOQ": item.moq,
      "Port of Loading": item.fobPort
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LineSheet");
    XLSX.writeFile(workbook, `SAG_New_Look_LineSheet_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/products" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Buyer Line Sheet & Selection</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Curated assortment for export quotation, sampling, or container planning.
          </p>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-zinc-600" />
              <span>Export to Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => onInquireSelection(selectedItems)}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Request Formal RFQ</span>
            </button>
          </div>
        )}
      </div>

      {selectedItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-zinc-200/80 p-8">
          <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">Your selection line sheet is empty</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            Browse our 664 Moradabad products and select items to generate custom line sheets, export quotation packs, or request container estimates.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-zinc-800 transition"
          >
            Explore 664 Products →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Table */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU / Material</th>
                    <th className="p-4">Dimensions</th>
                    <th className="p-4">FOB Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Extended FOB</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {selectedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white border border-zinc-200" />
                          <div>
                            <Link to={`/products/${item.slug}`} className="font-bold text-zinc-900 hover:text-blue-600 line-clamp-1">
                              {item.name}
                            </Link>
                            <span className="text-[11px] text-zinc-400">{item.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-zinc-800">{item.sku}</span>
                        <span className="block text-[11px] text-zinc-500">{item.material} · {item.finish}</span>
                      </td>
                      <td className="p-4 text-zinc-600">
                        {item.dimensions && (item.dimensions.length || item.dimensions.width) ? (
                          `${item.dimensions.width || '-'} × ${item.dimensions.height || '-'} × ${item.dimensions.length || '-'} ${item.dimensions.unit}`
                        ) : 'Standard'}
                      </td>
                      <td className="p-4 font-bold text-zinc-900">
                        {formatPrice(item.priceUSD)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center border border-zinc-300 rounded-lg bg-white w-24">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="px-2 py-1 text-zinc-500 hover:bg-zinc-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-full text-center text-xs font-semibold focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="px-2 py-1 text-zinc-500 hover:bg-zinc-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-zinc-900">
                        {formatPrice(item.priceUSD * (item.quantity || 1))}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => removeFromSelection(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Remove from selection"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={clearSelection}
                className="text-xs text-zinc-500 hover:text-red-600 font-medium transition"
              >
                Clear all {selectedItems.length} items
              </button>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs text-zinc-500 block">Total Estimated FOB Value</span>
                  <span className="text-2xl font-extrabold text-zinc-900">
                    {formatPrice(totalEstimateUSD)}
                  </span>
                </div>
                <button
                  onClick={() => onInquireSelection(selectedItems)}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
