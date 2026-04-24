export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[680px] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90"
          alt="Luxury outdoor living space"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchpriority="high"
        />
        {/* Layered dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/65" />
        {/* Subtle vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,8,0.5) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 text-center">
        {/* Eyebrow */}
        <p
          className="text-xs font-sans font-medium tracking-ultra uppercase text-white/50 mb-8 animate-fade-in"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          Luxury Outdoor Living
        </p>

        {/* Headline */}
        <h1
          className="font-serif font-light text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] text-white mb-8 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          The Art of<br />
          <em className="italic font-light">Outdoor</em> Living
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-lg mx-auto font-sans font-light text-lg text-white/65 mb-12 leading-relaxed animate-fade-in-up"
          style={{ opacity: 0, animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          Bespoke landscapes crafted with precision — designed to endure,
          built to inspire.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <a href="#contact" className="btn-primary">
            Request an Estimate
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#portfolio" className="btn-outline-light">
            View Our Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in"
        style={{ opacity: 0, animationDelay: '1.4s', animationFillMode: 'forwards' }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-sans font-medium tracking-ultra uppercase text-white/35">
          Discover
        </span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-5 bg-white/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
