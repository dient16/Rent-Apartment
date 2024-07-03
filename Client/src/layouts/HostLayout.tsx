import React from 'react';
import { Outlet } from 'react-router-dom';
import HostHeader from '@/components/Header/HeaderHost';
import { Footer } from '@/components';

const HostLayout: React.FC = () => {
   return (
      <div className="flex flex-col justify-center items-center w-full font-main">
         <HostHeader />
         <div className="w-full min-h-screen">
            <Outlet />
         </div>
         <Footer />
      </div>
   );
};

export default HostLayout;
