import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Specialty } from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import { DynamicIcon } from '../utils/icons';
import { SpecialtyModal } from './SpecialtyModal';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

export const SpecialtiesSection: React.FC = () => {
  const { data, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  const activeSpecialties = data.specialties.filter((s) => s.active);

  return (
    <section id="especialidades" className="py-20 md:py-28 bg-[#FAF5EB] relative overflow-hidden">
      <OrganicBlob className="top-10 left-[-80px] w-96 h-96 opacity-30" variant="gold" />
      <OrganicBlob className="bottom-10 right-[-80px] w-96 h-96 opacity-25" variant="sage" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Áreas de Atuação
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            Especialidades Terapêuticas
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            Tratamentos individualizados baseados em evidências científicas para acolher seus desafios emocionais com eficácia e respeito.
          </p>
        </div>

        {/* Grid of Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {activeSpecialties.map((specialty) => (
            <div
              key={specialty.id}
              onClick={() => setSelectedSpecialty(specialty)}
              className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] hover:border-[#C88A12] active:scale-[0.99] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden touch-manipulation"
            >
              <div>
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/20 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#C88A12] group-hover:text-white transition-all shadow-2xs">
                  <DynamicIcon name={specialty.iconName} className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#33251A] mb-3 group-hover:text-[#C88A12] transition-colors leading-snug">
                  {specialty.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#5A4535] leading-relaxed line-clamp-3 mb-6">
                  {specialty.shortDescription}
                </p>
              </div>

              {/* Bottom interactive link */}
              <div className="pt-4 border-t border-[#E8DACB] flex items-center justify-between text-xs font-semibold text-[#B97808] group-hover:text-[#33251A]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C88A12]" />
                  Ver detalhes e benefícios
                </span>
                <div className="w-7 h-7 rounded-full bg-[#FFF8EA] group-hover:bg-[#C88A12]/15 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform text-[#C88A12]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Finding Specialty Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-xs">
          <div>
            <h4 className="font-serif text-xl font-bold text-[#33251A]">
              Não tem certeza de qual é a sua principal queixa?
            </h4>
            <p className="text-sm text-[#5A4535] mt-1 max-w-2xl">
              Não se preocupe. Na primeira conversa nós mapeamos juntos as suas necessidades e definimos o foco mais indicado para o seu momento.
            </p>
          </div>
          <a
            href={getWhatsAppUrl('Olá, Dra. Helena! Gostaria de conversar para entender qual tipo de acompanhamento é mais indicado para mim.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium shrink-0 bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] transition-all shadow-xs active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-[#C88A12]" />
            <span>Falar com a psicóloga</span>
          </a>
        </div>

      </div>

      {/* Specialty Detail Modal */}
      <SpecialtyModal
        specialty={selectedSpecialty}
        onClose={() => setSelectedSpecialty(null)}
      />
    </section>
  );
};
