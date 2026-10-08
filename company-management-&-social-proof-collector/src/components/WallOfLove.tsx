import React, { useState, useMemo, useEffect } from 'react';
import { Space, Testimonial } from '../types';
import { 
  Star, 
  Heart, 
  Award, 
  Search, 
  Share2, 
  Check, 
  Building2, 
  Sparkles, 
  Moon, 
  Sun, 
  Copy, 
  LayoutGrid, 
  SlidersHorizontal, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WallOfLoveProps {
  space: Space;
  testimonials: Testimonial[];
  onOpenEmbedModal?: () => void;
  onToggleLike?: (id: string) => void;
}

export const WallOfLove: React.FC<WallOfLoveProps> = ({
  space,
  testimonials,
  onOpenEmbedModal,
  onToggleLike,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'carousel' | 'compact'>('masonry');
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Local likes tracking
  const [localLikes, setLocalLikes] = useState<Record<string, { liked: boolean; count: number }>>({});

  const approvedReviews = useMemo(() => {
    return testimonials.filter((t) => {
      if (t.spaceSlug !== space.slug || t.status !== 'approved') return false;
      if (filterRating !== 'all' && t.rating !== Number(filterRating)) return false;
      if (featuredOnly && !t.isFeatured) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.clientName.toLowerCase().includes(q) ||
          t.companyRole.toLowerCase().includes(q) ||
          (t.companyName && t.companyName.toLowerCase().includes(q)) ||
          t.reviewText.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [testimonials, space.slug, filterRating, featuredOnly, searchQuery]);

  // Handle auto-play for carousel
  useEffect(() => {
    if (!isAutoPlay || layoutMode !== 'carousel' || approvedReviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % approvedReviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, layoutMode, approvedReviews.length]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLikes((prev) => {
      const current = prev[id] || { liked: false, count: 12 };
      return {
        ...prev,
        [id]: {
          liked: !current.liked,
          count: current.liked ? current.count - 1 : current.count + 1,
        },
      };
    });

    if (onToggleLike) {
      onToggleLike(id);
    }

    // Small celebratory confetti for like
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#fda4af'],
    });
  };

  const copyQuote = (t: Testimonial, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `"${t.reviewText}" — ${t.clientName}, ${t.companyRole}${t.companyName ? ` at ${t.companyName}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedQuoteId(t.id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  const copyWallLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/wall/${space.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className={`min-h-[85vh] rounded-3xl p-5 sm:p-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/90 text-slate-900'
      }`}
    >
      {/* Wall Header & Controls */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        
        {/* Top interactive status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
            <Heart className="w-3.5 h-3.5 fill-rose-600 animate-pulse" />
            <span>Public Showcase: /wall/{space.slug}</span>
            <span className="text-[10px] bg-rose-200/60 text-rose-800 px-1.5 py-0.2 rounded-full font-bold">
              {approvedReviews.length} Live
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Share Wall Link */}
            <button
              onClick={copyWallLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Wall'}</span>
            </button>
          </div>
        </div>

        {/* Space Logo & Title */}
        <div className="w-16 h-16 rounded-3xl mx-auto mb-3 p-1 bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
          {space.logoUrl ? (
            <img src={space.logoUrl} alt={space.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <Building2 className="w-8 h-8 text-indigo-600" />
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Wall of Love for {space.name}
        </h1>
        <p className={`text-xs sm:text-sm mt-1.5 max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Authentic testimonials, quantifiable case studies, and verified reviews from real customers.
        </p>

        {/* Interactive Filter & Layout Toolbar */}
        <div className="mt-6 p-2 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 max-w-2xl mx-auto backdrop-blur-md shadow-xs transition-all bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
          
          {/* Search Input */}
          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes..."
              className={`w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Rating Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-start">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              aria-label="Filter Wall of Love testimonials by star rating"
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars only</option>
              <option value="4">4+ Stars</option>
            </select>

            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1 ${
                featuredOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                  : isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3 h-3 text-amber-500" />
              <span>Featured</span>
            </button>

            {/* Layout Toggler */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                title="Masonry Grid"
                onClick={() => setLayoutMode('masonry')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  layoutMode === 'masonry'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              <button
                title="Interactive Carousel"
                onClick={() => {
                  setLayoutMode('carousel');
                  setCurrentSlideIndex(0);
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  layoutMode === 'carousel'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              <button
                title="Compact Badges"
                onClick={() => setLayoutMode('compact')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  layoutMode === 'compact'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Empty State */}
      {approvedReviews.length === 0 ? (
        <div
          className={`p-12 text-center rounded-3xl border border-dashed max-w-lg mx-auto ${
            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-white'
          }`}
        >
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold">No testimonials match your filters</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try resetting your search query or star filter to see more customer quotes.
          </p>
          {(searchQuery || filterRating !== 'all' || featuredOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterRating('all');
                setFeaturedOnly(false);
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : layoutMode === 'carousel' ? (
        /* ================= CAROUSEL LAYOUT ================= */
        <div className="max-w-2xl mx-auto py-4">
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-xl relative transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Slide Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < approvedReviews[currentSlideIndex].rating
                        ? 'text-amber-400 fill-amber-400'
                        : isDarkMode
                        ? 'text-slate-700'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {currentSlideIndex + 1} / {approvedReviews.length}
                </span>
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                  title={isAutoPlay ? 'Pause Auto-Play' : 'Start Auto-Play'}
                >
                  {isAutoPlay ? <Pause className="w-3.5 h-3.5 text-indigo-500" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Slide Text */}
            <p className="text-base sm:text-lg leading-relaxed italic mb-6">
              &ldquo;{approvedReviews[currentSlideIndex].reviewText}&rdquo;
            </p>

            {/* Custom Answers in slide */}
            {(approvedReviews[currentSlideIndex].answers?.length ?? 0) > 0 && (
              <div
                className={`mb-6 p-3 rounded-2xl text-xs space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-50 text-slate-700'
                }`}
              >
                {approvedReviews[currentSlideIndex].answers?.map((ans, idx) => (
                  <div key={idx}>
                    <span className="font-semibold block text-[11px] opacity-75">{ans.question}</span>
                    <span className="font-medium text-xs">{ans.answer}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Author Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    approvedReviews[currentSlideIndex].avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      approvedReviews[currentSlideIndex].clientName
                    )}`
                  }
                  alt={approvedReviews[currentSlideIndex].clientName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="text-sm font-bold">{approvedReviews[currentSlideIndex].clientName}</div>
                  <div className="text-xs text-slate-400">
                    {approvedReviews[currentSlideIndex].companyRole}{' '}
                    {approvedReviews[currentSlideIndex].companyName && `at ${approvedReviews[currentSlideIndex].companyName}`}
                  </div>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={(e) => handleLike(approvedReviews[currentSlideIndex].id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-90 ${
                  localLikes[approvedReviews[currentSlideIndex].id]?.liked
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-rose-500'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    localLikes[approvedReviews[currentSlideIndex].id]?.liked ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>
                  {localLikes[approvedReviews[currentSlideIndex].id]?.count ?? 12}
                </span>
              </button>
            </div>

            {/* Next / Previous Controls */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev === 0 ? approvedReviews.length - 1 : prev - 1))
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Dots */}
              <div className="flex items-center space-x-1.5">
                {approvedReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev + 1) % approvedReviews.length)
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : layoutMode === 'compact' ? (
        /* ================= COMPACT BADGES LAYOUT ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-6xl mx-auto">
          {approvedReviews.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex items-start gap-3 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-white'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300 text-slate-900'
              }`}
            >
              <img
                src={
                  t.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.clientName)}`
                }
                alt={t.clientName}
                className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-indigo-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold truncate">{t.clientName}</div>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-[10px] font-bold ml-0.5">{t.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {t.companyRole}{t.companyName ? ` • ${t.companyName}` : ''}
                </p>
                <p className="text-xs mt-1.5 line-clamp-2 italic text-slate-700 dark:text-slate-300">
                  &ldquo;{t.reviewText}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= MASONRY GRID LAYOUT (DEFAULT) ================= */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 max-w-7xl mx-auto space-y-5">
          {approvedReviews.map((t) => {
            const isLiked = localLikes[t.id]?.liked || t.isLiked;
            const likeCount = localLikes[t.id]?.count ?? (t.isLiked ? 13 : 12);

            return (
              <div
                key={t.id}
                className={`break-inside-avoid rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg relative group ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Rating & Action Buttons */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating
                            ? 'text-amber-400 fill-amber-400'
                            : isDarkMode
                            ? 'text-slate-700'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    {t.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                        <Award className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}

                    <button
                      onClick={(e) => copyQuote(t, e)}
                      title="Copy Quote"
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copiedQuoteId === t.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Review Text */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  &ldquo;{t.reviewText}&rdquo;
                </p>

                {/* Answers to custom questions if any */}
                {t.answers && t.answers.length > 0 && (
                  <div
                    className={`mb-4 p-3 rounded-xl text-xs space-y-1.5 ${
                      isDarkMode ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {t.answers.map((ans, i) => (
                      <div key={i}>
                        <span className="font-semibold block text-[11px] opacity-75">{ans.question}</span>
                        <span className="font-medium text-xs">{ans.answer}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Author Footer & Interactive Like */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <img
                      src={
                        t.avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.clientName)}`
                      }
                      alt={t.clientName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold truncate leading-tight">{t.clientName}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {t.companyRole} {t.companyName && `at ${t.companyName}`}
                      </div>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(t.id, e)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all active:scale-90 ${
                      isLiked
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900'
                        : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="text-[11px] font-mono">{likeCount}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Footer CTA to embed */}
      {onOpenEmbedModal && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onOpenEmbedModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Embed Code for Your Website</span>
          </button>
        </div>
      )}
    </div>
  );
};
