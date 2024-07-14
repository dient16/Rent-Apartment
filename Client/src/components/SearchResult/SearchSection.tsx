import { Button, DatePicker, Dropdown, Input, Tooltip } from 'antd';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import icons from '@/utils/icons';
import { DropDownItem } from '@/components';
const { PiUserThin } = icons;
interface SearchSectionProps {
   searchParams: URLSearchParams;
   handleSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
   searchParams,
   handleSearch,
}) => {
   const {
      control,
      formState: { errors },
      getValues,
   } = useFormContext();

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
                  render={({ field }) => (
                     <Tooltip
                        title={errors?.searchText?.message as string}
                        color="red"
                        open={!!errors.searchText}
                        placement="right"
                        zIndex={5}
                     >
                        <Input
                           size="large"
                           placeholder="Search"
                           className="py-3 px-5 w-full rounded-xl border"
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
                  defaultValue={
                     startDate && endDate
                        ? [dayjs(startDate), dayjs(endDate)]
                        : undefined
                  }
                  render={({ field }) => (
                     <Tooltip
                        title={errors?.searchDate?.message as string}
                        color="red"
                        open={!!errors.searchDate}
                        placement="right"
                        zIndex={5}
                     >
                        <DatePicker.RangePicker
                           format="DD-MM-YYYY"
                           className="py-3 px-2 mt-2 w-full rounded-xl font-main"
                           inputReadOnly={true}
                           superNextIcon={null}
                           superPrevIcon={null}
                           placeholder={['Check in', 'Check out']}
                           popupClassName="show-card-md rounded-full"
                           {...field}
                           onChange={(dates) => field.onChange(dates)}
                           disabledDate={(current) =>
                              current && current < dayjs().startOf('day')
                           }
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
                  render={({ field }) => (
                     <Tooltip
                        title={errors?.searchGuest?.message as string}
                        color="red"
                        open={!!errors.searchGuest}
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
