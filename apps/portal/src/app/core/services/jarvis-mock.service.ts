import { Injectable } from '@angular/core';
import {
  JarvisInteraction,
  JarvisMessageAction,
  JarvisModule,
  JarvisModuleInfo,
  JarvisProductLink,
  JarvisProfile,
} from '../models/jarvis.model';

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

  getInteraction(question: string): JarvisInteraction {
    const normalized = this.normalize(question);

    if (this.containsAny(normalized, ['trevvos modo admin', 'modo admin', 'admin'])) {
      return {
        type: 'admin',
        mode: 'admin',
        activeModule: 'admin',
        ack: 'Acesso administrativo solicitado.',
        title: 'Acesso restrito',
        content: 'Autenticação necessária para acessar o núcleo administrativo da Trevvos.',
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'profile',
        activeModule: 'creator',
        ack: 'Carregando perfil do criador.',
        title: 'Lucas Amaral',
        content:
          'Lucas Amaral é o criador da Trevvos e desenvolvedor responsável por este portal. Atua com engenharia de software, IA aplicada, automação e desenvolvimento de produtos digitais.',
        profile: this.creatorProfile(),
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'flow',
        ack: 'Abrindo módulo Trevvos Flow.',
        title: 'Trevvos Flow',
        content:
          'O Trevvos Flow é um app de listas de tarefas com IA aplicada. Ele sugere completar a lista com base no título e nos itens já adicionados, além de permitir criar listas compartilhadas sem exigir login. O app já está disponível na Google Play.',
        actions: [
          {
            label: 'Abrir na Google Play',
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'forge',
        ack: 'Abrindo módulo Trevvos Forge.',
        title: 'Trevvos Forge',
        content:
          'O Trevvos Forge é o principal produto de engenharia da Trevvos — uma plataforma local-first de IA para desenvolvedores.\n\nCom ele, devs podem:\n• Analisar código com contexto real do projeto\n• Planejar features e arquitetura com IA\n• Gerar testes automatizados\n• Criar e revisar documentação técnica\n• Revisar diffs antes de commitar\n• Conduzir sessões estruturadas com LLMs locais via Ollama ou APIs externas\n\nA proposta é manter controle total do contexto, histórico e fluxo sem depender de nuvem para o ciclo core de engenharia. O projeto é open source e está em desenvolvimento ativo no GitHub.',
        actions: [
          {
            label: 'Ver no GitHub ↗',
            url: this.forgeGithubUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (this.containsAny(normalized, ['km one', 'motorista', 'corrida', 'uber', '99'])) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'kmOne',
        ack: 'Carregando módulo KM One.',
        title: 'KM One',
        content:
          'O KM One é um produto Trevvos para inteligência operacional de motoristas de apps como Uber e 99. Ele ajuda a interpretar corridas, metas, lucro e combustível com mais clareza e tomar decisões melhores no dia a dia.\n\nEstamos recrutando ativamente motoristas para a fase de testes. Se você é motorista ou conhece um, acesse a landing page e se cadastre para participar.',
        actions: [
          {
            label: 'Acessar kmone.trevvos.com.br ↗',
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'automation',
        ack: 'Mapeando possibilidades de automação.',
        title: 'Automação com IA',
        content:
          'A Trevvos pode projetar automações com IA para reduzir tarefas repetitivas, conectar sistemas, gerar respostas, analisar dados e apoiar decisões. O ideal é começar mapeando o fluxo atual e identificando onde a IA realmente economiza tempo.',
        actions: this.humanContactActions(),
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'conversation',
        activeModule: 'systems',
        ack: 'Analisando necessidade de sistema sob medida.',
        title: 'Sistemas sob medida',
        content:
          'A Trevvos desenvolve sistemas personalizados com IA quando uma solução pronta não resolve bem o problema. O caminho ideal é entender o gargalo, desenhar o fluxo, definir arquitetura e só então implementar o produto. Se preferir, você pode falar diretamente com um humano pelo WhatsApp.',
        actions: this.humanContactActions(),
      };
    }

    if (
      this.containsAny(normalized, [
        'apps',
        'aplicativos',
        'produtos',
        'soluções prontas',
        'solucoes prontas',
      ])
    ) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'apps',
        ack: 'Listando produtos Trevvos.',
        title: 'Apps e produtos Trevvos',
        content:
          'A Trevvos está construindo produtos próprios como Trevvos Forge, KM One, Trevvos Flow e o próprio Neural Portal. Cada produto nasce de um problema real e serve também como prova técnica da capacidade da empresa em IA aplicada.',
        actions: [
          {
            label: 'Abrir Trevvos Flow na Google Play',
            url: this.trevvosFlowPlayStoreUrl,
            kind: 'external',
          },
        ],
      };
    }

    if (this.containsAny(normalized, ['blog', 'artigo', 'conteudo', 'conteúdo', 'seo'])) {
      return {
        type: 'module',
        mode: 'deterministic',
        activeModule: 'blog',
        ack: 'Abrindo módulo Blog Neural.',
        title: 'Blog Neural',
        content:
          'O Blog Neural será a área pública de conteúdo da Trevvos, com artigos sobre IA aplicada, engenharia de software, automação, produtos próprios e aprendizados técnicos reais. O foco é SEO, autoridade e demonstração prática.',
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
      ])
    ) {
      return {
        type: 'message',
        mode: 'conversation',
        activeModule: 'contact',
        ack: 'Preparando orientação comercial.',
        title: 'Projeto e diagnóstico',
        content:
          'A Trevvos trata projetos de forma consultiva. O melhor caminho é entender o problema, estimar escopo e sugerir uma solução adequada. Você pode continuar conversando com o agente ou falar diretamente com um humano pelo WhatsApp.',
        actions: this.humanContactActions(),
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'conversation',
        activeModule: 'contact',
        ack: 'Preparando contato humano.',
        title: 'Falar com um humano',
        content:
          'Claro. Você pode falar com um humano da Trevvos pelo WhatsApp para explicar seu projeto, pedir um diagnóstico ou tirar dúvidas sobre soluções com IA, automações e sistemas sob medida.',
        actions: this.humanContactActions(),
      };
    }

    if (
      this.containsAny(normalized, [
        'ia aplicada',
        'inteligencia artificial',
        'inteligência artificial',
        'agente',
        'agentes',
      ])
    ) {
      return {
        type: 'message',
        mode: 'conversation',
        activeModule: 'agent',
        ack: 'Analisando IA aplicada.',
        title: 'IA aplicada',
        content:
          'IA aplicada é quando modelos, agentes e automações deixam de ser demonstração e entram em fluxos reais: atendimento, análise, geração de conteúdo, engenharia de software, operação e integração entre sistemas.',
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
      ])
    ) {
      return {
        type: 'module',
        mode: 'conversation',
        activeModule: 'agent',
        ack: 'Apresentando a Trevvos.',
        title: 'Trevvos Soluções em IA',
        content:
          'A Trevvos cria soluções em inteligência artificial, automação e engenharia de software. O objetivo é transformar problemas reais em produtos digitais inteligentes, úteis e bem construídos.',
      };
    }

    if (this.containsAny(normalized, ['bom dia', 'boa tarde', 'boa noite', 'ola', 'olá', 'oi'])) {
      return {
        type: 'message',
        mode: 'conversation',
        activeModule: 'agent',
        ack: 'Interface neural ativa.',
        title: 'Trevvos Core online',
        content:
          'Olá. Sou o agente da Trevvos. Posso apresentar soluções, explicar produtos, falar sobre IA aplicada ou ajudar você a pensar em um sistema com inteligência artificial.',
      };
    }

    return {
      type: 'message',
      mode: 'conversation',
      activeModule: 'agent',
      ack: 'Interpretando solicitação.',
      title: 'Núcleo Trevvos',
      content:
        'Entendido. Para seguir melhor, me diga se você procura uma automação, um sistema sob medida, um produto pronto, conteúdo técnico ou uma solução de IA para sua empresa.',
    };
  }

  getModuleInfo(module: JarvisModule): JarvisModuleInfo {
    const modules: Record<JarvisModule, JarvisModuleInfo> = {
      agent: {
        module: 'agent',
        label: 'Agente Trevvos',
        title: 'Agente Trevvos',
        description:
          'Olá! Sou o agente da Trevvos. Aqui você já está usando nossa IA — pergunte o que precisa, escolha uma sugestão ou me diga seu desafio. A Trevvos cria apps, sistemas e soluções com IA aplicada.',
        suggestions: [
          {
            icon: '↔',
            title: 'Automatizar processos',
            subtitle: 'Fluxos com IA',
            prompt: 'Quero automatizar processos da minha empresa com IA',
          },
          {
            icon: '▦',
            title: 'Ver nossos produtos',
            subtitle: 'Soluções em construção',
            prompt: 'Quero conhecer os produtos da Trevvos',
          },
          {
            icon: '☑',
            title: 'Trevvos Flow',
            subtitle: 'Todo list com IA',
            prompt: 'O que é o Trevvos Flow?',
          },
          {
            icon: '◉',
            title: 'Conhecer o criador',
            subtitle: 'Lucas Amaral',
            prompt: 'Conheça o criador Lucas Amaral',
          },
        ],
      },
      apps: {
        module: 'apps',
        label: 'Nossos apps',
        title: 'Apps e produtos Trevvos',
        description:
          'A Trevvos constrói produtos próprios para resolver problemas reais e demonstrar IA aplicada em operação.',
        suggestions: [
          {
            icon: '⌘',
            title: 'Trevvos Forge',
            subtitle: 'IA para engenharia',
            prompt: 'Explique o Trevvos Forge',
          },
          {
            icon: '☑',
            title: 'Trevvos Flow',
            subtitle: 'Todo list com IA',
            prompt: 'O que é o Trevvos Flow?',
          },
          {
            icon: '▣',
            title: 'KM One',
            subtitle: 'Inteligência para motoristas',
            prompt: 'O que é o KM One?',
          },
          {
            icon: '✦',
            title: 'Blog Neural',
            subtitle: 'Conteúdo e SEO',
            prompt: 'O que tem no Blog Neural?',
          },
        ],
      },
      systems: {
        module: 'systems',
        label: 'Sistemas',
        title: 'Sistemas sob medida com IA',
        description:
          'Quando uma solução pronta não resolve, a Trevvos projeta sistemas customizados com IA, automação, backend, frontend, integrações e arquitetura.',
        suggestions: [
          {
            icon: '◈',
            title: 'Diagnóstico inicial',
            subtitle: 'Entender o gargalo',
            prompt: 'Quero diagnosticar um problema do meu negócio',
          },
          {
            icon: '↔',
            title: 'Automação',
            subtitle: 'Reduzir tarefas manuais',
            prompt: 'Quero automatizar processos da minha empresa',
          },
          {
            icon: '✉',
            title: 'Falar com humano',
            subtitle: 'WhatsApp',
            prompt: 'Quero falar com um humano',
          },
        ],
      },
      forge: {
        module: 'forge',
        label: 'Trevvos Forge',
        title: 'Trevvos Forge',
        description:
          'O principal produto de engenharia da Trevvos — plataforma local-first de IA para devs. Análise de código, planejamento, testes, diffs, documentação e sessões com LLMs locais ou APIs externas. Open source no GitHub.',
        suggestions: [
          {
            icon: '⌘',
            title: 'Como funciona?',
            subtitle: 'Visão técnica completa',
            prompt: 'Explique o Trevvos Forge',
          },
          {
            icon: '◉',
            title: 'LLM local',
            subtitle: 'Ollama e privacidade',
            prompt: 'Por que o Forge é local-first?',
          },
          {
            icon: '↺',
            title: 'Roadmap',
            subtitle: 'Próximos passos',
            prompt: 'Qual o roadmap do Trevvos Forge?',
          },
          {
            icon: '↗',
            title: 'Ver no GitHub',
            subtitle: 'Código aberto',
            prompt: 'Explique o Trevvos Forge',
          },
        ],
      },
      kmOne: {
        module: 'kmOne',
        label: 'KM One',
        title: 'KM One',
        description:
          'Inteligência operacional para motoristas de Uber e 99. Analise corridas, metas, combustível e lucro com clareza. A landing page está no ar — estamos recrutando motoristas para a fase de testes.',
        suggestions: [
          {
            icon: '▣',
            title: 'Como ajuda?',
            subtitle: 'Uso no dia a dia',
            prompt: 'Como o KM One ajuda motoristas?',
          },
          {
            icon: '◈',
            title: 'Metas e lucro',
            subtitle: 'Decisão operacional',
            prompt: 'Como o KM One analisa metas e lucro?',
          },
          {
            icon: '↗',
            title: 'Quero testar',
            subtitle: 'kmone.trevvos.com.br',
            prompt: 'O que é o KM One?',
          },
        ],
      },
      flow: {
        module: 'flow',
        label: 'Trevvos Flow',
        title: 'Trevvos Flow',
        description:
          'Todo list com IA aplicada que sugere completar listas com base no título e nos itens já adicionados. Também permite listas compartilhadas sem exigir login.',
        suggestions: [
          {
            icon: '☑',
            title: 'Como funciona?',
            subtitle: 'IA para listas',
            prompt: 'Como funciona o Trevvos Flow?',
          },
          {
            icon: '↗',
            title: 'Abrir na loja',
            subtitle: 'Google Play',
            prompt: 'Quero abrir o Trevvos Flow na Google Play',
          },
        ],
      },
      automation: {
        module: 'automation',
        label: 'Automações',
        title: 'Automações com IA',
        description:
          'Fluxos inteligentes para reduzir tarefas repetitivas, organizar dados, gerar respostas, integrar sistemas e apoiar decisões.',
        suggestions: [
          {
            icon: '↔',
            title: 'Mapear fluxo',
            subtitle: 'Começar simples',
            prompt: 'Como mapear um fluxo para automação com IA?',
          },
          {
            icon: '◈',
            title: 'Diagnóstico',
            subtitle: 'Onde aplicar IA',
            prompt: 'Onde posso aplicar IA na minha empresa?',
          },
          {
            icon: '✉',
            title: 'Falar com humano',
            subtitle: 'WhatsApp',
            prompt: 'Quero falar com um humano',
          },
        ],
      },
      blog: {
        module: 'blog',
        label: 'Blog Neural',
        title: 'Blog Neural',
        description:
          'Área de conteúdo técnico da Trevvos sobre IA aplicada, engenharia de software, automação, produtos e aprendizados reais.',
        suggestions: [
          {
            icon: '✦',
            title: 'Ideias de artigos',
            subtitle: 'SEO e autoridade',
            prompt: 'Quais artigos a Trevvos poderia publicar?',
          },
          {
            icon: '◉',
            title: 'IA local',
            subtitle: 'Tema técnico',
            prompt: 'Crie uma ideia de artigo sobre IA local',
          },
        ],
      },
      creator: {
        module: 'creator',
        label: 'Criador',
        title: 'Lucas Amaral',
        description:
          'Lucas Amaral é o criador da Trevvos e responsável por este portal. Atua com engenharia de software, IA aplicada, automação e desenvolvimento de produtos digitais.',
        suggestions: [
          {
            icon: '◉',
            title: 'Ver perfil',
            subtitle: 'GitHub, LinkedIn e CV',
            prompt: 'Conheça o criador Lucas Amaral',
          },
          {
            icon: '⌘',
            title: 'Projetos técnicos',
            subtitle: 'Forge e IA aplicada',
            prompt: 'Quais projetos técnicos Lucas Amaral está construindo?',
          },
        ],
      },
      contact: {
        module: 'contact',
        label: 'Contato humano',
        title: 'Falar com um humano',
        description:
          'Se você preferir, pode falar diretamente com um humano da Trevvos pelo WhatsApp para explicar seu projeto, pedir diagnóstico ou tirar dúvidas.',
        suggestions: [
          {
            icon: '✉',
            title: 'WhatsApp',
            subtitle: 'Abrir conversa',
            prompt: 'Quero falar com um humano',
          },
          {
            icon: '◈',
            title: 'Diagnóstico',
            subtitle: 'Começar conversa',
            prompt: 'Quero fazer um diagnóstico do meu projeto',
          },
        ],
      },
      admin: {
        module: 'admin',
        label: 'Admin',
        title: 'Admin Core',
        description:
          'Área restrita para geração de artigos, imagens, gestão do blog e histórico de interações.',
        suggestions: [
          {
            icon: '⚿',
            title: 'Abrir admin',
            subtitle: 'Acesso restrito',
            prompt: 'Trevvos modo admin',
          },
        ],
      },
    };

    return modules[module];
  }

  getProductLinks(): JarvisProductLink[] {
    return [
      {
        icon: '⌘',
        title: 'Trevvos Forge',
        prompt: 'Me conta mais sobre o Trevvos Forge',
      },
      {
        icon: '☑',
        title: 'Trevvos Flow',
        prompt: 'O que é o Trevvos Flow?',
      },
      {
        icon: '▣',
        title: 'KM One',
        prompt: 'Como funciona o KM One?',
      },
      {
        icon: '↔',
        title: 'Automações',
        prompt: 'Quais automações a Trevvos oferece?',
      },
      {
        icon: '◉',
        title: 'Lucas Amaral',
        prompt: 'Conheça o criador Lucas Amaral',
      },
    ];
  }

  private creatorProfile(): JarvisProfile {
    return {
      name: 'Lucas Amaral',
      role: 'CEO da Trevvos • Software Engineer • IA Aplicada',
      photoUrl: 'assets/images/lucas-amaral.jpeg',
      description:
        'Desenvolvedor de software com foco em arquitetura, backend, automação, produtos digitais e inteligência artificial aplicada ao ciclo real de engenharia. Criador da Trevvos e responsável por projetos como Trevvos Forge, KM One, Trevvos Flow e o Trevvos Neural Portal.',
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
          label: 'Baixar CV',
          url: 'assets/files/lucas-amaral-cv.pdf',
          kind: 'cv',
        },
      ],
    };
  }

  private humanContactActions(): JarvisMessageAction[] {
    return [
      {
        label: 'Falar com humano no WhatsApp',
        url: this.humanWhatsAppUrl,
        kind: 'whatsapp',
      },
    ];
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  private containsAny(value: string, terms: string[]): boolean {
    return terms.some((term) => value.includes(this.normalize(term)));
  }
}
