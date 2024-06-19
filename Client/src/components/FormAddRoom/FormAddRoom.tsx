import { Checkbox, Upload, Image, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { apiGetServices } from '@/apis';
import { InputForm } from '..';
import icons from '@/utils/icons';
import clsx from 'clsx';
import {
   FieldValues,
   DeepMap,
   FieldError,
   Control,
   Controller,
} from 'react-hook-form';
const { FiTrash, AiOutlineClose } = icons;

interface AddRoomProps {
   errors: DeepMap<FieldValues, FieldError>;
   control: Control<ApartmentType>;
   indexRoom: number;
   onClose: (index: number) => void;
}

const AddRoom: React.FC<AddRoomProps> = ({
   errors,
   control,
   indexRoom,
   onClose,
}) => {
   const { data: servicesData } = useQuery({
      queryKey: ['services'],
      queryFn: apiGetServices,
   });
   return (
      <div className="flex relative flex-col gap-5 p-5 px-10 rounded-xl border-gray-300 md:py-5 border-[1px]">
         <span
            className={clsx(
               'absolute top-3 right-3 p-2 rounded-xl border border-red-500 cursor-pointer',
               indexRoom === 0 && 'hidden',
            )}
            onClick={() => onClose(indexRoom)}
         >
            <AiOutlineClose color="#e50000" />
         </span>
         <div className="flex flex-col">
            <label className="mb-1 text-lg">
               <span className="text-red-500">* </span>
               {'Services'}
            </label>
            <Controller
               control={control}
               name={`rooms.${indexRoom}.services`}
               rules={{
                  required: 'Services is required',
               }}
               render={({ field }) => (
                  <Flex vertical gap={5}>
                     <Checkbox.Group
                        options={(servicesData?.data || []).map((service) => ({
                           label: service.title,
                           value: service._id,
                        }))}
                        {...field}
                        defaultValue={field.value}
                        className="grid grid-cols-6 text-lg"
                     />
                     {errors?.rooms?.[indexRoom]?.services && (
                        <span className="text-red-600 font-main">
                           {errors?.rooms?.[indexRoom]?.services.message}
                        </span>
                     )}
                  </Flex>
               )}
            />
         </div>

         <InputForm
            control={control}
            name={`rooms.${indexRoom}.description`}
            rules={{ required: 'Description is required' }}
            placeholder="Enter the description"
            type="area"
            label="Description"
            rows={5}
            className="min-w-[200px] md:min-w-[250px]"
         />
         <div className="flex flex-col">
            <label className="mb-2 text-lg">
               <span className="text-red-500">* </span>
               {'Images'}
            </label>
            <Flex align="center" gap={2}>
               <Controller
                  control={control}
                  name={`rooms.${indexRoom}.images`}
                  rules={{
                     required: 'Images is required',
                  }}
                  render={({ field: { onChange, value } }) => (
                     <Flex vertical gap={5}>
                        <Upload
                           listType="picture-card"
                           accept="image/*"
                           customRequest={() => null}
                           fileList={value}
                           onChange={({ fileList }) => {
                              onChange(fileList);
                           }}
                           maxCount={50}
                           multiple
                           itemRender={(
                              ReactElement,
                              UploadFile,
                              fileList,
                              actions,
                           ) => {
                              return (
                                 <div className="flex relative justify-center items-center w-full h-full">
                                    <Image
                                       width={100}
                                       src={
                                          (UploadFile.thumbUrl as string) ||
                                          URL.createObjectURL(
                                             UploadFile.originFileObj as File,
                                          )
                                       }
                                    />
                                    <i
                                       className="absolute top-0 right-0 p-1 rounded-full border cursor-pointer"
                                       onClick={() => actions.remove()}
                                    >
                                       <FiTrash color={'#cc0000'} />
                                    </i>
                                 </div>
                              );
                           }}
                        >
                           <div>
                              <PlusOutlined />
                              <div className="mt-2">Upload</div>
                           </div>
                        </Upload>
                        {errors?.rooms?.[indexRoom]?.images && (
                           <span className="text-red-600 font-main">
                              {errors?.rooms?.[indexRoom]?.images.message}
                           </span>
                        )}
                     </Flex>
                  )}
               />
            </Flex>
         </div>
         <Flex align="center" gap={20} wrap="wrap">
            <InputForm
               control={control}
               name={`rooms.${indexRoom}.size`}
               rules={{
                  required: 'Room size is required',
                  validate: {
                     positive: (value: number) =>
                        value >= 0 || 'Room size cannot be less than 0',
                  },
               }}
               placeholder="Enter the room size"
               type="number"
               label="Room size"
               className="min-w-[200px] md:min-w-[250px]"
               formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
               }
               addonAfter="m²"
               parser={(value) => value.replace(/m²\s?|,/g, '')}
            />

            <InputForm
               control={control}
               name={`rooms.${indexRoom}.price`}
               rules={{
                  required: 'Price is required',
                  validate: {
                     positive: (value: number) =>
                        value >= 0 || 'Price cannot be less than 0',
                  },
               }}
               placeholder="Enter the size"
               type="number"
               label="Price"
               className="min-w-[200px] md:min-w-[250px]"
               formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
               }
               addonAfter="VND"
               parser={(value) => value.replace(/VND\s?|,/g, '')}
            />
            <InputForm
               control={control}
               name={`rooms.${indexRoom}.roomType`}
               rules={{ required: 'Room type is required' }}
               placeholder="Enter the room type"
               label="Room type"
               className="min-w-[200px] md:min-w-[250px]"
            />

            <InputForm
               control={control}
               name={`rooms.${indexRoom}.numberOfGuest`}
               rules={{
                  required: 'Number of guests is required',
                  validate: {
                     positive: (value: number) =>
                        value >= 0 || 'Number of guests cannot be less than 0',
                  },
               }}
               placeholder="Enter the number of guests"
               type="number"
               label="Number of guests"
               className="min-w-[200px] md:min-w-[250px]"
            />
            <InputForm
               control={control}
               name={`rooms.${indexRoom}.quantity`}
               rules={{
                  required: 'Quantity is required',
                  valueAsNumber: 'Quantity must be numeric',
                  validate: {
                     positive: (value: number) =>
                        value >= 0 || 'Quantity cannot be less than 0',
                  },
               }}
               placeholder="Enter the quantity"
               label="Quantity"
               type="number"
               className="min-w-[200px] md:min-w-[250px]"
            />
         </Flex>
      </div>
   );
};

export default AddRoom;
