'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import AuthModal from './AuthModal';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }

  const navigate = (section: string) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo" onClick={() => navigate('home')}>
            <Image src="/logo.png" alt="Trakie.ai" width={36} height={36} className="nav-logo-img" />
            <div className="nav-logo-text">TRAKIE.AI</div>
          </div>
          <div className="nav-links">
            <a onClick={() => navigate('home')}>Home</a>
            <a onClick={() => navigate('receive')}>Receive Demo</a>
            <a onClick={() => navigate('demo')}>Demo</a>
            <a onClick={() => navigate('pricing')}>Pricing</a>
            <a onClick={() => navigate('contact')}>Contact</a>
          </div>
          <div className="nav-right">
            {user ? (
              <button onClick={handleLogout} className="nav-auth-btn">
                Logout
              </button>
            ) : (
              <button onClick={() => setAuthModal('login')} className="nav-auth-btn">
                Login
              </button>
            )}
            <button
              onClick={() => setAuthModal('signup')}
              className="nav-cta"
            >
              Get Started
            </button>
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
          <a onClick={() => navigate('receive')}>Receive Demo</a>
          <a onClick={() => navigate('demo')}>Demo</a>
          <a onClick={() => navigate('pricing')}>Pricing</a>
          <a onClick={() => navigate('contact')}>Contact</a>
        </div>
        <div className="nav-mobile-actions">
          {user ? (
            <button onClick={handleLogout} className="nav-mobile-auth-btn">
              Logout
            </button>
          ) : (
            <button onClick={() => { setAuthModal('login'); setMenuOpen(false); }} className="nav-mobile-auth-btn">
              Login
            </button>
          )}
          <button
            onClick={() => { setAuthModal('signup'); setMenuOpen(false); }}
            className="nav-mobile-cta-btn"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
