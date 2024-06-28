import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
// import AdminHeader from '@/components/AdminHeader';

const AdminLayout: FC = () => {
   return (
      <div>
         {/* <AdminHeader /> */}
         <main>
            <Outlet />
         </main>
      </div>
   );
};

export default AdminLayout;
