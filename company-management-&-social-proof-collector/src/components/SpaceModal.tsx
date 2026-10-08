import React, { useState } from 'react';
import { Space } from '../types';
import { X, Plus, Trash2, Globe, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface SpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSpace: (spaceData: Partial<Space>) => void;
  initialSpace?: Space | null;
}

export const SpaceModal: React.FC<SpaceModalProps> = ({
  isOpen,
  onClose,
  onSaveSpace,
  initialSpace,
}) => {
  const [name, setName] = useState(initialSpace?.name || '');
  const [slug, setSlug] = useState(initialSpace?.slug || '');
  const [headline, setHeadline] = useState(initialSpace?.headline || 'Loved by fast-moving engineering teams');
  const [customPrompt, setCustomPrompt] = useState(
    initialSpace?.customPrompt || 'How has our product helped your company achieve its goals?'
  );
  const [logoUrl, setLogoUrl] = useState(
    initialSpace?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'
  );
  const [brandColor, setBrandColor] = useState(initialSpace?.brandColor || '#4f46e5');
  const [isAvatarMandatory, setIsAvatarMandatory] = useState(
    initialSpace?.settings?.isAvatarMandatory || false
  );
  const [isStarRatingEnabled, setIsStarRatingEnabled] = useState(
    initialSpace?.settings?.isStarRatingEnabled !== false
  );
  const [customQuestions, setCustomQuestions] = useState<string[]>(
    initialSpace?.settings?.customQuestions || [
      'What was your biggest problem before choosing our service?',
      'What measurable result or metric improved for your team?',
    ]
  );
  const [newQuestion, setNewQuestion] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialSpace) {
      // Auto-generate clean slug
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setCustomQuestions([...customQuestions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    onSaveSpace({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      headline: headline.trim(),
      customPrompt: customPrompt.trim(),
      logoUrl: logoUrl.trim(),
      brandColor,
      settings: {
        isAvatarMandatory,
        isStarRatingEnabled,
        customQuestions,
        thankYouTitle: 'Thank you for your feedback! ❤️',
        thankYouMessage: 'Your testimonial has been submitted for moderation.',
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {initialSpace ? 'Configure Space Settings' : 'Create New Collection Space'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Custom branded review collection page & unique public slug
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Space / Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Acme Cloud Platform"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique Slug *
              </label>
              <div className="flex items-center">
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-2 rounded-l-xl border border-r-0 border-slate-200">
                  /collect/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="acme-corp"
                  className="w-full px-3 py-2 text-xs rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Public Page Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Loved by over 10,000+ modern teams"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Prompt / Guiding Question
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="What do you enjoy most about using our product?"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Logo URL
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-slate-400 m-2" />
                  )}
                </div>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Settings Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Submission Settings
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-xs font-semibold text-slate-800">Mandatory Avatar Photo</div>
                <div className="text-[11px] text-slate-500">
                  Require clients to upload a profile avatar before submitting
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarMandatory(!isAvatarMandatory)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  isAvatarMandatory ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isAvatarMandatory ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-xs font-semibold text-slate-800">1–5 Star Rating Field</div>
                <div className="text-[11px] text-slate-500">
                  Allow customers to give a numeric star rating alongside their review
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStarRatingEnabled(!isStarRatingEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  isStarRatingEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isStarRatingEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Custom Questions List */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Custom Follow-up Questions ({customQuestions.length})
            </label>
            <div className="space-y-2 mb-3">
              {customQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                >
                  <span className="text-slate-700 truncate pr-2">
                    {idx + 1}. {q}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQuestion();
                  }
                }}
                placeholder="Add another custom question..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              {initialSpace ? 'Save Space Changes' : 'Launch Collection Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
