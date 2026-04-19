import { MenuItem, Badge } from "@/contexts/MenuContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/contexts/MenuContext";
import {
  Star,
  Flame,
  Leaf,
  Sparkles,
  X,
  Clock,
  Zap,
  AlertTriangle,
  Scale,
} from "lucide-react";

const badgeConfig: Record
  Badge,
  { icon: React.ElementType; colorClass: string; key: string }
> = {
  chef: {
    icon: Star,
    colorClass: "bg-[hsl(40,52%,58%)] text-[hsl(240,6%,4%)]",
    key: "chefSpecial",
  },
  spicy: {
    icon: Flame,
    colorClass: "bg-destructive text-destructive-foreground",
    key: "spicy",
  },
  vegan: {
    icon: Leaf,
    colorClass: "bg-[hsl(142,50%,45%)] text-[hsl(0,0%,100%)]",
    key: "vegan",
  },
  new: {
    icon: Sparkles,
    colorClass: "bg-[hsl(200,80%,50%)] text-[hsl(0,0%,100%)]",
    key: "newItem",
  },
};

interface ItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

const ItemDetailModal = ({ item, onClose }: ItemDetailModalProps) => {
  const { t, getTranslated } = useLanguage();
  const { categories } = useMenu();
  const category = categories.find((c) => c.id === item.categoryId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl sm:mx-4 animate-fade-in max-h-[90vh] flex flex-col"
      >
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-secondary">
          {item.image ? (
            <img
              src={item.image}
              alt={getTranslated(item.name)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="font-display text-6xl text-muted-foreground/20">
                {getTranslated(item.name).charAt(0)}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80"
          >
            <X size={18} />
          </button>

          {item.badges && item.badges?.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              {item.badges.map((badge) => {
                const config = badgeConfig[badge];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <span
                    key={badge}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.colorClass}`}
                  >
                    <Icon size={12} />
                    {t(config.key)}
                  </span>
                );
              })}
            </div>
          )}

          {!item.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <span className="rounded-full bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
                {t("outOfStock")}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            <div>
              {category && (
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
                  {getTranslated(category.name)}
                </p>
              )}
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
                  {getTranslated(item.name)}
                </h2>
                <span className="shrink-0 text-xl font-bold text-primary">
                  ₾{item.price}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {item.calories && (
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                  <Zap size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    {item.calories} kcal
                  </span>
                </div>
              )}
              {item.prepTime && (
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                  <Clock size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    {item.prepTime}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {getTranslated(item.description)}
            </p>

            {item.portions?.length > 0 && (
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <Scale size={14} className="text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {t("portionSizes")}
                  </h3>
                </div>
                <div className="space-y-2">
                  {item.portions.map((portion, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {getTranslated(portion.label)}
                        </p>
                        {portion.weight && (
                          <p className="text-xs text-muted-foreground">
                            {portion.weight}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-primary">
                        ₾{portion.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              {item.allergens?.length > 0 ? (
                <>
                  <div className="mb-2.5 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[hsl(40,80%,55%)]" />
                    <h3 className="text-sm font-semibold text-foreground">
                      {t("allergens")}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
                      >
                        <span>⚠️</span>
                        {typeof allergen === 'string' 
                          ? allergen 
                          : (allergen.ge || allergen.en || JSON.stringify(allergen))}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-[hsl(142,50%,45%)]/10 px-4 py-3">
                  <span className="text-sm">✅</span>
                  <p className="text-xs font-medium text-[hsl(142,50%,45%)]">
                    {t("noAllergens")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
