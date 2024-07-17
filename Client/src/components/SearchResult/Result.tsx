import React from 'react';
import { Pagination, Skeleton } from 'antd';
import ResultItem from './ResultItem';
interface ResultsProps {
   data: any;
   isFetching: boolean;
   numberOfGuest: number;
   roomNumber: number;
   searchParams: URLSearchParams;
   handleChangePage: (page: number) => void;
}
const Results: React.FC<ResultsProps> = ({
   data,
   isFetching,
   numberOfGuest,
   roomNumber,
   searchParams,
   handleChangePage,
}) => {
   return (
      <div className="flex flex-col gap-2 w-full">
         <div className="flex items-center lg:p-5 px-7 py-2 rounded-xl bg-white">
            <div className="lg:text-lg text-md font-normal">{`${
               data?.data?.totalResults || 0
            } Search results`}</div>
         </div>
         <div className="flex flex-col gap-5 w-full h-full rounded-lg min-h-screen">
            {isFetching ? (
               <>
                  {[1, 2, 3, 4].map((index) => (
                     <Skeleton
                        key={index}
                        loading={isFetching}
                        active
                        avatar={{ size: 180, shape: 'square' }}
                     />
                  ))}
               </>
            ) : (
               <>
                  {data?.data?.apartments.length === 0 && (
                     <div className="flex justify-center items-center">
                        <h2 className="text-2xl font-main">
                           Please enter your destination and arrival time
                        </h2>
                     </div>
                  )}
                  {(data?.data?.apartments || []).map((room) => (
                     <ResultItem
                        key={room._id}
                        room={room}
                        roomNumber={roomNumber}
                        numberOfGuest={numberOfGuest}
                        searchParams={searchParams}
                     />
                  ))}
               </>
            )}
         </div>
         <Pagination
            defaultCurrent={1}
            total={data?.data?.totalResults || 0}
            defaultPageSize={4}
            onChange={handleChangePage}
            className="flex justify-center"
            current={+searchParams.get('page') || 1}
         />
      </div>
   );
};

export default Results;
