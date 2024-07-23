import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL;
const getAxiosConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${
      typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    }`,
  },
  withCredentials: true,
});

/**
 * Function to create a new product
 * @param productData - The data of the product to create
 * @returns The server response
 */
export const createProduct = async (productData: any) => {
  const URL = `${API_URL}/product/new`;
  console.log('Attempting to create product at:', URL);

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
export const updateProduct = async (productId: number, productData: any) => {
  const URL = `${API_URL}/product/update/${productId}`;
  console.log('Attempting to update product at:', URL);

  try {
    const response = await axios.patch(URL, productData, getAxiosConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error);
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
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Function to handle Axios errors
 * @param error - The error to handle
 */
const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  } else {
    console.error('Non-Axios error:', error);
  }
  throw error;
};