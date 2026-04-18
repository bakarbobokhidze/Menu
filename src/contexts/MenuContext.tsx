import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Badge = "chef" | "spicy" | "vegan" | "new";

export type Allergen =
  | "gluten"
  | "dairy"
  | "nuts"
  | "eggs"
  | "soy"
  | "shellfish"
  | "fish"
  | "celery";

export interface PortionSize {
  label: { en: string; ge: string; de: string; ru: string };
  price: number;
  weight?: string;
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

const defaultCategories: Category[] = [
  {
    id: "appetizers",
    name: {
      en: "Appetizers",
      ge: "ამარილები",
      de: "Vorspeisen",
      ru: "закуски",
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

const defaultItems: MenuItem[] = [
  {
    categoryId: "appetizers",
    name: {
      en: "Pkhali Trio",
      ge: "ფხალი ტრიო",
      de: "Pkhali Trio",
      ru: "Трио Пхали",
    },
    description: {
      en: "Three variations of Georgian vegetable pâté with walnut paste — spinach, beetroot, and bean, each seasoned with traditional spices and fresh herbs.",
      ge: "საქართველოს ბოსტნეულის პაშტეტის სამი ვარიაცია ნიგვზის პასტით — ისპანახი, ჭარხალი და ლობიო.",
      de: "Drei Variationen von georgischem Gemüsepastete mit Walnusspaste — Spinat, Rote Bete und Bohnen.",
      ru: "Три варианта грузинского овощного паштета с пастой из грецких орехов — из шпината, свеклы и фасоли, каждый из которых приправлен традиционными специями и свежей зеленью.",
    },
    price: 14,
    image: "",
    badges: ["vegan", "chef"],
    inStock: true,
    views: 0,
    allergens: ["nuts"],
    portions: [
      {
        label: {
          en: "Regular (3 pcs)",
          ge: "ჩვეულებრივი (3 ცალი)",
          de: "Normal (3 St.)",
          ru: "Обычный (3 шт.)",
        },
        price: 14,
        weight: "180g",
      },
      {
        label: {
          en: "Large (5 pcs)",
          ge: "დიდი (5 ცალი)",
          de: "Groß (5 St.)",
          ru: "Обычный (5 шт.)",
        },
        price: 20,
        weight: "300g",
      },
    ],
    calories: 240,
    prepTime: "10 min",
  },
  {
    categoryId: "appetizers",
    name: {
      en: "Badrijani Nigvzit",
      ge: "ბადრიჯანი ნიგვზით",
      de: "Badrijani Nigvzit",
      ru: "Бадриджани Нигвзит",
    },
    description: {
      en: "Fried eggplant rolls filled with spiced walnut paste, garnished with pomegranate seeds and fresh coriander.",
      ge: "შემწვარი ბადრიჯანის რულეტები სანელებლიანი ნიგვზის პასტით, ბროწეულით და ქინძით.",
      de: "Gebratene Auberginenrollen mit gewürzter Walnusspaste, garniert mit Granatapfelkernen und frischem Koriander.",
      ru: "Жареные рулетики из баклажанов с начинкой из пряной ореховой пасты, украшенные зернами граната и свежей кинзой.",
    },
    price: 12,
    image: "",
    badges: ["vegan"],
    inStock: true,
    views: 0,
    allergens: ["nuts"],
    portions: [
      {
        label: {
          en: "Regular (4 rolls)",
          ge: "ჩვეულებრივი (4 რულეტი)",
          de: "Normal (4 Rollen)",
          ru: "Обычный (4 рулона)",
        },
        price: 12,
        weight: "200g",
      },
    ],
    calories: 195,
    prepTime: "15 min",
  },
  {
    categoryId: "mains",
    name: { en: "Khinkali", ge: "ხინკალი", de: "Khinkali", ru: "Хинкали" },
    description: {
      en: "Traditional Georgian soup dumplings, handcrafted with spiced beef and herbs. Twisted by hand in the classic style — hold by the knot and eat in one bite.",
      ge: "ტრადიციული ქართული ხინკალი, მწვანილით. ხელით მოხვეული კლასიკური სტილით.",
      de: "Traditionelle georgische Teigtaschen, handgefertigt mit gewürztem Rindfleisch und Kräutern.",
      ru: "Традиционные грузинские суповые пельмени, приготовленные вручную из пряной говядины и трав. Скручены вручную в классическом стиле — держите за узелок и ешьте за один укус.",
    },
    price: 18,
    image: "",
    badges: ["chef", "spicy"],
    inStock: true,
    views: 0,
    allergens: ["gluten", "eggs"],
    portions: [
      {
        label: { en: "5 pieces", ge: "5 ცალი", de: "5 Stück", ru: "5 штук" },
        price: 18,
        weight: "350g",
      },
      {
        label: {
          en: "10 pieces",
          ge: "10 ცალი",
          de: "10 Stück",
          ru: "10 штук",
        },
        price: 32,
        weight: "700g",
      },
    ],
    calories: 420,
    prepTime: "20 min",
  },
  {
    categoryId: "mains",
    name: {
      en: "Chicken Tabaka",
      ge: "ქათმის ტაბაკა",
      de: "Hähnchen Tabaka",
      ru: "Цыпленок табака",
    },
    description: {
      en: "Pan-fried spatchcocked chicken pressed under a weight until golden and crispy. Served with garlic cream sauce and fresh herbs.",
      ge: "ტაფაზე შეწვავი ქათამი ნიორიანი კრემის სოუსით და ახალი მწვანილით.",
      de: "Gebratenes plattgedrücktes Hähnchen mit Knoblauchsauce und frischen Kräutern.",
      ru: "Жареный цыпленок под прессом до золотистой корочки. Подается с чесночно-сливочным соусом и свежей зеленью.",
    },
    price: 24,
    image: "",
    badges: ["chef"],
    inStock: true,
    views: 0,
    allergens: ["dairy"],
    portions: [
      {
        label: {
          en: "Half chicken",
          ge: "ნახევარი ქათამი",
          de: "Halbes Hähnchen",
          ru: "Половина цыпленка",
        },
        price: 24,
        weight: "400g",
      },
      {
        label: {
          en: "Whole chicken",
          ge: "მთლიანი ქათამი",
          de: "Ganzes Hähnchen",
          ru: "Целый цыпленок",
        },
        price: 42,
        weight: "800g",
      },
    ],
    calories: 580,
    prepTime: "35 min",
  },
  {
    categoryId: "grills",
    name: {
      en: "Mtsvadi",
      ge: "მწვადი",
      de: "Mtsvadi",
      ru: "Мцвади (Шашлык)",
    },
    description: {
      en: "Grilled pork skewers marinated in pomegranate juice and onions. Cooked over grapevine coals for an authentic smoky flavor.",
      ge: "გრილზე შემწვარი ღორის მწვადი ბროწეულის წვენში, ვაზის ნახშირზე.",
      de: "Gegrillte Schweinefleischspieße in Granatapfelsaft mariniert, über Weinrebenholz gegrillt.",
      ru: "Свиной шашлык, маринованный в гранатовом соке и луке. Жареный на углях виноградной лозы для аутентичного аромата дыма.",
    },
    price: 22,
    image: "",
    badges: ["spicy"],
    inStock: true,
    views: 0,
    allergens: [],
    portions: [
      {
        label: {
          en: "Regular (250g)",
          ge: "ჩვეულებრივი (250გ)",
          de: "Normal (250g)",
          ru: "Обычный (250г)",
        },
        price: 22,
        weight: "250g",
      },
      {
        label: {
          en: "Large (400g)",
          ge: "დიდი (400გ)",
          de: "Groß (400g)",
          ru: "Большой (400г)",
        },
        price: 34,
        weight: "400g",
      },
    ],
    calories: 510,
    prepTime: "25 min",
  },
  {
    categoryId: "desserts",
    name: {
      en: "Churchkhela",
      ge: "ჩურჩხელა",
      de: "Tschurtschchela",
      ru: "Чурчхела",
    },
    description: {
      en: "Traditional grape and walnut candy, house-made following a centuries-old recipe. A natural Georgian delicacy.",
      ge: "ტრადიციული ყურძნისა და ნიგვზის ტკბილეული, სახლში მომზადებული უძველესი რეცეპტით.",
      de: "Traditionelle Trauben-Walnuss-Süßigkeit, hausgemacht nach einem jahrhundertealten Rezept.",
      ru: "Традиционная сладость из виноградного сока и грецких орехов, домашнего приготовления по старинному рецепту.",
    },
    price: 8,
    image: "",
    badges: ["vegan", "new"],
    inStock: true,
    views: 0,
    allergens: ["nuts"],
    portions: [
      {
        label: {
          en: "1 piece",
          ge: "1 ცალი",
          de: "1 Stück",
          ru: "1 штука",
        },
        price: 8,
        weight: "80g",
      },
      {
        label: {
          en: "3 pieces",
          ge: "3 ცალი",
          de: "3 Stück",
          ru: "3 штуки",
        },
        price: 20,
        weight: "240g",
      },
    ],
    calories: 310,
    prepTime: "5 min",
  },
  {
    categoryId: "drinks",
    name: {
      en: "Saperavi Wine",
      ge: "საფერავი ღვინო",
      de: "Saperavi Wein",
      ru: "Вино Саперави",
    },
    description: {
      en: "Full-bodied Georgian red wine from the Kakheti region. Rich, velvety with notes of dark cherry and spice.",
      ge: "სრული ტანის ქართული წითელი ღვინო კახეთის რეგიონიდან.",
      de: "Vollmundiger georgischer Rotwein aus der Region Kachetien.",
      ru: "Полнотелое грузинское красное вино из региона Кахетия. Насыщенное, бархатистое с нотками темной вишни и специй.",
    },
    price: 12,
    image: "",
    badges: ["chef"],
    inStock: true,
    views: 0,
    allergens: [],
    portions: [
      {
        label: {
          en: "Glass (150ml)",
          ge: "ბოკალი (150მლ)",
          de: "Glas (150ml)",
          ru: "Бокал (150мл)",
        },
        price: 12,
        weight: "150ml",
      },
      {
        label: {
          en: "Bottle (750ml)",
          ge: "ბოთლი (750მლ)",
          de: "Flasche (750ml)",
          ru: "Бутылка (750мл)",
        },
        price: 48,
        weight: "750ml",
      },
    ],
    calories: 125,
  },
  {
    categoryId: "drinks",
    name: {
      en: "Georgian Lemonade",
      ge: "ქართული ლიმონათი",
      de: "Georgische Limonade",
      ru: "Грузинский лимонад",
    },
    description: {
      en: "Tarragon-infused sparkling lemonade, a beloved classic Georgian refreshment served ice cold.",
      ge: "ტარხუნიანი გაზიანი ლიმონათი, საყვარელი კლასიკური ქართული გამაგრილებელი.",
      de: "Mit Estragon versetzte Limonade, ein beliebtes klassisches georgisches Erfrischungsgetränk.",
      ru: "Газированный лимонад с тархуном, любимый классический грузинский освежающий напиток.",
    },
    price: 6,
    image: "",
    badges: [],
    inStock: false,
    views: 0,
    allergens: [],
    portions: [
      {
        label: {
          en: "Regular (330ml)",
          ge: "ჩვეულებრივი (330მლ)",
          de: "Normal (330ml)",
          ru: "Обычный (330мл)",
        },
        price: 6,
        weight: "330ml",
      },
      {
        label: {
          en: "Large (500ml)",
          ge: "დიდი (500მლ)",
          de: "Groß (500ml)",
          ru: "Большой (500мл)",
        },
        price: 9,
        weight: "500ml",
      },
    ],
    calories: 85,
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
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("menu-categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [items, setItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("menu-items");
    return saved ? JSON.parse(saved) : defaultItems;
  });

  useEffect(() => {
    localStorage.setItem("menu-categories", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem("menu-items", JSON.stringify(items));
  }, [items]);

  const addCategory = (cat: Category) =>
    setCategories((prev) => [...prev, cat]);
  const updateCategory = (cat: Category) =>
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
  };

  const addItem = async (item: MenuItem) => {
    try {
      const response = await fetch(
        "https://backend-uiw0.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        },
      );

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
      const response = await fetch(
        `https://backend-uiw0.onrender.com/api/menu/${item._id}`,
        {
          method: "PATCH", // ან PUT, გააჩნია როგორ გაწერ სერვერზე
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        },
      );

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
      // 1. ვუგზავნით მოთხოვნას სერვერს (Backend-ს)
      await fetch(`https://backend-uiw0.onrender.com/api/menu/${id}/view`, {
        method: "POST",
      });

      // 2. მხოლოდ სერვერზე წარმატებით გაგზავნის შემდეგ ვანახლებთ UI-ს
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
