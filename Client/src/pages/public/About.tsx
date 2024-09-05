import React from 'react';
import { Button, Typography, Card } from 'antd';
import { PhoneOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
   return (
      <div className="container mx-auto p-6 lg:p-12">
         <div className="text-center mb-8">
            <Title
               level={1}
               className="text-3xl md:text-4xl font-bold mb-2 text-gray-800"
            >
               About Us
            </Title>
            <Paragraph className="text-md md:text-lg text-gray-600">
               Discover more about our mission, vision, and the team behind our
               hotel and homestay booking platform.
            </Paragraph>
         </div>
         <div className="mb-10">
            <Title
               level={2}
               className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800"
            >
               Our Mission
            </Title>
            <Paragraph className="text-md md:text-lg text-gray-700">
               At Find House, our mission is to provide exceptional travel
               experiences by offering a seamless booking process for hotels and
               homestays. We are dedicated to ensuring comfort and satisfaction
               for our guests, whether they are traveling for business or
               leisure.
            </Paragraph>
         </div>
         <div className="mb-10">
            <Title
               level={2}
               className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800"
            >
               Company Information
            </Title>
            <Card className="bg-gray-50 border border-gray-200 p-4 shadow-lg">
               <Title
                  level={3}
                  className="text-xl md:text-2xl font-bold mb-2 text-gray-800"
               >
                  Find House
               </Title>
               <Paragraph className="text-md md:text-lg text-gray-700">
                  Address: 123 Đường Elm, Quận 1, TP. Hồ Chí Minh, Việt Nam
               </Paragraph>
               <Paragraph className="text-md md:text-lg text-gray-700">
                  Founded in [Year], we have been committed to providing the
                  best booking experiences for travelers worldwide.
               </Paragraph>
            </Card>
         </div>

         <div className="mb-10">
            <Title
               level={2}
               className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800"
            >
               Contact Us
            </Title>
            <div className="flex flex-col space-y-4">
               <div className="flex items-center">
                  <PhoneOutlined className="text-blue-500 text-2xl mr-3" />
                  <Paragraph className="text-md md:text-lg text-gray-700">
                     +84 123 456 789
                  </Paragraph>
               </div>
               <div className="flex items-center">
                  <MailOutlined className="text-blue-500 text-2xl mr-3" />
                  <Paragraph className="text-md md:text-lg text-gray-700">
                     info@yourcompany.com
                  </Paragraph>
               </div>
               <div className="flex items-center">
                  <GlobalOutlined className="text-blue-500 text-2xl mr-3" />
                  <Paragraph className="text-md md:text-lg text-gray-700">
                     www.yourcompany.com
                  </Paragraph>
               </div>
            </div>
         </div>

         <div className="text-center">
            <Button
               type="primary"
               size="large"
               className="bg-blue-500 hover:bg-blue-600 text-white"
            >
               Learn More
            </Button>
         </div>
      </div>
   );
};

export default AboutPage;
