import React from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { DynamicIcon } from '../utils/icons';
import { MessageCircle } from 'lucide-react';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

export const HowItWorksSection: React.FC = () => {
  const { data, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const { steps } = data;

  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-[#FAF5EB] relative overflow-hidden">
      <OrganicBlob className="top-12 right-[-60px] w-80 h-80 opacity-30" variant="gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Passo a Passo
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            Como funciona a terapia
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            Entenda cada etapa da jornada terapêutica, desde o primeiro "olá" até o alcance da sua autonomia emocional.
          </p>
        </div>

        {/* Steps Journey */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="relative p-6 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] hover:border-[#C88A12] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left group touch-manipulation"
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-serif font-bold text-[#C88A12]">
                  0{step.stepNumber || idx + 1}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C88A12] group-hover:text-white transition-all shadow-2xs">
                  <DynamicIcon name={step.iconName} className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#33251A] mb-2 leading-snug group-hover:text-[#C88A12] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#E8DACB] flex items-center gap-1 text-[11px] font-semibold text-[#858B72]">
                <span>Etapa {step.stepNumber || idx + 1} de {steps.length}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Trigger */}
        <div className="mt-14 text-center">
          <a
            href={getWhatsAppUrl('Olá, Dra. Helena! Gostaria de dar o primeiro passo e agendar uma conversa inicial.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-medium bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-[#C88A12]" />
            <span className="truncate">Começar o processo pelo WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
