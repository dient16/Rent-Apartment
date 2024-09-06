import React from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import icons from '@/utils/icons';
import {
   CustomDatePicker,
   DropDownItem,
   AutoCompleteAddress,
} from '@/components';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineBedroomParent } from 'react-icons/md';
const { PiUserThin, FaArrowRight } = icons;

const Search: React.FC = () => {
   const {
      handleSubmit,
      formState: { errors },
      control,
      setValue,
      getValues,
   } = useForm();
   const navigate = useNavigate();
   const isMobileSmall = useMediaQuery({ query: '(max-width: 350px)' });
   const isTablet = useMediaQuery({
      query: '(min-width: 768px) and (max-width: 870px)',
   });
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
         className="grid gap-3 grid-cols-1 justify-between items-center md:flex md:py-4 py-2 px-5 w-full bg-white rounded-3xl border lg:px-10 lg:rounded-full lg:shadow-lg font-main max-w-[960px] min-h-[50px] mt-[30px] shadow-card-sm"
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
                        className="py-0.5 text-lg bg-transparent outline-none lg:py-1"
                        value={field.value}
                        onChange={(e) => {
                           field.onChange(e.target.value);
                        }}
                     />
                     <AutoCompleteAddress
                        value={field.value}
                        onChange={field.onChange}
                        setValue={setValue}
                     />
                  </div>
               </Tooltip>
            )}
         />
         <hr className="hidden md:block border-gray-300 h-[50px] w-0 border-r m-0 p-0" />
         <Controller
            name="searchDate"
            control={control}
            rules={{
               required: 'Please select the time',
            }}
            defaultValue={[moment().toDate(), moment().add(1, 'days').toDate()]}
            render={({ field }) => (
               <Tooltip
                  title={errors?.searchDate?.message as string}
                  color="red"
                  placement="bottom"
                  open={!!errors.searchDate}
                  zIndex={5}
               >
                  <div className="text-black min-w-[200px] w-full sm:w-auto">
                     <CustomDatePicker
                        value={field.value}
                        onChange={(dates) => field.onChange(dates)}
                        className="text-lg"
                        format={
                           isMobileSmall || isTablet ? 'DD MMM' : 'DD-MM-YYYY'
                        }
                        variant="label"
                        minDate={new Date()}
                     />
                  </div>
               </Tooltip>
            )}
         />
         <hr className="hidden md:block border-gray-300 h-[50px] w-0 border-r m-0 p-0" />
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
                        <div className="flex gap-1 justify-start items-center text-lg text-black cursor-pointer lg:py-1 font-main">
                           {isTablet ? (
                              <div className="flex items-center gap-2">
                                 <div className="flex items-center gap-1">
                                    <PiUserThin size={20} />
                                    <span>
                                       {getValues('searchGuest')?.guests || 1}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <MdOutlineBedroomParent size={18} />
                                    <span>
                                       {getValues('searchGuest')?.rooms || 1}
                                    </span>
                                 </div>
                              </div>
                           ) : (
                              <>
                                 <PiUserThin size={20} />
                                 <span>{`${
                                    getValues('searchGuest')?.guests || 1
                                 } adult · ${
                                    getValues('searchGuest')?.rooms || 1
                                 } rooms`}</span>
                              </>
                           )}
                        </div>
                     </Dropdown>
                  </div>
               </Tooltip>
            )}
         />

         <Button
            className="md:flex justify-center items-center bg-blue-500 text-white font-main hidden"
            shape="circle"
            type="primary"
            icon={<FaArrowRight size={24} />}
            htmlType="submit"
            style={{ width: '48px', height: '48px', lineHeight: '48px' }}
         />
         <Button
            className="flex justify-center items-center bg-blue-500 text-white font-main w-full md:hidden"
            type="primary"
            icon={<FaSearch />}
            htmlType="submit"
            style={{ height: '40px', lineHeight: '40px' }}
         >
            Search
         </Button>
      </form>
   );
};

export default Search;
