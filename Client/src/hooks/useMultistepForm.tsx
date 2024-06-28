import { useState } from 'react';

interface StepData {
   [key: string]: any;
}

const useMultistepForm = (initialData: StepData = {}) => {
   const [step, setStep] = useState<number>(0);
   const [data, setData] = useState<StepData>(initialData);

   const nextStep = () => setStep((prev) => prev + 1);
   const prevStep = () => setStep((prev) => prev - 1);

   const saveStepData = (stepKey: string, stepData: any) => {
      const updatedData = { ...data, [stepKey]: stepData };
      setData(updatedData);
   };

   return {
      step,
      data,
      nextStep,
      prevStep,
      saveStepData,
   };
};

export default useMultistepForm;
