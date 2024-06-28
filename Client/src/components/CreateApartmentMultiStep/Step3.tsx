// src/components/FinalStep.tsx
import React from 'react';
import useMultistepForm from '@/hooks/useMultistepForm';
import { useFormContext } from '@/contexts/form/FormContext';

const FinalStep: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
   const { data } = useMultistepForm();
   const { state } = useFormContext();

   const handleSubmit = () => {
      console.log('Submitting data:', { ...state, ...data });
      onFinish();
   };

   return (
      <div>
         <h2>Final Step: Review and Submit</h2>
         <pre>{JSON.stringify(state, null, 2)}</pre>
         <button type="button" onClick={handleSubmit}>
            Submit
         </button>
      </div>
   );
};

export default FinalStep;
