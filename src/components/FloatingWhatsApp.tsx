import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { MessageCircle, X, Send, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingWhatsApp: React.FC = () => {
  const { data, getWhatsAppUrl, currentRoute, navigateTo } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [hasPrompted, setHasPrompted] = useState(false);

  const { whatsapp } = data.config;

  // Don't show floating button if in admin route or disabled in settings
  if (currentRoute === 'admin' || !whatsapp.showFloatingButton) {
    return null;
  }

  // Show a gentle greeting tooltip after 4 seconds for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getWhatsAppUrl(customMsg || whatsapp.defaultMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Chat Box Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[360px] bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#E8DACB] overflow-hidden text-left"
          >
            {/* Header */}
            <div className="bg-[#33251A] text-[#FFFDF8] p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="relative shrink-0">
                  <img
                    src={data.profile.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop'}
                    alt={data.profile.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#C88A12]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#4ADE80] border-2 border-[#33251A] rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-sm leading-tight text-[#FFFDF8] truncate">
                    {data.profile.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#C88A12] flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shrink-0"></span>
                    {whatsapp.onlineStatusText || 'Online para agendamentos'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bubble Message */}
            <div className="p-3.5 sm:p-4 bg-[#FAF5EB] space-y-3">
              <div className="p-3 sm:p-3.5 bg-[#FFFDF8] rounded-2xl rounded-tl-xs shadow-2xs border border-[#E8DACB] text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                <p className="font-medium text-[#33251A] mb-1">
                  Olá! Seja muito bem-vindo(a). 🌿
                </p>
                <p>
                  Como posso te ajudar hoje? Você pode tirar dúvidas sobre horários, valores ou agendar sua primeira consulta.
                </p>
                <span className="block text-[10px] text-[#858B72] text-right mt-1">
                  Agora mesmo
                </span>
              </div>

              {/* Quick Prompt Options */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigateTo('consultation');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#FFF8EA] hover:bg-[#F8E7C5] border border-[#C88A12]/30 text-xs font-semibold text-[#33251A] transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#C88A12] shrink-0" />
                    <span>🔍 Já sou paciente (ver minha consulta)</span>
                  </span>
                  <span className="text-[#B97808] text-xs shrink-0 font-bold">Acessar</span>
                </button>

                <button
                  onClick={() => {
                    window.open(getWhatsAppUrl(whatsapp.appointmentMessage), '_blank', 'noopener,noreferrer');
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#FFFDF8] hover:bg-[#FFF8EA] border border-[#E8DACB] text-xs font-medium text-[#5A4535] transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">📅 Quero agendar uma consulta</span>
                  <span className="text-[#C88A12] text-xs shrink-0">→</span>
                </button>

                <button
                  onClick={() => {
                    window.open(getWhatsAppUrl(whatsapp.doubtMessage), '_blank', 'noopener,noreferrer');
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#FFFDF8] hover:bg-[#FFF8EA] border border-[#E8DACB] text-xs font-medium text-[#5A4535] transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">💬 Tenho dúvidas sobre os atendimentos</span>
                  <span className="text-[#C88A12] text-xs shrink-0">→</span>
                </button>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-[#FFFDF8] border-t border-[#E8DACB] flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-xs sm:text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] min-w-0"
              />
              <button
                type="submit"
                className="p-2 sm:p-2.5 rounded-xl bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] transition-colors shadow-xs shrink-0"
                title="Enviar pelo WhatsApp"
              >
                <Send className="w-4 h-4 text-[#C88A12]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="relative flex items-center gap-3">
        {/* Tooltip prompt when closed */}
        {!isOpen && hasPrompted && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2 bg-[#FFFDF8] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-[#E8DACB] text-xs font-medium text-[#33251A]"
          >
            <span className="w-2 h-2 rounded-full bg-[#C88A12] animate-pulse shrink-0"></span>
            <span className="truncate max-w-[200px]">{whatsapp.floatingButtonTooltip || 'Fale comigo no WhatsApp'}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="text-[#858B72] hover:text-[#33251A] ml-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none border-2 border-[#C88A12]"
          aria-label="Abrir conversa no WhatsApp"
        >
          {/* Animated ping ring */}
          <span className="absolute -inset-1 rounded-full bg-[#C88A12]/30 animate-ping opacity-75 pointer-events-none" />
          
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#C88A12]" />

          {/* Unread badge dot */}
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#C88A12] border-2 border-white rounded-full"></span>
        </button>
      </div>

    </div>
  );
};
