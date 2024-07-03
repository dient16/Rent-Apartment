import React, { useState, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import RoomDetailsForm from './RoomDetailsForm';
import RoomImagesForm from './RoomImagesForm';
import { Tabs, Button, message } from 'antd';
import type { TabsProps } from 'antd';

interface Step2Props {
   setShowBackButton: React.Dispatch<React.SetStateAction<boolean>>;
   setShowNextButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const Step2: React.FC<Step2Props> = ({
   setShowBackButton,
   setShowNextButton,
}) => {
   const { control, trigger, watch } = useFormContext();
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'rooms',
   });
   const [currentRoomIndex, setCurrentRoomIndex] = useState<number | null>(0);
   const [subStep, setSubStep] = useState<'details' | 'images' | 'addAnother'>(
      'details',
   );

   useEffect(() => {
      if (fields.length === 0) {
         addNewRoom();
      }
   }, [fields.length]);

   useEffect(() => {
      setShowBackButton(subStep === 'details');
      setShowNextButton(subStep === 'addAnother');
   }, [subStep, setShowBackButton, setShowNextButton]);

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
      setSubStep('details');
   };

   const handleNextSubStep = async () => {
      const valid = await trigger(`rooms.${currentRoomIndex}`);
      if (!valid) {
         message.error('Please fill out all required fields');
         return;
      }
      if (subStep === 'details') {
         setSubStep('images');
      } else if (subStep === 'images') {
         setSubStep('addAnother');
      }
   };

   const handleBackSubStep = () => {
      if (subStep === 'images') {
         setSubStep('details');
      } else if (subStep === 'addAnother') {
         setSubStep('images');
      }
   };

   const handleAddAnotherRoom = () => {
      addNewRoom();
      setSubStep('details');
   };

   const roomTypes = watch('rooms');

   const items: TabsProps['items'] = fields.map((_, index) => ({
      key: String(index),
      label: (
         <span
            className="font-main text-lg px-4 py-2 border bg-sky-100 rounded-full select-none"
            onClick={() => setSubStep('details')}
         >
            {roomTypes?.[index]?.roomType || `Room ${index + 1}`}
         </span>
      ),
      children: (
         <>
            {currentRoomIndex === index && (
               <>
                  {subStep === 'details' && <RoomDetailsForm index={index} />}
                  {subStep === 'images' && <RoomImagesForm index={index} />}
                  {subStep === 'addAnother' && (
                     <div className="text-center h-full">
                        <p className="text-xl font-medium text-gray-700 mb-4">
                           Do you want to add another room?
                        </p>
                        <Button
                           type="primary"
                           onClick={handleAddAnotherRoom}
                           className="mr-4 bg-blue-500"
                        >
                           Yes
                        </Button>
                        <Button onClick={() => setCurrentRoomIndex(null)}>
                           No
                        </Button>
                     </div>
                  )}
                  <div className="flex justify-between mt-4">
                     <Button danger onClick={() => remove(index)}>
                        Remove Room
                     </Button>
                     <div className="flex space-x-4">
                        {subStep !== 'details' && (
                           <Button size="large" onClick={handleBackSubStep}>
                              Back
                           </Button>
                        )}
                        {subStep !== 'addAnother' && (
                           <Button
                              type="primary"
                              onClick={handleNextSubStep}
                              size="large"
                              className="bg-blue-500"
                           >
                              Next
                           </Button>
                        )}
                     </div>
                  </div>
               </>
            )}
         </>
      ),
   }));

   return (
      <div className="p-6">
         <h2 className="text-3xl font-bold mb-6">
            Room Details and Images - Step 2
         </h2>
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
      </div>
   );
};

export default Step2;
