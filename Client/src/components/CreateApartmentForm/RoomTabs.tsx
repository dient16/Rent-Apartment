// src/components/CreateApartmentForm/RoomImagesForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface RoomImagesFormProps {
   index: number;
}

const RoomImagesForm: React.FC<RoomImagesFormProps> = ({ index }) => {
   const {
      register,
      formState: { errors },
   } = useFormContext();

   return (
      <div className="mb-6">
         <label className="block text-lg font-medium text-gray-700">
            Images
         </label>
         <input
            {...register(`rooms.${index}.images`, {
               required: 'At least one image is required',
            })}
            type="file"
            multiple
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
         />
         {errors.rooms?.[index]?.images && (
            <p className="text-red-500 mt-1">
               {errors.rooms?.[index]?.images?.message}
            </p>
         )}
      </div>
   );
};

export default RoomImagesForm;
