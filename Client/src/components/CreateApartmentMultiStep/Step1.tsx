import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useMultistepForm from '@/hooks/useMultistepForm';
import { useFormContext } from '@/contexts/form/FormContext';

interface IFormInput {
   title: string;
   description: string;
   location: {
      long: number;
      lat: number;
      province: string;
      district: string;
      ward?: string;
      street: string;
   };
}

const Step1: React.FC<{ onNext: () => void }> = ({ onNext }) => {
   const { register, handleSubmit } = useForm<IFormInput>();
   const { saveStepData } = useMultistepForm();
   const { dispatch } = useFormContext();

   const onSubmit: SubmitHandler<IFormInput> = (data) => {
      saveStepData('step1', data);
      dispatch({ type: 'SAVE_STEP', step: 'step1', data });
      onNext();
   };

   return (
      <div>
         <h2>Step 1: Basic Information</h2>
         <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('title')} placeholder="Title" required />
            <textarea
               {...register('description')}
               placeholder="Description"
               required
            />
            <input
               {...register('location.long')}
               type="number"
               placeholder="Longitude"
               required
            />
            <input
               {...register('location.lat')}
               type="number"
               placeholder="Latitude"
               required
            />
            <input
               {...register('location.province')}
               placeholder="Province"
               required
            />
            <input
               {...register('location.district')}
               placeholder="District"
               required
            />
            <input {...register('location.ward')} placeholder="Ward" />
            <input
               {...register('location.street')}
               placeholder="Street"
               required
            />
            <button type="submit">Next</button>
         </form>
      </div>
   );
};

export default Step1;
