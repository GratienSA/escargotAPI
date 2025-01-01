import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL;

export const uploadPicture = async (file: File, type: 'product' | 'profile', id?: number): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (id) formData.append('id', id.toString());

  console.log('Uploading picture of type:', type);

  try {
    const response = await axios.post(`${API_URL}/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log('Upload response:', response.data);

    if (response.status === 201 && response.data.imagePath) {
      return response.data.imagePath;
    }
  } catch (error) {
    console.error(`Error uploading ${type} picture:`, error);
  }

  return null;
};

export const getPictureUrl = (imagePath: string): string => {
  return `${API_URL}/${imagePath}`;
};
