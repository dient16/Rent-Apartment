import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button, message, Spin, Steps } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { apiCreateApartment } from '@/apis';
import {
   Step1FormApartment as Step1,
   Step2FormApartment as Step2,
   Step3FormApartment as Step3,
} from '@/components';
const steps = [
   {
      title: 'Apartment Details',
      description: 'Provide basic details about the apartment.',
      content: Step1,
   },
   {
      title: 'Room Details and Images',
      description: 'Add rooms and upload images.',
      content: Step2,
   },
   {
      title: 'Additional Details',
      description: 'Include additional information.',
      content: Step3,
   },
];

const ApartmentMultiStepForm: React.FC = () => {
   const methods = useForm<Apartment>();
   const [step, setStep] = useState(0);
   const [showBackButton, setShowBackButton] = useState<boolean>(true);
   const [showNextButton, setShowNextButton] = useState<boolean>(true);

   const mutation = useMutation({
      mutationFn: apiCreateApartment,
      onSuccess: () => {
         message.success('Apartment created successfully!');
      },
      onError: () => {
         message.error('Failed to create apartment. Please try again.');
      },
   });

   useEffect(() => {
      if (step !== 1) {
         setShowBackButton(true);
         setShowNextButton(true);
      }
   }, [step, setShowBackButton, setShowNextButton]);

   const handleStepChange = async (newStep: number) => {
      if (step === 1) {
         const isValid = await methods.trigger(['rooms'], {
            shouldFocus: true,
         });
         if (!isValid) {
            message.error(
               'Please complete all room details before proceeding.',
            );
            return;
         }
      }

      if (step === 2) {
         const isValid = await methods.trigger(
            ['houseRules', 'checkInTime', 'checkOutTime', 'safetyInfo'],
            { shouldFocus: true },
         );
         if (!isValid) {
            message.error(
               'Please complete all additional details before proceeding.',
            );
            return;
         }
      }

      if (newStep < step) {
         setStep(newStep);
      } else {
         const result = await methods.trigger();
         if (result) {
            setStep(newStep);
         }
      }
   };

   const onSubmit = (data: Apartment) => {
      const mappedData = {
         ...data,
         rooms: data.rooms.map((room) => ({
            ...room,
            images: room.images.map((img) =>
               typeof img === 'string'
                  ? img
                  : img.response.url.split('/').pop() || '',
            ),
         })),
      };
      mutation.mutate(mappedData);
   };

   const StepComponent = steps[step].content;

   return (
      <FormProvider {...methods}>
         <div className="max-w-main mx-auto mt-3 flex">
            <div className="w-[270px] h-full z-10 fixed pt-5 px-2">
               <Steps
                  direction="vertical"
                  current={step}
                  onChange={handleStepChange}
               >
                  {steps.map((item, index) => (
                     <Steps.Step
                        key={index}
                        title={item.title}
                        description={item.description}
                     />
                  ))}
               </Steps>
            </div>

            <div className="w-3/4 ml-[calc(270px+10px)] bg-white p-6 rounded-lg shadow">
               <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <div className="min-h-[600px]">
                     {step === 1 ? (
                        <Step2
                           setShowBackButton={setShowBackButton}
                           setShowNextButton={setShowNextButton}
                        />
                     ) : (
                        <StepComponent />
                     )}
                  </div>
                  <div className="bg-white p-4 rounded">
                     <div className="flex justify-between">
                        {showBackButton && step > 0 && (
                           <Button
                              onClick={() => handleStepChange(step - 1)}
                              icon={<LeftOutlined />}
                              size="large"
                           >
                              Back
                           </Button>
                        )}
                        <div className="flex-grow"></div>
                        {showNextButton && step < steps.length - 1 && (
                           <Button
                              type="primary"
                              onClick={() => handleStepChange(step + 1)}
                              icon={<RightOutlined />}
                              size="large"
                              className="bg-blue-500"
                           >
                              Next
                           </Button>
                        )}
                        {step === steps.length - 1 && (
                           <Button
                              type="primary"
                              htmlType="submit"
                              size="large"
                              className="bg-blue-500"
                              disabled={mutation.isPending}
                           >
                              {mutation.isPending ? <Spin /> : 'Submit'}
                           </Button>
                        )}
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </FormProvider>
   );
};

export default ApartmentMultiStepForm;
