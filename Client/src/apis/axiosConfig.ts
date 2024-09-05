import { message } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';

const instance = axios.create({
   baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
   withCredentials: true,
});
interface FailedRequest {
   resolve: (token: string) => void;
   reject: (error: AxiosError) => void;
}
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError, token: string | null = null) => {
   failedQueue.forEach((prom) => {
      if (error) {
         prom.reject(error);
      } else {
         prom.resolve(token);
      }
   });

   failedQueue = [];
};

instance.interceptors.request.use(
   (config) => {
      const localStorageData = localStorage.getItem('ACCESS_TOKEN');
      if (localStorageData && typeof localStorageData === 'string') {
         const token = JSON.parse(localStorageData);
         config.headers.authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   },
);

instance.interceptors.response.use(
   (response: AxiosResponse) => {
      return response?.data;
   },
   async (error) => {
      const originalRequest = error.config;
      const status = error?.response?.status;

      if (status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
            return new Promise(function (resolve, reject) {
               failedQueue.push({ resolve, reject });
            })
               .then((token) => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  return instance(originalRequest);
               })
               .catch((err) => {
                  return Promise.reject(err);
               });
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
            const refreshResponse = await instance.post('/auth/refresh-token');

            const newAccessToken = refreshResponse.data.accessToken;

            localStorage.setItem(
               'ACCESS_TOKEN',
               JSON.stringify(newAccessToken),
            );

            processQueue(null, newAccessToken);
            isRefreshing = false;

            originalRequest.headers[
               'Authorization'
            ] = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
         } catch (refreshError) {
            processQueue(refreshError, null);
            isRefreshing = false;
            message.error('Session expired. Please log in again.');
            return Promise.reject(refreshError);
         }
      }

      message.error(error?.response.data.message || 'Error from server');
      return error?.response?.data;
   },
);

export default instance;
