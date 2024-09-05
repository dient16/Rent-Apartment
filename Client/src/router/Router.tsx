import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import {
   // AdminDashboard,
   // UserManagement,
   // Reports,
   HostDashboard,
   HostListings,
   HostBookings,
   HostProfile,
   HostCalendar,
   CreateApartment,
   HostMessage,
   HostRoomDetail,
} from '@/pages/host';
import {
   ApartmentDetail,
   Listing,
   Home,
   BookingConfirm,
   BookingCompletion,
   SetPassword,
   LoginSuccess,
   NotFound,
   Contact,
   About,
} from '@/pages/public';
import { path } from '@/utils/constant';
import {
   ManageAccount,
   MyFavorites,
   PersonalInformation,
   MyBooking,
   BookingDetail,
} from '@/pages/user';
import UserLayout from '@/layouts/UserLayout';
import HostLayout from '@/layouts/HostLayout';

const Router = () => {
   const userRoutes: RouteObject[] = [
      {
         path: path.HOME,
         element: <Home />,
      },
      {
         path: path.CONTACT,
         element: <Contact />,
      },
      {
         path: path.ABOUT,
         element: <About />,
      },
      {
         path: path.LISTING,
         element: <Listing />,
      },
      {
         path: path.FAVORITES,
         element: <MyFavorites />,
      },
      {
         path: path.APARTMENT_DETAIL,
         element: <ApartmentDetail />,
      },
      {
         path: path.BOOKING_CONFIRM,
         element: <BookingConfirm />,
      },
      {
         path: path.BOOKING_COMPLETION,
         element: <BookingCompletion />,
      },
      {
         path: path.SET_PASSWORD,
         element: <SetPassword />,
      },
      {
         path: path.SIGNIN_GOOGLE_SUCCESS,
         element: <LoginSuccess />,
      },
      {
         path: path.MY_BOOKING,
         element: <MyBooking />,
      },
      {
         path: path.BOOKING_DETAIL,
         element: <BookingDetail />,
      },

      {
         path: path.ACCOUNT_SETTINGS,
         element: <ManageAccount />,
         children: [
            {
               path: path.PERSONAL_INFORMATION,
               element: <PersonalInformation />,
            },
         ],
      },
      {
         path: path.ALL,
         element: <NotFound />,
      },
   ];

   const hostRoutes: RouteObject[] = [
      {
         path: path.HOST_DASHBOARD,
         element: <HostDashboard />,
      },
      {
         path: path.HOST_LISTINGS,
         element: <HostListings />,
      },
      {
         path: path.HOST_CALENDAR,
         element: <HostCalendar />,
      },
      {
         path: path.HOST_BOOKINGS,
         element: <HostBookings />,
      },
      {
         path: path.HOST_PROFILE,
         element: <HostProfile />,
      },
      {
         path: path.CREATE_APARTMENT,
         element: <CreateApartment />,
      },
      {
         path: path.HOST_MESSAGES,
         element: <HostMessage />,
      },
      {
         path: path.APARTMENT_ROOMS,
         element: <HostRoomDetail />,
      },
   ];

   const router = createBrowserRouter([
      {
         path: path.ROOT,
         element: <UserLayout />,
         children: userRoutes,
      },
      {
         path: path.HOST_ROOT,
         element: <HostLayout />,
         children: hostRoutes,
      },
      {
         path: path.ALL,
         element: <NotFound />,
      },
   ]);

   return router;
};

export default Router;
