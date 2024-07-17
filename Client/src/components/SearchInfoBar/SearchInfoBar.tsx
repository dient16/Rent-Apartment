import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Tooltip } from 'antd';
import { FaUser, FaMoon, FaBed } from 'react-icons/fa';
import { CustomDatePicker } from '@/components';

interface SearchInfoBarProps {
   numberOfGuest: number;
   totalRoomCount: number;
   numberOfNights: number;
   startDate: Date;
   endDate: Date;
   handleDateChange: (dates: Date[]) => void;
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
      <div className="sticky lg:top-[70px] top-[60px] left-0 right-0 z-50 px-2 py-1 bg-white border-b border-t">
         <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Controller
               name="searchDate"
               control={control}
               defaultValue={[startDate, endDate]}
               render={({ field, fieldState }) => (
                  <Tooltip
                     title={fieldState.error?.message}
                     color="red"
                     open={!!fieldState.error}
                     placement="bottom"
                  >
                     <div className="flex items-center space-x-2 text-sm text-black w-1/2">
                        <CustomDatePicker
                           value={field.value}
                           onChange={(dates) => {
                              field.onChange(dates);
                              handleDateChange(dates);
                           }}
                           isShowRightIcon={false}
                           isShowNight={false}
                           className="max-w-[250px] border-none outline-none h-[20px]"
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
