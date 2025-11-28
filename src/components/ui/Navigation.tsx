import Link from 'next/link';
import { Camera } from 'lucide-react';

interface NavigationProps {
  showAuthButtons?: boolean;
}

const navLinks = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/shop', label: 'Shop' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation({ showAuthButtons = true }: NavigationProps) {
  return (
    <header
      style={{
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          height: '64px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Camera style={{ width: '32px', height: '32px', color: '#2563eb' }} />
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>EpicMoments</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {showAuthButtons && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/login"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
