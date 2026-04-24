const STATS = [
  { value: '15+',  label: 'Years of Craft'    },
  { value: '400+', label: 'Projects Completed' },
  { value: '100%', label: 'Client Satisfaction' },
];

export default function About() {
  return (
    <section id="about" className="bg-cream-200 py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Text ── */}
          <div className="reveal">
            <p className="section-eyebrow mb-5">Our Story</p>
            <h2 className="font-serif font-light text-5xl md:text-6xl leading-tight text-ink mb-8 gold-rule">
              Precision in<br />
              <em className="italic">Every</em> Detail
            </h2>

            <div className="space-y-5 font-sans font-light text-stone-deep/80 leading-relaxed text-[15px]">
              <p>
                Zen Strike was founded on a single conviction: that outdoor space
                is not an afterthought, but the truest expression of how you choose
                to live. We bring the same rigour and artistry to a garden as an
                architect brings to a building.
              </p>
              <p>
                Our team of landscape architects, master gardeners, and specialist
                craftspeople work collaboratively on every project — from the first
                sketch to the final planted season. Nothing leaves our hands until
                it meets our exacting standards.
              </p>
              <p>
                We work exclusively with clients who value enduring quality over
                expediency. Our projects are not built to impress for a season;
                they are built to mature, deepen, and define a property for
                generations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-stone-warm/50">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-serif font-light text-4xl text-forest-600 mb-1">{value}</p>
                  <p className="text-xs font-sans font-medium tracking-widest uppercase text-stone-mid">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a href="#contact" className="btn-outline-dark">
                Begin a Conversation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="reveal reveal-delay-2 relative">
            {/* Decorative frame offset */}
            <div
              className="absolute inset-0 border border-stone-warm/40 translate-x-4 translate-y-4"
              aria-hidden="true"
            />
            <div className="img-zoom aspect-[3/4] relative overflow-hidden bg-cream-300">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
                alt="Zen Strike craftsmen at work on a luxury garden"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating quote */}
            <div className="absolute -bottom-6 -left-6 bg-forest-700 text-cream-100 p-6 max-w-[200px] shadow-xl">
              <p className="font-serif italic text-lg font-light leading-snug">
                "Craft is our only non-negotiable."
              </p>
              <p className="text-xs font-sans font-medium tracking-widest uppercase text-cream-300/70 mt-3">
                — Zen Strike Atelier
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
