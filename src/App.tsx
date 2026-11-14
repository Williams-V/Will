import { Link, NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateChama from './pages/CreateChama';
import ChamaDetail from './pages/ChamaDetail';
import About from './pages/About';

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 18l10 28 14-20 14 20 10-28" fill="none" stroke="#f4b942" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link to="/" className="brand">
            <span className="brand-mark"><Logo /></span>
            <span>
              <span className="brand-name">Will</span>
              <span className="brand-tag" style={{ display: 'block' }}>Save Together. Grow Together.</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Main">
            <NavLink to="/" end>Chamas</NavLink>
            <NavLink to="/new">New chama</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </header>
      <div className="demo-banner" role="note">
        <div className="container">
          <strong>Demo mode.</strong> No real money is collected, transferred or verified. Records live only in this browser.
        </div>
      </div>
      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<CreateChama />} />
            <Route path="/chama/:id" element={<ChamaDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div className="empty card">Page not found. <Link to="/">Back to chamas</Link></div>} />
          </Routes>
        </div>
      </main>
      <footer className="footer">
        <strong>Will</strong> — a smarter way to save together. Not a production financial system.
      </footer>
    </>
  );
}