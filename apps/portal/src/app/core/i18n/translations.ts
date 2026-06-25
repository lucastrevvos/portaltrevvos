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

    // Desktop blog cockpit
    'desktop.blog.kicker': 'BLOG NEURAL',
    'desktop.blog.description': 'IA aplicada, engenharia, automação, produtos e aprendizados reais.',
    'desktop.blog.searchPlaceholder': 'Buscar artigos...',
    'desktop.blog.featuredBadge': 'DESTAQUE',
    'desktop.blog.readInConsole': 'Ler no console ↗',
    'desktop.blog.askAi': 'Perguntar para IA ✦',
    'desktop.blog.emptyState': 'Nenhum post nesta categoria.',
    'desktop.blog.ctaTitle': 'Quer aprofundar este tema?',
    'desktop.blog.ctaText': 'Pergunte para a IA e receba insights personalizados com base no conteúdo do blog.',
    'desktop.blog.categoriesTitle': 'Categorias',
    'desktop.blog.latestTitle': 'Últimos posts',
    'desktop.blog.viewAllCategories': 'Ver todas as categorias →',
    'desktop.blog.viewAllPosts': 'Ver todos os posts →',

    // Desktop categories
    'desktop.category.all': 'Todos',
    'desktop.category.ai': 'IA',
    'desktop.category.automation': 'Automação',
    'desktop.category.engineering': 'Engenharia',
    'desktop.category.kmOne': 'KM One',
    'desktop.category.forge': 'Forge',
    'desktop.category.product': 'Produto',

    // Desktop featured post
    'desktop.blog.featured.category': 'IA Generativa',
    'desktop.blog.featured.readingTime': '5 min de leitura',
    'desktop.blog.featured.dateLabel': 'Destaque',
    'desktop.blog.featured.title': 'IA Generativa: como transformar dados em decisões inteligentes',
    'desktop.blog.featured.summary': 'Entenda como modelos generativos e engenharia de contexto estão mudando a forma como empresas tomam decisões e criam valor com seus dados.',

    // Desktop posts
    'desktop.blog.automation.category': 'Automação',
    'desktop.blog.automation.readingTime': '6 min de leitura',
    'desktop.blog.automation.dateLabel': 'Hoje',
    'desktop.blog.automation.title': 'Automação inteligente: o futuro da eficiência operacional',
    'desktop.blog.automation.summary': 'Como a automação com IA reduz custos, erros e libera pessoas para o que realmente importa.',
    'desktop.blog.governance.category': 'Engenharia',
    'desktop.blog.governance.readingTime': '7 min de leitura',
    'desktop.blog.governance.dateLabel': 'Ontem',
    'desktop.blog.governance.title': 'Governança de dados: o alicerce para a IA confiável',
    'desktop.blog.governance.summary': 'Princípios e práticas para garantir qualidade, segurança e rastreabilidade dos dados em projetos de IA.',
    'desktop.blog.kmOne.category': 'KM One',
    'desktop.blog.kmOne.readingTime': '5 min de leitura',
    'desktop.blog.kmOne.dateLabel': '2 dias atrás',
    'desktop.blog.kmOne.title': 'KM One na prática: inteligência para motoristas de app',
    'desktop.blog.kmOne.summary': 'Como o KM One usa dados para ajudar motoristas a analisarem corridas, metas, combustível e lucro.',
    'desktop.blog.forge.category': 'Forge',
    'desktop.blog.forge.readingTime': '6 min de leitura',
    'desktop.blog.forge.dateLabel': '3 dias atrás',
    'desktop.blog.forge.title': 'Trevvos Forge: IA aplicada ao ciclo real de desenvolvimento',
    'desktop.blog.forge.summary': 'Da análise ao deploy: como usamos IA para acelerar entregas com qualidade e foco no valor do produto.',
    'desktop.blog.localAi.category': 'IA',
    'desktop.blog.localAi.readingTime': '6 min de leitura',
    'desktop.blog.localAi.dateLabel': '5 dias atrás',
    'desktop.blog.localAi.title': 'IA local e produtividade em engenharia',
    'desktop.blog.localAi.summary': 'Como rodar modelos localmente aumenta produtividade sem abrir mão de segurança e privacidade.',
    'desktop.blog.product.category': 'Produto',
    'desktop.blog.product.readingTime': '5 min de leitura',
    'desktop.blog.product.dateLabel': '1 semana atrás',
    'desktop.blog.product.title': 'Como produtos com IA geram valor real',
    'desktop.blog.product.summary': 'Estratégias para conectar tecnologia, experiência do usuário e métricas de negócio.',

    // Desktop sidebar latest posts
    'desktop.blog.latest.roi': 'Como medir ROI em projetos de IA',
    'desktop.blog.latest.observability': 'Observabilidade em sistemas inteligentes',
    'desktop.blog.latest.prompts': 'Boas práticas para prompts corporativos',

    // Desktop article modal
    'desktop.article.viewer': 'TREVVOS ARTICLE VIEWER',
    'desktop.article.askAbout': 'Perguntar para IA sobre este artigo ✦',
    'desktop.article.paragraph1': 'Este artigo faz parte do Blog Neural da Trevvos, uma área dedicada a explorar aplicações práticas de IA, automação, engenharia de software e produtos digitais.',
    'desktop.article.paragraph2': 'A proposta é transformar conceitos técnicos em decisões de produto, mostrando como tecnologia, dados e experiência humana podem gerar valor real.',

    // Jarvis agent messages
    'jarvis.online.title': 'Agente Trevvos online',
    'jarvis.online.content': 'Pode me perguntar qualquer coisa — sobre soluções, produtos, automação, IA aplicada, Trevvos Forge, Trevvos Flow, KM One ou sistemas sob medida.',
    'jarvis.reset.content': 'Sessão reiniciada. Pode me perguntar sobre soluções, produtos, IA aplicada, automações, Trevvos Flow ou sistemas sob medida.',
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

    // Desktop blog cockpit
    'desktop.blog.kicker': 'NEURAL BLOG',
    'desktop.blog.description': 'Applied AI, engineering, automation, products, and real-world learnings.',
    'desktop.blog.searchPlaceholder': 'Search articles...',
    'desktop.blog.featuredBadge': 'FEATURED',
    'desktop.blog.readInConsole': 'Read in console ↗',
    'desktop.blog.askAi': 'Ask AI ✦',
    'desktop.blog.emptyState': 'No posts in this category.',
    'desktop.blog.ctaTitle': 'Want to go deeper?',
    'desktop.blog.ctaText': 'Ask the AI and get personalized insights based on the blog content.',
    'desktop.blog.categoriesTitle': 'Categories',
    'desktop.blog.latestTitle': 'Latest posts',
    'desktop.blog.viewAllCategories': 'View all categories →',
    'desktop.blog.viewAllPosts': 'View all posts →',

    // Desktop categories
    'desktop.category.all': 'All',
    'desktop.category.ai': 'AI',
    'desktop.category.automation': 'Automation',
    'desktop.category.engineering': 'Engineering',
    'desktop.category.kmOne': 'KM One',
    'desktop.category.forge': 'Forge',
    'desktop.category.product': 'Product',

    // Desktop featured post
    'desktop.blog.featured.category': 'Generative AI',
    'desktop.blog.featured.readingTime': '5 min read',
    'desktop.blog.featured.dateLabel': 'Featured',
    'desktop.blog.featured.title': 'Generative AI: how to turn data into intelligent decisions',
    'desktop.blog.featured.summary': 'Understand how generative models and context engineering are changing how companies make decisions and create value from their data.',

    // Desktop posts
    'desktop.blog.automation.category': 'Automation',
    'desktop.blog.automation.readingTime': '6 min read',
    'desktop.blog.automation.dateLabel': 'Today',
    'desktop.blog.automation.title': 'Intelligent automation: the future of operational efficiency',
    'desktop.blog.automation.summary': 'How AI automation reduces costs, errors, and frees people to focus on what really matters.',
    'desktop.blog.governance.category': 'Engineering',
    'desktop.blog.governance.readingTime': '7 min read',
    'desktop.blog.governance.dateLabel': 'Yesterday',
    'desktop.blog.governance.title': 'Data governance: the foundation for trustworthy AI',
    'desktop.blog.governance.summary': 'Principles and practices to ensure data quality, security, and traceability in AI projects.',
    'desktop.blog.kmOne.category': 'KM One',
    'desktop.blog.kmOne.readingTime': '5 min read',
    'desktop.blog.kmOne.dateLabel': '2 days ago',
    'desktop.blog.kmOne.title': 'KM One in practice: intelligence for app drivers',
    'desktop.blog.kmOne.summary': 'How KM One uses data to help drivers analyze rides, goals, fuel, and profit.',
    'desktop.blog.forge.category': 'Forge',
    'desktop.blog.forge.readingTime': '6 min read',
    'desktop.blog.forge.dateLabel': '3 days ago',
    'desktop.blog.forge.title': 'Trevvos Forge: AI applied to the real development cycle',
    'desktop.blog.forge.summary': 'From analysis to deployment: how we use AI to speed up delivery with quality and product value in mind.',
    'desktop.blog.localAi.category': 'AI',
    'desktop.blog.localAi.readingTime': '6 min read',
    'desktop.blog.localAi.dateLabel': '5 days ago',
    'desktop.blog.localAi.title': 'Local AI and engineering productivity',
    'desktop.blog.localAi.summary': 'How running models locally increases productivity without giving up security and privacy.',
    'desktop.blog.product.category': 'Product',
    'desktop.blog.product.readingTime': '5 min read',
    'desktop.blog.product.dateLabel': '1 week ago',
    'desktop.blog.product.title': 'How AI products create real value',
    'desktop.blog.product.summary': 'Strategies to connect technology, user experience, and business metrics.',

    // Desktop sidebar latest posts
    'desktop.blog.latest.roi': 'How to measure ROI in AI projects',
    'desktop.blog.latest.observability': 'Observability in intelligent systems',
    'desktop.blog.latest.prompts': 'Best practices for enterprise prompts',

    // Desktop article modal
    'desktop.article.viewer': 'TREVVOS ARTICLE VIEWER',
    'desktop.article.askAbout': 'Ask AI about this article ✦',
    'desktop.article.paragraph1': 'This article is part of Trevvos Neural Blog, an area dedicated to exploring practical applications of AI, automation, software engineering, and digital products.',
    'desktop.article.paragraph2': 'The goal is to turn technical concepts into product decisions, showing how technology, data, and human experience can create real value.',

    // Jarvis agent messages
    'jarvis.online.title': 'Trevvos Agent online',
    'jarvis.online.content': 'Ask me anything — about solutions, products, automation, applied AI, Trevvos Forge, Trevvos Flow, KM One, or custom systems.',
    'jarvis.reset.content': 'Session restarted. Ask me about solutions, products, applied AI, automations, Trevvos Flow, or custom systems.',
  },
};
