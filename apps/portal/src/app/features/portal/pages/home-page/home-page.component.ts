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
      title: this.languageService.t('jarvis.online.title'),
      content: this.languageService.t('jarvis.online.content'),
      createdAt: new Date(),
    },
  ]);

  readonly productLinks = computed(() =>
    this.jarvisMockService.getProductLinks(this.languageService.currentLanguage()),
  );
  humanWhatsAppUrl = '';

  isAdminModalOpen = signal(false);
  selectedMessage = signal<JarvisMessage | null>(null);

  readonly soundEnabled = computed(() => this.soundService.enabled());

  mobileTab = signal<'home' | 'agent' | 'content'>('home');

  mobileTopbarTitle = computed(() => {
    if (this.mobileTab() === 'agent') return this.languageService.t('mobile.title.agent');
    if (this.mobileTab() === 'content') return this.languageService.t('mobile.title.content');
    return this.languageService.t('mobile.title.home');
  });

  mobileTopbarSubtitle = computed(() => {
    if (this.mobileTab() === 'agent') return this.languageService.t('mobile.subtitle.agent');
    if (this.mobileTab() === 'content') return this.languageService.t('mobile.subtitle.content');
    return this.languageService.t('mobile.subtitle.home');
  });

  readonly mobileBlogCategories = [
    { id: 'all', labelKey: 'mobile.category.all' },
    { id: 'ai', labelKey: 'mobile.category.ai' },
    { id: 'automation', labelKey: 'mobile.category.automation' },
    { id: 'data', labelKey: 'mobile.category.data' },
    { id: 'business', labelKey: 'mobile.category.business' },
    { id: 'kmOne', labelKey: 'mobile.category.kmOne' },
    { id: 'engineering', labelKey: 'mobile.category.engineering' },
  ];

  readonly mobileFeaturedPost: MobileBlogPost = {
    id: 1,
    categoryId: 'ai',
    categoryKey: 'mobile.category.ai',
    titleKey: 'mobile.blog.post1.title',
    summaryKey: 'mobile.blog.post1.summary',
    readingTimeKey: 'mobile.blog.post1.readingTime',
    featured: true,
  };

  readonly mobileBlogPosts: MobileBlogPost[] = [
    {
      id: 2,
      categoryId: 'automation',
      categoryKey: 'mobile.category.automation',
      titleKey: 'mobile.blog.post2.title',
      summaryKey: 'mobile.blog.post2.summary',
      readingTimeKey: 'mobile.blog.post2.readingTime',
    },
    {
      id: 3,
      categoryId: 'data',
      categoryKey: 'mobile.category.data',
      titleKey: 'mobile.blog.post3.title',
      summaryKey: 'mobile.blog.post3.summary',
      readingTimeKey: 'mobile.blog.post3.readingTime',
    },
    {
      id: 4,
      categoryId: 'kmOne',
      categoryKey: 'mobile.category.kmOne',
      titleKey: 'mobile.blog.post4.title',
      summaryKey: 'mobile.blog.post4.summary',
      readingTimeKey: 'mobile.blog.post4.readingTime',
    },
    {
      id: 5,
      categoryId: 'engineering',
      categoryKey: 'mobile.category.engineering',
      titleKey: 'mobile.blog.post5.title',
      summaryKey: 'mobile.blog.post5.summary',
      readingTimeKey: 'mobile.blog.post5.readingTime',
    },
  ];

  activeMobileBlogCategory = signal('all');

  filteredMobileBlogPosts = computed(() => {
    const cat = this.activeMobileBlogCategory();
    if (cat === 'all') return this.mobileBlogPosts;
    return this.mobileBlogPosts.filter((p) => p.categoryId === cat);
  });

  readonly desktopBlogCategories = [
    { id: 'all', labelKey: 'desktop.category.all' },
    { id: 'ai', labelKey: 'desktop.category.ai' },
    { id: 'automation', labelKey: 'desktop.category.automation' },
    { id: 'engineering', labelKey: 'desktop.category.engineering' },
    { id: 'kmOne', labelKey: 'desktop.category.kmOne' },
    { id: 'forge', labelKey: 'desktop.category.forge' },
    { id: 'product', labelKey: 'desktop.category.product' },
  ];

  readonly desktopBlogFeaturedPost: DesktopBlogPost = {
    id: 100,
    categoryId: 'ai',
    categoryKey: 'desktop.blog.featured.category',
    readingTimeKey: 'desktop.blog.featured.readingTime',
    dateLabelKey: 'desktop.blog.featured.dateLabel',
    titleKey: 'desktop.blog.featured.title',
    summaryKey: 'desktop.blog.featured.summary',
    imageTone: 'blue',
    featured: true,
  };

  readonly desktopBlogPosts: DesktopBlogPost[] = [
    {
      id: 101,
      categoryId: 'automation',
      categoryKey: 'desktop.blog.automation.category',
      readingTimeKey: 'desktop.blog.automation.readingTime',
      dateLabelKey: 'desktop.blog.automation.dateLabel',
      titleKey: 'desktop.blog.automation.title',
      summaryKey: 'desktop.blog.automation.summary',
      imageTone: 'cyan',
    },
    {
      id: 102,
      categoryId: 'engineering',
      categoryKey: 'desktop.blog.governance.category',
      readingTimeKey: 'desktop.blog.governance.readingTime',
      dateLabelKey: 'desktop.blog.governance.dateLabel',
      titleKey: 'desktop.blog.governance.title',
      summaryKey: 'desktop.blog.governance.summary',
      imageTone: 'violet',
    },
    {
      id: 103,
      categoryId: 'kmOne',
      categoryKey: 'desktop.blog.kmOne.category',
      readingTimeKey: 'desktop.blog.kmOne.readingTime',
      dateLabelKey: 'desktop.blog.kmOne.dateLabel',
      titleKey: 'desktop.blog.kmOne.title',
      summaryKey: 'desktop.blog.kmOne.summary',
      imageTone: 'cyan',
    },
    {
      id: 104,
      categoryId: 'forge',
      categoryKey: 'desktop.blog.forge.category',
      readingTimeKey: 'desktop.blog.forge.readingTime',
      dateLabelKey: 'desktop.blog.forge.dateLabel',
      titleKey: 'desktop.blog.forge.title',
      summaryKey: 'desktop.blog.forge.summary',
      imageTone: 'pink',
    },
    {
      id: 105,
      categoryId: 'ai',
      categoryKey: 'desktop.blog.localAi.category',
      readingTimeKey: 'desktop.blog.localAi.readingTime',
      dateLabelKey: 'desktop.blog.localAi.dateLabel',
      titleKey: 'desktop.blog.localAi.title',
      summaryKey: 'desktop.blog.localAi.summary',
      imageTone: 'green',
    },
    {
      id: 106,
      categoryId: 'product',
      categoryKey: 'desktop.blog.product.category',
      readingTimeKey: 'desktop.blog.product.readingTime',
      dateLabelKey: 'desktop.blog.product.dateLabel',
      titleKey: 'desktop.blog.product.title',
      summaryKey: 'desktop.blog.product.summary',
      imageTone: 'amber',
    },
  ];

  activeDesktopBlogCategory = signal('all');
  desktopBlogSearch = signal('');
  selectedDesktopBlogPost = signal<DesktopBlogPost | null>(null);

  filteredDesktopBlogPosts = computed(() => {
    const active = this.activeDesktopBlogCategory();
    if (active === 'all') return this.desktopBlogPosts;
    return this.desktopBlogPosts.filter((p) => p.categoryId === active);
  });

  activeModuleInfo = computed(() => {
    return this.jarvisMockService.getModuleInfo(this.activeModule(), this.languageService.currentLanguage());
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

  private readonly jarvisMockService = inject(JarvisMockService);

  constructor() {
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

  setDesktopBlogCategory(categoryId: string): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.activeDesktopBlogCategory.set(categoryId);
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
    this.runPrompt(`Me fale sobre o artigo: ${this.languageService.t(post.titleKey)}`);
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

    const moduleInfo = this.jarvisMockService.getModuleInfo(module, this.languageService.currentLanguage());

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

  setMobileBlogCategory(categoryId: string): void {
    this.soundService.unlock();
    this.soundService.playClick();
    this.activeMobileBlogCategory.set(categoryId);
  }

  askAboutMobilePost(post: MobileBlogPost): void {
    this.goToAgent('Me fale sobre: ' + this.languageService.t(post.titleKey));
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
        title: this.languageService.t('jarvis.online.title'),
        content: this.languageService.t('jarvis.reset.content'),
        createdAt: new Date(),
      },
    ]);

    this.scrollChatToBottom();
  }

  private runPrompt(prompt: string): void {
    const interaction = this.jarvisMockService.getInteraction(prompt, this.languageService.currentLanguage());

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
