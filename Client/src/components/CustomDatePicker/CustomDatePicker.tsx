import React, { useState } from 'react';
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import { Button, Dropdown, Collapse } from 'antd';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
import { DownOutlined, CalendarOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { Panel } = Collapse;

interface DatePickerDropdownProps {
   initialStartDate: Date;
   initialEndDate: Date;
   className?: string;
}

const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
   initialStartDate,
   initialEndDate,
   className,
}) => {
   const [startDate, setStartDate] = useState<Date>(initialStartDate);
   const [endDate, setEndDate] = useState<Date>(initialEndDate);

   const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });

   const handleDateChange = (ranges: RangeKeyDict) => {
      const selection = ranges.selection as Range;
      setStartDate(selection.startDate as Date);
      setEndDate(selection.endDate as Date);
   };

   const getNightCount = (startDate: Date, endDate: Date) => {
      return moment(endDate).diff(moment(startDate), 'days');
   };

   const dateRangePicker = (
      <div>
         <DateRangePicker
            ranges={[
               {
                  startDate: startDate,
                  endDate: endDate,
                  key: 'selection',
               },
            ]}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={isTabletOrMobile ? 1 : 2}
            direction="horizontal"
            className="custom-datepicker"
            staticRanges={[]}
            inputRanges={[]}
         />
      </div>
   );

   return isTabletOrMobile ? (
      <Collapse ghost expandIcon={() => null}>
         <Panel
            header={
               <Button
                  className={`my-2 flex gap-1 justify-center items-center w-full bg-white rounded-xl font-main h-[48px] ${className}`}
               >
                  <CalendarOutlined className="mr-2" />
                  {`${moment(startDate).format('DD MMM')} - ${moment(endDate).format('DD MMM')}, ${getNightCount(startDate, endDate)} đêm`}
                  <DownOutlined className="ml-2" />
               </Button>
            }
            key="1"
            className="custom-collapse-panel"
         >
            {dateRangePicker}
         </Panel>
      </Collapse>
   ) : (
      <Dropdown
         dropdownRender={() => dateRangePicker}
         trigger={['click']}
         placement="bottomLeft"
      >
         <Button
            className={`my-2 flex gap-1 justify-center items-center w-full bg-white rounded-xl font-main h-[48px] ${className}`}
         >
            <CalendarOutlined className="mr-2" />
            {`${moment(startDate).format('DD MMM')} - ${moment(endDate).format('DD MMM')}, ${getNightCount(startDate, endDate)} đêm`}
            <DownOutlined className="ml-2" />
         </Button>
      </Dropdown>
   );
};

export default DatePickerDropdown;
