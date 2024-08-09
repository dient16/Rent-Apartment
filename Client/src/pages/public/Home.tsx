import React from 'react';
import { motion } from 'framer-motion';
import background from '@/assets/background.avif';
import { ApartmentPopular, Search } from '@/components';
import datlat from '@/assets/dalat.jpg';
import danang from '@/assets/danang.png';
import hochiminh from '@/assets/hochiminh.png';
import hoian from '@/assets/hoian.webp';
import nhatrang from '@/assets/nhatrang.jpg';
import quynhon from '@/assets/quynhon.jpg';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Home: React.FC = () => {
   const navigate = useNavigate();
   function navigateToListing(province: string) {
      const queryParams = new URLSearchParams({
         province: province,
         startDate: moment().format('YYYY-MM-DD'),
         endDate: moment().add(1, 'day').format('YYYY-MM-DD'),
         number_of_guest: '1',
         room_number: '1',
      });
      const url = `/listing?${queryParams.toString()}`;
      navigate(url);
   }
   const fadeInVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
   };

   return (
      <div className="font-main flex items-center justify-center">
         <div className="max-w-main w-full px-3">
            <motion.div
               className="md:h-[300px] h-[180px] w-full flex justify-center items-center rounded-3xl relative md:mt-3 bg-cover bg-center"
               style={{ backgroundImage: `url(${background})` }}
               initial="hidden"
               animate="visible"
               variants={fadeInVariants}
               transition={{ type: 'spring' }}
            >
               <div className="absolute inset-0 bg-black opacity-40 rounded-3xl md:block hidden"></div>
               <div className="absolute inset-0 md:flex hidden items-center flex-col justify-center text-white px-[20px]">
                  <div className="text-[3rem] font-main font-semibold">
                     Booking your stay with Find House
                  </div>
                  <div className="text-lg font-main font-semi">
                     From as low as 100,000 VND per night with limited time
                     offer discounts
                  </div>
               </div>
               <div className="absolute md:-bottom-9 -bottom-48 max-w-[960px] w-full">
                  <Search />
               </div>
            </motion.div>

            <div className="md:mt-[60px] mt-52">
               <div className="text-xl mb-5 ml-2">Popular destination</div>
               <div className="lg:grid lg:h-[390px] lg:grid-cols-4 lg:grid-rows-5 lg:gap-5 flex flex-col gap-5">
                  <div
                     className="lg:col-span-1 row-span-5 relative cursor-pointer overflow-hidden rounded-2xl"
                     onClick={() => navigateToListing('Quy nhơn, Bình Định')}
                  >
                     <img
                        src={quynhon}
                        className="rounded-2xl object-cover w-full h-full transition-transform duration-500 hover:scale-125"
                     />
                     <span className="absolute bottom-5 right-5 flex items-center justify-center box-border overflow-hidden outline-none select-none px-4 py-2 opacity-100 bg-white bg-opacity-70 rounded-full">
                        Quy nhon
                     </span>
                  </div>

                  <div
                     className="col-span-1 row-span-3 relative cursor-pointer overflow-hidden rounded-2xl"
                     onClick={() => navigateToListing('Đà Lạt, Lâm Đồng')}
                  >
                     <img
                        src={datlat}
                        className="rounded-2xl object-cover w-full h-full transition-transform duration-500 hover:scale-125"
                     />
                     <span className="absolute bottom-5 right-5 flex items-center justify-center box-border overflow-hidden outline-none select-none px-4 py-2 opacity-100 bg-white bg-opacity-70 rounded-full">
                        Da lat
                     </span>
                  </div>

                  <div
                     className="col-span-1 row-span-5 relative cursor-pointer overflow-hidden rounded-2xl"
                     onClick={() => navigateToListing('Đà Nẵng')}
                  >
                     <img
                        src={danang}
                        className="rounded-2xl object-cover w-full h-full transition-transform duration-500 hover:scale-125"
                     />
                     <span className="absolute bottom-5 right-5 flex items-center justify-center box-border overflow-hidden outline-none select-none px-4 py-2 opacity-100 bg-white bg-opacity-70 rounded-full">
                        Da Nang
                     </span>
                  </div>

                  <div
                     className="col-span-1 row-span-2 relative cursor-pointer overflow-hidden rounded-2xl"
                     onClick={() => navigateToListing('Hồ Chí Minh')}
                  >
                     <img
                        src={hochiminh}
                        className="rounded-2xl object-cover w-full h-full transition-transform duration-500 hover:scale-125"
                     />
                     <span className="absolute bottom-5 right-5 flex items-center justify-center box-border overflow-hidden outline-none select-none px-4 py-2 opacity-100 bg-white bg-opacity-70 rounded-full">
                        Ho Chi Minh
                     </span>
                  </div>
                  <div
                     className="col-span-1 row-span-3 relative cursor-pointer overflow-hidden rounded-2xl"
                     onClick={() => navigateToListing('Hội An')}
                  >
                     <img
                        src={hoian}
                        className="rounded-2xl object-cover w-full h-full transition-transform duration-500 hover:scale-125"
                     />
                     <span className="absolute bottom-5 right-5 flex items-center justify-center box-border overflow-hidden outline-none select-none px-4 py-2 opacity-100 bg-white bg-opacity-70 rounded-full">
                        Hoi An
                     </span>
                  </div>
                  <div
                     className="col-span-1 row-span-2 relative cursor-pointer overflow-hidden rounded-2xl"
                     onClick={() => navigateToListing('Nha Trang')}
                  >
                     <img
                        src={nhatrang}
                        className="rounded-2xl object-cover w-full h-full transition-transform duration-500 hover:scale-125"
                     />
                     <span className="absolute bottom-5 right-5 flex items-center justify-center box-border overflow-hidden outline-none select-none px-4 py-2 opacity-100 bg-white bg-opacity-70 rounded-full">
                        Nha Trang
                     </span>
                  </div>
               </div>
            </div>
            <ApartmentPopular />
         </div>
      </div>
   );
};

export default Home;
