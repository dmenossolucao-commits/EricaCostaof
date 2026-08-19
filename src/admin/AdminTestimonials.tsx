import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Testimonial } from '../types';
import { Plus, Edit2, Trash2, Star, Quote, Eye, EyeOff, X, Save, ShieldCheck } from 'lucide-react';

export const AdminTestimonials: React.FC = () => {
  const { data, addTestimonial, updateTestimonial, deleteTestimonial } = useSite();
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingItem({
      id: '',
      patientName: 'M. S.',
      roleOrContext: 'Paciente de Psicoterapia Online',
      quote: 'A terapia transformou minha relação com a ansiedade...',
      rating: 5,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.quote) return;

    if (!editingItem.id) {
      addTestimonial({
        patientName: editingItem.patientName,
        roleOrContext: editingItem.roleOrContext,
        quote: editingItem.quote,
        rating: editingItem.rating || 5,
        active: editingItem.active,
      });
    } else {
      updateTestimonial(editingItem.id, editingItem);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Depoimentos & Experiências
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Gerencie depoimentos anônimos ou autorizados de acordo com as normas éticas do CFP.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Depoimento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.testimonials.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
              item.active ? 'border-[#E5E0D8] shadow-xs' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1 text-[#F59E0B]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateTestimonial(item.id, { active: !item.active })}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    title={item.active ? 'Desativar' : 'Ativar'}
                  >
                    {item.active ? <Eye className="w-4 h-4 text-[#4E6B58]" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-gray-400 hover:text-[#4E6B58] rounded-lg hover:bg-gray-100"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir este depoimento?')) {
                        deleteTestimonial(item.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#374151] italic leading-relaxed mb-4">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#1F2923]">{item.patientName}</p>
                <p className="text-[#718096]">{item.roleOrContext}</p>
              </div>
              <span className="text-[11px] text-gray-400">
                {item.active ? 'Exibido' : 'Oculto'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E0D8] z-10 text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE6DF]">
              <h3 className="font-serif text-2xl font-bold text-[#1F2923]">
                {editingItem.id ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Identificação / Iniciais (ex: C. M. ou Mariana S.) *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.patientName}
                  onChange={(e) => setEditingItem({ ...editingItem, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Contexto ou Modalidade (ex: Paciente de Atendimento Online)
                </label>
                <input
                  type="text"
                  value={editingItem.roleOrContext}
                  onChange={(e) => setEditingItem({ ...editingItem, roleOrContext: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Relato / Depoimento *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F2923] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.active}
                    onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                    className="rounded text-[#4E6B58] focus:ring-[#4E6B58]"
                  />
                  <span>Depoimento ativo no site</span>
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
                  Salvar Depoimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
