import { useState } from 'react';
import RoomSelection from './RoomSelection';

interface RoomsListProps {
   roomList: RoomOption[];
   onChange: (selectedRooms: RoomOption[]) => void;
   value: RoomOption[];
}

const RoomsList: React.FC<RoomsListProps> = ({ roomList, onChange, value }) => {
   const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>(
      value.map((room) => room._id),
   );

   const handleRoomSelection = (roomId: string, isChecked: boolean) => {
      let updatedSelectedRooms: RoomOption[];
      if (isChecked) {
         updatedSelectedRooms = [
            ...value,
            roomList.find((room) => room._id === roomId)!,
         ];
      } else {
         updatedSelectedRooms = value.filter((room) => room._id !== roomId);
      }
      setSelectedRoomIds(updatedSelectedRooms.map((room) => room._id));
      onChange(updatedSelectedRooms);
   };

   return (
      <div className="space-y-4">
         {roomList.map((room) => (
            <RoomSelection
               key={room._id}
               roomOption={room}
               onChange={handleRoomSelection}
               isChecked={selectedRoomIds.includes(room._id)}
            />
         ))}
      </div>
   );
};

export default RoomsList;
