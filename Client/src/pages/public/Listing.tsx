import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
   SearchSection,
   FilterSection,
   Results,
   SummaryCard,
} from '@/components';
import { apiSearchRoom } from '@/apis';
import { Drawer, Button } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FiFilter } from 'react-icons/fi';

const Listing: React.FC = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [drawerVisible, setDrawerVisible] = useState(false);
   const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

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
      console.log(data);
      const queryParams = new URLSearchParams({
         province: data.searchText,
         startDate: moment(data.searchDate[0]).format('YYYY-MM-DD'),
         endDate: moment(data.searchDate[1]).format('YYYY-MM-DD'),
         numberOfGuest: data.searchGuest.guests.toString(),
         roomNumber: data.searchGuest.rooms.toString(),
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
      setFilterDrawerVisible(false);
   };

   const handleChangePage = (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', page.toString());
      setSearchParams(newSearchParams);
   };

   return (
      <div className="flex flex-col justify-center items-center w-full font-main bg-gray-100">
         <div className="flex flex-col lg:flex-row gap-5 lg:mt-10 mt-2 mb-5 w-full min-h-screen max-w-main px-5 sm:px-5">
            <div className="lg:hidden w-full flex justify-center items-center">
               <SummaryCard
                  searchParams={searchParams}
                  onClick={() => setDrawerVisible(true)}
               />
               <span
                  onClick={() => setFilterDrawerVisible(true)}
                  className="filter-icon cursor-pointer ml-2 text-2xl"
               >
                  <FiFilter size={30} />
               </span>
            </div>

            <Drawer
               title="Search & Filter"
               placement="bottom"
               onClose={() => setDrawerVisible(false)}
               open={drawerVisible}
               className="lg:hidden"
               height="100%"
               zIndex={800}
            >
               <FormProvider {...methods}>
                  <div className="flex flex-col gap-5">
                     <form onSubmit={methods.handleSubmit(handleSearch)}>
                        <SearchSection searchParams={searchParams} />
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
               </FormProvider>
            </Drawer>

            <Drawer
               title="Filter"
               placement="bottom"
               onClose={() => setFilterDrawerVisible(false)}
               open={filterDrawerVisible}
               height="100%"
            >
               <FormProvider {...methods}>
                  <div className="flex flex-col gap-5">
                     <form onSubmit={methods.handleSubmit(handleSearch)}>
                        <FilterSection />
                        <Button
                           className="px-5 w-full bg-blue-500 rounded-xl font-main h-[50px]"
                           type="primary"
                           icon={<SearchOutlined />}
                           htmlType="submit"
                        >
                           Apply Filters
                        </Button>
                     </form>
                  </div>
               </FormProvider>
            </Drawer>

            <div className="hidden lg:block min-w-[320px] bg-white px-5 rounded-lg">
               <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleSearch)}>
                     <SearchSection searchParams={searchParams} />
                     <Button
                        className="px-5 w-full bg-blue-500 rounded-xl font-main h-[50px]"
                        type="primary"
                        icon={<SearchOutlined />}
                        htmlType="submit"
                     >
                        Search
                     </Button>
                     <FilterSection />
                  </form>
               </FormProvider>
            </div>

            <div className="w-full">
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
