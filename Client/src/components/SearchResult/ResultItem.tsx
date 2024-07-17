import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import icons from '@/utils/icons';
import { useMediaQuery } from 'react-responsive';
const { IoHeartSharp, GoLocation } = icons;

interface SearchItemProps {
   room: any;
   roomNumber: number;
   numberOfGuest: number;
   searchParams: URLSearchParams;
}

const SearchItem: React.FC<SearchItemProps> = ({
   room,
   roomNumber,
   numberOfGuest,
   searchParams,
}) => {
   const navigate = useNavigate();
   const isTablet = useMediaQuery({
      query: '(min-width: 640px) and (max-width: 1023px)',
   });
   const handleClick = () => {
      const queryParams = new URLSearchParams({
         province: searchParams.get('province'),
         startDate: searchParams.get('startDate'),
         endDate: searchParams.get('endDate'),
         numberOfGuest: numberOfGuest.toString(),
         roomNumber: roomNumber.toString(),
         roomId: room.roomId,
      });
      navigate(`/apartment/${room._id}?${queryParams.toString()}`);
   };

   return (
      <div
         key={room._id}
         className="flex flex-col lg:flex-row gap-5 items-start p-2 bg-white rounded-lg shadow-sm cursor-pointer font-main"
         onClick={handleClick}
      >
         <div className="w-full lg:w-4/12">
            <div className="relative">
               <Image
                  src={room.image}
                  className="rounded-lg"
                  preview={false}
                  height={isTablet ? 300 : 200}
                  width="100%"
               />
               <span className="flex overflow-hidden absolute top-2 right-2 justify-center items-center p-1.5 text-white bg-white bg-opacity-50 rounded-full opacity-100 cursor-pointer cursor-inherit">
                  <IoHeartSharp size={20} />
               </span>
            </div>
         </div>
         <div className="flex sm:flex-row flex-col w-full lg:w-8/12 h-full py-3">
            <div className="flex items-start w-full sm:w-7/12">
               <div className="flex flex-col gap-3 w-10/12">
                  <div className="overflow-hidden text-lg font-medium line-clamp-2">
                     {room.name}
                  </div>
                  <div className="flex gap-1 items-start text-xs font-normal">
                     <i className="mt-1">
                        <GoLocation size={15} />
                     </i>
                     <p className="text-blue-500 hover:underline line-clamp-2">
                        {`${room.address.street}, ${room.address.ward}, ${room.address.district}, ${room.address.province}`}
                     </p>
                  </div>
                  <div className="flex lg:flex-wrap gap-1 items-center ml-3 text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis ">
                     {(room?.amenities || []).map(
                        (
                           amenity: { name: string; icon: string },
                           index: number,
                        ) => (
                           <span key={index} className="px-3 border">
                              {amenity.name}
                           </span>
                        ),
                     )}
                  </div>
               </div>
               <div className="flex gap-2 justify-end sm:hidden w-2/12">
                  <div className="relative bg-blue-700 rounded-score w-[40px] h-[40px]">
                     <span className="absolute top-2 right-4 text-white">
                        {room.rating.ratingAvg}
                     </span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-between items-end w-full h-full lg:w-5/12 border-t-2 mt-4 sm:border-none sm:mt-0">
               <div className="sm:flex gap-2 min-w-[150px] justify-end hidden">
                  <div className="flex flex-col items-end">
                     <span className="font-medium">Review score</span>
                     <span className="font-light">{`${room.rating.totalRating} reviews`}</span>
                  </div>
                  <div className="relative bg-blue-700 rounded-score w-[40px] h-[40px]">
                     <span className="absolute top-2 right-4 text-white">
                        {room.rating.ratingAvg}
                     </span>
                  </div>
               </div>
               <div className="flex flex-col justify-end items-end pr-5 mt-2 w-full lg:w-auto">
                  <div className="text-xs font-light">{`${room.nights} night, ${numberOfGuest} people`}</div>
                  <div className="text-lg">{`${room.totalPrice?.toLocaleString()} VND`}</div>
                  <div className="text-xs font-light">{`+VND ${(
                     room.totalPrice * 0.11
                  )?.toLocaleString()} taxes and fees`}</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SearchItem;
