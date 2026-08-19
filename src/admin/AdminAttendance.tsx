import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { AttendanceInfo } from '../types';
import { Save, Laptop, MapPin, Plus, Trash2, ShieldCheck, Check } from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const { data, updateAttendance } = useSite();
  const [attState, setAttState] = useState<AttendanceInfo>(() => {
    const p = data.attendance.presential || data.attendance.inPerson;
    return {
      ...data.attendance,
      presential: p,
      inPerson: p,
    };
  });

  const handleOnlineChange = (field: string, value: any) => {
    setAttState((prev) => ({
      ...prev,
      online: { ...prev.online, [field]: value },
    }));
  };

  const handlePresencialChange = (field: string, value: any) => {
    setAttState((prev) => {
      const pres = { ...(prev.presential || prev.inPerson), [field]: value };
      return {
        ...prev,
        presential: pres,
        inPerson: pres,
      };
    });
  };

  // Online features
  const [newOnlineFeat, setNewOnlineFeat] = useState('');
  const handleAddOnlineFeat = () => {
    if (newOnlineFeat.trim()) {
      setAttState((prev) => ({
        ...prev,
        online: { ...prev.online, features: [...prev.online.features, newOnlineFeat.trim()] },
      }));
      setNewOnlineFeat('');
    }
  };

  const handleRemoveOnlineFeat = (idx: number) => {
    setAttState((prev) => ({
      ...prev,
      online: { ...prev.online, features: prev.online.features.filter((_, i) => i !== idx) },
    }));
  };

  // Presential features
  const [newPresFeat, setNewPresFeat] = useState('');
  const handleAddPresFeat = () => {
    if (newPresFeat.trim()) {
      setAttState((prev) => {
        const pres = prev.presential || prev.inPerson;
        const updated = { ...pres, features: [...pres.features, newPresFeat.trim()] };
        return {
          ...prev,
          presential: updated,
          inPerson: updated,
        };
      });
      setNewPresFeat('');
    }
  };

  const handleRemovePresFeat = (idx: number) => {
    setAttState((prev) => {
      const pres = prev.presential || prev.inPerson;
      const updated = { ...pres, features: pres.features.filter((_, i) => i !== idx) };
      return {
        ...prev,
        presential: updated,
        inPerson: updated,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pres = attState.presential || attState.inPerson;
    updateAttendance({
      ...attState,
      presential: pres,
      inPerson: pres,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Modalidades de Atendimento (Online & Presencial)
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Configure regras, duração das sessões, plataformas de videoconferência e informações de convênio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Modalidades</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Online Modality */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
              <Laptop className="w-5 h-5 text-[#4E6B58]" />
              <span>Atendimento Psicológico Online</span>
            </h3>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F2923] cursor-pointer">
              <input
                type="checkbox"
                checked={attState.online.active}
                onChange={(e) => handleOnlineChange('active', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Modalidade Ativa</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Título
              </label>
              <input
                type="text"
                value={attState.online.title}
                onChange={(e) => handleOnlineChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Duração da Sessão
              </label>
              <input
                type="text"
                value={attState.online.duration}
                onChange={(e) => handleOnlineChange('duration', e.target.value)}
                placeholder="50 minutos semanais"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Plataforma de Videoconferência
              </label>
              <input
                type="text"
                value={attState.online.platform}
                onChange={(e) => handleOnlineChange('platform', e.target.value)}
                placeholder="Google Meet com criptografia de ponta a ponta"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Alcance Geográfico
              </label>
              <input
                type="text"
                value={attState.online.reach}
                onChange={(e) => handleOnlineChange('reach', e.target.value)}
                placeholder="Todo o Brasil e brasileiros no exterior"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Descrição Geral da Modalidade Online
            </label>
            <textarea
              rows={3}
              value={attState.online.description}
              onChange={(e) => handleOnlineChange('description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          {/* Features list */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Vantagens / Destaques do Online:
            </label>
            <div className="space-y-2 mb-2">
              {attState.online.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const newF = [...attState.online.features];
                      newF[idx] = e.target.value;
                      handleOnlineChange('features', newF);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOnlineFeat(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newOnlineFeat}
                onChange={(e) => setNewOnlineFeat(e.target.value)}
                placeholder="Adicionar vantagem (ex: Flexibilidade de horários)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOnlineFeat();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
              />
              <button
                type="button"
                onClick={handleAddOnlineFeat}
                className="px-4 py-2 rounded-xl bg-[#4E6B58] text-white text-xs font-semibold hover:bg-[#3D5545]"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Presential Modality */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8C6D53]" />
              <span>Atendimento Presencial em Consultório</span>
            </h3>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F2923] cursor-pointer">
              <input
                type="checkbox"
                checked={attState.presential.active}
                onChange={(e) => handlePresencialChange('active', e.target.checked)}
                className="rounded text-[#8C6D53] focus:ring-[#8C6D53]"
              />
              <span>Modalidade Ativa</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Título
              </label>
              <input
                type="text"
                value={attState.presential.title}
                onChange={(e) => handlePresencialChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Duração da Sessão
              </label>
              <input
                type="text"
                value={attState.presential.duration}
                onChange={(e) => handlePresencialChange('duration', e.target.value)}
                placeholder="50 minutos presenciais"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Localização Resumida
              </label>
              <input
                type="text"
                value={attState.presential.location}
                onChange={(e) => handlePresencialChange('location', e.target.value)}
                placeholder="Bela Vista / Av. Paulista - São Paulo/SP"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Ambiente / Infraestrutura
              </label>
              <input
                type="text"
                value={attState.presential.environment}
                onChange={(e) => handlePresencialChange('environment', e.target.value)}
                placeholder="Consultório acolhedor e com isolamento acústico"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Descrição Geral do Presencial
            </label>
            <textarea
              rows={3}
              value={attState.presential.description}
              onChange={(e) => handlePresencialChange('description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          {/* Features list */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Destaques do Consultório Físico:
            </label>
            <div className="space-y-2 mb-2">
              {attState.presential.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const newF = [...attState.presential.features];
                      newF[idx] = e.target.value;
                      handlePresencialChange('features', newF);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePresFeat(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPresFeat}
                onChange={(e) => setNewPresFeat(e.target.value)}
                placeholder="Adicionar destaque presencial..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPresFeat();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
              />
              <button
                type="button"
                onClick={handleAddPresFeat}
                className="px-4 py-2 rounded-xl bg-[#8C6D53] text-white text-xs font-semibold hover:bg-[#735740]"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Insurance / Reimbursement & Ethics Policy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4E6B58]" />
            <span>Informações sobre Convênios, Reembolso e Sigilo</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Política de Convênio & Reembolso
            </label>
            <textarea
              rows={2}
              value={attState.insuranceNote}
              onChange={(e) => setAttState((prev) => ({ ...prev, insuranceNote: e.target.value }))}
              placeholder="Ex: Atendimento particular com emissão de recibo para reembolso..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Garantia de Sigilo e Privacidade
            </label>
            <textarea
              rows={2}
              value={attState.privacyGuarantee}
              onChange={(e) => setAttState((prev) => ({ ...prev, privacyGuarantee: e.target.value }))}
              placeholder="Ex: Todas as sessões são rigorosamente confidenciais..."
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
            <span>Salvar Informações de Atendimento</span>
          </button>
        </div>

      </form>
    </div>
  );
};
