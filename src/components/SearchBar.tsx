import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search')}
        className="w-full rounded-lg border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
      />
    </div>
  );
};

export default SearchBar;
