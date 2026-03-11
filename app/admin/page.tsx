import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const isAdmin = user.user_metadata?.role === 'admin';
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Admin Dashboard</h1>
        <p className="auth-subtitle">Welcome, {user.email}</p>
        <div style={{ marginTop: '30px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' as const }}>
          <p>Admin dashboard coming soon.</p>
          <a href="/" className="auth-link" style={{ marginTop: '20px', display: 'inline-block' }}>{/* eslint-disable-line @next/next/no-html-link-for-pages */}
            Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
