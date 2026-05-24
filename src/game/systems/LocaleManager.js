import { LOCALES } from '../data/locales.js';

export class LocaleManager {
  constructor() {
    this.current = 'ru';
  }

  set(lang) {
    if (LOCALES[lang]) this.current = lang;
  }

  toggle() {
    this.current = this.current === 'ru' ? 'kz' : 'ru';
  }

  t(key, ...args) {
    const dict = LOCALES[this.current] ?? LOCALES['ru'];
    const val = dict[key] ?? LOCALES['ru'][key];
    if (val === undefined) return key;
    if (typeof val === 'function') return val(...args);
    return val;
  }
}
