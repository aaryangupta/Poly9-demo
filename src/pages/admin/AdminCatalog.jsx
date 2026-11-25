import React, { useState, useMemo } from 'react';
import { Search, Download, UploadCloud, Plus, Filter, Trash2, Eye, RefreshCw, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import BulkUploadModal from '../../components/admin/BulkUploadModal';
import AddProductModal from '../../components/admin/AddProductModal';
import * as XLSX from 'xlsx';

export default function AdminCatalog() {
  const { products, deleteProduct, resetToFactoryCatalog, totalCount } = useProducts();
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const itemsPerPage = 20;

  // Filter products
  const filtered = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'All' && !p.categoryFull.includes(selectedCategory)) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !p.material.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleExportXLSX = () => {
    const dataToExport = filtered.map(p => ({
      "SKU": p.sku,
      "Name": p.name,
      "Category": p.categoryFull,
      "Material": p.material,
      "Secondary Material": p.secondaryMaterial || '',
      "Finish": p.finish,
      "Colour": p.color,
      "Price INR": p.priceINR,
      "Price USD": p.priceUSD,
      "MOQ": p.moq,
      "Lead Time": p.leadTimeDays,
      "Dimensions": `${p.dimensions?.length || ''}x${p.dimensions?.width || ''}x${p.dimensions?.height || ''} ${p.dimensions?.unit || 'cm'}`,
      "Port": p.fobPort,
      "Image URL": p.imageUrl
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Catalog_Export");
    XLSX.writeFile(wb, `Catalog_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleDelete = (id, sku) => {
    if (window.confirm(`Are you sure you want to remove SKU ${sku} from the catalog?`)) {
      deleteProduct(id);
      showNotification(`Product ${sku} removed.`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Catalog Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-900 text-white">
              {totalCount} Live Products
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Bulk upload new products via Excel/CSV, manage live specifications, and export spreadsheets.
          </p>
        </div>

        {/* Action Buttons: Bulk Upload, Add Product, Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* BULK UPLOAD BUTTON */}
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Bulk Upload Products</span>
          </button>

          {/* ADD SINGLE PRODUCT */}
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* EXPORT TO EXCEL */}
          <button
            onClick={handleExportXLSX}
            className="px-3.5 py-2.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by SKU, product title, material..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          className="text-xs px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        >
          <option value="All">All Categories ({products.length})</option>
          <option value="Vases & Bowls">Vases & Bowls</option>
          <option value="Candles">Candles</option>
          <option value="Planters">Planters</option>
          <option value="Outdoor Accessories">Outdoor Accessories</option>
          <option value="Sculptures">Sculptures</option>
          <option value="Objects">Objects</option>
          <option value="Trays">Trays</option>
          <option value="Buffets & Sideboards">Buffets & Sideboards</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Image</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Material</th>
                <th className="p-3.5">FOB Price</th>
                <th className="p-3.5">MOQ</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition">
                  <td className="p-3.5">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white border" />
                  </td>
                  <td className="p-3.5 font-bold text-zinc-800">{p.sku}</td>
                  <td className="p-3.5 font-semibold text-zinc-900 max-w-[200px] truncate">{p.name}</td>
                  <td className="p-3.5 text-zinc-500">{p.category}</td>
                  <td className="p-3.5 text-zinc-600">{p.material} ({p.finish})</td>
                  <td className="p-3.5 font-extrabold text-zinc-900">{formatPrice(p.priceUSD)}</td>
                  <td className="p-3.5 text-zinc-600">{p.moq} pcs</td>
                  <td className="p-3.5 text-right space-x-2">
                    <a
                      href={`/products/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 inline-block"
                      title="View on Storefront"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(p.id, p.sku)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 inline-block"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer */}
        <div className="p-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
            </span>
            <button
              onClick={() => {
                if (window.confirm("Reset catalog back to the original 664 factory products? Any custom bulk imports will be cleared.")) {
                  resetToFactoryCatalog();
                  showNotification("Catalog reset to factory default (664 products).");
                }
              }}
              className="text-[11px] text-zinc-400 hover:text-zinc-600 underline"
            >
              Reset to Factory 664 Products
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 py-1.5 font-semibold">{currentPage} / {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {isBulkUploadOpen && (
        <BulkUploadModal
          onClose={() => setIsBulkUploadOpen(false)}
          onSuccess={(count) => {
            showNotification(`Successfully bulk imported ${count} products!`);
          }}
        />
      )}

      {/* Add Single Product Modal */}
      {isAddProductOpen && (
        <AddProductModal
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={(newProd) => {
            showNotification(`Product ${newProd.sku} added to catalog.`);
          }}
        />
      )}
    </div>
  );
}
