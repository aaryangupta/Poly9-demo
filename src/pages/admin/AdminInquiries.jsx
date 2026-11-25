import React from 'react';
import { useInquiries } from '../../context/InquiryContext';
import { CheckCircle2, Clock, Mail, MessageSquare } from 'lucide-react';

export default function AdminInquiries() {
  const { inquiries, updateInquiryStatus } = useInquiries();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Buyer RFQs & Inquiries</h1>
        <p className="text-xs text-zinc-500">
          Inbound product inquiries received from the digital storefront and line sheets
        </p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-100">
              <div>
                <span className="text-xs font-bold text-zinc-900">{inq.productName}</span>
                <span className="text-[11px] text-zinc-400 ml-2">SKU: {inq.productSku}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">{inq.date}</span>
                <select
                  value={inq.status}
                  onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                    inq.status === 'Quoted'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : inq.status === 'Closed'
                      ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <option value="New">Status: New</option>
                  <option value="Quoted">Status: Quoted</option>
                  <option value="Closed">Status: Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-zinc-400 block">Buyer Name</span>
                <span className="font-semibold text-zinc-800">{inq.buyerName}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Email / Contact</span>
                <span className="font-semibold text-zinc-800">{inq.buyerEmail}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Destination Country</span>
                <span className="font-semibold text-zinc-800">{inq.country}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-700 space-y-1">
              <span className="font-semibold text-zinc-500 block text-[11px]">Buyer Message / Specification:</span>
              <p>{inq.message}</p>
              <div className="pt-1 flex gap-4 text-[11px] text-zinc-500 font-medium">
                <span>Requested Qty: <strong>{inq.quantity} pcs</strong></span>
                <span>Target Delivery: <strong>{inq.targetDelivery}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
