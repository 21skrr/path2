import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { cn } from '@/lib/utils';
import { ZoomParallax } from '@/components/ui/zoom-parallax';
import PricingSection from '@/components/ui/pricing-section-3';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { useNavigate } from 'react-router-dom';
import { NewsTicker, EditorialGrid, SectionHeader, MOCK_ACTUALITE } from './Home';
import { PathHoverFooter } from '../components/PathHoverFooter';
import './Home.css';

const parallaxImages = [
  { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Team collaboration meeting' },
  { src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Team working together' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop&auto=format&q=80', alt: 'Business professionals' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Creative team at work' },
  { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=800&fit=crop&auto=format&q=80', alt: 'Professional woman' },
  { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Business presentation' },
  { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Workshop session' },
];

const FadeInSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SERVICES = [
  { icon: '🎯', title: 'Conseil Stratégique RH', description: 'Accompagnement sur-mesure pour transformer votre organisation et aligner vos talents avec vos objectifs.' },
  { icon: '📚', title: 'Formation & Développement', description: 'Programmes de formation certifiants pour développer les compétences de vos équipes.' },
  { icon: '🔍', title: 'Recrutement & Assessment', description: 'Identification et évaluation des meilleurs talents pour vos postes stratégiques.' },
  { icon: '⚖️', title: 'Conformité & Droit Social', description: 'Expertise juridique pour sécuriser vos pratiques RH au regard du droit marocain.' },
  { icon: '📊', title: 'Transformation Digitale RH', description: 'Modernisation de vos processus RH grâce aux technologies et à l\'automatisation.' },
  { icon: '🤝', title: 'Coaching & Leadership', description: 'Programmes de coaching exécutif pour développer le leadership à tous les niveaux.' },
];

const STATS = [
  { value: '500+', label: 'Entreprises Accompagnées' },
  { value: '15K+', label: 'Professionnels Formés' },
  { value: '12', label: 'Années d\'Expérience' },
  { value: '98%', label: 'Taux de Satisfaction' },
];

const VALUES = [
  { icon: '💡', title: 'Innovation', text: 'Nous repoussons les limites des pratiques RH traditionnelles pour créer des solutions avant-gardistes.' },
  { icon: '🌍', title: 'Impact', text: 'Chaque action que nous menons vise à créer un impact mesurable et durable sur les organisations.' },
  { icon: '🤲', title: 'Intégrité', text: 'Nous opérons avec transparence, éthique et un engagement profond envers nos partenaires.' },
  { icon: '🌱', title: 'Croissance', text: 'Nous croyons au potentiel de chaque individu et investissons dans le développement humain.' },
];

export const PathLanding: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const navOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const navigate = useNavigate();

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="font-inter text-gray-800" style={{ background: '#fafbff' }}>
      {/* ── Sticky Nav (appears on scroll) ── */}
      <motion.nav
        style={{ opacity: navOpacity }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
        role="navigation"
      >
        <div
          className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'rgba(123,45,142,0.08)' }}
        >
          <Link to="/about" className="flex items-center gap-2 no-underline">
            <span className="text-2xl font-black tracking-tight" style={{ color: '#7B2D8E' }}>
              P<span style={{ color: '#00B4A6' }}>@</span>TH
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#mission" className="text-sm font-medium no-underline" style={{ color: '#4b5563' }}>Mission</a>
            <a href="#services" className="text-sm font-medium no-underline" style={{ color: '#4b5563' }}>Services</a>
            <a href="#values" className="text-sm font-medium no-underline" style={{ color: '#4b5563' }}>Valeurs</a>
            <a href="#gallery" className="text-sm font-medium no-underline" style={{ color: '#4b5563' }}>Galerie</a>
            <Link
              to="/home"
              className="ml-4 text-sm font-semibold px-5 py-2 rounded-lg no-underline text-white"
              style={{ background: 'linear-gradient(135deg, #7B2D8E, #00B4A6)' }}
            >
              Plateforme RH →
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Magazine Ticker ── */}
      <div style={{ paddingTop: '64px' }}>
        <NewsTicker />
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ marginTop: '-40px' }}>
        {/* Gradient Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1052 25%, #7B2D8E 50%, #00B4A6 80%, #00d4c8 100%)' }} />
        {/* Three.js Dotted Surface */}
        <DottedSurface dotColor={[0, 180, 166]} />
        {/* Radial overlay for depth */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(123,45,142,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0,180,166,0.3) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
            >
              🇲🇦 People At The Heart Of Growth
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6"
          >
            P<span style={{ color: '#2DD4BF' }}>@</span>TH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            L'association de référence pour les professionnels RH au Maroc.
            Nous accompagnons les organisations dans leur transformation humaine
            pour une croissance durable et inclusive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold no-underline shadow-lg"
              style={{ background: '#fff', color: '#7B2D8E' }}
            >
              Rejoindre PATH →
            </Link>
            <a
              href="#mission"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold no-underline"
              style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
            >
              Découvrir notre mission
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full flex items-start justify-center pt-2" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
            <div className="w-1.5 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
          </div>
        </motion.div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="relative z-10 -mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl shadow-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            {STATS.map((stat, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className={cn('text-center py-8 px-4', i < 3 ? 'md:border-r border-gray-100' : '')}>
                  <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: '#7B2D8E' }}>{stat.value}</div>
                  <div className="text-xs md:text-sm font-medium" style={{ color: '#6b7280' }}>{stat.label}</div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ACTUALITÉS & TENDANCES (DRH MIX) ══════════ */}
      <section className="py-24" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title="Actualité RH" href="/articles" subtitle="Les dernières nouveautés et analyses expertes" />
          <div className="mt-8">
            <EditorialGrid items={MOCK_ACTUALITE} variant="news" />
          </div>
        </div>
      </section>

      {/* ══════════ MISSION ══════════ */}
      <section id="mission" className="py-24 md:py-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: 'rgba(123,45,142,0.08)', color: '#7B2D8E' }}>
                  Notre Mission
                </span>
                <h2 className="text-3xl md:text-4xl font-black leading-tight mb-6" style={{ color: '#1f2937' }}>
                  Placer les <span style={{ color: '#7B2D8E' }}>personnes</span> au cœur de la <span style={{ color: '#00B4A6' }}>croissance</span>
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#6b7280' }}>
                  PATH — <strong>People At The Heart Of Growth</strong> — est née de la conviction
                  que la réussite d'une organisation repose fondamentalement sur ses collaborateurs.
                  Nous rassemblons les meilleurs experts RH du Maroc pour créer un écosystème
                  d'excellence, de partage et d'innovation.
                </p>
                <p className="text-base leading-relaxed mb-8" style={{ color: '#6b7280' }}>
                  Notre plateforme offre aux professionnels RH marocains les outils, les connaissances
                  et le réseau nécessaires pour transformer leurs organisations et créer un impact
                  humain mesurable.
                </p>
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold no-underline text-white"
                  style={{ background: 'linear-gradient(135deg, #7B2D8E, #5C1F6A)' }}
                >
                  Explorer nos ressources →
                </Link>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format&q=80"
                    alt="Team collaboration"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 p-5 rounded-xl shadow-lg max-w-xs" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #7B2D8E, #00B4A6)' }}>P</div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#1f2937' }}>Réseau PATH</div>
                      <div className="text-xs" style={{ color: '#9ca3af' }}>8,200+ professionnels RH</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services" className="py-24 md:py-32" style={{ background: 'linear-gradient(180deg, #f8f5ff 0%, #fafbff 100%)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(0,180,166,0.08)', color: '#00B4A6' }}>
                Nos Services
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#1f2937' }}>
                Des solutions RH <span style={{ color: '#7B2D8E' }}>complètes</span>
              </h2>
              <p className="max-w-xl mx-auto text-base" style={{ color: '#6b7280' }}>
                Nous offrons un écosystème complet de services pour accompagner votre transformation RH.
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="group p-7 rounded-xl transition-all duration-300 cursor-default h-full"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(123,45,142,0.1)'; e.currentTarget.style.borderColor = 'rgba(123,45,142,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                >
                  <span className="text-3xl block mb-4">{service.icon}</span>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>{service.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{service.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ VALUES ══════════ */}
      <section id="values" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(123,45,142,0.08)', color: '#7B2D8E' }}>
                Nos Valeurs
              </span>
              <h2 className="text-3xl md:text-4xl font-black" style={{ color: '#1f2937' }}>
                Ce qui nous <span style={{ color: '#00B4A6' }}>définit</span>
              </h2>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 rounded-xl" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                  <span className="text-4xl block mb-4">{value.icon}</span>
                  <h3 className="text-base font-bold mb-2" style={{ color: '#1f2937' }}>{value.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{value.text}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ZOOM PARALLAX GALLERY ══════════ */}
      <section id="gallery">
        <FadeInSection>
          <div className="text-center mb-4 px-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(0,180,166,0.08)', color: '#00B4A6' }}>
              Notre Communauté
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: '#1f2937' }}>
              Des <span style={{ color: '#7B2D8E' }}>moments</span> qui comptent
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#6b7280' }}>
              Découvrez les événements, formations et rencontres qui font vivre notre réseau.
            </p>
          </div>
        </FadeInSection>
        <ZoomParallax images={parallaxImages} />
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" className="bg-white py-12 relative z-10">
        <PricingSection onSelectPlan={(plan) => plan.price !== 0 && navigate('/membership')} />
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 md:py-32 bg-white relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <FadeInSection>
            <div
              className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
              style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #7B2D8E 50%, #00B4A6 100%)' }}
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Prêt à transformer votre approche RH ?
                </h2>
                <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Rejoignez PATH et accédez à un réseau d'excellence, des ressources premium
                  et un accompagnement personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold no-underline"
                    style={{ background: '#fff', color: '#7B2D8E' }}
                  >
                    Devenir membre PATH
                  </Link>
                  <Link
                    to="/home"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold no-underline"
                    style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                  >
                    Explorer la plateforme →
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <PathHoverFooter />
    </div>
  );
};
