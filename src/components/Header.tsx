import React, { useState, useEffect } from 'react';
import { useSite, AppRoute } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { MessageCircle, Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MinimalLeaf } from './OrganicDecorations';

export const Header: React.FC = () => {
  const { data, navigateTo, currentRoute, getWhatsAppUrl } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: Array<{ label: string; route: AppRoute; sectionId?: string }> = [
    { label: 'Início', route: 'home', sectionId: 'inicio' },
    { label: 'Sobre mim', route: 'about', sectionId: 'sobre' },
    { label: 'Atendimento', route: 'attendance', sectionId: 'atendimento' },
    { label: 'Especialidades', route: 'specialties', sectionId: 'especialidades' },
    { label: 'Como funciona', route: 'how-it-works', sectionId: 'como-funciona' },
    { label: 'Consultar Sessão', route: 'consultation' },
    { label: 'Blog', route: 'blog' },
    { label: 'Perguntas frequentes', route: 'faq', sectionId: 'faq' },
    { label: 'Contato', route: 'contact', sectionId: 'contato' },
  ];

  const handleNavClick = (item: { label: string; route: AppRoute; sectionId?: string }) => {
    setMobileMenuOpen(false);
    if (item.route === 'blog') {
      navigateTo('blog');
    } else if (item.route === 'consultation') {
      navigateTo('consultation');
    } else if (item.route === 'contact') {
      navigateTo('contact');
    } else {
      if (currentRoute !== 'home') {
        navigateTo('home');
        setTimeout(() => {
          if (item.sectionId) {
            const el = document.getElementById(item.sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        if (item.sectionId) {
          const el = document.getElementById(item.sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-[#FAF5EB]/95 backdrop-blur-md shadow-xs border-b border-[#E8DACB] py-3'
            : 'bg-[#FAF5EB]/90 backdrop-blur-sm border-b border-[#E8DACB]/60 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Logo / Psychologist Brand */}
          <button
            onClick={() => {
              navigateTo('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C88A12] bg-[#FFF8EA] flex items-center justify-center text-xs font-serif font-bold text-[#C88A12] shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              {data.profile.name.charAt(0) === 'D' ? 'Ψ' : data.profile.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="font-serif text-base sm:text-lg lg:text-xl font-medium tracking-tight text-[#33251A] block truncate group-hover:text-[#C88A12] transition-colors">
                {data.profile.name}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#6A5646]">
                <span className="truncate max-w-[110px] sm:max-w-none">{data.profile.title.split('&')[0]}</span>
                <span className="w-1 h-1 rounded-full bg-[#C88A12] shrink-0"></span>
                <span className="font-mono text-[10px] sm:text-[11px] bg-[#FFF8EA] border border-[#E8DACB] px-1.5 py-0.5 rounded text-[#33251A] shrink-0 font-medium">
                  CRP {data.profile.crp}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium text-[#453426]">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all ${
                  currentRoute === item.route && (item.route === 'blog' || item.route === 'contact' || item.route === 'consultation')
                    ? 'bg-[#C88A12]/15 text-[#B97808] font-semibold'
                    : 'text-[#453426] hover:text-[#C88A12] hover:bg-[#FFF8EA]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions & WhatsApp CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Consultation shortcut button (Desktop & Mobile) */}
            <button
              onClick={() => navigateTo('consultation')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#33251A] bg-[#FFF8EA] hover:bg-[#F8E7C5] border border-[#C88A12]/40 transition-all duration-200 shadow-2xs active:scale-95"
              title="Consulte sua consulta com código de acesso"
            >
              <Search className="w-3.5 h-3.5 text-[#C88A12]" />
              <span className="hidden sm:inline">Consultar Agendamento</span>
              <span className="sm:hidden text-[11px] font-bold">Minha Consulta</span>
            </button>

            {/* Direct WhatsApp button */}
            <a
              href={getWhatsAppUrl(data.config.whatsapp.appointmentMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-2xs transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C88A12]" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#33251A] hover:bg-[#FFF8EA] transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] z-30 bg-[#FAF5EB]/98 backdrop-blur-xl border-b border-[#E8DACB] shadow-xl lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-3">
              {/* Highlighted Patient Consultation Box inside Mobile Menu */}
              <div className="p-3.5 rounded-2xl bg-[#FFF8EA] border border-[#C88A12]/30 flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EB] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0 shadow-2xs">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-xs text-[#33251A]">Área do Paciente</h5>
                    <p className="text-[11px] text-[#6A5646]">Consulte sua sessão com seu código</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('consultation');
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] text-xs font-semibold shrink-0 shadow-2xs transition-colors"
                >
                  Acessar
                </button>
              </div>

              <div className="pb-2 border-b border-[#E8DACB] flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6A5646]">
                  Menu
                </span>
                <span className="text-xs font-mono text-[#33251A] bg-[#FFF8EA] border border-[#E8DACB] px-2 py-0.5 rounded">
                  CRP {data.profile.crp}
                </span>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="w-full text-left py-3 px-4 rounded-xl text-base font-medium text-[#33251A] hover:bg-[#FFF8EA] active:bg-[#F8E7C5] transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C88A12]" />
                </button>
              ))}

              <div className="pt-4 border-t border-[#E8DACB] flex flex-col gap-3">
                <a
                  href={getWhatsAppUrl(data.config.whatsapp.defaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#C88A12]" />
                  <span>Falar pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
