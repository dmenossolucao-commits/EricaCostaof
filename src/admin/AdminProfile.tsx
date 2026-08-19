import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { PsychologistProfile, EducationItem, ExperienceItem, SpecializationItem } from '../types';
import { PhotoSelectorModal } from './PhotoSelectorModal';
import { compressImageFile, DEFAULT_PROFILE_PHOTO, DEFAULT_SECONDARY_PHOTO } from '../utils/imageUtils';
import {
  Save,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  User,
  Award,
  GraduationCap,
  Briefcase,
  Globe,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  FileText,
  Loader2,
} from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { data, updateProfile, showToast } = useSite();
  const [profileState, setProfileState] = useState<PsychologistProfile>(data.profile);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoType, setPhotoType] = useState<'primary' | 'secondary'>('primary');
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if context data updates
  useEffect(() => {
    // Normalize string-based arrays to object-based arrays if needed for uniform editing
    const normalizedEdu: EducationItem[] = (data.profile.education || []).map((e, idx) => ({
      id: e.id || `edu-${idx}`,
      degree: e.degree || '',
      institution: e.institution || '',
      year: e.year || '',
      visible: e.visible !== false,
    }));

    const normalizedSpec: SpecializationItem[] = (data.profile.specializations || []).map((s, idx) => {
      if (typeof s === 'string') {
        return { id: `spec-${idx}`, title: s, visible: true };
      }
      return { id: s.id || `spec-${idx}`, title: s.title || '', visible: s.visible !== false };
    });

    const normalizedExp: ExperienceItem[] = (data.profile.experiences || []).map((e, idx) => {
      if (typeof e === 'string') {
        return { id: `exp-${idx}`, title: e, visible: true };
      }
      return {
        id: e.id || `exp-${idx}`,
        title: e.title || '',
        institution: e.institution || '',
        period: e.period || '',
        description: e.description || '',
        visible: e.visible !== false,
      };
    });

    setProfileState({
      ...data.profile,
      education: normalizedEdu,
      specializations: normalizedSpec,
      experiences: normalizedExp,
      showBio: data.profile.showBio !== false,
      showApproach: data.profile.showApproach !== false,
      showEducation: data.profile.showEducation !== false,
      showSpecializations: data.profile.showSpecializations !== false,
      showExperiences: data.profile.showExperiences !== false,
      showSocialLinks: data.profile.showSocialLinks !== false,
      showCrpBadge: data.profile.showCrpBadge !== false,
    });
  }, [data.profile]);

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'secondary') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(type);
      const compressedDataUrl = await compressImageFile(file, 900, 900, 0.82);
      if (type === 'primary') {
        handleChange('photo', compressedDataUrl);
        updateProfile({ photo: compressedDataUrl });
      } else {
        handleChange('secondaryPhoto', compressedDataUrl);
        updateProfile({ secondaryPhoto: compressedDataUrl });
      }
      showToast('Foto atualizada com sucesso!', 'success');
    } catch (err) {
      console.error('Erro no upload rápido de foto:', err);
      showToast('Erro ao carregar imagem.', 'error');
    } finally {
      setIsUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleChange = (field: keyof PsychologistProfile, value: any) => {
    setProfileState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: string, value: string) => {
    setProfileState((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value },
    }));
  };

  // Education helpers
  const handleAddEducation = () => {
    setProfileState((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: '',
          institution: '',
          year: new Date().getFullYear().toString(),
          visible: true,
        },
      ],
    }));
  };

  const handleUpdateEducation = (idx: number, field: keyof EducationItem, val: any) => {
    setProfileState((prev) => {
      const newEdu = [...prev.education];
      newEdu[idx] = { ...newEdu[idx], [field]: val };
      return { ...prev, education: newEdu };
    });
  };

  const handleToggleEducationVisibility = (idx: number) => {
    setProfileState((prev) => {
      const newEdu = [...prev.education];
      newEdu[idx] = { ...newEdu[idx], visible: !(newEdu[idx].visible !== false) };
      return { ...prev, education: newEdu };
    });
  };

  const handleRemoveEducation = (idx: number) => {
    setProfileState((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  // Specializations helpers
  const [newSpecTag, setNewSpecTag] = useState('');
  const handleAddSpecTag = () => {
    if (newSpecTag.trim()) {
      setProfileState((prev) => ({
        ...prev,
        specializations: [
          ...prev.specializations,
          { id: `spec-${Date.now()}`, title: newSpecTag.trim(), visible: true },
        ],
      }));
      setNewSpecTag('');
    }
  };

  const handleToggleSpecVisibility = (idx: number) => {
    setProfileState((prev) => {
      const newSpecs = [...prev.specializations];
      const item = newSpecs[idx];
      if (typeof item === 'string') {
        newSpecs[idx] = { id: `spec-${idx}`, title: item, visible: false };
      } else {
        newSpecs[idx] = { ...item, visible: !item.visible };
      }
      return { ...prev, specializations: newSpecs };
    });
  };

  const handleRemoveSpecTag = (idx: number) => {
    setProfileState((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== idx),
    }));
  };

  // Experience helpers
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpInstitution, setNewExpInstitution] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');

  const handleAddExp = () => {
    if (newExpTitle.trim()) {
      const item: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title: newExpTitle.trim(),
        institution: newExpInstitution.trim() || undefined,
        period: newExpPeriod.trim() || undefined,
        visible: true,
      };
      setProfileState((prev) => ({
        ...prev,
        experiences: [...(prev.experiences || []), item],
      }));
      setNewExpTitle('');
      setNewExpInstitution('');
      setNewExpPeriod('');
    }
  };

  const handleUpdateExperience = (idx: number, field: keyof ExperienceItem, val: any) => {
    setProfileState((prev) => {
      const newExp = [...prev.experiences];
      const current = newExp[idx];
      if (typeof current === 'string') {
        newExp[idx] = { id: `exp-${idx}`, title: current, [field]: val };
      } else {
        newExp[idx] = { ...current, [field]: val };
      }
      return { ...prev, experiences: newExp };
    });
  };

  const handleToggleExpVisibility = (idx: number) => {
    setProfileState((prev) => {
      const newExp = [...prev.experiences];
      const current = newExp[idx];
      if (typeof current === 'string') {
        newExp[idx] = { id: `exp-${idx}`, title: current, visible: false };
      } else {
        newExp[idx] = { ...current, visible: !(current.visible !== false) };
      }
      return { ...prev, experiences: newExp };
    });
  };

  const handleRemoveExp = (idx: number) => {
    setProfileState((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileState);
    showToast('Perfil profissional atualizado com sucesso!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Perfil Profissional da Psicóloga
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Edite seus dados, fotos, formação, experiências e controle a visibilidade pública de cada informação no site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Photos Management */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[#1F2923] mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#4E6B58]" />
            <span>Fotos da Profissional</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Primary Photo */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E6B58] mb-3">
                Foto Principal (Hero & Cabeçalho)
              </span>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-sm border-2 border-[#CAD8CE] mb-4 bg-gray-200">
                <img
                  src={profileState.photo || DEFAULT_PROFILE_PHOTO}
                  alt="Foto Principal"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_PHOTO;
                  }}
                  className="w-full h-full object-cover"
                />
                {isUploading === 'primary' && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin mb-1" />
                    <span className="text-[10px] font-semibold">Salvando...</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[220px]">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoType('primary');
                    setPhotoModalOpen(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#4E6B58] hover:bg-[#3D5545] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Escolher / Alterar Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => primaryFileInputRef.current?.click()}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#CAD8CE] hover:bg-[#EFF3F0] text-[11px] font-semibold text-[#1F2923] transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-[#4E6B58]" />
                  <span>Enviar do Aparelho</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleChange('photo', DEFAULT_PROFILE_PHOTO);
                    updateProfile({ photo: DEFAULT_PROFILE_PHOTO });
                  }}
                  className="text-[11px] text-gray-500 hover:text-[#4E6B58] underline mt-0.5 cursor-pointer"
                >
                  Restaurar foto original
                </button>

                <input
                  ref={primaryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleQuickUpload(e, 'primary')}
                  className="hidden"
                />
              </div>
            </div>

            {/* Secondary Photo */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E6B58] mb-3">
                Foto Secundária (Seção Sobre Mim)
              </span>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-sm border-2 border-[#CAD8CE] mb-4 bg-gray-200">
                <img
                  src={profileState.secondaryPhoto || profileState.photo || DEFAULT_SECONDARY_PHOTO}
                  alt="Foto Secundária"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_SECONDARY_PHOTO;
                  }}
                  className="w-full h-full object-cover"
                />
                {isUploading === 'secondary' && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin mb-1" />
                    <span className="text-[10px] font-semibold">Salvando...</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[220px]">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoType('secondary');
                    setPhotoModalOpen(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#4E6B58] hover:bg-[#3D5545] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Escolher / Alterar Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => secondaryFileInputRef.current?.click()}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#CAD8CE] hover:bg-[#EFF3F0] text-[11px] font-semibold text-[#1F2923] transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-[#4E6B58]" />
                  <span>Enviar do Aparelho</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleChange('secondaryPhoto', DEFAULT_SECONDARY_PHOTO);
                    updateProfile({ secondaryPhoto: DEFAULT_SECONDARY_PHOTO });
                  }}
                  className="text-[11px] text-gray-500 hover:text-[#4E6B58] underline mt-0.5 cursor-pointer"
                >
                  Restaurar foto original
                </button>

                <input
                  ref={secondaryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleQuickUpload(e, 'secondary')}
                  className="hidden"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 2. Basic Identification & CRP */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
            <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
              <User className="w-5 h-5 text-[#4E6B58]" />
              <span>Dados de Identificação & Registro</span>
            </h3>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <input
                type="checkbox"
                checked={profileState.showCrpBadge !== false}
                onChange={(e) => handleChange('showCrpBadge', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir selo de regularidade CRP no site público</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={profileState.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Dra. Helena Martins"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Título Profissional *
              </label>
              <input
                type="text"
                required
                value={profileState.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Psicóloga Clínica & Psicoterapeuta"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Número do CRP *
              </label>
              <input
                type="text"
                required
                value={profileState.crp}
                onChange={(e) => handleChange('crp', e.target.value)}
                placeholder="Ex: 06/142980"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm font-mono text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Região / Estado do CRP
              </label>
              <input
                type="text"
                value={profileState.crpRegion ?? ''}
                onChange={(e) => handleChange('crpRegion', e.target.value)}
                placeholder="Ex: SP, RJ, MG"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
              />
            </div>
          </div>
        </div>

        {/* 3. Therapeutic Approach */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
            <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4E6B58]" />
              <span>Abordagem Terapêutica</span>
            </h3>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <input
                type="checkbox"
                checked={profileState.showApproach !== false}
                onChange={(e) => handleChange('showApproach', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir abordagem no site público</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Linha Teórica Principal & Métodos
            </label>
            <input
              type="text"
              value={profileState.approach}
              onChange={(e) => handleChange('approach', e.target.value)}
              placeholder="Ex: Terapia Cognitivo-Comportamental (TCC) & Abordagem Humanista"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
            />
          </div>
        </div>

        {/* 4. Biography & Presentation Texts */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
            <h3 className="font-serif text-lg font-bold text-[#1F2923] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4E6B58]" />
              <span>Apresentação & Biografia</span>
            </h3>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <input
                type="checkbox"
                checked={profileState.showBio !== false}
                onChange={(e) => handleChange('showBio', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir biografia no site público</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Apresentação Curta (Hero e Destaques)
            </label>
            <textarea
              rows={2}
              value={profileState.shortBio}
              onChange={(e) => handleChange('shortBio', e.target.value)}
              placeholder="Frase de acolhimento e resumo..."
              className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Biografia Completa (Seção Sobre Mim)
            </label>
            <textarea
              rows={5}
              value={profileState.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Descreva sua trajetória com suas palavras..."
              className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
            />
          </div>
        </div>

        {/* 5. Academic Education (Formação Acadêmica) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#4E6B58]" />
              <h3 className="font-serif text-lg font-bold text-[#1F2923]">Formação Acadêmica</h3>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
                <input
                  type="checkbox"
                  checked={profileState.showEducation !== false}
                  onChange={(e) => handleChange('showEducation', e.target.checked)}
                  className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
                />
                <span>Exibir seção no site</span>
              </label>

              <button
                type="button"
                onClick={handleAddEducation}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E6B58] bg-[#EFF3F0] hover:bg-[#E3ECE6] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Título</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[#718096]">
            Você pode definir individualmente se cada curso/grau fica público ou oculto no site.
          </p>

          <div className="space-y-3">
            {profileState.education.map((edu, idx) => {
              const isVisible = edu.visible !== false;
              return (
                <div
                  key={edu.id || idx}
                  className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row items-center gap-3 ${
                    isVisible ? 'bg-[#FAF9F6] border-[#EAE6DF]' : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                      placeholder="Curso / Grau (ex: Graduação em Psicologia)"
                      className="sm:col-span-6 px-3 py-2 rounded-lg bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1F2923]"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                      placeholder="Instituição (ex: Universidade de São Paulo)"
                      className="sm:col-span-4 px-3 py-2 rounded-lg bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1F2923]"
                    />
                    <input
                      type="text"
                      value={edu.year || ''}
                      onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                      placeholder="Ano"
                      className="sm:col-span-2 px-3 py-2 rounded-lg bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1F2923]"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleEducationVisibility(idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isVisible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-200 text-neutral-600 border border-neutral-300 hover:bg-neutral-300'
                      }`}
                      title={isVisible ? 'Clique para ocultar do site' : 'Clique para tornar público'}
                    >
                      {isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Público</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Excluir formação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Specializations & Practical Focus */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#4E6B58]" />
              <h3 className="font-serif text-lg font-bold text-[#1F2923]">Especializações & Foco de Atuação</h3>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <input
                type="checkbox"
                checked={profileState.showSpecializations !== false}
                onChange={(e) => handleChange('showSpecializations', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir seção no site</span>
            </label>
          </div>

          <p className="text-xs text-[#718096]">
            Adicione especializações e alterne a visibilidade de cada tag individualmente.
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {profileState.specializations.map((spec, idx) => {
              const title = typeof spec === 'string' ? spec : spec.title;
              const isVisible = typeof spec === 'string' ? true : spec.visible !== false;

              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                    isVisible
                      ? 'bg-[#EFF3F0] border-[#CAD8CE] text-[#2D4234]'
                      : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                  }`}
                >
                  <span>{title}</span>
                  
                  <button
                    type="button"
                    onClick={() => handleToggleSpecVisibility(idx)}
                    className="text-gray-400 hover:text-[#4E6B58] ml-0.5 cursor-pointer"
                    title={isVisible ? 'Ocultar tag' : 'Tornar tag pública'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSpecTag(idx)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                    title="Excluir especialização"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecTag}
              onChange={(e) => setNewSpecTag(e.target.value)}
              placeholder="Digite uma nova especialização (ex: Transtornos do Sono)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSpecTag();
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
            />
            <button
              type="button"
              onClick={handleAddSpecTag}
              className="px-4 py-2.5 rounded-xl bg-[#4E6B58] text-white text-xs font-semibold hover:bg-[#3D5545] transition-colors cursor-pointer"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* 7. Professional Experience (Experiência Profissional) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#4E6B58]" />
              <h3 className="font-serif text-lg font-bold text-[#1F2923]">Experiência Profissional</h3>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <input
                type="checkbox"
                checked={profileState.showExperiences !== false}
                onChange={(e) => handleChange('showExperiences', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir seção no site público</span>
            </label>
          </div>

          <p className="text-xs text-[#718096]">
            Configure suas experiências profissionais. Você pode definir se a seção inteira e cada item individualmente são públicos ou ocultos.
          </p>

          {/* List of existing experiences */}
          <div className="space-y-3">
            {profileState.experiences && profileState.experiences.map((exp, idx) => {
              const title = typeof exp === 'string' ? exp : exp.title;
              const institution = typeof exp === 'string' ? '' : (exp.institution || '');
              const period = typeof exp === 'string' ? '' : (exp.period || '');
              const isVisible = typeof exp === 'string' ? true : exp.visible !== false;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row items-center gap-3 ${
                    isVisible ? 'bg-[#FAF9F6] border-[#EAE6DF]' : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleUpdateExperience(idx, 'title', e.target.value)}
                      placeholder="Cargo / Experiência (ex: Psicóloga Clínica em Consultório Privado)"
                      className="sm:col-span-6 px-3 py-2 rounded-lg bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1F2923]"
                    />
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => handleUpdateExperience(idx, 'institution', e.target.value)}
                      placeholder="Instituição / Local (Opcional)"
                      className="sm:col-span-4 px-3 py-2 rounded-lg bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1F2923]"
                    />
                    <input
                      type="text"
                      value={period}
                      onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                      placeholder="Período (ex: 2018 - Atual)"
                      className="sm:col-span-2 px-3 py-2 rounded-lg bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1F2923]"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleExpVisibility(idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isVisible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-200 text-neutral-600 border border-neutral-300 hover:bg-neutral-300'
                      }`}
                      title={isVisible ? 'Clique para ocultar do site' : 'Clique para tornar público'}
                    >
                      {isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Público</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveExp(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Excluir experiência"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add new experience box */}
          <div className="p-4 rounded-2xl bg-[#EFF3F0]/60 border border-[#CAD8CE] space-y-3">
            <span className="text-xs font-bold text-[#2D4234] block">
              + Adicionar Nova Experiência Profissional
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newExpTitle}
                onChange={(e) => setNewExpTitle(e.target.value)}
                placeholder="Título da experiência ou atuação..."
                className="sm:col-span-6 px-3 py-2 rounded-lg bg-white border border-[#CAD8CE] text-xs sm:text-sm text-[#1F2923]"
              />
              <input
                type="text"
                value={newExpInstitution}
                onChange={(e) => setNewExpInstitution(e.target.value)}
                placeholder="Instituição / Clínica (Opcional)"
                className="sm:col-span-4 px-3 py-2 rounded-lg bg-white border border-[#CAD8CE] text-xs sm:text-sm text-[#1F2923]"
              />
              <input
                type="text"
                value={newExpPeriod}
                onChange={(e) => setNewExpPeriod(e.target.value)}
                placeholder="Período (ex: 2020 - Atual)"
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-white border border-[#CAD8CE] text-xs sm:text-sm text-[#1F2923]"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddExp}
                disabled={!newExpTitle.trim()}
                className="px-4 py-2 rounded-xl bg-[#4E6B58] text-white text-xs font-semibold hover:bg-[#3D5545] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Salvar e Adicionar à Lista
              </button>
            </div>
          </div>

        </div>

        {/* 8. Social Links */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#4E6B58]" />
              <h3 className="font-serif text-lg font-bold text-[#1F2923]">Redes Sociais Profissionais</h3>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1F2923] cursor-pointer bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <input
                type="checkbox"
                checked={profileState.showSocialLinks !== false}
                onChange={(e) => handleChange('showSocialLinks', e.target.checked)}
                className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
              />
              <span>Exibir redes sociais no site público</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Instagram
              </label>
              <input
                type="text"
                value={profileState.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/seu.perfil"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                LinkedIn
              </label>
              <input
                type="text"
                value={profileState.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/seu-perfil"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Facebook (Opcional)
              </label>
              <input
                type="text"
                value={profileState.socialLinks?.facebook || ''}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/seu-perfil"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                YouTube (Opcional)
              </label>
              <input
                type="text"
                value={profileState.socialLinks?.youtube || ''}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@seu-canal"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-base font-semibold shadow-md transition-all cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Todas as Alterações</span>
          </button>
        </div>

      </form>

      {/* Photo Selector Modal */}
      <PhotoSelectorModal
        isOpen={photoModalOpen}
        title={photoType === 'primary' ? 'Alterar Foto Principal (Hero & Cabeçalho)' : 'Alterar Foto Secundária (Sobre Mim)'}
        currentPhoto={photoType === 'primary' ? profileState.photo : (profileState.secondaryPhoto || profileState.photo)}
        onClose={() => setPhotoModalOpen(false)}
        onSelectPhoto={(newUrl) => {
          if (photoType === 'primary') {
            handleChange('photo', newUrl);
            updateProfile({ photo: newUrl });
          } else {
            handleChange('secondaryPhoto', newUrl);
            updateProfile({ secondaryPhoto: newUrl });
          }
        }}
      />
    </div>
  );
};
