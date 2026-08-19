import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Send,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

export const ContactSection: React.FC = () => {
  const { data, getWhatsAppUrl, submitContactMessage } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;
  const { contact } = data.config;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Agendamento de consulta',
    message: '',
    preferredContact: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    submitContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      preferredContact: formData.preferredContact,
    });

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Agendamento de consulta',
      message: '',
      preferredContact: 'whatsapp',
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contato" className="py-20 md:py-28 bg-[#FAF5EB] border-t border-[#E8DACB] relative overflow-hidden">
      <OrganicBlob className="bottom-10 left-[-80px] w-96 h-96 opacity-25" variant="gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              Canais de Atendimento
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            Entre em contato
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            Estou à disposição para acolher suas dúvidas e encontrar o melhor horário para sua sessão.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Contact Cards & Physical Address */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            
            {/* WhatsApp Priority Card */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shadow-2xs">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B97808]">
                    Canal Principal de Contato
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#33251A]">WhatsApp Oficial</h3>
                </div>
              </div>

              <p className="text-sm text-[#5A4535] mb-4 leading-relaxed">
                A forma mais ágil e direta para consultar disponibilidade de horários e valores.
              </p>

              <a
                href={getWhatsAppUrl(data.config.whatsapp.defaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-xs transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#C88A12]" />
                <span>Conversar no {data.config.whatsapp.displayNumber || data.config.whatsapp.number}</span>
              </a>
            </div>

            {/* Direct Info List */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] shadow-xs space-y-4">
              
              {/* Email */}
              {contact.email && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8EA] text-[#C88A12] flex items-center justify-center shrink-0 border border-[#E8DACB]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#858B72]">E-mail para informações</p>
                    <a href={`mailto:${contact.email}`} className="text-sm font-medium text-[#33251A] hover:text-[#C88A12] transition-colors">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {contact.businessHours && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8EA] text-[#C88A12] flex items-center justify-center shrink-0 border border-[#E8DACB]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#858B72]">Horário de Atendimento</p>
                    <p className="text-sm font-medium text-[#33251A]">{contact.businessHours}</p>
                  </div>
                </div>
              )}

              {/* Physical Address */}
              {contact.address && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8EA] text-[#C88A12] flex items-center justify-center shrink-0 border border-[#E8DACB]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#858B72]">Consultório Presencial</p>
                    <p className="text-sm font-medium text-[#33251A]">{contact.address}</p>
                    <p className="text-xs text-[#5A4535]">{contact.neighborhood} • {contact.city} - {contact.state}</p>
                    {contact.googleMapsUrl && (
                      <a
                        href={contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B97808] mt-1 hover:underline"
                      >
                        <span>Abrir no Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(data.profile.socialLinks?.instagram || data.profile.socialLinks?.linkedin) && (
                <div className="pt-3 border-t border-[#E8DACB] flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#858B72]">Redes profissionais:</span>
                  {data.profile.socialLinks.instagram && (
                    <a
                      href={data.profile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#FFF8EA] text-[#C88A12] border border-[#E8DACB] hover:bg-[#F8E7C5] transition-colors"
                      title="Instagram Profissional"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {data.profile.socialLinks.linkedin && (
                    <a
                      href={data.profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#FFF8EA] text-[#C88A12] border border-[#E8DACB] hover:bg-[#F8E7C5] transition-colors"
                      title="LinkedIn Profissional"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Emergency Notice */}
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] text-xs text-[#5A4535] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#858B72] mt-0.5" />
              <div>
                <span className="font-bold text-[#33251A]">Aviso de Urgência: </span>
                <span>{contact.emergencyNotice}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Safe Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] shadow-xs text-left">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-[#33251A]">
                  Envie uma mensagem
                </h3>
                <p className="text-xs sm:text-sm text-[#5A4535] mt-1">
                  Preencha os campos abaixo para solicitar informações. Não envie relatos clínicos confidenciais por formulário público.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#858B72] mx-auto mb-3" />
                  <h4 className="font-serif text-xl font-bold text-[#33251A] mb-1">
                    Mensagem recebida com sucesso!
                  </h4>
                  <p className="text-sm text-[#5A4535]">
                    Entraremos em contato através do canal de sua preferência em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Como gostaria de ser chamado(a)?"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                        WhatsApp ou Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(DDD) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                        Seu E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seuemail@exemplo.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                        Assunto Principal
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-transparent transition-all"
                      >
                        <option value="Agendamento de consulta online">Agendamento de consulta online</option>
                        <option value="Agendamento de consulta presencial">Agendamento de consulta presencial</option>
                        <option value="Dúvidas sobre valores e horários">Dúvidas sobre valores e horários</option>
                        <option value="Reembolso de convênio">Reembolso de convênio</option>
                        <option value="Outro assunto">Outro assunto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                      Mensagem *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Olá! Gostaria de consultar a disponibilidade de horários para a modalidade..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                      Preferência de retorno:
                    </label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-2 text-xs text-[#5A4535] cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="whatsapp"
                          checked={formData.preferredContact === 'whatsapp'}
                          onChange={() => setFormData({ ...formData, preferredContact: 'whatsapp' })}
                          className="text-[#C88A12] focus:ring-[#C88A12]"
                        />
                        <span>Pelo WhatsApp</span>
                      </label>

                      <label className="inline-flex items-center gap-2 text-xs text-[#5A4535] cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={() => setFormData({ ...formData, preferredContact: 'email' })}
                          className="text-[#C88A12] focus:ring-[#C88A12]"
                        />
                        <span>Por E-mail</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-full text-base font-medium flex items-center justify-center gap-2 bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-sm transition-all active:scale-95"
                    >
                      <Send className="w-4 h-4 text-[#C88A12]" />
                      <span>Enviar Mensagem</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#858B72] text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#858B72]" />
                    <span>Seus dados são confidenciais e nunca serão compartilhados.</span>
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
