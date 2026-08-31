import axios from 'axios';
import { Article, Resource, MembershipPlan, PaymentSubmission } from '../types';

// Re-export Resource so components can import it from api.ts too
export type { Resource };

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ── Auth ─────────────────────────────────────────────────────
export const loginUser = (email: string, password: string) =>
  apiClient.post('/auth/login', { email, password });

export const registerUser = (
  name: string,
  email: string,
  password: string,
  referralCode?: string
) => apiClient.post('/auth/register', { name, email, password, referralCode });

// ── Referrals ─────────────────────────────────────────────────
export const fetchReferralStats = (userId: number) =>
  apiClient.get(`/referrals/stats/${userId}`);

export const validateReferralCode = (code: string) =>
  apiClient.get('/referrals/validate', { params: { code } });

// ── Articles ─────────────────────────────────────────────────
export const fetchArticles = (isPremium: boolean = false) =>
  apiClient.get<Article[]>('/articles', { params: { isPremium } });

export const fetchArticlesByCategory = (category: string) =>
  apiClient.get<Article[]>(`/articles/category/${category}`);

export const fetchArticleById = (id: number) =>
  apiClient.get<Article>(`/articles/${id}`);

// ── Resources ─────────────────────────────────────────────────
export const fetchResources = (isPremium: boolean = false) =>
  apiClient.get<Resource[]>('/resources', { params: { isPremium } });

export const fetchResourcesByCategory = (category: string) =>
  apiClient.get<Resource[]>(`/resources/category/${category}`);

// ── Membership Plans ──────────────────────────────────────────
export const fetchMembershipPlans = () =>
  apiClient.get<MembershipPlan[]>('/plans');

// ── Payments ─────────────────────────────────────────────────
export const initiatePayment = (userId: number, planId: number) =>
  apiClient.post('/payments/initiate', null, { params: { userId, planId } });

export const uploadReceipt = (paymentId: number, userId: number, receiptImageUrl: string) =>
  apiClient.put(`/payments/${paymentId}/receipt`, { receiptImageUrl }, { params: { userId } });

export const fetchUserPaymentHistory = (userId: number) =>
  apiClient.get<PaymentSubmission[]>(`/payments/user/${userId}`);

// ── Admin ─────────────────────────────────────────────────────
export const fetchPendingPayments = () =>
  apiClient.get<PaymentSubmission[]>('/payments/admin/pending');

export const approvePayment = (paymentId: number, reviewNotes: string) =>
  apiClient.put(`/payments/admin/${paymentId}/approve`, { reviewNotes });

export const rejectPayment = (paymentId: number, reviewNotes: string) =>
  apiClient.put(`/payments/admin/${paymentId}/reject`, { reviewNotes });

// ── Users (Admin) ─────────────────────────────────────────────
export const fetchAllUsers = () =>
  apiClient.get('/users');

export const deleteUser = (userId: number) =>
  apiClient.delete(`/users/${userId}`);

export const updateUserMembership = (userId: number, membershipStatus: string) =>
  apiClient.put(`/users/${userId}/membership`, { membershipStatus });

// ── Jobs ──────────────────────────────────────────────────────
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  createdAt: string;
}

export const fetchJobs = () =>
  apiClient.get<Job[]>('/jobs');

export const createJob = (job: Omit<Job, 'id' | 'createdAt'>) =>
  apiClient.post<Job>('/jobs', job);

export const deleteJob = (jobId: number) =>
  apiClient.delete(`/jobs/${jobId}`);

