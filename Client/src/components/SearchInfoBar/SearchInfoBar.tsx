import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, Tooltip } from 'antd';
import { PiUserThin } from 'react-icons/pi';
import dayjs from 'dayjs';
import moment from 'moment';
import { FaUser, FaCalendarAlt, FaMoon } from 'react-icons/fa';

interface SearchInfoBarProps {
   numberOfGuest: number;
   totalRoomCount: number;
   numberOfNights: number;
   startDate: string;
   endDate: string;
   handleDateChange: (dates: dayjs.Dayjs[]) => void;
}

const SearchInfoBar: React.FC<SearchInfoBarProps> = ({
   numberOfGuest,
   totalRoomCount,
   numberOfNights,
   startDate,
   endDate,
   handleDateChange,
}) => {
   const { control } = useFormContext();

   return (
      <div className="sticky top-[70px] left-0 right-0 z-50 p-2 bg-white shadow-lg border-b">
         <div className="flex items-center justify-between max-w-6xl mx-auto space-x-6">
            <Controller
               name="searchDate"
               control={control}
               defaultValue={[dayjs(startDate), dayjs(endDate)]}
               render={({ field, fieldState }) => (
                  <Tooltip
                     title={fieldState.error?.message}
                     color="red"
                     open={!!fieldState.error}
                     placement="bottom"
                  >
                     <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <FaCalendarAlt />
                        <DatePicker.RangePicker
                           format="DD MMM YYYY"
                           className="py-1 rounded-lg cursor-pointer font-main border border-gray-300"
                           inputReadOnly={true}
                           superNextIcon={null}
                           superPrevIcon={null}
                           placeholder={['Check in', 'Check out']}
                           popupClassName="rounded-full"
                           {...field}
                           onChange={handleDateChange}
                           disabledDate={(current) =>
                              current && current < moment().startOf('day')
                           }
                        />
                     </div>
                  </Tooltip>
               )}
            />
            <div className="flex items-center space-x-2 text-sm text-blue-600">
               <FaMoon />
               <span>{numberOfNights} nights</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
               <FaUser />
               <span>{numberOfGuest} guests</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
               <PiUserThin />
               <span>{totalRoomCount} rooms</span>
            </div>
         </div>
      </div>
   );
};

export default SearchInfoBar;
