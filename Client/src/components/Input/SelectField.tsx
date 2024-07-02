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
   const { control } = useFormContext();

   return (
      <Controller
         control={control}
         name={name}
         rules={rules}
         render={({ field, fieldState: { error } }) => (
            <div>
               <div
                  className={clsx(
                     'relative border border-gray-400 rounded-md transition-all px-2 select-none',
                     {
                        'border-green-700': field.value || field.value === 0,
                     },
                  )}
               >
                  <Select
                     {...field}
                     className={clsx(
                        'font-main text-lg h-16 w-full z-10',
                        className,
                     )}
                     onChange={(value) => {
                        field.onChange(value);
                        onChangeSelected && onChangeSelected(value);
                     }}
                     showSearch={true}
                     optionFilterProp="label"
                     value={field.value || undefined}
                     variant="borderless"
                  >
                     {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                           {option.label}
                        </Option>
                     ))}
                  </Select>
                  <label
                     className={clsx(
                        'text-md absolute left-5 transform -translate-y-1/2 text-gray-600 transition-all duration-200',
                        'top-1/2',
                        {
                           'text-sm transform -translate-y-8':
                              field.value || field.value === 0,
                        },
                     )}
                  >
                     {label}
                  </label>
               </div>
               {error && (
                  <span className="text-red-600 text-sm">{error.message}</span>
               )}
            </div>
         )}
      />
   );
};

export default SelectField;
