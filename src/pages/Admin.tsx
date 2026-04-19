import { useState, useEffect } from "react";
import { useMenu, MenuItem, Category } from "@/contexts/MenuContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Salad,
  ChefHat,
  Flame,
  Cake,
  Wine,
  UtensilsCrossed,
  Fish,
  Coffee,
  Beer,
  Pizza,
  Soup,
  Cookie,
  Sandwich,
  Beef,
  Grape,
  GlassWater,
  Wheat,
  Star,
  BookOpen,
  Utensils,
  Droplets,
  Pipette,
  Martini,
  FlaskConical,
  TestTube,
  CupSoda,
  Torus,
  CakeSlice,
  CookingPot,
} from "lucide-react";
import {
  X,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  LogOut,
  Lock,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const KhinkaliIcon = ({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2 C12 2, 6 6, 5 12 C4 17, 7 21, 12 21 C17 21, 20 17, 19 12 C18 6, 12 2, 12 2 Z" />
    <path d="M12 2 C12 2, 9 7, 12 10 C15 7, 12 2, 12 2 Z" />
    <path d="M12 2 L12 5" />
    <path d="M9.5 3.5 C9.5 3.5, 8 8, 10 11" />
    <path d="M14.5 3.5 C14.5 3.5, 16 8, 14 11" />
  </svg>
);

const ADMIN_PASSWORD = "admin123";

/* --- LOGIN COMPONENT --- */
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const { t } = useLanguage();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      toast.error("არასწორი პაროლი");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Lock className="text-primary" size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("adminLogin")}
          </h1>
        </div>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder={t("password")}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            className={error ? "border-destructive" : ""}
          />
          <Button type="submit" className="w-full">
            {t("login")}
          </Button>
          <Link
            to="/"
            className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to menu
          </Link>
        </form>
      </div>
    </div>
  );
};

/* --- DELETE CONFIRM MODAL --- */
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, itemName }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-foreground">
          დარწმუნებული ხართ?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          თქვენ აპირებთ წაშალოთ <strong>"{itemName}"</strong>. ამ მოქმედების
          დაბრუნება შეუძლებელია.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            გაუქმება
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            წაშლა
          </Button>
        </div>
      </div>
    </div>
  );
};

type Tab = "items" | "categories" | "analytics";

/* --- MAIN ADMIN COMPONENT --- */
const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const { categories, addCategory, updateCategory, deleteCategory } = useMenu();
  const { t, getTranslated } = useLanguage();
  const [tab, setTab] = useState<Tab>("items");

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [dbItems, setDbItems] = useState<MenuItem[]>([]);

  // წაშლის მოდალისთვის
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const fetchMenu = () => {
    fetch("https://backend-uiw0.onrender.com/api/menu")
      .then((res) => res.json())
      .then((data) => setDbItems(data))
      .catch(() => toast.error("მენიუ ვერ ჩაიტვირთა"));
  };

  useEffect(() => {
    if (authenticated) {
      fetchMenu();
    }
  }, [authenticated]);

  const handleSaveItem = async (itemData: MenuItem) => {
    // 1. მონაცემების მომზადება (სუფთა ობიექტის შექმნა)
    // თუ ID იწყება "item_"-ით, საერთოდ ვაშორებთ მას, რომ ბაზამ ახალი შექმნას
    const isNew = !itemData._id || itemData._id.startsWith("item_");
    
    const payload = { ...itemData };
    if (isNew) {
      delete payload._id; // ახალი კერძის შემთხვევაში ვაშლით დროებით ID-ს
    }
  
    // 2. ვალიდაცია
    if (!payload.name?.ge?.trim() || !payload.name?.en?.trim()) {
      toast.error("შეიყვანეთ სახელი ქართულად და ინგლისურად");
      return;
    }
  
    try {
      const url = !isNew
        ? `https://backend-uiw0.onrender.com/api/menu/${payload._id}`
        : "https://backend-uiw0.onrender.com/api/menu";
  
      const response = await fetch(url, {
        method: !isNew ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const saved = await response.json();
        
        if (!isNew) {
          // რედაქტირება: ვპოულობთ ძველს და ვანაცვლებთ ზუსტად იმავე ადგილას
          setDbItems((prev) =>
            prev.map((i) => (i._id === saved._id ? saved : i))
          );
          toast.success("განახლდა წარმატებით");
        } else {
          // დამატება: უბრალოდ ვამატებთ მასივის ბოლოში
          setDbItems((prev) => [...prev, saved]);
          toast.success("დაემატა წარმატებით");
        }
  
        setShowItemForm(false);
        setEditingItem(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "სერვერმა მოთხოვნა არ მიიღო");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("შეცდომა შენახვისას");
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://backend-uiw0.onrender.com/api/menu/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setDbItems((prev) => prev.filter((i) => i._id !== id));
        toast.success("წაშლილია");
      }
    } catch (error) {
      toast.error("წაშლა ვერ მოხერხდა");
    }
  };

  const handleToggleStock = async (item: MenuItem) => {
    const newStatus = !item.inStock;
    try {
      const response = await fetch(
        `https://backend-uiw0.onrender.com/api/menu/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inStock: newStatus }),
        },
      );

      if (response.ok) {
        setDbItems((prev) =>
          prev.map((i) =>
            i._id === item._id ? { ...i, inStock: newStatus } : i,
          ),
        );
        toast.success(newStatus ? "ჩაირთო" : "გაითიშა");
      }
    } catch (error) {
      toast.error("სერვერთან კავშირი გაწყდა");
    }
  };

  if (!authenticated)
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;

  const mostViewed = [...dbItems]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-display text-lg font-bold">{t("dashboard")}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAuthenticated(false)}
          >
            <LogOut size={16} className="mr-2" /> {t("logout")}
          </Button>
        </div>
        <div className="mx-auto max-w-2xl px-4 flex gap-1 pb-2">
          {(["items", "categories", "analytics"] as Tab[]).map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === tb
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(
                tb === "items"
                  ? "menuItems"
                  : tb === "categories"
                    ? "categories"
                    : "analytics",
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {tab === "items" && (
          <ItemsTab
            items={dbItems}
            categories={categories}
            onAdd={() => {
              setEditingItem(null);
              setShowItemForm(true);
            }}
            onEdit={(item: MenuItem) => {
              setEditingItem(item);
              setShowItemForm(true);
            }}
            onDelete={(id: string) =>
              setItemToDelete(dbItems.find((i) => i._id === id) || null)
            }
            onToggleStock={handleToggleStock}
            onPriceUpdate={(item: MenuItem, price: number) =>
              handleSaveItem({ ...item, price })
            }
            showForm={showItemForm}
            editingItem={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setShowItemForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {tab === "categories" && (
          <CategoriesTab
            categories={categories}
            onAdd={() => {
              setEditingCategory(null);
              setShowCatForm(true);
            }}
            onEdit={(cat: Category) => {
              setEditingCategory(cat);
              setShowCatForm(true);
            }}
            onDelete={(id: string) => {
              deleteCategory(id);
              toast.success("წაშლილია");
            }}
            showForm={showCatForm}
            editingCategory={editingCategory}
            onSave={(cat: Category) => {
              if (editingCategory) updateCategory(cat);
              else addCategory(cat);
              setShowCatForm(false);
              toast.success("შენახულია");
            }}
            onCancel={() => setShowCatForm(false)}
          />
        )}

        {tab === "analytics" && (
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold">
              {t("mostViewed")}
            </h2>
            {mostViewed.map((item, i) => (
              <div
                key={item._id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    {getTranslated(item.name)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye size={14} /> {item.views || 0} {t("views")}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        itemName={getTranslated(itemToDelete?.name || { ge: "" })}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            executeDelete(itemToDelete._id!);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};

/* --- ITEMS TAB COMPONENT --- */
const ItemsTab = ({
  items,
  categories,
  onAdd,
  onEdit,
  onDelete,
  onToggleStock,
  onPriceUpdate,
  showForm,
  editingItem,
  onSave,
  onCancel,
}: any) => {
  const { t, getTranslated } = useLanguage();

  if (showForm)
    return (
      <ItemForm
        item={editingItem}
        categories={categories}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{t("menuItems")}</h2>
        <Button size="sm" onClick={onAdd}>
          <Plus size={16} className="mr-1" /> {t("addItem")}
        </Button>
      </div>
      {items.map((item: MenuItem) => (
        <div
          key={item._id}
          className="rounded-lg border border-border bg-card p-3"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-sm">
                {getTranslated(item.name)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getTranslated(
                  categories.find((c: any) => c.id === item.categoryId)
                    ?.name || { ge: "ზოგადი" },
                )}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-primary">₾</span>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  onPriceUpdate(item, parseFloat(e.target.value) || 0)
                }
                className="w-16 rounded border border-border bg-secondary px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={item.inStock}
                onCheckedChange={() => onToggleStock(item)}
              />
              <span className="text-xs text-muted-foreground">
                {t("stock")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(item)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(item._id!)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* --- ITEM FORM COMPONENT --- */
const ItemForm = ({ item, categories, onSave, onCancel, onDelete }: any) => {
  const { t } = useLanguage();
  const [newAllergen, setNewAllergen] = useState("");

  const [form, setForm] = useState<MenuItem>(() => {
    if (item) return item;
    return {
      categoryId: categories[0]?.id || "",
      name: { en: "", ge: "", de: "", ru: "" },
      description: { en: "", ge: "", de: "", ru: "" },
      price: 0,
      image: "",
      badges: [],
      allergens: [],
      portions: [],
      inStock: true,
    } as MenuItem;
  });

  const updateLangField = (
    field: "name" | "description",
    lang: "en" | "ge" | "de" | "ru",
    value: string,
  ) => {
    setForm({
      ...form,
      [field]: {
        ...form[field],
        [lang]: value,
      },
    });
  };

  const handleAddAllergen = () => {
    const trimmed = newAllergen?.trim();
    if (!trimmed) return;
    
    setForm((prev) => {
      if (prev.allergens?.includes(trimmed as any)) return prev;
      return {
        ...prev,
        allergens: [...(prev.allergens || []), trimmed as any],
      };
    });
    setNewAllergen("");
  };

  const isFormInvalid = !form?.name?.ge?.trim() || !form?.name?.en?.trim();
  return (
    <div className="relative flex flex-col bg-card rounded-2xl border border-border max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-card/50 backdrop-blur-md z-20 flex justify-between items-center shrink-0">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          {item ? (
            <Pencil className="text-primary" size={20} />
          ) : (
            <Plus className="text-primary" size={20} />
          )}
          {item ? "რედაქტირება" : "ახალი კერძის დამატება"}
        </h2>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
        <div className="p-6 space-y-8">
          {" "}
          {/* მთლიანი შიგთავსის კონტეინერი */}
          {/* 1. ფოტოსურათის სექცია - მინიმალისტური და სქროლვადი */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-primary/70">
              ფოტოსურათი
            </h3>
            <div className="flex items-center gap-4 bg-secondary/10 p-2.5 rounded-xl border border-border/40">
              {/* პატარა კვადრატული Preview */}
              <div className="relative h-16 w-16 shrink-0 rounded-lg border border-border overflow-hidden bg-background group">
                {form.image ? (
                  <>
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute inset-0 flex items-center justify-center bg-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full opacity-30">
                    <Plus size={16} />
                  </div>
                )}
              </div>

              {/* კომპაქტური Input */}
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="ჩასვით ფოტოს ლინკი..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="bg-background border-border/60 h-9 text-xs"
                />
                <p className="text-[8px] text-muted-foreground px-1 uppercase font-bold opacity-70">
                  Direct Link (jpg, png, webp)
                </p>
              </div>
            </div>
          </div>
          {/* 2. LANGUAGES SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
                ინფორმაცია
              </h3>
              <div className="h-[1px] flex-1 bg-border ml-4" />
            </div>

            {(["ge", "en", "ru", "de"] as const).map((lang) => (
              <div
                key={lang}
                className="space-y-3 p-4 rounded-2xl bg-secondary/5 border border-border/40"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary text-[9px] font-black uppercase text-primary-foreground">
                    {lang}
                  </span>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">
                      დასახელება
                    </label>
                    <Input
                      className="bg-background"
                      value={form.name[lang] || ""}
                      onChange={(e) =>
                        updateLangField("name", lang, e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">
                      აღწერა
                    </label>
                    <Input
                      className="bg-background/50"
                      value={form.description[lang] || ""}
                      onChange={(e) =>
                        updateLangField("description", lang, e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 3. PRICE & CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase opacity-60">
                ფასი (₾)
              </label>
              <Input
                type="number"
                className="h-10 font-bold bg-secondary/20"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                კატეგორია
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ ...form, categoryId: cat.id })}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      form.categoryId === cat.id
                        ? "border-orange-500 bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                        : "border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {cat.name.ge}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* 4. ALLERGENS */}
          <div className="space-y-4 pt-4 border-t border-dashed">
            <label className="text-[10px] font-bold uppercase opacity-60">
              ალერგენები
            </label>
            <div className="flex gap-2">
              <Input
                className="h-9 text-xs"
                placeholder="მაგ: თხილი..."
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddAllergen())
                }
              />
              <Button
                type="button"
                onClick={handleAddAllergen}
                size="sm"
                className="h-9 shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.allergens?.map((alg, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md text-[11px] font-medium border border-border"
                >
                  {alg}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-destructive"
                    onClick={() => {
                      setForm({
                        ...form,
                        allergens: form.allergens.filter((a) => a !== alg),
                      });
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
          {/* 5. PORTIONS */}
          <div className="space-y-4 pt-4 border-t border-dashed">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase opacity-60">
                პორციები
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] font-bold text-primary"
                onClick={() =>
                  setForm({
                    ...form,
                    portions: [
                      ...(form.portions || []),
                      {
                        label: { ge: "", en: "", de: "", ru: "" }, // ✅ სწორია
                        weight: "",
                        price: form.price,
                      },
                    ],
                  })
                }
              >
                + დამატება
              </Button>
            </div>
            {form.portions?.map((portion, idx) => (
              <div
                key={idx}
                className="p-3 border border-border/40 rounded-xl bg-secondary/5 relative space-y-2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setForm({
                      ...form,
                      portions: form.portions.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <Trash2 size={12} />
                </Button>
                <Input
                  className="h-8 text-xs"
                  placeholder="დასახელება (GE)"
                  value={portion.label.ge}
                  onChange={(e) => {
                    const p = [...form.portions];
                    p[idx].label.ge = e.target.value;
                    setForm({ ...form, portions: p });
                  }}
                />
                <Input
                  className="h-8 text-xs"
                  placeholder="Название (RU)"
                  value={portion.label.ru || ""}
                  onChange={(e) => {
                    const p = [...form.portions];
                    p[idx].label.ru = e.target.value;
                    setForm({ ...form, portions: p });
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    className="h-8 text-xs"
                    placeholder="წონა"
                    value={portion.weight}
                    onChange={(e) => {
                      const p = [...form.portions];
                      p[idx].weight = e.target.value;
                      setForm({ ...form, portions: p });
                    }}
                  />
                  <Input
                    className="h-8 text-xs font-bold"
                    type="number"
                    placeholder="ფასი"
                    value={portion.price}
                    onChange={(e) => {
                      const p = [...form.portions];
                      p[idx].price = parseFloat(e.target.value);
                      setForm({ ...form, portions: p });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="p-4 border-t bg-card shrink-0">
        <div className="flex gap-3">
          <Button
            onClick={() => {
              console.log("saving this data:", form);
              onSave(form);
            }}
            className="flex-1 h-11 text-sm font-bold uppercase tracking-wider shadow-lg"
            disabled={isFormInvalid}
          >
            {item ? "შენახვა" : "დამატება"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-11 text-sm font-bold uppercase tracking-wider"
          >
            გაუქმება
          </Button>
        </div>
      </div>

      <style>{`
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    `}</style>
    </div>
  );
};

/* --- CATEGORIES TAB & FORM --- */
const CategoriesTab = ({
  categories,
  onAdd,
  onEdit,
  onDelete,
  showForm,
  editingCategory,
  onSave,
  onCancel,
}: any) => {
  const { t, getTranslated } = useLanguage();
  if (showForm)
    return (
      <CategoryForm
        category={editingCategory}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          {t("categories")}
        </h2>
        <Button size="sm" onClick={onAdd}>
          <Plus size={16} className="mr-1" /> {t("addCategory")}
        </Button>
      </div>
      {categories.map((cat: any) => (
        <div
          key={cat.id}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
        >
          <p className="font-medium text-sm">{getTranslated(cat.name)}</p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(cat)}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(cat.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CATEGORY_ICONS: {
  value: string;
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: "Star", label: "სტარტერები", Icon: Star },
  { value: "BookOpen", label: "მენიუ", Icon: BookOpen },
  { value: "ChefHat", label: "ძირითადი კერძები", Icon: ChefHat },
  { value: "Wheat", label: "ცომეული", Icon: Wheat },
  { value: "KhinkaliIcon", label: "ხინკალი", Icon: KhinkaliIcon },
  { value: "Pizza", label: "პიცა-პასტა", Icon: Pizza },
  { value: "Salad", label: "სალათები", Icon: Salad },
  { value: "Soup", label: "წვნიანები", Icon: Soup },
  { value: "CakeSlice", label: "დესერტი", Icon: CakeSlice },
  { value: "Coffee", label: "ყავა-ჩაი", Icon: Coffee },
  { value: "GlassWater", label: "სასმელები", Icon: GlassWater },
  { value: "CupSoda", label: "უალკოჰოლო", Icon: CupSoda },
  { value: "Beer", label: "ლუდი", Icon: Beer },
  { value: "Flame", label: "არაყი-ვისკი", Icon: Flame },
  { value: "Martini", label: "კოქტეილი", Icon: Martini },
  { value: "Wine", label: "ღვინო", Icon: Wine },
  { value: "Fish", label: "თევზი", Icon: Fish },
  { value: "Utensils", label: "მთავარი", Icon: Utensils },
  { value: "CookingPot", label: "კერძი", Icon: CookingPot },
  { value: "Grape", label: "ხილი", Icon: Grape },
  { value: "Torus", label: "სოუსები", Icon: Torus },
];

const CategoryForm = ({ category, onSave, onCancel }: any) => {
  const { t } = useLanguage();
  const [iconOpen, setIconOpen] = useState(false);
  const [form, setForm] = useState<Category>(
    category || {
      id: Date.now().toString(),
      name: { en: "", ge: "", de: "", ru: "" },
      icon: "UtensilsCrossed",
    },
  );

  const SelectedIcon =
    CATEGORY_ICONS.find((i) => i.value === form.icon)?.Icon || UtensilsCrossed;

  return (
    <div className="space-y-4 bg-card p-6 rounded-xl border">
      <h2 className="font-display text-lg font-semibold">
        {category ? t("editItem") : t("addCategory")}
      </h2>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase opacity-60">
          ლოგო
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIconOpen(!iconOpen)}
            className="flex items-center gap-3 w-full rounded-lg border border-border bg-secondary/20 px-4 py-2.5 text-left transition-all hover:bg-secondary/40"
          >
            <SelectedIcon size={20} className="text-primary" />
            <span className="flex-1 text-sm font-medium">
              {CATEGORY_ICONS.find((i) => i.value === form.icon)?.label ||
                "აირჩიე"}
            </span>
            <ChevronDown
              size={16}
              className={`opacity-50 transition-transform duration-200 ${iconOpen ? "rotate-180" : ""}`}
            />
          </button>

          {iconOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-card shadow-2xl p-2">
              <div className="grid grid-cols-5 gap-1">
                {CATEGORY_ICONS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, icon: value });
                      setIconOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-secondary ${
                      form.icon === value
                        ? "bg-primary/20 ring-1 ring-primary"
                        : ""
                    }`}
                  >
                    <Icon size={20} className="text-primary" />
                    <span className="text-[9px] text-muted-foreground leading-tight">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {(["en", "ge", "de", "ru"] as const).map((lang) => (
          <div key={lang} className="flex items-center gap-2">
            <span className="w-8 text-xs font-bold uppercase">{lang}</span>
            <Input
              value={form.name[lang] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: { ...form.name, [lang]: e.target.value },
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => onSave(form)}
          className="flex-1"
          disabled={!form.name?.ge?.trim()}
        >
          {t("save")}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
};

export default Admin;
