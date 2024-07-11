import RoomSelection from './RoomSelection';

interface RoomsListProps {
   roomList: RoomOption[];
   onChange: (selectedRooms: { roomId: string; count: number }[]) => void;
   value: { roomId: string; count: number }[];
}

const RoomsList: React.FC<RoomsListProps> = ({ roomList, onChange, value }) => {
   const handleRoomSelection = (selectedRoom: {
      roomId: string;
      count: number;
   }) => {
      const updatedSelectedRooms = value.filter(
         (room) => room.roomId !== selectedRoom.roomId,
      );
      if (selectedRoom.count > 0) {
         updatedSelectedRooms.push(selectedRoom);
      }
      onChange(updatedSelectedRooms);
   };

   return (
      <div className="space-y-4">
         {roomList.map((room) => (
            <RoomSelection
               key={room._id}
               roomOption={room}
               onChange={handleRoomSelection}
               selectedCount={
                  value.find((r) => r.roomId === room._id)?.count || 0
               }
            />
         ))}
      </div>
   );
};

export default RoomsList;
