import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';

const instance = axios.create({
   baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
   withCredentials: true,
});

instance.interceptors.request.use(
   function (config) {
      const localStorageData = localStorage.getItem('ACCESS_TOKEN');
      if (localStorageData && typeof localStorageData === 'string') {
         const token = JSON.parse(localStorageData);
         config.headers.authorization = `Bearer ${token}`;
      }
      return config;
   },
   function (error) {
      return Promise.reject(error);
   },
);

instance.interceptors.response.use(
   function (response: AxiosResponse) {
      return response?.data;
   },
   function (error) {
      if (error?.response?.status !== 401) {
         message.error(error?.response.data.message || 'Error from server');
      }
      return Promise.reject(error);
   },
);

export default instance;
