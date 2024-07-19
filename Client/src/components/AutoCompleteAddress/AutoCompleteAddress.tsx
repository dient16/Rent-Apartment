import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks';
import { Spin } from 'antd';
import { FaMapMarkerAlt } from 'react-icons/fa';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';

interface AutoCompleteAddressProps {
   value: string;
   onChange: (value: string) => void;
   setValue: (name: string, value: string) => void;
}

interface Place {
   display_name: string;
   type: string;
}

const fetchAddresses = async (query: string): Promise<Place[]> => {
   if (!query) return [];
   const { data } = await axios.get<Place[]>(NOMINATIM_BASE_URL, {
      params: {
         q: query,
         format: 'json',
         addressdetails: 1,
         limit: 5,
         countrycodes: 'VN',
      },
      headers: {
         'Accept-Language': 'vi',
      },
   });
   return data;
};

const filterPlaces = (places: Place[]) => {
   const priorityTypes = [
      'hotel',
      'motel',
      'guest_house',
      'village',
      'town',
      'city',
      'district',
      'suburb',
      'ward',
   ];

   return places.sort((a, b) => {
      const aPriority = priorityTypes.indexOf(a.type);
      const bPriority = priorityTypes.indexOf(b.type);

      if (aPriority === -1 && bPriority === -1) return 0;
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
   });
};

const AutoCompleteAddress: React.FC<AutoCompleteAddressProps> = ({
   value,
   onChange,
   setValue,
}) => {
   const debouncedSearchValue = useDebounce(value, 900);

   const { data: options = [], isFetching } = useQuery<Place[], Error>({
      queryKey: ['addresses', debouncedSearchValue],
      queryFn: () => fetchAddresses(debouncedSearchValue),
      enabled: !!debouncedSearchValue,
   });

   const handleSelect = (value: string) => {
      setValue('searchText', value);
      onChange(value);
   };

   const filteredOptions = filterPlaces(options);

   return (
      <div className="w-full max-w-md mx-auto relative">
         {isFetching && (
            <div className="absolute w-full bg-white border border-gray-300 z-10 p-2 flex justify-center items-center">
               <Spin />
            </div>
         )}
         <AnimatePresence>
            {filteredOptions.length > 0 && (
               <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full bg-white border border-gray-300 z-10 mt-1 rounded-md shadow-lg"
               >
                  {filteredOptions.map((item) => (
                     <motion.li
                        key={item.display_name}
                        className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
                        onClick={() => handleSelect(item.display_name)}
                     >
                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                        <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                           {item.display_name}
                        </span>
                     </motion.li>
                  ))}
               </motion.ul>
            )}
         </AnimatePresence>
      </div>
   );
};

export default AutoCompleteAddress;
