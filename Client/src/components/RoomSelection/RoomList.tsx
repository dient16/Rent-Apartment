import RoomSelection from './RoomSelection';

interface RoomOption {
   roomType: string;
   breakfastIncluded: boolean;
   cancellationPolicy: string;
   paymentOption: string;
   bedType: string;
   price: number;
   discount: number;
   totalPrice: number;
   availableRooms: number;
}

const roomOptions: RoomOption[] = [
   {
      roomType: 'Superior Double Room',
      breakfastIncluded: false,
      cancellationPolicy: 'Free cancellation before 23 Jun 2024, 12:59',
      paymentOption: 'Pay at Hotel',
      bedType: '1 Double Bed',
      price: 518400,
      discount: 0.31,
      totalPrice: 357696,
      availableRooms: 3,
   },
   {
      roomType: 'Deluxe Twin Room',
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation before 23 Jun 2024, 12:59',
      paymentOption: 'Pay at Hotel',
      bedType: '2 Single Beds',
      price: 618400,
      discount: 0.2,
      totalPrice: 494720,
      availableRooms: 5,
   },
];

const RoomsList: React.FC = () => {
   return (
      <div className="space-y-4">
         {roomOptions.map((roomOption) => (
            <RoomSelection key={roomOption.roomType} roomOption={roomOption} />
         ))}
      </div>
   );
};

export default RoomsList;
