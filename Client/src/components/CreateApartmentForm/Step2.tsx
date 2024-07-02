import React, { useState, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import RoomDetailsForm from './RoomDetailsForm';
import RoomImagesForm from './RoomImagesForm';
import { Tabs, Button, message } from 'antd';

const { TabPane } = Tabs;

interface Step2Props {
   setShowButtons: (show: boolean) => void;
}

const Step2: React.FC<Step2Props> = ({ setShowButtons }) => {
   const { control, getValues, trigger, watch } = useFormContext();
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
      setShowButtons(subStep === 'addAnother');
   }, [subStep, setShowButtons]);

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
            tabBarStyle={{ fontSize: '1.25rem' }}
         >
            {fields.map((_item, index) => (
               <TabPane
                  tab={
                     <span className="font-main text-lg px-4 py-2 border bg-sky-100 rounded-full select-none">
                        {roomTypes?.[index]?.roomType || `Room ${index + 1}`}
                     </span>
                  }
                  key={String(index)}
                  closable={fields.length > 1}
               >
                  {currentRoomIndex === index && (
                     <>
                        {subStep === 'details' && (
                           <RoomDetailsForm index={index} />
                        )}
                        {subStep === 'images' && (
                           <RoomImagesForm index={index} />
                        )}
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
                                 <Button
                                    size="large"
                                    onClick={handleBackSubStep}
                                 >
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
               </TabPane>
            ))}
         </Tabs>
      </div>
   );
};

export default Step2;
