import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { THEME_CONFIGS } from '../utils/theme';
import { BackButton } from './BackButton';
import {
  Calendar,
  Clock,
  MessageCircle,
  Copy,
  ArrowRight,
} from 'lucide-react';
import { MinimalLeaf, OrganicBlob } from './OrganicDecorations';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { data, navigateTo, getWhatsAppUrl, showToast, incrementPostViews } = useSite();
  const theme = THEME_CONFIGS[data.config.themeColor] || THEME_CONFIGS.sage;

  const post = data.posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (slug) {
      incrementPostViews(slug);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="pt-36 pb-20 max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#33251A] mb-4">
          Artigo não encontrado
        </h2>
        <p className="text-[#5A4535] mb-6">
          O artigo que você está procurando pode ter sido movido ou despublicado.
        </p>
        <BackButton label="Voltar para todos os artigos" fallbackRoute="blog" />
      </div>
    );
  }

  // Related posts from same category or others
  const relatedPosts = data.posts
    .filter((p) => p.id !== post.id && p.published)
    .slice(0, 2);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Link do artigo copiado para a área de transferência!', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Confira este artigo da psicóloga ${data.profile.name}: "${post.title}" - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Helper to render markdown-like content into structured HTML safely
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      
      // H2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-[#33251A] mt-10 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      
      // H3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-semibold text-[#33251A] mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-[#C88A12] bg-[#FFF8EA] p-5 rounded-r-2xl my-6 text-[#33251A] italic font-medium text-lg leading-relaxed shadow-2xs"
          >
            {trimmed.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      }

      // Unordered list
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const lines = trimmed.split('\n');
        return (
          <ul key={idx} className="space-y-2 my-4 pl-4 list-disc marker:text-[#C88A12] text-[#5A4535]">
            {lines.map((line, lIdx) => (
              <li key={lIdx} className="leading-relaxed">
                {line.replace(/^(\*|-)\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Ordered list
      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n');
        return (
          <ol key={idx} className="space-y-2 my-4 pl-5 list-decimal marker:text-[#C88A12] text-[#5A4535]">
            {lines.map((line, lIdx) => (
              <li key={lIdx} className="leading-relaxed">
                {line.replace(/^\d+\.\s+/, '')}
              </li>
            ))}
          </ol>
        );
      }

      // Horizontal separator
      if (trimmed === '---') {
        return <hr key={idx} className="border-t border-[#E8DACB] my-8" />;
      }

      // Image tag format: ![alt](url)
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return (
          <div key={idx} className="my-8">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="w-full rounded-2xl shadow-md max-h-[480px] object-cover border border-[#E8DACB]"
            />
            {imgMatch[1] && (
              <p className="text-xs text-[#858B72] text-center mt-2 italic">{imgMatch[1]}</p>
            )}
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-base sm:text-lg text-[#5A4535] leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="pt-32 pb-24 bg-[#FAF5EB] min-h-screen relative overflow-hidden">
      <OrganicBlob className="top-12 left-[-100px] w-96 h-96 opacity-25" variant="gold" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        {/* Back navigation */}
        <div className="mb-8">
          <BackButton label="Voltar para todos os artigos" fallbackRoute="blog" />
        </div>

        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FFF8EA] text-[#B97808] border border-[#C88A12]/30 shadow-2xs">
            {post.category}
          </span>
          {post.tags?.map((tag) => (
            <span key={tag} className="text-xs text-[#6A5646] bg-[#FFF8EA] px-2.5 py-0.5 rounded-full border border-[#E8DACB]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Article Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#33251A] tracking-tight leading-[1.2] mb-6">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-lg sm:text-xl text-[#5A4535] font-normal leading-relaxed mb-8">
            {post.subtitle}
          </p>
        )}

        {/* Meta Bar: Author, Date, Read Time, Share */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-[#E8DACB] mb-8">
          <div className="flex items-center gap-3">
            <img
              src={data.profile.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop'}
              alt={post.author || data.profile.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';
              }}
              className="w-11 h-11 rounded-full object-cover border border-[#C88A12]"
            />
            <div>
              <p className="text-sm font-bold text-[#33251A]">
                {post.author || data.profile.name}
              </p>
              <p className="text-xs text-[#6A5646]">
                {data.profile.title} • CRP {data.profile.crp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6A5646] font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C88A12]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C88A12]" />
              {post.readTimeMinutes || 4} min de leitura
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E8DACB] mb-10 max-h-[480px]">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Article Content */}
        <div className="prose-content">
          {renderFormattedContent(post.content)}
        </div>

        {/* Social Share & WhatsApp Action Bar */}
        <div className="mt-12 p-6 rounded-3xl bg-[#FFFDF8] border border-[#E8DACB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6A5646]">
              Compartilhar artigo:
            </span>
            <button
              onClick={handleShareWhatsApp}
              className="p-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-[#FFF8EA] text-[#33251A] border border-[#E8DACB] hover:bg-[#F8E7C5] transition-colors"
              title="Copiar Link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <a
            href={getWhatsAppUrl(`Olá, ${data.profile.name}! Li o artigo "${post.title}" no seu blog e gostaria de agendar uma consulta.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#33251A] hover:bg-[#C88A12] text-[#FFFDF8] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#C88A12]" />
            <span>Falar com a psicóloga</span>
          </a>
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-8 rounded-3xl bg-[#FFF8EA] border border-[#E8DACB] flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={data.profile.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop'}
            alt={data.profile.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop';
            }}
            className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-[#C88A12] shrink-0"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="font-serif text-lg font-bold text-[#33251A]">
                {data.profile.name}
              </h3>
              <span className="text-xs font-mono text-[#33251A] bg-[#FFFDF8] px-2 py-0.5 rounded border border-[#E8DACB]">
                CRP {data.profile.crp}
              </span>
            </div>
            <p className="text-xs text-[#B97808] font-medium mb-2">
              {data.profile.title} • {data.profile.approach}
            </p>
            <p className="text-sm text-[#5A4535] leading-relaxed mb-4">
              {data.profile.shortBio}
            </p>
            <a
              href={getWhatsAppUrl(`Olá, ${data.profile.name}! Gostaria de agendar uma sessão com você.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B97808] hover:text-[#C88A12] hover:underline"
            >
              <span>Agendar consulta com a autora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E8DACB]">
            <h3 className="font-serif text-2xl font-bold text-[#33251A] mb-6">
              Artigos Recomendados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  onClick={() => navigateTo('article', rPost.slug)}
                  className="cursor-pointer p-6 rounded-3xl bg-[#FFFDF8] border border-[#E8DACB] hover:border-[#C88A12] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B97808] mb-2 block">
                      {rPost.category}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#33251A] mb-2 hover:text-[#C88A12] transition-colors leading-snug">
                      {rPost.title}
                    </h4>
                    <p className="text-xs text-[#5A4535] line-clamp-2">
                      {rPost.subtitle || rPost.content.substring(0, 90)}...
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E8DACB] flex items-center justify-between text-xs text-[#B97808] font-semibold">
                    <span>Ler artigo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C88A12]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
