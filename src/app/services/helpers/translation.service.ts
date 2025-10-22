import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DatabaseService } from './database.service';
import { GlobalsService } from './globals.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private activeLanguage: string = 'English';
  private currentLanguage = new BehaviorSubject<string>('English');
  public availableLanguages: string[] = [];
  private rtlLanguages: string[] = [
    'arabic',
    'dari',
    'hebrew',
    'kurdish_sorani',
    'pashto',
    'persian',
    'sindhi',
    'thaana',
    'urdu',
    'uyghur',
  ];
  public translations: any = {};
  public currentNativeLang: boolean = false;
  public translateNumbers: boolean = true;

  constructor(private db: DatabaseService, private globals: GlobalsService) {
    this.initLanguage();
    this.currentLanguage.subscribe((language) => {
      this.activeLanguage = language;
      this.isRtlLanguage(language);
    });
  }

  /** Detect if language is RTL and update document direction */
  private isRtlLanguage(language: string): boolean {
    const isRtl = this.rtlLanguages.includes(language.toLowerCase());
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    this.currentNativeLang = isRtl;
    const root = document.documentElement;
    root.style.setProperty(
      '--font-family',
      isRtl ? "'Tajawal', sans-serif" : "'Poppins', sans-serif"
    );
    localStorage.setItem('currentLanguage', language);
    return isRtl;
  }

  /** Observable for checking if current language is RTL */
  get isRtl(): Observable<boolean> {
    return this.currentLanguage.asObservable().pipe(map((lang) => this.isRtlLanguage(lang)));
  }

  /** Get current active language */
  get CurrentLanguage(): string {
    return this.activeLanguage;
  }

  /** Observable of current language */
  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  /** Change and persist language */
  setCurrentLanguage(language: string): void {
    this.currentLanguage.next(language);
    localStorage.setItem('currentLanguage', language);
  }

  /** Initialize language */
  private initLanguage(): void {
    this.fetchDefaultLanguage().subscribe((defaultLang) => {
      const savedLang = localStorage.getItem('currentLanguage') || defaultLang;
      this.currentLanguage.next(savedLang);
      this.loadTranslations(savedLang);
    });
  }

  /** Fetch default language and available languages */
  private fetchDefaultLanguage(): Observable<string> {
    return new Observable<string>((observer) => {
      const path = `projects/${this.globals.ProjectId}/translations`;
      this.db.getDatabase(path).subscribe(
        (data) => {
          if (data) {
            this.translateNumbers = data.translateNumbers;
            this.availableLanguages = Object.keys(data.languages || {});
            this.translations = data.languages;
            const defaultLang = data.defaultLanguage || 'English';
            observer.next(defaultLang);
          } else {
            observer.next('English');
          }
          observer.complete();
        },
        () => {
          observer.next('English');
          observer.complete();
        }
      );
    });
  }

  /** Load translations for a specific language */
  private loadTranslations(language: string): void {
    const path = `projects/${this.globals.ProjectId}/translations/languages/${language}`;
    this.db.getDatabase(path).subscribe((data: any) => {
      this.translations[language] = data;
    });
  }

  /** Translate key */
  translate(key: string): string {
    const langData = this.translations[this.activeLanguage];
    return langData?.[key]?.value ?? key;
  }

  /**
   * Converts Western digits to Eastern Arabic digits only when:
   *  - `translateNumbers` is true in TranslationService
   *  - the current language is RTL (Arabic, Persian, etc.)
   *
   * @param text The text or numeric string to convert.
   * @returns The localized number string if applicable, otherwise the original text.
   */
  public convertToArabicDigits(text: string): string {
    if (!this.translateNumbers || !this.currentNativeLang) return text;
    const westernToEasternMap = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return text.replace(/[0-9]/g, (digit) => westernToEasternMap[parseInt(digit, 10)]);
  }
}
