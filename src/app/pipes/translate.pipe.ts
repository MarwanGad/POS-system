import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/helpers/translation.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}
  /**
   * Core translation logic.
   *
   * @param value - Text or number to translate.
   * @returns Translated text or localized number string.
   */
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const textValue = String(value);

    // Try translating the key
    const translatedText = this.translationService.translate(textValue);

    // If no translation found, handle number conversion automatically
    if (translatedText === textValue) {
      return this.translationService.convertToArabicDigits(textValue);
    }

    // Return the translated text
    return translatedText;
  }
}
