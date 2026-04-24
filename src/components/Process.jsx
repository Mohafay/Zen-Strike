const STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'We begin with listening. A detailed site visit and conversation to understand how you live, what you love, and what your space demands.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Our team crafts a bespoke design proposal — drawings, material palettes, planting plans — refined through close collaboration until the vision is exactly right.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Expert craftspeople execute every detail with precision. We manage the full project — from groundwork to final planting — with rigorous quality control.',
  },
  {
    number: '04',
    title: 'Reveal',
    description:
      'We hand over a space that exceeds expectations, complete with a tailored maintenance guide and dedicated aftercare support.',
  },
];

export default function Process() {
  return (
    <section id="process" className="bg-cream-50 py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20 reveal">
          <p className="section-eyebrow mb-4">How We Work</p>
          <h2 className="section-title text-5xl md:text-6xl mb-6">
            A Process Built<br />
            for <em className="italic font-light">Perfection</em>
          </h2>
          <p className="max-w-md mx-auto font-sans font-light text-stone-deep/70 leading-relaxed text-sm">
            From first call to final reveal, every step is managed with the
            care your project deserves.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div
            className="hidden md:block absolute top-[52px] left-0 right-0 h-px bg-stone-warm/50"
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-4 gap-10 md:gap-6 relative">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`reveal reveal-delay-${i + 1} relative`}
              >
                {/* Number circle */}
                <div className="relative z-10 w-[52px] h-[52px] border border-gold-500 flex items-center justify-center mb-8 bg-cream-50">
                  <span className="font-sans text-xs font-medium tracking-widest text-gold-600">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif font-light text-2xl text-ink mb-3">
                  {step.title}
                </h3>
                <p className="font-sans font-light text-sm text-stone-deep/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20 reveal">
          <a href="#contact" className="btn-primary">
            Start with a Consultation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
