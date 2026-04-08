import { useUser, useAuth as useClerkAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { navigate } from './router.jsx';

// Hook: Gibt den aktuellen User zurück + Loading-Status
export function useAppUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    // Profil aus Supabase laden oder erstellen
    async function syncProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // Profil existiert noch nicht – anlegen
          const newProfile = {
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName || '',
          };
          const { data: created } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          setProfile(created);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile sync error:', err);
      } finally {
        setLoading(false);
      }
    }

    syncProfile();
  }, [isLoaded, isSignedIn, user]);

  return {
    user,
    profile,
    isLoaded,
    isSignedIn,
    loading,
  };
}

// Komponente: Schützt App-Routen vor unangemeldeten Nutzern
export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, border: '3px solid var(--ap-mint)',
            borderTop: '3px solid var(--ap-dark)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto var(--space-4)',
          }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Wird geladen...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    navigate('/login');
    return null;
  }

  return children;
}
