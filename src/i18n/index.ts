import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEN from '../locales/en/common.json';
import homeEN from '../locales/en/home.json';
import aboutEN from '../locales/en/about.json';
import experienceEN from '../locales/en/experience.json';
import projectsEN from '../locales/en/projects.json';
import skillsEN from '../locales/en/skills.json';
import contactEN from '../locales/en/contact.json';

import commonES from '../locales/es/common.json';
import homeES from '../locales/es/home.json';
import aboutES from '../locales/es/about.json';
import experienceES from '../locales/es/experience.json';
import projectsES from '../locales/es/projects.json';
import skillsES from '../locales/es/skills.json';
import contactES from '../locales/es/contact.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEN,
        home: homeEN,
        about: aboutEN,
        experience: experienceEN,
        projects: projectsEN,
        skills: skillsEN,
        contact: contactEN,
      },
      es: {
        common: commonES,
        home: homeES,
        about: aboutES,
        experience: experienceES,
        projects: projectsES,
        skills: skillsES,
        contact: contactES,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'about', 'experience', 'projects', 'skills', 'contact'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
