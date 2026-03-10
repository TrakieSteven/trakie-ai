'use client';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
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
    </nav>
  );
}
