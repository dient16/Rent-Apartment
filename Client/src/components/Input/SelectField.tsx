import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Select } from 'antd';
import clsx from 'clsx';

const { Option } = Select;

interface SelectFieldProps {
   name: string;
   rules?: object;
   label: string;
   className?: string;
   options: Array<{ value: string | number; label: string }>;
   onChangeSelected?: (value: number | string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
   name,
   rules,
   label,
   className,
   options,
   onChangeSelected,
}) => {
   const { control, clearErrors } = useFormContext();
   const isRequired = rules?.['required'];

   return (
      <Controller
         control={control}
         name={name}
         rules={rules}
         render={({ field, fieldState: { error } }) => (
            <div className={clsx('mb-4', className)}>
               <label
                  htmlFor={name}
                  className="block text-sm font-normal text-gray-700 mb-1"
               >
                  {label}
                  {isRequired && <span className="text-red-600"> *</span>}
               </label>
               <Select
                  {...field}
                  className="w-full"
                  onChange={(value) => {
                     field.onChange(value);
                     onChangeSelected && onChangeSelected(value);
                     clearErrors(name);
                  }}
                  showSearch={true}
                  optionFilterProp="label"
                  value={field.value || undefined}
                  size="large"
                  status={error && 'error'}
               >
                  {options.map((option) => (
                     <Option key={option.value} value={option.value}>
                        {option.label}
                     </Option>
                  ))}
               </Select>
               {error && (
                  <span className="text-red-600 text-sm">{error.message}</span>
               )}
            </div>
         )}
      />
   );
};

export default SelectField;
