// src/components/CreateApartmentForm/RoomDetailsForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface RoomDetailsFormProps {
   index: number;
}

const RoomDetailsForm: React.FC<RoomDetailsFormProps> = ({ index }) => {
   const {
      register,
      formState: { errors },
   } = useFormContext();

   return (
      <div className="mb-6 border-b pb-4">
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Room Type
            </label>
            <input
               {...register(`rooms.${index}.roomType`, {
                  required: 'Room type is required',
               })}
               placeholder="Room Type"
               className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
            {errors.rooms?.[index]?.roomType && (
               <p className="text-red-500 mt-1">
                  {errors.rooms?.[index]?.roomType?.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Size
            </label>
            <input
               {...register(`rooms.${index}.size`, {
                  required: 'Size is required',
               })}
               placeholder="Size"
               type="number"
               className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
            {errors.rooms?.[index]?.size && (
               <p className="text-red-500 mt-1">
                  {errors.rooms?.[index]?.size?.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Price
            </label>
            <input
               {...register(`rooms.${index}.price`, {
                  required: 'Price is required',
               })}
               placeholder="Price"
               type="number"
               className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
            {errors.rooms?.[index]?.price && (
               <p className="text-red-500 mt-1">
                  {errors.rooms?.[index]?.price?.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Number of Guests
            </label>
            <input
               {...register(`rooms.${index}.numberOfGuest`, {
                  required: 'Number of guests is required',
               })}
               placeholder="Number of Guests"
               type="number"
               className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
            {errors.rooms?.[index]?.numberOfGuest && (
               <p className="text-red-500 mt-1">
                  {errors.rooms?.[index]?.numberOfGuest?.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Quantity
            </label>
            <input
               {...register(`rooms.${index}.quantity`, {
                  required: 'Quantity is required',
               })}
               placeholder="Quantity"
               type="number"
               className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
            {errors.rooms?.[index]?.quantity && (
               <p className="text-red-500 mt-1">
                  {errors.rooms?.[index]?.quantity?.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Amenities
            </label>
            <input
               {...register(`rooms.${index}.amenities`, {
                  required: 'Amenities are required',
               })}
               placeholder="Amenities (comma separated)"
               className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
            {errors.rooms?.[index]?.amenities && (
               <p className="text-red-500 mt-1">
                  {errors.rooms?.[index]?.amenities?.message}
               </p>
            )}
         </div>
      </div>
   );
};

export default RoomDetailsForm;
