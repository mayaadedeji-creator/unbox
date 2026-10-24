import { createContext, useContext, useState } from 'react';

const PackageContext = createContext();

export function PackageProvider({ children }) {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [items, setItems] = useState([]);

  // Adds the item, or replaces it if it's already in the box (e.g. after editing).
  // item looks like { id, name, image, data } — data is whatever that feature's editor saves.
  const saveItem = (item) => {
    setItems((prev) => {
      const alreadyIn = prev.some((i) => i.id === item.id);
      if (alreadyIn) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      return [...prev, item];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Start a brand-new gift.
  const reset = () => {
    setTo('');
    setFrom('');
    setItems([]);
  };

  const value = { to, setTo, from, setFrom, items, saveItem, removeItem, reset };

  return (
    <PackageContext.Provider value={value}>
      {children}
    </PackageContext.Provider>
  );
}

export function usePackage() {
  return useContext(PackageContext);
}
