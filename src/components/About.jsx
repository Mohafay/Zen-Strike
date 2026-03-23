export default function About() {
  return (
    <section id="about" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      {/* Divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">
            About Me
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            The Person Behind Zen Strike
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div className="reveal reveal-delay-1">
            <div className="relative">
              {/* Placeholder for your photo — replace the src with your actual image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-700/60">
                <img src="/mohamed-faye.jpg" alt="Mohamed Faye — Founder of Zen Strike" className="w-full h-full object-cover" />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl border border-accent/20 -z-10" />
            </div>
          </div>

          {/* Story */}
          <div className="reveal reveal-delay-2">
            <h3 className="font-heading font-bold text-2xl text-white mb-2">
              Mohamed Faye
            </h3>
            <p className="text-accent font-medium text-sm mb-6">Founder &amp; CEO</p>

            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                I&rsquo;ve been building automation systems long before it was
                trendy. As a serial entrepreneur, I founded and ran three startups
                &mdash; each one centered on using technology to eliminate
                repetitive work and unlock scale.
              </p>
              <p>
                My first venture automated professional scenarios so students
                could learn by doing rather than just reading. The second helped
                teachers generate full courses from just their curriculum and
                source materials. The third connected international buyers with
                sourcing and product quality inspection in China.
              </p>
              <p>
                The common thread? <span className="text-white font-medium">Taking a painful, manual process
                and turning it into a system that runs itself.</span> That&rsquo;s
                the same thing I do today at Zen Strike &mdash; except now I do it
                with AI, and I do it for consulting firms who are stuck doing
                everything manually.
              </p>
              <p>
                I started Zen Strike because I saw a massive gap: boutique
                consultancies are sitting on goldmines of expertise, but they
                waste hours on outreach, content creation, and operations that
                could be automated. I&rsquo;m here to fix that.
              </p>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/[0.06]">
              <div>
                <p className="font-heading font-bold text-2xl gradient-text">3</p>
                <p className="text-gray-500 text-sm">Startups founded</p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl gradient-text">ROI</p>
                <p className="text-gray-500 text-sm">Business outcome focus</p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl gradient-text">100%</p>
                <p className="text-gray-500 text-sm">Focused on consulting firms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
