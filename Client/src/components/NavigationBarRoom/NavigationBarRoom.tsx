import { useState, useEffect } from 'react';
import type { FC } from 'react';
import clsx from 'clsx';

const tabs = [
   { name: 'Overview', key: 'overview' },
   { name: 'Rooms', key: 'rooms' },
   { name: 'Location', key: 'location' },
   { name: 'Amenities', key: 'amenities' },
   { name: 'Policies', key: 'policies' },
   { name: 'Reviews', key: 'reviews' },
];

const NavigationBarRoom: React.FC = () => {
   const [activeTab, setActiveTab] = useState<string>('overview');

   useEffect(() => {
      const handleScroll = () => {
         let currentActive = activeTab;
         tabs.forEach((tab) => {
            const element = document.getElementById(tab.key);
            if (element) {
               const { top } = element.getBoundingClientRect();
               if (top >= 0 && top <= window.innerHeight / 2) {
                  currentActive = tab.key;
               }
            }
         });
         setActiveTab(currentActive);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [activeTab]);

   const handleTabClick = (key: string) => {
      setActiveTab(key);
      const element = document.getElementById(key);
      if (element) {
         window.scrollTo({
            top: element.offsetTop - 70,
            behavior: 'smooth',
         });
      }
   };

   return (
      <div className="sticky z-10 bg-white border-b border-gray-200 top-[90px]">
         <div className="flex space-x-8">
            {tabs.map((tab) => (
               <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={clsx(
                     'py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 cursor-pointer',
                     activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent',
                  )}
               >
                  {tab.name}
               </button>
            ))}
         </div>
      </div>
   );
};

export default NavigationBarRoom;
