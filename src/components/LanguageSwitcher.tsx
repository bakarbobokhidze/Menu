import { useLanguage, Language } from '@/contexts/LanguageContext';

const flags: Record<Language, string> = {
  ge: '🇬🇪',
  en: '🇬🇧',
  de: '🇩🇪',
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const langs: Language[] = ['ge', 'en', 'de'];

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
      {langs.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-all ${
            language === lang
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-sm">{flags[lang]}</span>
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
