import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createChama } from '../lib/store';
import { normalizeKenyanPhone } from '../lib/format';
import type { Frequency } from '../lib/types';

export default function CreateChama() {
  const nav = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    const errs: Record<string, string> = {};

    const name = get('name');
    const target = Number(get('target'));
    const amount = Number(get('amount'));
    const adminName = get('adminName');
    const phone = normalizeKenyanPhone(get('adminPhone'));

    if (name.length < 3) errs.name = 'Enter a group name (at least 3 characters).';
    if (!Number.isFinite(target) || target < 1) errs.target = 'Enter a saving target above 0.';
    if (!Number.isFinite(amount) || amount < 10) errs.amount = 'Minimum contribution is KSh 10.';
    if (adminName.length < 2) errs.adminName = 'Enter your name.';
    if (!phone) errs.adminPhone = 'Enter a valid Kenyan number, e.g. 0712 345 678.';

    setErrors(errs);
    if (Object.keys(errs).length || !phone) return;

    const id = createChama({
      name,
      description: get('description'),
      target: Math.round(target),
      frequency: get('frequency') as Frequency,
      contributionAmount: Math.round(amount),
      paymentNumber: get('paymentNumber'),
      rules: get('rules'),
      adminName,
      adminPhone: phone,
    });
    nav(`/chama/${id}`);
  }

  return (
    <>
      <div className="crumb"><Link to="/">Chamas</Link> / New</div>
      <div className="page-head">
        <div>
          <h1>Create a chama</h1>
          <p>Set up your group's details and saving rules. You'll be added as the administrator.</p>
        </div>
      </div>

      <form className="card form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Group name</label>
          <input id="name" name="name" placeholder="e.g. Umoja Women's Group" maxLength={60} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="description">Description <span className="muted">(optional)</span></label>
          <textarea id="description" name="description" maxLength={300} placeholder="What is this group saving for?" />
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="target">Saving target (KSh)</label>
            <input id="target" name="target" type="number" inputMode="numeric" min={1} placeholder="100000" />
            {errors.target && <span className="error">{errors.target}</span>}
          </div>
          <div className="field">
            <label htmlFor="amount">Contribution per member (KSh)</label>
            <input id="amount" name="amount" type="number" inputMode="numeric" min={10} placeholder="500" />
            {errors.amount && <span className="error">{errors.amount}</span>}
          </div>
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="frequency">Contribution schedule</label>
            <select id="frequency" name="frequency" defaultValue="monthly">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="paymentNumber">Designated M-Pesa number <span className="muted">(optional)</span></label>
            <input id="paymentNumber" name="paymentNumber" placeholder="Paybill / Till / phone" />
            <span className="help">Display only for now. Real payment routing is confirmed during integration.</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="rules">Group rules <span className="muted">(optional)</span></label>
          <textarea id="rules" name="rules" maxLength={800} placeholder="Due dates, late-payment handling, leaving the group…" />
        </div>

        <h3>Your details (administrator)</h3>
        <div className="two">
          <div className="field">
            <label htmlFor="adminName">Full name</label>
            <input id="adminName" name="adminName" autoComplete="name" />
            {errors.adminName && <span className="error">{errors.adminName}</span>}
          </div>
          <div className="field">
            <label htmlFor="adminPhone">Phone number</label>
            <input id="adminPhone" name="adminPhone" type="tel" autoComplete="tel" placeholder="0712 345 678" />
            {errors.adminPhone && <span className="error">{errors.adminPhone}</span>}
          </div>
        </div>

        <div className="row">
          <button className="btn" type="submit">Create chama</button>
          <Link to="/" className="btn secondary">Cancel</Link>
        </div>
      </form>
    </>
  );
}