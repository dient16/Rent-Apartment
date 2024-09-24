import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Carousel, Skeleton, Tooltip } from 'antd';
import icons from '@/utils/icons';
import { apiGetApartmentPopular } from '@/apis';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const { IoHeartSharp, MdOutlineKeyboardArrowRight } = icons;

const ApartmentPopular: React.FC = () => {
   const navigate = useNavigate();
   const { data, isLoading } = useQuery({
      queryKey: ['apartment-popular'],
      queryFn: () => apiGetApartmentPopular(),
   });

   if (isLoading) {
      return (
         <div className="my-10">
            <div className="text-lg mb-5">Apartments loved by guest</div>
            <Skeleton active />
         </div>
      );
   }

   const apartments = data?.data;

   return (
      <div className="my-10 w-full">
         <div className="text-lg mb-5">Apartments loved by guest</div>
         <Swiper
            spaceBetween={30}
            slidesPerView="auto"
            navigation
            pagination={{ clickable: true }}
            className="my-swiper"
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            coverflowEffect={{
               rotate: 0,
               stretch: 0,
               depth: 100,
               modifier: 2.5,
            }}
         >
            {(apartments || []).map((apartment) => (
               <SwiperSlide
                  key={apartment._id}
                  className="w-[250px] h-[295px] flex flex-col items-start bg-white rounded-3xl shadow-card-sm p-2 cursor-pointer"
               >
                  <div className="relative w-full">
                     <div
                        className="rounded-3xl overflow-hidden"
                        onClick={() =>
                           navigate(
                              `/apartment/${
                                 apartment._id
                              }?startDate=${moment().format(
                                 'YYYY-MM-DD',
                              )}&endDate=${moment()
                                 .add(1, 'day')
                                 .format(
                                    'YYYY-MM-DD',
                                 )}&numberOfGuest=1&roomNumber=1`,
                           )
                        }
                     >
                        <Carousel
                           arrows
                           swipeToSlide
                           draggable
                           className="rounded-3xl overflow-hidden"
                        >
                           {apartment.images.map((image, index) => (
                              <img
                                 key={index}
                                 src={image}
                                 className="h-[185px] w-full object-cover"
                              />
                           ))}
                        </Carousel>
                     </div>
                     <span className="absolute top-2 left-2 px-4 py-1.5 bg-green-200 rounded-full text-xs uppercase text-center tracking-normal leading-4 whitespace-nowrap text-green-500">
                        {apartment.avgRating}
                     </span>
                     <span className="absolute top-2 right-2 text-white flex justify-center items-center p-1 bg-opacity-50 bg-white rounded-full">
                        <IoHeartSharp size={18} />
                     </span>
                  </div>
                  <div className="mt-2 p-1 w-full">
                     <Tooltip title={apartment.title} placement="top">
                        <div className="text-lg truncate">
                           {apartment.title}
                        </div>
                     </Tooltip>
                     <Tooltip
                        title={`${apartment.location.district}, ${apartment.location.province}`}
                        placement="top"
                     >
                        <div className="text-sm font-light truncate w-full">
                           {apartment.location.district},{' '}
                           {apartment.location.province}
                        </div>
                     </Tooltip>
                  </div>
                  <div className="flex items-center justify-between w-full">
                     <div className="text-md font-medium mt-1 p-1">
                        {apartment.price.toLocaleString()} VND/night
                     </div>
                     <MdOutlineKeyboardArrowRight size={20} />
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
};

export default ApartmentPopular;
