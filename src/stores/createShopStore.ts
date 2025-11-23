import type { BoundStateCreator } from "~/hooks/useBoundStore";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "module" | "book";
  category: string;
  image?: string;
}

export type ShopSlice = {
  purchasedItems: string[];
  purchaseItem: (itemId: string, price: number) => boolean;
  isPurchased: (itemId: string) => boolean;
  getPurchasedItems: () => string[];
};

export const createShopSlice: BoundStateCreator<ShopSlice> = (set, get) => ({
  purchasedItems: [],
  
  purchaseItem: (itemId: string, price: number) => {
    const { purchasedItems } = get();
    const { xpAllTime, increaseXp } = get();
    
    // Check if already purchased
    if (purchasedItems.includes(itemId)) {
      return false;
    }
    
    // Check if user has enough XP
    if (xpAllTime() < price) {
      return false;
    }
    
    // Deduct XP and add item to purchased list
    increaseXp(-price);
    set({ purchasedItems: [...purchasedItems, itemId] });
    return true;
  },
  
  isPurchased: (itemId: string) => {
    return get().purchasedItems.includes(itemId);
  },
  
  getPurchasedItems: () => {
    return get().purchasedItems;
  },
});
