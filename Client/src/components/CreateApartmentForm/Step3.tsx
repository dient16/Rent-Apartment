// src/components/CreateApartmentForm/Step3.tsx
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input, Button } from 'antd';

const Step3: React.FC = () => {
   const {
      register,
      control,
      formState: { errors },
   } = useFormContext();
   const {
      fields: houseRulesFields,
      append: appendHouseRule,
      remove: removeHouseRule,
   } = useFieldArray({
      control,
      name: 'houseRules',
   });
   const {
      fields: safetyInfoFields,
      append: appendSafetyInfo,
      remove: removeSafetyInfo,
   } = useFieldArray({
      control,
      name: 'safetyInfo',
   });
   const {
      fields: discountsFields,
      append: appendDiscount,
      remove: removeDiscount,
   } = useFieldArray({
      control,
      name: 'discounts',
   });

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-3xl font-bold mb-6">
            Additional Details - Step 3
         </h2>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               House Rules
            </label>
            {houseRulesFields.map((item, index) => (
               <div key={item.id} className="mb-4 flex items-center">
                  <Input
                     {...register(`houseRules.${index}`, {
                        required: 'House rule is required',
                     })}
                     placeholder="House Rule"
                     className="mr-2"
                  />
                  <Button type="danger" onClick={() => removeHouseRule(index)}>
                     Remove
                  </Button>
               </div>
            ))}
            <Button type="primary" onClick={() => appendHouseRule({})}>
               Add House Rule
            </Button>
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Check-In Time
            </label>
            <Input
               {...register('checkInTime', {
                  required: 'Check-In Time is required',
               })}
               placeholder="Check-In Time"
               className="mt-2"
            />
            {errors.checkInTime && (
               <p className="text-red-500 mt-1">{errors.checkInTime.message}</p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Check-Out Time
            </label>
            <Input
               {...register('checkOutTime', {
                  required: 'Check-Out Time is required',
               })}
               placeholder="Check-Out Time"
               className="mt-2"
            />
            {errors.checkOutTime && (
               <p className="text-red-500 mt-1">
                  {errors.checkOutTime.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Safety Information
            </label>
            {safetyInfoFields.map((item, index) => (
               <div key={item.id} className="mb-4 flex items-center">
                  <Input
                     {...register(`safetyInfo.${index}`, {
                        required: 'Safety information is required',
                     })}
                     placeholder="Safety Information"
                     className="mr-2"
                  />
                  <Button type="danger" onClick={() => removeSafetyInfo(index)}>
                     Remove
                  </Button>
               </div>
            ))}
            <Button type="primary" onClick={() => appendSafetyInfo({})}>
               Add Safety Information
            </Button>
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Cancellation Policy
            </label>
            <Input
               {...register('cancellationPolicy', {
                  required: 'Cancellation Policy is required',
               })}
               placeholder="Cancellation Policy"
               className="mt-2"
            />
            {errors.cancellationPolicy && (
               <p className="text-red-500 mt-1">
                  {errors.cancellationPolicy.message}
               </p>
            )}
         </div>
         <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
               Discounts
            </label>
            {discountsFields.map((item, index) => (
               <div key={item.id} className="mb-4 flex items-center">
                  <Input
                     {...register(`discounts.${index}`, {
                        required: 'Discount is required',
                     })}
                     placeholder="Discount"
                     className="mr-2"
                  />
                  <Button type="danger" onClick={() => removeDiscount(index)}>
                     Remove
                  </Button>
               </div>
            ))}
            <Button type="primary" onClick={() => appendDiscount({})}>
               Add Discount
            </Button>
         </div>
      </div>
   );
};

export default Step3;
