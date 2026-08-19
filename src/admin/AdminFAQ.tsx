import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { FAQItem } from '../types';
import { Plus, Edit2, Trash2, HelpCircle, Eye, EyeOff, X, Save } from 'lucide-react';

export const AdminFAQ: React.FC = () => {
  const { data, addFAQ, updateFAQ, deleteFAQ } = useSite();
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingItem({
      id: '',
      question: '',
      answer: '',
      category: 'Geral',
      order: data.faq.length + 1,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.question || !editingItem.answer) return;

    if (!editingItem.id) {
      addFAQ({
        question: editingItem.question,
        answer: editingItem.answer,
        category: editingItem.category || 'Geral',
        order: editingItem.order || data.faq.length + 1,
        active: editingItem.active,
      });
    } else {
      updateFAQ(editingItem.id, editingItem);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Perguntas Frequentes (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Cadastre respostas para dúvidas comuns sobre primeira sessão, convênio, cancelamento e valores.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.faq.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
              item.active ? 'border-[#E5E0D8] shadow-xs' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E6B58] bg-[#EFF3F0] px-2.5 py-0.5 rounded-full">
                    {item.category || 'Geral'}
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F2923]">
                    {item.question}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateFAQ(item.id, { active: !item.active })}
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
                      if (confirm(`Deseja excluir a pergunta "${item.question}"?`)) {
                        deleteFAQ(item.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#4A5568] leading-relaxed mt-2 whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E0D8] z-10 text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE6DF]">
              <h3 className="font-serif text-2xl font-bold text-[#1F2923]">
                {editingItem.id ? 'Editar Pergunta' : 'Nova Pergunta'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Pergunta *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  placeholder="Ex: Como funciona a primeira sessão?"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Categoria
                </label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  placeholder="Ex: Atendimento, Valores, Sigilo, Online"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                  Resposta Acolhedora *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.answer}
                  onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                  placeholder="Escreva a resposta de maneira clara e transparente..."
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
                  <span>Pergunta ativa e visível no site</span>
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
                  Salvar Pergunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
