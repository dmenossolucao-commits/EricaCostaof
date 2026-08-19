import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  Send,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    data,
    adminUser,
    updateLegal,
    updateSEO,
    exportBackupJSON,
    importBackupJSON,
    resetToDemoData,
    changePassword,
    sendPasswordReset,
    resendAdminVerificationEmail,
    simulateSessionWarning,
    showToast,
  } = useSite();

  const [legalState, setLegalState] = useState(data.config.legal);
  const [seoState, setSeoState] = useState(data.config.seo);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveLegal = (e: React.FormEvent) => {
    e.preventDefault();
    updateLegal(legalState);
  };

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    updateSEO(seoState);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As senhas digitadas não coincidem.', 'error');
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword(newPassword);
    setPasswordLoading(false);

    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSendResetEmail = async () => {
    if (!adminUser?.email) {
      showToast('Nenhum e-mail administrativo ativo encontrado.', 'error');
      return;
    }
    const res = await sendPasswordReset(adminUser.email);
    if (res.success) {
      showToast('Link de redefinição de senha enviado para seu e-mail!', 'success');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonStr = event.target?.result as string;
        importBackupJSON(jsonStr);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="pb-6 border-b border-[#E5E0D8]">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
          Segurança, Conta & Configurações
        </h2>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Gerencie o acesso seguro ao painel via Firebase Authentication, exporte backups e configure políticas do site.
        </p>
      </div>

      {/* 1. Account & Security Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4E6B58]" />
            <span>Conta Administrativa & Segurança de Sessão</span>
          </h3>
          <p className="text-xs text-[#718096] mt-1">
            Autenticação individual criptografada via Firebase Authentication com sessão máxima de 1 hora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#D5DFD8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#4E6B58]" />
                <span>E-mail do Administrador</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verificado</span>
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-[#1F2923] break-all">
              {adminUser?.email || 'dmenossolucao@gmail.com'}
            </p>
            <p className="text-[11px] text-[#718096]">
              Acesso exclusivo através da rota <code className="text-[#4E6B58] font-bold">/admin</code>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4A5568] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4E6B58]" />
                <span>Limite de Sessão Ativa</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                1 Hora Máx.
              </span>
            </div>
            <p className="text-xs text-[#536157]">
              O painel emite aviso com 5 minutos de antecedência antes de encerrar a sessão por inatividade.
            </p>
            <button
              type="button"
              onClick={simulateSessionWarning}
              className="text-[11px] text-[#4E6B58] font-semibold hover:underline"
            >
              Testar aviso de 5 minutos
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="pt-4 border-t border-[#F0EBE1]">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-[#4A5568] mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#4E6B58]" />
            <span>Alterar Senha do Firebase Authentication</span>
          </h4>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Nova Senha (mín. 6 caracteres)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:outline-none focus:ring-2 focus:ring-[#4E6B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:outline-none focus:ring-2 focus:ring-[#4E6B58]"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendResetEmail}
                className="text-xs text-[#4E6B58] hover:underline flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ou enviar link de redefinição para meu e-mail</span>
              </button>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4E6B58] hover:bg-[#3D5545] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {passwordLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                <span>{passwordLoading ? 'Atualizando...' : 'Salvar Nova Senha'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Backup & Restore */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#4E6B58]" />
            <span>Backup e Restauração Completa de Conteúdo</span>
          </h3>
          <p className="text-xs text-[#718096] mt-1">
            Faça download de todos os seus artigos, especialidades, fotos e configurações em um único arquivo JSON seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Export */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-col justify-between">
            <div>
              <p className="font-bold text-xs text-[#1F2923] mb-1">Baixar Backup</p>
              <p className="text-[11px] text-[#718096] mb-3">Salva uma cópia completa dos dados no seu computador.</p>
            </div>
            <button
              onClick={exportBackupJSON}
              className="w-full py-2.5 px-3 rounded-xl bg-[#4E6B58] hover:bg-[#3D5545] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-col justify-between">
            <div>
              <p className="font-bold text-xs text-[#1F2923] mb-1">Restaurar Backup</p>
              <p className="text-[11px] text-[#718096] mb-3">Carregue um arquivo JSON de backup previamente exportado.</p>
            </div>
            <label className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#CAD8CE] hover:bg-[#F2EFE9] text-[#1F2923] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5 text-[#4E6B58]" />
              <span>Selecionar Arquivo</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Demo */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-col justify-between">
            <div>
              <p className="font-bold text-xs text-[#1F2923] mb-1">Restaurar Exemplo</p>
              <p className="text-[11px] text-[#718096] mb-3">Restaura todo o conteúdo inicial de demonstração.</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja restaurar os dados padrão de demonstração?')) {
                  resetToDemoData();
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SEO Settings */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#4E6B58]" />
            <span>Otimização para Motores de Busca (SEO)</span>
          </h3>
          <p className="text-xs text-[#718096] mt-1">
            Configure o título e descrição que aparecem nas buscas do Google e no compartilhamento do WhatsApp/redes sociais.
          </p>
        </div>

        <form onSubmit={handleSaveSEO} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Título da Página (Meta Title)
            </label>
            <input
              type="text"
              value={seoState.metaTitle}
              onChange={(e) => setSeoState({ ...seoState, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Descrição nos Buscadores (Meta Description)
            </label>
            <textarea
              rows={2}
              value={seoState.metaDescription}
              onChange={(e) => setSeoState({ ...seoState, metaDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Palavras-Chave (Keywords)
            </label>
            <input
              type="text"
              value={seoState.keywords}
              onChange={(e) => setSeoState({ ...seoState, keywords: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4E6B58] hover:bg-[#3D5545] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar SEO</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Legal Policies */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#4E6B58]" />
            <span>Políticas Legais, Sigilo CFP e Termos de Uso</span>
          </h3>
          <p className="text-xs text-[#718096] mt-1">
            Mantenha o site em total conformidade com a LGPD e as resoluções do Conselho Federal de Psicologia.
          </p>
        </div>

        <form onSubmit={handleSaveLegal} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Aviso de Conformidade CFP (Rodapé)
            </label>
            <input
              type="text"
              value={legalState.cfpEthicsNotice}
              onChange={(e) => setLegalState({ ...legalState, cfpEthicsNotice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Texto da Política de Privacidade
            </label>
            <textarea
              rows={6}
              value={legalState.privacyPolicy}
              onChange={(e) => setLegalState({ ...legalState, privacyPolicy: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] font-mono text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Texto dos Termos de Uso
            </label>
            <textarea
              rows={6}
              value={legalState.termsOfUse}
              onChange={(e) => setLegalState({ ...legalState, termsOfUse: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4E6B58] hover:bg-[#3D5545] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Termos Legais</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
