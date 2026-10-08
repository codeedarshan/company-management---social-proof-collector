import React, { useState, useMemo } from 'react';
import { Testimonial, TestimonialStatus } from '../types';
import { 
  Check, 
  X, 
  Archive, 
  Star, 
  Heart, 
  Award, 
  Search, 
  Filter, 
  ChevronDown, 
  Mail, 
  Building, 
  ExternalLink,
  MessageSquareQuote,
  Copy,
  CheckCheck,
  Plus,
  Download,
  CheckSquare,
  Square,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewInboxProps {
  testimonials: Testimonial[];
  onUpdateStatus: (id: string, status: TestimonialStatus) => void;
  onToggleFeature: (id: string) => void;
  onToggleLike: (id: string) => void;
  spaceSlug: string;
  onOpenQuickReviewModal?: () => void;
}

export const ReviewInbox: React.FC<ReviewInboxProps> = ({
  testimonials,
  onUpdateStatus,
  onToggleFeature,
  onToggleLike,
  spaceSlug,
  onOpenQuickReviewModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'archived'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredReviews = useMemo(() => {
    return testimonials.filter((t) => {
      // Space match
      if (spaceSlug && spaceSlug !== 'all' && t.spaceSlug !== spaceSlug) {
        return false;
      }

      // Tab filter
      if (activeTab !== 'all' && t.status !== activeTab) {
        return false;
      }

      // Rating filter
      if (selectedRating !== 'all' && t.rating !== Number(selectedRating)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.clientName.toLowerCase().includes(q);
        const matchesEmail = t.clientEmail.toLowerCase().includes(q);
        const matchesRole = t.companyRole.toLowerCase().includes(q);
        const matchesText = t.reviewText.toLowerCase().includes(q);
        const matchesCompany = (t.companyName || '').toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesRole || matchesText || matchesCompany;
      }

      return true;
    });
  }, [testimonials, spaceSlug, activeTab, selectedRating, searchQuery]);

  const counts = useMemo(() => {
    const list = spaceSlug === 'all' ? testimonials : testimonials.filter((t) => t.spaceSlug === spaceSlug);
    return {
      all: list.length,
      pending: list.filter((t) => t.status === 'pending').length,
      approved: list.filter((t) => t.status === 'approved').length,
      archived: list.filter((t) => t.status === 'archived').length,
    };
  }, [testimonials, spaceSlug]);

  const handleApproveWithConfetti = (id: string) => {
    onUpdateStatus(id, 'approved');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#10b981', '#f59e0b'],
    });
  };

  const copyQuote = (t: Testimonial) => {
    const text = `"${t.reviewText}" — ${t.clientName}, ${t.companyRole}`;
    navigator.clipboard.writeText(text);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    if (selectedIds.size === filteredReviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReviews.map((r) => r.id)));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchApprove = () => {
    selectedIds.forEach((id) => onUpdateStatus(id, 'approved'));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    setSelectedIds(new Set());
  };

  const handleBatchArchive = () => {
    selectedIds.forEach((id) => onUpdateStatus(id, 'archived'));
    setSelectedIds(new Set());
  };

  const handleExportSelected = () => {
    const dataToExport = testimonials.filter((t) => selectedIds.has(t.id));
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testimonials_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Filter & Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Tab Filters */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {(['all', 'pending', 'approved', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIds(new Set());
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab
                    ? tab === 'pending' && counts.pending > 0
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                    : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search, Star Selector & Quick Add Review Button */}
        <div className="flex items-center space-x-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword, client..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="relative">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              aria-label="Filter by star rating"
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {onOpenQuickReviewModal && (
            <button
              onClick={onOpenQuickReviewModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          )}
        </div>

      </div>

      {/* Batch Actions Bar (Shows when 1 or more items are selected) */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-900 text-white rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="px-2 py-0.5 rounded-md bg-indigo-800 text-indigo-200 font-mono">
              {selectedIds.size} selected
            </span>
            <span>Bulk actions for selected testimonials</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBatchApprove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve All</span>
            </button>

            <button
              onClick={handleBatchArchive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-800 hover:bg-indigo-700 text-white transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive All</span>
            </button>

            <button
              onClick={handleExportSelected}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-800 hover:bg-indigo-700 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-indigo-300 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Select All Checkbox Header if reviews exist */}
      {filteredReviews.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-500">
          <button
            onClick={selectAllFiltered}
            className="flex items-center gap-2 hover:text-slate-800 font-semibold transition-colors"
          >
            {selectedIds.size === filteredReviews.length && filteredReviews.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-indigo-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Select All ({filteredReviews.length})</span>
          </button>
          <span>Showing {filteredReviews.length} testimonials</span>
        </div>
      )}

      {/* Review List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No testimonials found in this view</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your filters or click Quick Add to insert a sample review and test the moderation workflow!
          </p>
          {onOpenQuickReviewModal && (
            <button
              onClick={onOpenQuickReviewModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sample Review</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((t) => {
            const isSelected = selectedIds.has(t.id);
            const isExpanded = expandedIds.has(t.id);

            return (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 hover:shadow-xs ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/10'
                    : t.status === 'pending'
                    ? 'border-amber-200/80 bg-amber-50/10'
                    : t.status === 'approved'
                    ? 'border-slate-200/90'
                    : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Select Checkbox + Author Info */}
                  <div className="flex items-start space-x-3.5">
                    
                    {/* Multi-select box */}
                    <button
                      type="button"
                      onClick={() => toggleSelect(t.id)}
                      className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>

                    <div className="relative shrink-0">
                      <img
                        src={t.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.clientName)}`}
                        alt={t.clientName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs"
                      />
                      {t.isFeatured && (
                        <span
                          title="Featured review"
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center ring-1 ring-white"
                        >
                          <Award className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {t.clientName}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">
                          {t.companyRole} {t.companyName && `at ${t.companyName}`}
                        </span>
                        
                        {/* Status Tag */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            t.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : t.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {t.clientEmail}
                        </span>
                        <span>•</span>
                        <span>{new Date(t.submittedAt).toLocaleDateString()}</span>
                      </div>

                      {/* Star Rating Display */}
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < t.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-1">
                          {t.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-start">
                    
                    {/* Heart / Liked button */}
                    <button
                      onClick={() => onToggleLike(t.id)}
                      title={t.isLiked ? 'Unlike' : 'Like'}
                      className={`p-2 rounded-xl border transition-colors ${
                        t.isLiked
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${t.isLiked ? 'fill-rose-600' : ''}`} />
                    </button>

                    {/* Featured button */}
                    <button
                      onClick={() => onToggleFeature(t.id)}
                      title={t.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                      className={`p-2 rounded-xl border transition-colors ${
                        t.isFeatured
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                    </button>

                    {/* Copy snippet */}
                    <button
                      onClick={() => copyQuote(t)}
                      title="Copy formatted quote"
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {copiedId === t.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                    {/* One-click Action Buttons */}
                    {t.status !== 'approved' && (
                      <button
                        onClick={() => handleApproveWithConfetti(t.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all active:scale-[0.98]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    )}

                    {t.status !== 'rejected' && (
                      <button
                        onClick={() => onUpdateStatus(t.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}

                    {t.status !== 'archived' && (
                      <button
                        onClick={() => onUpdateStatus(t.id, 'archived')}
                        title="Archive review"
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Review Text Body */}
                <div className="mt-3.5 pt-3 border-t border-slate-100">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    &ldquo;{t.reviewText}&rdquo;
                  </p>

                  {/* Answers toggle button if answers exist */}
                  {t.answers && t.answers.length > 0 && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => toggleExpand(t.id)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        <span>{isExpanded ? 'Hide' : 'View'} Custom Q&amp;A Responses ({t.answers.length})</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 animate-in fade-in">
                          {t.answers.map((ans, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-semibold text-slate-600 block text-[11px]">{ans.question}</span>
                              <span className="text-slate-800 font-medium">{ans.answer}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
