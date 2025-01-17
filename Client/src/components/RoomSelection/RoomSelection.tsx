import React, { useState, useEffect } from 'react';
import { FaBed, FaShower, FaSmokingBan, FaUsers } from 'react-icons/fa';
import { Modal } from 'antd';
import { RoomInfo } from '@/components';

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

interface RoomSelectionProps {
   roomOption: RoomOption;
   onChange: (selectedRoom: {
      roomId: string;
      roomType: string;
      count: number;
   }) => void;
   selectedCount: number;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
   roomOption,
   onChange,
   selectedCount,
}) => {
   const [count, setCount] = useState<number>(selectedCount);
   const [isModalVisible, setIsModalVisible] = useState(false);

   useEffect(() => {
      setCount(selectedCount);
   }, [selectedCount]);

   const handleCountChange = (value: number) => {
      setCount(value);
      onChange({
         roomId: roomOption._id,
         roomType: roomOption.roomType,
         count: value,
      });
   };

   const increment = () => {
      if (count < roomOption.quantity) {
         handleCountChange(count + 1);
      }
   };

   const decrement = () => {
      if (count > 0) {
         handleCountChange(count - 1);
      }
   };

   const showModal = () => {
      setIsModalVisible(true);
   };

   const handleOk = () => {
      setIsModalVisible(false);
   };

   const handleCancel = () => {
      setIsModalVisible(false);
   };

   return (
      <div className="p-4 mb-4 bg-white rounded-2xl border shadow-lg">
         <div className="flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/3 bg-white">
               <img
                  alt="room"
                  src={roomOption.images[0]}
                  className="w-full rounded-lg h-[200px] object-cover"
               />
               <div className="flex flex-col gap-2 p-4">
                  <h3 className="text-2xl font-semibold">
                     {roomOption.roomType}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                     <div className="flex gap-3 items-center">
                        <FaBed />
                        <span>{roomOption.size} m²</span>
                     </div>
                     <div className="flex gap-3 items-center">
                        <FaSmokingBan />
                        <span>Non-smoking</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <FaShower />
                        <span>Shower</span>
                     </div>
                  </div>
                  <div
                     className="text-blue-600 cursor-pointer"
                     onClick={showModal}
                  >
                     View room details
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-2/3">
               <div className="hidden lg:block">
                  <table className="min-w-full bg-white border border-gray-200">
                     <thead className="bg-gray-100">
                        <tr>
                           <th className="py-2 px-4 text-md font-semibold text-left border-r border-b border-gray-200">
                              Room Options
                           </th>
                           <th className="py-2 px-4 text-md font-semibold text-left border-r border-b border-gray-200">
                              Guests
                           </th>
                           <th className="py-2 px-4 text-md font-semibold text-left border-r border-b border-gray-200">
                              Price/night
                           </th>
                           <th className="py-2 px-4 text-md font-semibold text-left border-b border-gray-200">
                              Quantity
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td className="py-2 px-4 border-r border-gray-200">
                              <div className="flex flex-col gap-1 text-sm">
                                 <h5 className="font-medium">
                                    {roomOption.roomType}
                                 </h5>
                                 <p>Breakfast not included</p>
                                 <p>
                                    Free cancellation before June 23, 2024,
                                    12:59
                                 </p>
                                 <p className="text-blue-600">
                                    Pay at the hotel
                                 </p>
                                 <div className="flex items-center">
                                    <FaBed className="mr-2" />
                                    <span>2 Double Beds</span>
                                 </div>
                              </div>
                           </td>
                           <td className="py-2 px-4 border-r border-gray-200">
                              <div className="flex items-center">
                                 <FaUsers />
                                 <span className="ml-2">
                                    {roomOption.numberOfGuest}
                                 </span>
                              </div>
                           </td>
                           <td className="py-2 px-4 border-r border-gray-200">
                              <div className="flex flex-col items-center">
                                 <p className="text-md font-bold">
                                    {roomOption.totalPrice.toLocaleString()} VND
                                 </p>
                                 <p className="text-gray-500 text-sm">
                                    Including taxes and fees
                                 </p>
                              </div>
                           </td>
                           <td className="py-2 px-4">
                              <div className="py-2 px-3 bg-white border border-gray-200 rounded-lg">
                                 <div className="w-full flex justify-between items-center gap-x-3">
                                    <div className="flex justify-end items-center gap-x-1.5">
                                       <button
                                          type="button"
                                          className={`size-8 inline-flex justify-center items-center gap-x-2 text-base font-medium rounded-full border bg-white text-gray-800 shadow-sm hover:bg-gray-50 ${
                                             count === 0
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                          }`}
                                          onClick={decrement}
                                          disabled={count === 0}
                                       >
                                          <svg
                                             className="flex-shrink-0 size-5"
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="28"
                                             height="28"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="2"
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                          >
                                             <path d="M5 12h14"></path>
                                          </svg>
                                       </button>
                                       <input
                                          type="text"
                                          className="w-12 text-xl text-center border-t border-b outline-none"
                                          value={count}
                                          readOnly
                                       />
                                       <button
                                          type="button"
                                          className={`size-8 inline-flex justify-center items-center gap-x-2 text-base font-medium rounded-full border bg-white text-gray-800 shadow-sm hover:bg-gray-50 ${
                                             count === roomOption.quantity
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                          }`}
                                          onClick={increment}
                                          disabled={
                                             count === roomOption.quantity
                                          }
                                       >
                                          <svg
                                             className="flex-shrink-0 size-5"
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="28"
                                             height="28"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="2"
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                          >
                                             <path d="M5 12h14"></path>
                                             <path d="M12 5v14"></path>
                                          </svg>
                                       </button>
                                    </div>
                                 </div>
                              </div>
                              <p className="text-red-500">
                                 Only {roomOption.quantity} rooms left
                              </p>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <div className="block lg:hidden">
                  <div className="flex flex-col gap-2 p-4">
                     <div className="flex justify-between">
                        <span>Guests:</span>
                        <div className="flex items-center">
                           <FaUsers />
                           <span className="ml-2">
                              {roomOption.numberOfGuest}
                           </span>
                        </div>
                     </div>
                     <div className="flex justify-between">
                        <span>Price/night:</span>
                        <span>{roomOption.price.toLocaleString()} VND</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Total Price:</span>
                        <span>
                           {roomOption.totalPrice.toLocaleString()} VND
                        </span>
                     </div>
                     {/* <div className="flex justify-between">
                        <span>Cancellation Policy:</span>
                        <span>
                           Free cancellation before June 23, 2024, 12:59
                        </span>
                     </div> */}
                     <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span className="text-blue-600">Pay at the hotel</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Bed Type:</span>
                        <span>1 Double Bed</span>
                     </div>
                     <div className="flex flex-col items-center mt-4">
                        <div className="flex justify-between items-center gap-x-3 w-full max-w-[240px]">
                           <button
                              type="button"
                              className={`size-8 inline-flex justify-center items-center gap-x-2 text-base font-medium rounded-full border bg-white text-gray-800 shadow-sm hover:bg-gray-50 ${
                                 count === 0
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                              }`}
                              onClick={decrement}
                              disabled={count === 0}
                           >
                              <svg
                                 className="flex-shrink-0 size-5"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="28"
                                 height="28"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M5 12h14"></path>
                              </svg>
                           </button>
                           <input
                              type="text"
                              className="w-12 text-xl text-center border-t border-b outline-none"
                              value={count}
                              readOnly
                           />
                           <button
                              type="button"
                              className={`size-8 inline-flex justify-center items-center gap-x-2 text-base font-medium rounded-full border bg-white text-gray-800 shadow-sm hover:bg-gray-50 ${
                                 count === roomOption.quantity
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                              }`}
                              onClick={increment}
                              disabled={count === roomOption.quantity}
                           >
                              <svg
                                 className="flex-shrink-0 size-5"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="28"
                                 height="28"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M5 12h14"></path>
                                 <path d="M12 5v14"></path>
                              </svg>
                           </button>
                        </div>
                        <p className="text-red-500 mt-2">
                           Only {roomOption.quantity} rooms left
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <Modal
            title="Room Details"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width="50%"
            footer={null}
            styles={{
               mask: {
                  backdropFilter: 'blur(5px)',
               },
            }}
         >
            <RoomInfo roomInfo={roomOption} />
         </Modal>
      </div>
   );
};

export default RoomSelection;
