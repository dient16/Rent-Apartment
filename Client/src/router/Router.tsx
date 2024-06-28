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
   // RentalListPage,
   // RoomDetailsPage,
   // ApartmentRoomsPage,
} from '@/pages/public';
import { path } from '@/utils/constant';
import {
   CreateApartment,
   ManageAccount,
   MyFavorites,
   ManagerApartment,
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
         path: path.CREATE_APARTMENT,
         element: <CreateApartment />,
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
      // {
      //    path: path.RENTAL_LIST,
      //    element: <RentalListPage />,
      // },
      // {
      //    path: path.ROOM_DETAILS,
      //    element: <RoomDetailsPage />,
      // },
      // {
      //    path: path.APARTMENT_ROOMS,
      //    element: <ApartmentRoomsPage />,
      // },
      // {
      //    path: path.ADMIN_DASHBOARD,
      //    element: <AdminDashboard />,
      // },
      // {
      //    path: path.USER_MANAGEMENT,
      //    element: <UserManagement />,
      // },
      // {
      //    path: path.REPORTS,
      //    element: <Reports />,
      // },
      {
         path: path.ACCOUNT_SETTINGS,
         element: <ManageAccount />,
         children: [
            {
               path: path.PERSONAL_INFORMATION,
               element: <PersonalInformation />,
            },
            {
               path: path.MANAGE_APARTMENT,
               element: <ManagerApartment />,
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
