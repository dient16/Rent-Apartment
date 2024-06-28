import React, {
   createContext,
   useContext,
   useReducer,
   ReactNode,
   Dispatch,
} from 'react';

interface FormState {
   [key: string]: any;
}

interface FormAction {
   type: 'SAVE_STEP' | 'RESET';
   step?: string;
   data?: any;
}

const FormContext = createContext<{
   state: FormState;
   dispatch: Dispatch<FormAction>;
} | null>(null);

const initialState: FormState = {};

const formReducer = (state: FormState, action: FormAction): FormState => {
   switch (action.type) {
      case 'SAVE_STEP':
         return { ...state, [action.step as string]: action.data };
      case 'RESET':
         return initialState;
      default:
         return state;
   }
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
   const [state, dispatch] = useReducer(formReducer, initialState);

   return (
      <FormContext.Provider value={{ state, dispatch }}>
         {children}
      </FormContext.Provider>
   );
};

export const useFormContext = () => {
   const context = useContext(FormContext);
   if (!context) {
      throw new Error('useFormContext must be used within a FormProvider');
   }
   return context;
};
