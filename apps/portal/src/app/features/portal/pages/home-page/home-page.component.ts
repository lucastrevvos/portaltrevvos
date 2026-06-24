import { Component, computed, ElementRef, signal, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  DesktopBlogPost,
  JarvisMessage,
  JarvisModule,
  JarvisProductLink,
  JarvisState,
  MobileBlogPost,
} from '../../../../core/models/jarvis.model';
import { JarvisMockService } from '../../../../core/services/jarvis-mock.service';
import { SoundService } from '../../../../core/services/sound.service';
import { LanguageService } from '../../../../core/i18n/language.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  @ViewChild('chatScroll')
  private chatScroll?: ElementRef<HTMLElement>;

  private readonly browserTitle = inject(Title);
  private readonly soundService = inject(SoundService);
  readonly languageService = inject(LanguageService);

  question = '';

  state = signal<JarvisState>('idle');
  currentAck = signal('');

  activeModule = signal<JarvisModule>('agent');

  messages = signal<JarvisMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'jarvis',
      mode: 'conversation',
      title: 'Agente Trevvos online',
      content:
        'Pode me perguntar qualquer coisa — sobre soluções, produtos, automação, IA aplicada, Trevvos Forge, Trevvos Flow, KM One ou sistemas sob medida.',
      createdAt: new Date(),
    },
  ]);

  productLinks = signal<JarvisProductLink[]>([]);
  humanWhatsAppUrl = '';

  isAdminModalOpen = signal(false);
  selectedMessage = signal<JarvisMessage | null>(null);

  readonly soundEnabled = computed(() => this.soundService.enabled());

  mobileTab = signal<'home' | 'agent' | 'content'>('home');

  mobileTopbarTitle = computed(() => {
    if (this.mobileTab() === 'agent') return 'Assistente Trevvos';
    if (this.mobileTab() === 'content') return 'Conteúdo';
    return 'Trevvos';
  });

  mobileTopbarSubtitle = computed(() => {
    if (this.mobileTab() === 'agent') return 'Seu parceiro de IA';
    if (this.mobileTab() === 'content') return 'Insights que geram valor';
    return 'Soluções em IA';
  });

  readonly mobileBlogCategories = ['Todos', 'IA', 'Automação', 'Dados', 'Negócios', 'KM One', 'Engenharia'];

  readonly mobileFeaturedPost: MobileBlogPost = {
    id: 1,
    category: 'IA Generativa',
    readingTime: '5 min de leitura',
    title: 'IA Generativa: como transformar dados em decisões inteligentes',
    summary: 'Entenda as aplicações práticas e o impacto real da IA nos negócios.',
    featured: true,
  };

  readonly mobileBlogPosts: MobileBlogPost[] = [
    {
      id: 2,
      category: 'Automação',
      readingTime: '7 min de leitura',
      title: 'Automação inteligente: o futuro da eficiência operacional',
      summary: 'Como fluxos automatizados com IA reduzem tarefas repetitivas e aceleram decisões.',
    },
    {
      id: 3,
      category: 'Dados',
      readingTime: '6 min de leitura',
      title: 'Governança de dados: o alicerce para a IA confiável',
      summary: 'Antes de automatizar decisões, empresas precisam organizar, proteger e qualificar seus dados.',
    },
    {
      id: 4,
      category: 'KM One',
      readingTime: '4 min de leitura',
      title: 'KM One na prática: inteligência para motoristas de app',
      summary: 'Como motoristas podem usar dados para avaliar corridas, metas, combustível e lucro.',
    },
    {
      id: 5,
      category: 'Engenharia',
      readingTime: '8 min de leitura',
      title: 'Trevvos Forge: IA aplicada ao ciclo real de desenvolvimento',
      summary: 'Uma visão sobre análise de código, planejamento técnico, testes, diffs e documentação com LLM local.',
    },
  ];

  activeMobileBlogCategory = signal('Todos');

  filteredMobileBlogPosts = computed(() => {
    const cat = this.activeMobileBlogCategory();
    if (cat === 'Todos') return this.mobileBlogPosts;
    return this.mobileBlogPosts.filter((p) => p.category === cat);
  });

  readonly desktopBlogCategories = ['Todos', 'IA', 'Automação', 'Engenharia', 'KM One', 'Forge', 'Produto'];

  readonly desktopBlogFeaturedPost: DesktopBlogPost = {
    id: 100,
    category: 'IA Generativa',
    readingTime: '5 min de leitura',
    dateLabel: 'Destaque',
    title: 'IA Generativa: como transformar dados em decisões inteligentes',
    summary:
      'Entenda como modelos generativos e engenharia de contexto estão mudando a forma como empresas tomam decisões e criam valor com seus dados.',
    imageTone: 'blue',
    featured: true,
  };

  readonly desktopBlogPosts: DesktopBlogPost[] = [
    {
      id: 101,
      category: 'Automação',
      readingTime: '6 min de leitura',
      dateLabel: 'Hoje',
      title: 'Automação inteligente: o futuro da eficiência operacional',
      summary: 'Como a automação com IA reduz custos, erros e libera pessoas para o que realmente importa.',
      imageTone: 'cyan',
    },
    {
      id: 102,
      category: 'Engenharia',
      readingTime: '7 min de leitura',
      dateLabel: 'Ontem',
      title: 'Governança de dados: o alicerce para a IA confiável',
      summary: 'Princípios e práticas para garantir qualidade, segurança e rastreabilidade dos dados em projetos de IA.',
      imageTone: 'violet',
    },
    {
      id: 103,
      category: 'KM One',
      readingTime: '5 min de leitura',
      dateLabel: '2 dias atrás',
      title: 'KM One na prática: inteligência para motoristas de app',
      summary: 'Como o KM One usa dados para ajudar motoristas a analisarem corridas, metas, combustível e lucro.',
      imageTone: 'cyan',
    },
    {
      id: 104,
      category: 'Forge',
      readingTime: '6 min de leitura',
      dateLabel: '3 dias atrás',
      title: 'Trevvos Forge: IA aplicada ao ciclo real de desenvolvimento',
      summary: 'Da análise ao deploy: como usamos IA para acelerar entregas com qualidade e foco no valor do produto.',
      imageTone: 'pink',
    },
    {
      id: 105,
      category: 'IA',
      readingTime: '6 min de leitura',
      dateLabel: '5 dias atrás',
      title: 'IA local e produtividade em engenharia',
      summary: 'Como rodar modelos localmente aumenta produtividade sem abrir mão de segurança e privacidade.',
      imageTone: 'green',
    },
    {
      id: 106,
      category: 'Produto',
      readingTime: '5 min de leitura',
      dateLabel: '1 semana atrás',
      title: 'Como produtos com IA geram valor real',
      summary: 'Estratégias para conectar tecnologia, experiência do usuário e métricas de negócio.',
      imageTone: 'amber',
    },
  ];

  activeDesktopBlogCategory = signal('Todos');
  desktopBlogSearch = signal('');
  selectedDesktopBlogPost = signal<DesktopBlogPost | null>(null);

  filteredDesktopBlogPosts = computed(() => {
    const active = this.activeDesktopBlogCategory();
    if (active === 'Todos') return this.desktopBlogPosts;
    return this.desktopBlogPosts.filter((p) => p.category === active);
  });

  activeModuleInfo = computed(() => {
    return this.jarvisMockService.getModuleInfo(this.activeModule());
  });

  isBusy = computed(() => {
    return this.state() === 'acknowledging' || this.state() === 'processing';
  });

  conversationCount = computed(() => this.messages().length);

  lastModeLabel = computed(() => {
    const lastMessage = [...this.messages()].reverse().find((message) => message.role === 'jarvis');

    if (lastMessage?.mode === 'deterministic') {
      return this.languageService.t('mode.auto');
    }

    if (lastMessage?.mode === 'admin') {
      return this.languageService.t('mode.admin');
    }

    if (lastMessage?.mode === 'profile') {
      return this.languageService.t('mode.profile');
    }

    return this.languageService.t('mode.conversation');
  });

  constructor(private readonly jarvisMockService: JarvisMockService) {
    this.productLinks.set(this.jarvisMockService.getProductLinks());
    this.humanWhatsAppUrl = this.jarvisMockService.getHumanWhatsAppUrl();
    this.browserTitle.setTitle('Trevvos Neural Console | Trevvos Soluções em IA');
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled();
  }

  toggleSound(): void {
    this.soundService.unlock();
    this.soundService.toggleEnabled();

    if (this.soundService.enabled()) {
      this.soundService.playClick();
    }
  }

  toggleLanguage(): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.languageService.toggleLanguage();
  }

  submitQuestion(): void {
    const question = this.question.trim();

    if (!question || this.isBusy()) {
      return;
    }

    this.soundService.unlock();
    this.soundService.playSend();
    this.runPrompt(question);
  }

  usePrompt(prompt: string): void {
    if (this.isBusy()) {
      return;
    }

    this.soundService.unlock();
    this.soundService.playClick();
    this.runPrompt(prompt);
  }

  setDesktopBlogCategory(category: string): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.activeDesktopBlogCategory.set(category);
  }

  openDesktopBlogPost(post: DesktopBlogPost): void {
    this.soundService.unlock();
    this.soundService.playModalOpen();
    this.selectedDesktopBlogPost.set(post);
  }

  closeDesktopBlogPost(): void {
    this.soundService.unlock();
    this.soundService.playModalClose();
    this.selectedDesktopBlogPost.set(null);
  }

  askAboutDesktopPost(post: DesktopBlogPost): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.selectedDesktopBlogPost.set(null);
    this.activeModule.set('agent');
    this.runPrompt(`Me fale sobre o artigo: ${post.title}`);
  }

  setModule(module: JarvisModule): void {
    if (this.isBusy()) {
      return;
    }

    this.soundService.unlock();
    this.soundService.playTab();
    this.activeModule.set(module);

    if (module === 'blog') {
      this.currentAck.set('');
      this.state.set('idle');
      return;
    }

    if (module === 'admin') {
      this.runPrompt('Trevvos modo admin');
      return;
    }

    if (module === 'creator') {
      this.runPrompt('Conheça o criador Lucas Amaral');
      return;
    }

    if (module === 'contact') {
      this.runPrompt('Quero falar com um humano');
      return;
    }

    const moduleInfo = this.jarvisMockService.getModuleInfo(module);

    this.addMessage({
      role: 'jarvis',
      mode: 'deterministic',
      title: moduleInfo.title,
      content: moduleInfo.description,
    });
  }

  openMessageDetails(message: JarvisMessage): void {
    this.soundService.unlock();
    this.soundService.playModalOpen();
    this.selectedMessage.set(message);
  }

  closeMessageDetails(): void {
    this.soundService.unlock();
    this.soundService.playModalClose();
    this.selectedMessage.set(null);
  }

  setMobileTab(tab: 'home' | 'agent' | 'content'): void {
    this.soundService.unlock();
    this.soundService.playTab();
    this.mobileTab.set(tab);
  }

  setMobileBlogCategory(cat: string): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.activeMobileBlogCategory.set(cat);
  }

  goToAgent(prompt?: string): void {
    this.soundService.unlock();
    this.soundService.playTab();
    this.mobileTab.set('agent');
    if (prompt) {
      this.usePrompt(prompt);
    }
  }

  closeAdminModal(): void {
    this.soundService.unlock();
    this.soundService.playModalClose();
    this.isAdminModalOpen.set(false);
    this.currentAck.set('');
    this.state.set('idle');
  }

  resetSession(): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.activeModule.set('agent');
    this.currentAck.set('');
    this.isAdminModalOpen.set(false);
    this.selectedMessage.set(null);
    this.state.set('idle');
    this.question = '';

    this.messages.set([
      {
        id: crypto.randomUUID(),
        role: 'jarvis',
        mode: 'conversation',
        title: 'Agente Trevvos online',
        content:
          'Sessão reiniciada. Pode me perguntar sobre soluções, produtos, IA aplicada, automações, Trevvos Flow ou sistemas sob medida.',
        createdAt: new Date(),
      },
    ]);

    this.scrollChatToBottom();
  }

  private runPrompt(prompt: string): void {
    const interaction = this.jarvisMockService.getInteraction(prompt);

    this.question = '';
    this.currentAck.set(interaction.ack);
    this.isAdminModalOpen.set(false);

    this.addMessage({
      role: 'user',
      mode: 'conversation',
      content: prompt,
    });

    this.state.set('acknowledging');

    setTimeout(() => {
      if (interaction.type === 'admin') {
        this.activeModule.set('admin');
        this.isAdminModalOpen.set(true);
        this.currentAck.set('');
        this.state.set('admin-auth');
        this.soundService.playAdmin();

        this.addMessage({
          role: 'jarvis',
          mode: 'admin',
          title: interaction.title,
          content: interaction.content,
        });

        return;
      }

      this.state.set('processing');

      setTimeout(() => {
        this.activeModule.set(interaction.activeModule);

        this.addMessage({
          role: 'jarvis',
          mode: interaction.mode,
          title: interaction.title,
          content: interaction.content,
          profile: interaction.profile,
          actions: interaction.actions,
        });

        this.currentAck.set('');
        this.state.set('done');
      }, 650);
    }, 420);
  }

  private addMessage(message: Omit<JarvisMessage, 'id' | 'createdAt'>): void {
    const newMessage: JarvisMessage = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    this.messages.update((messages) => [...messages, newMessage]);

    if (newMessage.role === 'jarvis' && newMessage.mode !== 'admin') {
      this.soundService.playReceive();
    }

    this.scrollChatToBottom();
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      const chatElement = this.chatScroll?.nativeElement;

      if (!chatElement) {
        return;
      }

      chatElement.scrollTo({
        top: chatElement.scrollHeight,
        behavior: 'smooth',
      });
    });
  }
}
