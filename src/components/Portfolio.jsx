const PROJECTS = [
  {
    title:    'The Worthington Estate',
    location: 'Montecito, CA',
    category: 'Pool & Full Landscape',
    image:    'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=1200&q=85',
    alt:      'Luxury estate pool Montecito',
    wide:     true,
  },
  {
    title:    'Casa del Sol',
    location: 'Malibu, CA',
    category: 'Outdoor Kitchen & Terrace',
    image:    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    alt:      'Malibu outdoor terrace kitchen',
    wide:     false,
  },
  {
    title:    'The Meridian Garden',
    location: 'Beverly Hills, CA',
    category: 'Landscape Architecture',
    image:    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80',
    alt:      'Beverly Hills garden landscape',
    wide:     false,
  },
  {
    title:    'Aqua Serena',
    location: 'Scottsdale, AZ',
    category: 'Pool & Water Features',
    image:    'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80',
    alt:      'Scottsdale luxury pool water features',
    wide:     false,
  },
  {
    title:    'The Grove Residence',
    location: 'Palo Alto, CA',
    category: 'Japanese Garden Design',
    image:    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    alt:      'Japanese inspired garden Palo Alto',
    wide:     false,
  },
  {
    title:    'Stonehaven Terrace',
    location: 'Napa Valley, CA',
    category: 'Stonework & Lighting',
    image:    'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=800&q=80',
    alt:      'Napa Valley stone terrace with firepit',
    wide:     false,
  },
];

function ProjectCard({ project, className = '' }) {
  return (
    <article className={`portfolio-item group relative overflow-hidden bg-forest-900 cursor-pointer ${className}`}>
      {/* Image */}
      <div className="img-zoom w-full h-full">
        <img
          src={project.image}
          alt={project.alt}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-700"
          loading="lazy"
        />
      </div>

      {/* Hover overlay */}
      <div className="overlay absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent flex flex-col justify-end p-6 md:p-8">
        <p className="text-xs font-sans font-medium tracking-ultra uppercase text-gold-400 mb-2">
          {project.category}
        </p>
        <h3 className="font-serif font-light text-2xl md:text-3xl text-white mb-1">
          {project.title}
        </h3>
        <p className="text-sm font-sans text-white/55">{project.location}</p>
        <div className="mt-4 flex items-center gap-2 text-white/60 text-xs font-sans font-medium tracking-widest uppercase group-hover:text-gold-400 transition-colors duration-300">
          View Project
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Always-visible title on mobile */}
      <div className="overlay absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/70 to-transparent md:hidden">
        <h3 className="font-serif font-light text-lg text-white">{project.title}</h3>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [wide, ...rest] = PROJECTS;

  return (
    <section id="portfolio" className="bg-ink py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-14 md:mb-18 reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="section-eyebrow text-stone-mid mb-4">Selected Works</p>
            <h2 className="font-serif font-light text-5xl md:text-6xl leading-tight text-cream-100">
              Projects That<br />
              <em className="italic">Define</em> Excellence
            </h2>
          </div>
          <a
            href="#contact"
            className="self-start md:self-auto btn-outline-light text-cream-200 border-cream-200/25 hover:bg-cream-100/10 flex-shrink-0"
          >
            Start Your Project
          </a>
        </div>

        {/* Grid — row 1: one wide + one normal; row 2: four equal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 reveal">
          {/* Wide featured card */}
          <ProjectCard project={wide} className="aspect-[4/3] md:aspect-auto md:row-span-2" />

          {/* Second card fills right of row 1 */}
          <ProjectCard project={rest[0]} className="aspect-[4/3]" />

          {/* Third card fills right of row 2 */}
          <ProjectCard project={rest[1]} className="aspect-[4/3]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4 reveal reveal-delay-2">
          {rest.slice(2).map((project) => (
            <ProjectCard key={project.title} project={project} className="aspect-[4/3]" />
          ))}
        </div>

      </div>
    </section>
  );
}
