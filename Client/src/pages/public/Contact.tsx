import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from 'antd';
import {
   MailOutlined,
   PhoneOutlined,
   EnvironmentOutlined,
} from '@ant-design/icons';
import { InputField } from '@/components';
import booking from '@/assets/booking.jpg';

const ContactPage: React.FC = () => {
   const methods = useForm({
      defaultValues: {
         name: '',
         email: '',
         message: '',
      },
   });

   const onSubmit = (data) => {
      console.log(data);
   };

   return (
      <FormProvider {...methods}>
         <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
            <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
               <div className="w-full md:w-1/2 p-8">
                  <h2 className="text-3xl font-bold text-blue-600">
                     Get In Touch
                  </h2>
                  <p className="mt-2 text-gray-600">
                     We are here for you! How can we help?
                  </p>
                  <form
                     onSubmit={methods.handleSubmit(onSubmit)}
                     className="mt-8 space-y-4"
                  >
                     <InputField
                        name="name"
                        label="Name"
                        rules={{ required: 'Name is required' }}
                        type="text"
                        className="w-full"
                     />
                     <InputField
                        name="email"
                        label="Email"
                        rules={{
                           required: 'Email is required',
                           pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email address',
                           },
                        }}
                        type="text"
                        className="w-full"
                     />
                     <InputField
                        name="message"
                        label="Message"
                        rules={{ required: 'Message is required' }}
                        type="textarea"
                        rows={4}
                        className="w-full"
                     />
                     <Button
                        type="primary"
                        className="w-full bg-blue-500"
                        size="large"
                        htmlType="submit"
                     >
                        Submit
                     </Button>
                  </form>
               </div>
               <div className="w-full md:w-1/2 bg-blue-50 flex flex-col items-center justify-center p-2">
                  <img
                     src={booking}
                     alt="Contact illustration"
                     className="mb-8 rounded-md"
                  />
                  <div className="space-y-4">
                     <div className="flex items-center text-gray-600">
                        <EnvironmentOutlined className="text-blue-600 text-xl mr-2" />
                        <span>Quận 12, TP. Hồ Chí Minh, Việt Nam</span>
                     </div>
                     <div className="flex items-center text-gray-600">
                        <PhoneOutlined className="text-blue-600 text-xl mr-2" />
                        <span>+84 123-456-789</span>
                     </div>
                     <div className="flex items-center text-gray-600">
                        <MailOutlined className="text-blue-600 text-xl mr-2" />
                        <span>example@mail.com</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </FormProvider>
   );
};

export default ContactPage;
