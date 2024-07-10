type Room = {
   roomType: string;
   amenities: string[];
   size: number;
   price: number;
   numberOfGuest: number;
   quantity: number;
   images: ({ response: { url: string } } | string)[];
};

type Apartment = {
   title: string;
   description: string;
   location: {
      long: number;
      lat: number;
      province: string;
      district: string;
      ward: string;
      street: string;
   };
   rooms: Room[];
   houseRules: string[];
   checkInTime: string;
   checkOutTime: string;
   safetyInfo: string[];
   cancellationPolicy: string;
   discounts: string[];
};
interface Location {
   long: number;
   lat: number;
   province: string;
   district: string;
   ward: string;
   street: string;
}

interface SearchData {
   searchText: string;
   searchDate: [Date, Date];
   searchGuest: {
      guest: number;
      room: number;
   };
   room: number;
   searchPrice?: number;
}

interface RoomOption {
   _id: string;
   roomType: string;
   amenities: { name: string; icon: string }[];
   size: number;
   price: number;
   images: string[];
   numberOfGuest: number;
   quantity: number;
   totalPrice: number;
}
