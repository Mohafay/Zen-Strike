import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Services',  href: '#services'  },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About',     href: '#about'     },
  { label: 'Process',   href: '#process'   },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-cream-100/95 backdrop-blur-md border-b border-stone-warm/25'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between h-[72px] md:h-[84px]">

        {/* Logo */}
        <a href="#" aria-label="Zen Strike — Luxury Outdoor Living">
          <img
            src="/zen-strike-logo.png"
            alt="Zen Strike"
            className={`h-7 md:h-8 w-auto transition-all duration-700 ${
              scrolled ? 'brightness-0' : 'brightness-0 invert'
            }`}
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={`nav-link text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-300 ${
                  scrolled
                    ? 'text-charcoal/60 hover:text-charcoal'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className={`hidden md:inline-flex items-center gap-2 px-6 py-3 text-xs font-sans font-medium tracking-widest uppercase transition-all duration-500 ${
              scrolled
                ? 'bg-forest-700 text-cream-100 hover:bg-forest-600'
                : 'border border-white/35 text-white hover:bg-white/10'
            }`}
          >
            Request Estimate
          </a>

          <button
            className={`md:hidden p-1 transition-colors duration-300 ${
              scrolled ? 'text-charcoal' : 'text-white'
            }`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen
                ? <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
                : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-cream-100 border-t border-stone-warm/25 overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-[360px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-6 pt-6 pb-8 flex flex-col gap-5" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-xs font-sans font-medium tracking-widest uppercase text-charcoal/60 hover:text-charcoal transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#contact"
              className="inline-flex bg-forest-700 text-cream-100 px-6 py-3 text-xs font-sans font-medium tracking-widest uppercase hover:bg-forest-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Request Estimate
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
