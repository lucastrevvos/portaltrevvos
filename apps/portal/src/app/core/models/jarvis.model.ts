export type JarvisState = 'idle' | 'acknowledging' | 'processing' | 'admin-auth' | 'done' | 'error';

export type JarvisMessageRole = 'user' | 'jarvis';

export type JarvisMode = 'conversation' | 'deterministic' | 'admin' | 'profile';

export type JarvisModule =
  | 'agent'
  | 'apps'
  | 'systems'
  | 'forge'
  | 'kmOne'
  | 'flow'
  | 'automation'
  | 'blog'
  | 'creator'
  | 'contact'
  | 'admin';

export type JarvisInteractionType = 'message' | 'module' | 'admin';

export interface JarvisProfileLink {
  label: string;
  url: string;
  kind: 'github' | 'linkedin' | 'cv' | 'external';
}

export interface JarvisProfile {
  name: string;
  role: string;
  photoUrl: string;
  description: string;
  links: JarvisProfileLink[];
}

export interface JarvisMessageAction {
  label: string;
  url: string;
  kind: 'whatsapp' | 'external' | 'download';
}

export interface JarvisMessage {
  id: string;
  role: JarvisMessageRole;
  mode: JarvisMode;
  title?: string;
  content: string;
  profile?: JarvisProfile;
  actions?: JarvisMessageAction[];
  createdAt: Date;
}

export interface JarvisSuggestion {
  title: string;
  subtitle: string;
  prompt: string;
  icon: string;
}

export interface JarvisProductLink {
  title: string;
  prompt: string;
  icon: string;
}

export interface JarvisModuleInfo {
  module: JarvisModule;
  label: string;
  title: string;
  description: string;
  suggestions: JarvisSuggestion[];
}

export interface MobileBlogPost {
  id: number;
  title: string;
  summary: string;
  category: string;
  readingTime: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface DesktopBlogPost {
  id: number;
  title: string;
  summary: string;
  category: string;
  readingTime: string;
  dateLabel: string;
  imageTone: 'blue' | 'green' | 'violet' | 'amber' | 'pink' | 'cyan';
  featured?: boolean;
}

export interface JarvisInteraction {
  type: JarvisInteractionType;
  mode: JarvisMode;
  activeModule: JarvisModule;
  ack: string;
  title: string;
  content: string;
  profile?: JarvisProfile;
  actions?: JarvisMessageAction[];
}
