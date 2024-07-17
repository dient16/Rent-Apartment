import React from 'react';
import moment from 'moment';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { AiOutlineClockCircle } from 'react-icons/ai';

interface SummaryCardProps {
   searchParams: URLSearchParams;
   onClick: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ searchParams, onClick }) => {
   const startDate = searchParams.get('startDate');
   const endDate = searchParams.get('endDate');
   const numberOfGuests = searchParams.get('numberOfGuest');
   const numberOfRooms = searchParams.get('roomNumber');
   const province = searchParams.get('province');

   const formattedStartDate = startDate
      ? moment(startDate).format('DD MMM')
      : '';
   const formattedEndDate = endDate ? moment(endDate).format('DD MMM') : '';
   const nights =
      startDate && endDate
         ? moment(endDate).diff(moment(startDate), 'days')
         : 0;

   return (
      <div
         className="w-full bg-white py-3 px-4 md:px-10 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors md:hover:bg-gray-200 md:shadow-sm md:hover:shadow-md"
         onClick={onClick}
      >
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-8 w-full">
            <div className="flex items-center gap-2">
               <FaMapMarkerAlt className="text-gray-500" />
               <span className="text-sm font-normal md:text-base">
                  {province || 'Location'}
               </span>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 md:ml-4 md:mt-0">
                  <FiCalendar className="text-gray-500" />
                  <span className="text-sm md:text-base font-light">
                     {formattedStartDate} - {formattedEndDate}
                  </span>
               </div>
               <div className="flex items-center gap-2 md:mt-0">
                  <AiOutlineClockCircle className="text-gray-500" />
                  <span className="text-sm md:text-base font-light">
                     {nights} nights
                  </span>
               </div>
            </div>
            <div className="flex items-center gap-2 md:mt-0">
               <FiUser className="text-gray-500" />
               <span className="text-sm md:text-base font-light">
                  {numberOfGuests} guests, {numberOfRooms} rooms
               </span>
            </div>
         </div>
      </div>
   );
};

export default SummaryCard;
