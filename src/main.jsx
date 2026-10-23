import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, BadgeCheck, Bell, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Download,
  Ellipsis, FileText, Filter, HandCoins, LayoutDashboard, LogOut, Menu,
  Moon, Plus, Search, Settings2, ShieldCheck, Sprout, Sun, Users, Wallet, X,
} from 'lucide-react';
import './styles.css';

const starterGroups = [
  { id: 'g1', name: 'Mwangaza Women', initials: 'MW', members: 18, target: 240000, saved: 184500, cadence: 'Monthly', nextDue: '24 Oct', color: 'mint' },
  { id: 'g2', name: 'Kileleshwa Circle', initials: 'KC', members: 12, target: 180000, saved: 126000, cadence: 'Weekly', nextDue: '26 Oct', color: 'peach' },
  { id: 'g3', name: 'Jirani Builders', initials: 'JB', members: 24, target: 500000, saved: 318000, cadence: 'Monthly', nextDue: '01 Nov', color: 'blue' },
];

const starterContributions = [
  { id: 'TX-2038', name: 'Grace Wanjiku', group: 'Mwangaza Women', amount: 5000, fee: 5, date: 'Today, 10:42 AM', status: 'Verified', initials: 'GW' },
  { id: 'TX-2037', name: 'Peter Mwangi', group: 'Kileleshwa Circle', amount: 2500, fee: 5, date: 'Today, 9:18 AM', status: 'Verified', initials: 'PM' },
  { id: 'TX-2036', name: 'Amina Hassan', group: 'Mwangaza Women', amount: 5000, fee: 5, date: 'Yesterday, 4:06 PM', status: 'Verified', initials: 'AH' },
  { id: 'TX-2035', name: 'David Kiptoo', group: 'Jirani Builders', amount: 10000, fee: 5, date: 'Yesterday, 11:21 AM', status: 'Verified', initials: 'DK' },
  { id: 'TX-2034', name: 'Lydia Njeri', group: 'Kileleshwa Circle', amount: 2500, fee: 5, date: '21 Oct, 2:53 PM', status: 'Verified', initials: 'LN' },
];

const starterMembers = [
  { name: 'Grace Wanjiku', group: 'Mwangaza Women', role: 'Treasurer', contribution: 35000, status: 'Active', initials: 'GW' },
  { name: 'Peter Mwangi', group: 'Kileleshwa Circle', role: 'Administrator', contribution: 22000, status: 'Active', initials: 'PM' },
  { name: 'Amina Hassan', group: 'Mwangaza Women', role: 'Member', contribution: 30000, status: 'Active', initials: 'AH' },
  { name: 'David Kiptoo', group: 'Jirani Builders', role: 'Member', contribution: 48000, status: 'Active', initials: 'DK' },
  { name: 'Lydia Njeri', group: 'Kileleshwa Circle', role: 'Member', contribution: 17500, status: 'Active', initials: 'LN' },
];

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My chamas', icon: Users },
  { label: 'Contributions', icon: ArrowDownLeft },
  { label: 'Members', icon: HandCoins },
  { label: 'Reports', icon: FileText },
];

const money = (amount) => `KSh ${Number(amount || 0).toLocaleString('en-KE')}`;
const todayLabel = new Intl.DateTimeFormat('en-KE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase();
const loadSaved = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [groups, setGroups] = useState(() => loadSaved('will-groups', starterGroups));
  const [contributions, setContributions] = useState(() => loadSaved('will-contributions', starterContributions));
  const [members] = useState(starterMembers);
  const [activePage, setActivePage] = useState('Overview');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState(() => loadSaved('will-theme', 'light'));

  useEffect(() => localStorage.setItem('will-groups', JSON.stringify(groups)), [groups]);
  useEffect(() => localStorage.setItem('will-contributions', JSON.stringify(contributions)), [contributions]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('will-theme', JSON.stringify(theme));
  }, [theme]);

  const verified = contributions.filter((item) => item.status === 'Verified');
  const totalSaved = groups.reduce((sum, group) => sum + group.saved, 0);
  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(search.toLowerCase()));
  const filteredContributions = contributions.filter((item) => `${item.name} ${item.group} ${item.id}`.toLowerCase().includes(search.toLowerCase()));
  const filteredMembers = members.filter((member) => `${member.name} ${member.group} ${member.role}`.toLowerCase().includes(search.toLowerCase()));

  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  }

  function addGroup(group) {
    const initials = group.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
    setGroups((current) => [...current, { ...group, id: `g-${Date.now()}`, initials, members: 1, saved: 0, nextDue: 'Set schedule', color: 'mint' }]);
    setModal(null);
    flash(`${group.name} is ready. Invite members to get started.`);
  }

  function addContribution(contribution) {
    const group = groups.find((item) => item.id === contribution.groupId);
    const newRecord = {
      id: `DEMO-${Date.now().toString().slice(-6)}`,
      name: contribution.name,
      group: group.name,
      amount: Number(contribution.amount),
      fee: 5,
      date: 'Just now',
      status: 'Needs verification',
      initials: contribution.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
    };
    setContributions((current) => [newRecord, ...current]);
    setModal(null);
    flash('Entry saved as unverified. Group totals were not changed.');
  }

  function exportCsv() {
    const rows = [['Reference', 'Member', 'Chama', 'Contribution (KSh)', 'Fee (KSh)', 'Date', 'Status'], ...contributions.map((item) => [item.id, item.name, item.group, item.amount, item.fee, item.date, item.status])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'will-contributions.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    flash('Contribution report downloaded.');
  }

  function selectPage(page) {
    setActivePage(page);
    setSearch('');
    setMobileNavOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#overview" onClick={() => selectPage('Overview')} aria-label="Will home">
          <span className="brand-mark"><Sprout size={21} strokeWidth={2.4} /></span>
          <span>will<span className="brand-period">.</span></span>
        </a>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activePage === label ? 'nav-active' : ''}`} key={label} onClick={() => selectPage(label)}>
              <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
              {label === 'Contributions' && contributions.some((item) => item.status !== 'Verified') && <span className="nav-count">{contributions.filter((item) => item.status !== 'Verified').length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><CircleHelp size={17} /></span>
            <div><strong>Need a hand?</strong><span>We're here to help.</span></div>
            <ArrowRight size={15} />
          </div>
          <button className="profile-row" onClick={() => flash('Account settings are coming soon.')}>
            <span className="profile-avatar">VW</span>
            <span className="profile-copy"><strong>Vanessa Williams</strong><small>Platform admin</small></span>
            <Ellipsis size={19} />
          </button>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <span className="sandbox-pill"><span /> Demo workspace</span>
            <button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => flash('You are all caught up.')}><Bell size={18} /><i /></button>
            <button className="top-profile" onClick={() => flash('Account settings are coming soon.')}><span className="profile-avatar small-avatar">VW</span><ChevronDown size={15} /></button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> {todayLabel}</div>
              <h1>{activePage === 'Overview' ? 'Good morning, Vanessa' : activePage}</h1>
              <p>{activePage === 'Overview' ? 'A clear view of how your chamas are growing.' : pageDescription(activePage)}</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={exportCsv}><Download size={16} /> Export</button>
              <button className="button button-primary" onClick={() => setModal(activePage === 'Contributions' ? 'contribution' : 'group')}><Plus size={17} /> {activePage === 'Contributions' ? 'Log contribution' : 'New chama'}</button>
            </div>
          </div>

          <div className="demo-notice"><ShieldCheck size={16} /><span><strong>Demo mode.</strong> Sample records only. No real payments are collected or verified here.</span><button onClick={() => flash('Live M-Pesa payments are not connected in this demo.')} aria-label="Learn about demo mode"><ArrowRight size={15} /></button></div>

          {activePage === 'Overview' && <Overview groups={groups} contributions={contributions} verified={verified} totalSaved={totalSaved} setModal={setModal} selectPage={selectPage} />}
          {activePage === 'My chamas' && <GroupsPage groups={filteredGroups} setModal={setModal} search={search} setSearch={setSearch} />}
          {activePage === 'Contributions' && <ContributionsPage contributions={filteredContributions} search={search} setSearch={setSearch} onExport={exportCsv} />}
          {activePage === 'Members' && <MembersPage members={filteredMembers} search={search} setSearch={setSearch} />}
          {activePage === 'Reports' && <ReportsPage groups={groups} verified={verified} totalSaved={totalSaved} onExport={exportCsv} />}

          <footer className="page-footer"><span>WILL <i>·</i> SAVE TOGETHER, GROW TOGETHER</span><span><ShieldCheck size={13} /> Your records stay in this browser</span></footer>
        </div>
      </main>

      {modal === 'group' && <GroupModal onClose={() => setModal(null)} onSave={addGroup} />}
      {modal === 'contribution' && <ContributionModal groups={groups} onClose={() => setModal(null)} onSave={addContribution} />}
      {notice && <div className="toast" role="status"><Check size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </div>
  );
}

function pageDescription(page) {
  return {
    'My chamas': 'Keep every group, goal, and contribution schedule in view.',
    Contributions: 'Follow every entry and its verification status.',
    Members: 'See who is part of the savings circle.',
    Reports: 'A transparent summary of your group activity.',
  }[page];
}

function Overview({ groups, contributions, verified, totalSaved, setModal, selectPage }) {
  const pendingCount = contributions.filter((item) => item.status !== 'Verified').length;
  return (
    <>
      <section className="metrics-grid" aria-label="Savings summary">
        <article className="metric-card metric-featured">
          <div className="metric-top"><span>Total group savings</span><span className="metric-icon green-icon"><Wallet size={18} /></span></div>
          <div className="metric-value">{money(totalSaved)}</div>
          <div className="metric-foot"><span className="trend-up"><ArrowUpRight size={14} /> 8.2%</span><span>across {groups.length} chamas</span></div>
          <div className="metric-sparkline" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span>Active chamas</span><span className="metric-icon peach-icon"><Users size={18} /></span></div>
          <div className="metric-value">{groups.length.toString().padStart(2, '0')}</div>
          <div className="metric-foot"><span>{groups.reduce((sum, group) => sum + group.members, 0)} members</span><span className="metric-dot" /> <span>across all groups</span></div>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span>Verified this month</span><span className="metric-icon blue-icon"><BadgeCheck size={18} /></span></div>
          <div className="metric-value">{money(verified.reduce((sum, item) => sum + item.amount, 0))}</div>
          <div className="metric-foot"><span>{verified.length} contributions</span><span className="metric-dot" /> <span>confirmed records</span></div>
        </article>
      </section>

      <section className="overview-grid">
        <div className="panel groups-panel">
          <div className="panel-heading"><div><h2>Your chamas</h2><p>Progress toward each group's savings goal</p></div><button className="text-link" onClick={() => selectPage('My chamas')}>All chamas <ArrowRight size={15} /></button></div>
          <div className="group-list">
            {groups.slice(0, 4).map((group) => <GroupRow key={group.id} group={group} />)}
            {groups.length === 0 && <EmptyState title="Your first chama starts here" action="Create chama" onClick={() => setModal('group')} />}
          </div>
          <button className="add-group-row" onClick={() => setModal('group')}><span><Plus size={16} /></span> Create a new chama</button>
        </div>
        <div className="panel activity-panel">
          <div className="panel-heading"><div><h2>Recent contributions</h2><p>Latest activity across your groups</p></div><button className="icon-button panel-menu" aria-label="Contribution options" onClick={() => selectPage('Contributions')}><Ellipsis size={20} /></button></div>
          <div className="activity-list">
            {contributions.slice(0, 5).map((item) => <ActivityRow key={item.id} item={item} />)}
            {contributions.length === 0 && <EmptyState title="No contributions yet" action="Log an entry" onClick={() => setModal('contribution')} />}
          </div>
          <button className="activity-footer" onClick={() => selectPage('Contributions')}>View all contributions <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="goal-banner">
          <div className="goal-copy"><span className="goal-kicker"><Sprout size={14} /> KEEP THE MOMENTUM</span><h2>Small steps.<br /><em>Shared progress.</em></h2><p>Your groups are building something meaningful, one contribution at a time.</p><button className="goal-button" onClick={() => setModal('contribution')}>Log a contribution <ArrowRight size={15} /></button></div>
          <div className="goal-photo" role="img" aria-label="Friends gathering together" />
        </div>
        <div className="panel due-panel">
          <div className="panel-heading"><div><h2>Coming up</h2><p>Contribution dates to keep in mind</p></div><CalendarDays className="due-calendar" size={19} /></div>
          <div className="due-list">{groups.slice(0, 3).map((group) => <div className="due-row" key={group.id}><span className={`due-date ${group.color}`}>{group.nextDue.split(' ')[0]}<small>{group.nextDue.split(' ')[1] || 'SET'}</small></span><span className="due-info"><strong>{group.name}</strong><small>{group.cadence} contribution</small></span><ChevronRight size={16} /></div>)}</div>
          {pendingCount > 0 && <button className="pending-note" onClick={() => selectPage('Contributions')}><Clock3 size={15} /><span>{pendingCount} record{pendingCount === 1 ? '' : 's'} need verification</span><ArrowRight size={14} /></button>}
        </div>
      </section>
    </>
  );
}

function GroupRow({ group }) {
  const progress = Math.min(100, Math.round((group.saved / group.target) * 100));
  return <div className="group-row"><div className={`group-avatar ${group.color}`}>{group.initials}</div><div className="group-main"><div className="group-title"><strong>{group.name}</strong><span>{group.members} members</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="progress-caption"><span>{money(group.saved)} saved</span><span>{progress}% of {money(group.target)}</span></div></div><button className="icon-button group-chevron" aria-label={`View ${group.name}`}><ChevronRight size={17} /></button></div>;
}

function ActivityRow({ item }) {
  return <div className="activity-row"><span className="member-avatar">{item.initials}</span><div className="activity-main"><strong>{item.name}</strong><small>{item.group} <span>·</span> {item.date}</small></div><div className="activity-amount"><strong>+{money(item.amount).replace('KSh ', '')}</strong><small className={item.status === 'Verified' ? 'status-verified' : 'status-pending'}>{item.status === 'Verified' ? <Check size={11} /> : <Clock3 size={11} />}{item.status}</small></div></div>;
}

function SearchField({ value, onChange, placeholder = 'Search...' }) {
  return <label className="search-field"><Search size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><kbd>⌘ K</kbd></label>;
}

function GroupsPage({ groups, setModal, search, setSearch }) {
  return <section className="panel full-panel"><div className="table-toolbar"><SearchField value={search} onChange={setSearch} placeholder="Search chamas" /><button className="button button-secondary"><Filter size={15} /> Filter</button></div><div className="table-scroll"><table><thead><tr><th>CHAMA</th><th>MEMBERS</th><th>GOAL PROGRESS</th><th>CONTRIBUTION CYCLE</th><th>NEXT DUE</th><th /></tr></thead><tbody>{groups.map((group) => <tr key={group.id}><td><div className="table-group"><span className={`group-avatar ${group.color}`}>{group.initials}</span><strong>{group.name}</strong></div></td><td>{group.members} members</td><td><div className="table-progress"><span>{money(group.saved)}</span><div className="progress-track"><i style={{ width: `${Math.min(100, group.saved / group.target * 100)}%` }} /></div><small>{Math.round(group.saved / group.target * 100)}%</small></div></td><td>{group.cadence}</td><td>{group.nextDue}</td><td><button className="icon-button" aria-label={`Options for ${group.name}`}><Ellipsis size={18} /></button></td></tr>)}</tbody></table>{groups.length === 0 && <EmptyState title="No chamas match that search" action="Create a chama" onClick={() => setModal('group')} />}</div></section>;
}

function ContributionsPage({ contributions, search, setSearch, onExport }) {
  return <section className="panel full-panel"><div className="table-toolbar"><SearchField value={search} onChange={setSearch} placeholder="Search name, chama, reference" /><div className="toolbar-actions"><button className="button button-secondary" onClick={onExport}><Download size={15} /> Export CSV</button><button className="button button-secondary"><Filter size={15} /> Filter</button></div></div><div className="table-scroll"><table><thead><tr><th>MEMBER</th><th>CHAMA</th><th>REFERENCE</th><th>CONTRIBUTION</th><th>FEE</th><th>DATE</th><th>STATUS</th></tr></thead><tbody>{contributions.map((item) => <tr key={item.id}><td><div className="table-group"><span className="member-avatar">{item.initials}</span><strong>{item.name}</strong></div></td><td>{item.group}</td><td className="reference-cell">{item.id}</td><td className="amount-cell">{money(item.amount)}</td><td>{money(item.fee)}</td><td>{item.date}</td><td><span className={`status-pill ${item.status === 'Verified' ? 'verified-pill' : 'pending-pill'}`}><i />{item.status}</span></td></tr>)}</tbody></table>{contributions.length === 0 && <EmptyState title="No contribution records found" action="Clear search" onClick={() => setSearch('')} />}</div><div className="table-footnote"><ShieldCheck size={14} /> Only provider-confirmed payments should be marked verified in a live system.</div></section>;
}

function MembersPage({ members, search, setSearch }) {
  return <section className="panel full-panel"><div className="table-toolbar"><SearchField value={search} onChange={setSearch} placeholder="Search members or chamas" /><button className="button button-secondary"><Filter size={15} /> Filter</button></div><div className="table-scroll"><table><thead><tr><th>MEMBER</th><th>CHAMA</th><th>ROLE</th><th>CONTRIBUTIONS</th><th>STATUS</th><th /></tr></thead><tbody>{members.map((member) => <tr key={`${member.name}-${member.group}`}><td><div className="table-group"><span className="member-avatar">{member.initials}</span><strong>{member.name}</strong></div></td><td>{member.group}</td><td>{member.role}</td><td className="amount-cell">{money(member.contribution)}</td><td><span className="status-pill verified-pill"><i />{member.status}</span></td><td><button className="icon-button" aria-label={`Options for ${member.name}`}><Ellipsis size={18} /></button></td></tr>)}</tbody></table>{members.length === 0 && <EmptyState title="No members match that search" action="Clear search" onClick={() => setSearch('')} />}</div></section>;
}

function ReportsPage({ groups, verified, totalSaved, onExport }) {
  const feeTotal = verified.reduce((sum, item) => sum + item.fee, 0);
  return <div className="reports-layout"><section className="panel report-summary"><div className="panel-heading"><div><h2>Group savings snapshot</h2><p>Verified demo records as of 23 October 2026</p></div><button className="button button-secondary" onClick={onExport}><Download size={15} /> Export records</button></div><div className="report-total"><small>Total recorded group savings</small><strong>{money(totalSaved)}</strong><span>Across {groups.length} chamas</span></div><div className="report-bars">{groups.map((group, index) => <div className="report-bar-row" key={group.id}><span>{group.name}</span><div className="bar-track"><i className={`bar-${index % 3}`} style={{ width: `${Math.max(4, group.saved / Math.max(totalSaved, 1) * 100)}%` }} /></div><strong>{money(group.saved)}</strong></div>)}</div></section><section className="report-side"><div className="panel report-mini"><span className="metric-icon green-icon"><BadgeCheck size={18} /></span><small>Verified demo contributions</small><strong>{verified.length}</strong><span>Confirmation records</span></div><div className="panel report-mini"><span className="metric-icon peach-icon"><Wallet size={18} /></span><small>Illustrative service fees</small><strong>{money(feeTotal)}</strong><span>Not collected in demo mode</span></div><div className="report-disclaimer"><ShieldCheck size={16} /><span>These reports use local sample data and are not evidence of funds received.</span></div></section></div>;
}

function EmptyState({ title, action, onClick }) {
  return <div className="empty-state"><span className="empty-icon"><Sprout size={19} /></span><strong>{title}</strong><button onClick={onClick}>{action} <ArrowRight size={14} /></button></div>;
}

function ModalShell({ title, subtitle, onClose, children }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="modal-mark"><Sprout size={18} /></span><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div>{children}</section></div>;
}

function GroupModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [cadence, setCadence] = useState('Monthly');
  function submit(event) {
    event.preventDefault();
    if (!name.trim() || Number(target) < 1) return;
    onSave({ name: name.trim(), target: Number(target), cadence });
  }
  return <ModalShell title="Create a chama" subtitle="Set up a savings space for your group." onClose={onClose}><form className="modal-form" onSubmit={submit}><label>Chama name<input autoFocus maxLength="48" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Mwangaza Women" required /></label><label>Savings goal <span className="input-with-prefix"><b>KSh</b><input type="number" min="1" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="250,000" required /></span></label><label>Contribution cycle<select value={cadence} onChange={(event) => setCadence(event.target.value)}><option>Weekly</option><option>Biweekly</option><option>Monthly</option><option>Custom</option></select></label><div className="modal-note"><ShieldCheck size={15} /> Your group is stored in this browser's demo workspace.</div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Plus size={16} /> Create chama</button></div></form></ModalShell>;
}

function ContributionModal({ groups, onClose, onSave }) {
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [amount, setAmount] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!name.trim() || Number(amount) < 1 || !groupId) return;
    onSave({ name: name.trim(), groupId, amount });
  }
  return <ModalShell title="Log a contribution" subtitle="Add a record for review. This does not initiate a payment." onClose={onClose}><form className="modal-form" onSubmit={submit}><label>Member name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required /></label><label>Chama<select value={groupId} onChange={(event) => setGroupId(event.target.value)} required>{groups.map((group) => <option value={group.id} key={group.id}>{group.name}</option>)}</select></label><label>Contribution amount <span className="input-with-prefix"><b>KSh</b><input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="5,000" required /></span></label><div className="fee-breakdown"><div><span>Contribution recorded</span><strong>{money(amount || 0)}</strong></div><div><span>Illustrative platform fee</span><strong>{money(5)}</strong></div><div className="fee-total"><span>Illustrative total</span><strong>{money(Number(amount || 0) + 5)}</strong></div></div><div className="modal-note warning-note"><Clock3 size={15} /> Saved as unverified. No fee or payment is collected, and group totals will not change.</div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Check size={16} /> Save unverified entry</button></div></form></ModalShell>;
}

createRoot(document.getElementById('root')).render(<App />);