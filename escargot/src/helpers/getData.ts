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

export const getAllProducts = async (skip = 0) => {
  const URL = `${process.env.NEXT_PUBLIC_NEST_API_URL}/product/all?skip=${skip}&limit=12`;
  console.log('Attempting to fetch from:', URL); 

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    } else {
      console.error('Non-Axios error:', error);
    }
    throw error;
  }
};

export const getProductById = async (id: number) => {
  const URL = `${process.env.NEXT_PUBLIC_NEST_API_URL}/product/${id}`;
  console.log("Fetching product from:", URL);

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
    } else {
      console.error("Non-Axios error:", error);
    }
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: number) => {
  const URL = `${process.env.NEXT_PUBLIC_NEST_API_URL}/product/category/${categoryId}`;
  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const globalSearch = async (params: {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  priceRange?: string;
  rating?: number;
}) => {
  const URL = `${process.env.NEXT_PUBLIC_NEST_API_URL}/product/search`;

  try {
    const response = await axios.get(URL, {
      params: {
        ...params,
        page: params.page || 1,
        limit: params.limit || 12,
        rating: params.rating || 0,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
    } else {
      console.error("Non-Axios error:", error);
    }
    throw error;
  }
};

export async function getOrderHistory(): Promise<any> {
  const url = `${API_URL}/order`;
  
  try {
    const response = await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching order history:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch order history');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching order history');
    }
  }
}


export const getCategories = async () => {
  const URL = `${API_URL}/category/all`;
  console.log('Attempting to fetch categories from:', URL); 

  try {
    const response = await axios.get(URL, getAxiosConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    } else {
      console.error('Non-Axios error:', error);
    }
    throw error;
  }
};