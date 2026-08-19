import React from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { GraduationCap, Award, BookOpen, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { MinimalLeaf } from './OrganicDecorations';

export const AboutSection: React.FC = () => {
  const { data, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const { profile } = data;

  return (
    <section id="sobre" className="py-20 md:py-28 bg-[#FFFDF8] border-t border-b border-[#E8DACB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Apresentação Profissional
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            Sobre mim
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            Conheça minha trajetória clínica, formação acadêmica e compromisso com o seu desenvolvimento emocional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Photo Card & Verification */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-28">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-xs bg-[#FFF8EA] p-3 border border-[#E8DACB]">
                <img
                  src={profile.secondaryPhoto || profile.photo || 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=900&auto=format&fit=crop'}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=900&auto=format&fit=crop';
                  }}
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>

              {/* Official CRP verification block */}
              {profile.showCrpBadge !== false && (
                <div className="mt-4 w-full p-4 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#6A5646] truncate">Conselho Regional de Psicologia</p>
                      <p className="text-sm font-bold font-mono text-[#33251A] truncate">
                        CRP {profile.crp} ({profile.crpRegion || 'SP'})
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-[#EBF0E6] text-[#858B72] px-2.5 py-1 rounded-full flex items-center gap-1 self-start sm:self-auto shrink-0 border border-[#858B72]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Ativa & Regular
                  </span>
                </div>
              )}

              {/* Approach Tag Box */}
              {profile.showApproach !== false && profile.approach && (
                <div className="mt-3 w-full p-4 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#B97808]">
                    Linha de Abordagem Terapêutica
                  </p>
                  <p className="text-sm font-medium text-[#33251A] mt-1">
                    {profile.approach}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bio, Education, Experiences */}
          <div className="lg:col-span-7 flex flex-col gap-8 text-left">
            
            {/* Bio Introduction */}
            {profile.showBio !== false && (
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#33251A] mb-4">
                  Olá, eu sou a {profile.name}
                </h3>
                {profile.shortBio && (
                  <p className="text-lg text-[#B97808] font-medium leading-snug mb-4">
                    {profile.shortBio}
                  </p>
                )}
                {profile.bio && (
                  <div className="text-base text-[#5A4535] leading-relaxed space-y-4">
                    {profile.bio.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Academic Education */}
            {profile.showEducation !== false && profile.education && profile.education.filter(e => e.visible !== false).length > 0 && (
              <div className="pt-6 border-t border-[#E8DACB]">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-[#C88A12]" />
                  <h4 className="font-serif text-xl font-bold text-[#33251A]">Formação Acadêmica</h4>
                </div>

                <div className="space-y-3">
                  {profile.education
                    .filter((edu) => edu.visible !== false)
                    .map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        className="p-4 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] shadow-2xs hover:border-[#C88A12] transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-sm sm:text-base text-[#33251A]">
                            {edu.degree}
                          </p>
                          {edu.year && (
                            <span className="text-xs font-mono bg-[#FFFDF8] px-2 py-0.5 rounded text-[#6A5646] border border-[#E8DACB]">
                              {edu.year}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-[#6A5646] mt-1 flex items-center gap-1.5">
                          <span>{edu.institution}</span>
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Specialization Areas */}
            {profile.showSpecializations !== false && profile.specializations && profile.specializations.filter(s => typeof s === 'string' || s.visible !== false).length > 0 && (
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#C88A12]" />
                  <h4 className="font-serif text-xl font-bold text-[#33251A]">Especializações & Práticas Clínicas</h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.specializations
                    .filter((spec) => typeof spec === 'string' || spec.visible !== false)
                    .map((spec, idx) => {
                      const title = typeof spec === 'string' ? spec : spec.title;
                      return (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-xs sm:text-sm font-medium text-[#33251A] shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#858B72]" />
                          <span>{title}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Professional Experiences */}
            {profile.showExperiences !== false && profile.experiences && profile.experiences.filter(e => typeof e === 'string' || e.visible !== false).length > 0 && (
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-[#C88A12]" />
                  <h4 className="font-serif text-xl font-bold text-[#33251A]">Experiência Profissional</h4>
                </div>
                <ul className="space-y-2">
                  {profile.experiences
                    .filter((exp) => typeof exp === 'string' || exp.visible !== false)
                    .map((exp, idx) => {
                      const text = typeof exp === 'string' ? exp : (exp.institution ? `${exp.title} - ${exp.institution}${exp.period ? ` (${exp.period})` : ''}` : exp.title);
                      return (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-[#5A4535]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C88A12] mt-2 shrink-0"></span>
                          <span>{text}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            {/* Bottom Mini CTA */}
            <div className="pt-6 mt-2 border-t border-[#E8DACB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFF8EA] p-5 rounded-2xl border border-[#E8DACB]">
              <div className="text-left">
                <p className="font-serif font-bold text-base text-[#33251A]">
                  Quer saber mais sobre o método de atendimento?
                </p>
                <p className="text-xs text-[#6A5646]">
                  Tire dúvidas diretamente comigo pelo WhatsApp.
                </p>
              </div>
              <a
                href={getWhatsAppUrl('Olá, Dra. Helena! Li sua apresentação e gostaria de tirar uma dúvida sobre os atendimentos.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-full text-sm font-medium shrink-0 bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] active:scale-95 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#C88A12]" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
