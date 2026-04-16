import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ge' | 'de';

type Translations = {
  [key: string]: { en: string; ge: string; de: string };
};

const uiTranslations: Translations = {
  search: { en: 'Search menu...', ge: 'მენიუს ძებნა...', de: 'Menü durchsuchen...' },
  callWaiter: { en: 'Call Waiter', ge: 'მიმტანის გამოძახება', de: 'Kellner rufen' },
  requestBill: { en: 'Request Bill', ge: 'ანგარიში', de: 'Rechnung bitte' },
  outOfStock: { en: 'Out of Stock', ge: 'არ არის მარაგში', de: 'Nicht verfügbar' },
  chefSpecial: { en: "Chef's Special", ge: 'შეფის სპეციალური', de: 'Empfehlung des Küchenchefs' },
  spicy: { en: 'Spicy', ge: 'ცხარე', de: 'Scharf' },
  vegan: { en: 'Vegan', ge: 'ვეგანური', de: 'Vegan' },
  newItem: { en: 'New', ge: 'ახალი', de: 'Neu' },
  allCategories: { en: 'All', ge: 'ყველა', de: 'Alle' },
  adminLogin: { en: 'Admin Login', ge: 'ადმინის შესვლა', de: 'Admin-Anmeldung' },
  password: { en: 'Password', ge: 'პაროლი', de: 'Passwort' },
  login: { en: 'Login', ge: 'შესვლა', de: 'Anmelden' },
  logout: { en: 'Logout', ge: 'გამოსვლა', de: 'Abmelden' },
  dashboard: { en: 'Dashboard', ge: 'დაფა', de: 'Dashboard' },
  addItem: { en: 'Add Item', ge: 'დამატება', de: 'Hinzufügen' },
  editItem: { en: 'Edit Item', ge: 'რედაქტირება', de: 'Bearbeiten' },
  deleteItem: { en: 'Delete', ge: 'წაშლა', de: 'Löschen' },
  save: { en: 'Save', ge: 'შენახვა', de: 'Speichern' },
  cancel: { en: 'Cancel', ge: 'გაუქმება', de: 'Abbrechen' },
  title: { en: 'Title', ge: 'სათაური', de: 'Titel' },
  description: { en: 'Description', ge: 'აღწერა', de: 'Beschreibung' },
  price: { en: 'Price', ge: 'ფასი', de: 'Preis' },
  category: { en: 'Category', ge: 'კატეგორია', de: 'Kategorie' },
  categories: { en: 'Categories', ge: 'კატეგორიები', de: 'Kategorien' },
  menuItems: { en: 'Menu Items', ge: 'მენიუს ერთეულები', de: 'Menüpunkte' },
  settings: { en: 'Settings', ge: 'პარამეტრები', de: 'Einstellungen' },
  analytics: { en: 'Analytics', ge: 'ანალიტიკა', de: 'Analytik' },
  mostViewed: { en: 'Most Viewed', ge: 'ყველაზე ნახული', de: 'Am meisten angesehen' },
  views: { en: 'views', ge: 'ნახვა', de: 'Aufrufe' },
  image: { en: 'Image URL', ge: 'სურათის URL', de: 'Bild-URL' },
  badges: { en: 'Badges', ge: 'ბეჯები', de: 'Abzeichen' },
  waiterCalled: { en: 'Waiter has been called!', ge: 'მიმტანი გამოძახებულია!', de: 'Kellner wurde gerufen!' },
  billRequested: { en: 'Bill has been requested!', ge: 'ანგარიში მოთხოვნილია!', de: 'Rechnung wurde angefordert!' },
  addCategory: { en: 'Add Category', ge: 'კატეგორიის დამატება', de: 'Kategorie hinzufügen' },
  categoryName: { en: 'Category Name', ge: 'კატეგორიის სახელი', de: 'Kategoriename' },
  stock: { en: 'In Stock', ge: 'მარაგშია', de: 'Auf Lager' },
  portionSizes: { en: 'Portion Sizes', ge: 'პორციის ზომები', de: 'Portionsgrößen' },
  allergens: { en: 'Allergens', ge: 'ალერგენები', de: 'Allergene' },
  noAllergens: { en: 'No common allergens', ge: 'არ შეიცავს ალერგენებს', de: 'Keine häufigen Allergene' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getTranslated: (item: { en: string; ge: string; de: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return uiTranslations[key]?.[language] || key;
  };

  const getTranslated = (item: any) => {
    // 1. თუ საერთოდ არ არსებობს ობიექტი
    if (!item) return "";
    
    // 2. თუ პირდაპირ სტრინგია (ზოგჯერ ბაზიდან ასე მოდის შეცდომით)
    if (typeof item === "string") return item;

    // 3. თუ ობიექტია, ვეძებთ მიმდინარე ენას, მერე ინგლისურს, მერე ნებისმიერ პირველს
    return (
      item[language] || 
      item["en"] || 
      item["ge"] || 
      Object.values(item)[0] || 
      ""
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTranslated }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};