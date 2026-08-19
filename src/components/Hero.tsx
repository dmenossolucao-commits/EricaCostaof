import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { MessageCircle, Calendar, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { normalizeAccessCode } from '../lib/firebase';
import { BotanicalBranch, MinimalLeaf, OrganicBlob } from './OrganicDecorations';

export const Hero: React.FC = () => {
  const { data, getWhatsAppUrl, navigateTo } = useSite();
  const [quickCode, setQuickCode] = useState('');
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  return (
    <section id="inicio" className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Subtle organic background blobs and botanical branch */}
      <OrganicBlob className="top-0 left-1/2 -translate-x-1/2 w-[650px] h-[550px] opacity-40" variant="gold" />
      <OrganicBlob className="top-40 right-[-100px] w-[450px] h-[450px] opacity-30" variant="cream" />
      <div className="absolute top-12 left-4 hidden lg:block opacity-25 pointer-events-none">
        <BotanicalBranch className="w-28 h-40 text-[#C88A12]" variant="gold" opacity={0.3} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start text-left w-full"
          >
            {/* Top Pill / Badge with subtle leaf */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3.5 sm:mb-4 shadow-2xs">
              <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
                {data.config.hero.badge || 'Acolhimento & Bem-estar'}
              </span>
            </div>

            {/* Main Headline with Editorial Serif Typography */}
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#33251A] leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-6 break-words max-w-full">
              {data.config.hero.title}
            </h1>

            {/* Subtitle / Empathy presentation */}
            <p className="text-sm sm:text-base md:text-lg text-[#5A4535] font-normal leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              {data.config.hero.subtitle}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6">
              <a
                href={getWhatsAppUrl(data.config.whatsapp.appointmentMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200 group w-full sm:w-auto text-center active:scale-95"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#C88A12] group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{data.config.hero.ctaSecondaryText || 'Falar pelo WhatsApp'}</span>
              </a>

              <button
                onClick={() => {
                  const el = document.getElementById('atendimento');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium bg-transparent hover:bg-[#FFF8EA] text-[#33251A] border border-[#C88A12] transition-all duration-200 w-full sm:w-auto text-center active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#C88A12] shrink-0" />
                <span className="truncate">{data.config.hero.ctaPrimaryText || 'Conhecer Atendimento'}</span>
              </button>
            </div>

            {/* Quick Patient Consultation Card */}
            <div className="w-full mb-8 p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] shadow-sm text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C88A12] animate-pulse shrink-0"></span>
                  <span className="text-xs font-bold text-[#33251A] uppercase tracking-wider">
                    Já é paciente? Consulte seu horário
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('consultation')}
                  className="text-[11px] font-semibold text-[#B97808] hover:text-[#C88A12] hover:underline self-start sm:self-auto"
                >
                  Abrir tela de consulta →
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleaned = normalizeAccessCode(quickCode);
                  if (cleaned) {
                    navigateTo('consultation', cleaned);
                  } else {
                    navigateTo('consultation');
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-[#A89279] absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
                  <input
                    type="text"
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value)}
                    placeholder="Digite seu código (ex: HM-7K9W-4M2P)..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-[#33251A] placeholder:font-sans placeholder:text-[#A89279] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-[#C88A12] min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] text-xs sm:text-sm font-semibold shadow-2xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Consultar</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline text-[#C88A12]" />
                </button>
              </form>
            </div>

            {/* Geometric Stats & Ethics Row */}
            <div className="pt-6 sm:pt-8 border-t border-[#E8DACB] w-full grid grid-cols-3 gap-2 sm:gap-6">
              <div className="min-w-0">
                <h4 className="text-lg sm:text-2xl md:text-3xl font-serif text-[#33251A] truncate">{data.config.hero.stat1Number || '9+'}</h4>
                <p className="text-[9px] sm:text-xs uppercase tracking-wider text-[#6A5646] font-semibold mt-0.5 leading-tight">
                  {data.config.hero.stat1Label || 'Anos de Experiência'}
                </p>
              </div>
              <div className="min-w-0">
                <h4 className="text-lg sm:text-2xl md:text-3xl font-serif text-[#33251A] truncate">{data.config.hero.stat3Number || '2.5k+'}</h4>
                <p className="text-[9px] sm:text-xs uppercase tracking-wider text-[#6A5646] font-semibold mt-0.5 leading-tight">
                  {data.config.hero.stat3Label || 'Sessões Realizadas'}
                </p>
              </div>
              <div className="min-w-0">
                <h4 className="text-lg sm:text-2xl md:text-3xl font-serif text-[#33251A] truncate">CRP</h4>
                <p className="text-[9px] sm:text-xs uppercase tracking-wider text-[#6A5646] font-semibold mt-0.5 font-mono truncate">
                  {data.profile.crp}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High Quality Portrait & Ambient Frame with Organic Border */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end w-full max-w-full"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                scale: { duration: 0.2 }
              }}
              onClick={() => {
                const el = document.getElementById('sobre');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative w-full max-w-xs sm:max-w-md cursor-pointer select-none group"
              title="Toque para conhecer mais sobre a psicóloga"
            >
              {/* Background decorative organic frame */}
              <div className="absolute -inset-2 sm:-inset-3 rounded-[2.25rem] sm:rounded-[2.75rem] bg-gradient-to-tr from-[#F4DFC0] via-[#F8E7C5] to-[#EBF0E6] -rotate-2 transform transition-transform group-hover:rotate-0 group-active:rotate-0 -z-10 shadow-md" />

              {/* Photo Frame Container */}
              <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] bg-[#FFFDF8] p-2.5 sm:p-3 shadow-xl border border-[#E8DACB] transition-shadow duration-300 group-hover:shadow-2xl">
                <div className="relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[1.75rem] overflow-hidden bg-[#F4DFC0]">
                  <img
                    src={data.profile.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop'}
                    alt={data.profile.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 group-active:scale-100 transition-transform duration-700"
                    loading="eager"
                  />
                  
                  {/* Bottom subtle gradient on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#33251A]/60 via-transparent to-transparent opacity-80" />

                  {/* On-image Name badge */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFFDF8]/95 backdrop-blur-md border border-[#E8DACB] shadow-sm text-left transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <p className="font-serif font-bold text-[#33251A] text-sm sm:text-base leading-tight">
                      {data.profile.name}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#5A4535] font-medium mt-0.5 flex items-center justify-between">
                      <span>{data.profile.title} • <span className="font-mono">CRP {data.profile.crp}</span></span>
                      <span className="text-[10px] text-[#B97808] font-semibold underline sm:hidden">Ver mais</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Approach Badge */}
              {data.profile.showApproach !== false && data.profile.approach && (
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-2 left-2 sm:-top-4 sm:-left-6 bg-[#FFFDF8] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-lg border border-[#E8DACB] flex items-center gap-2 sm:gap-2.5 z-10"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#EBF0E6] text-[#858B72] flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#858B72]">
                      Abordagem Clínica
                    </p>
                    <p className="text-[11px] sm:text-xs font-semibold text-[#33251A] truncate max-w-[120px] sm:max-w-none">
                      {data.profile.approach.split('&')[0]}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
