import { useState, useEffect } from "react";
import { useMenu, MenuItem, Category } from "@/contexts/MenuContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
    fetch("http://backend-uiw0.onrender.com/api/menu")
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
    // ვალიდაცია
    if (!itemData.name.ge.trim() || !itemData.name.en.trim()) {
      toast.error("შეიყვანეთ სახელი ქართულად და ინგლისურად");
      return;
    }

    try {
      const isEditing = !!editingItem;
      const url = isEditing
        ? `https://hacker-pshor.netlify.app/api/menu/${editingItem?._id}`
        : "https://hacker-pshor.netlify.app/api/menu";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        const saved = await response.json();
        if (isEditing) {
          setDbItems((prev) =>
            prev.map((i) => (i._id === saved._id ? saved : i)),
          );
          toast.success("განახლდა");
        } else {
          setDbItems((prev) => [...prev, saved]);
          toast.success("დაემატა");
        }
        setShowItemForm(false);
        setEditingItem(null);
      }
    } catch (error) {
      toast.error("შეცდომა შენახვისას");
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const response = await fetch(`https://backend-uiw0.onrender.com/api/menu/${id}`, {
        method: "DELETE",
      });
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
      _id: `item_${Date.now()}`, // აუცილებელია ახალი კერძისთვის
      categoryId: categories[0]?.id || "",
      name: { en: "", ge: "", de: "" },
      description: { en: "", ge: "", de: "" },
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
    lang: "en" | "ge" | "de",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleAddAllergen = () => {
    const trimmed = newAllergen.trim();
    if (trimmed && !form.allergens?.includes(trimmed as any)) {
      setForm({
        ...form,
        allergens: [...(form.allergens || []), trimmed as any],
      });
      setNewAllergen("");
    }
  };

  const isFormInvalid =
    !form.name.ge.trim() || !form.name.en.trim() || form.price <= 0;

  return (
    <div className="relative flex flex-col bg-card rounded-2xl border border-border max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-card/50 backdrop-blur-md z-20 flex justify-between items-center">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          {item ? (
            <Pencil className="text-primary" size={20} />
          ) : (
            <Plus className="text-primary" size={20} />
          )}
          {item ? "რედაქტირება" : "ახალი კერძის დამატება"}
        </h2>
        {item && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 font-bold"
            onClick={() =>
              confirm("ნამდვილად გსურთ წაშლა?") && onDelete(item._id)
            }
          >
            <Trash2 size={18} className="mr-1" /> წაშლა
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
          ფოტოსურათი
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative group aspect-video rounded-xl border-2 border-dashed border-border overflow-hidden bg-secondary/20 flex items-center justify-center">
            {form.image ? (
              <>
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <button
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="mx-auto w-10 h-10 mb-2 rounded-full bg-border flex items-center justify-center">
                  <Plus className="text-muted-foreground" size={20} />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold">
                  ფოტო არ არის არჩეული
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase opacity-60">
              ფოტოს URL ლინკი
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="bg-background border-border/60"
            />
            <p className="text-[9px] text-muted-foreground">
              * ჩასვით პირდაპირი ლინკი ფოტოზე (jpg, png, webp)
            </p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth">
        {/* LANGUAGES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
              ინფორმაცია ენების მიხედვით
            </h3>
            <div className="h-[1px] flex-1 bg-border ml-4" />
          </div>

          {(["ge", "en", "de"] as const).map((lang) => (
            <div
              key={lang}
              className="space-y-3 p-4 rounded-2xl bg-secondary/10 border border-border/40 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-6 w-10 items-center justify-center rounded bg-primary text-[10px] font-black uppercase text-primary-foreground">
                  {lang}
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  {lang === "ge"
                    ? "Georgian"
                    : lang === "en"
                      ? "English"
                      : "German"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                    დასახელება
                  </label>
                  <Input
                    className="bg-background border-border/60 focus:ring-primary/20"
                    value={form.name[lang]}
                    onChange={(e) =>
                      updateLangField("name", lang, e.target.value)
                    }
                    placeholder={`${lang === "ge" ? "მაგ: ხინკალი" : "e.g. Khinkali"}...`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-60 ml-1">
                    აღწერა
                  </label>
                  <Input
                    className="bg-background/50 border-border/40"
                    value={form.description[lang]}
                    onChange={(e) =>
                      updateLangField("description", lang, e.target.value)
                    }
                    placeholder="მოკლე აღწერა..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PRICE & CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
              ფასი (₾)
            </h3>
            <Input
              type="number"
              className="h-12 text-lg font-bold bg-secondary/20 border-none"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
              კატეგორია
            </h3>
            <div className="relative group">
              <select
                className="w-full h-12 rounded-xl border-2 border-border bg-secondary/20 px-4 py-2 text-sm font-bold transition-all appearance-none focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                {categories.map((cat: any) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="bg-card text-foreground py-2"
                  >
                    {cat.name.ge}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* ALLERGENS */}
        <div className="space-y-4 border-t border-dashed pt-8">
          <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
            ალერგენები
          </h3>
          <div className="flex gap-2">
            <Input
              className="bg-background"
              placeholder="მაგ: თხილი, რძე..."
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddAllergen())
              }
            />
            <Button
              type="button"
              onClick={handleAddAllergen}
              className="shrink-0"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.allergens?.map((alg, idx) => (
              <span
                key={idx}
                className="group flex items-center gap-2 bg-secondary text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold border border-border"
              >
                {alg}
                <X
                  size={14}
                  className="cursor-pointer text-muted-foreground group-hover:text-destructive transition-colors"
                  onClick={() =>
                    setForm({
                      ...form,
                      allergens: form.allergens.filter((a) => a !== alg),
                    })
                  }
                />
              </span>
            ))}
          </div>
        </div>

        {/* PORTIONS */}
        <div className="space-y-4 border-t border-dashed pt-8 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-primary/80">
              პორციები / ზომები
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
              onClick={() =>
                setForm({
                  ...form,
                  portions: [
                    ...(form.portions || []),
                    {
                      label: { ge: "", en: "", de: "" },
                      weight: "",
                      price: form.price,
                    },
                  ],
                })
              }
            >
              <Plus size={14} className="mr-1" /> დამატება
            </Button>
          </div>

          {form.portions?.map((portion, idx) => (
            <div
              key={idx}
              className="p-4 border border-border/60 rounded-2xl bg-secondary/5 relative space-y-3 group animate-in slide-in-from-bottom-2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                onClick={() =>
                  setForm({
                    ...form,
                    portions: form.portions.filter((_, i) => i !== idx),
                  })
                }
              >
                <Trash2 size={14} />
              </Button>

              <Input
                className="bg-background"
                placeholder="პორციის დასახელება (მაგ: დიდი)"
                value={portion.label.ge}
                onChange={(e) => {
                  const p = [...form.portions];
                  p[idx].label.ge = e.target.value;
                  setForm({ ...form, portions: p });
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  className="bg-background"
                  placeholder="წონა (გ)"
                  value={portion.weight}
                  onChange={(e) => {
                    const p = [...form.portions];
                    p[idx].weight = e.target.value;
                    setForm({ ...form, portions: p });
                  }}
                />
                <Input
                  className="bg-background font-bold"
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

      {/* FIXED FOOTER */}
      <div className="p-6 border-t bg-card/80 backdrop-blur-md z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4">
          <Button
            onClick={() => onSave(form)}
            className="flex-1 h-12 text-base font-black uppercase tracking-wider shadow-lg shadow-primary/25"
            disabled={isFormInvalid}
          >
            {item ? "ცვლილების შენახვა" : "კერძის დამატება"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12 text-base font-bold uppercase tracking-wider border-2"
          >
            გაუქმება
          </Button>
        </div>
        {isFormInvalid && (
          <p className="text-[10px] text-center mt-3 text-destructive font-bold animate-pulse">
            * გთხოვთ შეავსოთ მინიმუმ ქართული და ინგლისური დასახელებები და ფასი
          </p>
        )}
      </div>

      {/* CUSTOM SCROLLBAR STYLE */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.3);
        }
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

const CategoryForm = ({ category, onSave, onCancel }: any) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<Category>(
    category || {
      id: Date.now().toString(),
      name: { en: "", ge: "", de: "" },
      icon: "Utensils",
    },
  );
  return (
    <div className="space-y-4 bg-card p-6 rounded-xl border">
      <h2 className="font-display text-lg font-semibold">
        {category ? t("editItem") : t("addCategory")}
      </h2>
      <div className="space-y-2">
        {(["en", "ge", "de"] as const).map((lang) => (
          <div key={lang} className="flex items-center gap-2">
            <span className="w-8 text-xs font-bold uppercase">{lang}</span>
            <Input
              value={form.name[lang]}
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
          disabled={!form.name.ge.trim()}
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
