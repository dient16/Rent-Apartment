import React, {
   createContext,
   Dispatch,
   FC,
   useLayoutEffect,
   useReducer,
   useRef,
   useState,
} from 'react';
import { AuthActionType } from './types';
import { initialize, reducer, signOut } from './reduces';
import { apiGetCurrentUser, api, apiLogout } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { message, Spin } from 'antd';

interface AuthProviderProps {
   children: React.ReactNode;
}

export interface PayloadAction<T> {
   type: AuthActionType;
   payload?: T;
   dispatch?: Dispatch<PayloadAction<AuthState>>;
}

export interface AuthContextType extends AuthState {
   dispatch: Dispatch<PayloadAction<AuthState>>;
   authModal: { isOpen: boolean; activeTab: string };
   setAuthModal: Dispatch<
      React.SetStateAction<{ isOpen: boolean; activeTab: string }>
   >;
}

const initialState: AuthState = {
   isAuthenticated: false,
   accessToken: null,
   user: null,
};

export const AuthContext = createContext<AuthContextType>({
   ...initialState,
   dispatch: () => null,
   authModal: { isOpen: false, activeTab: 'signin' },
   setAuthModal: () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
   const [state, dispatch] = useReducer(reducer, initialState);
   const [authModal, setAuthModal] = useState<{
      isOpen: boolean;
      activeTab: string;
   }>({
      isOpen: false,
      activeTab: 'signin',
   });

   const { data, isError, isLoading } = useQuery({
      queryKey: ['currentUser'],
      queryFn: apiGetCurrentUser,
      enabled: !!localStorage.getItem('ACCESS_TOKEN'),
   });
   const handleLogout = async () => {
      try {
         const logout = await apiLogout();
         if (logout.success) {
            dispatch(signOut());
         }
      } catch (error) {
         message.error('Error during logout');
      }
   };
   const isRefreshing = useRef(false);
   const refreshFailed = useRef(false);

   useLayoutEffect(() => {
      const refreshInterceptor = api.interceptors.response.use(
         (response) => response,
         async (error) => {
            const originalRequest = error.config;

            if (
               error.response.status === 401 &&
               !originalRequest._retry &&
               !isRefreshing.current &&
               !refreshFailed.current
            ) {
               originalRequest._retry = true;
               isRefreshing.current = true;

               try {
                  const response: Res = await api.post('/auth/refresh-token');

                  if (!response.success) {
                     isRefreshing.current = false;
                     return Promise.reject(new Error(response.message));
                  }

                  const newAccessToken = response.data.accessToken;
                  localStorage.setItem(
                     'ACCESS_TOKEN',
                     JSON.stringify(newAccessToken),
                  );
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  isRefreshing.current = true;
                  return api(originalRequest);
               } catch (refreshError) {
                  refreshFailed.current = true;
                  isRefreshing.current = false;
                  await handleLogout();
                  message.error('Session expired, please login again!');
                  return Promise.reject(refreshError);
               }
            }

            return Promise.reject(error);
         },
      );

      return () => {
         api.interceptors.response.eject(refreshInterceptor);
      };
   }, [dispatch]);

   useLayoutEffect(() => {
      if (!data && !data?.success && !isLoading) {
         dispatch(
            initialize({
               isAuthenticated: false,
               accessToken: null,
               user: null,
            }),
         );
      } else if (data && !isError && !!localStorage.getItem('ACCESS_TOKEN')) {
         const token = JSON.parse(
            localStorage.getItem('ACCESS_TOKEN') as string,
         );
         dispatch(
            initialize({
               isAuthenticated: true,
               accessToken: token,
               user: data?.data,
            }),
         );
      }
   }, [data, isError, isLoading, state.accessToken]);

   return (
      <AuthContext.Provider
         value={{ ...state, dispatch, authModal, setAuthModal }}
      >
         <Spin spinning={isLoading} fullscreen={isLoading} size="large">
            {children}
         </Spin>
      </AuthContext.Provider>
   );
};
