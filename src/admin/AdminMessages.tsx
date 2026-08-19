import React from 'react';
import { useSite } from '../context/SiteContext';
import { Mail, MessageCircle, Trash2, CheckCircle, Clock, Send, User } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { data, markMessageAsRead, deleteMessage, getWhatsAppUrl } = useSite();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Mensagens Recebidas pelo Formulário ({data.messages.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Contatos enviados por visitantes interessados em agendar sessões ou tirar dúvidas.
          </p>
        </div>
      </div>

      {data.messages.length > 0 ? (
        <div className="space-y-4">
          {data.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl bg-white border transition-all ${
                msg.read ? 'border-[#E5E0D8] shadow-2xs' : 'border-[#4E6B58] bg-[#F8FAF9] shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F2EFE9]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFF3F0] text-[#4E6B58] flex items-center justify-center font-bold font-serif">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-[#1F2923]">{msg.name}</h3>
                      {!msg.read && (
                        <span className="text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded-full">
                          Nova
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#718096]">
                      {msg.email} • {msg.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#718096]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{msg.date}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E6B58] bg-[#EFF3F0] px-2.5 py-0.5 rounded-md mb-2 inline-block">
                  Assunto: {msg.subject}
                </span>
                <p className="text-sm text-[#374151] leading-relaxed mt-1 bg-[#FAF9F6] p-4 rounded-2xl border border-[#EAE6DF]">
                  "{msg.message}"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Canal de preferência para resposta: <strong className="text-gray-800 uppercase">{msg.preferredContact}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F2EFE9]">
                <div className="flex items-center gap-2">
                  {/* WhatsApp Direct Reply */}
                  {msg.phone && (
                    <a
                      href={`https://api.whatsapp.com/send?phone=${msg.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Olá, ${msg.name}! Aqui é a psicóloga ${data.profile.name}. Recebi sua mensagem sobre "${msg.subject}".`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Responder no WhatsApp</span>
                    </a>
                  )}

                  {/* Email Direct Reply */}
                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}?subject=Retorno de Contato - Psicóloga ${data.profile.name}&body=Olá, ${msg.name},`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#EAE6DF] text-[#1F2923] text-xs font-semibold border border-[#CAD8CE] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Responder por E-mail</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <button
                      onClick={() => markMessageAsRead(msg.id)}
                      className="inline-flex items-center gap-1 text-xs text-[#4E6B58] font-bold hover:underline"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Marcar como lida</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm('Excluir esta mensagem?')) {
                        deleteMessage(msg.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Excluir mensagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-[#E5E0D8] text-center text-[#718096]">
          <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-[#1F2923] mb-1">Nenhuma mensagem recebida ainda</p>
          <p className="text-xs text-gray-500">
            Quando os visitantes preencherem o formulário de contato do site, as mensagens aparecerão aqui.
          </p>
        </div>
      )}

    </div>
  );
};
