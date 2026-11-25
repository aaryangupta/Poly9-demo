import React, { useState } from 'react';
import companyInfo from '../../data/companyInfo.json';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: companyInfo.companyName,
    tagline: companyInfo.tagline,
    fobPort: companyInfo.fobPort,
    email: companyInfo.email,
    phone: companyInfo.phone,
    domain: "sag-new-look.poly9.ai",
    aiAssistantLanguages: "English, Hindi, Hinglish"
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Booth & Platform Settings</h1>
        <p className="text-xs text-zinc-500">
          Manage digital showroom branding, export sea ports, and AI sales configurations
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-5">
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Company / Showroom Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Live Storefront Subdomain</label>
            <input
              type="text"
              value={settings.domain}
              onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full text-xs px-3 py-2 border rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Default FOB Export Port</label>
            <input
              type="text"
              value={settings.fobPort}
              onChange={(e) => setSettings({ ...settings, fobPort: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">AI Assistant Multilingual Support</label>
            <input
              type="text"
              value={settings.aiAssistantLanguages}
              onChange={(e) => setSettings({ ...settings, aiAssistantLanguages: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Export Desk Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Factory Phone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition flex items-center gap-2 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
