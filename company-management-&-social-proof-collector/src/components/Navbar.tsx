import React from 'react';
import { Space, User } from '../types';
import { 
  Building2, 
  Layers, 
  HeartHandshake, 
  Inbox, 
  Code2, 
  BarChart3, 
  ExternalLink, 
  Plus, 
  UserCheck, 
  Terminal, 
  Users,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'inbox' | 'wall' | 'collect' | 'embed' | 'metrics' | 'company' | 'python';
  setCurrentTab: (tab: 'inbox' | 'wall' | 'collect' | 'embed' | 'metrics' | 'company' | 'python') => void;
  spaces: Space[];
  currentSpace: Space | null;
  onSelectSpace: (space: Space) => void;
  onOpenNewSpaceModal: () => void;
  onOpenEmbedModal: () => void;
  onOpenQuickReviewModal?: () => void;
  user: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  pendingReviewsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  spaces,
  currentSpace,
  onSelectSpace,
  onOpenNewSpaceModal,
  onOpenEmbedModal,
  onOpenQuickReviewModal,
  user,
  onOpenAuthModal,
  onLogout,
  pendingReviewsCount,
}) => {
  const [isSpaceMenuOpen, setIsSpaceMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Space Selector */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Acme Proof
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Pro
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 block leading-none">
                  Company & Social Proof System
                </span>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            {/* Space Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSpaceMenuOpen(!isSpaceMenuOpen)}
                className="flex items-center space-x-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-800"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[130px] truncate">{currentSpace?.name || 'Select Space'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isSpaceMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Company Spaces
                  </div>
                  {spaces.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectSpace(s);
                        setIsSpaceMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentSpace?.id === s.id ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div>{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">/collect/{s.slug}</div>
                      </div>
                      {currentSpace?.id === s.id && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsSpaceMenuOpen(false);
                        onOpenNewSpaceModal();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Space
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium">
            <button
              onClick={() => setCurrentTab('inbox')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'inbox'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Inbox className="w-3.5 h-3.5 text-indigo-600" />
              <span>Inbox</span>
              {pendingReviewsCount > 0 && (
                <span className="ml-1 text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {pendingReviewsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('wall')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'wall'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
              <span>Wall of Love</span>
            </button>

            <button
              onClick={() => setCurrentTab('collect')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'collect'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Public Form</span>
            </button>

            <button
              onClick={() => setCurrentTab('metrics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setCurrentTab('company')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'company'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Company</span>
            </button>

            <button
              onClick={() => setCurrentTab('python')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'python'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Python & DB</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5">
            {onOpenQuickReviewModal && (
              <button
                onClick={onOpenQuickReviewModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Review</span>
              </button>
            )}

            <button
              onClick={onOpenEmbedModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Embed</span> Widget
            </button>

            {user ? (
              <div className="flex items-center space-x-2 pl-1">
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">JWT 15m Active</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-indigo-500/30">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 gap-2">
          {(['inbox', 'wall', 'collect', 'metrics', 'company', 'python'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap capitalize font-medium ${
                currentTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
              }`}
            >
              {tab === 'inbox' && pendingReviewsCount > 0 ? `Inbox (${pendingReviewsCount})` : tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
