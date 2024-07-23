import { ReactNode } from "react";

export type UserType = {
  data: any;
  access_token(arg0: string, access_token: any): unknown;
  status: ReactNode;
  role: ReactNode;
  profileImagePath: string;
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  carts: CartType[];
  advices: AdviceType[];
};

export type CategoryType = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
};

export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  category: CategoryType;
  cartProducts: CartProductType[];
  advices: AdviceType[];
  inventory?: InventoryType;
};

export type InventoryType = {
  id: number;
  productId: number;
  quantity: number;
  lastUpdated: Date;
};

export type CartProductType = {
  id: number;
  quantity: number;
  cartId: number;
  productId: number;
  cart: CartType;
  product: ProductType;
};

export type CartType = {
  quantity: any;
  product: any;
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
  cartProducts: CartProductType[];
};

export type AdviceType = {
  id: number;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  productId: number;
  user: UserType;
  product: ProductType;
};

export type OrderType = {
  id: number;
  userId: number;
  products: ProductType[];
  total: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
};

type CartProductWithQuantity = {
  product: {
    id: number;
    name: string;
    price: number;
    imagePath: string;
  };
  quantity: number;
};
export type CartState = {
  products: CartProductWithQuantity[];
  favorites: ProductType[];
  user: UserType | null;
  orders: OrderType[];
};

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: ProductType }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: ProductType }
  | { type: 'SET_USER'; payload: UserType | null }
  | { type: 'ADD_ORDER'; payload: OrderType }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: number; status: string } };

  
export interface RegisterProps {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  gdprConsent: boolean;
}


export interface AuthProps {
  email: string;
  password: string;
}
export enum Roles {
  admin = 'ADMIN',
  user = 'USER',
  moderator = 'MODERATOR',
}

export enum Status {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  pending = 'PENDING',
}
export interface LoginResponse {
  access_token: string;

}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  gdprConsent: boolean;
}