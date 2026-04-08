import { useState, useEffect } from 'react';
import { getPath, matchRoute } from './utils/router';
import { PublicLayout, AppLayout, AuthLayout } from './components/layout/Layouts';

// === Public Pages ===
import HomePage from './pages/public/HomePage';
import SeniorenPage from './pages/public/SeniorenPage';
import FamilienPage from './pages/public/FamilienPage';
import SoFunktioniertsPage from './pages/public/SoFunktioniertsPage';
import LeistungenPage from './pages/public/LeistungenPage';
import LeistungDetailPage from './pages/public/LeistungDetailPage';
import LeistungscheckPage from './pages/public/LeistungscheckPage';
import UeberUnsPage from './pages/public/UeberUnsPage';
import PartnerPage from './pages/public/PartnerPage';
import PreisePage from './pages/public/PreisePage';
import RatgeberPage from './pages/public/RatgeberPage';
import FAQPage from './pages/public/FAQPage';
import KontaktPage from './pages/public/KontaktPage';
import PressePage from './pages/public/PressePage';

// === Legal Pages ===
import DatenschutzPage from './pages/legal/DatenschutzPage';
import AGBPage from './pages/legal/AGBPage';
import ImpressumPage from './pages/legal/ImpressumPage';
import WiderrufPage from './pages/legal/WiderrufPage';
import VollmachtPage from './pages/legal/VollmachtPage';
import HinweisRechtsberatungPage from './pages/legal/HinweisRechtsberatungPage';

// === App Pages ===
import DashboardPage from './pages/app/DashboardPage';
import NeuerAntragPage from './pages/app/NeuerAntragPage';
import UploadPage from './pages/app/UploadPage';
import AnalysePage from './pages/app/AnalysePage';
import AntragDetailPage from './pages/app/AntragDetailPage';
import SignaturPage from './pages/app/SignaturPage';
import ZahlungPage from './pages/app/ZahlungPage';
import StatusPage from './pages/app/StatusPage';
import DokumentePage from './pages/app/DokumentePage';
import ProfilPage from './pages/app/ProfilPage';
import AppHilfePage from './pages/app/AppHilfePage';

// === System Pages ===
import LoginPage from './pages/system/LoginPage';
import LoginVerifyPage from './pages/system/LoginVerifyPage';
import NotFoundPage from './pages/system/NotFoundPage';

// === Route Configuration ===
const PUBLIC_ROUTES = {
  '/': HomePage,
  '/senioren': SeniorenPage,
  '/familien': FamilienPage,
  '/so-funktionierts': SoFunktioniertsPage,
  '/leistungen': LeistungenPage,
  '/leistungscheck': LeistungscheckPage,
  '/ueber-uns': UeberUnsPage,
  '/partner': PartnerPage,
  '/preise': PreisePage,
  '/ratgeber': RatgeberPage,
  '/faq': FAQPage,
  '/kontakt': KontaktPage,
  '/presse': PressePage,
  // Legal
  '/datenschutz': DatenschutzPage,
  '/agb': AGBPage,
  '/impressum': ImpressumPage,
  '/widerruf': WiderrufPage,
  '/vollmacht': VollmachtPage,
  '/hinweis-rechtsberatung': HinweisRechtsberatungPage,
};

const APP_ROUTES = {
  '/app': DashboardPage,
  '/app/neuer-antrag': NeuerAntragPage,
  '/app/upload': UploadPage,
  '/app/analyse': AnalysePage,
  '/app/dokumente': DokumentePage,
  '/app/profil': ProfilPage,
  '/app/hilfe': AppHilfePage,
};

const AUTH_ROUTES = {
  '/login': LoginPage,
  '/login/verify': LoginVerifyPage,
};

// Dynamic routes (with params)
const DYNAMIC_ROUTES = [
  { pattern: '/leistungen/:slug', component: LeistungDetailPage, layout: 'public' },
  { pattern: '/app/antrag/:id', component: AntragDetailPage, layout: 'app' },
  { pattern: '/app/signatur/:id', component: SignaturPage, layout: 'app' },
  { pattern: '/app/zahlung/:id', component: ZahlungPage, layout: 'app' },
  { pattern: '/app/status/:id', component: StatusPage, layout: 'app' },
  { pattern: '/ratgeber/:slug', component: RatgeberPage, layout: 'public' },
];

export default function App() {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const handleNav = () => setPath(getPath());
    window.addEventListener('popstate', handleNav);
    return () => window.removeEventListener('popstate', handleNav);
  }, []);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // 1. Check static routes
  if (PUBLIC_ROUTES[path]) {
    const Page = PUBLIC_ROUTES[path];
    return <PublicLayout><Page /></PublicLayout>;
  }

  if (APP_ROUTES[path]) {
    const Page = APP_ROUTES[path];
    return <AppLayout><Page /></AppLayout>;
  }

  if (AUTH_ROUTES[path]) {
    const Page = AUTH_ROUTES[path];
    return <AuthLayout><Page /></AuthLayout>;
  }

  // 2. Check dynamic routes
  for (const route of DYNAMIC_ROUTES) {
    const params = matchRoute(route.pattern, path);
    if (params) {
      const Page = route.component;
      if (route.layout === 'app') {
        return <AppLayout><Page params={params} /></AppLayout>;
      }
      return <PublicLayout><Page params={params} /></PublicLayout>;
    }
  }

  // 3. 404
  return <PublicLayout><NotFoundPage /></PublicLayout>;
}
