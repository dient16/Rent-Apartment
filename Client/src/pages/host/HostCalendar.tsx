import React from 'react';
import {
   Calendar,
   Drawer,
   Button,
   Divider,
   InputNumber,
   Select,
   Spin,
   message,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   apiGetApartmentByUser,
   apiGetRoomByApartmentId,
   apiGetPricingByRoomId,
   apiUpdatePricing,
} from '@/apis';

const { Option } = Select;

const CalendarPage: React.FC = () => {
   const [value, setValue] = React.useState(() => dayjs());
   const [selectedValue, setSelectedValue] = React.useState<Dayjs | null>(null);
   const [visible, setVisible] = React.useState(false);
   const [selectedApartment, setSelectedApartment] = React.useState<
      string | null
   >(null);
   const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);
   const [selectedPrice, setSelectedPrice] = React.useState<number | null>(
      null,
   );

   const queryClient = useQueryClient();

   const { data: apartments, isLoading: isLoadingGetApartment } = useQuery({
      queryKey: ['rentals'],
      queryFn: apiGetApartmentByUser,
   });

   const { data: rooms, isLoading: isLoadingGetRoomByApartmentId } = useQuery({
      queryKey: ['rooms', selectedApartment],
      queryFn: () => apiGetRoomByApartmentId(selectedApartment),
      enabled: !!selectedApartment,
   });

   const { data: pricingData, isLoading: isLoadingGetPricingByRoomId } =
      useQuery({
         queryKey: ['pricing', selectedRoom],
         queryFn: () => apiGetPricingByRoomId(selectedRoom),
         enabled: !!selectedRoom,
      });

   const updatePricingMutation = useMutation({
      mutationFn: ({ date, price }: { date: string; price: number }) =>
         apiUpdatePricing(selectedRoom!, date, price),
      onSuccess: (response: Res) => {
         message.success('Pricing updated successfully!');
         if (response.success) {
            queryClient.invalidateQueries({
               queryKey: ['pricing', selectedRoom],
            });
         } else {
            message.error('Error updating pricing: ' + response.message);
         }
      },
      onError: (error) => {
         console.error('Error updating pricing:', error);
      },
   });

   const {
      handleSubmit,
      control,
      setValue: setFormValue,
      formState: { errors },
   } = useForm();

   React.useEffect(() => {
      if (apartments?.data && !selectedApartment) {
         setSelectedApartment(apartments.data[0]?._id);
      }
   }, [apartments]);

   React.useEffect(() => {
      if (rooms?.data?.rooms && !selectedRoom) {
         setSelectedRoom(rooms.data?.rooms[0]?._id);
      }
   }, [rooms]);

   const onSelect = async (newValue: Dayjs) => {
      setValue(newValue);
      setSelectedValue(newValue);

      const formattedDate = newValue.format('YYYY-MM-DD');
      const pricing = pricingData?.data?.pricings?.find(
         (pricing: any) =>
            dayjs(pricing.date).format('YYYY-MM-DD') === formattedDate,
      );

      const price = pricing ? pricing.price : pricingData?.data?.defaultPrice;
      setSelectedPrice(price || null);
      setFormValue('price', price);
      setVisible(true);
   };

   const onPanelChange = (newValue: Dayjs) => {
      setVisible(false);
      setValue(newValue);
   };

   const onClose = () => {
      setVisible(false);
      setSelectedPrice(null);
   };

   const onSubmit = (data: any) => {
      const formattedDate = selectedValue?.format('YYYY-MM-DD');
      if (formattedDate && selectedPrice !== null) {
         updatePricingMutation.mutate({
            date: dayjs(formattedDate).format('YYYY-MM-DD'),
            price: data.price,
         });
      }

      onClose();
   };

   const dateCellRender = (current: Dayjs) => {
      const formattedDate = current.format('YYYY-MM-DD');
      const pricing = (pricingData?.data?.pricings || []).find(
         (pricing: any) =>
            dayjs(pricing.date).format('YYYY-MM-DD') === formattedDate,
      );
      const price = pricing ? pricing.price : pricingData?.data?.defaultPrice;
      const isDisabled = disabledDate(current);

      return (
         <div
            className={`flex items-center justify-end mt-2 font-medium ${
               isDisabled ? 'text-gray-500 cursor-not-allowed' : ''
            }`}
            style={{ opacity: isDisabled ? 0.5 : 1 }}
         >
            {isLoadingGetPricingByRoomId ? (
               <Spin size="small" />
            ) : (
               <p>
                  {price !== undefined ? (
                     <span>{price.toLocaleString()} VND</span>
                  ) : null}
               </p>
            )}
         </div>
      );
   };
   const disabledDate = (current: Dayjs) => {
      return current.isBefore(dayjs().startOf('day'), 'day');
   };

   return (
      <div className="container mx-auto p-4">
         <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
               <label htmlFor="apartment" className="block font-medium mb-2">
                  Apartment
               </label>
               <Select
                  id="apartment"
                  style={{ width: '100%' }}
                  size="large"
                  value={selectedApartment}
                  onChange={(value) => {
                     setSelectedApartment(value);
                     setSelectedRoom(null);
                  }}
                  loading={isLoadingGetApartment}
               >
                  {(apartments?.data || []).map((apartment: any) => (
                     <Option key={apartment._id} value={apartment._id}>
                        {apartment.title}
                     </Option>
                  ))}
               </Select>
            </div>
            <div className="w-full md:w-1/2 md:pl-2">
               <label htmlFor="room" className="block font-medium mb-2">
                  Room
               </label>
               <Select
                  id="room"
                  style={{ width: '100%' }}
                  size="large"
                  value={selectedRoom}
                  onChange={(value) => {
                     setSelectedRoom(value);
                  }}
                  loading={isLoadingGetRoomByApartmentId}
               >
                  {(rooms?.data?.rooms || [])?.map((room: any) => (
                     <Option key={room._id} value={room._id}>
                        <div className="flex items-center gap-2">
                           <img
                              src={room.images[0]}
                              alt=""
                              className="w-8 h-8 object-cover"
                           />
                           <span>{room.roomType}</span>
                        </div>
                     </Option>
                  ))}
               </Select>
            </div>
         </div>
         <Calendar
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            cellRender={dateCellRender}
            disabledDate={disabledDate}
            className="font-main text-md"
         />
         <Drawer
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
            className="p-4"
         >
            <form onSubmit={handleSubmit(onSubmit)}>
               <div>
                  <h2 className="text-lg font-semibold mb-4">
                     {selectedValue ? selectedValue.format('MMMM Do YYYY') : ''}
                  </h2>
                  <Divider />
                  <div className="mb-4">
                     <label htmlFor="price" className="block font-medium mb-2">
                        Price per Night
                     </label>
                     <Controller
                        name="price"
                        control={control}
                        rules={{
                           required: 'Please input the price per night!',
                        }}
                        render={({ field }) => (
                           <InputNumber
                              id="price"
                              min={1}
                              style={{ width: '100%' }}
                              addonAfter="VND"
                              size="large"
                              value={selectedPrice || undefined}
                              onChange={(value) => {
                                 setSelectedPrice(value);
                                 field.onChange(value);
                              }}
                              formatter={(value) => {
                                 if (!value) return '';
                                 return `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ',',
                                 );
                              }}
                              parser={(value) => {
                                 if (!value) return '';
                                 return value.replace(/,/g, '');
                              }}
                              {...field}
                           />
                        )}
                     />
                     {errors.price && (
                        <span className="text-red-500">
                           {errors.price.message as string}
                        </span>
                     )}
                  </div>
                  <Divider />
                  <div>
                     <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="w-full bg-blue-500"
                        shape="round"
                     >
                        Save
                     </Button>
                  </div>
               </div>
            </form>
         </Drawer>
      </div>
   );
};

export default CalendarPage;
