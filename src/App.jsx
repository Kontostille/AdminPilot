// ============================================================================
// App.jsx - Routing + Auth-Wrapper
// ============================================================================
// - Öffentliche Routen: Landing, Leistungen, Preise, FAQ, AGB, Datenschutz
// - Geschützte /app/*-Routen: erfordern eingeloggten Clerk-User
// ============================================================================

import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { deDE } from '@clerk/localizations';

import './styles/adminpilot.css';

// Public pages
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import GrundsicherungPage from './pages/GrundsicherungPage';
import WohngeldPage from './pages/WohngeldPage';
import PflegegeldPage from './pages/PflegegeldPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AgbPage from './pages/AgbPage';
import DatenschutzPage from './pages/DatenschutzPage';

// App pages (protected)
import DashboardPage from './pages/DashboardPage';
import NewApplicationPage from './pages/NewApplicationPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required');
}

function PublicLayout({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}

function SiteHeader() {
  return (
    <header style={{ background: 'var(--ap-white)', borderBottom: '1px solid var(--ap-border)', padding: '1rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', fontFamily: 'var(--ap-font-display)', fontSize: '1.3rem', color: 'var(--ap-dark-forest)', fontWeight: 500 }}>
          AdminPilot
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/wie-funktioniert-es" style={{ textDecoration: 'none', color: 'var(--ap-text)' }}>So funktioniert&rsquo;s</Link>
          <Link to="/preise" style={{ textDecoration: 'none', color: 'var(--ap-text)' }}>Preise</Link>
          <Link to="/fragen" style={{ textDecoration: 'none', color: 'var(--ap-text)' }}>Fragen</Link>
          <SignedIn>
            <Link to="/app" className="btn btn--ghost" style={{ padding: '0.5rem 1rem' }}>Mein Dashboard</Link>
          </SignedIn>
          <SignedOut>
            <Link to="/anmelden" className="btn btn--primary" style={{ padding: '0.5rem 1rem' }}>Anmelden</Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

function AppHeader() {
  return (
    <header style={{ background: 'var(--ap-white)', borderBottom: '1px solid var(--ap-border)', padding: '1rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/app" style={{ textDecoration: 'none', fontFamily: 'var(--ap-font-display)', fontSize: '1.3rem', color: 'var(--ap-dark-forest)', fontWeight: 500 }}>
          AdminPilot
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--ap-text-muted)', textDecoration: 'none' }}>Zurück zur Website</Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer style={{ background: 'var(--ap-dark-forest)', color: 'var(--ap-white)', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--ap-font-display)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>AdminPilot</p>
          <p style={{ color: 'var(--ap-light-sage)', fontSize: '0.9rem' }}>
            Ihr Begleiter durch die Bürokratie.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--ap-white)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Leistungen</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/leistungen/grundsicherung" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>Grundsicherung</Link></li>
            <li><Link to="/leistungen/wohngeld" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>Wohngeld</Link></li>
            <li><Link to="/leistungen/pflegegeld" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>Pflegegeld</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'var(--ap-white)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Unternehmen</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/impressum" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>Impressum</Link></li>
            <li><Link to="/datenschutz" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>Datenschutz</Link></li>
            <li><Link to="/agb" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>AGB</Link></li>
            <li><Link to="/kontakt" style={{ color: 'var(--ap-light-sage)', textDecoration: 'none' }}>Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'var(--ap-white)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Betreiber</h4>
          <p style={{ color: 'var(--ap-light-sage)', fontSize: '0.9rem' }}>
            ALEVOR Mittelstandspartner GmbH<br />
            Titurelstraße 10<br />
            81925 München<br />
            <a href="mailto:info@adminpilot.de" style={{ color: 'var(--ap-light-sage)' }}>info@adminpilot.de</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} localization={deDE}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/preise" element={<PublicLayout><PricingPage /></PublicLayout>} />
          <Route path="/fragen" element={<PublicLayout><FaqPage /></PublicLayout>} />
          <Route path="/wie-funktioniert-es" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
          <Route path="/leistungen/grundsicherung" element={<PublicLayout><GrundsicherungPage /></PublicLayout>} />
          <Route path="/leistungen/wohngeld" element={<PublicLayout><WohngeldPage /></PublicLayout>} />
          <Route path="/leistungen/pflegegeld" element={<PublicLayout><PflegegeldPage /></PublicLayout>} />
          <Route path="/agb" element={<PublicLayout><AgbPage /></PublicLayout>} />
          <Route path="/datenschutz" element={<PublicLayout><DatenschutzPage /></PublicLayout>} />

          {/* Auth */}
          <Route path="/anmelden/*" element={<div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><SignIn signUpUrl="/registrieren" /></div>} />
          <Route path="/registrieren/*" element={<div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><SignUp signInUrl="/anmelden" /></div>} />

          {/* Shortcut for "prüfen" entry point */}
          <Route path="/pruefen" element={
            <>
              <SignedIn><Navigate to="/app/neuer-antrag" replace /></SignedIn>
              <SignedOut><Navigate to="/registrieren" replace /></SignedOut>
            </>
          } />

          {/* Protected app */}
          <Route path="/app" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
          <Route path="/app/neuer-antrag" element={<ProtectedRoute><AppLayout><NewApplicationPage /></AppLayout></ProtectedRoute>} />
          <Route path="/app/antrag/:id" element={<ProtectedRoute><AppLayout><ApplicationDetailPage /></AppLayout></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}
