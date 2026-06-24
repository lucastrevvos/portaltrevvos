import { Component, computed, ElementRef, signal, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  JarvisMessage,
  JarvisModule,
  JarvisProductLink,
  JarvisState,
  MobileBlogPost,
} from '../../../../core/models/jarvis.model';
import { JarvisMockService } from '../../../../core/services/jarvis-mock.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  @ViewChild('chatScroll')
  private chatScroll?: ElementRef<HTMLElement>;

  private readonly browserTitle = inject(Title);

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
      return 'Automático';
    }

    if (lastMessage?.mode === 'admin') {
      return 'Admin';
    }

    if (lastMessage?.mode === 'profile') {
      return 'Perfil';
    }

    return 'Conversa';
  });

  constructor(private readonly jarvisMockService: JarvisMockService) {
    this.productLinks.set(this.jarvisMockService.getProductLinks());
    this.humanWhatsAppUrl = this.jarvisMockService.getHumanWhatsAppUrl();
    this.browserTitle.setTitle('Trevvos Neural Console | Trevvos Soluções em IA');
  }

  submitQuestion(): void {
    const question = this.question.trim();

    if (!question || this.isBusy()) {
      return;
    }

    this.runPrompt(question);
  }

  usePrompt(prompt: string): void {
    if (this.isBusy()) {
      return;
    }

    this.runPrompt(prompt);
  }

  setModule(module: JarvisModule): void {
    if (this.isBusy()) {
      return;
    }

    this.activeModule.set(module);

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
    this.selectedMessage.set(message);
  }

  closeMessageDetails(): void {
    this.selectedMessage.set(null);
  }

  setMobileTab(tab: 'home' | 'agent' | 'content'): void {
    this.mobileTab.set(tab);
  }

  setMobileBlogCategory(cat: string): void {
    this.activeMobileBlogCategory.set(cat);
  }

  goToAgent(prompt?: string): void {
    this.mobileTab.set('agent');
    if (prompt) {
      this.usePrompt(prompt);
    }
  }

  closeAdminModal(): void {
    this.isAdminModalOpen.set(false);
    this.currentAck.set('');
    this.state.set('idle');
  }

  resetSession(): void {
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
