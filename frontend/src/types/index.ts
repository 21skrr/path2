export interface Article {
  id: number;
  title: string;
  content: string;
  category: 'NEWS' | 'NOMINATION' | 'ARTICLE';
  imageUrl: string;
  isPremium: boolean;
  publishedAt: string;
}

export interface Resource {
  id: number;
  title: string;
  fileUrl: string;
  category: 'LEGAL' | 'TEMPLATE' | 'ONBOARDING';
  isPremium: boolean;
}

export interface MembershipPlan {
  id: number;
  name: string;
  priceMad: string;
  description: string;
  billingPeriod: string;
}

export interface PaymentSubmission {
  id: number;
  userId: number;
  planId: number;
  transactionReference: string;
  receiptImageUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt: string;
  reviewNotes: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  membershipStatus: 'FREE' | 'PENDING' | 'PREMIUM';
}
