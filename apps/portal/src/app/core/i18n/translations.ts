import { AppLanguage } from './language.model';

type TranslationMap = Record<string, string>;

export const TRANSLATIONS: Record<AppLanguage, TranslationMap> = {
  pt: {
    // Language toggle
    'language.current': 'PT',
    'language.switchTo': 'EN',

    // Topbar
    'brand.aiSolutions': 'Soluções em IA',
    'topbar.humanContact': 'Falar com um humano ↗',
    'topbar.humanContactShort': 'Falar com humano',
    'topbar.statusOnline': 'Sistema online',
    'topbar.mockAi': 'IA mockada',

    // Sidebar nav
    'nav.explore': 'Explorar',
    'nav.talkToAi': 'Falar com a IA',
    'nav.ourApps': 'Nossos apps',
    'nav.systems': 'Sistemas',
    'nav.forge': 'Trevvos Forge',
    'nav.flow': 'Trevvos Flow',
    'nav.kmOne': 'KM One',
    'nav.community': 'Comunidade',
    'nav.testersGroup': 'Grupo de testadores',
    'nav.podcast': 'Podcast',
    'nav.actions': 'Ações',
    'nav.automations': 'Automações',
    'nav.neuralBlog': 'Blog Neural',
    'nav.creator': 'Criador',
    'nav.humanContact': 'Contato humano',
    'badge.super': 'super',
    'badge.play': 'play',
    'badge.tests': 'testes',

    // Right panel
    'panel.trevvos': 'Trevvos',
    'panel.core': 'Core',
    'panel.online': 'online',
    'panel.mode': 'Modo',
    'panel.module': 'Módulo',
    'panel.llmCore': 'LLM Core',
    'panel.voice': 'Voz',
    'panel.products': 'Produtos',
    'panel.session': 'Sessão',
    'panel.messages': 'Mensagens',
    'panel.environment': 'Ambiente',
    'panel.mock': 'Mock',
    'panel.sound': 'Som',
    'panel.soundOn': 'Som ON',
    'panel.soundOff': 'Som OFF',
    'panel.resetSession': 'Resetar sessão',

    // Mode labels
    'mode.auto': 'Automático',
    'mode.admin': 'Admin',
    'mode.profile': 'Perfil',
    'mode.conversation': 'Conversa',

    // Chat
    'chat.suggestionsLabel': 'O que você quer fazer hoje?',
    'chat.expandResponse': 'Expandir resposta',
    'chat.freeConversation': 'conversa livre',
    'chat.automaticFlow': 'fluxo automático',
    'chat.profile': 'perfil',
    'chat.admin': 'admin',
    'chat.inputPlaceholder': 'Descreva o que precisa ou escolha uma opção acima...',
    'chat.microphoneSoon': 'Microfone em breve',
    'chat.send': 'Enviar',

    // Modals
    'modal.responseViewer': 'TREVVOS RESPONSE VIEWER',
    'modal.responseDetails': 'Detalhes da resposta',
    'modal.origin': 'Origem',
    'modal.trevvosCore': 'Trevvos Core',
    'modal.user': 'Usuário',
    'modal.closeWindow': 'Fechar janela',
    'admin.core': 'TREVVOS ADMIN CORE',
    'admin.restrictedAccess': 'Acesso restrito',
    'admin.authRequired': 'AUTH REQUIRED',
    'admin.user': 'Usuário',
    'admin.password': 'Senha',
    'admin.authenticate': 'Autenticar',

    // Mobile topbar title/subtitle
    'mobile.title.home': 'Trevvos',
    'mobile.title.agent': 'Assistente Trevvos',
    'mobile.title.content': 'Conteúdo',
    'mobile.subtitle.home': 'Soluções em IA',
    'mobile.subtitle.agent': 'Seu parceiro de IA',
    'mobile.subtitle.content': 'Insights que geram valor',

    // Bottom nav
    'mobile.nav.home': 'Home',
    'mobile.nav.agent': 'Assistente',
    'mobile.nav.content': 'Conteúdo',

    // Mobile home
    'mobile.home.eyebrow': 'IA • DADOS • AUTOMAÇÃO',
    'mobile.home.headlinePrefix': 'Soluções em IA que impulsionam',
    'mobile.home.headlineHighlight': 'resultados reais',
    'mobile.home.description': 'Tecnologia, conhecimento e pessoas trabalhando juntos para transformar desafios em evolução.',
    'mobile.home.cta': 'Falar com a IA',
    'mobile.home.products': 'Nossos produtos',
    'mobile.home.purposeTitle': 'Inovação com propósito',
    'mobile.home.purposeDescription': 'Combinamos IA, dados e experiência humana para criar soluções escaláveis, úteis e centradas em pessoas.',
    'mobile.home.community': 'Comunidade',

    // Mobile product descriptions
    'mobile.product.forge.desc': 'IA local-first para análise de código, planejamento, testes, diffs e documentação técnica.',
    'mobile.product.kmOne.desc': 'Inteligência para motoristas de app analisarem corridas, metas, combustível e lucro.',
    'mobile.product.flow.desc': 'Todo list com IA que sugere itens e permite listas compartilhadas sem login.',
    'mobile.product.podcast.desc': 'Conversas sobre IA, tecnologia, produtos digitais e bastidores da Trevvos.',

    // Mobile community
    'mobile.community.testersTitle': 'Grupo de testadores',
    'mobile.community.testersText': 'Seja um dos primeiros a testar o KM One antes do lançamento.',
    'mobile.community.testersAction': 'Entrar no grupo',
    'mobile.community.humanTitle': 'Falar com humano',
    'mobile.community.humanText': 'Prefere conversar direto? Chame a Trevvos no WhatsApp.',
    'mobile.community.humanAction': 'Abrir WhatsApp',

    // Mobile content / blog tab
    'mobile.content.featuredBadge': 'DESTAQUE',
    'mobile.content.emptyState': 'Nenhum post nesta categoria ainda.',
    'mobile.content.ctaTitle': 'Quer aprofundar este tema?',
    'mobile.content.ctaSubtitle': 'Pergunte para a IA e receba insights personalizados.',

    // Blog category chips
    'mobile.category.all': 'Todos',
    'mobile.category.ai': 'IA',
    'mobile.category.automation': 'Automação',
    'mobile.category.data': 'Dados',
    'mobile.category.business': 'Negócios',
    'mobile.category.kmOne': 'KM One',
    'mobile.category.engineering': 'Engenharia',

    // Blog post content
    'mobile.blog.post1.title': 'IA Generativa: como transformar dados em decisões inteligentes',
    'mobile.blog.post1.summary': 'Entenda as aplicações práticas e o impacto real da IA nos negócios.',
    'mobile.blog.post1.readingTime': '5 min de leitura',
    'mobile.blog.post2.title': 'Automação inteligente: o futuro da eficiência operacional',
    'mobile.blog.post2.summary': 'Como fluxos automatizados com IA reduzem tarefas repetitivas e aceleram decisões.',
    'mobile.blog.post2.readingTime': '7 min de leitura',
    'mobile.blog.post3.title': 'Governança de dados: o alicerce para a IA confiável',
    'mobile.blog.post3.summary': 'Antes de automatizar decisões, empresas precisam organizar, proteger e qualificar seus dados.',
    'mobile.blog.post3.readingTime': '6 min de leitura',
    'mobile.blog.post4.title': 'KM One na prática: inteligência para motoristas de app',
    'mobile.blog.post4.summary': 'Como motoristas podem usar dados para avaliar corridas, metas, combustível e lucro.',
    'mobile.blog.post4.readingTime': '4 min de leitura',
    'mobile.blog.post5.title': 'Trevvos Forge: IA aplicada ao ciclo real de desenvolvimento',
    'mobile.blog.post5.summary': 'Uma visão sobre análise de código, planejamento técnico, testes, diffs e documentação com LLM local.',
    'mobile.blog.post5.readingTime': '8 min de leitura',
  },
  en: {
    // Language toggle
    'language.current': 'EN',
    'language.switchTo': 'PT',

    // Topbar
    'brand.aiSolutions': 'AI Solutions',
    'topbar.humanContact': 'Talk to a human ↗',
    'topbar.humanContactShort': 'Talk to human',
    'topbar.statusOnline': 'System online',
    'topbar.mockAi': 'Mock AI',

    // Sidebar nav
    'nav.explore': 'Explore',
    'nav.talkToAi': 'Talk to AI',
    'nav.ourApps': 'Our apps',
    'nav.systems': 'Systems',
    'nav.forge': 'Trevvos Forge',
    'nav.flow': 'Trevvos Flow',
    'nav.kmOne': 'KM One',
    'nav.community': 'Community',
    'nav.testersGroup': 'Testers group',
    'nav.podcast': 'Podcast',
    'nav.actions': 'Actions',
    'nav.automations': 'Automations',
    'nav.neuralBlog': 'Neural Blog',
    'nav.creator': 'Creator',
    'nav.humanContact': 'Human contact',
    'badge.super': 'super',
    'badge.play': 'play',
    'badge.tests': 'tests',

    // Right panel
    'panel.trevvos': 'Trevvos',
    'panel.core': 'Core',
    'panel.online': 'online',
    'panel.mode': 'Mode',
    'panel.module': 'Module',
    'panel.llmCore': 'LLM Core',
    'panel.voice': 'Voice',
    'panel.products': 'Products',
    'panel.session': 'Session',
    'panel.messages': 'Messages',
    'panel.environment': 'Environment',
    'panel.mock': 'Mock',
    'panel.sound': 'Sound',
    'panel.soundOn': 'Sound ON',
    'panel.soundOff': 'Sound OFF',
    'panel.resetSession': 'Reset session',

    // Mode labels
    'mode.auto': 'Automatic',
    'mode.admin': 'Admin',
    'mode.profile': 'Profile',
    'mode.conversation': 'Conversation',

    // Chat
    'chat.suggestionsLabel': 'What do you want to do today?',
    'chat.expandResponse': 'Expand response',
    'chat.freeConversation': 'free conversation',
    'chat.automaticFlow': 'automatic flow',
    'chat.profile': 'profile',
    'chat.admin': 'admin',
    'chat.inputPlaceholder': 'Describe what you need or choose an option above...',
    'chat.microphoneSoon': 'Microphone coming soon',
    'chat.send': 'Send',

    // Modals
    'modal.responseViewer': 'TREVVOS RESPONSE VIEWER',
    'modal.responseDetails': 'Response details',
    'modal.origin': 'Origin',
    'modal.trevvosCore': 'Trevvos Core',
    'modal.user': 'User',
    'modal.closeWindow': 'Close window',
    'admin.core': 'TREVVOS ADMIN CORE',
    'admin.restrictedAccess': 'Restricted access',
    'admin.authRequired': 'AUTH REQUIRED',
    'admin.user': 'User',
    'admin.password': 'Password',
    'admin.authenticate': 'Authenticate',

    // Mobile topbar title/subtitle
    'mobile.title.home': 'Trevvos',
    'mobile.title.agent': 'Trevvos Assistant',
    'mobile.title.content': 'Content',
    'mobile.subtitle.home': 'AI Solutions',
    'mobile.subtitle.agent': 'Your AI partner',
    'mobile.subtitle.content': 'Insights that create value',

    // Bottom nav
    'mobile.nav.home': 'Home',
    'mobile.nav.agent': 'Assistant',
    'mobile.nav.content': 'Content',

    // Mobile home
    'mobile.home.eyebrow': 'AI • DATA • AUTOMATION',
    'mobile.home.headlinePrefix': 'AI solutions that drive',
    'mobile.home.headlineHighlight': 'real results',
    'mobile.home.description': 'Technology, knowledge, and people working together to turn challenges into progress.',
    'mobile.home.cta': 'Talk to AI',
    'mobile.home.products': 'Our products',
    'mobile.home.purposeTitle': 'Innovation with purpose',
    'mobile.home.purposeDescription': 'We combine AI, data, and human experience to create scalable, useful, people-centered solutions.',
    'mobile.home.community': 'Community',

    // Mobile product descriptions
    'mobile.product.forge.desc': 'Local-first AI for code analysis, planning, tests, diffs, and technical documentation.',
    'mobile.product.kmOne.desc': 'Intelligence for app drivers to analyze rides, goals, fuel, and profit.',
    'mobile.product.flow.desc': 'AI-powered todo list that suggests items and supports shared lists without login.',
    'mobile.product.podcast.desc': 'Conversations about AI, technology, digital products, and Trevvos behind the scenes.',

    // Mobile community
    'mobile.community.testersTitle': 'Testers group',
    'mobile.community.testersText': 'Be one of the first to test KM One before launch.',
    'mobile.community.testersAction': 'Join the group',
    'mobile.community.humanTitle': 'Talk to human',
    'mobile.community.humanText': 'Prefer to talk directly? Message Trevvos on WhatsApp.',
    'mobile.community.humanAction': 'Open WhatsApp',

    // Mobile content / blog tab
    'mobile.content.featuredBadge': 'FEATURED',
    'mobile.content.emptyState': 'No posts in this category yet.',
    'mobile.content.ctaTitle': 'Want to go deeper on this topic?',
    'mobile.content.ctaSubtitle': 'Ask the AI and get personalized insights.',

    // Blog category chips
    'mobile.category.all': 'All',
    'mobile.category.ai': 'AI',
    'mobile.category.automation': 'Automation',
    'mobile.category.data': 'Data',
    'mobile.category.business': 'Business',
    'mobile.category.kmOne': 'KM One',
    'mobile.category.engineering': 'Engineering',

    // Blog post content
    'mobile.blog.post1.title': 'Generative AI: how to turn data into intelligent decisions',
    'mobile.blog.post1.summary': 'Understand practical applications and the real impact of AI in business.',
    'mobile.blog.post1.readingTime': '5 min read',
    'mobile.blog.post2.title': 'Intelligent automation: the future of operational efficiency',
    'mobile.blog.post2.summary': 'How AI-powered automated flows reduce repetitive tasks and speed up decisions.',
    'mobile.blog.post2.readingTime': '7 min read',
    'mobile.blog.post3.title': 'Data governance: the foundation for trustworthy AI',
    'mobile.blog.post3.summary': 'Before automating decisions, companies need to organize, protect, and qualify their data.',
    'mobile.blog.post3.readingTime': '6 min read',
    'mobile.blog.post4.title': 'KM One in practice: intelligence for app drivers',
    'mobile.blog.post4.summary': 'How drivers can use data to evaluate rides, goals, fuel, and profit.',
    'mobile.blog.post4.readingTime': '4 min read',
    'mobile.blog.post5.title': 'Trevvos Forge: AI applied to the real development cycle',
    'mobile.blog.post5.summary': 'A look at code analysis, technical planning, tests, diffs, and documentation with a local LLM.',
    'mobile.blog.post5.readingTime': '8 min read',
  },
};
