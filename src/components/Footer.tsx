import React from 'react';
import { useSite } from '../context/SiteContext';
import { ShieldCheck, Mail, MapPin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, navigateTo } = useSite();
  const { profile, config } = data;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#241A12] text-[#EADCCF] pt-16 pb-12 border-t border-[#3A2D22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#3A2D22]">
          
          {/* Col 1: Identity & Ethics */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#C88A12] bg-[#2E2219] flex items-center justify-center font-serif font-bold text-sm text-[#C88A12]">
                {profile.name.charAt(0) === 'D' ? 'Ψ' : profile.name.charAt(0)}
              </div>
              <div>
                <span className="font-serif text-lg font-medium text-[#FAF5EB] block">
                  {profile.name}
                </span>
                <p className="text-xs text-[#C88A12]">
                  {profile.title} • <span className="font-mono text-[#FAF5EB]">CRP {profile.crp}</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-[#CBB8A6] leading-relaxed mb-6 max-w-md">
              {profile.shortBio}
            </p>

            <div className="p-3.5 rounded-2xl bg-[#2E2219] border border-[#3E2E22] text-xs text-[#EADCCF] flex items-start gap-2.5 max-w-md">
              <ShieldCheck className="w-4 h-4 text-[#C88A12] shrink-0 mt-0.5" />
              <span>
                {config.legal.cfpEthicsNotice || 'Atendimento pautado no Código de Ética Profissional do Psicólogo (CFP).'}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF5EB] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    setTimeout(() => {
                      document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Sobre mim
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    setTimeout(() => {
                      document.getElementById('especialidades')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Especialidades
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    setTimeout(() => {
                      document.getElementById('atendimento')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Modalidades de Atendimento
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('blog')}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Artigos & Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    setTimeout(() => {
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Perguntas Frequentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('consultation')}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors flex items-center gap-1.5"
                >
                  <span>Consultar Agendamento</span>
                  <span className="text-[10px] bg-[#2E2219] border border-[#3E2E22] px-1.5 py-0.5 rounded text-[#C88A12]">
                    Código
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-[#CBB8A6] hover:text-[#FAF5EB] transition-colors"
                >
                  Contato & Agendamento
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contacts & Emergency */}
          <div className="lg:col-span-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF5EB] mb-4">
              Atendimento & Contato
            </h4>

            <div className="space-y-3 text-sm text-[#CBB8A6] mb-6">
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#C88A12]" />
                <span>WhatsApp: {config.whatsapp.displayNumber || config.whatsapp.number}</span>
              </p>
              {config.contact.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C88A12]" />
                  <span>{config.contact.email}</span>
                </p>
              )}
              {Boolean(config.contact.showPhysicalAddress) && config.contact.address && (
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C88A12] shrink-0 mt-0.5" />
                  <span>{config.contact.address} - {config.contact.city}/{config.contact.state}</span>
                </p>
              )}
            </div>

            {/* Emergency Hotlines */}
            <div className="p-3.5 rounded-2xl bg-[#2E2219] border border-[#423225] text-xs text-[#F2CCA5]">
              <p className="font-bold mb-1 text-[#FAF5EB]">Precisa de ajuda imediata?</p>
              <p className="text-[11px] text-[#D8B490]">
                Ligue para o <strong className="text-[#FAF5EB]">CVV no 188</strong> (Centro de Valorização da Vida). Atendimento gratuito e 24h. Em urgências graves, contate o SAMU 192.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89584]">
          <div>
            <p>© {currentYear} {profile.name}. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-[#FAF5EB] transition-colors"
            >
              Política de Privacidade
            </button>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-[#FAF5EB] transition-colors"
            >
              Termos de Uso
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
