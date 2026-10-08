import React, { useState } from 'react';
import { Space, Testimonial, EmbedConfig } from '../types';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  LayoutGrid, 
  SlidersHorizontal, 
  Award, 
  Star, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface EmbedGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space;
  testimonials: Testimonial[];
}

export const EmbedGeneratorModal: React.FC<EmbedGeneratorModalProps> = ({
  isOpen,
  onClose,
  space,
  testimonials,
}) => {
  const [config, setConfig] = useState<EmbedConfig>({
    theme: 'light',
    layout: 'grid',
    maxItems: 6,
    showRating: true,
    showAvatar: true,
    showDate: true,
    accentColor: space?.brandColor || '#4f46e5',
  });

  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'iframe'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const approvedReviews = testimonials
    .filter((t) => t.spaceSlug === space.slug && t.status === 'approved')
    .slice(0, config.maxItems);

  // Generate HTML embed snippet
  const htmlSnippet = `<!-- Acme Proof Social Proof Widget -->
<div id="acme-proof-widget" data-space="${space.slug}" data-layout="${config.layout}" data-theme="${config.theme}">
  <script src="${window.location.origin}/embed.js" async></script>
</div>`;

  // Generate iframe embed snippet
  const iframeSnippet = `<!-- Acme Proof Iframe Widget -->
<iframe
  src="${window.location.origin}/embed/${space.slug}?layout=${config.layout}&theme=${config.theme}&rating=${config.showRating}&avatar=${config.showAvatar}"
  width="100%"
  height="${config.layout === 'badge' ? '180px' : '520px'}"
  frameborder="0"
  scrolling="no"
  style="border:none; border-radius: 16px; overflow: hidden; max-width: 100%;"
></iframe>`;

  const currentSnippet = activeCodeTab === 'html' ? htmlSnippet : iframeSnippet;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Social Proof Embed Generator</h3>
              <p className="text-[11px] text-slate-400">
                Customize & embed verified reviews on Webflow, Shopify, WordPress, or React
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Configuration Controls (5 cols) */}
          <div className="lg:col-span-5 p-6 space-y-5 bg-slate-50/50">
            
            {/* Layout Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Widget Layout
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'grid', label: 'Masonry Grid', icon: LayoutGrid },
                  { id: 'carousel', label: 'Carousel Slider', icon: SlidersHorizontal },
                  { id: 'badge', label: 'Quote Badge', icon: Award },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = config.layout === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setConfig({ ...config, layout: item.id as any })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-indigo-600 bg-white text-indigo-600 shadow-xs ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Theme Palette
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'light', label: 'Light', bg: 'bg-white', border: 'border-slate-300' },
                  { id: 'dark', label: 'Dark', bg: 'bg-slate-900', border: 'border-slate-700' },
                  { id: 'slate', label: 'Slate', bg: 'bg-slate-800', border: 'border-slate-600' },
                  { id: 'zinc', label: 'Minimal', bg: 'bg-zinc-100', border: 'border-zinc-300' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setConfig({ ...config, theme: theme.id as any })}
                    className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-all ${
                      config.theme === theme.id
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20 bg-white text-indigo-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${theme.bg} ${theme.border} border`} />
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Options
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
                <span className="text-xs font-medium text-slate-700">Display 5★ Star Rating</span>
                <input
                  type="checkbox"
                  checked={config.showRating}
                  onChange={(e) => setConfig({ ...config, showRating: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
                <span className="text-xs font-medium text-slate-700">Client Avatar Photos</span>
                <input
                  type="checkbox"
                  checked={config.showAvatar}
                  onChange={(e) => setConfig({ ...config, showAvatar: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
                <span className="text-xs font-medium text-slate-700">Display Submission Date</span>
                <input
                  type="checkbox"
                  checked={config.showDate}
                  onChange={(e) => setConfig({ ...config, showDate: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>

            {/* Max Items */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Max Testimonials:</span>
                <span className="font-bold text-indigo-600">{config.maxItems} items</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={config.maxItems}
                onChange={(e) => setConfig({ ...config, maxItems: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

          </div>

          {/* Right Column: Live Preview & Code Snippet (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-5 flex flex-col justify-between">
            
            {/* Live Interactive Widget Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Live Widget Preview
                </span>
                <span className="text-[11px] text-slate-400">
                  {approvedReviews.length} approved testimonials rendered
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl border transition-colors max-h-[290px] overflow-y-auto ${
                  config.theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 text-white'
                    : config.theme === 'slate'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : config.theme === 'zinc'
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-900'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {config.layout === 'badge' ? (
                  // Single Badge / Quote Layout
                  <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 shadow-xs flex items-center space-x-4">
                    {config.showAvatar && (
                      <img
                        src={approvedReviews[0]?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/20"
                      />
                    )}
                    <div className="truncate">
                      {config.showRating && (
                        <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      )}
                      <p className="text-xs italic truncate font-medium">
                        &ldquo;{approvedReviews[0]?.reviewText || 'Amazing service! Highly recommended.'}&rdquo;
                      </p>
                      <div className="text-[11px] font-bold mt-1">
                        {approvedReviews[0]?.clientName || 'Jessica Reynolds'}
                        <span className="font-normal opacity-70 ml-1">
                          — {approvedReviews[0]?.companyRole || 'CTO'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : config.layout === 'carousel' ? (
                  // Carousel / Slider Preview
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {approvedReviews.map((t) => (
                      <div
                        key={t.id}
                        className="min-w-[240px] max-w-[260px] p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 shadow-2xs shrink-0 flex flex-col justify-between"
                      >
                        <div>
                          {config.showRating && (
                            <div className="flex items-center gap-0.5 text-amber-400 mb-1.5">
                              {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          )}
                          <p className="text-xs line-clamp-3 italic">
                            &ldquo;{t.reviewText}&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                          {config.showAvatar && (
                            <img
                              src={t.avatarUrl}
                              alt={t.clientName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <div className="text-[10px] truncate">
                            <span className="font-bold block truncate">{t.clientName}</span>
                            <span className="opacity-70 truncate block">{t.companyRole}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Grid Layout
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {approvedReviews.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 shadow-2xs"
                      >
                        {config.showRating && (
                          <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                            ))}
                          </div>
                        )}
                        <p className="text-xs line-clamp-2 italic mb-2">
                          &ldquo;{t.reviewText}&rdquo;
                        </p>
                        <div className="flex items-center space-x-2">
                          {config.showAvatar && (
                            <img
                              src={t.avatarUrl}
                              alt={t.clientName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          )}
                          <span className="text-[10px] font-bold truncate">
                            {t.clientName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setActiveCodeTab('html')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeCodeTab === 'html' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-600'
                    }`}
                  >
                    HTML / JS Script
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('iframe')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeCodeTab === 'iframe' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-600'
                    }`}
                  >
                    &lt;iframe&gt; Embed
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all active:scale-[0.98]"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                  <code>{currentSnippet}</code>
                </pre>
              </div>
              <p className="text-[11px] text-slate-400">
                Paste this snippet anywhere in your HTML, Webflow custom embed, or Shopify theme liquid file.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
