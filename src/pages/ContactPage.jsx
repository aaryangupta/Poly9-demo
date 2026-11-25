import React, { useState } from 'react';
import { Mail, Phone, MapPin, Anchor, CheckCircle2, Send, Building } from 'lucide-react';
import companyInfo from '../data/companyInfo.json';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Contact Export Sales</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Connect directly with our factory export division in Moradabad, India for sample development, container bookings, and OEM manufacturing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-zinc-900">Factory & Office Headquarters</h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 block">Manufacturing Facility</span>
                  <span className="text-zinc-500 leading-relaxed">
                    SAG New Look Industrial Estate, Sambhal Road, Moradabad, Uttar Pradesh - 244001, India
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Anchor className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 block">Sea Ports of Loading</span>
                  <span className="text-zinc-500">Mundra Port (Gujarat) / Nhava Sheva JNPT (Mumbai)</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 block">Export Email</span>
                  <span className="text-zinc-500">{companyInfo.email}</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 block">Direct Factory Desk</span>
                  <span className="text-zinc-500">{companyInfo.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Trade Fair Participations</span>
              <div className="flex flex-wrap gap-1.5">
                {companyInfo.tradeFairs.map(fair => (
                  <span key={fair} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium">
                    {fair}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-zinc-900">Message Received</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Thank you for reaching out to SAG New Look. Our export merchandising manager will respond with pricing, catalog sheets, and technical details within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <h3 className="text-base font-bold text-zinc-900 mb-2">Send an Export Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name *</label>
                    <input type="text" required placeholder="John Doe" className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Company / Importer Name *</label>
                    <input type="text" required placeholder="Design Wholesale LLC" className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address *</label>
                    <input type="email" required placeholder="buyer@company.com" className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Country / Destination Port *</label>
                    <input type="text" required placeholder="Hamburg, Germany" className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Requirements / Message *</label>
                  <textarea rows="4" required placeholder="Tell us about your product interest, container volume, target FOB pricing, or finish preferences..." className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Factory Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
