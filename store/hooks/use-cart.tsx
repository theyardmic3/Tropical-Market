import { create } from "zustand";
import { Product } from "@/types";
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from "react-hot-toast";

interface CartStore {
    items: Product[];
    addItem: (data: Product) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
}

const useCart = create(persist<CartStore>((set, get) =>({
    items: [],
    addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === data.id);

        if(existingItem) {
            return toast("Item Already Added To Cart!");
        }

        set({ items: [...get().items, data] })
        toast.success("Item Added to Cart Successfully!")
    },
    removeItem: (id: string) => {
        set({ items: [...get().items.filter(item => item.id !== id)] });
    },
    removeAll: () => set({ items: [] }),
}), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage)
}))

export default useCart;
