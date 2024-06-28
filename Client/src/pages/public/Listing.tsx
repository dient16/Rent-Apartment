import icons from '@/utils/icons';
import {
   Button,
   Checkbox,
   DatePicker,
   Dropdown,
   Flex,
   Image,
   Input,
   Pagination,
   Skeleton,
   Slider,
   Tooltip,
} from 'antd';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiSearchRoom } from '@/apis';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { DropDownItem } from '@/components';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { useJsApiLoader } from '@react-google-maps/api';
import moment from 'moment';
const { GoLocation, PiUserThin, IoHeartSharp } = icons;

const Listing: React.FC = () => {
   const { isLoaded } = useJsApiLoader({
      id: 'rent-apartment',
      googleMapsApiKey: import.meta.env.VITE_API_GOOGLE_MAP,
      libraries: ['maps', 'places'],
   });
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const {
      control,
      handleSubmit,
      formState: { errors },
      getValues,
      watch,
   } = useForm();

   const { data, isFetching } = useQuery({
      queryKey: ['listing', searchParams.toString()],
      queryFn: () => apiSearchRoom(searchParams.toString()),
      staleTime: 0,
   });
   const roomNumber: number =
      +searchParams.get('room') !== 0
         ? +searchParams.get('room_number') ?? 1
         : 1;
   const numberOfGuest: number =
      +searchParams.get('number_of_guest') !== 0
         ? +searchParams.get('number_of_guest') ?? 1
         : 1;
   const startDate: string | null = searchParams.get('start_date');
   const endDate: string | null = searchParams.get('end_date');
   const checkIn: Date | null = startDate ? new Date(startDate) : null;
   const checkOut: Date | null = endDate ? new Date(endDate) : null;
   const numberOfDays: number =
      checkIn && checkOut
         ? Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
           )
         : 1;
   const handleSearch = (data: SearchData) => {
      const queryParams = new URLSearchParams({
         province: data.searchText,
         startDate: dayjs(data.searchDate[0]).format('YYYY-MM-DD'),
         endDate: dayjs(data.searchDate[1]).format('YYYY-MM-DD'),
         numberOfGuest: data.searchGuest.guest.toString(),
         roomNumber: data.searchGuest.room.toString(),
      });
      if (
         data.searchPrice &&
         data.searchPrice[0] !== undefined &&
         data.searchPrice[1] !== undefined
      ) {
         queryParams.set('min_price', data.searchPrice[0].toString());
         queryParams.set('max_price', data.searchPrice[1].toString());
      }
      setSearchParams(queryParams);
   };
   const handleChangePage = (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', page.toString());
      setSearchParams(newSearchParams);
   };
   return (
      isLoaded && (
         <div className="flex justify-center items-center w-full font-main">
            <form
               onSubmit={handleSubmit(handleSearch)}
               className="flex gap-5 mt-10 mb-5 w-full min-h-screen max-w-main"
            >
               <div className="hidden py-5 px-10 pb-10 w-full rounded-lg sm:block max-w-[350px] bg-slate-100">
                  <div className="flex flex-col gap-2">
                     <div className="mx-2 text-lg">Search</div>
                     <Controller
                        name="searchText"
                        rules={{
                           required: 'Please enter a destination',
                        }}
                        control={control}
                        defaultValue={searchParams.get('province')}
                        render={({ field }) => (
                           <Tooltip
                              title={errors?.searchText?.message as string}
                              color="red"
                              open={!!errors.searchText}
                              placement="right"
                              zIndex={5}
                           >
                              <Input
                                 size="large"
                                 placeholder="Search"
                                 className="py-3 px-5 w-full rounded-xl border"
                                 {...field}
                              />
                           </Tooltip>
                        )}
                     />
                     <Controller
                        name="searchDate"
                        control={control}
                        rules={{
                           required: 'Please select the time',
                        }}
                        defaultValue={
                           startDate && endDate
                              ? [dayjs(startDate), dayjs(endDate)]
                              : undefined
                        }
                        render={({ field }) => (
                           <Tooltip
                              title={errors?.searchDate?.message as string}
                              color="red"
                              open={!!errors.searchDate}
                              placement="right"
                              zIndex={5}
                           >
                              <DatePicker.RangePicker
                                 format="DD-MM-YYYY"
                                 className="py-3 px-2 mt-2 w-full rounded-xl font-main"
                                 inputReadOnly={true}
                                 superNextIcon={null}
                                 superPrevIcon={null}
                                 placeholder={['Check in', 'Check out']}
                                 popupClassName="show-card-md rounded-full"
                                 {...field}
                                 onChange={(dates) => field.onChange(dates)}
                                 disabledDate={(current) =>
                                    current && current < moment().startOf('day')
                                 }
                              />
                           </Tooltip>
                        )}
                     />
                     <Controller
                        name="searchGuest"
                        control={control}
                        rules={{
                           required: 'Number of guest is required',
                        }}
                        defaultValue={{
                           guest: +numberOfGuest,
                           room: +roomNumber,
                        }}
                        render={({ field }) => (
                           <Tooltip
                              title={errors?.searchGuest?.message as string}
                              color="red"
                              open={!!errors.searchGuest}
                              placement="left"
                              zIndex={5}
                           >
                              <Dropdown
                                 dropdownRender={() => (
                                    <DropDownItem
                                       value={field.value}
                                       onChange={(value) =>
                                          field.onChange(value)
                                       }
                                    />
                                 )}
                                 placement="bottomLeft"
                                 trigger={['click']}
                              >
                                 <Button className="flex gap-1 justify-center items-center w-full bg-white rounded-xl font-main h-[48px]">
                                    <PiUserThin size={25} />
                                    <span className="">{`${getValues('searchGuest')?.guest} adult · ${
                                       getValues('searchGuest')?.room
                                    } rooms`}</span>
                                 </Button>
                              </Dropdown>
                           </Tooltip>
                        )}
                     />

                     <Button
                        className="px-5 w-full bg-blue-500 rounded-xl font-main h-[50px]"
                        type="primary"
                        icon={<SearchOutlined />}
                        htmlType="submit"
                     >
                        Search
                     </Button>
                  </div>
                  <div className="mt-3 w-full rounded-xl">
                     <h2 className="m-2 text-lg">Filter by</h2>
                     <div className="flex flex-col gap-3 justify-center p-3">
                        <h2>Your budget (per night)</h2>
                        <div className="">
                           <div className="font-light">{`VND ${(
                              watch('searchPrice')?.[0] || 100000
                           ).toLocaleString()} - VND ${(
                              watch('searchPrice')?.[1] || 5000000
                           ).toLocaleString()}${watch('searchPrice')?.[1] === 5000000 ? '+' : ''}`}</div>
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
               </div>
               <div className="flex flex-col gap-5 w-full">
                  <div className="flex items-center p-5 rounded-xl h-[60px] bg-slate-100">
                     <div className="text-lg font-normal">{`${
                        data?.data?.totalResults || 0
                     } Search results`}</div>
                  </div>
                  <div className="flex flex-col gap-5 p-2 w-full h-full rounded-lg bg-slate-100">
                     {isFetching ? (
                        <>
                           {[1, 2, 3].map((index) => (
                              <Skeleton
                                 key={index}
                                 loading={isFetching}
                                 active
                                 avatar={{ size: 180, shape: 'square' }}
                              />
                           ))}
                        </>
                     ) : (
                        <>
                           {data?.data?.apartments.length === 0 && (
                              <div className="flex justify-center items-center">
                                 <h2 className="text-2xl font-main">
                                    Please enter your destination and arrival
                                    time
                                 </h2>
                              </div>
                           )}
                           {(data?.data?.apartments || []).map((room) => {
                              const numDate =
                                 !numberOfDays || numberOfDays === 0
                                    ? 1
                                    : +numberOfDays;
                              const price = +roomNumber * +room.price * numDate;
                              return (
                                 <div
                                    key={room._id}
                                    className="flex gap-5 items-start p-1 bg-white rounded-lg shadow-sm cursor-pointer"
                                    onClick={() => {
                                       const queryParams = new URLSearchParams({
                                          province:
                                             searchParams.get('province'),
                                          start_date:
                                             searchParams.get('start_date'),
                                          end_date:
                                             searchParams.get('end_date'),
                                          number_of_guest:
                                             numberOfGuest.toString(),
                                          room_number: roomNumber.toString(),
                                          room_id: room.roomId,
                                       });
                                       navigate(
                                          `/apartment/${room._id}?${queryParams.toString()}`,
                                       );
                                    }}
                                 >
                                    <div className="w-4/12">
                                       <div className="relative">
                                          <Image
                                             src={room.image}
                                             className="rounded-lg"
                                             preview={false}
                                             height={200}
                                             width="100%"
                                          />
                                          <span className="flex overflow-hidden absolute top-2 right-2 justify-center items-center p-1.5 text-white bg-white bg-opacity-50 rounded-full opacity-100 cursor-pointer cursor-inherit">
                                             <IoHeartSharp size={20} />
                                          </span>
                                       </div>
                                    </div>
                                    <div className="flex py-3 w-8/12 h-full">
                                       <div className="flex flex-col gap-3 w-7/12 sm:mt-3">
                                          <div className="overflow-hidden text-lg font-medium line-clamp-2">
                                             {room.name}
                                          </div>
                                          <div className="flex gap-1 justify-center items-start text-xs font-light">
                                             <i className="mt-1">
                                                <GoLocation size={15} />
                                             </i>
                                             <span className="text-blue-800 hover:underline line-clamp-2">
                                                {`${room.address.street}, ${room.address.ward}, ${room.address.district}, ${room.address.province}`}
                                             </span>
                                          </div>
                                          <div className="flex flex-wrap gap-1 items-center ml-3 text-sm font-light">
                                             {(room?.services || []).map(
                                                (service, index) => (
                                                   <span
                                                      key={index}
                                                      className="px-3 border"
                                                   >
                                                      {service}
                                                   </span>
                                                ),
                                             )}
                                          </div>
                                       </div>
                                       <div className="flex flex-col justify-between items-end w-5/12">
                                          <div className="hidden gap-2 sm:flex min-w-[150px]">
                                             <div className="flex flex-col items-end">
                                                <span className="font-medium">
                                                   Review score
                                                </span>
                                                <span className="font-light">{`${room.rating.totalRating} reviews`}</span>
                                             </div>
                                             <div className="relative bg-blue-700 rounded-score w-[40px] h-[40px]">
                                                <span className="absolute top-2 right-4 text-white">
                                                   {room.rating.ratingAgv}
                                                </span>
                                             </div>
                                          </div>
                                          <div className="flex flex-col justify-end items-end pr-5 mt-2 w-full">
                                             <div className="text-xs font-light">{`${numDate} night, ${numberOfGuest} people`}</div>
                                             <div className="text-lg">{`${price?.toLocaleString()} VND`}</div>
                                             <div className="text-xs font-light">
                                                {`+VND ${(
                                                   price * 0.11
                                                )?.toLocaleString()} taxes and fees`}
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}
                        </>
                     )}
                  </div>
                  <Pagination
                     defaultCurrent={1}
                     total={data?.data?.totalResults || 0}
                     defaultPageSize={4}
                     onChange={handleChangePage}
                     className="flex justify-center"
                     current={+searchParams.get('page') || 1}
                  />
               </div>
            </form>
         </div>
      )
   );
};

export default Listing;
