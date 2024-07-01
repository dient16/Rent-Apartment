// src/components/CreateApartmentForm/Step2.tsx
import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import RoomDetailsForm from './RoomDetailsForm';
import RoomImagesForm from './RoomImagesForm';
import { Tabs, Button, message } from 'antd';

const { TabPane } = Tabs;

const Step2: React.FC = () => {
   const { control, getValues, trigger } = useFormContext();
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'rooms',
   });
   const [currentRoomIndex, setCurrentRoomIndex] = useState<number | null>(
      null,
   );
   const [subStep, setSubStep] = useState<'details' | 'images' | 'addAnother'>(
      'details',
   );

   const addNewRoom = () => {
      append({
         roomType: '',
         amenities: [],
         size: 0,
         price: 0,
         numberOfGuest: 0,
         quantity: 0,
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

   const handleAddAnotherRoom = () => {
      addNewRoom();
      setSubStep('details');
   };

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
            {fields.map((item, index) => (
               <TabPane
                  tab={item.roomType || `Room ${index + 1}`}
                  key={String(index)}
                  closable={fields.length > 1}
               >
                  {currentRoomIndex === index && (
                     <>
                        {subStep === 'details' && (
                           <RoomDetailsForm index={index} />
                        )}
                        {subStep === 'images' && (
                           <>
                              <p className="text-xl font-medium text-gray-700 mb-4">
                                 Room Type:{' '}
                                 {getValues(`rooms.${index}.roomType`)}
                              </p>
                              <RoomImagesForm index={index} />
                           </>
                        )}
                        {subStep === 'addAnother' && (
                           <div className="text-center">
                              <p className="text-xl font-medium text-gray-700 mb-4">
                                 Do you want to add another room?
                              </p>
                              <Button
                                 type="primary"
                                 onClick={handleAddAnotherRoom}
                                 className="mr-4"
                              >
                                 Yes
                              </Button>
                              <Button onClick={() => setCurrentRoomIndex(null)}>
                                 No
                              </Button>
                           </div>
                        )}
                        <div className="flex justify-between mt-4">
                           <Button type="danger" onClick={() => remove(index)}>
                              Remove Room
                           </Button>
                           {subStep !== 'addAnother' && (
                              <Button
                                 type="primary"
                                 onClick={handleNextSubStep}
                              >
                                 Next
                              </Button>
                           )}
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
