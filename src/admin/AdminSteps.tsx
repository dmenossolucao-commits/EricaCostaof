import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { StepItem } from '../types';
import { DynamicIcon } from '../utils/icons';
import { Save } from 'lucide-react';

const STEP_ICONS = ['MessageCircle', 'Coffee', 'HeartHandshake', 'Sparkles', 'Sun', 'Compass', 'Shield', 'Brain'];

export const AdminSteps: React.FC = () => {
  const { data, updateSteps } = useSite();
  const [stepsState, setStepsState] = useState<StepItem[]>(data.steps);

  const handleStepChange = (idx: number, field: keyof StepItem, val: any) => {
    setStepsState((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSteps(stepsState);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Etapas do Processo Terapêutico (Como Funciona)
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Personalize a jornada de 5 passos que o visitante visualiza na página inicial.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Etapas</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {stepsState.map((step, idx) => (
          <div
            key={step.id || idx}
            className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl font-bold text-[#4E6B58]">
                  0{step.stepNumber || idx + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                  Etapa {step.stepNumber || idx + 1}
                </span>
              </div>

              {/* Icon selection */}
              <div className="flex items-center gap-1.5">
                {STEP_ICONS.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleStepChange(idx, 'iconName', iconName)}
                    className={`p-2 rounded-xl border transition-all ${
                      step.iconName === iconName
                        ? 'border-[#4E6B58] bg-[#EFF3F0] text-[#4E6B58]'
                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                    title={iconName}
                  >
                    <DynamicIcon name={iconName} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Título da Etapa
              </label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm font-serif font-bold text-[#1F2923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Descrição Explicativa
              </label>
              <textarea
                rows={2}
                value={step.description}
                onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-base font-semibold shadow-md transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Todas as Etapas</span>
          </button>
        </div>
      </form>

    </div>
  );
};
