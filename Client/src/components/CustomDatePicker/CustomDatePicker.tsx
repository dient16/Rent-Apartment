import React, { useState } from 'react';
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import { Button, Dropdown, Drawer } from 'antd';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
import { DownOutlined, CalendarOutlined } from '@ant-design/icons';

interface CustomDatePickerProps {
   value: [Date, Date];
   onChange: (value: [Date, Date]) => void;
   className?: string;
   isShowLeftIcon?: boolean;
   isShowRightIcon?: boolean;
   isShowNight?: boolean;
   format?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
   value,
   onChange,
   className,
   isShowLeftIcon = true,
   isShowRightIcon = true,
   isShowNight = true,
   format = 'DD MMM',
}) => {
   const [drawerVisible, setDrawerVisible] = useState(false);
   const [dates, setDates] = useState<[Date, Date]>(value);

   const handleDateChange = (ranges: RangeKeyDict) => {
      const selection = ranges.selection as Range;
      const newStartDate = selection.startDate as Date;
      const newEndDate = selection.endDate as Date;
      setDates([newStartDate, newEndDate]);
   };

   const handleConfirm = () => {
      onChange(dates);
      setDrawerVisible(false);
   };

   const getNightCount = (startDate: Date, endDate: Date) => {
      return moment(endDate).diff(moment(startDate), 'days');
   };

   const dateRangePicker = (
      <div className="h-full flex flex-col justify-between">
         <DateRangePicker
            ranges={[
               {
                  startDate: dates[0],
                  endDate: dates[1],
                  key: 'selection',
               },
            ]}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={window.innerWidth <= 425 ? 1 : 2}
            direction="horizontal"
            className="custom-datepicker"
            staticRanges={[]}
            inputRanges={[]}
         />
         <div className="flex justify-between items-center mt-4 pt-5 border-t bg-white">
            <div className="flex flex-col">
               <span className="text-sm text-gray-500">Check-in</span>
               <span className="text-blue-600">
                  {moment(dates[0]).format('dddd, MMM D, YYYY')}
               </span>
            </div>
            <div className="flex flex-col">
               <span className="text-sm text-gray-500">Check-out</span>
               <span className="text-blue-600">
                  {moment(dates[1]).format('dddd, MMM D, YYYY')}
               </span>
            </div>
            <Button
               className="bg-blue-500"
               type="primary"
               onClick={handleConfirm}
            >
               Confirm
            </Button>
         </div>
      </div>
   );

   return (
      <>
         <div className="block lg:hidden">
            <Button
               className={`my-2 flex gap-1 justify-center items-center w-full bg-white rounded-xl font-main h-[48px] ${className}`}
               onClick={() => setDrawerVisible(true)}
            >
               {isShowLeftIcon && <CalendarOutlined className="mr-2" />}
               {`${moment(value[0]).format(format)} - ${moment(value[1]).format(
                  format,
               )}${
                  isShowNight
                     ? `, ${getNightCount(value[0], value[1])} nights`
                     : ''
               }`}
               {isShowRightIcon && <DownOutlined className="ml-2" />}
            </Button>
            <Drawer
               title="Select Dates"
               placement="bottom"
               onClose={() => setDrawerVisible(false)}
               open={drawerVisible}
               height="100%"
               zIndex={1000}
            >
               {dateRangePicker}
            </Drawer>
         </div>
         <div className="hidden lg:block">
            <Dropdown
               dropdownRender={() => dateRangePicker}
               trigger={['click']}
               placement="bottomLeft"
            >
               <Button
                  className={`my-2 flex gap-1 justify-center items-center w-full bg-white rounded-xl font-main h-[48px] ${className}`}
               >
                  {isShowLeftIcon && <CalendarOutlined className="mr-2" />}
                  {`${moment(value[0]).format(format)} - ${moment(
                     value[1],
                  ).format(format)}${
                     isShowNight
                        ? `, ${getNightCount(value[0], value[1])} nights`
                        : ''
                  }`}
                  {isShowRightIcon && <DownOutlined className="ml-2" />}
               </Button>
            </Dropdown>
         </div>
      </>
   );
};

export default CustomDatePicker;
