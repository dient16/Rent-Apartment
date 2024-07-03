import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Checkbox, TimePicker } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const houseRulesOptions = [
   'No smoking',
   'No pets',
   'No parties',
   'No loud music',
   'No shoes inside',
];
const safetyInfoOptions = [
   'Smoke detector',
   'Fire extinguisher',
   'First aid kit',
   'Carbon monoxide detector',
   'Security cameras',
];
const cancellationPolicyOptions = [
   'Flexible',
   'Moderate',
   'Strict',
   'Super Strict',
];

const Step3: React.FC = () => {
   const {
      control,
      formState: { errors },
   } = useFormContext();

   return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
         <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
               House Rules
            </label>
            <Controller
               name="houseRules"
               control={control}
               render={({ field }) => (
                  <Checkbox.Group
                     options={houseRulesOptions}
                     {...field}
                     className="flex flex-wrap gap-4"
                  />
               )}
            />
            {errors.houseRules && (
               <span className="text-red-500">
                  Please select at least one house rule
               </span>
            )}
         </div>
         <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
               Check-In Time
            </label>
            <Controller
               name="checkInTime"
               control={control}
               render={({ field }) => (
                  <TimePicker
                     {...field}
                     format="HH:mm"
                     className="w-full p-2 border rounded"
                     value={field.value ? dayjs(field.value, 'HH:mm') : null}
                     onChange={(time, timeString) => field.onChange(timeString)}
                  />
               )}
            />
            {errors.checkInTime && (
               <span className="text-red-500">
                  Please select a check-in time
               </span>
            )}
         </div>
         <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
               Check-Out Time
            </label>
            <Controller
               name="checkOutTime"
               control={control}
               render={({ field }) => (
                  <TimePicker
                     {...field}
                     format="HH:mm"
                     className="w-full p-2 border rounded"
                     value={field.value ? dayjs(field.value, 'HH:mm') : null}
                     onChange={(time, timeString) => field.onChange(timeString)}
                  />
               )}
            />
            {errors.checkOutTime && (
               <span className="text-red-500">
                  Please select a check-out time
               </span>
            )}
         </div>
         <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
               Safety Information
            </label>
            <Controller
               name="safetyInfo"
               control={control}
               render={({ field }) => (
                  <Checkbox.Group
                     options={safetyInfoOptions}
                     {...field}
                     className="flex flex-wrap gap-4"
                  />
               )}
            />
            {errors.safetyInfo && (
               <span className="text-red-500">
                  Please select at least one safety information
               </span>
            )}
         </div>
         <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
               Cancellation Policy
            </label>
            <Controller
               name="cancellationPolicy"
               control={control}
               render={({ field }) => (
                  <Select {...field} className="w-full p-2 border rounded">
                     {cancellationPolicyOptions.map((option) => (
                        <Select.Option key={option} value={option}>
                           {option}
                        </Select.Option>
                     ))}
                  </Select>
               )}
            />
            {errors.cancellationPolicy && (
               <span className="text-red-500">
                  Please select a cancellation policy
               </span>
            )}
         </div>
         <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Discounts</label>
            <Controller
               name="discounts"
               control={control}
               render={({ field }) => (
                  <TextArea
                     {...field}
                     rows={4}
                     className="w-full p-2 border rounded"
                  />
               )}
            />
            {errors.discounts && (
               <span className="text-red-500">
                  Please enter discount details
               </span>
            )}
         </div>
      </div>
   );
};

export default Step3;
