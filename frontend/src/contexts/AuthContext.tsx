import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MembershipTier, AccountType } from '../types';
import { loginUser, registerUser, validateReferralCode } from '../services/api';

// ─── Static promo codes (backend owns referral codes; these are marketing codes only)
const STATIC_PROMO_CODES: Record<string, number> = {
  'PATH2026':  10,
  'BIENVENUE': 10,
  'RH2026':    10,
  'LAUNCH15':  15,
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isPending: boolean;
  isAdmin: boolean;
  isSenior: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    promoCode?: string,
    accountType?: AccountType
  ) => Promise<{ success: boolean; discountApplied: boolean; discount: number }>;
  logout: () => void;
  upgradeToPremium: (tier?: MembershipTier) => void;
  setPendingLocally: (tier: MembershipTier) => void;
  getDiscount: (promoCode: string) => Promise<number>;
  claimMeetupPass: (paymentRef: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Map backend UserDTO → frontend User type ─────────────────
const mapApiUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role,
  membershipStatus: data.membershipStatus,
  membershipTier: (data.membershipStatus === 'PREMIUM' ? 'COMMUNITY' : 'FREE') as MembershipTier,
  accountType: 'INDIVIDUAL' as AccountType,
  referralInfo: {
    referralCode: data.referralCode ?? '—',
    referredCount: data.referredCount ?? 0,
    credits: data.referralCredits ?? 0,
    freeMonthsEarned: data.freeMonthsEarned ?? 0,
  },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Rehydrate session from localStorage on app load
  useEffect(() => {
    const stored = localStorage.getItem('hr_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('hr_user');
      }
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('hr_user', JSON.stringify(u));
    else localStorage.removeItem('hr_user');
  };

  // ── login ─────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginUser(email, password);
      const mapped = mapApiUser(res.data);
      persistUser(mapped);
      return true;
    } catch (err: any) {
      console.error('Login failed:', err?.response?.data?.error ?? err.message);
      return false;
    }
  };

  // ── register ──────────────────────────────────────────────
  const register = async (
    name: string,
    email: string,
    password: string,
    promoCode?: string,
    _accountType: AccountType = 'INDIVIDUAL'
  ): Promise<{ success: boolean; discountApplied: boolean; discount: number }> => {
    try {
      // Determine discount before calling register (for UI feedback)
      const discount = promoCode ? await getDiscount(promoCode) : 0;

      const res = await registerUser(name, email, password, promoCode);
      const mapped = mapApiUser(res.data);
      persistUser(mapped);

      return { success: true, discountApplied: discount > 0, discount };
    } catch (err: any) {
      console.error('Register failed:', err?.response?.data?.error ?? err.message);
      return { success: false, discountApplied: false, discount: 0 };
    }
  };

  const logout = () => persistUser(null);

  // ── upgradeToPremium (local only — real upgrade goes via PaymentController) ──
  const upgradeToPremium = (tier: MembershipTier = 'COMMUNITY') => {
    if (!user) return;
    const updated: User = {
      ...user,
      membershipStatus: 'PREMIUM',
      membershipTier: tier,
    };
    persistUser(updated);
  };

  const setPendingLocally = (tier: MembershipTier) => {
    if (!user) return;
    persistUser({ ...user, membershipStatus: 'PENDING', membershipTier: tier });
  };

  // ── getDiscount: checks static promos first, then backend referral codes ──
  const getDiscount = async (promoCode: string): Promise<number> => {
    if (!promoCode) return 0;
    const upper = promoCode.toUpperCase().trim();

    // Check static marketing codes first (no API round-trip needed)
    if (STATIC_PROMO_CODES[upper] !== undefined) {
      return STATIC_PROMO_CODES[upper];
    }

    // Then check if it's a real user referral code via backend
    try {
      const res = await validateReferralCode(upper);
      return res.data.discount ?? 0;
    } catch {
      return 0;
    }
  };

  const claimMeetupPass = (_paymentRef: string) => {
    console.log('Meetup pass claimed for ref:', _paymentRef);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isPremium: user?.membershipStatus === 'PREMIUM',
    isPending: user?.membershipStatus === 'PENDING',
    isAdmin: user?.role === 'ADMIN',
    isSenior: user?.membershipTier === 'SENIOR' || user?.role === 'ADMIN',
    login,
    register,
    logout,
    upgradeToPremium,
    setPendingLocally,
    getDiscount,
    claimMeetupPass,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
