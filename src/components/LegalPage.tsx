import React from 'react';
import { useSite } from '../context/SiteContext';
import { BackButton } from './BackButton';
import { ShieldCheck, Lock, FileText } from 'lucide-react';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { data } = useSite();

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Política de Privacidade & Proteção de Dados' : 'Termos de Uso do Site & Atendimento';
  const content = isPrivacy ? data.config.legal.privacyPolicy : data.config.legal.termsOfUse;

  return (
    <div className="pt-32 pb-24 bg-[#FAF5EB] min-h-screen relative overflow-hidden">
      <OrganicBlob className="top-12 left-[-100px] w-96 h-96 opacity-25" variant="gold" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        <div className="mb-8">
          <BackButton label="Voltar para a página inicial" fallbackRoute="home" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center">
            {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B97808]">
            Transparência & Conformidade Legal
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#33251A] tracking-tight mb-4">
          {title}
        </h1>

        <p className="text-xs text-[#858B72] mb-8">
          Última atualização: {new Date(data.lastUpdated || Date.now()).toLocaleDateString('pt-BR')} • {data.profile.name} (CRP {data.profile.crp})
        </p>

        <div className="p-8 rounded-3xl bg-[#FFFDF8] border border-[#E8DACB] shadow-xs leading-relaxed text-[#5A4535] whitespace-pre-line space-y-4">
          {content}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] flex items-center gap-3 text-xs text-[#33251A]">
          <Lock className="w-4 h-4 text-[#C88A12] shrink-0" />
          <span>
            Dúvidas sobre seus dados ou sigilo ético? Entre em contato pelo e-mail oficial: <strong>{data.config.contact.email}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
