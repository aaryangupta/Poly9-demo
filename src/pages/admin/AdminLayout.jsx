import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, Settings, ArrowLeft, ShieldCheck, Sparkles, LogOut, Wand2 } from 'lucide-react';
import { useCustomization } from '../../context/CustomizationContext';
import { useInquiries } from '../../context/InquiryContext';

export default function AdminLayout() {
  const location = useLocation();
  const { customizations } = useCustomization();
  const { inquiries } = useInquiries();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Catalog & Products', path: '/admin/catalog', icon: Package, badge: '664' },
    { label: 'Buyer Custom Designs', path: '/admin/customizations', icon: Wand2, badge: customizations.length, highlight: true },
    { label: 'Buyer Enquiries (RFQ)', path: '/admin/inquiries', icon: MessageSquare, badge: inquiries.length },
    { label: 'Booth & Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row text-zinc-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 text-white flex-shrink-0 flex flex-col justify-between p-5">
        <div className="space-y-6">
          {/* Logo & Booth Info */}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white text-zinc-900 rounded-lg flex items-center justify-center font-bold text-xs">
                SAG
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">SAG New Look</h2>
                <span className="text-[10px] text-zinc-400">Admin Control Center</span>
              </div>
            </div>
            <div className="mt-3 p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Booth Status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-white text-zinc-900 shadow-sm font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive 
                        ? 'bg-zinc-200 text-zinc-900' 
                        : item.highlight 
                        ? 'bg-amber-400 text-zinc-950' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-zinc-800 space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-800/60">
            <span className="text-[10px] text-zinc-400 block">Logged in as</span>
            <span className="font-semibold text-zinc-200 truncate block">suhail+SAG@polynine.com</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Full Admin Privileges</span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Public Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
