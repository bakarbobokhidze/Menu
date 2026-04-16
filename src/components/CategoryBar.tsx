import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Salad, ChefHat, Flame, Cake, Wine, UtensilsCrossed } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Salad, ChefHat, Flame, Cake, Wine, UtensilsCrossed,
};

interface CategoryBarProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const CategoryBar = ({ selected, onSelect }: CategoryBarProps) => {
  const { categories } = useMenu();
  const { t, getTranslated } = useLanguage();

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto py-2">
      <button
        onClick={() => onSelect(null)}
        className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
          selected === null
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <UtensilsCrossed size={16} />
        {t('allCategories')}
      </button>
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] || UtensilsCrossed;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
              selected === cat.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Icon size={16} />
            {getTranslated(cat.name)}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryBar;
