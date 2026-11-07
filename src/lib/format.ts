import type { Frequency, ContributionStatus, Role } from './types';

/** Platform service fee per successful contribution, charged on top of the contribution. */
export const SERVICE_FEE = 5;

export function feeBreakdown(amount: number) {
  const contribution = Math.max(0, Math.round(amount));
  return {
    contribution,
    fee: SERVICE_FEE,
    total: contribution + SERVICE_FEE,
    credited: contribution,
  };
}

export const ksh = (n: number) =>
  `KSh ${new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(n)}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

export const frequencyLabel: Record<Frequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
};

export const statusLabel: Record<ContributionStatus, string> = {
  verified: 'Verified',
  unverified: 'Unverified',
  pending: 'Pending',
  failed: 'Failed',
};

export const roleLabel: Record<Role, string> = {
  admin: 'Administrator',
  treasurer: 'Treasurer',
  member: 'Member',
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

/** Normalises Kenyan phone numbers to 2547XXXXXXXX / 2541XXXXXXXX. Returns null if invalid. */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()+]/g, '');
  let n = digits;
  if (/^0[17]\d{8}$/.test(n)) n = '254' + n.slice(1);
  else if (/^[17]\d{8}$/.test(n)) n = '254' + n;
  return /^254[17]\d{8}$/.test(n) ? n : null;
}

export const displayPhone = (p: string) =>
  p.startsWith('254') ? `0${p.slice(3, 6)} ${p.slice(6, 9)} ${p.slice(9)}` : p;

export const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

export const txReference = () =>
  `WILL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;