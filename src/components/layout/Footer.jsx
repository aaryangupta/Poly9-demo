import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Anchor, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import companyInfo from '../../data/companyInfo.json';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 text-sm mt-20 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-lg font-bold tracking-tight">SAG NEW LOOK</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {companyInfo.description}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{companyInfo.location}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Anchor className="w-4 h-4 text-zinc-500" />
                <span>Export Port: {companyInfo.fobPort}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span>{companyInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">Export Lines</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Vases%20%26%20Bowls" className="hover:text-white transition">Vases & Bowls</Link></li>
              <li><Link to="/products?category=Candles" className="hover:text-white transition">Candles & Lanterns</Link></li>
              <li><Link to="/products?category=Planters" className="hover:text-white transition">Metal & Sheet Planters</Link></li>
              <li><Link to="/products?category=Outdoor%20Accessories" className="hover:text-white transition">Outdoor Accessories</Link></li>
              <li><Link to="/products?category=Sculptures" className="hover:text-white transition">Aluminium Sculptures</Link></li>
              <li><Link to="/products?category=Trays" className="hover:text-white transition">Decorative Trays</Link></li>
            </ul>
          </div>

          {/* B2B Services */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">B2B Trade</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/col/me" className="hover:text-white transition">Custom Line Sheets</Link></li>
              <li><Link to="/products" className="hover:text-white transition">FOB Price Inquiry</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Sample Request</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Custom Finishes</Link></li>
              <li><span className="text-zinc-500">IHGF Delhi Booth</span></li>
            </ul>
          </div>

          {/* Management / System */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">Management</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition">
                  <span>Backend Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li><Link to="/admin/catalog" className="hover:text-white transition">Catalog Sheet View</Link></li>
              <li><Link to="/admin/inquiries" className="hover:text-white transition">Buyer RFQ Leads</Link></li>
              <li><Link to="/admin/settings" className="hover:text-white transition">Booth Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} SAG New Look. All rights reserved. Handcrafted Moradabad Export Software.</p>
          <p className="text-[11px] text-zinc-400">Independent Standalone Software Replica</p>
        </div>
      </div>
    </footer>
  );
}
