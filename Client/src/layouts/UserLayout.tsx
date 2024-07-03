import { Footer, Header } from '@/components';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const UserLayout: React.FC = () => {
   const location = useLocation();

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [location]);

   return (
      <div className="flex z-50 flex-col justify-center items-center w-full font-main">
         <Header />
         <div className="w-full">
            <Outlet />
         </div>
         <Footer />
      </div>
   );
};

export default UserLayout;
