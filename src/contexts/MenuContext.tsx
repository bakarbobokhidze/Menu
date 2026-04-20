import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Badge = "chef" | "spicy" | "vegan" | "new";

export type Allergen = string;

export interface PortionSize {
  label: { en: string; ge: string; de: string; ru: string };
  price: number;
  weight?: string;
}

export interface Allergen {
  ge: string;
  en: string;
  de: string;
  ru: string;
}

export interface MenuItem {
  _id?: string;
  categoryId: string;
  name: { en: string; ge: string; de: string; ru: string };
  description: { en: string; ge: string; de: string; ru: string };
  price: number;
  image: string;
  badges: Badge[];
  inStock: boolean;
  views: number;
  allergens: Allergen[];
  portions: PortionSize[];
  calories?: number;
  prepTime?: string;
}

export interface Category {
  id: string;
  name: { en: string; ge: string; de: string; ru: string };
  icon: string;
}

const BASE_URL = "https://backend-uiw0.onrender.com";

const defaultCategories: Category[] = [
  {
    id: "appetizers",
    name: {
      en: "Appetizers",
      ge: "ამარილები",
      de: "Vorspeisen",
      ru: "Закуски",
    },
    icon: "Salad",
  },
  {
    id: "mains",
    name: {
      en: "Main Courses",
      ge: "ძირითადი კერძები",
      de: "Hauptgerichte",
      ru: "Основные блюда",
    },
    icon: "ChefHat",
  },
  {
    id: "grills",
    name: { en: "Grills", ge: "გრილები", de: "Grillgerichte", ru: "Грили" },
    icon: "Flame",
  },
  {
    id: "desserts",
    name: { en: "Desserts", ge: "დესერტები", de: "Desserts", ru: "Десерты" },
    icon: "Cake",
  },
  {
    id: "drinks",
    name: { en: "Drinks", ge: "სასმელები", de: "Getränke", ru: "Напитки" },
    icon: "Wine",
  },
];

interface MenuContextType {
  categories: Category[];
  items: MenuItem[];
  addCategory: (cat: Category) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: string) => void;
  incrementViews: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  // კატეგორიები backend-იდან
  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then(async (data) => {
        if (!data || data.length === 0) {
          // ბაზა ცარიელია — default-ები ავტვირთოთ
          await Promise.all(
            defaultCategories.map((cat) =>
              fetch(`${BASE_URL}/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cat),
              }),
            ),
          );
          setCategories(defaultCategories);
        } else {
          setCategories(data);
        }
      })
      .catch(() => setCategories(defaultCategories));
  }, []);

  // კერძები backend-იდან
  useEffect(() => {
    fetch(`${BASE_URL}/api/menu`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  const addCategory = async (cat: Category) => {
    try {
      const res = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      const saved = await res.json();
      setCategories((prev) => [...prev, saved]);
    } catch {
      setCategories((prev) => [...prev, cat]);
    }
  };

  const updateCategory = async (cat: Category) => {
    try {
      await fetch(`${BASE_URL}/api/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    } catch {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/categories/${id}`, { method: "DELETE" });
    } catch {}
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
  };

  const addItem = async (item: MenuItem) => {
    try {
      const response = await fetch(`${BASE_URL}/api/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        const savedItem = await response.json();
        setItems((prev) => [...prev, savedItem]);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const updateItem = async (item: MenuItem) => {
    try {
      const response = await fetch(`${BASE_URL}/api/menu/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        setItems((prev) => prev.map((i) => (i._id === item._id ? item : i)));
      }
    } catch (error) {
      console.error("ვერ მოხერხდა განახლება:", error);
    }
  };

  const deleteItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i._id !== id));

  const incrementViews = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/menu/${id}/view`, { method: "POST" });
      setItems((prev) =>
        prev.map((i) =>
          i._id === id || (i as any).id === id
            ? { ...i, views: (i.views || 0) + 1 }
            : i,
        ),
      );
    } catch (error) {
      console.error("Error updating views on server:", error);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        categories,
        items,
        addCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
        incrementViews,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
};
