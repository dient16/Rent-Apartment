import React from 'react';
import { Carousel } from 'antd';
import { FaUsers, FaRulerCombined, FaMoneyBillWave } from 'react-icons/fa';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface RoomOption {
   _id: string;
   roomType: string;
   size: number;
   quantity: number;
   numberOfGuest: number;
   price: number;
   totalPrice: number;
   images: string[];
}

interface RoomInfoProps {
   roomInfo: RoomOption;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomInfo }) => {
   const { roomType, size, numberOfGuest, price, images } = roomInfo;

   return (
      <div className="flex bg-white overflow-hidden">
         <div className="w-2/3">
            <Carousel
               autoplay
               arrows={true}
               swipeToSlide
               draggable
               prevArrow={<LeftOutlined />}
               nextArrow={<RightOutlined />}
               className="rounded-md overflow-hidden"
            >
               {images.map((image, index) => (
                  <img
                     key={index}
                     src={image}
                     alt={`Slide ${index}`}
                     className="w-full h-[420px] object-cover"
                  />
               ))}
            </Carousel>
         </div>
         <div className="w-1/3 p-4 flex flex-col justify-between">
            <div>
               <h2 className="text-lg font-semibold mb-2">{roomType}</h2>
               <div className="flex items-center mb-4">
                  <FaRulerCombined className="text-gray-500 mr-2" />
                  <p className="text-gray-500 text-sm mr-4">{size} m²</p>
                  <FaUsers className="text-gray-500 mr-2" />
                  <p className="text-gray-500 text-sm">
                     {numberOfGuest} guests
                  </p>
               </div>
               <h3 className="text-sm font-medium mb-2">
                  Preferred Room Features:
               </h3>
               <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>Standing shower</li>
                  <li>Balcony/Terrace</li>
                  <li>Sitting area</li>
                  <li>Air conditioning</li>
               </ul>
               <h3 className="text-sm font-medium mb-2">Basic Amenities:</h3>
               <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>Non-smoking</li>
                  <li>Sitting area</li>
               </ul>
               <h3 className="text-sm font-medium mb-2">Room Amenities:</h3>
               <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>Air conditioning</li>
                  <li>Blackout curtains</li>
                  <li>Mini bar</li>
                  <li>Complimentary bottled water</li>
               </ul>
            </div>
            <div>
               <div className="flex items-center mb-4">
                  <FaMoneyBillWave className="text-red-500 mr-2" />
                  <p className="text-red-500 text-lg font-semibold">
                     Starting from: {price.toLocaleString()} VND / night
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default RoomInfo;
