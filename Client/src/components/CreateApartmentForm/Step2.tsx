import React, { useState, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import RoomDetailsForm from './RoomDetailsForm';
import RoomImagesForm from './RoomImagesForm';
import { Tabs, Button } from 'antd';
import type { TabsProps } from 'antd';
import { motion } from 'framer-motion';

interface Step2Props {
   setShowBackButton: React.Dispatch<React.SetStateAction<boolean>>;
   setShowNextButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const Step2: React.FC<Step2Props> = ({
   setShowBackButton,
   setShowNextButton,
}) => {
   const { control, watch } = useFormContext();
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'rooms',
   });
   const [currentRoomIndex, setCurrentRoomIndex] = useState<number | null>(0);

   useEffect(() => {
      if (fields.length === 0) {
         addNewRoom();
      }
   }, [fields.length]);

   useEffect(() => {
      setShowBackButton(currentRoomIndex !== null);
      setShowNextButton(true);
   }, [currentRoomIndex, setShowBackButton, setShowNextButton]);

   const addNewRoom = () => {
      append({
         roomType: '',
         amenities: [],
         size: '',
         price: '',
         numberOfGuest: '',
         quantity: '',
         images: [],
      });
      setCurrentRoomIndex(fields.length);
   };

   const roomTypes = watch('rooms');

   const items: TabsProps['items'] = fields.map((_, index) => ({
      key: String(index),
      label: (
         <span
            className="font-main text-lg px-4 py-2 text-black rounded-full select-none"
            onClick={() => setCurrentRoomIndex(index)}
         >
            {roomTypes?.[index]?.roomType || `Room ${index + 1}`}
         </span>
      ),
      children: (
         <>
            {currentRoomIndex === index && (
               <>
                  <RoomDetailsForm index={index} />
                  <RoomImagesForm index={index} />
                  <div className="flex justify-between mt-4">
                     <Button danger onClick={() => remove(index)}>
                        Remove Room
                     </Button>
                  </div>
               </>
            )}
         </>
      ),
   }));

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="p-6"
      >
         <h2 className="text-xl font-bold mb-6">
            Room Details and Images - Step 2
         </h2>
         <div className="flex justify-end">
            <Button type="primary" className="bg-blue-500" onClick={addNewRoom}>
               Add New Room Type
            </Button>
         </div>
         <Tabs
            activeKey={
               currentRoomIndex !== null ? String(currentRoomIndex) : undefined
            }
            hideAdd
            onChange={(key) => setCurrentRoomIndex(Number(key))}
            type="editable-card"
            onEdit={(targetKey, action) => {
               if (action === 'add') {
                  addNewRoom();
               } else if (action === 'remove') {
                  remove(Number(targetKey));
                  setCurrentRoomIndex(null);
               }
            }}
            items={items}
            tabBarStyle={{ fontSize: '1.25rem' }}
         />
      </motion.div>
   );
};

export default Step2;
