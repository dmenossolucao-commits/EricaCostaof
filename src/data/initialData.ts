import { SiteData } from '../types';

export const PHOTO_PRESETS = [
  {
    id: 'portrait-1',
    label: 'Dra. Helena (Padrão Acolhedor)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop',
    description: 'Retrato profissional acolhedor e sereno',
  },
  {
    id: 'portrait-2',
    label: 'Consultório / Iluminação Natural',
    url: 'https://images.unsplash.com/photo-1594824813626-d3c5095d3c87?q=80&w=900&auto=format&fit=crop',
    description: 'Ambiente clínico suave e empático',
  },
  {
    id: 'portrait-3',
    label: 'Expressão Amigável & Empática',
    url: 'https://images.unsplash.com/photo-1580894732474-0f196eb2ca0e?q=80&w=900&auto=format&fit=crop',
    description: 'Postura profissional acessível',
  },
  {
    id: 'portrait-4',
    label: 'Retrato em Tom Neutro',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=900&auto=format&fit=crop',
    description: 'Clássico profissional de saúde',
  },
  {
    id: 'portrait-5',
    label: 'Espaço Terapêutico & Acolhimento',
    url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=900&auto=format&fit=crop',
    description: 'Ambiente tranquilo de escuta e reflexão',
  },
  {
    id: 'portrait-6',
    label: 'Consultório Moderno & Zen',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop',
    description: 'Espaço profissional clean e harmonioso',
  },
  {
    id: 'portrait-7',
    label: 'Retrato Clássico e Elegante',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=900&auto=format&fit=crop',
    description: 'Estilo sóbrio com postura de confiança',
  },
  {
    id: 'portrait-8',
    label: 'Presença Serena e Humanizada',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop',
    description: 'Acolhimento com foco no bem-estar',
  },
];

export const INITIAL_SITE_DATA: SiteData = {
  profile: {
    name: 'Dra. Helena Martins de Castro',
    title: 'Psicóloga Clínica & Psicoterapeuta',
    crp: '06/142980',
    crpRegion: 'SP',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop',
    secondaryPhoto: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=900&auto=format&fit=crop',
    approach: 'Terapia Cognitivo-Comportamental (TCC) & Abordagem Humanista',
    shortBio: 'Espaço seguro e livre de julgamentos para você cuidar da sua mente, compreender suas emoções e construir uma vida com mais leveza e propósito.',
    bio: 'Sou psicóloga clínica formada pela Universidade de São Paulo (USP), dedicada a proporcionar um atendimento humanizado, ético e individualizado. Acredito que a psicoterapia é uma jornada transformadora de autoconhecimento e desenvolvimento emocional, onde cada indivíduo é acolhido em sua singularidade. Minha prática é pautada na Terapia Cognitivo-Comportamental e em intervenções baseadas em evidências científicas, sempre integradas com uma escuta sensível e empática.',
    education: [
      {
        id: 'edu-1',
        degree: 'Graduação em Psicologia (Bacharelado e Licenciatura)',
        institution: 'Universidade de São Paulo (USP)',
        year: '2015',
        visible: true,
      },
      {
        id: 'edu-2',
        degree: 'Especialização em Terapia Cognitivo-Comportamental',
        institution: 'Instituto de Psiquiatria (IPq - HCFMUSP)',
        year: '2018',
        visible: true,
      },
      {
        id: 'edu-3',
        degree: 'Aprimoramento em Manejo de Ansiedade e Regulação Emocional',
        institution: 'Sociedade Brasileira de Terapias Cognitivas (SBTC)',
        year: '2021',
        visible: true,
      },
    ],
    specializations: [
      { id: 'spec-tag-1', title: 'Transtornos de Ansiedade e Síndrome do Pânico', visible: true },
      { id: 'spec-tag-2', title: 'Autoestima e Desenvolvimento do Autocuidado', visible: true },
      { id: 'spec-tag-3', title: 'Conflitos em Relacionamentos e Vínculos Afetivos', visible: true },
      { id: 'spec-tag-4', title: 'Síndrome de Burnout e Estresse Ocupacional', visible: true },
      { id: 'spec-tag-5', title: 'Transições de Carreira e Mudanças de Vida', visible: true },
      { id: 'spec-tag-6', title: 'Terapia para Adultos e Jovens Adultos', visible: true },
    ],
    experiences: [
      { id: 'exp-1', title: 'Mais de 9 anos de atuação em clínica psicológica privada', visible: true },
      { id: 'exp-2', title: 'Supervisora clínica e facilitadora de grupos de desenvolvimento emocional', visible: true },
      { id: 'exp-3', title: 'Membro ativo da Associação Brasileira de Psicoterapia', visible: true },
    ],
    socialLinks: {
      instagram: 'https://instagram.com/psico.helenamartins',
      linkedin: 'https://linkedin.com/in/helenamartinspsico',
    },
    showBio: true,
    showApproach: true,
    showEducation: true,
    showSpecializations: true,
    showExperiences: true,
    showSocialLinks: true,
    showCrpBadge: true,
  },
  config: {
    brandName: 'Espaço Terapêutico',
    tagline: 'Psicologia Clínica & Acolhimento Humano',
    themeColor: 'sage',
    hero: {
      badge: 'Atendimento Presencial e Online em todo o Brasil',
      title: 'Cuide da sua saúde emocional com acolhimento e acompanhamento profissional.',
      subtitle: 'Um espaço confidencial e seguro para você se reconectar consigo mesmo(a), superar a ansiedade e construir relações mais saudáveis.',
      ctaPrimaryText: 'Agendar primeiro atendimento',
      ctaSecondaryText: 'Falar pelo WhatsApp',
      showStats: true,
      stat1Number: '9+',
      stat1Label: 'Anos de experiência clínica',
      stat2Number: '100%',
      stat2Label: 'Sigilo ético e confidencialidade',
      stat3Number: '2.500+',
      stat3Label: 'Sessões realizadas',
    },
    whatsapp: {
      number: '11998765432',
      displayNumber: '(11) 99876-5432',
      defaultMessage: 'Olá, Dra. Helena! Encontrei seu site e gostaria de saber mais sobre os atendimentos psicológicos.',
      appointmentMessage: 'Olá! Gostaria de verificar os horários disponíveis para agendar uma consulta psicológica.',
      doubtMessage: 'Olá! Tenho algumas dúvidas sobre as modalidades de terapia e gostaria de conversar.',
      showFloatingButton: true,
      floatingButtonTooltip: 'Dúvidas ou agendamento? Fale comigo no WhatsApp',
      onlineStatusText: 'Online para agendamentos e informações',
    },
    contact: {
      email: 'contato@helenamartinspsico.com.br',
      phone: '(11) 99876-5432',
      address: 'Av. Paulista, 1842 - Conjunto 74',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01310-200',
      googleMapsUrl: 'https://maps.google.com/?q=Av.+Paulista,+1842+-+Bela+Vista,+São+Paulo+-+SP',
      businessHours: 'Segunda a Sexta: 08h às 20h | Sábado: 08h às 13h',
      emergencyNotice: 'Em caso de crise emergencial imediata, ligue para o CVV no número 188 (ligação gratuita, 24 horas) ou procure o pronto-socorro mais próximo.',
    },
    seo: {
      siteTitle: 'Dra. Helena Martins | Psicóloga Clínica em São Paulo & Online',
      metaDescription: 'Psicoterapia presencial e online com foco em ansiedade, autoestima e relacionamentos. Atendimento ético e humanizado. Agende sua sessão.',
      keywords: 'psicóloga, terapia online, psicólogo são paulo, ansiedade, depressão, autoestima, TCC, psicoterapia',
      ogImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
      author: 'Dra. Helena Martins de Castro - CRP 06/142980',
    },
    legal: {
      privacyPolicy: `A sua privacidade e a confidencialidade dos seus dados são prioridades absolutas neste espaço profissional.

1. Sigilo Profissional e Ética
Todas as informações trocadas durante o processo psicoterápico estão estritamente protegidas pelo Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005). O sigilo é inviolável, exceto em hipóteses expressamente previstas em lei ou risco iminente à vida.

2. Coleta de Dados e Contato
Ao enviar mensagens por meio do formulário de contato ou WhatsApp, coletamos apenas dados básicos de identificação (nome, telefone e e-mail) para fins exclusivos de agendamento e esclarecimento de dúvidas. Jamais solicitamos informações clínicas sensíveis por formulários públicos.

3. Segurança dos Atendimentos Online
As sessões online são realizadas em plataformas com criptografia ponta a ponta (como Google Meet e Zoom corporativo), em ambiente privativo e seguro. Recomendamos que o(a) paciente utilize fones de ouvido e esteja em local isolado.

4. Seus Direitos (LGPD)
Você tem o direito de solicitar a confirmação, correção ou eliminação dos seus dados cadastrais de contato a qualquer momento pelo nosso e-mail oficial.`,
      termsOfUse: `Termos e Condições de Atendimento e Uso do Site:

1. Natureza do Site
Este website possui finalidade puramente informativa e de contato para agendamento de consultas com a psicóloga responsável devidamente registrada no Conselho Regional de Psicologia (CRP). O conteúdo deste site não substitui a consulta psicológica ou médica individualizada.

2. Agendamentos e Política de Cancelamento
Os horários de atendimento são reservados exclusivamente para cada paciente. Em caso de necessidade de reagendamento ou cancelamento, solicitamos aviso prévio com antecedência mínima de 24 horas úteis.

3. Atendimento a Emergências
Este site e os canais de contato aqui disponibilizados NÃO são serviços de pronto-atendimento emergencial. Em situações de urgência psiquiátrica ou risco iminente, contate o CVV (188), SAMU (192) ou compareça ao pronto-atendimento hospitalar mais próximo.`,
      cfpEthicsNotice: 'Atendimento em conformidade com as diretrizes do Conselho Federal de Psicologia (CFP). Resolução CFP nº 010/2005 e Resolução CFP nº 004/2020 (Prestação de serviços psicológicos por meios de tecnologia da informação).',
    },
  },
  specialties: [
    {
      id: 'spec-1',
      title: 'Ansiedade & Síndrome do Pânico',
      slug: 'ansiedade-e-panico',
      iconName: 'Activity',
      shortDescription: 'Compreenda os gatilhos da ansiedade, reduza crises de pânico e retome o controle da sua rotina com técnicas comprovadas.',
      fullDescription: 'A ansiedade excessiva pode se manifestar em pensamentos acelerados, tensão muscular, taquicardia, insônia e medo constante do futuro. Na psicoterapia, identificamos os padrões cognitivos distorcidos e desenvolvemos estratégias práticas de autorregulação, respiração diafragmática e enfrentamento gradual para restabelecer a calma e o equilíbrio.',
      targetAudience: 'Pessoas que sentem preocupação constante, crises de angústia, medos limitantes ou sintomas físicos sem causa orgânica.',
      benefits: [
        'Identificação de gatilhos emocionais e corporais',
        'Técnicas de manejo de crises e pensamentos intrusivos',
        'Recuperação da qualidade do sono e da concentração',
        'Aumento da resiliência perante imprevistos',
      ],
      active: true,
      order: 1,
    },
    {
      id: 'spec-2',
      title: 'Autoestima & Autoconhecimento',
      slug: 'autoestima-e-autoconhecimento',
      iconName: 'Heart',
      shortDescription: 'Aprenda a silenciar a autocrítica destrutiva, reconhecer seu valor e cultivar uma relação gentil e respeitosa consigo mesmo(a).',
      fullDescription: 'A baixa autoestima impacta diretamente escolhas profissionais, relacionamentos e a capacidade de dizer não. O processo terapêutico possibilita desconstruir crenças limitantes sobre si mesmo, fortalecer a autocompaixão e construir uma autoimagem realista, autêntica e fortalecida.',
      targetAudience: 'Indivíduos com sensação frequente de insuficiência, necessidade de aprovação externa ou dificuldade em estabelecer limites saudáveis.',
      benefits: [
        'Fortalecimento da autoconfiança e segurança interna',
        'Capacidade de dizer não sem culpa',
        'Redução da comparação nociva com outras pessoas',
        'Alinhamento de escolhas com valores pessoais',
      ],
      active: true,
      order: 2,
    },
    {
      id: 'spec-3',
      title: 'Relacionamentos & Vínculos Afetivos',
      slug: 'relacionamentos-afetivos',
      iconName: 'Users',
      shortDescription: 'Desenvolva comunicação assertiva, supere términos dolorosos e aprenda a construir laços afetivos maduros e equilibrados.',
      fullDescription: 'Relações familiares, amorosas ou sociais podem ser fontes de grande crescimento ou de sofrimento intenso quando permeadas por dependência emocional, medo de abandono ou conflitos recorrentes. Trabalhamos a autonomia afetiva, a expressão clara de sentimentos e a identificação de dinâmicas tóxicas.',
      targetAudience: 'Pessoas em crise conjugal, em processo de divórcio, com histórico de dependência emocional ou dificuldades de socialização.',
      benefits: [
        'Comunicação não-violenta e assertiva',
        'Superação de lutos amorosos e rompimentos',
        'Quebra de ciclos repetitivos em relacionamentos',
        'Construção de autonomia emocional',
      ],
      active: true,
      order: 3,
    },
    {
      id: 'spec-4',
      title: 'Estresse & Síndrome de Burnout',
      slug: 'estresse-e-burnout',
      iconName: 'ZapOff',
      shortDescription: 'Recupere sua vitalidade mental e física diante do esgotamento profissional e aprenda a equilibrar trabalho e vida pessoal.',
      fullDescription: 'O Burnout é caracterizado pela exaustão emocional extrema, despersonalização e baixa realização profissional provocadas pelo estresse crônico no trabalho. A psicoterapia oferece suporte estruturado para redefinir prioridades, estabelecer limites laborais e restaurar o bem-estar biopsicossocial.',
      targetAudience: 'Profissionais sobrecarregados, líderes, pessoas com sintomas de esgotamento físico e mental decorrente do trabalho.',
      benefits: [
        'Mapeamento de fatores de sobrecarga e perfectionismo',
        'Desenvolvimento de rituais de descanso e desconexão',
        'Habilidades para negociação de prazos e demandas',
        'Prevenção de recaídas em ambientes de alta pressão',
      ],
      active: true,
      order: 4,
    },
    {
      id: 'spec-5',
      title: 'Depressão & Regulação do Humor',
      slug: 'depressao-e-humor',
      iconName: 'SunMedium',
      shortDescription: 'Apoio especializado para reencontrar o sentido, resgatar o prazer pelas atividades diárias e superar a sensação de vazio.',
      fullDescription: 'A depressão vai muito além de uma tristeza passageira: ela afeta a energia, o apetite, a cognição e a motivação. Através da ativação comportamental e reestruturação de pensamentos automáticos negativos, construímos passos concretos para a recuperação gradual do ânimo e da qualidade de vida.',
      targetAudience: 'Pessoas convivendo com desânimo persistente, perda de interesse em atividades, apatia ou alterações de humor frequentes.',
      benefits: [
        'Acolhimento sem julgamentos ou cobranças excessivas',
        'Ativação gradual de comportamentos recompensadores',
        'Compreensão profunda das origens do sofrimento',
        'Parceria com psiquiatras quando necessário suporte medicamentoso',
      ],
      active: true,
      order: 5,
    },
    {
      id: 'spec-6',
      title: 'Transições de Vida & Carreira',
      slug: 'transicoes-de-vida-e-carreira',
      iconName: 'Compass',
      shortDescription: 'Orientação psicológica para momentos de mudança: novo emprego, maternidade/paternidade, mudança de cidade ou aposentadoria.',
      fullDescription: 'Grandes mudanças geram incerteza e demandam reorganização psíquica. A terapia auxilia na tomada de decisões alinhadas ao seu propósito, reduzindo o medo do desconhecido e potencializando suas habilidades de adaptação.',
      targetAudience: 'Adultos e jovens em momentos de encruzilhada profissional, decisões de vida ou novas etapas familiares.',
      benefits: [
        'Clareza na definição de metas e próximos passos',
        'Fortalecimento da flexibilidade psicológica',
        'Superação do medo de falhar ou errar na escolha',
        'Elaboração de novos projetos de vida com segurança',
      ],
      active: true,
      order: 6,
    },
  ],
  attendance: {
    introTitle: 'Como funciona o atendimento',
    introDescription: 'Você pode optar pela modalidade que melhor se adapta à sua rotina, garantindo total conforto, sigilo e rigor técnico.',
    inPerson: {
      active: true,
      title: 'Atendimento Presencial',
      location: 'São Paulo - SP (Região da Av. Paulista)',
      duration: '50 minutos por sessão',
      description: 'Realizado em consultório acolhedor, projetado para proporcionar conforto sensorial, isolamento acústico e total privacidade durante todo o seu atendimento.',
      address: 'Av. Paulista, 1842 - Conjunto 74, Bela Vista (Próximo à estação Consolação e Trianon-Masp)',
      features: [
        'Consultório climatizado com isolamento acústico',
        'Fácil acesso por metrô, ônibus e estacionamento no local',
        'Ambiente seguro, confortável e acolhedor',
        'Horários flexíveis mediante agendamento prévio',
      ],
    },
    online: {
      active: true,
      title: 'Atendimento Online',
      platform: 'Videochamada criptografada (Google Meet / Plataforma Segura)',
      duration: '50 minutos por sessão',
      description: 'Toda a eficácia da psicoterapia no conforto e segurança do seu lar ou ambiente particular, sem necessidade de deslocamento no trânsito.',
      reach: 'Atendimento para pacientes em todo o Brasil e brasileiros residentes no exterior (compatibilidade de fuso horário).',
      features: [
        'Mesma validade científica e eficácia do presencial (reconhecido pelo CFP)',
        'Economia de tempo e flexibilidade de horários',
        'Praticidade para quem viaja com frequência ou mora fora do país',
        'Plataforma privativa e confidencial com áudio e vídeo em alta definição',
      ],
    },
    pricingNotice: 'Os valores das sessões seguem a tabela de honorários recomendada pelo Conselho Federal de Psicologia (CFP). Entre em contato pelo WhatsApp para consultar valores e formas de pagamento.',
    reimbursementNotice: 'Emitimos recibo com número de CRP para solicitação de reembolso junto ao seu plano de saúde / convênio médico.',
  },
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Primeiro Contato & Agendamento',
      description: 'Você entra em contato via WhatsApp ou formulário. Conversamos brevemente para tirar dúvidas iniciais e escolher o melhor dia e horário para sua primeira sessão.',
      iconName: 'MessageSquare',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Sessão Inicial de Acolhimento',
      description: 'Nosso primeiro encontro é focado em escutar a sua história, compreender suas queixas principais e alinhar suas expectativas em relação ao processo terapêutico.',
      iconName: 'Ear',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Definição do Plano Terapêutico',
      description: 'Juntos, estabelecemos os objetivos da terapia e a frequência recomendada (geralmente semanal), respeitando seu ritmo e suas necessidades individuais.',
      iconName: 'Target',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Acompanhamento & Desenvolvimento',
      description: 'Sessões regulares de 50 minutos onde aprofundamos o autoconhecimento, desenvolvemos ferramentas práticas e trabalhamos na superação das dificuldades.',
      iconName: 'TrendingUp',
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Evolução, Autonomia & Alta',
      description: 'Avaliações periódicas do seu progresso até que você sinta segurança e autonomia emocional para lidar com os desafios da vida sem a necessidade do acompanhamento contínuo.',
      iconName: 'Award',
    },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'Como funciona a primeira consulta de psicologia?',
      answer: 'A primeira consulta é uma conversa inicial de acolhimento e escuta. Nela, você terá um espaço seguro para relatar os motivos que o(a) levaram a buscar a terapia, seus sintomas e expectativas. Ao mesmo tempo, você conhecerá meu estilo de trabalho e combinaremos aspectos práticos como horários, frequência e modalidade.',
      category: 'Atendimento',
      active: true,
      order: 1,
    },
    {
      id: 'faq-2',
      question: 'A terapia online tem a mesma eficácia da presencial?',
      answer: 'Sim! Diversos estudos científicos internacionais e nacionais comprovam que a psicoterapia online possui eficácia equivalente à presencial. A modalidade é oficialmente regulamentada e autorizada pelo Conselho Federal de Psicologia (Resolução CFP nº 004/2020), mantendo o mesmo rigor ético e sigilo.',
      category: 'Atendimento Online',
      active: true,
      order: 2,
    },
    {
      id: 'faq-3',
      question: 'Quanto tempo dura cada sessão e qual é a frequência?',
      answer: 'Cada sessão de psicoterapia tem a duração padrão de 50 minutos. A frequência habitual é de 1 sessão por semana, especialmente no início do processo, para assegurar a continuidade do vínculo terapêutico e o avanço no plano de tratamento.',
      category: 'Atendimento',
      active: true,
      order: 3,
    },
    {
      id: 'faq-4',
      question: 'Como funciona o reembolso por convênio médico?',
      answer: 'O atendimento é particular, porém emitimos recibo e relatório profissional com número de registro no CRP para que você possa solicitar o reembolso integral ou parcial junto ao seu plano de saúde, conforme as diretrizes da ANS (Agência Nacional de Saúde Suplementar).',
      category: 'Pagamento & Reembolso',
      active: true,
      order: 4,
    },
    {
      id: 'faq-5',
      question: 'Como funciona a política de remarcação e cancelamento?',
      answer: 'Para que possamos remanejar a agenda com antecedência, pedimos que qualquer necessidade de remarcação ou cancelamento seja comunicada com pelo menos 24 horas de antecedência. Cancelamentos em prazo inferior estão sujeitos à cobrança normal do horário reservado.',
      category: 'Agendamento',
      active: true,
      order: 5,
    },
    {
      id: 'faq-6',
      question: 'Tudo o que eu falar na sessão é sigiloso?',
      answer: 'Sim, com certeza. O sigilo profissional é um dever ético fundamental regulamentado pelo Artigo 9º do Código de Ética Profissional do Psicólogo. Todas as informações compartilhadas em sessão são estritamente confidenciais e jamais serão divulgadas a terceiros sem a sua prévia autorização por escrito.',
      category: 'Ética & Sigilo',
      active: true,
      order: 6,
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      patientName: 'M. S.',
      roleOrContext: 'Paciente em atendimento online (1 ano)',
      quote: 'O acompanhamento com a Dra. Helena foi essencial para eu conseguir lidar com minhas crises de ansiedade. O acolhimento e a clareza das técnicas me deram ferramentas reais para o meu dia a dia.',
      rating: 5,
      date: 'Novembro de 2024',
      active: true,
      isSample: true,
    },
    {
      id: 'test-2',
      patientName: 'C. R.',
      roleOrContext: 'Paciente em atendimento presencial',
      quote: 'Nunca tinha feito terapia antes e tinha muito receio. Desde a primeira sessão me senti ouvida sem julgamentos. O consultório é extremamente acolhedor e seguro.',
      rating: 5,
      date: 'Janeiro de 2025',
      active: true,
      isSample: true,
    },
    {
      id: 'test-3',
      patientName: 'R. L.',
      roleOrContext: 'Paciente residente em Portugal (Atendimento Online)',
      quote: 'Mesmo morando fora do Brasil, conseguir fazer terapia com uma profissional qualificada na minha língua materna fez toda a diferença na minha adaptação no exterior.',
      rating: 5,
      date: 'Fevereiro de 2025',
      active: true,
      isSample: true,
    },
  ],
  posts: [
    {
      id: 'post-1',
      slug: 'como-identificar-e-lidar-com-a-ansiedade-no-dia-a-dia',
      title: 'Como identificar e lidar com a ansiedade no dia a dia: 5 passos práticos',
      subtitle: 'Compreenda a diferença entre a ansiedade natural e quando ela se torna prejudicial à sua saúde mental.',
      content: `A ansiedade é uma reação biológica natural e protetiva do nosso organismo diante de situações de desafio ou perigo percebido. No entanto, quando as preocupações se tornam constantes, desproporcionais e paralisantes, é sinal de que a ansiedade atingiu um nível que requer atenção e cuidado profissional.

## O que acontece no corpo durante a ansiedade?

Quando nosso cérebro interpreta uma ameaça — real ou imaginária —, o sistema nervoso autônomo libera hormônios como adrenalina e cortisol. Isso provoca:
* Aceleração dos batimentos cardíacos (taquicardia)
* Respiração curta e ofegante
* Tensão muscular nos ombros, pescoço e mandíbula
* Dificuldade de concentração e pensamentos em "efeito dominó" (catastrofização)

> "A ansiedade não é um defeito de caráter ou falta de força de vontade. É um sinal do seu corpo pedindo pausa, reorganização e escuta atenta."

## 5 passos práticos para regular a ansiedade no cotidiano

### 1. Pratique a respiração diafragmática (4-4-6)
Ao sentir o início da agitação, inspire lentamente pelo nariz expandindo a barriga por 4 segundos, segure o ar por 4 segundos e solte lentamente pela boca por 6 segundos. A expiração prolongada sinaliza ao cérebro que o perigo passou.

### 2. Questione os pensamentos catastróficos
Pergunte a si mesmo(a): *"Qual é a evidência real de que o pior vai acontecer?"* e *"Se acontecer, o que eu realmente posso fazer agora para me preparar?"*. Muitas vezes sofremos por cenários que nunca se concretizam.

### 3. Estabeleça pausas de micro-desconexão
Evite checar e-mails de trabalho ou redes sociais logo ao acordar ou antes de dormir. Reserve 15 minutos do dia para atividades prazerosas sem telas.

### 4. Organize suas tarefas em pequenas etapas
Diante de uma lista de afazeres intimidadora, escolha apenas a primeira ação de 10 minutos. O cérebro lida muito melhor com micrometas do que com metas gigantescas.

### 5. Busque acompanhamento psicológico
A psicoterapia oferece um espaço individualizado para investigar as causas profundas da sua ansiedade, desconstruir padrões de autocrítica e desenvolver estratégias duradouras de autorregulação.

---

Se você tem enfrentado momentos difíceis com a ansiedade, lembre-se de que não precisa passar por isso sozinho(a). O acolhimento profissional pode transformar sua relação com as suas emoções.`,
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      author: 'Dra. Helena Martins',
      date: '10 de Janeiro de 2025',
      category: 'Ansiedade',
      tags: ['Ansiedade', 'Saúde Mental', 'Autocuidado', 'Respiração'],
      published: true,
      seoTitle: 'Como lidar com a ansiedade no dia a dia | Dicas da Psicóloga',
      seoDescription: 'Aprenda a reconhecer os sintomas da ansiedade e confira 5 passos práticos para regular suas emoções no cotidiano.',
      views: 342,
      readTimeMinutes: 5,
    },
    {
      id: 'post-2',
      slug: 'o-que-esperar-da-sua-primeira-sessao-de-psicoterapia',
      title: 'O que esperar da sua primeira sessão de psicoterapia? Guia para iniciantes',
      subtitle: 'Tudo o que você precisa saber antes de dar o primeiro passo rumo ao autoconhecimento.',
      content: `Dar o primeiro passo para iniciar a psicoterapia pode gerar curiosidade e até um pouco de nervosismo. É muito comum se perguntar: *"O que devo falar?", "E se eu travar?", "A psicóloga vai me julgar?"*.

A resposta é simples e acolhedora: **a primeira sessão é, antes de tudo, um encontro humano e seguro.**

## Como funciona a primeira sessão?

1. **Acolhimento e escuta sem julgamentos:** Você não precisa levar um discurso pronto ou roteiro estruturado. O espaço é seu, e você pode falar livremente sobre o que estiver sentindo, no seu próprio tempo e ritmo.
2. **Compreensão das suas queixas:** Conversaremos sobre os motivos que levaram você a buscar apoio neste momento, seus sintomas e suas expectativas.
3. **Alinhamento do método de trabalho:** Apresentarei a abordagem utilizada (como a Terapia Cognitivo-Comportamental) e esclarecerei todas as suas dúvidas sobre o processo.
4. **Sigilo ético absoluto:** Tudo o que for dito em consulta fica protegido pelo sigilo profissional rigoroso estipulado pelo Código de Ética do Psicólogo.

> "A terapia não serve para consertar quem está quebrado. Serve para acolher quem quer se conhecer profundamente e viver com mais autenticidade."

## Dicas para aproveitar melhor sua sessão:

* **Esteja em um local reservado** (caso a sessão seja online), com fones de ouvido e boa conexão.
* **Permita-se ser honesto(a) consigo mesmo(a):** Não existem sentimentos certos ou errados em terapia.
* **Lembre-se de que a evolução é um processo:** Cada pessoa tem seu próprio tempo de maturação emocional.

Agendar sua primeira consulta é um ato de coragem e amor-próprio. Conte comigo nessa jornada.`,
      coverImage: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1000&auto=format&fit=crop',
      author: 'Dra. Helena Martins',
      date: '28 de Janeiro de 2025',
      category: 'Psicoterapia',
      tags: ['Psicoterapia', 'Primeira Sessão', 'Autoconhecimento', 'Terapia Online'],
      published: true,
      seoTitle: 'Primeira Sessão de Psicoterapia: Como Funciona | Dra. Helena Martins',
      seoDescription: 'Descubra como funciona a primeira consulta com uma psicóloga, o que esperar e como se preparar com tranquilidade.',
      views: 215,
      readTimeMinutes: 4,
    },
    {
      id: 'post-3',
      slug: 'sindrome-de-burnout-sinais-de-alerta-e-prevencao',
      title: 'Síndrome de Burnout: Quando o cansaço do trabalho ultrapassa o limite saudável',
      subtitle: 'Aprenda a reconhecer a diferença entre cansaço comum e o esgotamento profissional crônico.',
      content: `Em um mundo hiperconectado e focado em produtividade incessante, tornou-se comum normalizar a exaustão. No entanto, quando o cansaço não passa após o fim de semana e o trabalho se torna um fardo emocional contínuo, podemos estar diante da Síndrome de Burnout.

## Principais sinais de alerta do Burnout:

* **Exaustão emocional profunda:** Sensação de que a energia foi completamente drenada.
* **Despersonalização e cinismo:** Afastamento emocional de colegas, clientes e até de familiares; irritabilidade frequente.
* **Sensação de ineficácia:** Impressão de que nada do que você faz é suficiente ou tem valor.
* **Sintomas físicos recorrentes:** Dores de cabeça tensionais, gastrite, alterações no sono e queda na imunidade.

## Como iniciar a recuperação?

1. **Reconheça e valide seus limites:** O corpo dá sinais antes do colapso. Ignorar esses avisos prolonga o sofrimento.
2. **Aprenda a dizer não:** Estabeleça horários claros para desligar notificações de trabalho.
3. **Busque ajuda psicológica especializada:** Na terapia, trabalhamos a reestruturação de crenças sobre perfeccionismo, valor próprio atrelado à produtividade e planos práticos de autocuidado.`,
      coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1000&auto=format&fit=crop',
      author: 'Dra. Helena Martins',
      date: '12 de Fevereiro de 2025',
      category: 'Burnout & Carreira',
      tags: ['Burnout', 'Estresse', 'Trabalho', 'Saúde Mental'],
      published: true,
      seoTitle: 'Síndrome de Burnout: Sinais de Alerta e Tratamento Psicológico',
      seoDescription: 'Entenda os principais sintomas do Burnout e como a psicoterapia pode ajudar a restaurar seu bem-estar no trabalho.',
      views: 188,
      readTimeMinutes: 4,
    },
  ],
  messages: [
    {
      id: 'msg-demo-1',
      name: 'Mariana Silva',
      email: 'mariana.silva@exemplo.com',
      phone: '(11) 98765-4321',
      subject: 'Informações sobre atendimento online',
      message: 'Olá, gostaria de saber se você atende aos sábados ou no período noturno pela modalidade online. Obrigada!',
      date: '15/02/2025 às 14:30',
      read: false,
      preferredContact: 'whatsapp',
    },
  ],
  patients: [
    {
      id: 'pat-1',
      name: 'Camila Rodrigues Alves',
      phone: '(11) 98123-4567',
      email: 'camila.alves@email.com',
      birthDate: '1992-05-14',
      notes: 'Paciente prefere sessões online às terças-feiras no período da tarde.',
      status: 'active',
      createdAt: '2025-01-10T10:00:00.000Z',
      updatedAt: '2025-01-10T10:00:00.000Z',
    },
    {
      id: 'pat-2',
      name: 'Lucas Mendes Ferreira',
      phone: '(11) 97654-3210',
      email: 'lucas.mendes@email.com',
      birthDate: '1988-11-23',
      notes: 'Atendimento presencial no consultório. Foco em ansiedade e carreira.',
      status: 'active',
      createdAt: '2025-01-15T14:30:00.000Z',
      updatedAt: '2025-01-15T14:30:00.000Z',
    },
    {
      id: 'pat-3',
      name: 'Beatriz Costa Lima',
      phone: '(11) 99887-7665',
      email: 'beatriz.lima@email.com',
      birthDate: '1995-08-30',
      notes: 'Atendimento online quinzenal.',
      status: 'active',
      createdAt: '2025-02-01T09:00:00.000Z',
      updatedAt: '2025-02-01T09:00:00.000Z',
    },
  ],
  appointments: [
    {
      id: 'apt-1',
      patientId: 'pat-1',
      patientName: 'Camila Rodrigues Alves',
      patientPhone: '(11) 98123-4567',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      durationMinutes: 50,
      modality: 'online',
      status: 'confirmada',
      accessCode: 'HM-482915',
      adminNotes: 'Sessão semanal de acompanhamento.',
      publicMessage: 'Sua sessão será realizada via link seguro do Google Meet. Por favor, utilize fones de ouvido.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-2',
      patientId: 'pat-2',
      patientName: 'Lucas Mendes Ferreira',
      patientPhone: '(11) 97654-3210',
      date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
      time: '16:00',
      durationMinutes: 50,
      modality: 'presencial',
      status: 'agendada',
      accessCode: 'HM-731904',
      adminNotes: 'Recepção no consultório - Sala 402.',
      publicMessage: 'Atendimento presencial no consultório. Chegue com 5 minutos de antecedência.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  privateActivities: [
    {
      id: 'act-1',
      title: 'Supervisão Clínica & Discussão de Casos',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:30',
      endTime: '12:00',
      type: 'reuniao',
      notes: 'Supervisão com o grupo de TCC.',
      status: 'agendado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'act-2',
      title: 'Estudo Teórico & Atualização CFP',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '11:00',
      type: 'estudo',
      notes: 'Leitura de artigos científicos sobre regulação emocional.',
      status: 'agendado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  lastUpdated: new Date().toISOString(),
};
