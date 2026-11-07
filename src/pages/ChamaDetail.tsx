import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addMember,
  countByStatus,
  deleteChama,
  deleteUnverified,
  feesCollected,
  memberSaved,
  recordContribution,
  removeMember,
  totalSaved,
  useChama,
} from '../lib/store';
import {
  displayPhone,
  feeBreakdown,
  formatDate,
  frequencyLabel,
  initials,
  ksh,
  normalizeKenyanPhone,
  roleLabel,
  statusLabel,
} from '../lib/format';
import { downloadCsv } from '../lib/csv';
import type { Chama, Role } from '../lib/types';

type Tab = 'overview' | 'members' | 'contributions' | 'reports';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'reports', label: 'Reports' },
];

export default function ChamaDetail() {
  const { id } = useParams();
  const chama = useChama(id);
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');

  if (!chama) {
    return (
      <div className="card empty">
        <h3>Chama not found</h3>
        <p style={{ margin: '8px 0 16px' }}>It may have been deleted or never existed in this browser.</p>
        <Link to="/" className="btn">Back to chamas</Link>
      </div>
    );
  }

  return (
    <>
      <div className="crumb"><Link to="/">Chamas</Link> / {chama.name}</div>
      <div className="page-head">
        <div>
          <h1>{chama.name}</h1>
          {chama.description && <p>{chama.description}</p>}
        </div>
        <button
          className="btn danger sm"
          onClick={() => {
            if (confirm(`Delete "${chama.name}" from this browser? This cannot be undone.`)) {
              deleteChama(chama.id);
              nav('/');
            }
          }}
        >
          Delete chama
        </button>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview chama={chama} />}
      {tab === 'members' && <Members chama={chama} />}
      {tab === 'contributions' && <Contributions chama={chama} />}
      {tab === 'reports' && <Reports chama={chama} />}
    </>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ chama }: { chama: Chama }) {
  const saved = totalSaved(chama);
  const pct = chama.target > 0 ? Math.min(100, Math.round((saved / chama.target) * 100)) : 0;
  const unverified = countByStatus(chama, 'unverified');
  return (
    <div className="stack">
      <div className="grid stats">
        <div className="card stat">
          <div className="label">Verified savings</div>
          <div className="value">{ksh(saved)}</div>
          <div className="hint">{pct}% of {ksh(chama.target)} target</div>
        </div>
        <div className="card stat">
          <div className="label">Members</div>
          <div className="value">{chama.members.length}</div>
        </div>
        <div className="card stat">
          <div className="label">Unverified entries</div>
          <div className="value">{unverified}</div>
          <div className="hint">Not counted in savings</div>
        </div>
        <div className="card stat">
          <div className="label">Failed</div>
          <div className="value">{countByStatus(chama, 'failed')}</div>
        </div>
      </div>

      <div className="card stack">
        <h3>Progress to target</h3>
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
        <p className="muted small">{ksh(saved)} of {ksh(chama.target)}</p>
      </div>

      <div className="card stack">
        <h3>Saving rules</h3>
        <dl className="kv">
          <dt>Schedule</dt><dd>{frequencyLabel[chama.frequency]}</dd>
          <dt>Contribution</dt><dd>{ksh(chama.contributionAmount)} per member</dd>
          <dt>M-Pesa number</dt><dd>{chama.paymentNumber}</dd>
          <dt>Created</dt><dd>{formatDate(chama.createdAt)}</dd>
        </dl>
        {chama.rules && <p className="small">{chama.rules}</p>}
      </div>
    </div>
  );
}

/* ---------------- Members ---------------- */
function Members({ chama }: { chama: Chama }) {
  const [error, setError] = useState('');

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get('name') ?? '').trim();
    const phone = normalizeKenyanPhone(String(f.get('phone') ?? ''));
    const role = String(f.get('role')) as Role;
    if (name.length < 2) return setError('Enter the member’s name.');
    if (!phone) return setError('Enter a valid Kenyan phone number.');
    if (chama.members.some((m) => m.phone === phone)) return setError('That number is already in this group.');
    setError('');
    addMember(chama.id, name, phone, role);
    form.reset();
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th><th>Role</th><th>Status</th><th className="num">Verified savings</th><th />
              </tr>
            </thead>
            <tbody>
              {chama.members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="row">
                      <span className="avatar">{initials(m.name)}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div className="muted small">{displayPhone(m.phone)}</div>
                      </div>
                    </div>
                  </td>
                  <td>{roleLabel[m.role]}</td>
                  <td><span className={`badge ${m.status === 'active' ? 'verified' : 'unverified'}`}>{m.status === 'active' ? 'Active' : 'Invited'}</span></td>
                  <td className="num">{ksh(memberSaved(chama, m.id))}</td>
                  <td className="num">
                    {m.role !== 'admin' && (
                      <button
                        className="btn danger sm"
                        onClick={() => {
                          if (confirm(`Remove ${m.name} from the group?`)) removeMember(chama.id, m.id);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form className="card form" onSubmit={onAdd} noValidate>
        <h3>Add a member</h3>
        <div className="two">
          <div className="field">
            <label htmlFor="m-name">Full name</label>
            <input id="m-name" name="name" />
          </div>
          <div className="field">
            <label htmlFor="m-phone">Phone number</label>
            <input id="m-phone" name="phone" type="tel" placeholder="0712 345 678" />
          </div>
        </div>
        <div className="field" style={{ maxWidth: 260 }}>
          <label htmlFor="m-role">Role</label>
          <select id="m-role" name="role" defaultValue="member">
            <option value="member">Member</option>
            <option value="treasurer">Treasurer</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        {error && <span className="error" style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
        <div><button className="btn" type="submit">Add member</button></div>
        <p className="muted small">In the full platform, members will receive an invitation to accept. Here they are marked “Invited”.</p>
      </form>
    </div>
  );
}

/* ---------------- Contributions ---------------- */
function Contributions({ chama }: { chama: Chama }) {
  const [amount, setAmount] = useState(String(chama.contributionAmount));
  const [memberId, setMemberId] = useState(chama.members[0]?.id ?? '');
  const [error, setError] = useState('');
  const fee = feeBreakdown(Number(amount) || 0);
  const nameOf = (id: string) => chama.members.find((m) => m.id === id)?.name ?? 'Former member';

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!memberId) return setError('Select a member.');
    if (!Number.isFinite(n) || n < 10) return setError('Minimum contribution is KSh 10.');
    setError('');
    recordContribution(chama.id, memberId, Math.round(n));
  }

  return (
    <div className="stack">
      <form className="card form" onSubmit={onSubmit} noValidate>
        <h3>Record a contribution</h3>
        <div className="two">
          <div className="field">
            <label htmlFor="c-member">Member</label>
            <select id="c-member" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              {chama.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-amount">Contribution (KSh)</label>
            <input id="c-amount" type="number" inputMode="numeric" min={10} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        <div className="fee-box" aria-live="polite">
          <div className="line"><span>Member's contribution</span><span>{ksh(fee.contribution)}</span></div>
          <div className="line"><span>Will service fee</span><span>{ksh(fee.fee)}</span></div>
          <div className="line total"><span>Total payable</span><span>{ksh(fee.total)}</span></div>
          <div className="line muted small"><span>Credited to the chama</span><span>{ksh(fee.credited)}</span></div>
        </div>

        <div className="notice info">
          M-Pesa payment is not connected yet. This entry will be saved as <strong>unverified</strong> and will not
          change the group's savings total until payment confirmation exists.
        </div>
        {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
        <div><button className="btn" type="submit" disabled={chama.members.length === 0}>Save unverified entry</button></div>
      </form>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Transaction history</h3>
        {chama.contributions.length === 0 ? (
          <div className="empty">No contributions recorded yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Member</th><th>Reference</th><th className="num">Amount</th><th className="num">Fee</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {[...chama.contributions]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((c) => (
                  <tr key={c.id}>
                    <td>{formatDate(c.date)}</td>
                    <td>{nameOf(c.memberId)}</td>
                    <td className="mono">{c.reference}</td>
                    <td className="num">{ksh(c.amount)}</td>
                    <td className="num">{ksh(c.serviceFee)}</td>
                    <td>
                      <span className={`badge ${c.status}`}>{statusLabel[c.status]}</span>{' '}
                      {c.sample && <span className="badge sample">Sample</span>}
                    </td>
                    <td className="num">
                      {c.status === 'unverified' && (
                        <button className="btn secondary sm" onClick={() => deleteUnverified(chama.id, c.id)}>Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Reports ---------------- */
function Reports({ chama }: { chama: Chama }) {
  const nameOf = (id: string) => chama.members.find((m) => m.id === id)?.name ?? 'Former member';
  const slug = chama.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'chama';

  return (
    <div className="stack">
      <div className="grid stats">
        <div className="card stat">
          <div className="label">Verified savings</div>
          <div className="value">{ksh(totalSaved(chama))}</div>
        </div>
        <div className="card stat">
          <div className="label">Service fees (verified)</div>
          <div className="value">{ksh(feesCollected(chama))}</div>
          <div className="hint">Recorded separately from savings</div>
        </div>
        <div className="card stat">
          <div className="label">Total entries</div>
          <div className="value">{chama.contributions.length}</div>
        </div>
      </div>

      <div className="card stack">
        <h3>Downloads</h3>
        <p className="muted small">CSV files open in Excel or Google Sheets.</p>
        <div className="row">
          <button
            className="btn"
            onClick={() =>
              downloadCsv(
                `${slug}-contributions.csv`,
                ['Date', 'Member', 'Reference', 'Contribution (KSh)', 'Service fee (KSh)', 'Status'],
                chama.contributions.map((c) => [
                  c.date.slice(0, 10), nameOf(c.memberId), c.reference, c.amount, c.serviceFee, statusLabel[c.status],
                ]),
              )
            }
          >
            Contributions CSV
          </button>
          <button
            className="btn secondary"
            onClick={() =>
              downloadCsv(
                `${slug}-members.csv`,
                ['Name', 'Phone', 'Role', 'Status', 'Verified savings (KSh)'],
                chama.members.map((m) => [m.name, m.phone, roleLabel[m.role], m.status, memberSaved(chama, m.id)]),
              )
            }
          >
            Members CSV
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Member statements</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Member</th><th className="num">Verified</th><th className="num">Entries</th></tr></thead>
            <tbody>
              {chama.members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td className="num">{ksh(memberSaved(chama, m.id))}</td>
                  <td className="num">{chama.contributions.filter((c) => c.memberId === m.id).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}