const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    description:
      'We learn about your firm, your bottlenecks, and your growth goals. No generic pitches—just a focused conversation.',
  },
  {
    number: '02',
    title: 'Custom Build',
    description:
      'We design and deploy AI-powered systems tailored to your workflows. You stay in the loop at every step.',
  },
  {
    number: '03',
    title: 'Ongoing Optimization',
    description:
      'We monitor, refine, and scale your systems over time—so your automation keeps getting smarter.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            A simple, transparent process from first call to live system.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[60px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-accent/30 via-accent/50 to-accent/30" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <div key={step.number} className={`text-center reveal reveal-delay-${i + 1}`}>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-700 border border-accent/20 mb-6">
                  <span className="font-heading font-bold text-xl gradient-text">
                    {step.number}
                  </span>
                  {/* Dot on the line */}
                  <div className="hidden md:block absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-dark-900" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
