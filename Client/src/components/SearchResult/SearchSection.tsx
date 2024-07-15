import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, Dropdown, Input, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
import icons from '@/utils/icons';
import { DropDownItem, CustomDatePicker } from '@/components';
import moment from 'moment';
import type { RangeKeyDict } from 'react-date-range';

const { PiUserThin } = icons;

interface SearchSectionProps {
   searchParams: URLSearchParams;
   handleSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
   searchParams,
   handleSearch,
}) => {
   const { control, getValues } = useFormContext();

   const numberOfGuests: number =
      +searchParams.get('numberOfGuests') !== 0
         ? +searchParams.get('numberOfGuests') ?? 1
         : 1;
   const numberOfRooms: number =
      +searchParams.get('numberOfRooms') !== 0
         ? +searchParams.get('numberOfRooms') ?? 1
         : 1;
   const startDate: string | null = searchParams.get('startDate');
   const endDate: string | null = searchParams.get('endDate');

   const [state, setState] = useState({
      startDate: startDate ? moment(startDate).toDate() : new Date(),
      endDate: endDate
         ? moment(endDate).toDate()
         : moment().add(7, 'days').toDate(),
   });

   const handleDateChange = (ranges: RangeKeyDict) => {
      const { selection } = ranges;
      setState({
         startDate: selection.startDate,
         endDate: selection.endDate,
      });
   };

   return (
      <div className="py-5 pb-10 w-full rounded-lg">
         <div className="flex flex-col gap-2">
            <div className="mx-2 text-lg">Search</div>
            <form onSubmit={handleSearch}>
               <Controller
                  name="searchText"
                  rules={{
                     required: 'Please enter a destination',
                  }}
                  control={control}
                  defaultValue={searchParams.get('province')}
                  render={({ field, fieldState: { error } }) => (
                     <Tooltip
                        title={error?.message}
                        color="red"
                        open={!!error}
                        placement="right"
                        zIndex={5}
                     >
                        <Input
                           size="large"
                           placeholder="Search"
                           className="py-3 pl-10 pr-5 w-full rounded-xl border"
                           status={error ? 'error' : ''}
                           prefix={
                              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                           }
                           {...field}
                        />
                     </Tooltip>
                  )}
               />
               <Controller
                  name="searchDate"
                  control={control}
                  rules={{
                     required: 'Please select the time',
                  }}
                  defaultValue={[state.startDate, state.endDate]}
                  render={({ field, fieldState: { error } }) => (
                     <Tooltip
                        title={error?.message}
                        color="red"
                        open={!!error}
                        placement="right"
                        zIndex={5}
                     >
                        <CustomDatePicker
                           onChange={(ranges) => {
                              handleDateChange(ranges);
                              field.onChange([
                                 ranges.selection.startDate,
                                 ranges.selection.endDate,
                              ]);
                           }}
                           initialStartDate={state.startDate}
                           initialEndDate={state.endDate}
                           className="mt-2"
                        />
                     </Tooltip>
                  )}
               />
               <Controller
                  name="searchGuest"
                  control={control}
                  rules={{
                     required: 'Number of guests is required',
                  }}
                  defaultValue={{
                     guests: +numberOfGuests,
                     rooms: +numberOfRooms,
                  }}
                  render={({ field, fieldState: { error } }) => (
                     <Tooltip
                        title={error?.message}
                        color="red"
                        open={!!error}
                        placement="left"
                        zIndex={5}
                     >
                        <Dropdown
                           dropdownRender={() => (
                              <DropDownItem
                                 value={field.value}
                                 onChange={(value) => field.onChange(value)}
                              />
                           )}
                           placement="bottomLeft"
                           trigger={['click']}
                           getPopupContainer={(trigger) =>
                              trigger.parentElement!
                           }
                        >
                           <Button className="my-2 flex gap-1 justify-center items-center w-full bg-white rounded-xl font-main h-[48px]">
                              <PiUserThin size={25} />
                              <span className="">{`${getValues('searchGuest')?.guests ?? 1} adult · ${
                                 getValues('searchGuest')?.rooms ?? 1
                              } rooms`}</span>
                           </Button>
                        </Dropdown>
                     </Tooltip>
                  )}
               />
               <Button
                  className="px-5 w-full bg-blue-500 rounded-xl font-main h-[50px]"
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
               >
                  Search
               </Button>
            </form>
         </div>
      </div>
   );
};

export default SearchSection;
