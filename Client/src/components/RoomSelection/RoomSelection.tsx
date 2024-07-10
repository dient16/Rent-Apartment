import { Checkbox } from 'antd';
import { FaBed, FaShower, FaSmokingBan, FaUsers } from 'react-icons/fa';

interface RoomSelectionProps {
   roomOption: RoomOption;
   onChange: (selectedRoomId: string, checked: boolean) => void;
   isChecked: boolean;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
   roomOption,
   onChange,
   isChecked,
}) => {
   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(roomOption._id, e.target.checked);
   };

   return (
      <div className="p-4 mb-4 bg-white rounded-2xl border shadow-lg">
         <div className="flex gap-5 mb-4">
            <div className="w-1/3 bg-white">
               <img
                  alt="room"
                  src={roomOption.images[0]}
                  className="w-full rounded-lg h-[200px]"
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
                  <div className="text-blue-600">View room details</div>
               </div>
            </div>
            <div className="w-2/3">
               <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                     <tr>
                        <th className="py-2 px-4 text-lg font-semibold text-left border-r border-b border-gray-200">
                           Room Options
                        </th>
                        <th className="py-2 px-4 text-lg font-semibold text-left border-r border-b border-gray-200">
                           Guests
                        </th>
                        <th className="py-2 px-4 text-lg font-semibold text-left border-r border-b border-gray-200">
                           Price/night
                        </th>
                        <th className="py-2 px-4 text-lg font-semibold text-left border-b border-gray-200">
                           Select
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td className="py-2 px-4 border-r border-gray-200">
                           <div className="flex flex-col gap-1">
                              <h5 className="font-medium">
                                 {roomOption.roomType}
                              </h5>
                              <p>No breakfast included</p>
                              <p>Free cancellation before 23 Jun 2024, 12:59</p>
                              <p className="text-blue-600">Pay at Hotel</p>
                              <p>1 Double Bed</p>
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
                              <p>{roomOption.price.toLocaleString()} VND</p>
                              <p className="text-lg font-bold">
                                 {roomOption.totalPrice.toLocaleString()} VND
                              </p>
                              <p className="text-gray-500">
                                 Including taxes and fees
                              </p>
                           </div>
                        </td>
                        <td className="py-2 px-4">
                           <Checkbox
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                           />
                           <p className="text-red-500">
                              Only {roomOption.quantity} rooms left
                           </p>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default RoomSelection;
