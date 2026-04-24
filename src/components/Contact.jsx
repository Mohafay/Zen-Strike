import { useState } from 'react';

const PROJECT_TYPES = [
  'Select a project type…',
  'Full Landscape Design & Build',
  'Custom Swimming Pool',
  'Outdoor Kitchen',
  'Garden & Planting Design',
  'Lighting Design',
  'Stonework & Terracing',
  'Multiple Services',
  'Unsure — I\'d like advice',
];

const BUDGET_RANGES = [
  'Select a budget range…',
  '$25,000 – $75,000',
  '$75,000 – $150,000',
  '$150,000 – $300,000',
  '$300,000 – $500,000',
  '$500,000+',
  'Prefer not to say',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', project: '', budget: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend-only: just show a success state
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative bg-forest-900 py-24 md:py-32 px-6 md:px-12 overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-screen-xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-20">

          {/* ── Left: Text ── */}
          <div className="md:col-span-2 reveal">
            <p className="section-eyebrow text-forest-200/50 mb-5">Get in Touch</p>
            <h2 className="font-serif font-light text-5xl md:text-6xl leading-tight text-cream-100 mb-8">
              Begin Your<br />
              <em className="italic">Project</em>
            </h2>
            <p className="font-sans font-light text-sm text-forest-200/60 leading-relaxed mb-10">
              Tell us about your vision. We respond to every enquiry personally,
              typically within one business day.
            </p>

            {/* Contact details */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-sans font-medium tracking-widest uppercase text-gold-500/70 mb-1.5">
                  Email
                </p>
                <a
                  href="mailto:hello@zenstrike.com"
                  className="font-sans text-sm text-cream-200/80 hover:text-cream-100 transition-colors"
                >
                  hello@zenstrike.com
                </a>
              </div>
              <div>
                <p className="text-xs font-sans font-medium tracking-widest uppercase text-gold-500/70 mb-1.5">
                  Phone
                </p>
                <a
                  href="tel:+13105550192"
                  className="font-sans text-sm text-cream-200/80 hover:text-cream-100 transition-colors"
                >
                  +1 (310) 555-0192
                </a>
              </div>
              <div>
                <p className="text-xs font-sans font-medium tracking-widest uppercase text-gold-500/70 mb-1.5">
                  Studio
                </p>
                <p className="font-sans text-sm text-cream-200/60">
                  Los Angeles, California<br />
                  Serving Southern California & Nationally
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="md:col-span-3 reveal reveal-delay-2">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 border border-gold-500/50 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-serif font-light text-3xl text-cream-100 mb-4">
                  Thank you.
                </h3>
                <p className="font-sans font-light text-sm text-forest-200/60 max-w-sm">
                  We've received your enquiry and will be in touch personally within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-sans font-medium tracking-widest uppercase text-forest-200/50 mb-3">
                      Full Name <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium tracking-widest uppercase text-forest-200/50 mb-3">
                      Email Address <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-sans font-medium tracking-widest uppercase text-forest-200/50 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (000) 000-0000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium tracking-widest uppercase text-forest-200/50 mb-3">
                      Project Type <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="project"
                        required
                        value={form.project}
                        onChange={handleChange}
                        className="form-select w-full"
                      >
                        {PROJECT_TYPES.map(opt => (
                          <option key={opt} value={opt === PROJECT_TYPES[0] ? '' : opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 3: Budget */}
                <div>
                  <label className="block text-xs font-sans font-medium tracking-widest uppercase text-forest-200/50 mb-3">
                    Approximate Budget
                  </label>
                  <div className="relative">
                    <select
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="form-select w-full"
                    >
                      {BUDGET_RANGES.map(opt => (
                        <option key={opt} value={opt === BUDGET_RANGES[0] ? '' : opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Row 4: Message */}
                <div>
                  <label className="block text-xs font-sans font-medium tracking-widest uppercase text-forest-200/50 mb-3">
                    Tell Us About Your Vision
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your project, property, and what you're hoping to create…"
                    className="form-input resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-ink font-sans font-medium text-xs tracking-widest uppercase transition-all duration-500 hover:bg-gold-400 hover:-translate-y-px w-full sm:w-auto justify-center sm:justify-start"
                >
                  Request an Estimate
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
