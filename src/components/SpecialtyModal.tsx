import React from 'react';
import { Specialty } from '../types';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { DynamicIcon } from '../utils/icons';
import { X, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpecialtyModalProps {
  specialty: Specialty | null;
  onClose: () => void;
}

export const SpecialtyModal: React.FC<SpecialtyModalProps> = ({ specialty, onClose }) => {
  const { data, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  if (!specialty) return null;

  const customMessage = `Olá, ${data.profile.name}! Gostaria de agendar uma consulta com foco em ${specialty.title}.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#33251A]/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-[#FFFDF8] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DACB] z-10 text-left overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#858B72] hover:text-[#33251A] hover:bg-[#FAF5EB] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0 shadow-2xs">
              <DynamicIcon name={specialty.iconName} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B97808]">
                Área de Atuação
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#33251A] mt-0.5 leading-snug">
                {specialty.title}
              </h3>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A5646] mb-2">
                Sobre este acompanhamento
              </h4>
              <p className="text-base text-[#5A4535] leading-relaxed">
                {specialty.fullDescription || specialty.shortDescription}
              </p>
            </div>

            {specialty.targetAudience && (
              <div className="p-4 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#B97808] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C88A12]" />
                  Para quem é indicado?
                </h4>
                <p className="text-sm text-[#5A4535]">
                  {specialty.targetAudience}
                </p>
              </div>
            )}

            {specialty.benefits && specialty.benefits.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A5646] mb-3">
                  Objetivos e Benefícios do Tratamento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {specialty.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF8] border border-[#E8DACB] text-xs sm:text-sm text-[#5A4535]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#858B72] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-[#E8DACB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="text-sm font-medium text-[#6A5646] hover:text-[#33251A] transition-colors order-2 sm:order-1"
            >
              Voltar ao site
            </button>
            
            <a
              href={getWhatsAppUrl(customMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm transition-all order-1 sm:order-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C88A12]" />
              <span>Agendar para {specialty.title.split('&')[0]}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
