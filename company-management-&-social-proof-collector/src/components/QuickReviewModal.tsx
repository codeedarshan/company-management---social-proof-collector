import React, { useState } from 'react';
import { Space, Testimonial } from '../types';
import { 
  X, 
  Star, 
  Sparkles, 
  Send, 
  Building2, 
  Check, 
  User, 
  MessageSquare, 
  Eye, 
  RefreshCw,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space;
  onSubmit: (data: any) => Promise<boolean>;
  onSuccessToast?: (msg: string) => void;
}

const PRESET_TESTIMONIALS = [
  {
    name: 'Siddharth Rao',
    email: 'siddharth@cloudmesh.io',
    role: 'Principal DevOps Architect',
    company: 'CloudMesh Technologies',
    rating: 5,
    text: 'Acme Proof completely revolutionized how our engineering team highlights customer success. The embed was up and running on our docs in 2 minutes flat!',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@nordicfin.se',
    role: 'Head of Growth',
    company: 'NordicFin Solutions',
    rating: 5,
    text: 'Our checkout conversion jumped by 24% after placing the Wall of Love on our pricing page. Our customers love not having to create an account to leave a review.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'Vikram Mehta',
    email: 'vikram@razorvelocity.com',
    role: 'Founder & CEO',
    company: 'RazorVelocity Labs',
    rating: 4,
    text: 'Incredibly smooth review collection workflow. The Python SQLite backend runs like a charm with zero external dependencies.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair Experience',
  3: 'Good Service',
  4: 'Very Good & Recommended',
  5: 'Exceptional & Outstanding! ⭐',
};

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({
  isOpen,
  onClose,
  space,
  onSubmit,
  onSuccessToast,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
  const [statusChoice, setStatusChoice] = useState<'pending' | 'approved'>('approved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESET_TESTIMONIALS[0]) => {
    setClientName(preset.name);
    setClientEmail(preset.email);
    setCompanyRole(preset.role);
    setCompanyName(preset.company);
    setRating(preset.rating);
    setReviewText(preset.text);
    setAvatarUrl(preset.avatar);
  };

  const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName || seed)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !reviewText.trim()) {
      return;
    }

    setIsSubmitting(true);
    const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`;

    const payload = {
      spaceSlug: space.slug,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      companyRole: companyRole.trim() || 'Client',
      companyName: companyName.trim(),
      rating,
      reviewText: reviewText.trim(),
      avatarUrl: finalAvatar,
      status: statusChoice,
      answers: [],
    };

    const success = await onSubmit(payload);
    setIsSubmitting(false);

    if (success) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });
      if (onSuccessToast) {
        onSuccessToast(
          statusChoice === 'approved' 
            ? `Review by ${clientName} added and published live to Wall of Love!`
            : `Review by ${clientName} submitted to Review Inbox for moderation.`
        );
      }
      onClose();
      // Reset
      setClientName('');
      setClientEmail('');
      setCompanyRole('');
      setCompanyName('');
      setReviewText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">Interactive Review Creator</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {space.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quickly add testimonials with live interactive card preview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Interactive Presets Bar */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            One-Click Test Presets:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_TESTIMONIALS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 font-medium transition-all shadow-2xs active:scale-95"
              >
                ★ {preset.name.split(' ')[0]} ({preset.role.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Content: Split Grid Form + Real-Time Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 max-h-[75vh] overflow-y-auto">
          
          {/* Left Column: Interactive Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-5 sm:p-6 space-y-4">
            
            {/* Star Rating Interactive Selector */}
            <div className="space-y-1.5 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100">
              <label className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                <span>Rating</span>
                <span className="text-indigo-600 font-semibold text-[11px]">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </label>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="rajesh@company.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Role & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role / Designation
                </label>
                <input
                  type="text"
                  value={companyRole}
                  onChange={(e) => setCompanyRole(e.target.value)}
                  placeholder="e.g. Head of Engineering"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Infosys Ltd"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Review Text with Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Testimonial Review Text *
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {reviewText.length} characters
                </span>
              </div>
              <textarea
                required
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Describe your experience, quantifiable results, or why you recommend this platform..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Interactive Avatar Picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Select Profile Avatar
                </label>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Initials Avatar
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {AVATAR_OPTIONS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                      avatarUrl === url
                        ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105'
                        : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Status Selector */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Publishing Destination
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatusChoice('approved')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    statusChoice === 'approved'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Publish Directly to Wall</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusChoice('pending')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    statusChoice === 'pending'
                      ? 'bg-amber-50 border-amber-300 text-amber-800 ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Save to Pending Inbox</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !clientName || !clientEmail || !reviewText}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-98"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmitting ? 'Saving...' : 'Submit Testimonial'}</span>
              </button>
            </div>

          </form>

          {/* Right Column: Live Real-Time Card Preview */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  Live Real-Time Preview
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                  Wall Card Style
                </span>
              </div>

              {/* Card Container */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-3.5 relative overflow-hidden transition-all">
                
                <div className="flex items-center justify-between">
                  {/* Stars */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{reviewText || 'Your customer feedback will appear here in real-time as you type...'}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                  <img
                    src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${clientName || 'User'}`}
                    alt="client"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="truncate">
                    <div className="text-xs font-extrabold text-slate-900 truncate">
                      {clientName || 'Client Full Name'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {companyRole || 'Role'}{companyName ? ` • ${companyName}` : ''}
                    </div>
                  </div>
                </div>

              </div>

              {/* Helpful Hint */}
              <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                💡 <strong>Interactive Tip:</strong> Click any of the <strong>One-Click Test Presets</strong> above to quickly see how different client testimonials look on your public Wall of Love.
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center mt-4">
              Changes sync instantly with the SQLite database &amp; live UI
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
