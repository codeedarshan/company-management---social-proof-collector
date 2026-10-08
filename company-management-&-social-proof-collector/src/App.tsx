import React, { useState, useEffect, useMemo } from 'react';
import { Space, Testimonial, User, RatingStats, CompanyDetails, AuditLog, TestimonialStatus } from './types';
import { Navbar } from './components/Navbar';
import { ReviewInbox } from './components/ReviewInbox';
import { PublicCollectionForm } from './components/PublicCollectionForm';
import { WallOfLove } from './components/WallOfLove';
import { EmbedGeneratorModal } from './components/EmbedGeneratorModal';
import { MetricsCard } from './components/MetricsCard';
import { SpaceModal } from './components/SpaceModal';
import { AuthModal } from './components/AuthModal';
import { CompanyManagement } from './components/CompanyManagement';
import { PythonDatabaseInspector } from './components/PythonDatabaseInspector';
import { QuickReviewModal } from './components/QuickReviewModal';
import { InteractiveActionBar } from './components/InteractiveActionBar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  Building2, 
  Layers, 
  ExternalLink, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Plus,
  Terminal,
  Settings
} from 'lucide-react';

const DEFAULT_COMPANY: CompanyDetails = {
  id: 'cmp_001',
  name: 'Acme Global Corporation',
  tagline: 'Enterprise Cloud Infrastructure & High-Performance SaaS',
  industry: 'Cloud Software & Developer Tools',
  website: 'https://acme-global.io',
  headquarters: 'San Francisco, CA & Mumbai, India',
  founded: '2021',
  departments: [
    { id: 'd1', name: 'Engineering & Platform', head: 'Sarah Chen', budget: '$1,400,000', employeeCount: 18 },
    { id: 'd2', name: 'Product & UX Design', head: 'Marcus Brody', budget: '$650,000', employeeCount: 8 },
    { id: 'd3', name: 'Customer Success & Support', head: 'Elena Rostova', budget: '$420,000', employeeCount: 12 },
    { id: 'd4', name: 'Operations, Legal & HR', head: 'David Patel', budget: '$300,000', employeeCount: 6 },
  ],
  employees: [
    { id: 'emp_1', name: 'Sarah Chen', email: 'sarah.chen@acme.com', role: 'VP of Engineering', department: 'Engineering & Platform', status: 'active', joinedDate: '2023-01-15', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: 'emp_2', name: 'Marcus Brody', email: 'marcus.b@acme.com', role: 'Head of Growth & Product', department: 'Product & UX Design', status: 'active', joinedDate: '2023-03-20', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: 'emp_3', name: 'Elena Rostova', email: 'elena.r@acme.com', role: 'Director of Customer Experience', department: 'Customer Success & Support', status: 'active', joinedDate: '2023-05-10', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: 'emp_4', name: 'David Patel', email: 'david.p@acme.com', role: 'Staff Platform Architect', department: 'Engineering & Platform', status: 'remote', joinedDate: '2023-08-01', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { id: 'emp_5', name: 'Aaliyah Khan', email: 'aaliyah.k@acme.com', role: 'Senior Product Designer', department: 'Product & UX Design', status: 'active', joinedDate: '2023-11-12', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  ],
};

const DEFAULT_SPACES: Space[] = [
  {
    id: 'spc_001',
    ownerId: 'usr_owner_01',
    name: 'Acme Cloud Platform',
    slug: 'acme-corp',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    brandColor: '#4f46e5',
    headline: 'Loved by 12,000+ teams across the globe',
    customPrompt: 'How has Acme streamlined your deployment pipeline and boosted engineering velocity?',
    settings: {
      isAvatarMandatory: false,
      isStarRatingEnabled: true,
      customQuestions: [
        'What was your biggest problem before choosing Acme?',
        'What specific measurable result did you achieve?',
      ],
      thankYouTitle: 'Thank you for your feedback! ❤️',
      thankYouMessage: 'Your review means the world to our team. We have published it for moderation.',
    },
    createdAt: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'spc_002',
    ownerId: 'usr_owner_01',
    name: 'Acme AI Assistant',
    slug: 'acme-ai',
    logoUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150',
    brandColor: '#0ea5e9',
    headline: 'Automate repetitive workflows with verified intelligence',
    customPrompt: 'Which AI workflow gave your company the highest return on investment?',
    settings: {
      isAvatarMandatory: true,
      isStarRatingEnabled: true,
      customQuestions: [
        'How many hours per week does Acme AI save your crew?',
      ],
      thankYouTitle: 'Awesome! Review received.',
      thankYouMessage: 'Thanks for sharing your AI automation story with our community.',
    },
    createdAt: '2024-03-01T14:20:00.000Z',
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't_001',
    spaceSlug: 'acme-corp',
    clientName: 'Jessica Reynolds',
    clientEmail: 'jessica@finflow.tech',
    companyRole: 'Chief Technology Officer',
    companyName: 'FinFlow Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    reviewText: 'Switching to Acme cut our production release cycle from 45 minutes down to 3 minutes. The uptime is flawless and developer experience is the best we have seen.',
    answers: [
      { question: 'What was your biggest problem before choosing Acme?', answer: 'Frequent release rollbacks and fragile deployment scripts.' },
      { question: 'What specific measurable result did you achieve?', answer: '94% reduction in downtime and 10x faster hotfixes.' },
    ],
    status: 'approved',
    isFeatured: true,
    isLiked: true,
    submittedAt: '2024-04-12T09:30:00.000Z',
  },
  {
    id: 't_002',
    spaceSlug: 'acme-corp',
    clientName: 'Alexandre Moreau',
    clientEmail: 'alex@hyperscale.fr',
    companyRole: 'Head of Operations',
    companyName: 'HyperScale Paris',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    reviewText: 'Collecting and showcasing authentic social proof has never been easier. The Wall of Love embed directly increased our landing page checkout conversion by 28% within 14 days!',
    answers: [
      { question: 'What was your biggest problem before choosing Acme?', answer: 'Scattered customer quotes across email threads and LinkedIn screenshots.' },
    ],
    status: 'approved',
    isFeatured: true,
    isLiked: true,
    submittedAt: '2024-04-18T14:45:00.000Z',
  },
  {
    id: 't_003',
    spaceSlug: 'acme-corp',
    clientName: 'Maya Lin',
    clientEmail: 'maya@designcraft.co',
    companyRole: 'Product Director',
    companyName: 'DesignCraft Studio',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4,
    reviewText: 'Incredible frictionless collection flow. Our executive clients loved not having to register an account just to leave thoughtful feedback.',
    answers: [],
    status: 'approved',
    isFeatured: false,
    isLiked: true,
    submittedAt: '2024-05-02T11:15:00.000Z',
  },
  {
    id: 't_004',
    spaceSlug: 'acme-corp',
    clientName: 'Liam Hemsworth',
    clientEmail: 'liam@novabyte.io',
    companyRole: 'Lead Cloud Engineer',
    companyName: 'NovaByte Labs',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 5,
    reviewText: 'Cleanest moderation inbox in the market. The tagging and one-click approve/featured controls save our customer success team hours every week.',
    answers: [],
    status: 'pending',
    isFeatured: false,
    isLiked: false,
    submittedAt: '2024-05-08T16:20:00.000Z',
  },
  {
    id: 't_005',
    spaceSlug: 'acme-corp',
    clientName: 'Siddharth Varma',
    clientEmail: 'sid@apexpay.in',
    companyRole: 'VP Product Engineering',
    companyName: 'ApexPay India',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    rating: 5,
    reviewText: 'The embed generator gives you instant code for Grid, Carousel, and Badge widgets. We pasted the snippet into our Webflow site in 30 seconds.',
    answers: [],
    status: 'pending',
    isFeatured: false,
    isLiked: false,
    submittedAt: '2024-05-10T18:00:00.000Z',
  },
  {
    id: 't_006',
    spaceSlug: 'acme-ai',
    clientName: 'Chloe Bennett',
    clientEmail: 'chloe@synthwave.ai',
    companyRole: 'Founder & CEO',
    companyName: 'SynthWave Media',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    reviewText: 'Acme AI cut 15 hours of manual document collation every week. Our staff can focus entirely on high-value client advisory work now.',
    answers: [
      { question: 'How many hours per week does Acme AI save your crew?', answer: 'Easily 15+ hours per person.' },
    ],
    status: 'approved',
    isFeatured: true,
    isLiked: true,
    submittedAt: '2024-05-11T12:00:00.000Z',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'inbox' | 'wall' | 'collect' | 'embed' | 'metrics' | 'company' | 'python'>('inbox');
  const [spaces, setSpaces] = useState<Space[]>(DEFAULT_SPACES);
  const [currentSpace, setCurrentSpace] = useState<Space>(DEFAULT_SPACES[0]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [company, setCompany] = useState<CompanyDetails>(DEFAULT_COMPANY);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log_1', action: 'System Initialized', details: 'Database seeded with default Acme spaces, company structure & reviews', user: 'System', timestamp: new Date().toISOString(), type: 'system' },
    { id: 'log_2', action: 'Space Created', details: 'Configured public slug /collect/acme-corp', user: 'Darshan Jain', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'space' },
    { id: 'log_3', action: 'Review Moderated', details: 'Approved testimonial from Jessica Reynolds (FinFlow)', user: 'Darshan Jain', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'review' },
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_owner_01',
    email: 'owner@acme-global.io',
    name: 'Darshan Jain',
    companyName: 'Acme Corporation Ltd',
    isEmailVerified: true,
    role: 'owner',
    createdAt: new Date().toISOString(),
  });

  // Modals & Interactive States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isQuickReviewModalOpen, setIsQuickReviewModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync route with URL path (supports http://localhost:3000/collect/:slug, /wall/:slug, etc.)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path.startsWith('/collect/')) {
        const slug = path.replace('/collect/', '').split('/')[0];
        if (slug) {
          const matched = spaces.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
          if (matched) setCurrentSpace(matched);
        }
        setCurrentTab('collect');
      } else if (path.startsWith('/wall/')) {
        const slug = path.replace('/wall/', '').split('/')[0];
        if (slug) {
          const matched = spaces.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
          if (matched) setCurrentSpace(matched);
        }
        setCurrentTab('wall');
      } else if (path.startsWith('/metrics')) {
        setCurrentTab('metrics');
      } else if (path.startsWith('/company')) {
        setCurrentTab('company');
      } else if (path.startsWith('/python')) {
        setCurrentTab('python');
      } else if (path.startsWith('/embed')) {
        setCurrentTab('embed');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [spaces]);

  // Fetch initial data from backend API with fallback
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Spaces
      const spacesRes = await fetch('/api/spaces');
      if (spacesRes.ok) {
        const data = await spacesRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setSpaces(data);
          setCurrentSpace(data[0]);
        }
      }

      // 2. Testimonials
      const testRes = await fetch('/api/testimonials/owner?spaceSlug=all');
      if (testRes.ok) {
        const data = await testRes.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      }

      // 3. Company
      const compRes = await fetch('/api/company');
      if (compRes.ok) {
        const data = await compRes.json();
        if (data && data.name) {
          setCompany(data);
        }
      }

      // 4. Audit logs
      const logRes = await fetch('/api/audit-logs');
      if (logRes.ok) {
        const data = await logRes.json();
        if (Array.isArray(data)) {
          setAuditLogs(data);
        }
      }
    } catch {
      // Backend not yet booted or offline; default states remain
    }
  };

  // Pending reviews count
  const pendingReviewsCount = useMemo(() => {
    return testimonials.filter(
      (t) => (t.spaceSlug === currentSpace?.slug || !currentSpace) && t.status === 'pending'
    ).length;
  }, [testimonials, currentSpace]);

  // Dynamic Rating Stats
  const currentStats: RatingStats = useMemo(() => {
    const spaceReviews = currentSpace
      ? testimonials.filter((t) => t.spaceSlug === currentSpace.slug)
      : testimonials;
    const approved = spaceReviews.filter((t) => t.status === 'approved');
    const pending = spaceReviews.filter((t) => t.status === 'pending');

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let scoreSum = 0;

    approved.forEach((t) => {
      const r = Math.min(5, Math.max(1, t.rating || 5));
      distribution[r] = (distribution[r] || 0) + 1;
      scoreSum += r;
    });

    const averageRating = approved.length > 0 ? Number((scoreSum / approved.length).toFixed(1)) : 5.0;

    return {
      averageRating,
      totalReviews: spaceReviews.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      approvalRate: spaceReviews.length > 0 ? Math.round((approved.length / spaceReviews.length) * 100) : 100,
      distribution: distribution as any,
    };
  }, [testimonials, currentSpace]);

  // Handlers for Testimonials
  const handleUpdateStatus = async (id: string, newStatus: TestimonialStatus) => {
    const target = testimonials.find((t) => t.id === id);
    const clientName = target?.clientName || 'Customer';

    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    if (newStatus === 'approved') {
      addToast('Review Approved! ✨', `${clientName}'s review is now live on the Wall of Love.`, 'success');
    } else if (newStatus === 'rejected') {
      addToast('Review Rejected', `${clientName}'s review was rejected.`, 'info');
    } else if (newStatus === 'archived') {
      addToast('Review Archived', `${clientName}'s review was moved to archive.`, 'info');
    }

    try {
      await fetch(`/api/testimonials/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // local state already updated
    }
  };

  const handleToggleFeature = async (id: string) => {
    const target = testimonials.find((t) => t.id === id);
    const willBeFeatured = !target?.isFeatured;

    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFeatured: !t.isFeatured } : t))
    );

    addToast(
      willBeFeatured ? '⭐ Marked as Featured' : 'Removed from Featured',
      willBeFeatured ? `Highlighted on public Wall of Love & Embed widget.` : undefined,
      'info'
    );

    try {
      await fetch(`/api/testimonials/${id}/toggle-feature`, { method: 'PATCH' });
    } catch {
      // local state already updated
    }
  };

  const handleToggleLike = async (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLiked: !t.isLiked } : t))
    );

    try {
      await fetch(`/api/testimonials/${id}/toggle-like`, { method: 'PATCH' });
    } catch {
      // local state already updated
    }
  };

  const handleSubmitPublicTestimonial = async (data: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/testimonials/public/${data.spaceSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      const responseData = await res.json();
      if (responseData.testimonial) {
        setTestimonials((prev) => [responseData.testimonial, ...prev]);
      }
      addToast(
        data.status === 'approved' ? 'Review Published Live! 🎉' : 'Review Submitted! 📨',
        `Thank you ${data.clientName}. Your feedback has been recorded.`,
        'success'
      );
      return true;
    } catch {
      // Fallback local save
      const fallbackItem: Testimonial = {
        id: `t_${Date.now()}`,
        spaceSlug: data.spaceSlug,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        companyRole: data.companyRole,
        companyName: data.companyName,
        avatarUrl: data.avatarUrl,
        rating: data.rating,
        reviewText: data.reviewText,
        answers: data.answers,
        status: data.status || 'pending',
        isFeatured: false,
        isLiked: false,
        submittedAt: new Date().toISOString(),
      };
      setTestimonials((prev) => [fallbackItem, ...prev]);
      addToast(
        fallbackItem.status === 'approved' ? 'Review Published Live! 🎉' : 'Review Submitted! 📨',
        `Recorded for ${fallbackItem.clientName}.`,
        'success'
      );
      return true;
    }
  };

  const handleSaveSpace = async (spaceData: Partial<Space>) => {
    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spaceData),
      });
      if (res.ok) {
        const created = await res.json();
        setSpaces((prev) => [...prev, created]);
        setCurrentSpace(created);
        return;
      }
    } catch {
      // fallback
    }

    const newSpace: Space = {
      id: `spc_${Date.now()}`,
      ownerId: 'usr_owner_01',
      name: spaceData.name || 'New Space',
      slug: spaceData.slug || `space-${Date.now()}`,
      headline: spaceData.headline || 'Welcome to our feedback page',
      customPrompt: spaceData.customPrompt || 'How was your experience?',
      logoUrl: spaceData.logoUrl,
      brandColor: spaceData.brandColor || '#4f46e5',
      settings: spaceData.settings || {
        isAvatarMandatory: false,
        isStarRatingEnabled: true,
        customQuestions: ['What was your favorite aspect of working with us?'],
      },
      createdAt: new Date().toISOString(),
    };

    setSpaces((prev) => [...prev, newSpace]);
    setCurrentSpace(newSpace);
  };

  const handleAddEmployee = async (empData: { name: string; email: string; role: string; department: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/company/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empData),
      });
      if (res.ok) {
        const newEmp = await res.json();
        setCompany((prev) => ({
          ...prev,
          employees: [newEmp, ...prev.employees],
        }));
        return true;
      }
    } catch {
      // fallback
    }

    const fallbackEmp = {
      id: `emp_${Date.now()}`,
      name: empData.name,
      email: empData.email,
      role: empData.role,
      department: empData.department,
      status: 'active' as const,
      joinedDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(empData.name)}`,
    };

    setCompany((prev) => ({
      ...prev,
      employees: [fallbackEmp, ...prev.employees],
    }));
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        spaces={spaces}
        currentSpace={currentSpace}
        onSelectSpace={(s) => setCurrentSpace(s)}
        onOpenNewSpaceModal={() => setIsSpaceModalOpen(true)}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        onOpenQuickReviewModal={() => setIsQuickReviewModalOpen(true)}
        user={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Interactive Top Action Bar: Quick Add, Test Form, Copy Link, QR */}
        <InteractiveActionBar
          currentSpace={currentSpace}
          onOpenQuickReview={() => setIsQuickReviewModalOpen(true)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          onShowToast={(msg) => addToast('Copied to Clipboard! ✨', msg, 'info')}
        />

        {/* TAB 1: Review Moderation Inbox (MERN Spec C) */}
        {currentTab === 'inbox' && (
          <div className="space-y-6">
            
            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Review Moderation Inbox</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {currentSpace?.name}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Moderate customer testimonials, tag featured quotes, or approve submissions for your Wall of Love.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsQuickReviewModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Quick Review</span>
                </button>

                <button
                  onClick={() => setCurrentTab('collect')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open Public Form</span>
                </button>

                <button
                  onClick={() => setCurrentTab('wall')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span>View Wall</span>
                </button>
              </div>
            </div>

            {/* Metrics Card (MERN Spec E) */}
            <MetricsCard stats={currentStats} spaceName={currentSpace?.name || 'Company Reviews'} />

            {/* Moderation Inbox (MERN Spec C) */}
            <ReviewInbox
              testimonials={testimonials}
              onUpdateStatus={handleUpdateStatus}
              onToggleFeature={handleToggleFeature}
              onToggleLike={handleToggleLike}
              spaceSlug={currentSpace?.slug || 'all'}
              onOpenQuickReviewModal={() => setIsQuickReviewModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: Wall of Love Showcase (MERN Spec D) */}
        {currentTab === 'wall' && (
          <WallOfLove
            space={currentSpace}
            testimonials={testimonials}
            onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
            onToggleLike={handleToggleLike}
          />
        )}

        {/* TAB 3: Frictionless Public Collection Form (MERN Spec B) */}
        {currentTab === 'collect' && (
          <PublicCollectionForm
            space={currentSpace}
            onSubmitTestimonial={handleSubmitPublicTestimonial}
            onBackToDashboard={() => setCurrentTab('inbox')}
          />
        )}

        {/* TAB 4: Rating Metrics & Analytics (MERN Spec E) */}
        {currentTab === 'metrics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Rating Analytics &amp; Sentiment Breakdown
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time metrics, review distribution curves, and customer satisfaction index for {currentSpace?.name}.
              </p>
            </div>

            <MetricsCard stats={currentStats} spaceName={currentSpace?.name || 'Company Reviews'} />

            {/* Deep Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Review Volume &amp; Velocity
                </h4>
                <div className="text-3xl font-extrabold text-slate-900">
                  {currentStats.totalReviews}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Total client testimonials recorded in database across all channels.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Wall Approval Ratio
                </h4>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {currentStats.approvalRate}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {currentStats.approvedCount} approved testimonials currently live on public Wall of Love.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pending Moderation
                </h4>
                <div className="text-3xl font-extrabold text-amber-500">
                  {currentStats.pendingCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  New submissions awaiting review in the moderation inbox.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Company Management (User Request Specific) */}
        {currentTab === 'company' && (
          <CompanyManagement
            company={company}
            auditLogs={auditLogs}
            onAddEmployee={handleAddEmployee}
          />
        )}

        {/* TAB 6: Python Backend & Database Integration (User Request Specific) */}
        {currentTab === 'python' && (
          <PythonDatabaseInspector />
        )}

      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      <SpaceModal
        isOpen={isSpaceModalOpen}
        onClose={() => setIsSpaceModalOpen(false)}
        onSaveSpace={handleSaveSpace}
        initialSpace={null}
      />

      <EmbedGeneratorModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        space={currentSpace}
        testimonials={testimonials}
      />

      <QuickReviewModal
        isOpen={isQuickReviewModalOpen}
        onClose={() => setIsQuickReviewModalOpen(false)}
        space={currentSpace}
        onSubmit={handleSubmitPublicTestimonial}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
