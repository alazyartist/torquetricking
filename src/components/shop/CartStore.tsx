import create from "zustand";
import { SyncVariant } from "../../types/SyncVariant";
import { Recipient } from "./ShopDisplay";
interface Store {
  cart: SyncVariant[] | Array<any>;
  address: Recipient;
  addToCart: (value: SyncVariant) => void;
  removeFromCart: (value: number) => void;
  setAddress: (value: Recipient) => void;
  guestUser: { id: string; name: string; email: string } | any;
  setGuestUser: (
    value: { id: string; name: string; email: string } | any
  ) => void;
  clearCart: () => void;
}

export const useCart = create<Store>((set, get) => ({
  guestUser: { id: "", email: "", name: "" },
  setGuestUser: (value) => set(() => ({ guestUser: value })),
  cart: [],
  clearCart: () => set(() => ({ cart: [] })),
  addToCart: (value: SyncVariant) =>
    set((state) => ({ cart: [...state.cart, value] })),
  removeFromCart: (value: number) =>
    set((state) => ({
      cart: [...state.cart].filter((item, i) => i !== value),
    })),
  address: {
    id: "",
    address1: "",
    name: "",
    address2: "",
    city: "",
    country_code: "",
    country_name: "",
    state_code: "",
    state_name: "",
    email: "",
    zip: "",
  },
  setAddress: (value: Recipient) => set(() => ({ address: value })),
}));
