import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { BlogPost } from '../types';
import { PhotoSelectorModal } from './PhotoSelectorModal';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Save,
  Check,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Bold,
  Italic,
  Minus,
} from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const { data, addPost, updatePost, deletePost, navigateTo } = useSite();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const filteredPosts = data.posts.filter((p) => {
    return (
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenCreate = () => {
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    setEditingPost({
      id: '',
      slug: 'novo-artigo-' + Date.now(),
      title: '',
      subtitle: '',
      content: '## Introdução\n\nEscreva aqui o seu parágrafo introdutório acolhedor...\n\n> "Citação marcante ou reflexão para o leitor."\n\n### Principais Cuidados\n\n* Primeiro ponto importante\n* Segundo ponto importante\n\nConclusão...',
      category: 'Psicoterapia',
      tags: ['Psicologia', 'Bem-Estar'],
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      author: data.profile.name,
      date: today,
      readTimeMinutes: 4,
      published: true,
      viewsCount: 0,
    });
    setViewMode('write');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setViewMode('write');
  };

  const handleSlugify = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (val: string) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      title: val,
      slug: editingPost.id ? editingPost.slug : handleSlugify(val) || 'artigo-' + Date.now(),
    });
  };

  // Helper to insert markdown tags in content
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!editingPost) return;
    const textarea = document.getElementById('blogContentArea') as HTMLTextAreaElement;
    if (!textarea) {
      setEditingPost({
        ...editingPost,
        content: editingPost.content + `\n\n${prefix}Texto${suffix}`,
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editingPost.content.substring(start, end) || 'Texto aqui';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      editingPost.content.substring(0, start) +
      replacement +
      editingPost.content.substring(end);

    setEditingPost({ ...editingPost, content: newContent });
  };

  const handleSavePost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    if (!editingPost.id) {
      addPost({
        slug: editingPost.slug || handleSlugify(editingPost.title),
        title: editingPost.title,
        subtitle: editingPost.subtitle,
        content: editingPost.content,
        category: editingPost.category || 'Geral',
        tags: editingPost.tags || [],
        coverImage: editingPost.coverImage,
        author: editingPost.author || data.profile.name,
        date: editingPost.date || 'Hoje',
        readTimeMinutes: editingPost.readTimeMinutes || 4,
        published: editingPost.published,
      });
    } else {
      updatePost(editingPost.id, editingPost);
    }

    setEditingPost(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && editingPost) {
      setEditingPost({
        ...editingPost,
        tags: [...(editingPost.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (idx: number) => {
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags: editingPost.tags?.filter((_, i) => i !== idx),
      });
    }
  };

  // If in editor view
  if (editingPost) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 text-left">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingPost(null)}
              className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1F2923]">
                {editingPost.id ? 'Editar Artigo' : 'Escrever Novo Artigo'}
              </h2>
              <p className="text-xs text-[#718096]">
                Crie conteúdo acolhedor para educar e conectar-se com seus pacientes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'write' ? 'preview' : 'write')}
              className="px-4 py-2 rounded-xl bg-white border border-[#CAD8CE] text-xs font-semibold text-[#1F2923] hover:bg-[#F2EFE9] transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#4E6B58]" />
              <span>{viewMode === 'write' ? 'Prévia' : 'Modo Edição'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSavePost()}
              className="px-6 py-2.5 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingPost.published ? 'Publicar Artigo' : 'Salvar Rascunho'}</span>
            </button>
          </div>
        </div>

        {viewMode === 'write' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Main Editor */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Title & Subtitle */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                    Título do Artigo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Como lidar com a ansiedade no cotidiano..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-base font-serif font-bold text-[#1F2923] focus:ring-2 focus:ring-[#4E6B58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                    Subtítulo / Resumo Convidativo
                  </label>
                  <input
                    type="text"
                    value={editingPost.subtitle || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, subtitle: e.target.value })}
                    placeholder="Ex: Reflexões e estratégias práticas para momentos de sobrecarga mental..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923]"
                  />
                </div>
              </div>

              {/* Rich Content Editor with Format Toolbar */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF]">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5568]">
                    Conteúdo do Artigo *
                  </label>
                  <span className="text-[11px] text-gray-400">Suporte a formatação rica</span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8]">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs font-bold border border-gray-200"
                    title="Negrito"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs italic border border-gray-200"
                    title="Itálico"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-px h-4 bg-gray-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('## ')}
                    className="px-2 py-1 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 flex items-center gap-1"
                    title="Título H2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                    <span>H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    className="px-2 py-1 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 flex items-center gap-1"
                    title="Subtítulo H3"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                    <span>H3</span>
                  </button>

                  <span className="w-px h-4 bg-gray-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('> "')}
                    className="p-1.5 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs border border-gray-200"
                    title="Citação"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('* ')}
                    className="p-1.5 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs border border-gray-200"
                    title="Lista"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('1. ')}
                    className="p-1.5 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs border border-gray-200"
                    title="Lista numerada"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n\n---\n\n')}
                    className="p-1.5 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs border border-gray-200"
                    title="Divisor"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('![Legenda da imagem](https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80)')}
                    className="px-2 py-1 rounded bg-white hover:bg-gray-200 text-gray-700 text-xs border border-gray-200 flex items-center gap-1"
                    title="Inserir imagem no texto"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ Imagem</span>
                  </button>
                </div>

                <textarea
                  id="blogContentArea"
                  rows={14}
                  required
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Escreva seu artigo..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1F2923] font-mono leading-relaxed focus:ring-2 focus:ring-[#4E6B58]"
                />
              </div>

            </div>

            {/* Right Col: Metadata & Settings */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Publication Status & Slug */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#1F2923]">
                  Status & Publicação
                </h3>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
                  <span className="text-xs font-semibold text-[#1F2923]">Publicar no site</span>
                  <input
                    type="checkbox"
                    checked={editingPost.published}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                    className="rounded text-[#4E6B58] focus:ring-[#4E6B58] w-4 h-4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1">
                    Slug da URL amigável
                  </label>
                  <input
                    type="text"
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs font-mono text-[#1F2923]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1">
                    Categoria Principal
                  </label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                  >
                    <option value="Ansiedade">Ansiedade</option>
                    <option value="Psicoterapia">Psicoterapia</option>
                    <option value="Autocuidado">Autocuidado & Autoestima</option>
                    <option value="Carreira">Carreira & Burnout</option>
                    <option value="Relacionamentos">Relacionamentos</option>
                    <option value="Luto">Luto & Perdas</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1">
                      Data
                    </label>
                    <input
                      type="text"
                      value={editingPost.date}
                      onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1">
                      Leitura (min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingPost.readTimeMinutes ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? ('' as any) : parseInt(e.target.value);
                        setEditingPost({ ...editingPost, readTimeMinutes: val });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#1F2923]">
                  Imagem de Capa
                </h3>

                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 border border-[#E5E0D8]">
                  <img
                    src={editingPost.coverImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                    alt="Capa"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setCoverModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] border border-[#CAD8CE] hover:bg-[#EFF3F0] text-xs font-semibold text-[#1F2923] flex items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#4E6B58]" />
                  <span>Trocar Imagem de Capa</span>
                </button>
              </div>

              {/* Tags */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#1F2923]">
                  Tags do Artigo
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {editingPost.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF] text-xs text-[#4A5568]"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Nova tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-xs text-[#1F2923]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-[#4E6B58] text-white text-xs font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Live Preview Mode */
          <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EFF3F0] text-[#4E6B58] mb-4 inline-block">
              {editingPost.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2923] mb-4">
              {editingPost.title}
            </h1>
            {editingPost.subtitle && (
              <p className="text-lg text-[#536157] mb-6">{editingPost.subtitle}</p>
            )}
            <img
              src={editingPost.coverImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
              alt={editingPost.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full max-h-96 object-cover rounded-2xl mb-8"
            />
            <div className="whitespace-pre-line text-base text-[#374151] leading-relaxed">
              {editingPost.content}
            </div>
          </div>
        )}

        {/* Modal for Cover Image */}
        <PhotoSelectorModal
          isOpen={coverModalOpen}
          currentPhoto={editingPost.coverImage}
          onClose={() => setCoverModalOpen(false)}
          onSelectPhoto={(url) => setEditingPost({ ...editingPost, coverImage: url })}
          title="Selecionar Imagem de Capa do Artigo"
        />

      </div>
    );
  }

  // Articles List View
  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2923]">
            Gerenciar Blog & Artigos
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Publique reflexões e conteúdos informativos sobre saúde mental sem precisar mexer em código.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E6B58] hover:bg-[#3D5545] text-white text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Escrever Novo Artigo</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar artigos por título ou categoria..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E5E0D8] text-sm text-[#1F2923]"
        />
      </div>

      {/* Posts Table / Grid */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs hover:border-[#CAD8CE] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 flex-1">
              <img
                src={post.coverImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                alt={post.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#EAE6DF] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E6B58] bg-[#EFF3F0] px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F2923] hover:text-[#4E6B58] transition-colors leading-snug">
                  {post.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-[#718096] mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTimeMinutes || 4} min
                  </span>
                  {post.viewsCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewsCount} visualizações
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => navigateTo('article', post.slug)}
                className="p-2 text-gray-500 hover:text-[#4E6B58] rounded-xl hover:bg-[#FAF8F5] transition-colors"
                title="Ver no site"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenEdit(post)}
                className="p-2 text-gray-500 hover:text-[#4E6B58] rounded-xl hover:bg-[#FAF8F5] transition-colors"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Deseja realmente excluir "${post.title}"?`)) {
                    deletePost(post.id);
                  }
                }}
                className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-[#FAF8F5] transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
