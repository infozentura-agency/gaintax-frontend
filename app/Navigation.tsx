"use client";
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if(event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  return (
    <>
      <aside className="concept-note"><span>Independent GAIN Tax website concept</span><span>Prepared for feedback</span></aside>
      <header className="site-head">
        <div className="wrap nav">
          <Link className="brand" href="/" aria-label="GAIN Tax home">GAIN<span>TAX</span></Link>
          <nav className="nav-links" aria-label="Main navigation" data-open={isOpen ? '' : undefined} onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setIsOpen(false);
          }}>
            <Link href="/product" aria-current={pathname === '/product' ? 'page' : undefined}>Product</Link>
            <Link href="/benchmark" aria-current={pathname === '/benchmark' ? 'page' : undefined}>Benchmark</Link>
            <Link href="/pricing" aria-current={pathname === '/pricing' ? 'page' : undefined}>Pricing</Link>
            <Link href="/resources" aria-current={pathname === '/resources' ? 'page' : undefined}>Resources</Link>
            <Link href="/trust" aria-current={pathname === '/trust' ? 'page' : undefined}>Trust</Link>
            <Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>Company</Link>
          </nav>
          <div className="nav-end">
            <a className="login" href="https://gaintax.co.uk/login">Log in</a>
            <a className="button" href="https://gaintax.co.uk/register">Try free <b><FiArrowUpRight /></b></a>
            <button 
              className="menu" 
              type="button" 
              aria-label={isOpen ? 'Close navigation' : 'Open navigation'} 
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
