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
  },
};
