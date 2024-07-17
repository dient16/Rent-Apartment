import React from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import icons from '@/utils/icons';
import { CustomDatePicker, DropDownItem } from '@/components';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
const { PiUserThin, FaArrowRight } = icons;

const Search: React.FC = () => {
   const {
      handleSubmit,
      formState: { errors },
      control,
      getValues,
   } = useForm();
   const navigate = useNavigate();

   const handleSearch = (data: SearchData) => {
      const queryParams = new URLSearchParams({
         province: data.searchText,
         startDate: moment(data.searchDate[0]).format('YYYY-MM-DD'),
         endDate: moment(data.searchDate[1]).format('YYYY-MM-DD'),
         numberOfGuest: data.searchGuest.guests.toString(),
         roomNumber: data.searchGuest.rooms.toString(),
      });
      navigate(`/listing?${queryParams.toString()}`);
   };
   return (
      <form
         onSubmit={handleSubmit(handleSearch)}
         className="flex flex-wrap justify-between items-center py-4 px-5 w-full bg-white rounded-3xl border lg:px-10 lg:rounded-full lg:shadow-lg font-main max-w-[960px] min-h-[50px] mt-[30px] shadow-card-sm"
      >
         <Controller
            control={control}
            name="searchText"
            rules={{
               required: 'Please enter a destination',
            }}
            defaultValue=""
            render={({ field }) => (
               <Tooltip
                  title={errors?.searchText?.message as string}
                  color="red"
                  open={!!errors.searchText}
                  placement="bottom"
                  zIndex={5}
               >
                  <div className="flex flex-col ml-3 text-black w-[200px]">
                     <span className="text-base font-medium">Where</span>
                     <input
                        placeholder="Where are you going?"
                        className="py-0.5 text-lg bg-transparent outline-none lg:py-2"
                        {...field}
                     />
                  </div>
               </Tooltip>
            )}
         />
         <div className="hidden border-r border-gray-300 lg:block h-[50px]"></div>
         <Controller
            name="searchDate"
            control={control}
            rules={{
               required: 'Please select the time',
            }}
            defaultValue={[new Date(), new Date()]}
            render={({ field }) => (
               <Tooltip
                  title={errors?.searchDate?.message as string}
                  color="red"
                  placement="bottom"
                  open={!!errors.searchDate}
                  zIndex={5}
               >
                  <div className="flex flex-col text-black min-w-[200px] max-w-[300px] search-home">
                     <div className="flex items-center ml-3 text-base font-medium">
                        <span>Check-in</span>
                        <span className="ml-16 lg:ml-20">Check-out</span>
                     </div>
                     <CustomDatePicker
                        value={field.value}
                        onChange={(dates) => field.onChange(dates)}
                        className="text-lg border-none shadow-none outline-none font-main h-5"
                        isShowNight={false}
                        isShowLeftIcon={false}
                        isShowRightIcon={false}
                        format="DD-MM-YYYY"
                     />
                  </div>
               </Tooltip>
            )}
         />
         <div className="hidden border-r border-gray-300 lg:block h-[50px]"></div>
         <Controller
            name="searchGuest"
            control={control}
            rules={{
               required: 'Date is required',
            }}
            defaultValue={{ guests: 1, rooms: 1 }}
            render={({ field }) => (
               <Tooltip
                  title={errors?.searchGuest?.message as string}
                  color="red"
                  placement="bottom"
                  open={!!errors.searchGuest}
               >
                  <div className="flex flex-col ml-3 text-black">
                     <span className="text-base font-medium">Guest</span>
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
                        <div className="flex gap-1 justify-center items-center text-lg text-black cursor-pointer lg:py-2 font-main">
                           <PiUserThin size={25} />
                           <span>{`${
                              getValues('searchGuest')?.guests || 1
                           } adult · ${
                              getValues('searchGuest')?.rooms || 1
                           } rooms`}</span>
                        </div>
                     </Dropdown>
                  </div>
               </Tooltip>
            )}
         />

         <Button
            className="flex justify-center items-center bg-blue-500 font-main"
            shape="circle"
            type="primary"
            icon={<FaArrowRight size={30} />}
            htmlType="submit"
            style={{ width: '57px', height: '57px' }}
         />
      </form>
   );
};

export default Search;
