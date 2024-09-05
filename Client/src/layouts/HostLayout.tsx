import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components';
import { Footer } from '@/components';

const HostLayout: React.FC = () => {
   return (
      <div className="flex flex-col justify-center items-center w-full font-main">
         <Header isHost={true} />
         <div className="w-full min-h-screen">
            <Outlet />
         </div>
         <Footer />
      </div>
   );
};

export default HostLayout;
