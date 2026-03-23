const caseStudies = [
  {
    title: 'LinkedIn Thought Leadership Engine',
    subtitle: 'Automated LinkedIn posting system for CEO',
    metric: '7+',
    metricLabel: 'hours saved per week',
    description:
      'Built an AI-powered content engine that generates, schedules, and posts authority-building LinkedIn content—eliminating hours of brainstorming and typing while growing his professional presence on autopilot.',
    screenshot: '/screenshots/linkedin-engine.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    title: 'Intelligent Lead Generation & Outreach',
    subtitle: 'End-to-end prospecting infrastructure',
    metric: '200+',
    metricLabel: 'qualified leads contacted daily',
    description:
      'Deployed a scraping and outreach pipeline using LinkedIn Sales Navigator, automated enrichment, AI-personalized messages, and conditional follow-up sequences—turning cold outreach into a predictable pipeline.',
    screenshot: '/screenshots/lead-gen.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'Centralized Knowledge Base',
    subtitle: 'AI-searchable company knowledge system',
    metric: '90%',
    metricLabel: 'faster internal answers',
    description:
      'Built a searchable knowledge base that lets the team instantly find SOPs, client info, and institutional knowledge—reducing repetitive questions and onboarding time dramatically.',
    screenshot: '/screenshots/knowledge-base.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
];

export default function SocialProof() {
  return (
    <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
      {/* Divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">
            Case Study — Talents Consulting
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Real Results for Real Consultancies
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A recruitment consultancy focused on West &amp; North Africa. Here&rsquo;s
            what we built for them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study, i) => (
            <div
              key={study.title}
              className={`card-glass p-8 flex flex-col reveal reveal-delay-${i + 1}`}
            >
              {/* Screenshot preview */}
              <div className="aspect-video rounded-xl overflow-hidden bg-dark-800/80 border border-white/[0.04] mb-6">
                <img
                  src={study.screenshot}
                  alt={`${study.title} — screenshot`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full items-center justify-center text-gray-600 text-sm" style={{ display: 'none' }}>
                  Screenshot coming soon
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6">
                {study.icon}
              </div>

              <p className="text-sm text-accent font-medium mb-2">{study.subtitle}</p>
              <h3 className="font-heading font-bold text-xl text-white mb-4">
                {study.title}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-heading font-bold text-4xl gradient-text">
                  {study.metric}
                </span>
                <span className="text-gray-400 text-sm">{study.metricLabel}</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mt-auto">
                {study.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
