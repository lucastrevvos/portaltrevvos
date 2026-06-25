import { Injectable } from '@angular/core';
import {
  JarvisInteraction,
  JarvisMessageAction,
  JarvisModule,
  JarvisModuleInfo,
  JarvisProductLink,
  JarvisProfile,
} from '../models/jarvis.model';
import { AppLanguage } from '../i18n/language.model';

@Injectable({
  providedIn: 'root',
})
export class JarvisMockService {
  private readonly humanWhatsAppUrl =
    'https://wa.me/5511945043408?text=Ol%C3%A1%2C%20vim%20pelo%20portal%20da%20Trevvos%20e%20quero%20falar%20com%20um%20humano.';

  private readonly trevvosFlowPlayStoreUrl =
    'https://play.google.com/store/apps/details?id=com.lucasamaral.todolistrevvos';

  private readonly forgeGithubUrl = 'https://github.com/lucastrevvos/trevvos-forge';
  private readonly kmOneLandingUrl = 'https://kmone.trevvos.com.br';
  private readonly testerGroupUrl = 'https://chat.whatsapp.com/K1cepLtEEoY6pScVRTNvg9';
  private readonly podcastUrl = 'https://open.spotify.com/show/7xvDpbP6wuoZi8coSgTFkY';

  getHumanWhatsAppUrl(): string {
    return this.humanWhatsAppUrl;
  }

  getTesterGroupUrl(): string {
    return this.testerGroupUrl;
  }

  getPodcastUrl(): string {
    return this.podcastUrl;
  }

  getInteraction(question: string, language: AppLanguage = 'pt'): JarvisInteraction {
    const normalized = this.normalize(question);
    const en = language === 'en';

    if (this.containsAny(normalized, ['trevvos modo admin', 'modo admin', 'trevvos admin mode', 'admin mode', 'admin'])) {
      return {
        type: 'admin',
        mode: 'admin',
        activeModule: 'admin',
        ack: en ? 'Administrative access requested.' : 'Acesso administrativo solicitado.',
        title: en ? 'Restricted access' : 'Acesso restrito',
        content: en
          ? 'Authentication required to access the Trevvos administrative core.'
          : 'Autenticação necessária para acessar o núcleo administrativo da Trevvos.',
      };
    }

    if (
      this.containsAny(normalized, [
        'lucas amaral',
        'lucas do amaral',
        'criador',
        'autor',
        'fundador',
        'ceo',
        'quem criou',
        'quem fez',
        'portfolio',
        'portfólio',
        'curriculo',
        'currículo',
        'cv',
        'meet the creator',
        'who is lucas',
        'creator',
        'founder',
        'resume',
      ])
    ) {
      return {
        type: 'module',
        mode: 'profile',
        activeModule: 'creator',
        ack: en ? 'Loading creator profile.' : 'Carregando perfil do criador.',
        title: 'Lucas Amaral',
        content: en
          ? 'Lucas Amaral is the creator of Trevvos and the developer behind this portal. He works with software engineering, applied AI, automation, and digital product development.'
          : 'Lucas Amaral é o criador da Trevvos e desenvolvedor responsável por este portal. Atua com engenharia de software, IA aplicada, automação e desenvolvimento de produtos digitais.',
        profile: this.creatorProfile(language),
      };
    }

    if (
      this.containsAny(normalized, [
        'trevvos flow',
        'flow',
        'todo list',
        'todolist',
        'lista de tarefas',
        'listas compartilhadas',
        'lista compartilhada',
        'tarefas com ia',
        'app de tarefas',
        'shared list',
        'task app',
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'flow',
        ack: en ? 'Opening Trevvos Flow module.' : 'Abrindo módulo Trevvos Flow.',
        title: 'Trevvos Flow',
        content: en
          ? 'Trevvos Flow is an AI-powered task list app. It suggests completing the list based on the title and items already added, and allows creating shared lists without requiring login. The app is available on Google Play.'
          : 'O Trevvos Flow é um app de listas de tarefas com IA aplicada. Ele sugere completar a lista com base no título e nos itens já adicionados, além de permitir criar listas compartilhadas sem exigir login. O app já está disponível na Google Play.',
        actions: [
          {
            label: en ? 'Open on Google Play' : 'Abrir na Google Play',
            url: this.trevvosFlowPlayStoreUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (
      this.containsAny(normalized, [
        'forge',
        'trevvos forge',
        'dev library',
        'biblioteca',
        'llm local',
        'codigo',
        'código',
        'code',
        'local ai',
        'dev tool',
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'forge',
        ack: en ? 'Opening Trevvos Forge module.' : 'Abrindo módulo Trevvos Forge.',
        title: 'Trevvos Forge',
        content: en
          ? 'Trevvos Forge is Trevvos\' flagship engineering product — a local-first AI platform for developers.\n\nWith it, devs can:\n• Analyze code with real project context\n• Plan features and architecture with AI\n• Generate automated tests\n• Create and review technical documentation\n• Review diffs before committing\n• Run structured sessions with local LLMs via Ollama or external APIs\n\nThe goal is to maintain full control over context, history, and workflow without relying on the cloud for the core engineering cycle. The project is open source and actively developed on GitHub.'
          : 'O Trevvos Forge é o principal produto de engenharia da Trevvos — uma plataforma local-first de IA para desenvolvedores.\n\nCom ele, devs podem:\n• Analisar código com contexto real do projeto\n• Planejar features e arquitetura com IA\n• Gerar testes automatizados\n• Criar e revisar documentação técnica\n• Revisar diffs antes de commitar\n• Conduzir sessões estruturadas com LLMs locais via Ollama ou APIs externas\n\nA proposta é manter controle total do contexto, histórico e fluxo sem depender de nuvem para o ciclo core de engenharia. O projeto é open source e está em desenvolvimento ativo no GitHub.',
        actions: [
          {
            label: en ? 'View on GitHub ↗' : 'Ver no GitHub ↗',
            url: this.forgeGithubUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (this.containsAny(normalized, ['km one', 'motorista', 'corrida', 'uber', '99', 'driver', 'ride', 'rides'])) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'kmOne',
        ack: en ? 'Loading KM One module.' : 'Carregando módulo KM One.',
        title: 'KM One',
        content: en
          ? 'KM One is a Trevvos product for operational intelligence for app drivers on platforms like Uber and 99. It helps interpret rides, goals, profit, and fuel costs with greater clarity for better daily decisions.\n\nWe are actively recruiting drivers for the testing phase. If you are a driver or know one, visit the landing page and sign up to participate.'
          : 'O KM One é um produto Trevvos para inteligência operacional de motoristas de apps como Uber e 99. Ele ajuda a interpretar corridas, metas, lucro e combustível com mais clareza e tomar decisões melhores no dia a dia.\n\nEstamos recrutando ativamente motoristas para a fase de testes. Se você é motorista ou conhece um, acesse a landing page e se cadastre para participar.',
        actions: [
          {
            label: en ? 'Open kmone.trevvos.com.br ↗' : 'Acessar kmone.trevvos.com.br ↗',
            url: this.kmOneLandingUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (
      this.containsAny(normalized, [
        'automatizar',
        'automação',
        'automacao',
        'processo',
        'fluxo',
        'fluxos',
        'automate',
        'automation',
        'automations',
        'workflow',
        'workflows',
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'automation',
        ack: en ? 'Mapping automation possibilities.' : 'Mapeando possibilidades de automação.',
        title: en ? 'AI Automation' : 'Automação com IA',
        content: en
          ? 'Trevvos can design AI-powered automations to reduce repetitive tasks, connect systems, generate responses, analyze data, and support decisions. The ideal starting point is mapping the current workflow and identifying where AI genuinely saves time.'
          : 'A Trevvos pode projetar automações com IA para reduzir tarefas repetitivas, conectar sistemas, gerar respostas, analisar dados e apoiar decisões. O ideal é começar mapeando o fluxo atual e identificando onde a IA realmente economiza tempo.',
        actions: this.humanContactActions(language),
      };
    }

    if (
      this.containsAny(normalized, [
        'sistema',
        'sob medida',
        'personalizado',
        'negócio',
        'negocio',
        'empresa',
        'system',
        'systems',
        'custom system',
        'custom',
        'enterprise',
        'business',
        'company',
      ])
    ) {
      return {
        type: 'module',
        mode: 'conversation',
        activeModule: 'systems',
        ack: en ? 'Analyzing custom system needs.' : 'Analisando necessidade de sistema sob medida.',
        title: en ? 'Custom systems' : 'Sistemas sob medida',
        content: en
          ? 'Trevvos builds custom systems with AI when an off-the-shelf solution doesn\'t solve the problem well. The ideal path is understanding the bottleneck, mapping the flow, defining the architecture, and only then building the product. You can also speak directly with a human via WhatsApp.'
          : 'A Trevvos desenvolve sistemas personalizados com IA quando uma solução pronta não resolve bem o problema. O caminho ideal é entender o gargalo, desenhar o fluxo, definir arquitetura e só então implementar o produto. Se preferir, você pode falar diretamente com um humano pelo WhatsApp.',
        actions: this.humanContactActions(language),
      };
    }

    if (
      this.containsAny(normalized, [
        'apps',
        'aplicativos',
        'produtos',
        'soluções prontas',
        'solucoes prontas',
        'products',
        'applications',
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'apps',
        ack: en ? 'Listing Trevvos products.' : 'Listando produtos Trevvos.',
        title: en ? 'Trevvos Apps & Products' : 'Apps e produtos Trevvos',
        content: en
          ? 'Trevvos is building its own products like Trevvos Forge, KM One, Trevvos Flow, and the Neural Portal itself. Each product is born from a real problem and serves as technical proof of the company\'s applied AI capabilities.'
          : 'A Trevvos está construindo produtos próprios como Trevvos Forge, KM One, Trevvos Flow e o próprio Neural Portal. Cada produto nasce de um problema real e serve também como prova técnica da capacidade da empresa em IA aplicada.',
        actions: [
          {
            label: en ? 'Open Trevvos Flow on Google Play' : 'Abrir Trevvos Flow na Google Play',
            url: this.trevvosFlowPlayStoreUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (this.containsAny(normalized, ['podcast', 'spotify'])) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'blog',
        ack: en ? 'Opening Trevvos Podcast.' : 'Abrindo Podcast Trevvos.',
        title: en ? 'Trevvos Podcast' : 'Podcast Trevvos',
        content: en
          ? 'The Trevvos Podcast is where we talk about AI, software, digital products, and behind the scenes at Trevvos. New episodes available on Spotify.'
          : 'O Podcast Trevvos é onde conversamos sobre IA, software, produtos digitais e bastidores da Trevvos. Novos episódios disponíveis no Spotify.',
        actions: [
          {
            label: en ? 'Listen on Spotify ↗' : 'Ouvir no Spotify ↗',
            url: this.podcastUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (this.containsAny(normalized, ['blog', 'artigo', 'conteudo', 'conteúdo', 'seo', 'article', 'content', 'neural blog'])) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'blog',
        ack: en ? 'Opening Neural Blog module.' : 'Abrindo módulo Blog Neural.',
        title: en ? 'Neural Blog' : 'Blog Neural',
        content: en
          ? 'The Neural Blog will be Trevvos\' public content area, with articles on applied AI, software engineering, automation, own products, and real technical learnings. The focus is on SEO, authority, and practical demonstration.'
          : 'O Blog Neural será a área pública de conteúdo da Trevvos, com artigos sobre IA aplicada, engenharia de software, automação, produtos próprios e aprendizados técnicos reais. O foco é SEO, autoridade e demonstração prática.',
      };
    }

    if (
      this.containsAny(normalized, [
        'preço',
        'preco',
        'plano',
        'planos',
        'valor',
        'custo',
        'orçamento',
        'orcamento',
        'price',
        'plan',
        'plans',
        'budget',
        'quote',
        'cost',
      ])
    ) {
      return {
        type: 'message',
        mode: 'conversation',
        activeModule: 'contact',
        ack: en ? 'Preparing commercial guidance.' : 'Preparando orientação comercial.',
        title: en ? 'Project & diagnosis' : 'Projeto e diagnóstico',
        content: en
          ? 'Trevvos approaches projects consultatively. The best path is understanding the problem, estimating scope, and suggesting an appropriate solution. You can continue chatting with the agent or speak directly with a human via WhatsApp.'
          : 'A Trevvos trata projetos de forma consultiva. O melhor caminho é entender o problema, estimar escopo e sugerir uma solução adequada. Você pode continuar conversando com o agente ou falar diretamente com um humano pelo WhatsApp.',
        actions: this.humanContactActions(language),
      };
    }

    if (
      this.containsAny(normalized, [
        'testador',
        'testadores',
        'grupo de testadores',
        'early access',
        'early tester',
        'testers',
        'testers group',
        'tester group',
      ])
    ) {
      return {
        type: 'message',
        mode: 'deterministic',
        activeModule: 'kmOne',
        ack: en ? 'Opening testers group.' : 'Abrindo grupo de testadores.',
        title: en ? 'Testers group' : 'Grupo de testadores',
        content: en
          ? 'Be one of the first to test KM One before launch. Join our WhatsApp group and help shape the product.'
          : 'Seja um dos primeiros a testar o KM One antes do lançamento. Junte-se ao nosso grupo no WhatsApp e ajude a moldar o produto.',
        actions: [
          {
            label: en ? 'Join the group ↗' : 'Entrar no grupo ↗',
            url: this.testerGroupUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (
      this.containsAny(normalized, [
        'contato',
        'falar',
        'humano',
        'whatsapp',
        'zap',
        'reunião',
        'reuniao',
        'diagnóstico',
        'diagnostico',
        'projeto',
        'human',
        'human contact',
        'talk to a human',
        'talk to human',
        'contact',
        'meeting',
        'diagnosis',
        'speak',
      ])
    ) {
      return {
        type: 'module',
        mode: 'conversation',
        activeModule: 'contact',
        ack: en ? 'Preparing human contact.' : 'Preparando contato humano.',
        title: en ? 'Talk to a human' : 'Falar com um humano',
        content: en
          ? 'Of course. You can talk to a Trevvos team member on WhatsApp to explain your project, request a diagnosis, or ask questions about AI solutions, automations, and custom systems.'
          : 'Claro. Você pode falar com um humano da Trevvos pelo WhatsApp para explicar seu projeto, pedir um diagnóstico ou tirar dúvidas sobre soluções com IA, automações e sistemas sob medida.',
        actions: this.humanContactActions(language),
      };
    }

    if (
      this.containsAny(normalized, [
        'ia aplicada',
        'inteligencia artificial',
        'inteligência artificial',
        'agente',
        'agentes',
        'applied ai',
        'artificial intelligence',
        'ai agent',
        'agents',
      ])
    ) {
      return {
        type: 'message',
        mode: 'conversation',
        activeModule: 'agent',
        ack: en ? 'Analyzing applied AI.' : 'Analisando IA aplicada.',
        title: en ? 'Applied AI' : 'IA aplicada',
        content: en
          ? 'Applied AI is when models, agents, and automations stop being demonstrations and enter real workflows: customer service, analysis, content generation, software engineering, operations, and system integration.'
          : 'IA aplicada é quando modelos, agentes e automações deixam de ser demonstração e entram em fluxos reais: atendimento, análise, geração de conteúdo, engenharia de software, operação e integração entre sistemas.',
      };
    }

    if (
      this.containsAny(normalized, [
        'trevvos',
        'quem são vocês',
        'quem sao voces',
        'o que vocês fazem',
        'o que voces fazem',
        'sobre',
        'who are you',
        'what do you do',
        'what is trevvos',
        'about you',
        'about trevvos',
      ])
    ) {
      return {
        type: 'module',
        mode: 'conversation',
        activeModule: 'agent',
        ack: en ? 'Presenting Trevvos.' : 'Apresentando a Trevvos.',
        title: en ? 'Trevvos AI Solutions' : 'Trevvos Soluções em IA',
        content: en
          ? 'Trevvos creates solutions in artificial intelligence, automation, and software engineering. The goal is to turn real problems into intelligent, useful, and well-built digital products.'
          : 'A Trevvos cria soluções em inteligência artificial, automação e engenharia de software. O objetivo é transformar problemas reais em produtos digitais inteligentes, úteis e bem construídos.',
      };
    }

    if (this.containsAny(normalized, ['bom dia', 'boa tarde', 'boa noite', 'ola', 'olá', 'oi', 'hello', 'hi', 'hey'])) {
      return {
        type: 'message',
        mode: 'conversation',
        activeModule: 'agent',
        ack: en ? 'Neural interface active.' : 'Interface neural ativa.',
        title: en ? 'Trevvos Core online' : 'Trevvos Core online',
        content: en
          ? 'Hello. I\'m the Trevvos agent. I can present solutions, explain products, talk about applied AI, or help you think about a system with artificial intelligence.'
          : 'Olá. Sou o agente da Trevvos. Posso apresentar soluções, explicar produtos, falar sobre IA aplicada ou ajudar você a pensar em um sistema com inteligência artificial.',
      };
    }

    return {
      type: 'message',
      mode: 'conversation',
      activeModule: 'agent',
      ack: en ? 'Interpreting request.' : 'Interpretando solicitação.',
      title: en ? 'Trevvos Core' : 'Núcleo Trevvos',
      content: en
        ? 'Understood. To better assist you, tell me if you\'re looking for an automation, a custom system, a ready-made product, technical content, or an AI solution for your business.'
        : 'Entendido. Para seguir melhor, me diga se você procura uma automação, um sistema sob medida, um produto pronto, conteúdo técnico ou uma solução de IA para sua empresa.',
    };
  }

  getModuleInfo(module: JarvisModule, language: AppLanguage = 'pt'): JarvisModuleInfo {
    const en = language === 'en';

    const modules: Record<JarvisModule, JarvisModuleInfo> = {
      agent: {
        module: 'agent',
        label: en ? 'Trevvos Agent' : 'Agente Trevvos',
        title: en ? 'Trevvos Agent' : 'Agente Trevvos',
        description: en
          ? 'Hi! I\'m the Trevvos agent. You\'re already using our AI — ask anything, choose a suggestion, or tell me your challenge. Trevvos builds apps, systems, and solutions with applied AI.'
          : 'Olá! Sou o agente da Trevvos. Aqui você já está usando nossa IA — pergunte o que precisa, escolha uma sugestão ou me diga seu desafio. A Trevvos cria apps, sistemas e soluções com IA aplicada.',
        suggestions: [
          {
            icon: '↔',
            title: en ? 'Automate processes' : 'Automatizar processos',
            subtitle: en ? 'AI workflows' : 'Fluxos com IA',
            prompt: en ? 'I want to automate my company\'s processes with AI' : 'Quero automatizar processos da minha empresa com IA',
          },
          {
            icon: '▦',
            title: en ? 'See our products' : 'Ver nossos produtos',
            subtitle: en ? 'Solutions in progress' : 'Soluções em construção',
            prompt: en ? 'I want to know about Trevvos products' : 'Quero conhecer os produtos da Trevvos',
          },
          {
            icon: '☑',
            title: 'Trevvos Flow',
            subtitle: en ? 'AI-powered todo list' : 'Todo list com IA',
            prompt: en ? 'What is Trevvos Flow?' : 'O que é o Trevvos Flow?',
          },
          {
            icon: '◉',
            title: en ? 'Meet the creator' : 'Conhecer o criador',
            subtitle: 'Lucas Amaral',
            prompt: en ? 'Who is Lucas Amaral?' : 'Conheça o criador Lucas Amaral',
          },
        ],
      },
      apps: {
        module: 'apps',
        label: en ? 'Our apps' : 'Nossos apps',
        title: en ? 'Trevvos Apps & Products' : 'Apps e produtos Trevvos',
        description: en
          ? 'Trevvos builds its own products to solve real problems and demonstrate applied AI in operation.'
          : 'A Trevvos constrói produtos próprios para resolver problemas reais e demonstrar IA aplicada em operação.',
        suggestions: [
          {
            icon: '⌘',
            title: 'Trevvos Forge',
            subtitle: en ? 'AI for engineering' : 'IA para engenharia',
            prompt: en ? 'Tell me about Trevvos Forge' : 'Explique o Trevvos Forge',
          },
          {
            icon: '☑',
            title: 'Trevvos Flow',
            subtitle: en ? 'AI-powered todo list' : 'Todo list com IA',
            prompt: en ? 'What is Trevvos Flow?' : 'O que é o Trevvos Flow?',
          },
          {
            icon: '▣',
            title: 'KM One',
            subtitle: en ? 'Intelligence for drivers' : 'Inteligência para motoristas',
            prompt: en ? 'What is KM One?' : 'O que é o KM One?',
          },
          {
            icon: '✦',
            title: en ? 'Neural Blog' : 'Blog Neural',
            subtitle: en ? 'Content & SEO' : 'Conteúdo e SEO',
            prompt: en ? 'What is in the Neural Blog?' : 'O que tem no Blog Neural?',
          },
        ],
      },
      systems: {
        module: 'systems',
        label: en ? 'Systems' : 'Sistemas',
        title: en ? 'Custom Systems with AI' : 'Sistemas sob medida com IA',
        description: en
          ? 'When an off-the-shelf solution doesn\'t work, Trevvos designs custom systems with AI, automation, backend, frontend, integrations, and architecture.'
          : 'Quando uma solução pronta não resolve, a Trevvos projeta sistemas customizados com IA, automação, backend, frontend, integrações e arquitetura.',
        suggestions: [
          {
            icon: '◈',
            title: en ? 'Initial diagnosis' : 'Diagnóstico inicial',
            subtitle: en ? 'Identify the bottleneck' : 'Entender o gargalo',
            prompt: en ? 'I want to diagnose a problem in my business' : 'Quero diagnosticar um problema do meu negócio',
          },
          {
            icon: '↔',
            title: en ? 'Automation' : 'Automação',
            subtitle: en ? 'Reduce manual tasks' : 'Reduzir tarefas manuais',
            prompt: en ? 'I want to automate my company\'s processes' : 'Quero automatizar processos da minha empresa',
          },
          {
            icon: '✉',
            title: en ? 'Talk to human' : 'Falar com humano',
            subtitle: 'WhatsApp',
            prompt: en ? 'Talk to a human' : 'Quero falar com um humano',
          },
        ],
      },
      forge: {
        module: 'forge',
        label: 'Trevvos Forge',
        title: 'Trevvos Forge',
        description: en
          ? 'Trevvos\' flagship engineering product — a local-first AI platform for developers. Code analysis, planning, tests, diffs, documentation, and sessions with local LLMs or external APIs. Open source on GitHub.'
          : 'O principal produto de engenharia da Trevvos — plataforma local-first de IA para devs. Análise de código, planejamento, testes, diffs, documentação e sessões com LLMs locais ou APIs externas. Open source no GitHub.',
        suggestions: [
          {
            icon: '⌘',
            title: en ? 'How does it work?' : 'Como funciona?',
            subtitle: en ? 'Full technical overview' : 'Visão técnica completa',
            prompt: en ? 'Tell me about Trevvos Forge' : 'Explique o Trevvos Forge',
          },
          {
            icon: '◉',
            title: en ? 'Local LLM' : 'LLM local',
            subtitle: en ? 'Ollama and privacy' : 'Ollama e privacidade',
            prompt: en ? 'Why is Forge local-first?' : 'Por que o Forge é local-first?',
          },
          {
            icon: '↺',
            title: 'Roadmap',
            subtitle: en ? 'Next steps' : 'Próximos passos',
            prompt: en ? 'What is the Trevvos Forge roadmap?' : 'Qual o roadmap do Trevvos Forge?',
          },
          {
            icon: '↗',
            title: en ? 'View on GitHub' : 'Ver no GitHub',
            subtitle: en ? 'Open source' : 'Código aberto',
            prompt: en ? 'Tell me about Trevvos Forge' : 'Explique o Trevvos Forge',
          },
        ],
      },
      kmOne: {
        module: 'kmOne',
        label: 'KM One',
        title: 'KM One',
        description: en
          ? 'Operational intelligence for Uber and 99 drivers. Analyze rides, goals, fuel, and profit with clarity. The landing page is live — we are actively recruiting drivers for the testing phase.'
          : 'Inteligência operacional para motoristas de Uber e 99. Analise corridas, metas, combustível e lucro com clareza. A landing page está no ar — estamos recrutando motoristas para a fase de testes.',
        suggestions: [
          {
            icon: '▣',
            title: en ? 'How does it help?' : 'Como ajuda?',
            subtitle: en ? 'Daily use' : 'Uso no dia a dia',
            prompt: en ? 'How does KM One help drivers?' : 'Como o KM One ajuda motoristas?',
          },
          {
            icon: '◈',
            title: en ? 'Goals & profit' : 'Metas e lucro',
            subtitle: en ? 'Operational decisions' : 'Decisão operacional',
            prompt: en ? 'How does KM One analyze goals and profit?' : 'Como o KM One analisa metas e lucro?',
          },
          {
            icon: '↗',
            title: en ? 'I want to test' : 'Quero testar',
            subtitle: 'kmone.trevvos.com.br',
            prompt: en ? 'What is KM One?' : 'O que é o KM One?',
          },
        ],
      },
      flow: {
        module: 'flow',
        label: 'Trevvos Flow',
        title: 'Trevvos Flow',
        description: en
          ? 'AI-powered todo list that suggests items based on the list title and items already added. Also supports shared lists without requiring login.'
          : 'Todo list com IA aplicada que sugere completar listas com base no título e nos itens já adicionados. Também permite listas compartilhadas sem exigir login.',
        suggestions: [
          {
            icon: '☑',
            title: en ? 'How does it work?' : 'Como funciona?',
            subtitle: en ? 'AI for lists' : 'IA para listas',
            prompt: en ? 'How does Trevvos Flow work?' : 'Como funciona o Trevvos Flow?',
          },
          {
            icon: '↗',
            title: en ? 'Open in store' : 'Abrir na loja',
            subtitle: 'Google Play',
            prompt: en ? 'I want to open Trevvos Flow on Google Play' : 'Quero abrir o Trevvos Flow na Google Play',
          },
        ],
      },
      automation: {
        module: 'automation',
        label: en ? 'Automations' : 'Automações',
        title: en ? 'AI Automations' : 'Automações com IA',
        description: en
          ? 'Intelligent workflows to reduce repetitive tasks, organize data, generate responses, integrate systems, and support decisions.'
          : 'Fluxos inteligentes para reduzir tarefas repetitivas, organizar dados, gerar respostas, integrar sistemas e apoiar decisões.',
        suggestions: [
          {
            icon: '↔',
            title: en ? 'Map workflow' : 'Mapear fluxo',
            subtitle: en ? 'Start simple' : 'Começar simples',
            prompt: en ? 'How to map a workflow for AI automation?' : 'Como mapear um fluxo para automação com IA?',
          },
          {
            icon: '◈',
            title: en ? 'Diagnosis' : 'Diagnóstico',
            subtitle: en ? 'Where to apply AI' : 'Onde aplicar IA',
            prompt: en ? 'Where can I apply AI in my company?' : 'Onde posso aplicar IA na minha empresa?',
          },
          {
            icon: '✉',
            title: en ? 'Talk to human' : 'Falar com humano',
            subtitle: 'WhatsApp',
            prompt: en ? 'Talk to a human' : 'Quero falar com um humano',
          },
        ],
      },
      blog: {
        module: 'blog',
        label: en ? 'Neural Blog' : 'Blog Neural',
        title: en ? 'Neural Blog' : 'Blog Neural',
        description: en
          ? 'Trevvos\' technical content area covering applied AI, software engineering, automation, products, and real-world learnings.'
          : 'Área de conteúdo técnico da Trevvos sobre IA aplicada, engenharia de software, automação, produtos e aprendizados reais.',
        suggestions: [
          {
            icon: '✦',
            title: en ? 'Article ideas' : 'Ideias de artigos',
            subtitle: en ? 'SEO & authority' : 'SEO e autoridade',
            prompt: en ? 'What articles could Trevvos publish?' : 'Quais artigos a Trevvos poderia publicar?',
          },
          {
            icon: '◉',
            title: en ? 'Local AI' : 'IA local',
            subtitle: en ? 'Technical topic' : 'Tema técnico',
            prompt: en ? 'Create an article idea about local AI' : 'Crie uma ideia de artigo sobre IA local',
          },
        ],
      },
      creator: {
        module: 'creator',
        label: en ? 'Creator' : 'Criador',
        title: 'Lucas Amaral',
        description: en
          ? 'Lucas Amaral is the creator of Trevvos and the developer behind this portal. He works with software engineering, applied AI, automation, and digital product development.'
          : 'Lucas Amaral é o criador da Trevvos e responsável por este portal. Atua com engenharia de software, IA aplicada, automação e desenvolvimento de produtos digitais.',
        suggestions: [
          {
            icon: '◉',
            title: en ? 'View profile' : 'Ver perfil',
            subtitle: en ? 'GitHub, LinkedIn & CV' : 'GitHub, LinkedIn e CV',
            prompt: en ? 'Who is Lucas Amaral?' : 'Conheça o criador Lucas Amaral',
          },
          {
            icon: '⌘',
            title: en ? 'Technical projects' : 'Projetos técnicos',
            subtitle: en ? 'Forge & applied AI' : 'Forge e IA aplicada',
            prompt: en ? 'What technical projects is Lucas Amaral building?' : 'Quais projetos técnicos Lucas Amaral está construindo?',
          },
        ],
      },
      contact: {
        module: 'contact',
        label: en ? 'Human contact' : 'Contato humano',
        title: en ? 'Talk to a human' : 'Falar com um humano',
        description: en
          ? 'You can speak directly with a Trevvos team member on WhatsApp to explain your project, request a diagnosis, or ask questions about AI solutions, automations, and custom systems.'
          : 'Se você preferir, pode falar diretamente com um humano da Trevvos pelo WhatsApp para explicar seu projeto, pedir diagnóstico ou tirar dúvidas.',
        suggestions: [
          {
            icon: '✉',
            title: 'WhatsApp',
            subtitle: en ? 'Open conversation' : 'Abrir conversa',
            prompt: en ? 'Talk to a human' : 'Quero falar com um humano',
          },
          {
            icon: '◈',
            title: en ? 'Diagnosis' : 'Diagnóstico',
            subtitle: en ? 'Start conversation' : 'Começar conversa',
            prompt: en ? 'I want a diagnosis of my project' : 'Quero fazer um diagnóstico do meu projeto',
          },
        ],
      },
      admin: {
        module: 'admin',
        label: 'Admin',
        title: 'Admin Core',
        description: en
          ? 'Restricted area for article generation, image creation, blog management, and interaction history.'
          : 'Área restrita para geração de artigos, imagens, gestão do blog e histórico de interações.',
        suggestions: [
          {
            icon: '⚿',
            title: en ? 'Open admin' : 'Abrir admin',
            subtitle: en ? 'Restricted access' : 'Acesso restrito',
            prompt: 'Trevvos modo admin',
          },
        ],
      },
    };

    return modules[module];
  }

  getProductLinks(language: AppLanguage = 'pt'): JarvisProductLink[] {
    const en = language === 'en';
    return [
      {
        icon: '⌘',
        title: 'Trevvos Forge',
        prompt: en ? 'Tell me more about Trevvos Forge' : 'Me conta mais sobre o Trevvos Forge',
      },
      {
        icon: '☑',
        title: 'Trevvos Flow',
        prompt: en ? 'What is Trevvos Flow?' : 'O que é o Trevvos Flow?',
      },
      {
        icon: '▣',
        title: 'KM One',
        prompt: en ? 'How does KM One work?' : 'Como funciona o KM One?',
      },
      {
        icon: '↔',
        title: en ? 'Automations' : 'Automações',
        prompt: en ? 'What automations does Trevvos offer?' : 'Quais automações a Trevvos oferece?',
      },
      {
        icon: '◉',
        title: 'Lucas Amaral',
        prompt: en ? 'Who is Lucas Amaral?' : 'Conheça o criador Lucas Amaral',
      },
    ];
  }

  private creatorProfile(language: AppLanguage): JarvisProfile {
    const en = language === 'en';
    return {
      name: 'Lucas Amaral',
      role: en
        ? 'CEO of Trevvos • Software Engineer • Applied AI'
        : 'CEO da Trevvos • Software Engineer • IA Aplicada',
      photoUrl: 'assets/images/lucas-amaral.jpeg',
      description: en
        ? 'Software developer focused on architecture, backend, automation, digital products, and artificial intelligence applied to the real engineering cycle. Creator of Trevvos and responsible for projects like Trevvos Forge, KM One, Trevvos Flow, and the Trevvos Neural Portal.'
        : 'Desenvolvedor de software com foco em arquitetura, backend, automação, produtos digitais e inteligência artificial aplicada ao ciclo real de engenharia. Criador da Trevvos e responsável por projetos como Trevvos Forge, KM One, Trevvos Flow e o Trevvos Neural Portal.',
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/lucastrevvos',
          kind: 'github',
        },
        {
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/lucas-amaral-dev/',
          kind: 'linkedin',
        },
        {
          label: en ? 'Download CV' : 'Baixar CV',
          url: 'assets/files/lucas-amaral-cv.pdf',
          kind: 'cv',
        },
      ],
    };
  }

  private humanContactActions(language: AppLanguage): JarvisMessageAction[] {
    return [
      {
        label: language === 'en' ? 'Talk to human on WhatsApp' : 'Falar com humano no WhatsApp',
        url: this.humanWhatsAppUrl,
        kind: 'whatsapp',
      },
    ];
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }

  private containsAny(value: string, terms: string[]): boolean {
    return terms.some((term) => value.includes(this.normalize(term)));
  }
}
