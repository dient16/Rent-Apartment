import { apiGetBooking } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { Button, Spin, Carousel } from 'antd';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
   FaBed,
   FaRulerCombined,
   FaCalendarCheck,
   FaCalendarAlt,
} from 'react-icons/fa';
import { FaDoorOpen } from 'react-icons/fa6';

const BookingDetail: React.FC = () => {
   const { bookingId } = useParams();
   const { data: { data = {} } = {}, isFetching } = useQuery({
      queryKey: ['booking-completion', bookingId],
      queryFn: () => apiGetBooking(bookingId),
   });

   return isFetching ? (
      <div className="min-h-screen">
         <Spin spinning={true} fullscreen size="large"></Spin>
      </div>
   ) : (
      <div className="max-w-screen-lg w-full min-h-screen mx-auto py-8 px-4 lg:px-8">
         <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-6 lg:p-8">
               {data.rooms && data.rooms.length > 0 && (
                  <>
                     <h1 className="text-3xl font-bold mb-4 text-gray-800">
                        {data.apartmentName || 'Unknown Apartment'}
                     </h1>
                     <p className="text-gray-600 mb-6">
                        {`${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.province}`}
                     </p>
                     <div className="flex flex-col lg:flex-row items-center gap-3 space-y-4 lg:space-y-0 lg:space-x-6">
                        <div className="border rounded-lg p-4 flex items-center space-x-4">
                           <FaCalendarCheck className="text-blue-500 text-2xl" />
                           <div>
                              <div className="font-semibold text-gray-800">
                                 Check-in
                              </div>
                              <div className="text-gray-600">
                                 {moment(data.checkIn).format(
                                    'dddd, DD MMMM YYYY',
                                 )}
                              </div>
                           </div>
                        </div>
                        <div className="border rounded-lg p-4 flex items-center space-x-4">
                           <FaCalendarAlt className="text-red-500 text-2xl" />
                           <div>
                              <div className="font-semibold text-gray-800">
                                 Check-out
                              </div>
                              <div className="text-gray-600">
                                 {moment(data.checkOut).format(
                                    'dddd, DD MMMM YYYY',
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 space-y-8">
                        {data.rooms.map((room) => (
                           <div key={room.roomId} className="border-t pt-6">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="text-lg font-semibold text-gray-800">
                                    {room.roomType}
                                 </div>
                                 <div className="flex items-center text-lg font-bold text-gray-800">
                                    <FaDoorOpen className="mr-2" />
                                    {room.roomNumber} Rooms
                                 </div>
                              </div>
                              <div className="flex items-center space-x-4 mb-4 text-gray-600">
                                 <FaRulerCombined />
                                 <span>{room.size} m²</span>
                                 <FaBed />
                                 <span>{room.bedType}</span>
                              </div>
                              <Carousel
                                 arrows
                                 swipeToSlide
                                 draggable
                                 className="rounded-lg overflow-hidden"
                              >
                                 {room.images.map(
                                    (image: string, index: number) => (
                                       <img
                                          key={index}
                                          src={image}
                                          alt={room.roomType}
                                          className="w-full h-[300px] object-cover"
                                       />
                                    ),
                                 )}
                              </Carousel>
                           </div>
                        ))}
                     </div>
                  </>
               )}
            </div>
            <div className="border-t border-gray-300 p-6 lg:p-8">
               <div className="space-y-4">
                  <div className="text-lg font-semibold text-gray-800">
                     Contact us
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center text-base space-y-4 lg:space-y-0 lg:space-x-4">
                     <div className="font-semibold">Email:</div>
                     <div className="underline text-gray-600">
                        {data.contact.email}
                     </div>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center text-base space-y-4 lg:space-y-0 lg:space-x-4">
                     <div className="font-semibold">Số điện thoại:</div>
                     <div className="text-gray-600">{data.contact.phone}</div>
                  </div>
               </div>
            </div>
            <div className="border-t border-gray-300 p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
               <div>
                  <span className="text-xl font-semibold text-gray-800 mr-4">
                     Tổng:
                  </span>
                  <span className="text-xl text-gray-800">
                     {data.totalPrice.toLocaleString()} VND
                  </span>
               </div>
               <div className="flex space-x-4">
                  <Button
                     type="primary"
                     size="large"
                     shape="round"
                     className="bg-blue-500"
                  >
                     Contact us
                  </Button>
                  <Button type="primary" ghost size="large" shape="round">
                     Cancel booking
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default BookingDetail;
