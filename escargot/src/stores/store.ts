import { create } from 'zustand';
import { CartState, ProductType, UserType, OrderType } from '@/utils/types';

const initialState: CartState = {
  products: [],
  favorites: [],
  user: null,
  orders: [],
};

export const useStore = create<CartState & {
  addToCart: (product: ProductType) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => boolean;
  clearCart: () => void;
  toggleFavorite: (product: ProductType) => void;
  clearFavorites: () => void;
  setUser: (user: UserType | null) => void;
  addOrder: (order: OrderType) => void;
  updateOrderStatus: (orderId: number, status: string) => void;
}>((set, get) => ({
  ...initialState,

  addToCart: (product) => set((state) => {
    const existingProductIndex = state.products.findIndex(item => item.product.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedProducts = [...state.products];
      updatedProducts[existingProductIndex].quantity += 1;
      return { products: updatedProducts };
    }
    return { products: [...state.products, { product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    products: state.products.filter(item => item.product.id !== productId),
  })),

  updateQuantity: (productId, quantity) => {
    const state = get();
    const productIndex = state.products.findIndex(item => item.product.id === productId);
    if (productIndex !== -1 && quantity > 0) {
      set((state) => ({
        products: state.products.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      }));
      return true;
    }
    return false;
  },

  clearCart: () => set({ products: [] }),

  toggleFavorite: (product) => set((state) => {
    const isFavorite = state.favorites.some(item => item.id === product.id);
    return {
      favorites: isFavorite
        ? state.favorites.filter(item => item.id !== product.id)
        : [...state.favorites, product],
    };
  }),

  clearFavorites: () => set({ favorites: [] }),

  setUser: (user) => set({ user }),

  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order],
  })),

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ),
  })),
}));


type SearchResult = {
  products: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
};

type SearchStore = {
  searchResults: SearchResult | null;
  setSearchResults: (results: SearchResult | null) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
}));