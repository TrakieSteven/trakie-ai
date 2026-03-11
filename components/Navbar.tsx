'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <nav className="nav">
      <div className="nav-content">
        <div className="nav-logo" onClick={() => onNavigate('home')}>
          <div className="nav-logo-text">TRAKIE.AI</div>
        </div>
        <div className="nav-links">
          <a onClick={() => onNavigate('home')}>Home</a>
          <a onClick={() => onNavigate('receive')}>Receive Demo</a>
          <a onClick={() => onNavigate('bubbles')}>Intelligent Inventory</a>
          <a onClick={() => onNavigate('pricing')}>Pricing</a>
          <a onClick={() => onNavigate('contact')}>Contact</a>
        </div>
        <div className="nav-right">
          {user ? (
            <button onClick={handleLogout} className="nav-auth-btn">
              Logout
            </button>
          ) : (
            <a href="/login" className="nav-auth-btn">
              Login
            </a>
          )}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('pricing');
            }}
            className="nav-cta"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
