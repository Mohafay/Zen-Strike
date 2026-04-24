const SERVICES = [
  {
    title: 'Landscape Architecture',
    description:
      'Master plans that unify built form and nature. We shape terrain, sightlines, and seasonal character into cohesive living spaces.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    alt:   'Lush garden landscape design',
  },
  {
    title: 'Custom Swimming Pools',
    description:
      'Infinity-edge pools, naturalistic water features, and integrated spas — sculpted to complement your property\'s unique geometry.',
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80',
    alt:   'Luxury custom swimming pool',
  },
  {
    title: 'Outdoor Kitchens',
    description:
      'Culinary environments built for year-round entertaining — premium appliances, custom stonework, and seamless indoor-outdoor flow.',
    image: 'https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?auto=format&fit=crop&w=800&q=80',
    alt:   'Luxury outdoor kitchen installation',
  },
  {
    title: 'Garden & Planting',
    description:
      'Curated planting schemes that shift beautifully with every season — blending structure, colour, and fragrance with intention.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    alt:   'Curated garden planting design',
  },
  {
    title: 'Atmospheric Lighting',
    description:
      'Architectural illumination that sculpts your landscape after dark — highlighting texture, depth, and drama with precision.',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    alt:   'Atmospheric outdoor lighting',
  },
  {
    title: 'Stonework & Terracing',
    description:
      'Handcrafted stone patios, retaining walls, and paved terraces that anchor your outdoor space with timeless solidity.',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    alt:   'Handcrafted stone patio terracing',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-cream-100 py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-16 md:mb-20 reveal">
          <p className="section-eyebrow mb-4">What We Create</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="section-title text-5xl md:text-6xl gold-rule">
              Spaces That<br />
              <em className="italic font-light">Transcend</em> the Ordinary
            </h2>
            <p className="max-w-sm font-sans font-light text-stone-deep/80 leading-relaxed text-sm md:text-base">
              Every project begins with listening. We bring craft, precision, and
              decades of horticultural and architectural knowledge to each commission.
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {SERVICES.map((service, i) => (
            <article
              key={service.title}
              className={`group reveal reveal-delay-${(i % 3) + 1}`}
            >
              {/* Image */}
              <div className="img-zoom aspect-[4/3] bg-cream-300 mb-6 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif font-light text-2xl text-ink mb-3 group-hover:text-forest-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="font-sans font-light text-sm text-stone-deep/75 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                {/* Arrow */}
                <div className="flex-shrink-0 mt-1 w-8 h-8 border border-stone-warm flex items-center justify-center text-stone-mid group-hover:border-forest-600 group-hover:text-forest-600 group-hover:bg-forest-50 transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
