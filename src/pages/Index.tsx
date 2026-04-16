import { useState, useMemo, useEffect } from "react";
import { useMenu, MenuItem } from "@/contexts/MenuContext";
import { useLanguage } from "@/contexts/LanguageContext"; // ენა შემოგვაქვს აქედან
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CategoryBar from "@/components/CategoryBar";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import ItemDetailModal from "@/components/ItemDetailModal";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // 1. გამოიყენე კონტექსტიდან წამოღებული ფუნქციები
  const { incrementViews } = useMenu();
  const { getTranslated, language } = useLanguage();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // 2. მონაცემების წამოღება ბაზიდან
  useEffect(() => {
    fetch("https://backend-uiw0.onrender.com/api/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // 3. გაფილტვრა (გამოიყენება კონტექსტის getTranslated)
  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const translatedName = getTranslated(item.name) || "";
      const translatedDesc = getTranslated(item.description) || "";

      const matchesCategory =
        !selectedCategory || item.categoryId === selectedCategory;
      const matchesSearch =
        !search ||
        translatedName.toLowerCase().includes(search.toLowerCase()) ||
        translatedDesc.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, search, getTranslated, language]); // language დაემატა აქ

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1,
    );
  }, [filtered]);

  const handleItemTap = (item: MenuItem) => {
    // 1. ნახვის მომატება
    const id = item._id || (item as any).id;
    if (id) {
      incrementViews(id);
    }

    // 2. დეტალების ფანჯრის გახსნა
    setSelectedItem(item);
    setIsDetailOpen(true); // აქ დაემატა "Is" დასაწყისში
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            {/* ლოგოს კონტეინერი - მომრგვალებული და მინიმალისტური */}
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border/50 bg-secondary/20 flex items-center justify-center p-1 transition-all group-hover:border-primary/40 group-hover:bg-secondary/40">
              <img
                src="https://www.hacker-pschorr-shop.de/media/7b/91/52/1724921658/HP_PrimaerLogo_RGB_pos.png?ts=1750923228" // <--- აქ ჩასვი URL (უკეთესია გამჭვირვალე PNG ან SVG)
                alt="Hacker Pschorr Logo"
                className="h-full w-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/100x100?text=H";
                }}
              />
            </div>

            {/* ტექსტის ნაწილი - უფრო ახლოს და კომპაქტურად */}
            <div className="flex flex-col justify-center -space-y-0.5">
              {" "}
              {/* -space-y-0.5 აახლოებს ხაზებს */}
              <h1 className="font-display text-base font-black leading-none tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                Hacker
              </h1>
              <p className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/80 font-bold opacity-80">
                Pschorr
              </p>
            </div>
          </div>
          <div className="pb-3">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <CategoryBar
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {sorted.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onView={() => handleItemTap(item)}
            />
          ))}
        </div>
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">No items found</p>
          </div>
        )}
      </main>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Index;
