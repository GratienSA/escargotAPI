import axios, { AxiosResponse } from 'axios';
import { AuthProps, LoginResponse, RegisterProps, UserType } from '@/utils/types';
import { paymentMethodSchema } from '@/validations/authSchemas';
const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL;

const getAxiosConfig = (includeToken = false) => {
  const config: any = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };

  if (includeToken) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
};

export async function registerToApi(registerProps: RegisterProps): Promise<LoginResponse> {
  const url = `${API_URL}/auth/signup`;

  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(url, {
      firstName: registerProps.firstName.trim(),
      lastName: registerProps.lastName.trim(),
      address: registerProps.address,
      city: registerProps.city,
      postalCode: registerProps.postalCode,
      country: registerProps.country,
      phone: registerProps.phone,
      email: registerProps.email,
      password: registerProps.password,
    }, getAxiosConfig(false));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred during registration');
    }
  }
}


export async function login(authProps: AuthProps): Promise<LoginResponse> {
  const url = `${API_URL}/auth/signin`;

  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(url, authProps, getAxiosConfig(false));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Login failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred during login');
    }
  }
}

export async function getUserProfile(): Promise<UserType> {
  const url = `${API_URL}/user/profile`;
  
  try {
    const response: AxiosResponse<UserType> = await axios.get(url, getAxiosConfig(true));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching user profile:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching user profile');
    }
  }
}

export async function updateUserProfile(updateData: Partial<UserType>): Promise<UserType> {
  const url = `${API_URL}/user/profile`;
  
  try {
    const response: AxiosResponse<UserType> = await axios.patch(url, updateData, getAxiosConfig(true));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating user profile:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update user profile');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while updating user profile');
    }
  }
}

export async function deleteUser(id: number): Promise<{ success: boolean; message: number }> {
  const url = `${API_URL}/user/delete/${id}`;
  try {
    await axios.delete(url, getAxiosConfig());
    return { success: true, message: id }; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting user:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while deleting user');
    }
  }
}

export async function getAllUsers({ page = 1 }: { page?: number }): Promise<{ data: UserType[]; totalPages: number }> {
  const url = `${API_URL}/user/all?page=${page}`; 
  
  try {
    const response: AxiosResponse<{ data: UserType[]; totalPages: number }> = await axios.get(url, getAxiosConfig(true));
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching all users:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch all users');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching all users');
    }
  }
}

export async function getUserById(userId: number): Promise<UserType> {
  const url = `${API_URL}/user/${userId}`;

  try {
    const response: AxiosResponse<UserType> = await axios.get(url, getAxiosConfig(true));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching user');
    }
  }
}


interface UpdatePaymentMethodResponse {
  success: boolean;
  message: string;
}

export async function updateUserPaymentMethod(userId: number, data: { type: string }): Promise<UpdatePaymentMethodResponse> {
  const url = `${API_URL}/user/${userId}/payment-method`;

  try {
    await paymentMethodSchema.validate(data);

    const response: AxiosResponse<UpdatePaymentMethodResponse> = await axios.put(
      url, 
      { paymentMethod: data.type },
      getAxiosConfig(true)
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Échec de la mise à jour de la méthode de paiement'
      };
    } else {
      console.error('Unexpected error:', error);
      return {
        success: false,
        message: 'Une erreur inattendue s\'est produite lors de la mise à jour de la méthode de paiement'
      };
    }
  }
}