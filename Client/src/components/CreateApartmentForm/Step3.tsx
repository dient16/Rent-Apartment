import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
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

const Step3: React.FC = () => {
   const {
      control,
      formState: { errors },
   } = useFormContext();

   return (
      <div className="p-6 bg-white">
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
                     onChange={(_time, timeString) =>
                        field.onChange(timeString)
                     }
                     needConfirm={false}
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
                     onChange={(_time, timeString) =>
                        field.onChange(timeString)
                     }
                     needConfirm={false}
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
      </div>
   );
};

export default Step3;
