export interface Article {
  id: number;
  title: string;
  content: string;
  category: 'ACTUALITE' | 'INTERVIEW' | 'ETUDE' | 'NOMINATION';
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

// ─── Subscription Tiers ───────────────────────────────────
// COMMUNITY: 100 dh/month — WhatsApp + meetup agenda (pay per meetup: 400 dh)
// PROFESSIONAL: 2500 dh individual / 3500 dh company — all meetups free + benchmark
// SENIOR: 4000 dh individual / 5000 dh company — everything + publish rights
export type MembershipTier = 'FREE' | 'COMMUNITY' | 'PROFESSIONAL' | 'SENIOR';
export type AccountType = 'INDIVIDUAL' | 'COMPANY';

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

// ─── Referral & Credits ───────────────────────────────────
export interface ReferralInfo {
  referralCode: string;         // unique 8-char code, e.g. "PATH-XXXX"
  referredCount: number;        // how many people used this code
  credits: number;              // MAD credits earned (250 MAD per referral)
  freeMonthsEarned: number;     // number of free months earned from referrals
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'SENIOR_MEMBER';
  membershipStatus: 'FREE' | 'PENDING' | 'PREMIUM';
  membershipTier: MembershipTier;
  accountType: AccountType;
  referralInfo: ReferralInfo;
  appliedPromoCode?: string;    // code used at signup (10% discount)
  referredBy?: string;          // referral code that brought this user
}
