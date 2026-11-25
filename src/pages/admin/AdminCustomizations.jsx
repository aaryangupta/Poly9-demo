import React, { useState } from 'react';
import { useCustomization } from '../../context/CustomizationContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Wand2, Download, CheckCircle2, Clock, Mail, Building, Globe, Layers, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminCustomizations() {
  const { customizations, updateCustomizationStatus } = useCustomization();
  const { formatPrice } = useCurrency();
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = filterStatus === 'All' 
    ? customizations 
    : customizations.filter(c => c.status === filterStatus);

  const handleExportExcel = () => {
    const dataToExport = customizations.map(c => ({
      "Design ID": c.id,
      "Base SKU": c.baseSku,
      "Product Name": c.productName,
      "Buyer Name": c.buyerName,
      "Company": c.company,
      "Email": c.buyerEmail,
      "Country": c.country,
      "Material": c.material,
      "Custom Finish": c.finish,
      "Hardware Accents": c.accent,
      "Dimensions": c.dimensions,
      "Custom Prompt / Notes": c.aiPrompt || c.notes,
      "Quantity": c.quantity,
      "Estimated FOB (USD)": c.estimatedFobUsd,
      "Status": c.status,
      "Created At": c.createdAt
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CustomDesigns");
    XLSX.writeFile(wb, `SAG_Buyer_Custom_Designs_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Buyer Custom Designs & AI Studio Specs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {customizations.length} Custom Requests
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time feed of bespoke finishes, custom materials, dimensions, and Tech Packs configured by international buyers.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Custom Specs (.xlsx)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 pb-2">
        {['All', 'New Custom Request', 'Reviewing Spec', 'Sample In Production', 'Quoted FOB'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
              filterStatus === st
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {st} {st === 'All' ? `(${customizations.length})` : ''}
          </button>
        ))}
      </div>

      {/* Cards List of Custom Requests */}
      <div className="space-y-5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border text-zinc-500 text-xs">
            No custom designs found matching this filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 space-y-5 hover:border-zinc-300 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-900">{item.productName}</h3>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Base Catalog SKU: {item.baseSku} · Submitted on {item.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={item.status}
                    onChange={(e) => updateCustomizationStatus(item.id, e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="New Custom Request">Status: New Request</option>
                    <option value="Reviewing Spec">Status: Reviewing Spec</option>
                    <option value="Sample In Production">Status: Sample In Production</option>
                    <option value="Quoted FOB">Status: Quoted FOB</option>
                    <option value="Approved">Status: Approved</option>
                  </select>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Thumbnail */}
                <div className="lg:col-span-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50 border">
                    <img
                      src={item.customImageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md p-1.5 rounded-lg text-white text-[10px] text-center font-semibold">
                      Custom Finish: {item.finish}
                    </div>
                  </div>
                </div>

                {/* Customized Specification Recipe */}
                <div className="lg:col-span-5 space-y-2 text-xs">
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Configured Specification Recipe</h4>
                  <div className="bg-zinc-50 rounded-xl p-3.5 space-y-2 border border-zinc-200/70">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Custom Material:</span>
                      <strong className="text-zinc-900">{item.material}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Surface Finish:</span>
                      <strong className="text-amber-800 font-bold">{item.finish}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Hardware Accents:</span>
                      <strong className="text-zinc-900">{item.accent}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Configured Dimensions:</span>
                      <strong className="text-zinc-900">{item.dimensions}</strong>
                    </div>
                    {item.aiPrompt && (
                      <div className="pt-2 border-t border-zinc-200">
                        <span className="text-[10px] text-zinc-500 font-semibold block">Buyer Design Brief / Prompt:</span>
                        <p className="text-zinc-800 italic mt-0.5">"{item.aiPrompt}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buyer Lead & Commercial Info */}
                <div className="lg:col-span-4 space-y-2 text-xs">
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Buyer & Production Target</h4>
                  <div className="bg-white rounded-xl p-3.5 space-y-2 border border-zinc-200/80">
                    <div>
                      <span className="font-bold text-zinc-900 text-sm block">{item.buyerName}</span>
                      <span className="text-zinc-500">{item.company || 'Direct Buyer'} · {item.country}</span>
                    </div>
                    <div className="pt-1 text-zinc-600 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.buyerEmail}</span>
                      </p>
                      <p>Target Qty: <strong className="text-zinc-900 font-bold">{item.quantity} pcs</strong></p>
                      <p>Estimated FOB: <strong className="text-emerald-700 font-bold">{formatPrice(item.estimatedFobUsd)} / pc</strong></p>
                    </div>

                    <div className="pt-2">
                      <a
                        href={`mailto:${item.buyerEmail}?subject=Custom Sample Quote for ${encodeURIComponent(item.productName)} (${item.id})&body=Dear ${encodeURIComponent(item.buyerName)},%0D%0A%0D%0AThank you for configuring your custom specification for ${encodeURIComponent(item.productName)} with SAG New Look Moradabad.%0D%0A%0D%0AFinish: ${encodeURIComponent(item.finish)}%0D%0AQuantity: ${item.quantity} pcs%0D%0AEstimated FOB: ${formatPrice(item.estimatedFobUsd)}%0D%0A%0D%0ABest regards,%0D%0ASAG New Look Export Sales Desk`}
                        className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply with Proforma Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
