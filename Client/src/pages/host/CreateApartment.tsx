import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button, Steps, message, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Step1 from '@/components/CreateApartmentForm/Step1';
import Step2 from '@/components/CreateApartmentForm/Step2';
import Step3 from '@/components/CreateApartmentForm/Step3';
import { apiCreateApartment } from '@/apis';

const { Step } = Steps;

const steps = [
   {
      title: 'Apartment Details',
      content: Step1,
   },
   {
      title: 'Room Details and Images',
      content: Step2,
   },
   {
      title: 'Additional Details',
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

   const nextStep = async () => {
      if (step === 1) {
         const isValid = await methods.trigger(['rooms']);
         if (!isValid) {
            message.error(
               'Please complete all room details before proceeding.',
            );
            return;
         }
      }

      if (step === 2) {
         const isValid = await methods.trigger([
            'houseRules',
            'checkInTime',
            'checkOutTime',
            'safetyInfo',
            'cancellationPolicy',
            'discounts',
         ]);
         if (!isValid) {
            message.error(
               'Please complete all additional details before proceeding.',
            );
            return;
         }
      }

      const result = await methods.trigger();
      if (result) {
         setStep(step + 1);
      }
   };

   const prevStep = () => setStep(step - 1);

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
         <div className="max-w-main mx-auto">
            <Steps current={step}>
               {steps.map((item, index) => (
                  <Step key={index} title={item.title} />
               ))}
            </Steps>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-6 ">
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
               <div className="bg-white shadow-lg p-4 mt-4 rounded">
                  <div className="flex justify-between">
                     {showBackButton && step > 0 && (
                        <Button
                           onClick={prevStep}
                           icon={<LeftOutlined />}
                           className="px-4 py-2 bg-gray-300 text-black rounded"
                           size="large"
                        >
                           Back
                        </Button>
                     )}
                     <div className="flex-grow"></div>
                     {showNextButton && step < steps.length - 1 && (
                        <Button
                           type="primary"
                           onClick={nextStep}
                           icon={<RightOutlined />}
                           size="large"
                           className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                           Next
                        </Button>
                     )}
                     {step === steps.length - 1 && (
                        <Button
                           type="primary"
                           htmlType="submit"
                           size="large"
                           className="px-4 py-2 bg-blue-500 text-white rounded"
                           disabled={mutation.isPending}
                        >
                           {mutation.isPending ? <Spin /> : 'Submit'}
                        </Button>
                     )}
                  </div>
               </div>
            </form>
         </div>
      </FormProvider>
   );
};

export default ApartmentMultiStepForm;
