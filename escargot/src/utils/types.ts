import { ReactNode } from "react";
import * as qs from 'qs';


export type UserType = {
  success: any;
  message: any;
  paymentMethod: string | null;
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
  orders: OrderType[];
  accounts: AccountType[];
};

export type AccountType = {
  id: number;
  userId: number;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string; 
  access_token?: string; 
  expires_at?: number; 
  token_type?: string; 
  scope?: string; 
  id_token?: string; 
  session_state?: string; 
};

export type RoleType = {
  id: number;
  name: string;
  description?: string | null;
};

export type CategoryType = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
};

export type CategoryDto = {
  name: string;
  description?: string | null;
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

export interface GetAllProductsResponse {
  data: ProductType[];
  totalPages: number;
};

export type OrderItemType = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: ProductType;
};

export type CartProductWithQuantity = {
  product: ProductType;
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

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Utilisation du format 24 heures
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Utilisation du format 24 heures
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'fr-FR',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'fr-FR',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'fr-FR',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
  currency: 'EUR',
  style: 'currency',
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'N/A';
  }
}

export const formatError = (error: any): string => {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return `${error.errors[field].path}: ${errorMessage}`;
    });
    return fieldErrors.join('. ');
  } else if (error.name === 'ValidationError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return errorMessage;
    });
    return fieldErrors.join('. ');
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
};

const NUMBER_FORMATTER = new Intl.NumberFormat('fr-FR');
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split(','); 
  return decimal ? `${int},${decimal.padEnd(2, '0')}` : int; 
};

export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value.replace(',', '.')) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('La valeur n\'est ni un nombre ni une chaîne de caractères');
  }
};


export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string | null
}) {
  const currentUrl = qs.parse(params) as qs.ParsedQs;

  if (value !== null) {
    currentUrl[key] = value;
  } else {
    delete currentUrl[key];
  }

  return qs.stringify(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNulls: true }
  )
}

export type UpdateUserFormProps = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: ReactNode;
  address?: string; 
  city?: string; 
  postalCode?: string; 
  country?: string; 
  phone?: string; 
}



export interface CreateOrderDto {
  successUrl: string;
  cancelUrl: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalAmount: number;
  userId: number | null;
  shippingStreet: string;
  shippingCity: string;
  shippingZip: string;
  paymentMethod: string;
  orderItems: {
    name: string;
    productId: number;
    quantity: number;
    price: number;
  }[];
  
  // Ajouter la propriété 'payment' à l'interface
  payment?: {
    sessionId: string;
    status: string;
    paymentMethod: string;
    amount: number;
  };
}

export interface OrderType {
  payment: any;
  id: number;
  userId: number;
  shippingStreet: string;
  shippingCity: string;
  shippingZip: string;
  paymentMethod: string;  
  itemsPrice: number; // Remplace Decimal par number
  taxPrice: number;  // Remplace Decimal par number
  shippingPrice: number; // Remplace Decimal par number
  totalAmount: number; // Remplace Decimal par number
  status: string;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean | null;
  deliveredAt: Date | null;
  createdAt: Date;        
  updatedAt: Date;       
  orderItems: {
    productId: number;
    quantity: number;
    price: number; 
    name: string;
  }[];
  sessionId?: string;
  paymentResult?: any;  
}


export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  inventory: {
    quantity: number;
  } | null;
  rating: number | null;
  averageRating?: number | null;
};


export interface SummaryType {
  ordersPrice: number;
  ordersCount: number;
  usersCount: number;
  productsCount: number;
  salesData: any;
  latestOrders: OrderType[]; 
}
