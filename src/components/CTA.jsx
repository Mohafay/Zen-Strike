export default function CTA() {
  return (
    <section id="cta" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28 overflow-hidden">
      {/* Background orb */}
      <div className="glow-orb w-[500px] h-[500px] bg-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />

      <div className="relative max-w-3xl mx-auto text-center reveal">
        <div className="card-glass p-10 md:p-16">
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">
            Let&rsquo;s Talk
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Ready to Automate Your Growth?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Book a free discovery call and we&rsquo;ll show you exactly how AI automation
            can save your team time and drive more revenue.
          </p>
          <a href="#" className="btn-primary text-lg">
            Book a Discovery Call
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
