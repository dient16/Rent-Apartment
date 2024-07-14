import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, Tooltip } from 'antd';
import { FaUser, FaCalendarAlt, FaMoon, FaBed } from 'react-icons/fa';
import dayjs from 'dayjs';
import moment from 'moment';

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
      <div className="sticky top-[70px] left-0 right-0 z-50 px-2 py-1 bg-white border-b border-t">
         <div className="flex items-center justify-between max-w-6xl mx-auto">
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
                     <div className="flex items-center space-x-2 text-sm text-black w-1/2">
                        <FaCalendarAlt />
                        <DatePicker.RangePicker
                           format="DD MMM YYYY"
                           className="w-full py-1 rounded-lg cursor-pointer font-main border border-gray-300 max-w-[250px]"
                           inputReadOnly={true}
                           superNextIcon={null}
                           superPrevIcon={null}
                           placeholder={['Check in', 'Check out']}
                           popupClassName="rounded-full"
                           variant="borderless"
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
            <div className="flex items-center space-x-2 text-sm text-black">
               <div className="flex items-center space-x-1.5">
                  <FaMoon />
                  <span>{numberOfNights}</span>
                  <span className="hidden md:inline">nights</span>
               </div>
               <span className="text-3xl font-thin">|</span>
               <div className="flex items-center space-x-1.5">
                  <FaUser />
                  <span>{numberOfGuest}</span>
                  <span className="hidden md:inline">guests/room</span>
               </div>
               <span className="text-3xl font-thin">|</span>
               <div className="flex items-center space-x-1.5">
                  <FaBed />
                  <span>{totalRoomCount}</span>
                  <span className="hidden md:inline">rooms</span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SearchInfoBar;
