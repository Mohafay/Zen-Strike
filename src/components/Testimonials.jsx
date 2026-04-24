import { useState, useCallback } from 'react';

const TESTIMONIALS = [
  {
    quote:
      'Working with Zen Strike transformed our estate\'s grounds into something we genuinely couldn\'t have conceived on our own. The attention to material, light, and living plant — it\'s extraordinary.',
    name:     'James & Claire Worthington',
    location: 'Montecito Estate, CA',
    project:  'Full Landscape & Pool',
  },
  {
    quote:
      'The entire experience was seamless from the first consultation to the handover. Our terrace and outdoor kitchen now feel like the best room in the house. We entertain outside year-round.',
    name:     'Michael Harrington',
    location: 'Beverly Hills Residence, CA',
    project:  'Outdoor Kitchen & Terrace',
  },
  {
    quote:
      'I\'ve commissioned landscape work before. Nothing has come close to this level of craft. Zen Strike operates in an entirely different category — they are true artisans of the outdoor world.',
    name:     'Alexandra Chen',
    location: 'Malibu Retreat, CA',
    project:  'Japanese Garden & Lighting',
  },
];

function Stars() {
  return (
    <div className="flex gap-1 mb-6" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive(a => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);
  const next = useCallback(() => setActive(a => (a + 1) % TESTIMONIALS.length), []);

  return (
    <section className="bg-forest-800 py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-14 reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="section-eyebrow text-forest-200/60 mb-4">Client Stories</p>
            <h2 className="font-serif font-light text-5xl md:text-6xl leading-tight text-cream-100">
              What Our<br />
              <em className="italic">Clients</em> Say
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="flex gap-3 self-start md:self-auto">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-12 h-12 border border-cream-100/20 text-cream-100/60 flex items-center justify-center hover:border-cream-100/50 hover:text-cream-100 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-12 h-12 border border-cream-100/20 text-cream-100/60 flex items-center justify-center hover:border-cream-100/50 hover:text-cream-100 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop: all 3 cards; mobile: slider */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 reveal reveal-delay-1">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`p-8 border transition-all duration-500 ${
                i === active
                  ? 'border-gold-500/50 bg-forest-700'
                  : 'border-forest-600/50 bg-forest-900/40'
              }`}
            >
              <Stars />
              {/* Opening quote mark */}
              <svg className="w-8 h-8 text-gold-600/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-serif font-light text-lg text-cream-200/90 leading-relaxed mb-8 italic">
                "{t.quote}"
              </p>
              <div className="border-t border-forest-600/50 pt-6">
                <p className="font-sans font-medium text-sm text-cream-100">{t.name}</p>
                <p className="font-sans text-xs text-forest-200/50 mt-1">{t.location}</p>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-gold-500/70 mt-2">
                  {t.project}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single active card */}
        <div className="md:hidden reveal">
          <div className="p-8 border border-gold-500/50 bg-forest-700">
            <Stars />
            <svg className="w-8 h-8 text-gold-600/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="font-serif font-light text-lg text-cream-200/90 leading-relaxed mb-8 italic">
              "{TESTIMONIALS[active].quote}"
            </p>
            <div className="border-t border-forest-600/50 pt-6">
              <p className="font-sans font-medium text-sm text-cream-100">{TESTIMONIALS[active].name}</p>
              <p className="font-sans text-xs text-forest-200/50 mt-1">{TESTIMONIALS[active].location}</p>
              <p className="font-sans text-xs font-medium tracking-widest uppercase text-gold-500/70 mt-2">
                {TESTIMONIALS[active].project}
              </p>
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`transition-all duration-300 ${
                  i === active
                    ? 'w-8 h-1 bg-gold-500'
                    : 'w-4 h-1 bg-forest-600 hover:bg-forest-400'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
