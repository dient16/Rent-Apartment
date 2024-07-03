import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import InputField from '@/components/Input/InputField';
import RoomAmenitiesSelector from './RoomAmenitiesSelector';
import { apiGetServices } from '@/apis';

interface RoomDetailsFormProps {
   index: number;
}

const RoomDetailsForm: React.FC<RoomDetailsFormProps> = ({ index }) => {
   const { control } = useFormContext();

   const { data: { data: amenities } = {} } = useQuery({
      queryKey: ['services'],
      queryFn: apiGetServices,
   });

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
                     options={(amenities || []).map((item) => ({
                        label: item.name,
                        value: item._id,
                        imageSrc: item.icon,
                     }))}
                     selectedValues={field.value}
                     onChange={field.onChange}
                  />
               )}
            />
         </div>
      </div>
   );
};

export default RoomDetailsForm;
