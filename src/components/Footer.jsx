export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 md:px-12 lg:px-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                  <path d="M6 10h20l-12 10h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Zen Strike
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              We help boutique consulting firms scale without scaling headcount
              through AI-powered automation systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 text-sm hover:text-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#cta" className="text-gray-400 text-sm hover:text-accent transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="https://calendly.com/mouhamedbachir-faye/30min" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-accent transition-colors">
                  Book a Call
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:mohamed@zen-strike.com"
                  className="text-gray-400 text-sm hover:text-accent transition-colors"
                >
                  mohamed@zen-strike.com
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/mouhamedbachir-faye/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-accent transition-colors"
                >
                  Schedule a Discovery Call
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Zen Strike. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            AI automation for consulting firms that want to grow smarter.
          </p>
        </div>
      </div>
    </footer>
  );
}
