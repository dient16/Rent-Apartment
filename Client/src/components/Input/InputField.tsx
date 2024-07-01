import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, InputNumber } from 'antd';
import clsx from 'clsx';

interface InputFieldProps {
   name: string;
   rules?: object;
   type?: 'text' | 'number' | 'textarea';
   label: string;
   className?: string;
   rows?: number;
   addonAfter?: string;
   formatter?: (value: string) => string;
   parser?: (value: string) => string;
}

const InputField: React.FC<InputFieldProps> = ({
   name,
   rules,
   type = 'text',
   label,
   className,
   rows,
   formatter,
   parser,
   addonAfter,
}) => {
   const { control } = useFormContext();
   let InputComponent:
      | typeof Input
      | typeof InputNumber
      | typeof Input.TextArea;

   switch (type) {
      case 'number':
         InputComponent = InputNumber;
         break;
      case 'textarea':
         InputComponent = Input.TextArea;
         break;
      default:
         InputComponent = Input;
   }

   return (
      <Controller
         control={control}
         name={name}
         rules={rules}
         render={({ field, fieldState: { error } }) => (
            <div>
               <div
                  className={clsx(
                     'relative input-container border border-gray-400 rounded-md transition-all px-3 z-10',
                     {
                        'border-green-700': field.value || field.value === 0,
                     },
                  )}
               >
                  <InputComponent
                     rows={rows}
                     formatter={formatter}
                     parser={parser}
                     {...field}
                     className={clsx(
                        'font-main text-lg input-field',
                        type === 'number' ? 'py-3' : 'h-16',
                        type === 'textarea' ? 'mt-5' : 'h-16',
                        className,
                     )}
                     addonAfter={addonAfter}
                     variant="borderless"
                  />
                  <label
                     className={clsx(
                        'text-lg absolute left-6 transform -translate-y-1/2 text-gray-600 transition-all duration-200 input-label',
                        type === 'textarea' ? 'top-9' : 'top-1/2',
                        {
                           'text-sm transform -translate-y-8 left-5':
                              field.value,
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

export default InputField;
