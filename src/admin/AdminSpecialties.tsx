import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Specialty } from '../types';
import { DynamicIcon } from '../utils/icons';
import { Plus, Edit2, Trash2, Check, X, Sparkles, Eye, EyeOff } from 'lucide-react';

const AVAILABLE_ICONS = [
  'Heart',
  'Brain',
  'Sparkles',
  'Compass',
  'Feather',
  'Shield',
  'Sun',
  'Coffee',
  'Smile',
  'Zap',
  'Activity',
  'Flame',
];

export const AdminSpecialties: React.FC = () => {
  const { data, addSpecialty, updateSpecialty, deleteSpecialty } = useSite();
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [benefitInput, setBenefitInput] = useState('');

  const handleOpenCreate = () => {
    setEditingSpecialty({
      id: '',
      title: '',
      shortDescription: '',
      fullDescription: '',
      iconName: 'Heart',
      targetAudience: 'Adultos e jovens',
      benefits: ['Autoconhecimento', 'Alívio de sintomas'],
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (spec: Specialty) => {
    setEditingSpecialty({ ...spec });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty || !editingSpecialty.title) return;

    if (!editingSpecialty.id) {
      addSpecialty({
        title: editingSpecialty.title,
        shortDescription: editingSpecialty.shortDescription,
        fullDescription: editingSpecialty.fullDescription,
        iconName: editingSpecialty.iconName,
        targetAudience: editingSpecialty.targetAudience,
        benefits: editingSpecialty.benefits,
        active: editingSpecialty.active,
      });
    } else {
      updateSpecialty(editingSpecialty.id, editingSpecialty);
    }

    setIsModalOpen(false);
    setEditingSpecialty(null);
  };

  const handleToggleActive = (spec: Specialty) => {
    updateSpecialty(spec.id, { active: !spec.active });
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() && editingSpecialty) {
      setEditingSpecialty({
        ...editingSpecialty,
        benefits: [...editingSpecialty.benefits, benefitInput.trim()],
      });
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (idx: number) => {
    if (editingSpecialty) {
      setEditingSpecialty({
        ...editingSpecialty,
        benefits: editingSpecialty.benefits.filter((_, i) => i !== idx),
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Gerenciar Especialidades & Áreas de Atuação
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Cadastre as principais queixas e temas atendidos (Ansiedade, Depressão, Autoestima, Burnout...).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Especialidade</span>
        </button>
      </div>

      {/* Specialties Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.specialties.map((spec) => (
          <div
            key={spec.id}
            className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
              spec.active ? 'border-[#E5E0D8] shadow-xs' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF3F0] text-[#4E6B58] flex items-center justify-center">
                    <DynamicIcon name={spec.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1F2923]">{spec.title}</h3>
                    <span className="text-[11px] text-[#718096]">{spec.targetAudience}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(spec)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title={spec.active ? 'Desativar exibição' : 'Ativar exibição'}
                  >
                    {spec.active ? <Eye className="w-4 h-4 text-[#4E6B58]" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(spec)}
                    className="p-2 text-gray-400 hover:text-[#4E6B58] rounded-lg hover:bg-gray-100 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir "${spec.title}"?`)) {
                        deleteSpecialty(spec.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#536157] mb-4 leading-relaxed line-clamp-2">
                {spec.shortDescription}
              </p>

              {/* Benefits Pills */}
              <div className="flex flex-wrap gap-1.5">
                {spec.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#FAF8F5] text-[#4A5568] px-2.5 py-1 rounded-lg border border-[#EAE6DF]"
                  >
                    • {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-gray-500">
              <span>Status: {spec.active ? 'Ativo no site' : 'Oculto'}</span>
              <button
                onClick={() => handleOpenEdit(spec)}
                className="text-[#4E6B58] font-semibold hover:underline"
              >
                Editar detalhes →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Specialty Edit / Create Modal */}
      {isModalOpen && editingSpecialty && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E0D8] z-10 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE6DF]">
              <h3 className="font-serif text-2xl font-bold text-[#1F2923]">
                {editingSpecialty.id ? 'Editar Especialidade' : 'Nova Especialidade'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Título da Especialidade *
                </label>
                <input
                  type="text"
                  required
                  value={editingSpecialty.title}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, title: e.target.value })}
                  placeholder="Ex: Ansiedade & Crises de Pânico"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-2">
                  Ícone Representativo
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map((iconKey) => {
                    const isSelected = editingSpecialty.iconName === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setEditingSpecialty({ ...editingSpecialty, iconName: iconKey })}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#4E6B58] bg-[#EFF3F0] text-[#4E6B58] shadow-xs'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <DynamicIcon name={iconKey} className="w-5 h-5 mb-1" />
                        <span className="text-[10px]">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  value={editingSpecialty.targetAudience}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, targetAudience: e.target.value })}
                  placeholder="Ex: Jovens, adultos e profissionais em transição"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Descrição Curta (Card da Home) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingSpecialty.shortDescription}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, shortDescription: e.target.value })}
                  placeholder="Resumo em 2 a 3 linhas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Descrição Completa (Modal / Página de Detalhe) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingSpecialty.fullDescription}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, fullDescription: e.target.value })}
                  placeholder="Explique como a psicoterapia atua nesse tema..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              {/* Benefits list */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Benefícios e Objetivos da Terapia:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingSpecialty.benefits.map((b, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#EFF3F0] border border-[#CAD8CE] text-xs font-semibold text-[#2D4234]"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="text-gray-400 hover:text-red-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="Adicionar benefício (ex: Maior autocontrole emocional)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2 rounded-xl bg-[#4E6B58] text-white text-xs font-semibold hover:bg-[#3D5545]"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F2923] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSpecialty.active}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, active: e.target.checked })}
                    className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
                  />
                  <span>Especialidade ativa e visível no site</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EAE6DF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs"
                >
                  Salvar Especialidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
