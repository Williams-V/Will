export type Frequency = 'weekly' | 'biweekly' | 'monthly';
export type Role = 'admin' | 'treasurer' | 'member';
export type MemberStatus = 'active' | 'invited';

/**
 * unverified – recorded locally, no trusted payment confirmation yet
 * verified   – confirmed by a trusted payment-provider notification (future: backend)
 * failed     – payment failed or was cancelled
 * pending    – payment request initiated, awaiting provider result
 */
export type ContributionStatus = 'unverified' | 'verified' | 'pending' | 'failed';

export interface Member {
  id: string;
  name: string;
  phone: string;
  role: Role;
  status: MemberStatus;
  joinedAt: string; // ISO date
}

export interface Contribution {
  id: string;
  reference: string; // unique transaction reference
  memberId: string;
  amount: number; // KSh credited to the chama (excludes service fee)
  serviceFee: number; // KSh 5, recorded separately
  status: ContributionStatus;
  date: string; // ISO date
  note?: string;
  sample?: boolean; // illustrative demo record
}

export interface Chama {
  id: string;
  name: string;
  description: string;
  target: number;
  frequency: Frequency;
  contributionAmount: number;
  paymentNumber: string; // designated M-Pesa paybill/till/number (display only in demo)
  rules: string;
  createdAt: string;
  members: Member[];
  contributions: Contribution[];
}

export interface AppState {
  version: 1;
  chamas: Chama[];
}