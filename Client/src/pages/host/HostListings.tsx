import React from 'react';
import { Table, Button, Typography, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { path } from '@/utils/constant';
import { apiGetApartmentByUser } from '@/apis';

const { Title } = Typography;

const RentalListPage: React.FC = () => {
   const navigate = useNavigate();

   const navigateToCreateApartment = () => {
      navigate(`${path.HOST_ROOT}${path.CREATE_APARTMENT}`);
   };

   const { data, isLoading } = useQuery({
      queryKey: ['rentals'],
      queryFn: apiGetApartmentByUser,
   });

   const handleViewDetails = (id: string) => {
      navigate(`${path.HOST_ROOT}apartment-rooms/${id}`);
   };

   const columns = [
      {
         title: 'No.',
         key: 'index',
         render: (_, __, index: number) => index + 1,
         width: '5%',
      },
      {
         title: 'Title',
         dataIndex: 'title',
         key: 'title',
         width: '25%',
      },
      {
         title: 'Location',
         dataIndex: 'location',
         key: 'location',
         width: '40%',
      },
      {
         title: 'Rooms',
         dataIndex: 'rooms',
         key: 'rooms',
         width: '10%',
      },
      {
         title: 'Actions',
         key: 'actions',
         render: (_, record) => (
            <Space>
               <Button
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleViewDetails(record.key)}
               >
                  View Details
               </Button>
            </Space>
         ),
         width: '20%',
      },
   ];

   const dataSource = (data?.data || []).map((apartment) => ({
      key: apartment._id,
      title: apartment.title,
      location: `${apartment.location.street}, ${apartment.location.ward}, ${apartment.location.district}, ${apartment.location.province}`,
      rooms: apartment.rooms.length,
   }));

   return (
      <div className="bg-gray-100">
         <div className="max-w-main w-full mx-auto p-6  min-h-screen">
            <div className="flex justify-between items-center mb-6">
               <Title level={2} className="text-gray-800">
                  Rental Listings
               </Title>
               <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  type="primary"
                  onClick={navigateToCreateApartment}
               >
                  Create New Apartment
               </Button>
            </div>
            <Divider className="my-4" />
            <Table
               columns={columns}
               loading={isLoading}
               dataSource={dataSource}
               rowKey="key"
               pagination={{ pageSize: 10 }}
               className="bg-white rounded-lg shadow-md"
            />
         </div>
      </div>
   );
};

export default RentalListPage;
