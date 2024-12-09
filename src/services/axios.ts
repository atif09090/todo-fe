import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1'; 

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
   
    if (config.url && config.url.includes('todo')) {
      const token = localStorage.getItem('token'); 
      if (token) {
        config.headers['Authorization'] = `${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response; // Return the response if successful
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      // Redirect to the login page
      window.location.href = '/login';
    }
    return Promise.reject(error); // Forward other errors
  }
);
export default api;
