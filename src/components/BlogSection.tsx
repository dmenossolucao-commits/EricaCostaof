import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { BackButton } from './BackButton';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

interface BlogSectionProps {
  isFullPage?: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ isFullPage = false }) => {
  const { data, navigateTo } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const publishedPosts = useMemo(() => {
    return data.posts.filter((p) => p.published);
  }, [data.posts]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(publishedPosts.map((p) => p.category).filter(Boolean)));
    return ['Todas', ...cats];
  }, [publishedPosts]);

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'Todas' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  const displayedPosts = isFullPage ? filteredPosts : filteredPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className={`py-20 md:py-28 ${isFullPage ? 'pt-32 bg-[#FAF5EB] min-h-screen' : 'bg-[#FAF5EB] border-t border-[#E8DACB]'} relative overflow-hidden`}
    >
      <OrganicBlob className="top-10 right-[-60px] w-96 h-96 opacity-25" variant="gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back navigation when full page */}
        {isFullPage && (
          <div className="mb-8 text-left">
            <BackButton label="Voltar ao início" fallbackRoute="home" />
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EA] border border-[#C88A12]/30 mb-3 shadow-2xs">
            <MinimalLeaf className="w-3.5 h-3.5 text-[#C88A12]" color="#C88A12" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#B97808] font-semibold">
              {isFullPage ? 'Blog & Artigos de Psicologia' : 'Artigos & Reflexões'}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#33251A]">
            {isFullPage ? 'Conteúdo & Saúde Emocional' : 'Artigos e Dicas de Bem-Estar'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A4535]">
            Artigos informativos e acolhedores sobre ansiedade, autoconhecimento, relacionamentos e saúde mental.
          </p>
        </div>

        {/* Filter & Search Controls (Only on full page or when many articles) */}
        {isFullPage && (
          <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#A89279] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artigo..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8EA] border border-[#E8DACB] text-sm text-[#33251A] placeholder-[#A89279] focus:outline-none focus:ring-2 focus:ring-[#C88A12]"
              />
            </div>

            {/* Categories */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#33251A] text-[#FFFDF8] shadow-xs'
                        : 'bg-[#FFF8EA] text-[#6A5646] border border-[#E8DACB] hover:bg-[#F8E7C5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigateTo('article', post.slug)}
              className="group cursor-pointer rounded-2xl bg-[#FFFDF8] border border-[#E8DACB] hover:border-[#C88A12] active:scale-[0.99] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-left touch-manipulation"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#FFF8EA]">
                <img
                  src={post.coverImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-[#FFFDF8]/95 text-[#B97808] border border-[#E8DACB] shadow-xs backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#858B72] mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C88A12]" />
                      {post.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#E8DACB]"></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C88A12]" />
                      {post.readTimeMinutes || 4} min
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#33251A] group-hover:text-[#C88A12] transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-[#5A4535] leading-relaxed line-clamp-3 mb-6">
                    {post.subtitle || post.content.replace(/##/g, '').substring(0, 140) + '...'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DACB] flex items-center justify-between text-xs font-semibold text-[#B97808] group-hover:text-[#33251A]">
                  <span>Ler artigo completo</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#C88A12]" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button on Home */}
        {!isFullPage && publishedPosts.length > 3 && (
          <div className="mt-14 text-center">
            <button
              onClick={() => navigateTo('blog')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium bg-transparent hover:bg-[#FFF8EA] text-[#33251A] border border-[#C88A12] transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#C88A12]" />
              <span>Ver todos os artigos do blog ({publishedPosts.length})</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
