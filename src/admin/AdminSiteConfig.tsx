import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { SiteConfig, ThemeColor } from '../types';
import { THEME_CONFIGS } from '../utils/theme';
import {
  Save,
  Palette,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  LayoutTemplate,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminSiteConfig: React.FC = () => {
  const { data, updateConfig } = useSite();
  const [configState, setConfigState] = useState<SiteConfig>(data.config);

  useEffect(() => {
    if (data?.config) {
      setConfigState(data.config);
    }
  }, [data.config]);

  const themeKeys: ThemeColor[] = ['sage', 'sand', 'terracotta', 'lavender', 'ocean'];

  const handleHeroChange = (field: string, value: string) => {
    setConfigState((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleWhatsAppChange = (field: string, value: any) => {
    setConfigState((prev) => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, [field]: value },
    }));
  };

  const handleContactChange = (field: string, value: any) => {
    setConfigState((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(configState);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Identidade Visual & Configurações do Site
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Escolha paletas de cores, configure os dados do WhatsApp e personalize textos principais.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Configurações</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Theme Palette Selector */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#4E6B58]" />
            <span>Paleta de Cores do Site (Identidade Visual)</span>
          </h3>
          <p className="text-xs text-[#718096]">
            Alterne o tom visual do site com 1 clique. Todas as seções, botões e badges se adaptam harmoniosamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {themeKeys.map((key) => {
              const theme = THEME_CONFIGS[key];
              const isSelected = configState.themeColor === key;
              return (
                <div
                  key={key}
                  onClick={() => setConfigState((prev) => ({ ...prev, themeColor: key }))}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center relative ${
                    isSelected ? 'border-[#4E6B58] bg-[#FAF8F5] shadow-xs ring-2 ring-[#4E6B58]/20' : 'border-[#EAE6DF] hover:border-gray-300 bg-white'
                  }`}
                >
                  {/* Swatch circles */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-5 h-5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: theme.previewColor }} />
                  </div>
                  <span className="font-serif font-bold text-xs text-[#1F2923] mb-0.5">{theme.name}</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">{theme.description}</span>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#4E6B58] text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. WhatsApp Configuration */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span>Configurações do WhatsApp Oficial</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Número com DDD (somente números) *
              </label>
              <input
                type="text"
                required
                value={configState.whatsapp.number}
                onChange={(e) => handleWhatsAppChange('number', e.target.value)}
                placeholder="11999999999"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm font-mono text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Número Formatado para Exibição
              </label>
              <input
                type="text"
                value={configState.whatsapp.displayNumber}
                onChange={(e) => handleWhatsAppChange('displayNumber', e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Texto do Botão Flutuante
              </label>
              <input
                type="text"
                value={configState.whatsapp.floatingButtonTooltip}
                onChange={(e) => handleWhatsAppChange('floatingButtonTooltip', e.target.value)}
                placeholder="Fale comigo no WhatsApp"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Status de Atendimento
              </label>
              <input
                type="text"
                value={configState.whatsapp.onlineStatusText}
                onChange={(e) => handleWhatsAppChange('onlineStatusText', e.target.value)}
                placeholder="Online para agendamentos"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Mensagem Padrão para Agendamento de Consulta
            </label>
            <textarea
              rows={2}
              value={configState.whatsapp.appointmentMessage}
              onChange={(e) => handleWhatsAppChange('appointmentMessage', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Mensagem Padrão para Tirar Dúvidas
            </label>
            <textarea
              rows={2}
              value={configState.whatsapp.doubtMessage}
              onChange={(e) => handleWhatsAppChange('doubtMessage', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F2923] cursor-pointer">
              <input
                type="checkbox"
                checked={configState.whatsapp.showFloatingButton}
                onChange={(e) => handleWhatsAppChange('showFloatingButton', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir botão flutuante do WhatsApp no canto da tela do site</span>
            </label>
          </div>
        </div>

        {/* 3. Hero Section Texts */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#4E6B58]" />
            <span>Textos da Seção Inicial (Hero)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Selo Superior (Badge)
            </label>
            <input
              type="text"
              value={configState.hero.badgeText}
              onChange={(e) => handleHeroChange('badgeText', e.target.value)}
              placeholder="Ex: Acolhimento psicológico humanizado"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Título de Destaque
            </label>
            <input
              type="text"
              value={configState.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              placeholder="Ex: Um espaço seguro para acolher sua história..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm font-serif font-bold text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Subtítulo Acolhedor
            </label>
            <textarea
              rows={3}
              value={configState.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              placeholder="Texto convidativo do hero..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Texto do Botão Principal
              </label>
              <input
                type="text"
                value={configState.hero.ctaPrimaryText}
                onChange={(e) => handleHeroChange('ctaPrimaryText', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Texto do Botão Secundário
              </label>
              <input
                type="text"
                value={configState.hero.ctaSecondaryText}
                onChange={(e) => handleHeroChange('ctaSecondaryText', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>
        </div>

        {/* 4. General Contacts & Address */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4E6B58]" />
            <span>Endereço, Horários e Contatos Oficiais</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                E-mail para Contato
              </label>
              <input
                type="email"
                value={configState.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="contato@psicologa.com.br"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Horário de Atendimento
              </label>
              <input
                type="text"
                value={configState.contact.businessHours}
                onChange={(e) => handleContactChange('businessHours', e.target.value)}
                placeholder="Segunda a Sexta, das 08h às 20h"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          {/* Controle de Visibilidade do Endereço Físico */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                  configState.contact.showPhysicalAddress
                    ? 'bg-[#EFF3F0] text-[#4E6B58]'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {configState.contact.showPhysicalAddress ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm sm:text-base text-[#1F2923]">
                    Exibir endereço físico no site público
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                      configState.contact.showPhysicalAddress
                        ? 'bg-[#EFF3F0] text-[#4E6B58] border border-[#4E6B58]/20'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {configState.contact.showPhysicalAddress ? 'ON • Visível' : 'OFF • Oculto'}
                  </span>
                </div>
                <p className="text-xs text-[#718096] mt-1 max-w-xl leading-relaxed">
                  {configState.contact.showPhysicalAddress
                    ? 'O endereço físico, bairro, cidade/estado e o link do Google Maps do consultório estão visíveis no site público.'
                    : 'O endereço físico, bairro, cidade/estado e o link do Google Maps do consultório estão ocultos no site público (ideal para atendimento 100% online). Os dados continuam salvos abaixo para uso futuro.'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-center">
              <input
                type="checkbox"
                checked={Boolean(configState.contact.showPhysicalAddress)}
                onChange={(e) => handleContactChange('showPhysicalAddress', e.target.checked)}
                className="sr-only peer"
                aria-label="Exibir endereço físico no site público"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-[#4E6B58]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#4E6B58]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Endereço Físico do Consultório (se houver presencial)
            </label>
            <input
              type="text"
              value={configState.contact.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="Av. Paulista, 1000, Conjunto 502"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Bairro
              </label>
              <input
                type="text"
                value={configState.contact.neighborhood}
                onChange={(e) => handleContactChange('neighborhood', e.target.value)}
                placeholder="Bela Vista"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                value={configState.contact.city}
                onChange={(e) => handleContactChange('city', e.target.value)}
                placeholder="São Paulo"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Estado
              </label>
              <input
                type="text"
                value={configState.contact.state ?? ''}
                onChange={(e) => handleContactChange('state', e.target.value)}
                placeholder="Ex: SP, RJ, MG"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Link de Localização no Google Maps
            </label>
            <input
              type="text"
              value={configState.contact.googleMapsUrl || ''}
              onChange={(e) => handleContactChange('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Aviso de Urgência & Crise
            </label>
            <input
              type="text"
              value={configState.contact.emergencyNotice}
              onChange={(e) => handleContactChange('emergencyNotice', e.target.value)}
              placeholder="Em situações de crise emergencial..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-base font-semibold shadow-md transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>

      </form>
    </div>
  );
};
