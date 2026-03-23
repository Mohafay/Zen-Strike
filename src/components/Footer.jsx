export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 md:px-12 lg:px-20 py-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-4 h-4" fill="none">
              <path d="M6 10h20l-12 10h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-heading font-semibold text-sm text-white">
            Zen Strike
          </span>
        </div>

        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Zen Strike. All rights reserved.
        </p>

        <a
          href="mailto:mohamed@zen-strike.com"
          className="text-gray-400 text-sm hover:text-accent transition-colors"
        >
          mohamed@zen-strike.com
        </a>
      </div>
    </footer>
  );
}
