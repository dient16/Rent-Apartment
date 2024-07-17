import React, { useState } from 'react';
import {
   Calendar,
   Drawer,
   Button,
   Form,
   InputNumber,
   Typography,
   Divider,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Text } = Typography;

const CalendarPage: React.FC = () => {
   const [value, setValue] = useState(() => dayjs());
   const [selectedValue, setSelectedValue] = useState<Dayjs | null>(null);
   const [visible, setVisible] = useState(false);
   const [form] = Form.useForm();

   const onSelect = (newValue: Dayjs) => {
      setValue(newValue);
      setSelectedValue(newValue);
      setVisible(true);
   };

   const onPanelChange = (newValue: Dayjs) => {
      setValue(newValue);
   };

   const onClose = () => {
      setVisible(false);
   };

   const onFinish = (values: any) => {
      console.log('Success:', values);
      onClose();
   };

   return (
      <div className="container p-4 mx-auto">
         <Calendar
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            className="font-main text-lg"
         />
         <Drawer
            title={`Set Values for ${
               selectedValue ? selectedValue.format('MMMM Do YYYY') : ''
            }`}
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
         >
            <Form form={form} layout="vertical" onFinish={onFinish}>
               <Form.Item>
                  <Button.Group>
                     <Button type="primary">Open</Button>
                     <Button>Block</Button>
                  </Button.Group>
               </Form.Item>
               <Divider />
               <Form.Item
                  label="Price per Night"
                  name="price"
                  rules={[
                     {
                        required: true,
                        message: 'Please input the price per night!',
                     },
                  ]}
               >
                  <InputNumber
                     min={1}
                     style={{ width: '100%' }}
                     prefix="$"
                     formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                     }
                     parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
               </Form.Item>
               <Form.Item>
                  <Text>Total amount the guest will pay is $51</Text>
               </Form.Item>
               <Divider />
               <Form.Item>
                  <Text>
                     Compare with similar listings in the range $23 - $32
                  </Text>
               </Form.Item>
               <Divider />
               <Form.Item>
                  <Button type="link">Add custom travel time</Button>
               </Form.Item>
               <Form.Item>
                  <Button type="link">Add private notes</Button>
               </Form.Item>
               <Divider />
               <Form.Item>
                  <Button
                     type="primary"
                     htmlType="submit"
                     style={{ width: '100%' }}
                  >
                     Save
                  </Button>
               </Form.Item>
            </Form>
         </Drawer>
      </div>
   );
};

export default CalendarPage;
