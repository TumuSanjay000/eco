import { axiosInstance } from './axiosInstance';

export const addProduct = async (payload) => {
  try {
    const response = await axiosInstance.post(
      '/api/products/add-product',
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetProducts = async (filters) => {
  try {
    const response = await axiosInstance.post('/api/products/get-products', filters);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const EditProduct = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/api/products/edit-product/${id}`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const DeleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/products/delete-product/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UploadProductImage = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/products/upload-image-to-product`, payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdateProductStatus = async (id, status) => {
  try {
      console.log('Sending request to update status:', id, status); // Debug log
      const response = await axiosInstance.put(`/api/products/update-product-status/${id}`, { status }); // Wrap here
      console.log('Response received:', response); // Debug log
      return response.data;
  } catch (error) {
      console.log('Error updating status:', error.message); // Debug log
      return { success: false, message: error.message };
  }
};

