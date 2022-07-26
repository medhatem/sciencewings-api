import * as i18n from 'i18n';
import * as path from 'path';
i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
  api: {
    __: 'translate',
    __n: 'translateN',
  },
});
export default i18n;
