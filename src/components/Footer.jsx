const SOCIAL = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    name: 'Houzz',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0L0 8.571V24h8.571v-8.571H15.43V24H24V8.571z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

const NAV_COLS = [
  {
    heading: 'Explore',
    links: [
      { label: 'Services',    href: '#services'    },
      { label: 'Portfolio',   href: '#portfolio'   },
      { label: 'About',       href: '#about'       },
      { label: 'Our Process', href: '#process'     },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Landscape Design',    href: '#services' },
      { label: 'Swimming Pools',      href: '#services' },
      { label: 'Outdoor Kitchens',    href: '#services' },
      { label: 'Lighting Design',     href: '#services' },
      { label: 'Stonework & Patios',  href: '#services' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream-200/60 pt-16 md:pt-20 pb-8 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14 pb-14 border-b border-white/[0.07]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2 md:pr-12">
            <img
              src="/zen-strike-logo.png"
              alt="Zen Strike"
              className="h-7 w-auto mb-5 brightness-0 invert opacity-80"
            />
            <p className="font-sans font-light text-sm leading-relaxed text-cream-200/50 max-w-xs mb-6">
              Luxury outdoor living environments, crafted with precision
              and designed to endure. Serving discerning clients across
              Southern California.
            </p>
            {/* Socials */}
            <div className="flex gap-4">
              {SOCIAL.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-cream-200/40 hover:border-white/30 hover:text-cream-200/80 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-xs font-sans font-medium tracking-widest uppercase text-cream-100/50 mb-5">
                {heading}
              </h4>
              <ul className="space-y-3" role="list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="font-sans font-light text-sm text-cream-200/45 hover:text-cream-200/80 transition-colors duration-300"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-10 border-b border-white/[0.07]">
          <div className="flex flex-col sm:flex-row gap-6 text-sm font-sans font-light">
            <a href="mailto:hello@zenstrike.com" className="text-cream-200/50 hover:text-cream-200/80 transition-colors">
              hello@zenstrike.com
            </a>
            <a href="tel:+13105550192" className="text-cream-200/50 hover:text-cream-200/80 transition-colors">
              +1 (310) 555-0192
            </a>
            <span className="text-cream-200/30">Los Angeles, California</span>
          </div>
          <a
            href="#contact"
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-cream-200/60 text-xs font-sans font-medium tracking-widest uppercase hover:border-white/30 hover:text-cream-200/80 transition-all duration-300"
          >
            Request Estimate
          </a>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-sans text-cream-200/30">
            &copy; {new Date().getFullYear()} Zen Strike. All rights reserved.
          </p>
          <p className="text-xs font-sans text-cream-200/20">
            Luxury Outdoor Living · Los Angeles, CA
          </p>
        </div>

      </div>
    </footer>
  );
}
