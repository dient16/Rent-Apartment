import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox, Flex, Slider } from 'antd';

const FilterSection: React.FC = () => {
   const { control, watch } = useFormContext();

   return (
      <div className="mt-3 w-full rounded-xl">
         <h2 className="m-2 text-lg">Filter by</h2>
         <div className="flex flex-col gap-3 justify-center p-3">
            <h2>Your budget (per night)</h2>
            <div className="">
               <div className="font-light">{`VND ${(
                  watch('searchPrice')?.[0] || 100000
               ).toLocaleString()} - VND ${(
                  watch('searchPrice')?.[1] || 5000000
               ).toLocaleString()}${
                  watch('searchPrice')?.[1] === 5000000 ? '+' : ''
               }`}</div>
               <Controller
                  name="searchPrice"
                  control={control}
                  render={({ field }) => (
                     <Slider
                        range={{ draggableTrack: true }}
                        min={100000}
                        max={5000000}
                        defaultValue={[100000, 5000000]}
                        {...field}
                     />
                  )}
               />
            </div>
         </div>
         <div className="flex flex-col gap-3 justify-center p-3">
            <h2>Star rating</h2>
            <Checkbox.Group>
               <Flex vertical justify="center" gap={3}>
                  {[5, 4, 3, 2, 1].map((value) => (
                     <Checkbox key={value} value={value}>
                        {value} star
                     </Checkbox>
                  ))}
               </Flex>
            </Checkbox.Group>
         </div>
         <div className="flex flex-col gap-3 justify-center p-3">
            <h2>Popular filters</h2>
            <Checkbox.Group>
               <Flex vertical justify="center" gap={3}>
                  {[
                     'Breakfast included',
                     'Hotels',
                     'Double bed',
                     'Hostels',
                     'Homestays',
                  ].map((value) => (
                     <Checkbox key={value} value={value}>
                        {value}
                     </Checkbox>
                  ))}
               </Flex>
            </Checkbox.Group>
         </div>
      </div>
   );
};

export default FilterSection;
