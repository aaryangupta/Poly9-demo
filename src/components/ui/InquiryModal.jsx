import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, Mail, Phone, Globe, MessageSquare } from 'lucide-react';
import { useInquiries } from '../../context/InquiryContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function InquiryModal({ product, onClose, selectedItems = [] }) {
  const { submitInquiry } = useInquiries();
  const { formatPrice } = useCurrency();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    company: '',
    phone: '',
    country: '',
    targetDelivery: 'Spring 2027',
    quantity: product ? (product.moq || 50) : 100,
    message: product
      ? `Hello SAG New Look team, we are interested in receiving a formal FOB quotation for ${product.name} (SKU: ${product.sku}). Please share packaging dimensions and production lead time.`
      : `Hello SAG New Look team, please provide a consolidated FOB quote for our ${selectedItems.length} selected items.`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitInquiry({
      productName: product ? product.name : `Curated Selection (${selectedItems.length} products)`,
      productSku: product ? product.sku : 'SELECTION-PACK',
      buyerName: formData.buyerName,
      buyerEmail: formData.buyerEmail,
      company: formData.company,
      country: formData.country,
      quantity: Number(formData.quantity),
      message: formData.message,
      targetDelivery: formData.targetDelivery
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Request Quotation / RFQ</h3>
            <p className="text-xs text-zinc-500">
              {product ? `Inquiring about ${product.name}` : `Inquiring about ${selectedItems.length} products`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900">Inquiry Submitted Successfully</h4>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">
              Thank you! Our Moradabad export sales desk will review your specifications and reply with a formal proforma quote within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Product summary card if single product */}
            {product && (
              <div className="flex gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 items-center">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-white border" />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-zinc-900 truncate">{product.name}</h5>
                  <p className="text-[11px] text-zinc-500">SKU: {product.sku} · FOB: {formatPrice(product.priceUSD)}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suhail Khan"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="buyer@company.com"
                  value={formData.buyerEmail}
                  onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nordic Imports LLC"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Country / Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States, Germany"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Estimated Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Target Shipment Date</label>
                <input
                  type="text"
                  placeholder="e.g. Jan - Feb 2027"
                  value={formData.targetDelivery}
                  onChange={(e) => setFormData({ ...formData, targetDelivery: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Customization & Notes</label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Export RFQ</span>
              </button>
              <p className="text-[10px] text-zinc-400 text-center mt-2">
                Typical response within one business day · FOB Port: Mundra / Nhava Sheva
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
