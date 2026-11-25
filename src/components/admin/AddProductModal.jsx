import React, { useState } from 'react';
import { X, Plus, Package, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

const CATEGORIES = [
  'Vases & Bowls',
  'Candles',
  'Planters',
  'Outdoor Accessories',
  'Sculptures',
  'Objects',
  'Trays',
  'Buffets & Sideboards',
  'Coffee, Cocktail & Tea'
];

const MATERIALS = ['Aluminium', 'Iron', 'Mango Wood', 'Acacia Wood', 'Glass', 'Brass'];

export default function AddProductModal({ onClose, onSuccess }) {
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: CATEGORIES[0],
    material: MATERIALS[0],
    secondaryMaterial: '',
    finish: 'Natural',
    color: 'Metallic',
    priceUSD: '',
    priceINR: '',
    moq: 10,
    leadTimeDays: 30,
    width: '',
    height: '',
    length: '',
    dimensionUnit: 'cm',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    const newProd = addProduct({
      ...formData,
      priceUSD: parseFloat(formData.priceUSD) || 20,
      priceINR: parseFloat(formData.priceINR) || (parseFloat(formData.priceUSD) * 83.2) || 1664
    });

    if (onSuccess) onSuccess(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-zinc-200">
        
        {/* Header */}
        <div className="p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Add Single Product</h3>
              <p className="text-xs text-zinc-400">Add an individual item directly to the catalog</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">SKU *</label>
              <input
                type="text"
                required
                placeholder="e.g. SAG-VB-101"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Hand-Carved Mango Wood Bowl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 border rounded-xl bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Primary Material</label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full p-2.5 border rounded-xl bg-white"
              >
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Finish</label>
              <input
                type="text"
                placeholder="e.g. Antique Brass, Natural Oil"
                value={formData.finish}
                onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">FOB Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 24.50"
                value={formData.priceUSD}
                onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">MOQ (pcs)</label>
              <input
                type="number"
                min="1"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Width (cm)</label>
              <input
                type="number"
                placeholder="e.g. 35"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Height (cm)</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Length (cm)</label>
              <input
                type="number"
                placeholder="e.g. 35"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.poly9.ai/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
            <p className="text-[10px] text-zinc-400 mt-1">Leave empty to use a standard Moradabad export packshot render.</p>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Exquisite handcrafted decor piece made in Moradabad..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div className="pt-3 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl font-semibold hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
