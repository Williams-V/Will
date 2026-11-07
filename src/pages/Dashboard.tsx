import { Link } from 'react-router-dom';
import { resetDemo, totalSaved, useAppState } from '../lib/store';
import { frequencyLabel, ksh } from '../lib/format';

export default function Dashboard() {
  const { chamas } = useAppState();
  const saved = chamas.reduce((s, c) => s + totalSaved(c), 0);
  const members = chamas.reduce((s, c) => s + c.members.length, 0);

  return (
    <>
      <section className="hero">
        <h1>A smarter way to save together.</h1>
        <p>
          Create a chama, bring in your members and keep clear, traceable contribution records. Only
          payment-confirmed contributions ever count toward your savings.
        </p>
        <div className="row">
          <Link to="/new" className="btn gold">Create a chama</Link>
          <Link to="/about" className="btn secondary">How Will works</Link>
        </div>
      </section>

      <div className="grid stats" style={{ marginBottom: 28 }}>
        <div className="card stat">
          <div className="label">Your chamas</div>
          <div className="value">{chamas.length}</div>
        </div>
        <div className="card stat">
          <div className="label">Members</div>
          <div className="value">{members}</div>
        </div>
        <div className="card stat">
          <div className="label">Verified savings</div>
          <div className="value">{ksh(saved)}</div>
          <div className="hint">Across all chamas</div>
        </div>
      </div>

      <div className="page-head">
        <h2>Chamas</h2>
        <button
          className="btn secondary sm"
          onClick={() => {
            if (confirm('Reset all demo data and restore the sample chama?')) resetDemo();
          }}
        >
          Reset demo data
        </button>
      </div>

      {chamas.length === 0 ? (
        <div className="card empty">
          <h3>No chamas yet</h3>
          <p style={{ margin: '8px 0 16px' }}>Create your first group to get started.</p>
          <Link to="/new" className="btn">Create a chama</Link>
        </div>
      ) : (
        <div className="grid cols-3">
          {chamas.map((c) => {
            const s = totalSaved(c);
            const pct = c.target > 0 ? Math.min(100, Math.round((s / c.target) * 100)) : 0;
            return (
              <Link key={c.id} to={`/chama/${c.id}`} className="card chama-card">
                <div>
                  <h3>{c.name}</h3>
                  <p className="muted small" style={{ marginTop: 4 }}>
                    {c.members.length} member{c.members.length === 1 ? '' : 's'} · {frequencyLabel[c.frequency]} · {ksh(c.contributionAmount)}
                  </p>
                </div>
                <div>
                  <div className="progress" aria-label={`${pct}% of target`}><span style={{ width: `${pct}%` }} /></div>
                  <div className="meta" style={{ marginTop: 8 }}>
                    <span>{ksh(s)} saved</span>
                    <span>{pct}% of {ksh(c.target)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}