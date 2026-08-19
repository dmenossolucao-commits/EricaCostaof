import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminAgendaAndPatients } from './AdminAgendaAndPatients';
import { AdminProfile } from './AdminProfile';
import { AdminSiteConfig } from './AdminSiteConfig';
import { AdminSpecialties } from './AdminSpecialties';
import { AdminAttendance } from './AdminAttendance';
import { AdminSteps } from './AdminSteps';
import { AdminBlog } from './AdminBlog';
import { AdminFAQ } from './AdminFAQ';
import { AdminTestimonials } from './AdminTestimonials';
import { AdminMessages } from './AdminMessages';
import { AdminSettings } from './AdminSettings';
import { BackButton } from '../components/BackButton';
import {
  LayoutDashboard,
  Calendar,
  User,
  Palette,
  Sparkles,
  Laptop,
  ListOrdered,
  BookOpen,
  HelpCircle,
  Star,
  Mail,
  Settings,
  Eye,
  LogOut,
  Menu,
  X,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    data,
    adminUser,
    isAdminLoggedIn,
    sessionRemainingSeconds,
    isSessionWarningOpen,
    extendAdminSession,
    logoutAdmin,
    navigateTo,
    adminActiveTab,
    setAdminActiveTab,
  } = useSite();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  const appointmentsCount = data.appointments?.length || 0;
  const unreadMessagesCount = data.messages.filter((m) => !m.read).length;

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'agenda', label: 'Agenda & Pacientes', icon: Calendar, badge: appointmentsCount > 0 ? `${appointmentsCount}` : undefined },
    { id: 'dashboard', label: 'Visão Geral do Site', icon: LayoutDashboard },
    { id: 'profile', label: 'Perfil & Fotos', icon: User },
    { id: 'site', label: 'Identidade & WhatsApp', icon: Palette },
    { id: 'specialties', label: 'Especialidades', icon: Sparkles },
    { id: 'attendance', label: 'Modalidades', icon: Laptop },
    { id: 'steps', label: 'Como Funciona', icon: ListOrdered },
    { id: 'blog', label: 'Artigos & Blog', icon: BookOpen, badge: data.posts.length },
    { id: 'faq', label: 'Perguntas FAQ', icon: HelpCircle },
    { id: 'testimonials', label: 'Depoimentos', icon: Star },
    { id: 'messages', label: 'Mensagens', icon: Mail, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined },
    { id: 'settings', label: 'Segurança & Configurações', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (adminActiveTab) {
      case 'agenda':
        return <AdminAgendaAndPatients />;
      case 'dashboard':
        return <AdminDashboard />;
      case 'profile':
        return <AdminProfile />;
      case 'site':
        return <AdminSiteConfig />;
      case 'specialties':
        return <AdminSpecialties />;
      case 'attendance':
        return <AdminAttendance />;
      case 'steps':
        return <AdminSteps />;
      case 'blog':
        return <AdminBlog />;
      case 'faq':
        return <AdminFAQ />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'messages':
        return <AdminMessages />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminAgendaAndPatients />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col text-left">
      {/* Top Header */}
      <header className="bg-[#FFFDF8] border-b border-[#E8DACB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5A4535] hover:text-[#33251A] rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center font-serif font-bold text-base">
                {data.profile.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-serif font-bold text-sm text-[#33251A] block leading-tight">
                  Painel de Gestão & Consultório
                </span>
                <span className="text-[11px] text-[#858B72]">
                  {adminUser?.email || data.profile.name}
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons with Back to Site Button & Session Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Session Timer Badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
                sessionRemainingSeconds <= 300
                  ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                  : 'bg-[#FFF8EA] text-[#33251A] border-[#E8DACB]'
              }`}
              title="Tempo restante da sessão de segurança (limite máx: 1 hora)"
            >
              <Clock className="w-3.5 h-3.5 text-[#C88A12]" />
              <span>Sessão: {formatRemainingTime(sessionRemainingSeconds)}</span>
            </div>

            <BackButton label="Voltar ao Site" fallbackRoute="home" />

            <button
              onClick={logoutAdmin}
              className="p-2 sm:px-3 sm:py-2 rounded-full text-[#6A5646] hover:text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Sair do painel"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-8">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 text-left">
          <div className="sticky top-24 space-y-1 bg-[#FFFDF8] p-3 rounded-3xl border border-[#E8DACB] shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#33251A] text-[#FFFDF8] shadow-2xs'
                      : 'text-[#5A4535] hover:bg-[#FFF8EA] hover:text-[#33251A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C88A12]' : 'text-[#858B72]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#C88A12] text-[#FFFDF8]' : 'bg-[#FFF8EA] text-[#B97808] border border-[#C88A12]/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-[#33251A]/60 backdrop-blur-xs" />
            <div className="relative w-72 bg-[#FFFDF8] h-full p-4 shadow-xl flex flex-col justify-between z-10 text-left border-r border-[#E8DACB]">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DACB]">
                  <span className="font-serif font-bold text-sm text-[#33251A]">Menu de Administração</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#858B72]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = adminActiveTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setAdminActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-[#33251A] text-[#FFFDF8]' : 'text-[#5A4535] hover:bg-[#FFF8EA]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#C88A12]' : 'text-[#858B72]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFF8EA] text-[#B97808]">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DACB] space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('home');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-[#33251A] bg-[#FFF8EA] hover:bg-[#F8E7C5] rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#E8DACB]"
                >
                  <Eye className="w-4 h-4 text-[#C88A12]" />
                  <span>Voltar ao Site Público</span>
                </button>

                <button
                  onClick={logoutAdmin}
                  className="w-full py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Painel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 5-MINUTE SESSION EXPIRATION WARNING MODAL */}
      {/* ========================================================================= */}
      {isSessionWarningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8EA] text-[#C88A12] flex items-center justify-center mx-auto mb-4 border border-[#C88A12]/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#33251A] mb-2">
              Sessão Expirando em Breve
            </h3>

            <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed mb-4">
              Sua sessão administrativa expirará em <strong>5 minutos</strong> por motivos de segurança e proteção dos dados dos pacientes.
            </p>

            <div className="p-3 bg-[#FFF8EA] rounded-2xl border border-[#E8DACB] mb-6 font-mono text-sm font-bold text-[#33251A] flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[#C88A12]" />
              <span>Tempo restante: {formatRemainingTime(sessionRemainingSeconds)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={extendAdminSession}
                className="w-full py-3 px-4 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Continuar Sessão</span>
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="w-full py-3 px-4 rounded-full border border-[#E8DACB] hover:bg-[#FFF8EA] text-[#33251A] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
