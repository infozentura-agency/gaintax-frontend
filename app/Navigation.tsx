"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  useEffect(() => {
    const button = document.querySelector('.menu');
    const nav = document.querySelector('.nav-links');
    if(!button || !nav) return;
    
    const setOpen = (open: boolean) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      button.textContent = open ? '×' : '☰';
      if(open) nav.setAttribute('data-open', '');
      else nav.removeAttribute('data-open');
    };
    
    const clickHandler = () => setOpen(button.getAttribute('aria-expanded') !== 'true');
    button.addEventListener('click', clickHandler);
    
    const navClickHandler = (event: any) => {
      if(event.target.closest('a')) setOpen(false);
    };
    nav.addEventListener('click', navClickHandler);
    
    const keyHandler = (event: any) => {
      if(event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    
    return () => {
      button.removeEventListener('click', clickHandler);
      nav.removeEventListener('click', navClickHandler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return (
    <>
      <aside className="concept-note"><span>Independent GAIN Tax website concept</span><span>Prepared for feedback</span></aside>
      <header className="site-head">
        <div className="wrap nav">
          <Link className="brand" href="/" aria-label="GAIN Tax home">GAIN<span>TAX</span></Link>
          <nav className="nav-links" aria-label="Main navigation">
            <Link href="/product" aria-current={pathname === '/product' ? 'page' : undefined}>Product</Link>
            <Link href="/benchmark" aria-current={pathname === '/benchmark' ? 'page' : undefined}>Benchmark</Link>
            <Link href="/pricing" aria-current={pathname === '/pricing' ? 'page' : undefined}>Pricing</Link>
            <Link href="/resources" aria-current={pathname === '/resources' ? 'page' : undefined}>Resources</Link>
            <Link href="/trust" aria-current={pathname === '/trust' ? 'page' : undefined}>Trust</Link>
            <Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>Company</Link>
          </nav>
          <div className="nav-end">
            <a className="login" href="https://gaintax.co.uk/login">Log in</a>
            <a className="button" href="https://gaintax.co.uk/register">Try free <b>↗</b></a>
            <button className="menu" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
          </div>
        </div>
      </header>
    </>
  );
}
