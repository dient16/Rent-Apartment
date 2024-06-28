// src/components/Step2.tsx
import React from 'react';
import {
   useForm,
   SubmitHandler,
   useFieldArray,
   Control,
} from 'react-hook-form';
import useMultistepForm from '@/hooks/useMultistepForm';
import { useFormContext } from '@/contexts/form/FormContext';

interface IRoomInput {
   roomType: string;
   amenities: string[];
   size: number;
   price: number;
   images: string[];
   numberOfGuest: number;
   quantity: number;
}

interface IFormInput {
   rooms: IRoomInput[];
}

const Step2: React.FC<{ onNext: () => void; onBack: () => void }> = ({
   onNext,
   onBack,
}) => {
   const { register, control, handleSubmit } = useForm<IFormInput>();
   const { fields, append, remove } = useFieldArray({ control, name: 'rooms' });
   const { saveStepData } = useMultistepForm();
   const { dispatch } = useFormContext();

   const onSubmit: SubmitHandler<IFormInput> = (data) => {
      saveStepData('step2', data);
      dispatch({ type: 'SAVE_STEP', step: 'step2', data });
      onNext();
   };

   return (
      <div>
         <h2>Step 2: Rooms Information</h2>
         <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
               <div key={field.id}>
                  <input
                     {...register(`rooms.${index}.roomType`)}
                     placeholder="Room Type"
                     required
                  />
                  <input
                     {...register(`rooms.${index}.size`)}
                     type="number"
                     placeholder="Size"
                     required
                  />
                  <input
                     {...register(`rooms.${index}.price`)}
                     type="number"
                     placeholder="Price"
                     required
                  />
                  <input
                     {...register(`rooms.${index}.numberOfGuest`)}
                     type="number"
                     placeholder="Number of Guests"
                     required
                  />
                  <input
                     {...register(`rooms.${index}.quantity`)}
                     type="number"
                     placeholder="Quantity"
                     required
                  />
                  <button type="button" onClick={() => remove(index)}>
                     Remove Room
                  </button>
               </div>
            ))}
            <button
               type="button"
               onClick={() =>
                  append({
                     roomType: '',
                     amenities: [],
                     size: 0,
                     price: 0,
                     images: [],
                     numberOfGuest: 0,
                     quantity: 0,
                  })
               }
            >
               Add Room
            </button>
            <button type="button" onClick={onBack}>
               Back
            </button>
            <button type="submit">Next</button>
         </form>
      </div>
   );
};

export default Step2;
