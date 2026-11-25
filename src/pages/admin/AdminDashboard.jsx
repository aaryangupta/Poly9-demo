import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MessageSquare, FileSpreadsheet, Sparkles, ArrowUpRight, CheckCircle2, Clock, Wand2 } from 'lucide-react';
import productsData from '../../data/products.json';
import { useInquiries } from '../../context/InquiryContext';
import { useCustomization } from '../../context/CustomizationContext';
import { useCurrency } from '../../context/CurrencyContext';
import * as XLSX from 'xlsx';

export default function AdminDashboard() {
  const { inquiries } = useInquiries();
  const { customizations } = useCustomization();
  const { formatPrice } = useCurrency();

  const handleExportCatalog = () => {
    const dataToExport = productsData.map((p) => ({
      "SKU": p.sku,
      "Name": p.name,
      "Category": p.categoryFull,
      "Description": p.description,
      "Material": p.material,
      "Secondary Material": p.secondaryMaterial,
      "Finish": p.finish,
      "Colour": p.color,
      "Price INR": p.priceINR,
      "Price USD": p.priceUSD,
      "MOQ": p.moq,
      "Lead Time (Days)": p.leadTimeDays,
      "Length": p.dimensions?.length,
      "Width": p.dimensions?.width,
      "Height": p.dimensions?.height,
      "Unit": p.dimensions?.unit,
      "FOB Port": p.fobPort,
      "Image URL": p.imageUrl
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catalog");
    XLSX.writeFile(workbook, `SAG_New_Look_Complete_Catalog_664.xlsx`);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Real-time digital booth status, custom buyer Tech Packs, and inquiry lead management.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCatalog}
            className="px-4 py-2.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Catalog (.xlsx)</span>
          </button>
          <Link
            to="/admin/customizations"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition"
          >
            <Wand2 className="w-4 h-4" />
            <span>Review Custom Designs ({customizations.length})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <Package className="w-4 h-4 text-zinc-600" />
          </div>
          <span className="text-3xl font-extrabold text-zinc-900">{productsData.length}</span>
          <p className="text-[11px] text-emerald-600 font-medium">All active with FOB pricing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Buyer Custom Designs</span>
            <Wand2 className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-extrabold text-zinc-900">{customizations.length}</span>
          <p className="text-[11px] text-amber-700 font-bold">Custom Tech Packs & Renders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inquiries & Quotes</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-zinc-900">{inquiries.length}</span>
          <p className="text-[11px] text-zinc-500 font-medium">Active international buyers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Storefront Domain</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-base font-bold text-zinc-900 truncate block">sag-new-look</span>
          <p className="text-[11px] text-emerald-600 font-medium">Live & Accepting Custom Specs</p>
        </div>
      </div>

      {/* Recent Buyer Custom Designs Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex justify-between items-center bg-amber-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Latest Buyer Custom Designs & AI Studio Specs</h3>
              <p className="text-xs text-zinc-500">Live configurations submitted by buyers through the storefront customizer</p>
            </div>
          </div>
          <Link to="/admin/customizations" className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1">
            <span>View all custom specs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Design ID</th>
                <th className="p-3.5">Base Product</th>
                <th className="p-3.5">Custom Finish & Material</th>
                <th className="p-3.5">Buyer & Country</th>
                <th className="p-3.5">Qty / Est FOB</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {customizations.slice(0, 4).map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/60">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{c.id}</td>
                  <td className="p-3.5 font-bold text-zinc-900">{c.productName}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-amber-800 block">{c.finish}</span>
                    <span className="text-[10px] text-zinc-400">{c.accent}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-zinc-800 block">{c.buyerName}</span>
                    <span className="text-[11px] text-zinc-400">{c.company || 'Buyer'} · {c.country}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-zinc-900 block">{c.quantity} pcs</span>
                    <span className="text-emerald-700 text-[11px] font-semibold">{formatPrice(c.estimatedFobUsd)} / pc</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Buyer Inquiries Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Standard Buyer Inquiries (RFQ)</h3>
            <p className="text-xs text-zinc-500">Inbound catalog leads</p>
          </div>
          <Link to="/admin/inquiries" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Product Inquired</th>
                <th className="p-3.5">Buyer & Country</th>
                <th className="p-3.5">Target Qty</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {inquiries.slice(0, 4).map((inq) => (
                <tr key={inq.id} className="hover:bg-zinc-50/60">
                  <td className="p-3.5 text-zinc-500 whitespace-nowrap">{inq.date}</td>
                  <td className="p-3.5 font-bold text-zinc-900">{inq.productName}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-zinc-800 block">{inq.buyerName}</span>
                    <span className="text-[11px] text-zinc-400">{inq.country} · {inq.buyerEmail}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-zinc-700">{inq.quantity} pcs</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inq.status === 'Quoted'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : inq.status === 'Closed'
                        ? 'bg-zinc-100 text-zinc-700'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
