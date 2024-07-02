import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import InputField from '@/components/Input/InputField';
import RoomAmenitiesSelector from './RoomAmenitiesSelector';

interface RoomDetailsFormProps {
   index: number;
}

const amenities = [
   {
      label: 'Wi-Fi',
      value: 'wifi',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'TV',
      value: 'tv',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'Kitchen',
      value: 'kitchen',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'Washer',
      value: 'washer',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'Free Parking on Premises',
      value: 'free_parking',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'Paid Parking on Premises',
      value: 'paid_parking',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'Air Conditioning',
      value: 'air_conditioning',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
   {
      label: 'Dedicated Workspace',
      value: 'workspace',
      imageSrc: 'https://cdn-icons-png.flaticon.com/128/2901/2901643.png',
   },
];

const RoomDetailsForm: React.FC<RoomDetailsFormProps> = ({ index }) => {
   const { control } = useFormContext();
   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

   return (
      <div className="mb-6 border-b pb-4">
         <div className="mb-6">
            <InputField
               name={`rooms.${index}.roomType`}
               label="Room Type"
               rules={{ required: 'Room type is required' }}
            />
         </div>
         <div className="grid grid-cols-2 gap-4 mb-6">
            <InputField
               name={`rooms.${index}.size`}
               label="Size"
               type="number"
               rules={{ required: 'Size is required' }}
            />
            <InputField
               name={`rooms.${index}.price`}
               label="Price"
               type="number"
               rules={{ required: 'Price is required' }}
            />
            <InputField
               name={`rooms.${index}.numberOfGuest`}
               label="Number of Guests"
               type="number"
               rules={{ required: 'Number of guests is required' }}
            />
            <InputField
               name={`rooms.${index}.quantity`}
               label="Quantity"
               type="number"
               rules={{ required: 'Quantity is required' }}
            />
         </div>
         <div>
            <Controller
               name={`rooms.${index}.amenities`}
               control={control}
               defaultValue={[]}
               render={({ field }) => (
                  <RoomAmenitiesSelector
                     options={amenities}
                     selectedValues={field.value}
                     onChange={(selected) => {
                        field.onChange(selected);
                        setSelectedAmenities(selected);
                     }}
                  />
               )}
            />
         </div>
      </div>
   );
};

export default RoomDetailsForm;
