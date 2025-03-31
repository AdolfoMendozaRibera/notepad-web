import axios from 'axios';

//const API_BASE_URL = 'http://localhost:3000/tasks'; // Asegúrate que coincide con tu puerto de NestJS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('API Error:', errorMessage);
      return Promise.reject(error);
    }
  );