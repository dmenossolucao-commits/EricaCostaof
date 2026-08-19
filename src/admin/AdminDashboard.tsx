import React from 'react';
import { useSite } from '../context/SiteContext';
import {
  Calendar,
  Users,
  BookOpen,
  Sparkles,
  MessageCircle,
  Mail,
  HelpCircle,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  Camera,
  Layers,
  Settings,
  Plus,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data, setAdminActiveTab, navigateTo } = useSite();

  const publishedCount = data.posts.filter((p) => p.published).length;
  const draftsCount = data.posts.filter((p) => !p.published).length;
  const activeSpecialtiesCount = data.specialties.filter((s) => s.active).length;
  const unreadMessagesCount = data.messages.filter((m) => !m.read).length;
  const totalPatients = data.patients?.length || 0;
  const activePatients = data.patients?.filter((p) => p.status === 'active').length || 0;
  const totalAppointments = data.appointments?.length || 0;
  const confirmedAppointments = data.appointments?.filter((a) => a.status === 'confirmada').length || 0;

  const quickCards = [
    {
      title: 'Agenda & Consultas',
      value: `${totalAppointments} agendadas`,
      sub: `${confirmedAppointments} confirmadas`,
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-800',
      tab: 'agenda',
    },
    {
      title: 'Meus Pacientes',
      value: `${totalPatients} cadastrados`,
      sub: `${activePatients} ativos em atendimento`,
      icon: Users,
      color: 'bg-[#EFF3F0] text-[#4E6B58]',
      tab: 'agenda',
    },
    {
      title: 'Artigos no Blog',
      value: `${publishedCount} publicados`,
      sub: `${draftsCount} rascunho(s)`,
      icon: BookOpen,
      color: 'bg-[#F2EAE1] text-[#8C6D53]',
      tab: 'blog',
    },
    {
      title: 'Mensagens de Contato',
      value: `${data.messages.length} recebidas`,
      sub: unreadMessagesCount > 0 ? `${unreadMessagesCount} nova(s) não lida(s)` : 'Todas lidas',
      icon: Mail,
      color: 'bg-[#E0EBF3] text-[#4A6984]',
      tab: 'messages',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#EFF3F0] via-[#F8FAF9] to-white border border-[#CAD8CE] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <img
            src={data.profile.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop'}
            alt={data.profile.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#4E6B58] shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
                Olá, {data.profile.name.split(' ')[0]}!
              </h2>
              <span className="text-xs font-mono bg-[#4E6B58] text-white px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <p className="text-sm text-[#536157] mt-1">
              Bem-vinda ao seu consultório digital. Aqui você gerencia sua agenda, pacientes, consultas, fotos e artigos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setAdminActiveTab('agenda')}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#4E6B58] hover:bg-[#3d5445] text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Abrir Minha Agenda</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => setAdminActiveTab(card.tab)}
              className="p-6 rounded-3xl bg-white border border-[#E5E0D8] hover:border-[#CAD8CE] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#718096]">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-108 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1F2923]">
                  {card.value}
                </p>
                <p className="text-xs text-[#718096] mt-1">
                  {card.sub}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs font-semibold text-[#4E6B58]">
                <span>Gerenciar</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs">
        <h3 className="font-serif text-lg font-bold text-[#1F2923] mb-4">
          Ações Rápidas do Consultório
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setAdminActiveTab('agenda')}
            className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#EFF3F0] border border-[#EAE6DF] text-left transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4E6B58] text-white flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F2923]">Agenda & Pacientes</p>
              <p className="text-[11px] text-[#718096]">Consultas e Horários</p>
            </div>
          </button>

          <button
            onClick={() => setAdminActiveTab('blog')}
            className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#EFF3F0] border border-[#EAE6DF] text-left transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#8C6D53] text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F2923]">Escrever Artigo</p>
              <p className="text-[11px] text-[#718096]">Publicar no Blog</p>
            </div>
          </button>

          <button
            onClick={() => setAdminActiveTab('profile')}
            className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#EFF3F0] border border-[#EAE6DF] text-left transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#6B6882] text-white flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F2923]">Trocar Foto de Perfil</p>
              <p className="text-[11px] text-[#718096]">Galeria ou Upload</p>
            </div>
          </button>

          <button
            onClick={() => setAdminActiveTab('site')}
            className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#EFF3F0] border border-[#EAE6DF] text-left transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F2923]">Configurar WhatsApp</p>
              <p className="text-[11px] text-[#718096]">Número e Mensagens</p>
            </div>
          </button>
        </div>
      </div>

      {/* Summary: Recent Inquiries & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-[#1F2923]">
                Mensagens de Contato Recebidas
              </h3>
              <button
                onClick={() => setAdminActiveTab('messages')}
                className="text-xs font-bold text-[#4E6B58] hover:underline"
              >
                Ver todas ({data.messages.length})
              </button>
            </div>

            {data.messages.length > 0 ? (
              <div className="space-y-3">
                {data.messages.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1F2923]">{msg.name}</span>
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                        )}
                      </div>
                      <p className="text-[#718096] mt-0.5 font-mono">{msg.phone} • {msg.email}</p>
                      <p className="text-[#4A5568] mt-1 line-clamp-1 italic">"{msg.message}"</p>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] shrink-0">{msg.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">
                Nenhuma mensagem recebida ainda.
              </p>
            )}
          </div>
        </div>

        {/* Site Status & Compliance Checklist */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] mb-4">
            Status do Site & Boas Práticas
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF3F0] text-[#243B2C] border border-[#CAD8CE]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4E6B58]" />
                <span className="font-semibold">CRP Cadastrado ({data.profile.crp})</span>
              </div>
              <span className="font-mono text-[11px] text-[#4E6B58]">OK</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF3F0] text-[#243B2C] border border-[#CAD8CE]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4E6B58]" />
                <span className="font-semibold">WhatsApp de Atendimento Ativo</span>
              </div>
              <span className="font-mono text-[11px] text-[#4E6B58]">{data.config.whatsapp.displayNumber}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF3F0] text-[#243B2C] border border-[#CAD8CE]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4E6B58]" />
                <span className="font-semibold">Código de Ética do Psicólogo (CFP) e LGPD</span>
              </div>
              <span className="font-mono text-[11px] text-[#4E6B58]">Em conformidade</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF3F0] text-[#243B2C] border border-[#CAD8CE]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4E6B58]" />
                <span className="font-semibold">Armazenamento Seguro e Protegido</span>
              </div>
              <span className="font-mono text-[11px] text-[#4E6B58]">Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
