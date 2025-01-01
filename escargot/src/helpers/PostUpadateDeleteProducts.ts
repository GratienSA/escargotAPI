import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL;

interface AxiosConfig {
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
  withCredentials: boolean;
}

const getAxiosConfig = (): AxiosConfig => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${
      typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    }`,
  },
  withCredentials: true,
});

interface ProductData {
  // Define your product data structure here
  name: string;
  price: number;
  // Add other relevant fields
}

interface InventoryData {
  // Define your inventory data structure here
  productId: number;
  quantity: number;
  // Add other relevant fields
}

/**
 * Function to create a new product
 * @param productData - The data of the product to create
 * @returns The server response
 */
export const createProduct = async (productData: ProductData) => {
  const URL = `${API_URL}/product/new`;
  
  try {
    const response = await axios.post(URL, productData, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error; 
  }
};

/**
 * Function to update an existing product
 * @param productId - The ID of the product to update
 * @param productData - The new data of the product
 * @returns The server response
 */
export const updateProduct = async (productId: number, productData: Partial<ProductData>) => {
  const URL = `${API_URL}/product/update/${productId}`;
  console.log('Attempting to update product at:', URL);

  try {
    const response = await axios.patch(URL, productData, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error; 
  }
};

/**
 * Function to delete a product
 * @param productId - The ID of the product to delete
 * @returns The server response
 */
export const deleteProduct = async (productId: number) => {
  const URL = `${API_URL}/product/delete/${productId}`;
  console.log('Attempting to delete product at:', URL);

  try {
    const response = await axios.delete(URL, getAxiosConfig());
    return response.data  
  } catch (error) {
    handleAxiosError(error);
    throw error; 
  }
};

/**
 * Function to create a new inventory item
 * @param data - The inventory data to create
 * @returns The server response
 */
export const createInventory = async (data: InventoryData) => {
  try {
    const response = await axios.post(`${API_URL}/inventory`, data, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Function to get all inventory items
 * @returns The server response with all inventory items
 */
export const getAllInventory = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory`, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Function to get a single inventory item by ID
 * @param id - The ID of the inventory item to fetch
 * @returns The server response with the inventory item
 */
export const getInventoryById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/inventory/${id}`, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Function to update an inventory item
 * @param id - The ID of the inventory item to update
 * @param data - The new data for the inventory item
 * @returns The server response
 */
export const updateInventory = async (id: number, data: Partial<InventoryData>) => {
  try {
    const response = await axios.patch(`${API_URL}/inventory/${id}`, data, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Function to delete an inventory item
 * @param id - The ID of the inventory item to delete
 * @returns The server response
 */
export const deleteInventory = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/inventory/${id}`, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Function to handle Axios errors
 * @param error - The error to handle
 */
const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error('Axios error:', axiosError.message);
    console.error('Status:', axiosError.response?.status);
    console.error('Data:', axiosError.response?.data);
  } else {
    console.error('Non-Axios error:', error);
  }
};
