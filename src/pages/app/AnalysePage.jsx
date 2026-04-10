import { useEffect } from 'react';
export default function AnalysePage() {
  useEffect(() => { window.location.href = '/app'; }, []);
  return <div style={{ padding: 48, textAlign: 'center', color: '#8AA494' }}>Weiterleitung...</div>;
}
