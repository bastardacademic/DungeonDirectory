import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: require('./locales/en/translation.json') },
            es: { translation: require('./locales/es/translation.json') },
            fr: { translation: require('./locales/fr/translation.json') },
            de: { translation: require('./locales/de/translation.json') },
            it: { translation: require('./locales/it/translation.json') },
            pt: { translation: require('./locales/pt/translation.json') },
            ja: { translation: require('./locales/ja/translation.json') },
            zh: { translation: require('./locales/zh/translation.json') },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

export default i18n;
