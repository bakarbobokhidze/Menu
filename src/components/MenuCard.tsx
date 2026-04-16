import { MenuItem, Badge } from "@/contexts/MenuContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Flame, Leaf, Sparkles } from "lucide-react";

const badgeConfig: Record<
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

interface MenuCardProps {
  item: MenuItem;
  onView?: () => void;
}

const MenuCard = ({ item, onView }: MenuCardProps) => {
  const { t, getTranslated } = useLanguage();

  return (
    <div
      onClick={onView}
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
        item.inStock
          ? "border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
          : "border-border/50 bg-card/50 opacity-60"
      }`}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {item.image ? (
          <img
            src={item.image}
            alt={getTranslated(item.name)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl text-muted-foreground/30">
              {getTranslated(item.name).charAt(0)}
            </span>
          </div>
        )}

        {/* Badges */}
        {item.badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {item.badges.map((badge) => {
              const config = badgeConfig[badge];
              const Icon = config.icon;
              return (
                <span
                  key={badge}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.colorClass}`}
                >
                  <Icon size={10} />
                  {t(config.key)}
                </span>
              );
            })}
          </div>
        )}

        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight text-foreground">
            {getTranslated(item.name)}
          </h3>
          <span className="shrink-0 font-semibold text-primary">
            ₾{item.price}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {getTranslated(item.description)}
        </p>
      </div>
    </div>
  );
};

export default MenuCard;
