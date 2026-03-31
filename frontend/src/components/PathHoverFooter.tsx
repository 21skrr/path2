"use client";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Heart,
  Share2,
  Globe,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

export function PathHoverFooter() {
  const footerLinks = [
    {
      title: "Contenu",
      links: [
        { label: "Actualité RH", to: "/actualite-maroc" },
        { label: "Interviews", to: "/articles?category=ARTICLE" },
        { label: "Nominations", to: "/nominations" },
        { label: "Etudes & Publications", to: "/articles" },
      ],
    },
    {
      title: "Plateforme",
      links: [
        { label: "Adhésion", to: "/membership" },
        { label: "Ressources", to: "/resources" },
        { label: "Offres d'Emploi", to: "/offres-emploi" },
        { label: "Textes de Loi", to: "/textes-loi" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} style={{ color: '#00B4A6' }} />,
      text: "contact@path.ma",
      href: "mailto:contact@path.ma",
    },
    {
      icon: <Phone size={18} style={{ color: '#00B4A6' }} />,
      text: "+212 5 22 00 00 00",
      href: "tel:+212522000000",
    },
    {
      icon: <MapPin size={18} style={{ color: '#00B4A6' }} />,
      text: "Casablanca, Maroc",
    },
  ];

  const socialLinks = [
    { icon: <Users size={20} />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <Heart size={20} />, label: "Facebook", href: "https://facebook.com" },
    { icon: <Share2 size={20} />, label: "Instagram", href: "https://instagram.com" },
    { icon: <Globe size={20} />, label: "Website", href: "/" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: '#1a0a2e', borderRadius: '24px 24px 0 0' }}>
      <div className="max-w-7xl mx-auto p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <span className="text-3xl font-black tracking-tight" style={{ color: '#fff' }}>
                P<span style={{ color: '#2DD4BF' }}>@</span>TH
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              People At The Heart Of Growth — L'association de référence pour les professionnels RH au Maroc.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-6" style={{ color: '#fff' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm no-underline transition-colors"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#00B4A6'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#fff' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center" style={{ gap: '12px' }}>
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm no-underline transition-colors"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#00B4A6'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '32px 0' }} />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm" style={{ gap: '16px' }}>
          {/* Social icons */}
          <div className="flex" style={{ gap: '24px' }}>
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors no-underline"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00B4A6'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Quick links */}
          <div className="flex" style={{ gap: '16px' }}>
            <Link to="/login" className="text-sm no-underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Connexion</Link>
            <Link to="/register" className="text-sm no-underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Inscription</Link>
            <Link to="/admin" className="text-sm no-underline" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin</Link>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left" style={{ color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            &copy; 2026 PATH — People At The Heart Of Growth. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Text hover effect with PATH logo */}
      <div className="lg:flex hidden" style={{ height: '30rem', marginTop: '-13rem', marginBottom: '-9rem' }}>
        <TextHoverEffect text="P@TH" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
