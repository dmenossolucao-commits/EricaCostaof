import React from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { MinimalLeaf } from './OrganicDecorations';

export const TestimonialsSection: React.FC = () => {
  const { data } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const activeTestimonials = data.testimonials.filter((t) => t.active);

  if (activeTestimonials.length === 0) return null;

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-[#FFFDF8] border-t border-[#E8DACB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Experiências & Acolhimento
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            Relatos de quem já deu esse passo
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            O processo terapêutico é único para cada pessoa. Veja como a psicoterapia transforma vidas.
          </p>

          {/* Ethics Disclaimer Notice */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#6A5646] bg-[#FFF8EA] px-3.5 py-1.5 rounded-full border border-[#E8DACB]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#858B72]" />
            <span>Nomes preservados em estrito cumprimento ao sigilo ético profissional do CFP</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {activeTestimonials.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-7 sm:p-8 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] hover:border-[#C88A12] shadow-xs flex flex-col justify-between text-left relative hover:shadow-md transition-all"
            >
              <Quote className="w-7 h-7 text-[#C88A12]/40 mb-4" />

              <p className="text-base text-[#33251A] italic leading-relaxed mb-6 flex-1">
                "{item.quote}"
              </p>

              <div className="pt-4 border-t border-[#E8DACB] flex items-center justify-between">
                <div>
                  <p className="font-serif font-bold text-sm text-[#33251A]">{item.patientName}</p>
                  <p className="text-xs text-[#6A5646]">{item.roleOrContext}</p>
                </div>
                <div className="flex gap-0.5 text-[#C88A12]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
