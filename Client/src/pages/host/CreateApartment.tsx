import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Step1 from '@/components/CreateApartmentForm/Step1';
import Step2 from '@/components/CreateApartmentForm/Step2';
import Step3 from '@/components/CreateApartmentForm/Step3';
import { Button, Steps, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Step } = Steps;

type Room = {
   roomType: string;
   amenities: string[];
   size: number;
   price: number;
   numberOfGuest: number;
   quantity: number;
   images: File[];
};

type FormData = {
   title: string;
   description: string;
   location: {
      long: number;
      lat: number;
      province: string;
      district: string;
      ward: string;
      street: string;
   };
   rooms: Room[];
};

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
      title: 'Review and Submit',
      content: Step3,
   },
];

const ApartmentMultiStepForm: React.FC = () => {
   const methods = useForm<FormData>();
   const [step, setStep] = useState(0);

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
      const result = await methods.trigger();
      if (result) {
         setStep(step + 1);
      }
   };

   const prevStep = () => setStep(step - 1);

   const onSubmit = (data: FormData) => {
      console.log(data);
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
                  <StepComponent />
               </div>
               <div className="bg-white shadow-lg p-4">
                  <div className="flex justify-between">
                     {step > 0 && (
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
                     {step < steps.length - 1 && (
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
                        >
                           Submit
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
