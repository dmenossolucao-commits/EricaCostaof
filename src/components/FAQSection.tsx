import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { ChevronDown, ChevronUp, Search, MessageCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

export const FAQSection: React.FC = () => {
  const { data, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const [openId, setOpenId] = useState<string | null>(data.faq[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(data.faq.map((f) => f.category || 'Geral')));
    return ['Todas', ...cats];
  }, [data.faq]);

  const filteredFAQ = useMemo(() => {
    return data.faq
      .filter((item) => item.active)
      .filter((item) => {
        const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [data.faq, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#FAF5EB] relative overflow-hidden">
      <OrganicBlob className="top-10 left-[-60px] w-80 h-80 opacity-25" variant="gold" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Dúvidas Frequentes
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            Encontre respostas claras e transparentes sobre as sessões, sigilo e agendamento.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-[#A89279] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite sua dúvida (ex: primeira sessão, convênio, online...)"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] text-sm text-[#33251A] placeholder-[#A89279] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-transparent transition-all shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#33251A] text-[#FFFDF8] shadow-xs'
                    : 'bg-[#FFF8EA] text-[#6A5646] border border-[#E8DACB] hover:bg-[#F8E7C5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-[#FFFDF8] border-[#C88A12] shadow-sm'
                      : 'bg-[#FFFDF8] border-[#E8DACB] hover:border-[#C88A12]'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-[#33251A] leading-snug">
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30' : 'bg-[#FFF8EA] text-[#A89279]'
                      }`}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#5A4535] leading-relaxed border-t border-[#FAF5EB]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] text-center text-[#858B72]">
              <HelpCircle className="w-8 h-8 mx-auto text-[#A89279] mb-2" />
              <p>Nenhuma pergunta encontrada para sua busca.</p>
            </div>
          )}
        </div>

        {/* Still Have Doubts CTA */}
        <div className="mt-12 p-6 rounded-3xl bg-[#FFF8EA] border border-[#E8DACB] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif font-bold text-lg text-[#33251A]">
              Ainda tem alguma dúvida não listada aqui?
            </h4>
            <p className="text-xs sm:text-sm text-[#5A4535] mt-0.5">
              Estou à disposição para responder qualquer questão com total privacidade.
            </p>
          </div>
          <a
            href={getWhatsAppUrl(data.config.whatsapp.doubtMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shrink-0 bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#C88A12]" />
            <span>Tirar dúvidas pelo WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
