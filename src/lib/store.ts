import { useSyncExternalStore } from 'react';
import type { AppState, Chama, Contribution, Frequency, Member, Role } from './types';
import { SERVICE_FEE, txReference, uid } from './format';

const KEY = 'will.demo.v1';

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed(): AppState {
  const m = (name: string, phone: string, role: Role, joined: number): Member => ({
    id: uid('mem'),
    name,
    phone,
    role,
    status: 'active',
    joinedAt: daysAgo(joined),
  });
  const members = [
    m('Wanjiru Kamau', '254712000001', 'admin', 120),
    m('Otieno Odhiambo', '254722000002', 'treasurer', 118),
    m('Achieng Atieno', '254733000003', 'member', 100),
    m('Mwangi Njoroge', '254711000004', 'member', 90),
    m('Fatuma Hassan', '254700000005', 'member', 75),
  ];
  const contributions: Contribution[] = [];
  const plan: [number, number, number][] = [
    // memberIndex, daysAgo, amount
    [0, 60, 1000], [1, 60, 1000], [2, 59, 1000], [3, 58, 1000], [4, 58, 1000],
    [0, 30, 1000], [1, 30, 1000], [2, 29, 1000], [3, 28, 1000],
    [0, 2, 1000], [1, 1, 1000],
  ];
  plan.forEach(([i, d, amount]) => {
    contributions.push({
      id: uid('con'),
      reference: txReference(),
      memberId: members[i].id,
      amount,
      serviceFee: SERVICE_FEE,
      status: 'verified',
      date: daysAgo(d),
      sample: true,
    });
  });
  contributions.push({
    id: uid('con'),
    reference: txReference(),
    memberId: members[4].id,
    amount: 1000,
    serviceFee: SERVICE_FEE,
    status: 'failed',
    date: daysAgo(29),
    note: 'Payment cancelled',
    sample: true,
  });

  const chama: Chama = {
    id: uid('chama'),
    name: 'Umoja Savers (Sample)',
    description:
      'An illustrative chama so you can explore Will. Sample records are labelled and are not real money.',
    target: 120000,
    frequency: 'monthly',
    contributionAmount: 1000,
    paymentNumber: 'Not configured',
    rules:
      'Contributions are due by the 5th of each month. Members who miss two cycles are reviewed by the admin and treasurer.',
    createdAt: daysAgo(120),
    members,
    contributions,
  };
  return { version: 1, chamas: [chama] };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed?.version === 1 && Array.isArray(parsed.chamas)) return parsed;
    }
  } catch {
    /* fall through to seed */
  }
  return seed();
}

let state: AppState = load();
const listeners = new Set<() => void>();

function commit(next: AppState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: keep in-memory state */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useAppState = () => useSyncExternalStore(subscribe, () => state);
export const useChama = (id: string | undefined) =>
  useAppState().chamas.find((c) => c.id === id);

/* ---------- Derived figures ---------- */

/** Only verified contributions count toward savings. */
export const totalSaved = (c: Chama) =>
  c.contributions.filter((x) => x.status === 'verified').reduce((s, x) => s + x.amount, 0);

export const feesCollected = (c: Chama) =>
  c.contributions.filter((x) => x.status === 'verified').reduce((s, x) => s + x.serviceFee, 0);

export const memberSaved = (c: Chama, memberId: string) =>
  c.contributions
    .filter((x) => x.memberId === memberId && x.status === 'verified')
    .reduce((s, x) => s + x.amount, 0);

export const countByStatus = (c: Chama, status: Contribution['status']) =>
  c.contributions.filter((x) => x.status === status).length;

/* ---------- Actions ---------- */

export interface NewChamaInput {
  name: string;
  description: string;
  target: number;
  frequency: Frequency;
  contributionAmount: number;
  paymentNumber: string;
  rules: string;
  adminName: string;
  adminPhone: string;
}

export function createChama(input: NewChamaInput): string {
  const now = new Date().toISOString();
  const admin: Member = {
    id: uid('mem'),
    name: input.adminName.trim(),
    phone: input.adminPhone,
    role: 'admin',
    status: 'active',
    joinedAt: now,
  };
  const chama: Chama = {
    id: uid('chama'),
    name: input.name.trim(),
    description: input.description.trim(),
    target: input.target,
    frequency: input.frequency,
    contributionAmount: input.contributionAmount,
    paymentNumber: input.paymentNumber.trim() || 'Not configured',
    rules: input.rules.trim(),
    createdAt: now,
    members: [admin],
    contributions: [],
  };
  commit({ ...state, chamas: [chama, ...state.chamas] });
  return chama.id;
}

function updateChama(id: string, fn: (c: Chama) => Chama) {
  commit({ ...state, chamas: state.chamas.map((c) => (c.id === id ? fn(c) : c)) });
}

export function addMember(chamaId: string, name: string, phone: string, role: Role) {
  updateChama(chamaId, (c) => ({
    ...c,
    members: [
      ...c.members,
      { id: uid('mem'), name: name.trim(), phone, role, status: 'invited', joinedAt: new Date().toISOString() },
    ],
  }));
}

export function removeMember(chamaId: string, memberId: string) {
  updateChama(chamaId, (c) => ({
    ...c,
    members: c.members.filter((m) => m.id !== memberId),
  }));
}

/**
 * Records a contribution entry. In this frontend-only demo there is no provider
 * confirmation, so the entry is saved as "unverified" and never changes savings totals.
 */
export function recordContribution(chamaId: string, memberId: string, amount: number, note?: string) {
  updateChama(chamaId, (c) => ({
    ...c,
    contributions: [
      {
        id: uid('con'),
        reference: txReference(),
        memberId,
        amount,
        serviceFee: SERVICE_FEE,
        status: 'unverified',
        date: new Date().toISOString(),
        note: note?.trim() || undefined,
      },
      ...c.contributions,
    ],
  }));
}

export function deleteUnverified(chamaId: string, contributionId: string) {
  updateChama(chamaId, (c) => ({
    ...c,
    // Only unverified demo entries can be removed; verified records are immutable.
    contributions: c.contributions.filter(
      (x) => !(x.id === contributionId && x.status === 'unverified'),
    ),
  }));
}

export function deleteChama(id: string) {
  commit({ ...state, chamas: state.chamas.filter((c) => c.id !== id) });
}

export function resetDemo() {
  commit(seed());
}