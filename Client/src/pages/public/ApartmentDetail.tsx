import {
   Map,
   NavigationBarRoom,
   Reviews,
   RoomList,
   RoomPolices,
   ImageGallery,
   BookingSummary,
   SearchInfoBar,
} from '@/components';
import { Button, Result, Spin, Image } from 'antd';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiApartmentDetail } from '@/apis';
import dayjs from 'dayjs';
import { path } from '@/utils/constant';
import icons from '@/utils/icons';

type RoomValue = {
   roomId: string;
   count: number;
};
const { FaLocationDot } = icons;

const ApartmentDetail: React.FC = () => {
   const { apartmentId } = useParams();
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const methods = useForm();

   const { data: { data: apartment } = {}, isFetching } = useQuery({
      queryKey: ['apartment', apartmentId, searchParams.toString()],
      queryFn: () => apiApartmentDetail(apartmentId, searchParams.toString()),
      staleTime: 0,
   });

   const startDate =
      searchParams.get('startDate') || dayjs().format('YYYY-MM-DD');
   const endDate =
      searchParams.get('endDate') || dayjs().add(1, 'day').format('YYYY-MM-DD');
   const numberOfGuest = parseInt(searchParams.get('numberOfGuest') || '1', 10);
   const defaultRoomId = searchParams.get('roomId') || '';
   const defaultRoomNumber = parseInt(
      searchParams.get('roomNumber') || '1',
      10,
   );

   const numberOfDays = dayjs(endDate).diff(dayjs(startDate), 'day');

   const selectedRooms = methods.watch('selectedRooms', []);

   const handleBooking = (data: any) => {
      const queryParams = new URLSearchParams({
         start_date: data.searchDate[0].format('YYYY-MM-DD'),
         end_date: data.searchDate[1].format('YYYY-MM-DD'),
         number_of_guest: numberOfGuest.toString(),
         room_number: selectedRooms
            .map((room: RoomValue) => room.count)
            .reduce((a: number, b: number) => a + b, 0)
            .toString(),
         room_id: selectedRooms.map((room: RoomValue) => room.roomId).join(','),
      });

      navigate(`/${path.BOOKING_CONFIRM}?${queryParams}`);
   };

   const handleDateChange = (dates: dayjs.Dayjs[]) => {
      if (dates) {
         const params = new URLSearchParams(window.location.search);
         params.set('startDate', dates[0].format('YYYY-MM-DD'));
         params.set('endDate', dates[1].format('YYYY-MM-DD'));
         window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${params}`,
         );
         methods.setValue('searchDate', dates);
      }
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
      <div className="relative w-full font-main apartment-detail">
         <FormProvider {...methods}>
            <SearchInfoBar
               numberOfGuest={numberOfGuest}
               totalRoomCount={selectedRooms.reduce(
                  (acc, room) => acc + room.count,
                  0,
               )}
               numberOfNights={numberOfDays}
               startDate={startDate}
               endDate={endDate}
               handleDateChange={handleDateChange}
            />
            <form
               onSubmit={methods.handleSubmit(handleBooking)}
               className="flex flex-col gap-5 justify-center w-full max-w-main"
            >
               <ImageGallery images={apartment.rooms[0]?.images} />
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
                        <div className="flex gap-10 mt-5 font-light">
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
                        control={methods.control}
                        defaultValue={[
                           {
                              roomId: defaultRoomId,
                              count: defaultRoomNumber,
                           },
                        ]}
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
                  <BookingSummary
                     apartment={apartment}
                     selectedRooms={selectedRooms}
                     numberOfGuest={numberOfGuest}
                     startDate={startDate}
                     endDate={endDate}
                     numberOfDays={numberOfDays}
                  />
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
               <div id="policies" className="mt-4">
                  <RoomPolices />
               </div>
               <div id="reviews" className="mt-4">
                  <Reviews />
               </div>
            </form>
         </FormProvider>
      </div>
   );
};

export default ApartmentDetail;
