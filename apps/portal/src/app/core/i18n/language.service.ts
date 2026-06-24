import { Injectable, signal } from '@angular/core';
import { AppLanguage } from './language.model';
import { TRANSLATIONS } from './translations';

const STORAGE_KEY = 'trevvos_language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLanguage = signal<AppLanguage>(this.loadLanguage());

  setLanguage(language: AppLanguage): void {
    this.currentLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.currentLanguage() === 'pt' ? 'en' : 'pt');
  }

  t(key: string): string {
    return this.translate(key);
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    const value = TRANSLATIONS[lang][key];
    if (value !== undefined) return value;
    const fallback = TRANSLATIONS['pt'][key];
    if (fallback !== undefined) return fallback;
    return key;
  }

  private loadLanguage(): AppLanguage {
    if (typeof localStorage === 'undefined') return 'pt';
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'pt';
  }
}
