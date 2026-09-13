import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { isAuthorizedAdminEmail } from '../types';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { MinimalLeaf, OrganicBlob } from '../components/OrganicDecorations';

type AuthViewMode = 'login' | 'register' | 'forgot' | 'verify-email';

export const AdminLogin: React.FC = () => {
  const {
    adminUser,
    loginAdminWithEmail,
    registerNewAdmin,
    resendAdminVerificationEmail,
    checkVerificationStatus,
    sendPasswordReset,
    logoutAdmin,
    navigateTo,
  } = useSite();

  const [mode, setMode] = useState<AuthViewMode>(() => {
    if (adminUser && !adminUser.emailVerified) {
      return 'verify-email';
    }
    return 'login';
  });

  // Sync verify-email mode if user is logged in but not verified
  useEffect(() => {
    if (adminUser && !adminUser.emailVerified) {
      setMode('verify-email');
    }
  }, [adminUser]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Por favor, informe seu e-mail e senha.');
      return;
    }

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setErrorMessage('Acesso não autorizado: este e-mail não possui permissão administrativa.');
      return;
    }

    setLoading(true);
    const res = await loginAdminWithEmail(cleanEmail, password);
    setLoading(false);

    if (!res.success) {
      if (res.emailVerified === false) {
        setMode('verify-email');
        setErrorMessage(res.error || 'Confirme seu e-mail antes de acessar o painel.');
      } else {
        setErrorMessage(res.error || 'E-mail ou senha incorretos.');
      }
    }
  };

  // 2. Handle Admin Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password || !confirmPassword) {
      setErrorMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setErrorMessage(
        'Este e-mail não possui autorização prévia para gerenciar este consultório. O cadastro é restrito aos administradores autorizados.'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    const res = await registerNewAdmin(cleanEmail, password);
    setLoading(false);

    if (res.success) {
      setMode('verify-email');
      setSuccessMessage('Conta criada com sucesso! Enviamos um e-mail com o link de confirmação.');
    } else {
      setErrorMessage(res.error || 'Erro ao criar conta administrativa.');
    }
  };

  // 3. Handle Password Reset
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail administrativo.');
      return;
    }

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setErrorMessage('E-mail não autorizado para recuperação de acesso administrativo.');
      return;
    }

    setLoading(true);
    const res = await sendPasswordReset(cleanEmail);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Se este e-mail estiver cadastrado, enviamos as instruções para redefinir sua senha.');
    } else {
      setErrorMessage(res.error || 'Não foi possível solicitar a redefinição de senha.');
    }
  };

  // 4. Handle Email Verification Check
  const handleCheckEmailVerified = async () => {
    clearMessages();
    setLoading(true);
    const verified = await checkVerificationStatus();
    setLoading(false);

    if (!verified) {
      setErrorMessage('O e-mail ainda não consta como confirmado. Se você já clicou no link, aguarde alguns segundos e clique novamente.');
    }
  };

  // 5. Handle Resend Verification Email
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    clearMessages();
    setLoading(true);
    const res = await resendAdminVerificationEmail();
    setLoading(false);

    if (res.success) {
      setResendCooldown(60);
      setSuccessMessage('Novo link de confirmação enviado para seu e-mail.');
    } else {
      setErrorMessage(res.error || 'Falha ao reenviar e-mail de confirmação.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      <OrganicBlob className="top-10 left-[-80px] w-96 h-96 opacity-25" variant="gold" />
      <OrganicBlob className="bottom-10 right-[-80px] w-96 h-96 opacity-20" variant="sage" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <BackButton label="Voltar ao site" fallbackRoute="home" />
      </div>

      <div className="max-w-md w-full bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E8DACB] relative z-10">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#FFF8EA] text-[#C88A12] border border-[#C88A12]/30 flex items-center justify-center mx-auto mb-5 shadow-2xs">
          {mode === 'verify-email' ? (
            <Mail className="w-7 h-7" />
          ) : mode === 'register' ? (
            <UserPlus className="w-7 h-7" />
          ) : (
            <Lock className="w-7 h-7" />
          )}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: EMAIL VERIFICATION PENDING */}
        {/* ========================================================================= */}
        {mode === 'verify-email' && (
          <div className="text-center space-y-4">
            <h1 className="font-serif text-2xl font-bold text-[#33251A]">
              Confirmação de E-mail
            </h1>
            <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
              Por segurança e sigilo profissional, o painel administrativo exige confirmação do seu endereço de e-mail.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFF8EA] border border-[#E8DACB] text-xs font-mono font-medium text-[#33251A] break-all">
              {adminUser?.email || email || 'Seu e-mail administrativo'}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCheckEmailVerified}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Já confirmei no e-mail (Acessar Painel)</span>
              </button>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={loading || resendCooldown > 0}
                className="w-full py-2.5 px-4 rounded-full border border-[#E8DACB] hover:bg-[#FFF8EA] text-[#33251A] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {resendCooldown > 0
                    ? `Aguarde ${resendCooldown}s para reenviar`
                    : 'Reenviar link de confirmação'}
                </span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logoutAdmin();
                  setMode('login');
                  clearMessages();
                }}
                className="w-full py-2 text-xs text-[#858B72] hover:text-[#33251A] transition-colors"
              >
                Entrar com outra conta
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: LOGIN */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#33251A] mb-1.5">
                Acesso Administrativo
              </h1>
              <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                Área restrita e segura para gestão de pacientes, agenda e conteúdos.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="psicologa@dominio.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646]">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      clearMessages();
                    }}
                    className="text-xs text-[#B97808] hover:text-[#C88A12] font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha..."
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89279] hover:text-[#33251A] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C88A12]" />
                ) : (
                  <LogIn className="w-4 h-4 text-[#C88A12]" />
                )}
                <span>{loading ? 'Verificando...' : 'Entrar no Painel'}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8DACB] text-center space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  clearMessages();
                }}
                className="text-xs text-[#B97808] font-semibold hover:underline flex items-center justify-center gap-1.5 mx-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Primeiro acesso? Cadastre sua conta</span>
              </button>

              <div>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="inline-flex items-center gap-1 text-xs text-[#858B72] hover:text-[#33251A] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar ao site público</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: FORGOT PASSWORD */}
        {/* ========================================================================= */}
        {mode === 'forgot' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl font-bold text-[#33251A] mb-1.5">
                Recuperação de Senha
              </h1>
              <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                Informe o seu e-mail para enviarmos um link seguro de redefinição de senha.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                  E-mail Administrativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="psicologa@dominio.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C88A12]" />
                ) : (
                  <Send className="w-4 h-4 text-[#C88A12]" />
                )}
                <span>{loading ? 'Enviando...' : 'Enviar Link de Redefinição'}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8DACB] text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearMessages();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#B97808] font-semibold hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para o login</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: REGISTER NEW ADMIN */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl font-bold text-[#33251A] mb-1.5">
                Criar Conta de Administrador
              </h1>
              <p className="text-xs sm:text-sm text-[#5A4535] leading-relaxed">
                Configure seu acesso seguro gerenciado pelo Firebase Authentication.
              </p>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Acesso Restrito:</strong> O cadastro de novos administradores exige pré-autorização institucional da clínica. Apenas e-mails na lista autorizada podem se registrar.
              </span>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="psicologa@dominio.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                  Senha (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie sua senha segura..."
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89279] hover:text-[#33251A] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A5646] mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha..."
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] focus:outline-none focus:ring-2 focus:ring-[#C88A12] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C88A12]" />
                ) : (
                  <UserPlus className="w-4 h-4 text-[#C88A12]" />
                )}
                <span>{loading ? 'Cadastrando...' : 'Cadastrar e Enviar Confirmação'}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8DACB] text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearMessages();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#B97808] font-semibold hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Já tem conta? Fazer login</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#858B72]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C88A12]" />
          <span>Sessão segura com Firebase Auth</span>
        </div>
      </div>
    </div>
  );
};
