import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import icons from '@/utils/icons';
const { IoHeartSharp, GoLocation } = icons;

const SearchItem: React.FC<any> = ({
   room,
   roomNumber,
   numberOfGuest,
   searchParams,
}) => {
   const navigate = useNavigate();

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
         className="flex gap-5 items-start p-2 bg-white rounded-lg shadow-sm cursor-pointer"
         onClick={handleClick}
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
            <div className="flex flex-col justify-between items-end w-5/12">
               <div className="gap-2 flex min-w-[150px]">
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
               <div className="flex flex-col justify-end items-end pr-5 mt-2 w-full">
                  <div className="text-xs font-light">{`${room.nights} night, ${numberOfGuest} people`}</div>
                  <div className="text-lg">{`${room.totalPrice?.toLocaleString()} VND`}</div>
                  <div className="text-xs font-light">{`+VND ${(room.totalPrice * 0.11)?.toLocaleString()} taxes and fees`}</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SearchItem;
