import React from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { path } from '@/utils/constant';

interface RentalItem {
   key: string;
   image: string;
   title: string;
   location: string;
   rooms: string;
}

const data: RentalItem[] = [
   {
      key: '1',
      image: 'https://via.placeholder.com/50', // Replace with actual image URL
      title: 'Charming Cottage in Hoi An',
      location: 'Hoi An, Quang Nam',
      rooms: '3',
   },
   {
      key: '2',
      image: 'https://via.placeholder.com/50', // Replace with actual image URL
      title: 'Modern Apartment in HCM City',
      location: 'Vo Thi Sau Ward, Ho Chi Minh City',
      rooms: '2',
   },
   {
      key: '3',
      image: 'https://via.placeholder.com/50', // Replace with actual image URL
      title: 'Luxurious Condo in Singapore',
      location: 'Singapore',
      rooms: '4',
   },
   {
      key: '4',
      image: 'https://via.placeholder.com/50', // Replace with actual image URL
      title: 'Beachfront Villa in Da Nang',
      location: 'Thanh Khe, Da Nang',
      rooms: '5',
   },
];

const RentalListPage: React.FC = () => {
   const navigate = useNavigate();

   const navigateToRooms = (apartmentId: string) => {
      navigate(`/apartment-rooms/${apartmentId}`);
   };

   const navigateToCreateApartment = () => {
      navigate(`${path.HOST_ROOT}${path.CREATE_APARTMENT}`);
   };

   const columns = [
      {
         title: 'Rental Item',
         dataIndex: 'image',
         key: 'image',
         render: (text: string, record: RentalItem) => (
            <img
               src={text}
               alt={record.title}
               style={{ width: 50, height: 50 }}
            />
         ),
      },
      {
         title: 'Title',
         dataIndex: 'title',
         key: 'title',
      },
      {
         title: 'Location',
         dataIndex: 'location',
         key: 'location',
      },
      {
         title: 'Rooms',
         dataIndex: 'rooms',
         key: 'rooms',
         render: (rooms: string, record: RentalItem) => (
            <Button type="link" onClick={() => navigateToRooms(record.key)}>
               {rooms}
            </Button>
         ),
      },
   ];

   return (
      <div
         className="container mx-auto mt-5"
         style={{ fontFamily: 'YourFontName, sans-serif' }}
      >
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Rental Listings</h1>
            <Button type="primary" onClick={navigateToCreateApartment}>
               Create New Apartment
            </Button>
         </div>
         <Table columns={columns} dataSource={data} />
      </div>
   );
};

export default RentalListPage;
