import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { BackButton } from './BackButton';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Video,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Info,
  Building,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicAppointmentView, AppointmentStatus } from '../types';
import { normalizeAccessCode } from '../lib/firebase';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

const RATE_LIMIT_KEY = 'psico_public_lookup_cooldown_v1';
const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 60;

export const PublicConsultationPage: React.FC = () => {
  const { data, routeParams, lookupConsultation, getWhatsAppUrl } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  const [searchCode, setSearchCode] = useState<string>(routeParams || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PublicAppointmentView | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [cooldownTime, setCooldownTime] = useState<number>(0);

  // Initialize and tick rate limiting countdown
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(RATE_LIMIT_KEY);
      if (stored) {
        const lockUntil = parseInt(stored, 10);
        const now = Date.now();
        if (lockUntil > now) {
          setCooldownTime(Math.ceil((lockUntil - now) / 1000));
        } else {
          sessionStorage.removeItem(RATE_LIMIT_KEY);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (cooldownTime <= 0) return;
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          try {
            sessionStorage.removeItem(RATE_LIMIT_KEY);
          } catch {}
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // If code is present in URL params on load, trigger search automatically
  useEffect(() => {
    if (routeParams && routeParams.trim().length >= 4 && cooldownTime <= 0) {
      setSearchCode(routeParams.toUpperCase());
      handleLookup(routeParams.toUpperCase());
    }
  }, [routeParams]);

  const handleLookup = async (codeToSearch: string) => {
    if (cooldownTime > 0) {
      setErrorMessage(`Muitas tentativas consecutivas. Aguarde ${cooldownTime} segundos para tentar novamente.`);
      return;
    }

    const clean = normalizeAccessCode(codeToSearch);
    if (!clean || clean.length < 3) {
      setErrorMessage('Por favor, informe um código de consulta válido (ex: HM-7K9W-4M2P).');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const found = await lookupConsultation(clean);
      if (found) {
        setResult(found);
        setErrorMessage(null);
        setFailedAttempts(0);
        try {
          sessionStorage.removeItem(RATE_LIMIT_KEY);
        } catch {}
      } else {
        setResult(null);
        const nextFail = failedAttempts + 1;
        setFailedAttempts(nextFail);
        
        if (nextFail >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + COOLDOWN_SECONDS * 1000;
          try {
            sessionStorage.setItem(RATE_LIMIT_KEY, lockTime.toString());
          } catch {}
          setCooldownTime(COOLDOWN_SECONDS);
          setErrorMessage(
            `Limite de tentativas atingido. Por segurança, aguarde ${COOLDOWN_SECONDS} segundos para tentar novamente.`
          );
        } else {
          setErrorMessage(
            'Código inválido ou não encontrado. Verifique se digitou o código exatamente como enviado pela psicóloga em seu WhatsApp.'
          );
        }
      }
    } catch (err) {
      setResult(null);
      setErrorMessage('Ocorreu um erro ao consultar. Por favor, tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[\u2010-\u2015\u2212]/g, '-');
    setSearchCode(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(searchCode);
  };

  // Status visual badge formatting
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmada':
        return {
          label: 'Consulta Confirmada',
          bg: 'bg-[#EBF0E6] text-[#4A5538] border-[#858B72]/40',
          icon: <CheckCircle2 className="w-4 h-4 text-[#858B72]" />,
        };
      case 'agendada':
        return {
          label: 'Agendada (Aguardando Confirmação)',
          bg: 'bg-[#FFF8EA] text-[#B97808] border-[#C88A12]/40',
          icon: <Clock className="w-4 h-4 text-[#C88A12]" />,
        };
      case 'remarcada':
        return {
          label: 'Consulta Remarcada',
          bg: 'bg-[#FFF8EA] text-[#33251A] border-[#E8DACB]',
          icon: <Info className="w-4 h-4 text-[#C88A12]" />,
        };
      case 'realizada':
        return {
          label: 'Sessão Realizada',
          bg: 'bg-[#F4EBE1] text-[#33251A] border-[#E8DACB]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#6A5646]" />,
        };
      case 'cancelada':
        return {
          label: 'Consulta Cancelada',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        };
      default:
        return {
          label: status,
          bg: 'bg-[#FFF8EA] text-[#33251A] border-[#E8DACB]',
          icon: <Info className="w-4 h-4 text-[#C88A12]" />,
        };
    }
  };

  // Format date nicely (ex: Quarta-feira, 15 de Fevereiro de 2025)
  const formatFullDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-[85vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center relative">
      <OrganicBlob className="top-10 left-[-80px] w-96 h-96 opacity-20" variant="gold" />

      {/* Top back button and breadcrumb */}
      <div className="mb-6 flex items-center justify-between relative z-10">
        <BackButton label="Voltar ao início" fallbackRoute="home" />
        <span className="text-xs font-mono text-[#6A5646] bg-[#FFF8EA] border border-[#E8DACB] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C88A12]" />
          <span>Ambiente Seguro & Privativo</span>
        </span>
      </div>

      <div className="bg-[#FFFDF8] rounded-3xl border border-[#E8DACB] p-6 sm:p-10 shadow-xs relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8EA] text-[#C88A12] flex items-center justify-center mx-auto mb-4 border border-[#C88A12]/30 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#33251A] font-medium tracking-tight mb-2">
            Consulte sua Consulta
          </h1>
          <p className="text-sm sm:text-base text-[#5A4535] leading-relaxed">
            Digite o código de acesso exclusivo que você recebeu por WhatsApp para visualizar data, horário e instruções da sua sessão com a{' '}
            <strong className="text-[#33251A]">{data.profile.name}</strong>.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="relative flex items-center">
            <input
              type="text"
              id="consultation-code-input"
              value={searchCode}
              disabled={cooldownTime > 0}
              onChange={handleInputChange}
              placeholder="Ex: HM-7K9W-4M2P"
              className="w-full pl-4 pr-32 py-3.5 bg-[#FFF8EA] border-2 border-[#E8DACB] rounded-2xl text-base sm:text-lg font-mono font-semibold tracking-wider text-[#33251A] placeholder:text-[#A89279] placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-[#C88A12] focus:bg-[#FFFDF8] transition-all shadow-inner disabled:bg-neutral-100 disabled:text-neutral-400"
              maxLength={25}
              required
            />
            <button
              type="submit"
              disabled={loading || cooldownTime > 0}
              id="consultation-search-btn"
              className="absolute right-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 shadow-xs disabled:opacity-50 bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : cooldownTime > 0 ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{cooldownTime}s</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#C88A12]" />
                  <span>Consultar</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-[#A89279] text-center mt-2">
            🔒 Dados clínicos e informações confidenciais não são exibidos nesta consulta pública.
          </p>
        </form>

        {/* Error / Throttling message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto p-4 rounded-2xl bg-[#FFF8EA] border border-[#C88A12]/40 text-[#33251A] text-sm flex items-start gap-3 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-[#C88A12] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-xs text-[#5A4535]">
                Caso tenha dúvidas sobre o seu agendamento, entre em contato diretamente com a psicóloga pelo WhatsApp.
              </p>
            </div>
          </motion.div>
        )}

        {/* Consultation Result Card */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.accessCode}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-xl mx-auto bg-[#FFF8EA] border border-[#E8DACB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
            >
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8DACB]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#B97808] font-semibold block">
                    Informações da Consulta
                  </span>
                  <span className="font-mono text-sm font-bold text-[#33251A]">
                    Código {result.accessCode}
                  </span>
                </div>
                {(() => {
                  const status = getStatusBadge(result.status);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg}`}
                    >
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                  );
                })()}
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#E8DACB] flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6A5646] block">Data Agendada</span>
                    <span className="font-medium text-[#33251A] text-sm capitalize">
                      {formatFullDate(result.date)}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#E8DACB] flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6A5646] block">Horário e Duração</span>
                    <span className="font-medium text-[#33251A] text-sm">
                      {result.time} ({result.durationMinutes || 50} min)
                    </span>
                  </div>
                </div>
              </div>

              {/* Modality & Location */}
              <div className="bg-[#FFFDF8] p-4 sm:p-5 rounded-2xl border border-[#E8DACB] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center shrink-0">
                    {result.modality === 'online' ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <Building className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-[#6A5646] block">Modalidade de Atendimento</span>
                    <span className="font-semibold text-[#33251A] text-sm sm:text-base capitalize">
                      {result.modality === 'online' ? 'Atendimento Online (Videochamada)' : 'Atendimento Presencial'}
                    </span>
                  </div>
                </div>

                <div className="pl-13 text-xs sm:text-sm text-[#5A4535] space-y-1">
                  {result.modality === 'online' ? (
                    <p className="leading-relaxed">
                      💻 O link exclusivo da videochamada será enviado no WhatsApp da psicóloga próximo ao horário da sessão. Certifique-se de estar em um local silencioso e privativo.
                    </p>
                  ) : Boolean(data.config.contact.showPhysicalAddress) && data.config.contact.address ? (
                    <p className="leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C88A12] shrink-0 mt-0.5" />
                      <span>{data.config.contact.address} ({data.config.contact.city} - {data.config.contact.state})</span>
                    </p>
                  ) : (
                    <p className="leading-relaxed flex items-start gap-1.5 text-[#5A4535]">
                      <MapPin className="w-4 h-4 text-[#C88A12] shrink-0 mt-0.5" />
                      <span>Atendimento presencial (endereço e orientações de acesso informados diretamente pela psicóloga).</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Psychologist orientation message if any */}
              {result.publicMessage && (
                <div className="bg-[#FFFDF8] border border-[#C88A12]/30 rounded-2xl p-4 sm:p-5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#B97808]">
                    <Sparkles className="w-4 h-4 text-[#C88A12]" />
                    <span>Orientação da Psicóloga</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#33251A] leading-relaxed italic">
                    "{result.publicMessage}"
                  </p>
                </div>
              )}

              {/* Psychologist Credentials & WhatsApp Contact */}
              <div className="pt-4 border-t border-[#E8DACB] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-semibold text-[#33251A] block">{result.psychologistName}</span>
                  <span className="text-[11px] text-[#6A5646]">Psicóloga Clínica • CRP {result.psychologistCrp}</span>
                </div>

                <a
                  href={getWhatsAppUrl(`Olá, ${data.profile.name}! Gostaria de tirar uma dúvida sobre a minha consulta código ${result.accessCode}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] shadow-2xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C88A12]" />
                  <span>Falar com a Psicóloga no WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helpful Tips Bottom */}
        <div className="mt-10 pt-6 border-t border-[#E8DACB] max-w-xl mx-auto text-center text-xs text-[#5A4535] space-y-2">
          <p className="flex items-center justify-center gap-1.5 font-medium text-[#33251A]">
            <Info className="w-4 h-4 text-[#C88A12]" />
            <span>Precisa desmarcar ou remarcar sua sessão?</span>
          </p>
          <p>
            Por favor, avise com antecedência mínima de 24 horas diretamente pelo WhatsApp para reorganizarmos a agenda com tranquilidade.
          </p>
        </div>
      </div>
    </div>
  );
};
