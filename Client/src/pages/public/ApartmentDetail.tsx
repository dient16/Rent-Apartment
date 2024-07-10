import {
   Map,
   NavigationBarRoom,
   Reviews,
   RoomList,
   RoomPolices,
} from '@/components';
import icons from '@/utils/icons';
import { Button, DatePicker, Drawer, Image, Result, Spin, Tooltip } from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiApartmentDetail } from '@/apis';
import dayjs from 'dayjs';
import moment from 'moment';
import { path } from '@/utils/constant';
const { FaLocationDot, MdImage, PiUserThin } = icons;

const ApartmentDetail: React.FC = () => {
   const { apartmentId } = useParams();
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const {
      control,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm();
   const { data: { data: apartment } = {}, isFetching } = useQuery({
      queryKey: ['apartment', apartmentId, searchParams.toString()],
      queryFn: () => apiApartmentDetail(apartmentId, searchParams.toString()),
      staleTime: 0,
   });

   const selectRoom = {
      price: 500000,
      roomNumber: 1,
   };

   const numberOfGuest = 2;
   const numberOfDays = 3;
   const baseAmount = 1500000;
   const taxAmount = 165000;
   const totalAmount = 1665000;

   const handleBooking = (data) => {
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log('ApartmentDetail#handleBooking data:', data); // __AUTO_GENERATED_PRINT_VAR_END__
      const queryParams = new URLSearchParams({
         start_date: '2024-07-10',
         end_date: '2024-07-13',
         number_of_guest: '2',
         room_number: '1',
         room_id: 'room1',
      });

      // navigate(`/${path.BOOKING_CONFIRM}?${queryParams}`);
   };

   return isFetching ? (
      <div className="min-h-screen">
         <Spin spinning={isFetching} fullscreen={isFetching} />
      </div>
   ) : !apartment ? (
      <div className="flex justify-center items-center min-h-screen">
         <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={
               <Button
                  size="large"
                  className="bg-blue-500"
                  type="primary"
                  onClick={() => navigate(`/${path.HOME}`)}
               >
                  Back Home
               </Button>
            }
         />
      </div>
   ) : (
      <div className="flex justify-center w-full font-main apartment-detail">
         <form
            onSubmit={handleSubmit(handleBooking)}
            className="flex flex-col gap-5 justify-center w-full max-w-main"
         >
            <div className="grid overflow-hidden relative grid-cols-4 grid-rows-4 gap-3 mt-10 w-full max-h-[400px] lg:min-h-[300px]">
               <div className="col-span-2 row-span-4">
                  <div className="overflow-hidden w-full h-full rounded-2xl">
                     <Image
                        src={apartment.rooms[0]?.images[0]}
                        width="100%"
                        height="100%"
                     />
                  </div>
               </div>
               <div className="flex col-span-2 row-span-2 gap-3">
                  <div className="overflow-hidden w-1/2 h-full rounded-2xl">
                     <Image
                        src={apartment.rooms[0]?.images[1]}
                        width="100%"
                        height="100%"
                     />
                  </div>
                  <div className="overflow-hidden w-1/2 h-full rounded-2xl">
                     <Image
                        src={apartment.rooms[0]?.images[2]}
                        width="100%"
                        height="100%"
                     />
                  </div>
               </div>
               <div className="flex col-span-2 row-span-2 gap-3">
                  <div className="overflow-hidden w-1/2 h-full rounded-2xl">
                     <Image
                        src={apartment.rooms[0]?.images[3]}
                        width="100%"
                        height="100%"
                     />
                  </div>
                  <div className="overflow-hidden w-1/2 h-full rounded-2xl">
                     <Image
                        src={apartment.rooms[0]?.images[4]}
                        width="100%"
                        height="100%"
                     />
                  </div>
               </div>
               <Button
                  className="flex absolute right-3 bottom-3 gap-2 items-center bg-white border border-black"
                  size="middle"
               >
                  <MdImage size={18} />
                  <span>Show all images</span>
               </Button>
            </div>
            <div className="flex gap-5 items-start mt-5">
               <div className="flex flex-col">
                  <div className="flex flex-col gap-2 justify-center mt-5 font-main">
                     <div className="text-3xl">{apartment?.title}</div>
                     <div className="flex gap-1 items-center text-sm font-light font-main">
                        <FaLocationDot color="#1640D6" size={15} />
                        <p className="hover:underline">
                           {`${apartment.location.street}, ${apartment.location.ward}, ${apartment.location.district}, ${apartment.location.province}`}
                        </p>
                     </div>
                  </div>
                  <NavigationBarRoom />
                  <div className="mt-7">
                     <h3 id="overview" className="text-xl font-normal">
                        This place has something for you
                     </h3>
                     <div className="grid grid-cols-4 gap-3 mt-5 font-light">
                        {apartment.rooms[0]?.amenities.map(
                           (
                              amenity: { name: string; icon: string },
                              index: number,
                           ) => (
                              <div
                                 className="flex col-span-1 gap-2 items-center py-1"
                                 key={index}
                              >
                                 <Image
                                    height={24}
                                    preview={false}
                                    src={amenity.icon}
                                 />
                                 <span>{amenity.name}</span>
                              </div>
                           ),
                        )}
                     </div>
                  </div>
                  <div className="mt-7">
                     <div className="text-sm font-light whitespace-pre-line">
                        {apartment.description}
                     </div>
                  </div>
                  <h3 id="rooms" className="my-5 text-xl font-normal">
                     Rooms
                  </h3>
                  <Controller
                     name="selectedRooms"
                     control={control}
                     defaultValue={[]}
                     rules={{ required: 'Please select room' }}
                     render={({ field }) => (
                        <RoomList
                           roomList={apartment.rooms}
                           value={field.value}
                           onChange={field.onChange}
                        />
                     )}
                  />
               </div>
               <div className="sticky p-6 mt-5 rounded-lg shadow min-w-[350px] shadow-gray-400 top-[140px]">
                  <div className="flex flex-col gap-3 justify-center items-center w-full">
                     <div className="text-xl font-medium">
                        <span>
                           {(selectRoom?.price || 0).toLocaleString()} VND
                        </span>
                        <span className="text-base font-light">/ night</span>
                     </div>
                     <div className="flex flex-col justify-center">
                        <Controller
                           name="searchDate"
                           control={control}
                           rules={{
                              required: 'Please select the time',
                           }}
                           defaultValue={[
                              dayjs('2024-07-10'),
                              dayjs('2024-07-13'),
                           ]}
                           render={({ field }) => (
                              <Tooltip
                                 title={errors?.searchDate?.message as string}
                                 color="red"
                                 open={!!errors.searchDate}
                                 placement="right"
                              >
                                 <DatePicker.RangePicker
                                    format="DD-MM-YYYY"
                                    className="py-3 rounded-b-none rounded-t-lg cursor-pointer font-main border-700"
                                    inputReadOnly={true}
                                    superNextIcon={null}
                                    superPrevIcon={null}
                                    placeholder={['Check in', 'Check out']}
                                    popupClassName="show-card-md rounded-full"
                                    {...field}
                                    onChange={(dates) => field.onChange(dates)}
                                    disabledDate={(current) =>
                                       current &&
                                       current < moment().startOf('day')
                                    }
                                 />
                              </Tooltip>
                           )}
                        />
                        <div className="flex gap-1 justify-center items-center w-full font-normal bg-white rounded-t-none rounded-b-lg border border-t-0 border-gray-300 cursor-default select-none font-main h-[48px] border-700">
                           <PiUserThin size={25} />
                           <span className="">{`${numberOfGuest} adult · ${selectRoom?.roomNumber || 0} rooms`}</span>
                        </div>
                        <Button
                           className="mt-3 bg-blue-500 rounded-xl h-[48px] font-main text-md"
                           htmlType="submit"
                           type="primary"
                           disabled={!isValid}
                        >
                           Booking now
                        </Button>
                     </div>
                     <div className="flex flex-col gap-3 w-full">
                        <div className="flex justify-between items-center mt-3 w-full font-light">
                           <span>
                              <span>
                                 {(selectRoom?.price || 0).toLocaleString()} VND
                              </span>
                              <span>{` x ${numberOfDays === 0 ? 1 : numberOfDays} night`}</span>
                           </span>
                           <span>{baseAmount} VND</span>
                        </div>
                        <div className="flex justify-between items-center mt-1 w-full font-light">
                           <span>
                              <span>{baseAmount} VND</span>
                              <span>{` x ${selectRoom?.roomNumber || 1} rooms`}</span>
                           </span>
                           <span>{baseAmount} VND</span>
                        </div>
                        <div className="flex justify-between items-center pt-5 w-full font-light border-t border-gray-500">
                           <span>Tax fee 11%</span>
                           <span>{`+ ${taxAmount} VND`}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 w-full font-light border-t">
                           <span>
                              <span>Total amount, tax included</span>
                           </span>
                           <span>{totalAmount} VND</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative z-0 my-5 w-full h-[500px] h-128">
               <h3 id="location" className="mb-5 ml-3 text-xl font-normal">
                  Where you will go
               </h3>
               <Map
                  selectPosition={{
                     lat: apartment?.location.lat,
                     lon: apartment?.location.long,
                  }}
               />
            </div>
            <div className="mt-4">
               <RoomPolices />
            </div>
            <div className="mt-">
               <Reviews />
            </div>
         </form>
      </div>
   );
};

export default ApartmentDetail;
