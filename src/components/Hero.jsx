export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Background orbs */}
      <div className="glow-orb w-[600px] h-[600px] bg-accent top-[-200px] left-[-200px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-purple-600 bottom-[-150px] right-[-150px]" />
      <div className="glow-orb w-[300px] h-[300px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center pt-24 pb-20">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AI Automation for Consulting Firms
          </div>
        </div>

        <h1
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up"
        >
          We Help Boutique Consulting Firms{' '}
          <span className="gradient-text">Scale Without Scaling Headcount</span>
        </h1>

        <p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          AI-powered systems that automate your outreach, content, and
          operations—so you can focus on what you do best: advising clients.
        </p>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <a href="https://calendly.com/mouhamedbachir-faye/30min" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg">
            Book a Discovery Call
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-gray-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
