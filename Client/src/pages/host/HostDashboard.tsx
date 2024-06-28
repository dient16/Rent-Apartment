import React from 'react';
import { Button, Typography, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const HostDashboard: React.FC = () => {
   return (
      <div className="container p-4 mx-auto">
         <div className="flex justify-between items-center mb-4">
            <Title level={2}>Đặt phòng/đặt chỗ của bạn</Title>
            <Link to="/all-reservations">
               <Text strong>Tất cả đặt phòng (0)</Text>
            </Link>
         </div>
         <div className="flex mb-4 space-x-4">
            <Button type="default" shape="round">
               Sắp trả phòng (0)
            </Button>
            <Button type="default" shape="round">
               Hiện đang đón tiếp (0)
            </Button>
            <Button type="default" shape="round">
               Sắp đến (0)
            </Button>
            <Button type="default" shape="round">
               Sắp tới (0)
            </Button>
            <Button type="default" shape="round">
               Đánh giá đang chờ xử lý (0)
            </Button>
         </div>
         <Divider />
         <div className="flex flex-col justify-center items-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 w-12 h-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M9 12h6m2 0a2 2 0 11-4 0 2 2 0 114 0zm-6 4a6 6 0 100-12 6 6 0 000 12zm12 0a6 6 0 100-12 6 6 0 000 12zM6 12a6 6 0 100-12 6 6 0 000 12z"
                  />
               </svg>
               <Text>
                  Bạn không có khách nào trả phòng vào hôm nay hoặc ngày mai.
               </Text>
            </div>
         </div>
      </div>
   );
};

export default HostDashboard;
