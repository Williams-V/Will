import { SERVICE_FEE, feeBreakdown, ksh } from '../lib/format';

export default function About() {
  const ex = feeBreakdown(500);
  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>How Will works</h1>
          <p>Transparent group savings for chamas across Kenya.</p>
        </div>
      </div>

      <div className="card stack">
        <h2>Service fee</h2>
        <p>
          Will charges a <strong>{ksh(SERVICE_FEE)}</strong> service fee per successful contribution, on top of
          the amount a member intends to save, so the chama receives the full contribution.
        </p>
        <div className="fee-box" style={{ maxWidth: 380 }}>
          <div className="line"><span>Member's contribution</span><span>{ksh(ex.contribution)}</span></div>
          <div className="line"><span>Will service fee</span><span>{ksh(ex.fee)}</span></div>
          <div className="line total"><span>Total payable</span><span>{ksh(ex.total)}</span></div>
          <div className="line"><span>Credited to the chama</span><span>{ksh(ex.credited)}</span></div>
        </div>
        <p className="muted small">Any additional M-Pesa transaction charges will be disclosed before payment.</p>
      </div>

      <div className="card stack">
        <h2>Principles</h2>
        <dl className="kv">
          <dt>Transparency</dt><dd>Members can see how contributions, fees and records work.</dd>
          <dt>Accountability</dt><dd>Financial activity is traceable through unique references.</dd>
          <dt>Security</dt><dd>Accounts and financial information must be protected.</dd>
          <dt>Simplicity</dt><dd>Easy to use, including on mobile.</dd>
          <dt>Trust</dt><dd>Group funds, platform revenue and records stay clearly separate.</dd>
        </dl>
      </div>

      <div className="notice">
        This is a frontend-only demo for the foundation phase. Authentication, a backend database, invitations,
        audit logging, M-Pesa payments and payment verification are not yet implemented. Entries you record
        are saved as <strong>unverified</strong> and never change savings totals.
      </div>
    </div>
  );
}