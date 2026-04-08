import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { RATGEBER_ARTICLES } from '../../data/siteConfig.js';
import { Link } from '../../utils/router.jsx';

export default function RatgeberPage({ params }) {
  if (params?.slug) {
    const article = RATGEBER_ARTICLES.find(a => a.slug === params.slug);
    if (!article) return <div className="section container"><h1>Artikel nicht gefunden</h1></div>;
    return (
      <>
        <SEOHead title={article.title} description={article.excerpt} />
        <section className="section">
          <div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
            <nav style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              <Link to="/" style={{ color: 'var(--ap-sage)' }}>Start</Link> → <Link to="/ratgeber" style={{ color: 'var(--ap-sage)' }}>Ratgeber</Link> → <span>{article.category}</span>
            </nav>
            <span style={{ fontSize: 'var(--text-xs)', padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--ap-mint)', color: 'var(--ap-dark)', fontWeight: 600 }}>{article.category}</span>
            <h1 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>{article.title}</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>{article.readTime} Lesezeit · {new Date(article.date).toLocaleDateString('de-DE')}</p>
            <div style={{ lineHeight: 1.8, fontSize: 'var(--text-base)' }} dangerouslySetInnerHTML={{ __html: article.content }} />
            <div style={{ marginTop: 'var(--space-10)', padding: 'var(--space-6)', background: 'var(--ap-dark)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <p style={{ color: 'var(--ap-mint)', marginBottom: 'var(--space-4)' }}>Möchten Sie wissen, welche Leistungen Ihnen möglicherweise zustehen?</p>
              <Button variant="primary" to="/leistungscheck">Kostenloser Leistungscheck →</Button>
            </div>
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <SEOHead title="Ratgeber" description="Wissen rund um Sozialleistungen: Wohngeld, Kindergeld, KV-Zuschuss und mehr." />
      <section className="section">
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>Ratgeber</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-10)' }}>Wissen rund um Sozialleistungen – verständlich erklärt.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {RATGEBER_ARTICLES.map(a => (
              <Link key={a.slug} to={'/ratgeber/'+a.slug} style={{ background: '#FFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden', textDecoration: 'none', transition: 'box-shadow var(--transition-base)' }}>
                <div style={{ padding: 'var(--space-5)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--ap-mint)', color: 'var(--ap-dark)', fontWeight: 600 }}>{a.category}</span>
                  <h3 style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-base)', color: 'var(--ap-dark)' }}>{a.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: 'var(--space-2)' }}>{a.excerpt}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', marginTop: 'var(--space-3)' }}>{a.readTime} · {new Date(a.date).toLocaleDateString('de-DE')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
