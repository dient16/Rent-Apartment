import { apiGetMyBookings } from '@/apis';
import icons from '@/utils/icons';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { FaArrowRight, IoCalendarOutline, CiCreditCard1, RiMoonLine } = icons;

const MyBooking: React.FC = () => {
   const { data, isFetching } = useQuery({
      queryKey: ['my-booking'],
      queryFn: apiGetMyBookings,
   });
   const navigate = useNavigate();

   const calculateNights = (checkIn: string, checkOut: string) => {
      const checkInDate = moment(checkIn);
      const checkOutDate = moment(checkOut);
      return checkOutDate.diff(checkInDate, 'days');
   };

   const statusClasses = {
      pending: 'text-yellow-500',
      confirmed: 'text-green-500',
      canceled: 'text-red-500',
      completed: 'text-blue-500',
   };

   return (
      <div className="w-full p-4 min-h-screen">
         <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            My Bookings
         </h1>
         <div className="space-y-6 max-w-main mx-auto">
            {(data?.data || []).map((booking) => {
               const nights = calculateNights(
                  booking.checkInTime,
                  booking.checkOutTime,
               );
               const roomTypesCount = new Set(
                  booking.rooms.map((room) => room.roomType),
               ).size;
               const status = booking.status || 'unknown';

               return (
                  <div
                     key={booking._id}
                     onClick={() => navigate(`/my-booking/${booking._id}`)}
                     className="flex flex-col md:flex-row gap-6 p-2 rounded-lg hover:shadow-xl transition-shadow duration-300 bg-gray-100 cursor-pointer border border-gray-200"
                  >
                     <img
                        src={booking.rooms[0].image}
                        alt="Booking"
                        className="w-full md:w-60 h-40 object-cover rounded-lg"
                     />
                     <div className="space-y-2 w-full">
                        <div className="flex items-center gap-3 text-gray-700">
                           <IoCalendarOutline className="text-gray-600" />
                           <div className="flex gap-1">
                              <span className="font-medium">
                                 {moment(booking.checkInTime).format(
                                    'YYYY-MM-DD',
                                 )}
                              </span>
                              <FaArrowRight className="text-gray-600 mt-1" />
                              <span className="font-medium">
                                 {moment(booking.checkOutTime).format(
                                    'YYYY-MM-DD',
                                 )}
                              </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                           <RiMoonLine className="text-gray-600" size={20} />
                           <p className="font-medium">Nights: {nights}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                           Room Types: {roomTypesCount}
                        </p>
                        <p
                           className={`text-lg font-medium ${
                              statusClasses[status] || 'text-gray-500'
                           }`}
                        >
                           Status:{' '}
                           {status.charAt(0).toUpperCase() + status.slice(1)}
                        </p>
                        <div className="flex items-center gap-2 text-gray-700">
                           <CiCreditCard1 className="text-gray-600" size={25} />
                           <p className="text-base font-medium">
                              Total price: {booking.totalPrice.toLocaleString()}{' '}
                              VND
                           </p>
                        </div>
                     </div>
                  </div>
               );
            })}
            {isFetching && (
               <>
                  {[1, 2, 3].map((index) => (
                     <Skeleton
                        key={index}
                        loading={isFetching}
                        active
                        avatar={{ size: 180, shape: 'square' }}
                        className="rounded-lg shadow-md"
                     />
                  ))}
               </>
            )}
         </div>
      </div>
   );
};

export default MyBooking;
