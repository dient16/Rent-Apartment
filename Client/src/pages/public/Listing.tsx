import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
   SearchSection,
   FilterSection,
   Results,
   SummaryCard,
} from '@/components';
import { apiSearchRoom } from '@/apis';
import { Drawer } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';

const Listing: React.FC = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [drawerVisible, setDrawerVisible] = useState(false);

   const methods = useForm();

   const { data, isFetching } = useQuery({
      queryKey: ['listing', searchParams.toString()],
      queryFn: () => apiSearchRoom(searchParams.toString()),
      staleTime: 0,
   });

   const roomNumber: number =
      +searchParams.get('room') !== 0
         ? +searchParams.get('roomNumber') ?? 1
         : 1;
   const numberOfGuest: number =
      +searchParams.get('numberOfGuest') !== 0
         ? +searchParams.get('numberOfGuest') ?? 1
         : 1;

   const handleSearch = (data: any) => {
      const queryParams = new URLSearchParams({
         province: data.searchText,
         startDate: dayjs(data.searchDate[0]).format('YYYY-MM-DD'),
         endDate: dayjs(data.searchDate[1]).format('YYYY-MM-DD'),
         numberOfGuest: data.searchGuest.guest.toString(),
         roomNumber: data.searchGuest.room.toString(),
      });
      if (
         data.searchPrice &&
         data.searchPrice[0] !== undefined &&
         data.searchPrice[1] !== undefined
      ) {
         queryParams.set('minPrice', data.searchPrice[0].toString());
         queryParams.set('maxPrice', data.searchPrice[1].toString());
      }
      setSearchParams(queryParams);
      setDrawerVisible(false);
   };

   const handleChangePage = (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', page.toString());
      setSearchParams(newSearchParams);
   };

   return (
      <div className="flex flex-col justify-center items-center w-full font-main bg-gray-100">
         <div className="flex flex-col sm:flex-row gap-5 mt-10 mb-5 w-full min-h-screen max-w-main">
            <div className="md:hidden w-full flex justify-end px-4">
               <SummaryCard
                  searchParams={searchParams}
                  onClick={() => setDrawerVisible(true)}
               />
            </div>

            <Drawer
               title="Search & Filter"
               placement="bottom"
               onClose={() => setDrawerVisible(false)}
               open={drawerVisible}
               className="md:hidden"
               height="100%"
            >
               <FormProvider {...methods}>
                  <div className="flex flex-col gap-5">
                     <SearchSection
                        searchParams={searchParams}
                        handleSearch={methods.handleSubmit(handleSearch)}
                     />
                  </div>
               </FormProvider>
            </Drawer>

            <div className="hidden sm:block w-full sm:w-1/4 lg:w-1/5 bg-white px-5 rounded-lg">
               <FormProvider {...methods}>
                  <SearchSection
                     searchParams={searchParams}
                     handleSearch={methods.handleSubmit(handleSearch)}
                  />
                  <FilterSection />
               </FormProvider>
            </div>

            <div className="w-full sm:w-3/4 lg:w-4/5">
               <Results
                  data={data}
                  isFetching={isFetching}
                  numberOfGuest={numberOfGuest}
                  roomNumber={roomNumber}
                  searchParams={searchParams}
                  handleChangePage={handleChangePage}
               />
            </div>
         </div>
      </div>
   );
};

export default Listing;
