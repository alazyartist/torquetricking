import create from "zustand";
import { SyncVariant } from "../../types/SyncVariant";
import { Recipient } from "./ShopDisplay";
interface Store {
  cart: SyncVariant[] | Array<any>;
  address: Recipient;
  addToCart: (value: SyncVariant) => void;
  removeFromCart: (value: number) => void;
  setAddress: (value: Recipient) => void;
}

export const useCart = create<Store>((set, get) => ({
  cart: [],
  addToCart: (value: SyncVariant) =>
    set((state) => ({ cart: [...state.cart, value] })),
  removeFromCart: (value: number) =>
    set((state) => ({
      cart: [...state.cart].filter((item, i) => i !== value),
    })),
  address: {
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
