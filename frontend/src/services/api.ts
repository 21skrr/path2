import axios from 'axios';
import { Article, Resource, MembershipPlan, PaymentSubmission } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Articles
export const fetchArticles = (isPremium: boolean = false) =>
  apiClient.get<Article[]>('/articles', { params: { isPremium } });

export const fetchArticlesByCategory = (category: string) =>
  apiClient.get<Article[]>(`/articles/category/${category}`);

export const fetchArticleById = (id: number) =>
  apiClient.get<Article>(`/articles/${id}`);

// Resources
export const fetchResources = (isPremium: boolean = false) =>
  apiClient.get<Resource[]>('/resources', { params: { isPremium } });

export const fetchResourcesByCategory = (category: string) =>
  apiClient.get<Resource[]>(`/resources/category/${category}`);

// Membership Plans
export const fetchMembershipPlans = () =>
  apiClient.get<MembershipPlan[]>('/plans');

// Payments
export const initiatePayment = (userId: number, planId: number) =>
  apiClient.post('/payments/initiate', null, { params: { userId, planId } });

export const uploadReceipt = (paymentId: number, userId: number, receiptImageUrl: string) =>
  apiClient.put(`/payments/${paymentId}/receipt`, { receiptImageUrl }, { params: { userId } });

export const fetchUserPaymentHistory = (userId: number) =>
  apiClient.get<PaymentSubmission[]>(`/payments/user/${userId}`);

// Admin
export const fetchPendingPayments = () =>
  apiClient.get<PaymentSubmission[]>('/payments/admin/pending');

export const approvePayment = (paymentId: number, reviewNotes: string) =>
  apiClient.put(`/payments/admin/${paymentId}/approve`, { reviewNotes });

export const rejectPayment = (paymentId: number, reviewNotes: string) =>
  apiClient.put(`/payments/admin/${paymentId}/reject`, { reviewNotes });
