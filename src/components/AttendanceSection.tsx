import React from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { Laptop, Building, Clock, MapPin, Globe, CheckCircle2, ShieldCheck, FileText, MessageCircle, Search, ArrowRight } from 'lucide-react';
import { MinimalLeaf } from './OrganicDecorations';

export const AttendanceSection: React.FC = () => {
  const { data, getWhatsAppUrl, navigateTo } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const { attendance, config } = data;

  return (
    <section id="atendimento" className="py-20 md:py-28 bg-[#FFFDF8] border-t border-b border-[#E8DACB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Modalidades
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            {attendance.introTitle || 'Como funciona o atendimento'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            {attendance.introDescription}
          </p>
        </div>

        {/* Comparison Cards: Online & Presencial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: Atendimento Online */}
          {attendance.online.active && (
            <div
              className="p-8 sm:p-10 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] shadow-xs flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Top Header with Icon & Mode Tag */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFDF8] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shadow-2xs shrink-0">
                  <Laptop className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FFFDF8] text-[#B97808] px-3 py-1 rounded-full border border-[#E8DACB] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                  Todo o Brasil & Exterior
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#33251A] mb-2">
                  {attendance.online.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-[#6A5646] font-medium mb-4">
                  <Clock className="w-4 h-4 text-[#C88A12]" />
                  <span>Duração: {attendance.online.duration}</span>
                </div>

                <p className="text-base text-[#5A4535] leading-relaxed mb-6">
                  {attendance.online.description}
                </p>

                <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E8DACB] mb-6 text-xs text-[#5A4535]">
                  <p className="font-semibold text-[#33251A] mb-1">Alcance:</p>
                  <p>{attendance.online.reach}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#B97808]">
                    Vantagens da terapia online:
                  </p>
                  {attendance.online.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-[#33251A]">
                      <CheckCircle2 className="w-4 h-4 text-[#858B72] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8DACB]">
                <a
                  href={getWhatsAppUrl('Olá, Dra. Helena! Gostaria de agendar um atendimento na modalidade ONLINE.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-medium bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-[#C88A12]" />
                  <span>Agendar Atendimento Online</span>
                </a>
              </div>
            </div>
          )}

          {/* Card 2: Atendimento Presencial */}
          {attendance.inPerson.active && (
            <div
              className="p-8 sm:p-10 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] shadow-xs flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Top Header with Icon & Location Tag */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFDF8] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shadow-2xs shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FFFDF8] text-[#B97808] px-3 py-1 rounded-full border border-[#E8DACB] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  Consultório Privado
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#33251A] mb-2">
                  {attendance.inPerson.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-[#6A5646] font-medium mb-4">
                  <Clock className="w-4 h-4 text-[#C88A12]" />
                  <span>Duração: {attendance.inPerson.duration}</span>
                </div>

                <p className="text-base text-[#5A4535] leading-relaxed mb-6">
                  {attendance.inPerson.description}
                </p>

                {Boolean(config.contact.showPhysicalAddress) && (attendance.inPerson.address || config.contact.address) && (
                  <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E8DACB] mb-6 text-xs text-[#5A4535]">
                    <p className="font-semibold text-[#33251A] mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C88A12]" />
                      Localização do Consultório:
                    </p>
                    <p className="text-sm font-medium text-[#33251A] mt-1">
                      {attendance.inPerson.address || config.contact.address}
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#B97808]">
                    Diferenciais do consultório:
                  </p>
                  {attendance.inPerson.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-[#33251A]">
                      <CheckCircle2 className="w-4 h-4 text-[#858B72] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8DACB]">
                <a
                  href={getWhatsAppUrl('Olá, Dra. Helena! Gostaria de agendar um atendimento na modalidade PRESENCIAL no consultório.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-medium bg-transparent hover:bg-[#F8E7C5] text-[#33251A] border border-[#C88A12] transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-[#C88A12]" />
                  <span>Agendar Atendimento Presencial</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Ethics & Reimbursement Info Banner */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] shadow-2xs flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FFFDF8] text-[#C88A12] border border-[#E8DACB] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#33251A] mb-1">
                Reembolso por Convênio Médico
              </h4>
              <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                {attendance.reimbursementNotice}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] shadow-2xs flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FFFDF8] text-[#C88A12] border border-[#E8DACB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#33251A] mb-1">
                Tabela Ética & Valores
              </h4>
              <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                {attendance.pricingNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Existing Patient Consultation Banner */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#FFF8EA] border border-[#C88A12]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FFFDF8] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0 shadow-2xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#33251A]">
                Já possui uma sessão agendada?
              </h4>
              <p className="text-xs text-[#5A4535]">
                Consulte a data, o horário e as orientações da sua consulta usando o seu código de acesso.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('consultation')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shrink-0 transition-transform active:scale-95"
          >
            <span>Consultar Minha Sessão</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C88A12]" />
          </button>
        </div>

      </div>
    </section>
  );
};
