import React, { useEffect } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { AttendanceSection } from './components/AttendanceSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { ArticlePage } from './components/ArticlePage';
import { LegalPage } from './components/LegalPage';
import { PublicConsultationPage } from './components/PublicConsultationPage';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';
import { AdminLayout } from './admin/AdminLayout';

const MainAppContent: React.FC = () => {
  const { currentRoute, routeParams, data } = useSite();

  // Dynamic SEO Page Title update
  useEffect(() => {
    if (currentRoute === 'admin') {
      document.title = `Painel de Gestão | ${data.profile.name}`;
    } else if (currentRoute === 'consultation') {
      document.title = `Consultar Minha Sessão | ${data.profile.name}`;
    } else if (currentRoute === 'blog') {
      document.title = `Artigos & Saúde Emocional | ${data.profile.name}`;
    } else if (currentRoute === 'article' && routeParams) {
      const post = data.posts.find((p) => p.slug === routeParams);
      document.title = post ? `${post.title} | ${data.profile.name}` : `Artigo | ${data.profile.name}`;
    } else if (currentRoute === 'contact') {
      document.title = `Contato & Agendamento | ${data.profile.name}`;
    } else if (currentRoute === 'privacy') {
      document.title = `Política de Privacidade | ${data.profile.name}`;
    } else if (currentRoute === 'terms') {
      document.title = `Termos de Uso | ${data.profile.name}`;
    } else {
      document.title = data.config.seo.metaTitle || `${data.profile.name} | ${data.profile.title}`;
    }
  }, [currentRoute, routeParams, data]);

  // Admin Route takes full screen layout
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F5F2] text-[#2D3436] font-sans antialiased selection:bg-[#7C8370] selection:text-white">
        <AdminLayout />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F5F2] text-[#2D3436] font-sans antialiased selection:bg-[#7C8370] selection:text-white flex flex-col justify-between">
      {/* Universal Site Header */}
      <Header />

      {/* Main Dynamic View Routing */}
      <main className="flex-1 w-full">
        {currentRoute === 'home' && (
          <>
            <Hero />
            <AboutSection />
            <SpecialtiesSection />
            <AttendanceSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
            <BlogSection />
            <ContactSection />
          </>
        )}

        {currentRoute === 'consultation' && <PublicConsultationPage />}

        {currentRoute === 'blog' && <BlogSection isFullPage={true} />}

        {currentRoute === 'article' && <ArticlePage slug={routeParams || ''} />}

        {currentRoute === 'contact' && (
          <div className="pt-24">
            <ContactSection />
          </div>
        )}

        {currentRoute === 'privacy' && <LegalPage type="privacy" />}

        {currentRoute === 'terms' && <LegalPage type="terms" />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action WhatsApp */}
      <FloatingWhatsApp />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <SiteProvider>
      <MainAppContent />
    </SiteProvider>
  );
}

export default App;
