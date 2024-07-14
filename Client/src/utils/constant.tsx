import { RiHome4Line, RiContactsFill } from 'react-icons/ri';
import { GrFavorite } from 'react-icons/gr';

export const path: { [key: string]: string } = {
   ROOT: '/',
   HOME: '',
   ALL: '/*',
   LISTING: 'listing',
   ABOUT: 'about',
   APARTMENT_DETAIL: 'apartment/:apartmentId',
   FAVORITES: 'favorites',
   CONTACT: 'contact',
   BOOKING_CONFIRM: 'booking-confirm',
   BOOKING_COMPLETION: 'booking-completion/:bookingId',
   ACCOUNT_SETTINGS: 'account-settings',
   PERSONAL_INFORMATION: 'personal-information',
   SET_PASSWORD: 'set-password/:userId',
   SIGNIN_GOOGLE_SUCCESS: 'signin-success/:userId',
   MY_BOOKING: 'my-booking',
   BOOKING_DETAIL: 'my-booking/:bookingId',

   // path to admin
   ADMIN_DASHBOARD: 'admin/dashboard',
   USER_MANAGEMENT: 'admin/user-management',
   REPORTS: 'admin/reports',

   // path to host
   HOST_ROOT: '/host/',
   HOST_DASHBOARD: 'dashboard',
   HOST_CALENDAR: 'calendar',
   CREATE_APARTMENT: 'create-apartment',
   HOST_LISTINGS: 'listings',
   HOST_BOOKINGS: 'bookings',
   HOST_PROFILE: 'profile',
   RENTAL_LIST: '/rental-list',
   ROOM_DETAILS: '/room-details/:id',
   APARTMENT_ROOMS: '/apartment-rooms/:apartmentId',
};

export const navigates: {
   title: string;
   path: string;
   icon: React.ReactNode;
}[] = [
   { title: 'Home', path: path.HOME, icon: <RiHome4Line /> },
   { title: 'Contact', path: path.CONTACT, icon: <RiContactsFill /> },
   { title: 'About', path: path.ABOUT, icon: <GrFavorite /> },
];
