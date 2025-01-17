import type { PayloadAction } from './AuthContext';
import { AuthActionType } from './types';

export interface ReducerHandler {
   INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState;
   SIGN_IN(state: AuthState, action: PayloadAction<AuthState>): AuthState;
   SIGN_OUT(state: AuthState): AuthState;
}

const reducerHandlers: ReducerHandler = {
   INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState {
      const { isAuthenticated, user, accessToken } = action.payload;
      if (accessToken) {
         localStorage.setItem('ACCESS_TOKEN', JSON.stringify(accessToken));
      }
      return {
         ...state,
         isAuthenticated,
         accessToken,
         user,
      };
   },
   SIGN_IN(state: AuthState, action: PayloadAction<AuthState>): AuthState {
      const { user, accessToken } = action.payload;
      if (accessToken) {
         localStorage.setItem('ACCESS_TOKEN', JSON.stringify(accessToken));
         return {
            ...state,
            isAuthenticated: true,
            accessToken,
            user,
         };
      }
      return {
         ...state,
         isAuthenticated: false,
         accessToken: null,
         user: null,
      };
   },
   SIGN_OUT(state: AuthState): AuthState {
      return {
         ...state,
         isAuthenticated: false,
         user: null,
         accessToken: null,
      };
   },
};

export function reducer(state: AuthState, action: PayloadAction<AuthState>) {
   if (!reducerHandlers[action.type]) return state;
   return reducerHandlers[action.type](state, action);
}

export function initialize(payload: AuthState): PayloadAction<AuthState> {
   return {
      type: AuthActionType.INITIALIZE,
      payload,
   };
}
export function signIn(payload: AuthState): PayloadAction<AuthState> {
   return {
      type: AuthActionType.SIGN_IN,
      payload,
   };
}
export function signOut(): PayloadAction<AuthState> {
   localStorage.removeItem('ACCESS_TOKEN');
   return {
      type: AuthActionType.SIGN_OUT,
      payload: { user: null, accessToken: null },
   };
}
