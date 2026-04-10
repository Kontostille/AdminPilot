import { useEffect } from 'react';
export default function StatusPage({ params }) {
  useEffect(() => { window.location.href = `/app/antrag/${params?.id}`; }, []);
  return <div style={{ padding: 48, textAlign: 'center', color: '#8AA494' }}>Weiterleitung...</div>;
}
