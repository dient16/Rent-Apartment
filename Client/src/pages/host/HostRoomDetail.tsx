import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { apiGetApartmentDetails } from '@/apis';
import { Card, Row, Col, Spin, Typography, Tag, Carousel } from 'antd';
import { FaBed } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const { Title, Text } = Typography;

const HostRoomDetail: React.FC = () => {
   const { apartmentId } = useParams();

   const { data: apartmentData, isLoading } = useQuery({
      queryKey: ['apartment', apartmentId],
      queryFn: () => apiGetApartmentDetails(apartmentId),
   });

   const apartment = apartmentData?.data;

   return (
      <div className="container mx-auto p-6">
         <Title level={2} className="mb-6 text-center">
            Apartment Details
         </Title>

         <Spin spinning={isLoading} tip="Loading...">
            {apartment && (
               <div>
                  <Card className="mb-6 shadow-lg">
                     <Title level={4}>{apartment.title}</Title>
                     <p className="flex items-center text-sm">
                        <MdLocationOn className="mr-2 text-red-500" /> Location:{' '}
                        {apartment.address.province}, Vietnam
                     </p>
                     <Text type="secondary">
                        Description: {apartment.description}
                     </Text>
                  </Card>

                  <Title level={4} className="mb-4">
                     Rooms
                  </Title>

                  <Row gutter={[16, 16]}>
                     {apartment.rooms.map((room) => (
                        <Col xs={24} sm={12} lg={8} key={room._id}>
                           <Card
                              hoverable
                              className="shadow-lg h-full flex flex-col"
                           >
                              <Carousel
                                 arrows
                                 swipeToSlide
                                 draggable
                                 autoplay
                                 className="rounded-lg overflow-hidden"
                              >
                                 {room.images.map((image, index) => (
                                    <div key={index}>
                                       <img
                                          src={image}
                                          alt={`Room ${room.roomNumber} image`}
                                          className="w-full h-48 object-cover rounded-lg"
                                       />
                                    </div>
                                 ))}
                              </Carousel>

                              <div className="flex-grow p-4">
                                 <p className="flex items-center text-base font-semibold">
                                    <FaBed className="mr-2 text-blue-600" />{' '}
                                    Room Number: {room.quantity}
                                 </p>
                                 <p>
                                    Max Occupancy: {room.numberOfGuest} guests
                                 </p>
                                 <p>
                                    Price:{' '}
                                    <span className="font-semibold text-green-600">
                                       {room.price.toLocaleString('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND',
                                       })}
                                    </span>{' '}
                                    per night
                                 </p>
                                 <div className="mt-2">
                                    <Tag color="blue">{room.bedType}</Tag>
                                    <br />
                                    {room.amenities.map((amenity) => (
                                       <Tag
                                          key={amenity._id}
                                          color="geekblue"
                                          className="mt-2"
                                       >
                                          {amenity.name}
                                       </Tag>
                                    ))}
                                 </div>
                              </div>
                           </Card>
                        </Col>
                     ))}
                  </Row>
               </div>
            )}
         </Spin>
      </div>
   );
};

export default HostRoomDetail;
