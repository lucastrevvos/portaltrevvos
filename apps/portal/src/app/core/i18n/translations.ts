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
  },
};
