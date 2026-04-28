'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import AuthModal from './AuthModal';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close profile dropdown on outside click / Escape
  useEffect(() => {
    if (!profileOpen) return;
    function onDown(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    window.location.href = '/';
  }

  const navigate = (section: string) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  const initial = (user?.email?.[0] ?? '?').toUpperCase();

  function goManageSubscription() {
    setProfileOpen(false);
    setMenuOpen(false);
    router.push('/account/subscription');
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="nav-logo" onClick={() => navigate('home')}>
              <div className="nav-logo-stack">
                <img src="/logo.png" alt="Trakie" className="nav-logo-img" />
                <div className="nav-logo-text">trakie.ai</div>
              </div>
            </div>
          </div>
          <div className="nav-links">
            <a onClick={() => navigate('home')}>Home</a>
            <a onClick={() => navigate('demo')}>Demo</a>
            <a onClick={() => navigate('pricing')}>Pricing</a>
            <a onClick={() => navigate('contact')}>Contact</a>
          </div>
          <div className="nav-right">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="nav-cta nav-cta-disabled"
              title="Chrome Web Store listing coming soon — join the waitlist"
              aria-label="Add to Chrome — coming soon, join the waitlist"
            >
              <svg className="nav-cta-chrome" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8.8h8.5M12 8.8L7.8 16M12 8.8L15 14.2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              Add to Chrome
              <span className="nav-cta-soon">Soon</span>
            </button>
            {user ? (
              <div
                ref={profileRef}
                className="nav-profile"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  type="button"
                  className="nav-profile-avatar"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen(o => !o)}
                >
                  {initial}
                </button>
                <div className={`nav-profile-menu${profileOpen ? ' open' : ''}`} role="menu">
                  <button type="button" className="nav-profile-menu-item" role="menuitem" onClick={goManageSubscription}>
                    Manage Subscription
                  </button>
                  <button type="button" className="nav-profile-menu-item" role="menuitem" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAuthModal('login')} className="nav-auth-btn">
                Login
              </button>
            )}
            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {authModal && (
        <AuthModal initialView={authModal} onClose={() => setAuthModal(null)} />
      )}

      {/* Mobile full-screen menu */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="nav-mobile-links">
          <a onClick={() => navigate('home')}>Home</a>
          <a onClick={() => navigate('demo')}>Demo</a>
          <a onClick={() => navigate('pricing')}>Pricing</a>
          <a onClick={() => navigate('contact')}>Contact</a>
        </div>
        <div className="nav-mobile-actions">
          {user ? (
            <>
              <button onClick={goManageSubscription} className="nav-mobile-auth-btn">
                Manage Subscription
              </button>
              <button onClick={handleLogout} className="nav-mobile-auth-btn">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setAuthModal('login'); setMenuOpen(false); }} className="nav-mobile-auth-btn">
              Login
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('contact')}
            className="nav-mobile-cta-btn nav-cta-disabled"
            aria-label="Add to Chrome — coming soon, join the waitlist"
          >
            <svg className="nav-cta-chrome" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 8.8h8.5M12 8.8L7.8 16M12 8.8L15 14.2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            Add to Chrome — Coming Soon
          </button>
        </div>
      </div>
    </>
  );
}
