import React, { useState } from 'react';
import { Space } from '../types';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Sparkles, 
  HeartHandshake, 
  Terminal, 
  Share2, 
  QrCode,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface InteractiveActionBarProps {
  currentSpace: Space | null;
  onOpenQuickReview: () => void;
  onNavigateTab: (tab: 'inbox' | 'wall' | 'collect' | 'embed' | 'metrics' | 'company' | 'python') => void;
  onOpenEmbedModal: () => void;
  onShowToast: (msg: string) => void;
}

export const InteractiveActionBar: React.FC<InteractiveActionBarProps> = ({
  currentSpace,
  onOpenQuickReview,
  onNavigateTab,
  onOpenEmbedModal,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!currentSpace) return null;

  const publicUrl = `${window.location.origin}/collect/${currentSpace.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    onShowToast(`Public link copied: /collect/${currentSpace.slug}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-4 mb-6 transition-all hover:border-slate-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Left: Active Space URL & Quick Copy */}
          <div className="flex items-center space-x-3 overflow-x-auto">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900 tracking-tight truncate">
                  {currentSpace.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                  /collect/{currentSpace.slug}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                Public customer collection link &amp; live embedding pipeline
              </p>
            </div>
          </div>

          {/* Right: Interactive Action Buttons */}
          <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
            
            {/* Copy Public Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            {/* View QR Code */}
            <button
              onClick={() => setShowQr(!showQr)}
              title="View QR Code for mobile review collection"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Test Live Public Form */}
            <button
              onClick={() => onNavigateTab('collect')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Test Form</span>
            </button>

            {/* Quick Add Review (Presets Modal) */}
            <button
              onClick={onOpenQuickReview}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Quick Add Review</span>
            </button>

          </div>

        </div>

        {/* QR Code Popover */}
        {showQr && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/70 p-4 rounded-xl">
            <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicUrl)}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="text-xs font-bold text-slate-900">Scan to Open Public Collection Form</div>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Customers can scan this QR code on desktop or print collateral to submit mobile feedback instantly without login.
              </p>
              <div className="text-[10px] font-mono text-indigo-600 truncate">{publicUrl}</div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
