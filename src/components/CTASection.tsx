import React from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { MessageCircle, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const CTASection: React.FC = () => {
  const { data, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  return (
    <section className="py-20 md:py-24 bg-white border-t border-b border-[#E5E1DA] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="p-8 sm:p-12 md:p-16 rounded-3xl bg-[#F7F5F2] border border-[#E5E1DA] shadow-xs text-center relative overflow-hidden"
        >
          {/* Top Heart Icon */}
          <div className="w-14 h-14 rounded-full bg-white text-[#7C8370] border border-[#E5E1DA] flex items-center justify-center mx-auto mb-6 shadow-2xs">
            <Heart className="w-6 h-6 fill-current" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#2D3436] mb-6 max-w-2xl mx-auto leading-tight">
            Você não precisa enfrentar tudo sozinho(a).
          </h2>

          <p className="text-base sm:text-xl text-[#5D5D5D] font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            Dar o primeiro passo em direção ao cuidado com a sua saúde mental é um ato de profundo respeito pela sua história. Estou aqui para caminhar ao seu lado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href={getWhatsAppUrl(data.config.whatsapp.appointmentMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-xl sm:rounded-full text-base sm:text-lg font-medium ${theme.classes.buttonPrimary} group shadow-lg shadow-[#7C8370]/15 active:scale-98 transition-transform text-center`}
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Falar pelo WhatsApp</span>
            </a>
          </div>

          {/* Ethical Sigilo Badge */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-[#5D5D5D]">
            <ShieldCheck className="w-4 h-4 text-[#7C8370]" />
            <span>Ambiente seguro • Sigilo ético profissional 100% garantido</span>
          </div>
        </div>
      </div>
    </section>
  );
};
