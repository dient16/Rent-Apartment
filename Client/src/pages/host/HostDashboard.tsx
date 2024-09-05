import React from 'react';
import {
   Tabs,
   Typography,
   List,
   Avatar,
   Button,
   Tag,
   Statistic,
   Card,
   Row,
   Col,
   Spin,
   message,
} from 'antd';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   apiGetUserBookings,
   apiGetApartmentByUser,
   apiConfirmBooking,
} from '@/apis';
import { FaBed, FaCalendarDay } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const { Title } = Typography;
const getTagColor = (status) => {
   switch (status) {
      case 'pending':
         return 'yellow';
      case 'confirmed':
         return 'green';
      case 'canceled':
         return 'red';
      case 'completed':
         return 'blue';
      default:
         return 'gray';
   }
};
const HostDashboard: React.FC = () => {
   const queryClient = useQueryClient();
   const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
      queryKey: ['bookings-host'],
      queryFn: apiGetUserBookings,
   });

   const { data: apartmentsData, isLoading: apartmentsLoading } = useQuery({
      queryKey: ['apartments-host'],
      queryFn: apiGetApartmentByUser,
   });

   const mutation = useMutation({
      mutationFn: apiConfirmBooking,
      onSuccess: (response) => {
         if (response.success) {
            queryClient.invalidateQueries({
               queryKey: ['bookings-host'],
            });
            message.success('Booking confirmed successfully.');
         } else message.error('Error confirming the booking.');
      },
      onError: () => {
         message.error('Error confirming the booking.');
      },
   });

   const bookings = bookingsData?.data || [];
   const apartments = apartmentsData?.data || [];

   const financialOverview = {
      totalRevenue: 0,
      totalBookings: bookings.length,
      pendingPayouts: 0,
   };

   const handleConfirmBooking = (bookingId: string) => {
      mutation.mutate(bookingId);
   };

   const renderBookingList = (status: string) => (
      <List
         itemLayout="horizontal"
         dataSource={bookings?.filter((booking) => booking.status === status)}
         renderItem={(booking: any) => (
            <List.Item
               actions={
                  status === 'pending'
                     ? [
                          <Button
                             type="primary"
                             className="bg-blue-500"
                             onClick={() => handleConfirmBooking(booking?._id)}
                             loading={mutation.isPending}
                          >
                             Confirm
                          </Button>,
                       ]
                     : []
               }
            >
               <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#87d068' }} />}
                  title={
                     <Link to={`/reservation/${booking?._id}`}>
                        {booking?.firstname} {booking?.lastname}
                     </Link>
                  }
                  description={
                     <div className="space-y-1">
                        <p className="flex items-center text-sm text-gray-700">
                           <FaBed className="mr-2 text-blue-600" /> Room
                           Numbers:{' '}
                           {booking?.rooms
                              .map((room) => room?.roomNumber)
                              .join(', ')}
                        </p>
                        <p className="flex items-center text-sm text-gray-700">
                           <MdLocationOn className="mr-2 text-green-600" />{' '}
                           Check-In:{' '}
                           {new Date(booking?.checkInTime).toLocaleDateString()}
                        </p>
                        <p className="flex items-center text-sm text-gray-700">
                           <FaCalendarDay className="mr-2 text-red-600" />{' '}
                           Check-Out:{' '}
                           {new Date(
                              booking?.checkOutTime,
                           ).toLocaleDateString()}
                        </p>
                        <p className="flex items-center text-lg font-medium text-gray-700">
                           Total Price:{' '}
                           {booking?.totalPrice?.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                           })}
                        </p>
                     </div>
                  }
               />
               <Tag color={getTagColor(booking?.status)}>{booking?.status}</Tag>
            </List.Item>
         )}
      />
   );

   return (
      <div className="container mx-auto p-6">
         <Title level={2} className="mb-6 text-center">
            Host Dashboard
         </Title>

         <Spin spinning={bookingsLoading || apartmentsLoading} tip="Loading...">
            <Row gutter={16} className="mb-6">
               <Col span={8}>
                  <Card>
                     <Statistic
                        title="Total Revenue"
                        value={financialOverview.totalRevenue.toLocaleString(
                           'vi-VN',
                           { style: 'currency', currency: 'VND' },
                        )}
                     />
                  </Card>
               </Col>
               <Col span={8}>
                  <Card>
                     <Statistic
                        title="Total Bookings"
                        value={financialOverview?.totalBookings}
                     />
                  </Card>
               </Col>
               <Col span={8}>
                  <Card>
                     <Statistic
                        title="Pending Payouts"
                        value={financialOverview.pendingPayouts.toLocaleString(
                           'vi-VN',
                           { style: 'currency', currency: 'VND' },
                        )}
                     />
                  </Card>
               </Col>
            </Row>

            <Tabs
               defaultActiveKey="1"
               className="mb-6"
               items={[
                  {
                     label: 'Pending',
                     key: '1',
                     children: renderBookingList('pending'),
                  },
                  {
                     label: 'Confirmed',
                     key: '2',
                     children: renderBookingList('confirmed'),
                  },
                  {
                     label: 'Canceled',
                     key: '3',
                     children: renderBookingList('canceled'),
                  },
                  {
                     label: 'Completed',
                     key: '4',
                     children: renderBookingList('completed'),
                  },
               ]}
            />

            <Title level={3} className="mt-6 mb-4 text-center">
               Apartment Management
            </Title>
            <Row gutter={16}>
               {apartments.map((apartment) => (
                  <Col span={8} key={apartment._id}>
                     <Card title={apartment.title}>
                        <p className="flex items-center">
                           <MdLocationOn className="mr-2" /> Location:{' '}
                           {apartment.location.province}, Vietnam
                        </p>
                        <p>Rooms: {apartment.rooms.length}</p>
                        <Button type="link">
                           <Link to={`/host/apartment-rooms/${apartment._id}`}>
                              View Details
                           </Link>
                        </Button>
                     </Card>
                  </Col>
               ))}
            </Row>
         </Spin>
      </div>
   );
};

export default HostDashboard;
