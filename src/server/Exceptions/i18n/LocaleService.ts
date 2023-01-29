import { Replacements } from 'i18n';
import { Vars } from '../BaseHttpError';
import i18n from './config';
import { provideSingleton } from '@/di';

// import * as i18n from 'i18n';
// import * as path from 'path';

/**
 * LocaleService
 */
@provideSingleton()
export class LocaleService {
  /**
   *
   * @param i18nProvider The i18n provider
   */
  constructor(private i18nProvider: i18n.I18n = i18n) {}
  /**
   *
   * @returns {string} The current locale code
   */
  getCurrentLocale() {
    return this.i18nProvider.getLocale();
  }
  /**
   *
   * @returns string[] The list of available locale codes
   */
  getLocales(): string[] {
    return this.i18nProvider.getLocales();
  }
  /**
   *
   * @param locale The locale to set. Must be from the list of available locales.
   */
  setLocale(locale: string): void {
    if (this.getLocales().indexOf(locale) !== -1) {
      this.i18nProvider.setLocale(locale);
    }
  }
  /**
   *
   * @param string String to translate
   * @param args Extra parameters
   * @returns {string} Translated string
   */
  translate(message: string, replacements?: Vars) {
    if (replacements) {
      if (typeof replacements === 'number') {
        return this.translatePlurals(message as string, replacements as number);
      } else {
        return this.i18nProvider.__(message, replacements as Replacements);
      }
    }
    return this.i18nProvider.__(message);
  }
  /**
   *
   * @param phrase Object to translate
   * @param count The plural number
   * @returns {string} Translated string
   */
  translatePlurals(phrase: string, count: number) {
    return this.i18nProvider.__n(phrase, count);
  }

  getMessageInEn(message: string, replacements?: Vars) {
    const current = this.getCurrentLocale();
    this.setLocale('en');
    const result = this.translate(message, replacements);
    this.setLocale(current);
    return result;
  }
}
