import React, { useState, useRef } from 'react';
import { Space, Testimonial } from '../types';
import { 
  Star, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicCollectionFormProps {
  space: Space;
  onSubmitTestimonial: (data: any) => Promise<boolean>;
  onBackToDashboard?: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
];

export const PublicCollectionForm: React.FC<PublicCollectionFormProps> = ({
  space,
  onSubmitTestimonial,
  onBackToDashboard,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage('Image size should be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation
    if (!clientName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address');
      return;
    }
    if (!reviewText.trim()) {
      setErrorMessage('Please write a brief testimonial');
      return;
    }
    if (space.settings.isAvatarMandatory && !avatarUrl) {
      setErrorMessage('An avatar / profile photo is required for this space');
      return;
    }

    setIsSubmitting(true);

    const answersPayload = (space.settings.customQuestions || []).map((q, idx) => ({
      question: q,
      answer: customAnswers[idx] || '',
    }));

    const payload = {
      spaceSlug: space.slug,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      companyRole: companyRole.trim() || 'Client',
      companyName: companyName.trim(),
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`,
      rating,
      reviewText: reviewText.trim(),
      answers: answersPayload,
    };

    const success = await onSubmitTestimonial(payload);
    setIsSubmitting(false);

    if (success) {
      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });
    } else {
      setErrorMessage('Submission failed. Please try again.');
    }
  };

  const handleAnswerChange = (idx: number, val: string) => {
    setCustomAnswers((prev) => ({ ...prev, [idx]: val }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center animate-in zoom-in-95">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {space.settings.thankYouTitle || 'Thank you for your review! ❤️'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed max-w-md mx-auto">
            {space.settings.thankYouMessage ||
              'Your testimonial has been submitted to the moderation inbox. We sincerely appreciate your support!'}
          </p>

          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`}
                alt={clientName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">{clientName}</div>
                <div className="text-[11px] text-slate-500">
                  {companyRole} {companyName && `at ${companyName}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic">&ldquo;{reviewText}&rdquo;</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setReviewText('');
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Submit Another Review
            </button>
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Back to Dashboard
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      
      {/* Top Breadcrumb & Badge */}
      <div className="flex items-center justify-between mb-4">
        {onBackToDashboard && (
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
        )}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 ml-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Frictionless Public URL: /collect/{space.slug}</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
        
        {/* Space Header Banner */}
        <div className="px-6 py-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3.5 p-1 bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
            {space.logoUrl ? (
              <img src={space.logoUrl} alt={space.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-7 h-7 text-indigo-600" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {space.headline || space.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            {space.customPrompt || 'Share your authentic experience with our team to help us grow!'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          {space.settings.isStarRatingEnabled && (
            <div className="text-center py-2 bg-slate-50/70 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overall Rating *
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg transition-transform hover:scale-115 active:scale-95 focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-2xs'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                {rating === 5 && 'Outstanding experience! 🌟'}
                {rating === 4 && 'Very good experience! 👍'}
                {rating === 3 && 'Average experience'}
                {rating <= 2 && 'Needs improvement'}
              </span>
            </div>
          )}

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Your Review / Experience *
            </label>
            <textarea
              required
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What specific impact did our service make on your business or daily workflow?"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          {/* Custom Questions if enabled */}
          {space.settings.customQuestions && space.settings.customQuestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Follow-up Questions
              </div>
              {space.settings.customQuestions.map((q, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {q}
                  </label>
                  <input
                    type="text"
                    value={customAnswers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Your answer..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Jessica Reynolds"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="jessica@company.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={companyRole}
                onChange={(e) => setCompanyRole(e.target.value)}
                placeholder="e.g. Chief Technology Officer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. FinFlow Tech"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Avatar Upload / Pick Handling */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">
                Profile Photo {space.settings.isAvatarMandatory ? '*' : '(Optional)'}
              </label>
              <span className="text-[11px] text-slate-400">Upload photo or select avatar</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={
                    avatarUrl ||
                    (clientName
                      ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
                  }
                  alt="Avatar Preview"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-2xs"
                />
              </div>

              {/* Upload Button */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                  <span className="text-[11px] text-slate-400">or pick preset:</span>
                </div>

                {/* Preset Avatars */}
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-7 h-7 rounded-full overflow-hidden ring-1 transition-transform hover:scale-110 ${
                        avatarUrl === url ? 'ring-2 ring-indigo-600' : 'ring-slate-200'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting Testimonial...' : 'Submit Testimonial'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2.5">
              Zero login required. Submissions are reviewed by {space.name} moderators before publication.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
