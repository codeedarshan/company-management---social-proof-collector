export type TestimonialStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  isEmailVerified: boolean;
  role: 'owner' | 'admin' | 'manager';
  createdAt: string;
}

export interface SpaceSettings {
  isAvatarMandatory: boolean;
  isStarRatingEnabled: boolean;
  customQuestions: string[];
  thankYouTitle?: string;
  thankYouMessage?: string;
  collectionType?: 'all' | 'text' | 'video';
}

export interface Space {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  brandColor?: string;
  headline: string;
  customPrompt: string;
  settings: SpaceSettings;
  createdAt: string;
}

export interface TestimonialAnswer {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  spaceSlug: string;
  clientName: string;
  clientEmail: string;
  companyRole: string;
  companyName?: string;
  avatarUrl?: string;
  rating: number; // 1 to 5
  reviewText: string;
  answers?: TestimonialAnswer[];
  status: TestimonialStatus;
  isFeatured: boolean;
  isLiked: boolean;
  submittedAt: string;
  source?: string;
}

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  approvedCount: number;
  pendingCount: number;
  approvalRate: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'on_leave' | 'remote';
  joinedDate: string;
  avatarUrl: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  budget: string;
  employeeCount: number;
}

export interface CompanyDetails {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  website: string;
  headquarters: string;
  founded: string;
  departments: Department[];
  employees: Employee[];
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
  type: 'auth' | 'space' | 'review' | 'system';
}

export interface EmbedConfig {
  theme: 'light' | 'dark' | 'slate' | 'zinc';
  layout: 'grid' | 'carousel' | 'badge';
  maxItems: number;
  showRating: boolean;
  showAvatar: boolean;
  showDate: boolean;
  accentColor: string;
}
