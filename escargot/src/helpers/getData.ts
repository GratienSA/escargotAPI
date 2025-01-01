import { CreateOrderDto, OrderType, ProductType } from "@/utils/types";
import axios, { AxiosResponse } from "axios";

// Variables d'environnement pour les clés Stripe
const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL;

// Config Axios pour les requêtes
const getAxiosConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      typeof window !== "undefined" ? localStorage.getItem("token") : ""
    }`,
  },
  withCredentials: true,
});

// Gestion des erreurs d'Axios
const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);

    throw new Error(
      error.response?.data?.message || "An error occurred while processing your request"
    );
  } else if (error instanceof Error) {
    console.error("Error message:", error.message);
    throw new Error("An unexpected error occurred: " + error.message);
  } else {
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};

// Fonction pour rediriger vers Stripe Checkout
const redirectToStripe = (sessionId: string) => {
  window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
};

// Fonction pour créer une commande avec Stripe Session ID
export const createOrder = async (
  orderData: CreateOrderDto
): Promise<OrderType> => {
  // Conversion des prix dans `orderData`
  orderData.itemsPrice = Number(orderData.itemsPrice);
  orderData.shippingPrice = Number(orderData.shippingPrice);
  orderData.taxPrice = Number(orderData.taxPrice);
  orderData.totalAmount = Number(orderData.totalAmount);

  // Conversion des prix dans `orderItems`
  orderData.orderItems = orderData.orderItems.map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  try {
    // Appel à l'API /api/checkout pour créer une session Stripe
    const response = await axios.post("/api/checkout", {
      items: orderData.orderItems,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cart`,
    });

    console.log("Réponse de la création de session Stripe:", response.data);

    const sessionId = response.data;
    if (!sessionId) {
      throw new Error("Session Stripe ID non disponible");
    }

    // Ajout de la session Stripe dans le paiement de la commande
    orderData.payment = {
      sessionId,
      status: "PENDING", // Statut initial du paiement
      paymentMethod: "stripe",
      amount: orderData.totalAmount,
    };

    // Envoi des données de commande à l'API backend pour enregistrer la commande
    const URL = `${API_URL}/order`; // URL de l'API backend
    console.log("Envoi des données de commande au backend:", orderData);

    const orderResponse = await axios.post(URL, orderData, getAxiosConfig());
    console.log("Commande créée avec succès:", orderResponse.data);

    // Redirection vers Stripe Checkout
    redirectToStripe(sessionId);

    // Retourner la commande créée
    return orderResponse.data as OrderType;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};




type GetAllProductsParams = {
  skip?: number;
  limit?: number;
  query?: string; 
  category?: string; 
};

type GetAllProductsResponse = {
  data: ProductType[];
  totalPages: number;
};

export const getAllProducts = async (
  params: GetAllProductsParams = { skip: 0, limit: 12 }
): Promise<GetAllProductsResponse> => {
  const { skip = 0, limit = 12, query = '', category = '' } = params;

  const URL = `${API_URL}/product/all?skip=${skip}&limit=${limit}&query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;

  console.log("Attempting to fetch from:", URL);

  try {
    const response: AxiosResponse<GetAllProductsResponse> = await axios.get(URL);
    return response.data; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

// Fonction pour récupérer un produit par ID
export const getProductById = async (id: number) => {
  const URL = `${API_URL}/product/${id}`;
  console.log("Fetching product from:", URL);

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour récupérer les produits par catégorie
export const getProductsByCategory = async (categoryId: number) => {
  const URL = `${API_URL}/product/category/${categoryId}`;

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction de recherche globale de produits
export const globalSearch = async (params: {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  priceRange?: string;
  rating?: number;
}) => {
  const URL = `${API_URL}/product/search`;

  try {
    const response = await axios.get(URL, { params });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour récupérer l'historique des commandes
export async function getOrderHistory(): Promise<any> {
  const url = `${API_URL}/order/all`;

  try {
    const response = await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

interface CategoryDto {
  name: string;
  description ?: string;
}

// Fonction pour récupérer toutes les catégories
export const getCategories = async () => {
  const URL = `${API_URL}/category/all`;

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data; 
  } catch (error) {
    handleAxiosError(error);
    return []; 
  }
};


// Fonction pour créer une nouvelle catégorie
export const createCategory = async (dto: CategoryDto) => {
  const URL = `${API_URL}/category/new`;

  try {
    const response = await axios.post(URL, dto, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Fonction pour mettre à jour une catégorie
export const updateCategory = async (id: number, dto: CategoryDto) => {
  const URL = `${API_URL}/category/update/${id}`;

  try {
    const response = await axios.patch(URL, dto, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getCategoryById = async (id: number) =>
{
  const URL = `${API_URL}/category/${id}`;
  try{
    const response = await axios.get(URL,getAxiosConfig());
    return response.data
  }catch (error) {
    handleAxiosError(error);
    throw error;
  }
}

// Fonction pour supprimer une catégorie
export const deleteCategory = async (id: number) => {
  const URL = `${API_URL}/category/delete/${id}`;

  try {
    const response = await axios.delete(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Fonction pour récupérer une commande par ID
export const getOrderById = async (id: number) => {
  const URL = `${API_URL}/order/${id}`;
  console.log("Fetching order from:", URL);

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour livrer une commande
export const deliverOrder = async (id: number) => {
  const URL = `${API_URL}/order/${id}/deliver`;

  try {
    const response = await axios.post(URL, {}, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour mettre à jour le statut d'une commande à "payé par COD"
export const updateOrderToPaidByCOD = async (id: number) => {
  const URL = `${API_URL}/order/${id}/cod`;

  try {
    const response = await axios.post(URL, {}, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour récupérer tous les avis
export const getAllAdvices = async (params?: any) => {
  const URL = `${API_URL}/advice/all`;

  try {
    const response = await axios.get(URL, { params, ...getAxiosConfig() });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour créer un nouvel avis
export const createAdvice = async (dto: any): Promise<any> => {
  const URL = `${API_URL}/advice/new`;

  try {
    const response = await axios.post(URL, dto, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour mettre à jour un avis
export const updateAdvice = async (id: number, dto: any): Promise<any> => {
  const URL = `${API_URL}/advice/update/${id}`;

  try {
    const response = await axios.patch(URL, dto, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour supprimer un avis
export const deleteAdvice = async (id: number): Promise<void> => {
  const URL = `${API_URL}/advice/delete/${id}`;

  try {
    await axios.delete(URL, getAxiosConfig());
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour récupérer les avis par produit
export const getAdvicesByProduct = async (productId: number) => {
  const URL = `${API_URL}/advice/product/${productId}`;

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Fonction pour récupérer les commandes d'un utilisateur
export const getMyOrders = async (
) => {
  const URL = `${API_URL}/order/my-orders`;

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export async function getAllOrders(
  limit: number = 10,
  page: number = 1
): Promise<{ data: OrderType[]; totalPages: number }> {
  const url = `${API_URL}/order/all?limit=${limit}&page=${page}`;

  try {
    const response: AxiosResponse<{ data: OrderType[]; totalPages: number }> =
      await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return { data: [], totalPages: 0 };
  }
}

export const deleteOrder = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  const url = `${API_URL}/order/${id}`;

  try {
    await axios.delete(url, getAxiosConfig());
    return { success: true, message: `Order ${id} deleted successfully.` };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur lors de la suppression de la commande:",
        error.response?.data
      );
      return { success: false, message: error.response?.data?.message || 'Error deleting order' };
    } else {
      console.error("Erreur inattendue:", error);
      return { success: false, message: 'Unexpected error' };
    }
  }
};

export const getOrderSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/order/summary`, getAxiosConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du résumé des commandes:", error);
    throw new Error("Erreur lors de la récupération du résumé des commandes");
  }
};


