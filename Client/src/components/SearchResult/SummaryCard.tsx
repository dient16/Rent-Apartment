import React from 'react';
import moment from 'moment';

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
         className="w-full bg-white p-4 rounded-lg shadow-md flex flex-row items-center justify-between gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
         onClick={onClick}
      >
         <span className="font-semibold">{province || 'Location'}</span>
         <span className="font-semibold">
            {formattedStartDate} - {formattedEndDate}
         </span>
         <span className="font-semibold">{nights} nights</span>
         <span className="font-semibold">
            {numberOfGuests} guests, {numberOfRooms} rooms
         </span>
      </div>
   );
};

export default SummaryCard;
