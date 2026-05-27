import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
}

const CART_KEY = "carrito";
const CART_EVENT = "carrito-actualizado";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Escucha cambios del carrito desde cualquier componente
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem(CART_KEY);
      setCartItems(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener(CART_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate); // otras pestañas
    return () => {
      window.removeEventListener(CART_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Guarda en localStorage y dispara el evento para notificar a todos
  const guardar = (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_EVENT)); 
  };

  const addItem = (item: CartItem) => {
    setCartItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      const next = [...prev, item];
      guardar(next);
      return next;
    });
  };

  const removeItem = (id: number) => {
    setCartItems(prev => {
      const next = prev.filter(i => i.id !== id);
      guardar(next);
      return next;
    });
  };

  const clearCart = () => {
    guardar([]);
    setCartItems([]);
  };

  return { cartItems, addItem, removeItem, clearCart };
}