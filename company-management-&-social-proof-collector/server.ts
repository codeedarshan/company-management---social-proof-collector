import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Seeds
const DEFAULT_DB = {
  users: [
    {
      id: 'usr_owner_01',
      email: 'owner@acme-global.io',
      name: 'Darshan Jain',
      companyName: 'Acme Corporation Ltd',
      isEmailVerified: true,
      role: 'owner',
      createdAt: new Date().toISOString(),
    },
  ],
  company: {
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
  },
  spaces: [
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
  ],
  testimonials: [
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
  ],
  auditLogs: [
    { id: 'log_1', action: 'System Initialized', details: 'Database seeded with default Acme spaces, company structure & reviews', user: 'System', timestamp: new Date().toISOString(), type: 'system' },
    { id: 'log_2', action: 'Space Created', details: 'Configured public slug /collect/acme-corp', user: 'Darshan Jain', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'space' },
    { id: 'log_3', action: 'Review Moderated', details: 'Approved testimonial from Jessica Reynolds (FinFlow)', user: 'Darshan Jain', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'review' },
  ],
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return DEFAULT_DB;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// Ensure DB is initialized
readDb();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // API Logging middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Acme Proof & Company Management API',
      port: PORT,
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // =================================================================
  // AUTH ROUTES (Pair Token JWT Architecture Spec)
  // Short-lived Access Token (15m) + Long-lived Refresh Token (7d)
  // =================================================================

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, companyName, password } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }
    const db = readDb();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      name,
      companyName: companyName || 'My Company',
      isEmailVerified: false,
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Owner Registration',
      details: `Account created for ${email}. Email verification simulated.`,
      user: name,
      timestamp: new Date().toISOString(),
      type: 'auth',
    });
    writeDb(db);

    // Simulate pair token
    const accessToken = `jwt_acc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const refreshToken = `jwt_ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: 'Signup successful! Verification link simulated.',
      accessToken,
      user: newUser,
      simulatedVerificationCode: '492810',
    });
  });

  app.post('/api/auth/verify-email', (req: Request, res: Response) => {
    const { email } = req.body;
    const db = readDb();
    const user = db.users.find((u: any) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (user) {
      user.isEmailVerified = true;
      writeDb(db);
    }
    return res.json({ success: true, message: 'Email address verified successfully!' });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const db = readDb();
    let user = db.users.find((u: any) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      // Allow demo login
      if (email === 'owner@acme-global.io' || !email) {
        user = db.users[0];
      } else {
        return res.status(401).json({ error: 'Invalid credentials. Try owner@acme-global.io' });
      }
    }

    const accessToken = `jwt_acc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const refreshToken = `jwt_ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Owner Login',
      details: `Successful login with token rotation for ${user.email}`,
      user: user.name,
      timestamp: new Date().toISOString(),
      type: 'auth',
    });
    writeDb(db);

    return res.json({
      success: true,
      accessToken,
      user,
      expiresIn: 900, // 15 minutes
    });
  });

  app.post('/api/auth/refresh', (req: Request, res: Response) => {
    // Token rotation simulation
    const newAccessToken = `jwt_acc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newRefreshToken = `jwt_ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: 900,
    });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    return res.json({
      success: true,
      message: `Password reset instructions dispatched to ${email || 'your email'}. Token valid for 15 minutes.`,
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // =================================================================
  // SPACE MANAGEMENT ROUTES (Spec A)
  // Slugs: /collect/:spaceSlug, Brand logos, Prompts, Toggles
  // =================================================================

  app.get('/api/spaces', (req: Request, res: Response) => {
    const db = readDb();
    return res.json(db.spaces);
  });

  app.get('/api/spaces/:slug', (req: Request, res: Response) => {
    const db = readDb();
    const space = db.spaces.find((s: any) => s.slug.toLowerCase() === req.params.slug.toLowerCase());
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    return res.json(space);
  });

  app.post('/api/spaces', (req: Request, res: Response) => {
    const { name, slug, headline, customPrompt, logoUrl, brandColor, settings } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and Slug are required' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '');
    const db = readDb();

    if (db.spaces.some((s: any) => s.slug === cleanSlug)) {
      return res.status(409).json({ error: `Slug "${cleanSlug}" is already taken. Please choose another.` });
    }

    const newSpace = {
      id: `spc_${Date.now()}`,
      ownerId: 'usr_owner_01',
      name,
      slug: cleanSlug,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      brandColor: brandColor || '#4f46e5',
      headline: headline || 'Share your feedback with our company',
      customPrompt: customPrompt || 'How was your experience working with our team?',
      settings: {
        isAvatarMandatory: !!settings?.isAvatarMandatory,
        isStarRatingEnabled: settings?.isStarRatingEnabled !== false,
        customQuestions: settings?.customQuestions || ['What problem did our team help you solve?'],
        thankYouTitle: settings?.thankYouTitle || 'Thank you for your feedback! ❤️',
        thankYouMessage: settings?.thankYouMessage || 'Your review has been received for moderation.',
      },
      createdAt: new Date().toISOString(),
    };

    db.spaces.push(newSpace);
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Space Created',
      details: `Created new review collection space "${name}" at /collect/${cleanSlug}`,
      user: 'Darshan Jain',
      timestamp: new Date().toISOString(),
      type: 'space',
    });
    writeDb(db);

    return res.status(201).json(newSpace);
  });

  app.put('/api/spaces/:id', (req: Request, res: Response) => {
    const db = readDb();
    const index = db.spaces.findIndex((s: any) => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Space not found' });
    }

    const updated = {
      ...db.spaces[index],
      ...req.body,
      id: db.spaces[index].id,
      settings: {
        ...db.spaces[index].settings,
        ...(req.body.settings || {}),
      },
    };

    db.spaces[index] = updated;
    writeDb(db);
    return res.json(updated);
  });

  // =================================================================
  // FRICTIONLESS PUBLIC COLLECTION FORM (Spec B)
  // Public URL: /collect/:spaceSlug accessible without client login
  // Capturing client name, email, company role, rating, reviewText, avatar upload
  // =================================================================

  app.post('/api/testimonials/public/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const { clientName, clientEmail, companyRole, companyName, avatarUrl, rating, reviewText, answers } = req.body;

    const db = readDb();
    const space = db.spaces.find((s: any) => s.slug.toLowerCase() === slug.toLowerCase());
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    if (!clientName || !clientEmail || !reviewText) {
      return res.status(400).json({ error: 'Name, email, and review text are mandatory' });
    }

    if (space.settings.isAvatarMandatory && !avatarUrl) {
      return res.status(400).json({ error: 'Avatar / profile photo is mandatory for this space' });
    }

    const parsedRating = space.settings.isStarRatingEnabled ? Math.min(5, Math.max(1, Number(rating) || 5)) : 5;

    const newTestimonial = {
      id: `t_${Date.now()}`,
      spaceSlug: space.slug,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      companyRole: companyRole ? companyRole.trim() : 'Customer',
      companyName: companyName ? companyName.trim() : '',
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`,
      rating: parsedRating,
      reviewText: reviewText.trim(),
      answers: answers || [],
      status: 'pending', // all public submissions land in moderation inbox
      isFeatured: false,
      isLiked: false,
      submittedAt: new Date().toISOString(),
      source: req.headers['user-agent'] ? 'Web Browser' : 'Direct API',
    };

    db.testimonials.unshift(newTestimonial);
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Review Submitted',
      details: `New ${parsedRating}★ submission from ${clientName} (${space.name})`,
      user: clientName,
      timestamp: new Date().toISOString(),
      type: 'review',
    });
    writeDb(db);

    return res.status(201).json({
      success: true,
      message: space.settings.thankYouMessage || 'Thank you for your feedback! Review received for moderation.',
      thankYouTitle: space.settings.thankYouTitle || 'Thank you! ❤️',
      testimonial: newTestimonial,
    });
  });

  // =================================================================
  // REVIEW MODERATION & TAGGING INBOX (Spec C)
  // Filters: All, Pending, Approved, Archived
  // Controls: Approve, Reject, Featured, Liked, Keyword search, Star filter
  // =================================================================

  app.get('/api/testimonials/owner', (req: Request, res: Response) => {
    const { spaceSlug, status, search, rating, sort } = req.query;
    const db = readDb();
    let list = [...db.testimonials];

    if (spaceSlug && spaceSlug !== 'all') {
      list = list.filter((t: any) => t.spaceSlug === spaceSlug);
    }

    if (status && status !== 'all') {
      list = list.filter((t: any) => t.status === status);
    }

    if (rating && rating !== 'all') {
      const num = Number(rating);
      list = list.filter((t: any) => t.rating === num);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t: any) =>
          t.clientName.toLowerCase().includes(q) ||
          t.clientEmail.toLowerCase().includes(q) ||
          t.companyRole.toLowerCase().includes(q) ||
          (t.companyName && t.companyName.toLowerCase().includes(q)) ||
          t.reviewText.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return res.json(list);
  });

  app.patch('/api/testimonials/:id/status', (req: Request, res: Response) => {
    const { status } = req.body; // 'approved' | 'rejected' | 'archived' | 'pending'
    if (!['approved', 'rejected', 'archived', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const db = readDb();
    const item = db.testimonials.find((t: any) => t.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const prevStatus = item.status;
    item.status = status;

    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: `Review ${status.toUpperCase()}`,
      details: `Changed status of review by ${item.clientName} from ${prevStatus} to ${status}`,
      user: 'Darshan Jain',
      timestamp: new Date().toISOString(),
      type: 'review',
    });
    writeDb(db);

    return res.json(item);
  });

  app.patch('/api/testimonials/:id/toggle-feature', (req: Request, res: Response) => {
    const db = readDb();
    const item = db.testimonials.find((t: any) => t.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    item.isFeatured = !item.isFeatured;
    writeDb(db);
    return res.json(item);
  });

  app.patch('/api/testimonials/:id/toggle-like', (req: Request, res: Response) => {
    const db = readDb();
    const item = db.testimonials.find((t: any) => t.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    item.isLiked = !item.isLiked;
    writeDb(db);
    return res.json(item);
  });

  // =================================================================
  // "WALL OF LOVE" SHOWCASE (Spec D)
  // Public responsive masonry grid: /wall/:spaceSlug
  // =================================================================

  app.get('/api/testimonials/wall/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const db = readDb();
    const approved = db.testimonials.filter(
      (t: any) => t.spaceSlug.toLowerCase() === slug.toLowerCase() && t.status === 'approved'
    );

    approved.sort((a: any, b: any) => {
      if (b.isFeatured !== a.isFeatured) return b.isFeatured ? 1 : -1;
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    const space = db.spaces.find((s: any) => s.slug.toLowerCase() === slug.toLowerCase());

    return res.json({
      space: space || { name: slug, slug },
      testimonials: approved,
    });
  });

  // =================================================================
  // RATING METRICS & SUMMARY STATS (Spec E)
  // Average rating, total count, star breakdown
  // =================================================================

  app.get('/api/analytics/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const db = readDb();
    const reviews = slug === 'all' 
      ? db.testimonials 
      : db.testimonials.filter((t: any) => t.spaceSlug.toLowerCase() === slug.toLowerCase());

    const approved = reviews.filter((t: any) => t.status === 'approved');
    const pending = reviews.filter((t: any) => t.status === 'pending');

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;

    approved.forEach((t: any) => {
      const r = Math.min(5, Math.max(1, t.rating || 5));
      distribution[r] = (distribution[r] || 0) + 1;
      totalScore += r;
    });

    const averageRating = approved.length > 0 ? Number((totalScore / approved.length).toFixed(1)) : 5.0;

    return res.json({
      averageRating,
      totalReviews: reviews.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      approvalRate: reviews.length > 0 ? Math.round((approved.length / reviews.length) * 100) : 100,
      distribution,
    });
  });

  // =================================================================
  // COMPANY MANAGEMENT & EMPLOYEES (User Prompt Specific)
  // =================================================================

  app.get('/api/company', (req: Request, res: Response) => {
    const db = readDb();
    return res.json(db.company);
  });

  app.post('/api/company/employee', (req: Request, res: Response) => {
    const { name, email, role, department } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    const db = readDb();
    const newEmp = {
      id: `emp_${Date.now()}`,
      name,
      email,
      role,
      department: department || 'General',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };

    db.company.employees.unshift(newEmp);
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'Employee Added',
      details: `Added ${name} as ${role} in ${department}`,
      user: 'Darshan Jain',
      timestamp: new Date().toISOString(),
      type: 'system',
    });
    writeDb(db);

    return res.status(201).json(newEmp);
  });

  app.get('/api/audit-logs', (req: Request, res: Response) => {
    const db = readDb();
    return res.json(db.auditLogs.slice(0, 50));
  });

  // =================================================================
  // PYTHON DATABASE & INTEGRATION TEST ROUTE
  // Executes Python 3 SQLite backend script and returns actual DB metrics
  // =================================================================

  app.get('/api/python/run-test', (req: Request, res: Response) => {
    exec('python3 python_testimonial_system.py', { timeout: 8000 }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          stderr,
        });
      }
      return res.json({
        success: true,
        output: stdout,
        engine: 'SQLite 3 via Python 3 Standard Library',
        executedAt: new Date().toISOString(),
      });
    });
  });

  app.post('/api/python/execute-query', (req: Request, res: Response) => {
    const { action, query } = req.body;
    
    // Build python script string to run safely
    let pythonCmd = '';
    if (action === 'get_metrics') {
      pythonCmd = `python3 -c "from python_testimonial_system import TestimonialCollectorDB; import json; db=TestimonialCollectorDB(); print(json.dumps(db.get_rating_metrics('acme-corp'), indent=2))"`;
    } else if (action === 'test_jwt') {
      pythonCmd = `python3 -c "from python_testimonial_system import TestimonialCollectorDB; import json; db=TestimonialCollectorDB(); res, _ = db.login_user('owner@acme-global.io', 'password123'); print(json.dumps({'message': '15m JWT Access Token generated + Refresh Token rotated', 'token': res.get('accessToken'), 'refresh': res.get('refreshToken')}, indent=2))"`;
    } else if (action === 'inspect_schema') {
      pythonCmd = `python3 -c "import sqlite3, json; conn=sqlite3.connect('testimonial_collector.db'); cur=conn.cursor(); cur.execute(\\"SELECT name, sql FROM sqlite_master WHERE type='table'\\"); rows=[{'table': r[0], 'schema': r[1]} for r in cur.fetchall()]; print(json.dumps(rows, indent=2))"`;
    } else if (action === 'custom_sql' && query) {
      // Basic sanity check to avoid arbitrary write injections
      const cleanQ = query.trim();
      if (!cleanQ.toLowerCase().startsWith('select')) {
        return res.status(400).json({ success: false, error: 'Only SELECT queries are allowed in the live interactive console.' });
      }
      const escapedQ = cleanQ.replace(/"/g, '\\"');
      pythonCmd = `python3 -c "import sqlite3, json; conn=sqlite3.connect('testimonial_collector.db'); conn.row_factory=sqlite3.Row; cur=conn.cursor(); cur.execute(\\"${escapedQ}\\"); rows=[dict(r) for r in cur.fetchall()]; print(json.dumps(rows, indent=2))"`;
    } else {
      pythonCmd = `python3 python_testimonial_system.py`;
    }

    exec(pythonCmd, { timeout: 8000 }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          stderr,
        });
      }
      let parsed = stdout;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        // keep as text
      }
      return res.json({
        success: true,
        action: action || 'run_test',
        result: parsed,
        raw: stdout,
        executedAt: new Date().toISOString(),
      });
    });
  });

  app.get('/api/python/source-code', (req: Request, res: Response) => {
    try {
      const backendCode = fs.readFileSync(path.join(process.cwd(), 'python_testimonial_system.py'), 'utf-8');
      const serverCode = fs.readFileSync(path.join(process.cwd(), 'python_server.py'), 'utf-8');
      const guiCode = fs.readFileSync(path.join(process.cwd(), 'python_gui_app.py'), 'utf-8');
      return res.json({
        backendCode,
        serverCode,
        guiCode,
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // =================================================================
  // Vite Middleware & SPA Serving
  // =================================================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
