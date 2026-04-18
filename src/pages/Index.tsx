import { useState, useMemo, useEffect } from "react";
import { useMenu, MenuItem } from "@/contexts/MenuContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CategoryBar from "@/components/CategoryBar";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import ItemDetailModal from "@/components/ItemDetailModal";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import "../../src/index.css";

const Index = () => {
  const { incrementViews } = useMenu();
  const { getTranslated, language } = useLanguage();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); // კერძების fade-in-ისთვის

  useEffect(() => {
    fetch("https://backend-uiw0.onrender.com/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
        // მცირე დაყოვნება რომ fade-in ლამაზად გამოჩნდეს
        setTimeout(() => setVisible(true), 100);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

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
  }, [menuItems, selectedCategory, search, getTranslated, language]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1,
    );
  }, [filtered]);

  const handleItemTap = (item: MenuItem) => {
    const id = item._id || (item as any).id;
    if (id) incrementViews(id);
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
          {/* ლოგო */}
          <div className="h-28 w-28 overflow-hidden rounded-full border border-border bg-white p-2 shadow-xl">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-full object-contain rounded-full"
            />
          </div>

          {/* სახელი */}
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Hacker
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold mt-1">
              Pschorr
            </p>
          </div>

          {/* loading dots */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-white p-1 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-display text-lg font-bold text-foreground leading-tight">
                  Hacker
                </h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  Pschorr
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                to="/admin"
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
              >
                <Settings size={20} />
              </Link>
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

      {/* კერძები fade-in ეფექტით */}
      <main
        className={`mx-auto max-w-lg px-4 pt-4 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid grid-cols-2 gap-3">
          {sorted.map((item, i) => (
            <div
              key={item._id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${i * 40}ms`,
                animationFillMode: "both",
              }}
            >
              <MenuCard item={item} onView={() => handleItemTap(item)} />
            </div>
          ))}
        </div>
        „
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm font-medium">No items found</p>
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
