import { useState, useEffect } from 'react';
import { Link } from '../../utils/router.jsx';

const COOKIE_KEY = 'ap_cookie_consent';

function getConsent() {
  try {
    const stored = localStorage.getItem(COOKIE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveConsent(consent) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...consent, timestamp: Date.now() }));
}

// Tracking-Scripts laden wenn erlaubt
function loadTracking(consent) {
  // Google Analytics
  if (consent.analytics && window.GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', window.GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  // Meta Pixel
  if (consent.marketing && window.META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', window.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState({
    necessary: true,  // Immer an
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      loadTracking(consent);
    } else {
      // Banner erst nach 1 Sekunde zeigen (nicht sofort)
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    saveConsent(consent);
    loadTracking(consent);
    setVisible(false);
  };

  const acceptSelected = () => {
    const consent = { ...settings, necessary: true };
    saveConsent(consent);
    loadTracking(consent);
    setVisible(false);
  };

  const rejectAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    saveConsent(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      padding: 'var(--space-4)',
    }}>
      <div style={{
        maxWidth: 600, margin: '0 auto',
        background: '#FFF', borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)', boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
      }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-3)' }}>
          Cookie-Einstellungen
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
          Wir nutzen Cookies, um Ihre Erfahrung zu verbessern und unseren Service zu optimieren.
          Sie können wählen, welche Cookies Sie zulassen möchten.{' '}
          <Link to="/datenschutz" style={{ color: 'var(--ap-sage)', textDecoration: 'underline' }}>Datenschutzerklärung</Link>
        </p>

        {showDetails && (
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* Notwendig */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'default' }}>
              <input type="checkbox" checked disabled style={{ marginTop: 3, accentColor: 'var(--ap-dark)' }} />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)' }}>Notwendig</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Erforderlich für Login, Sicherheit und grundlegende Funktionen. Immer aktiv.</div>
              </div>
            </label>
            {/* Analytics */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.analytics} onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })} style={{ marginTop: 3, accentColor: 'var(--ap-dark)' }} />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)' }}>Analyse</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Helfen uns zu verstehen, wie Besucher unsere Website nutzen (z.B. Google Analytics).</div>
              </div>
            </label>
            {/* Marketing */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.marketing} onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })} style={{ marginTop: 3, accentColor: 'var(--ap-dark)' }} />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)' }}>Marketing</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Ermöglichen personalisierte Werbung und Conversion-Tracking (z.B. Meta Pixel, Google Ads).</div>
              </div>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button onClick={acceptAll} style={{
            flex: 1, minWidth: 120, padding: '10px 16px', background: 'var(--ap-dark)', color: '#FFF',
            border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)',
          }}>
            Alle akzeptieren
          </button>
          {showDetails ? (
            <button onClick={acceptSelected} style={{
              flex: 1, minWidth: 120, padding: '10px 16px', background: 'var(--color-bg)',
              color: 'var(--ap-dark)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)',
            }}>
              Auswahl speichern
            </button>
          ) : (
            <button onClick={() => setShowDetails(true)} style={{
              flex: 1, minWidth: 120, padding: '10px 16px', background: 'var(--color-bg)',
              color: 'var(--ap-dark)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)',
            }}>
              Einstellungen
            </button>
          )}
          <button onClick={rejectAll} style={{
            padding: '10px 16px', background: 'none', color: 'var(--color-text-muted)',
            border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-body)',
          }}>
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
}

// Export für Datenschutz-Seite: Cookie-Einstellungen erneut öffnen
export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_KEY);
  window.location.reload();
}
