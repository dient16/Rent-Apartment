import React, { useState } from 'react';
import {
   Avatar,
   Button,
   DatePicker,
   Flex,
   Input,
   Select,
   Spin,
   message,
   Upload,
   Row,
   Col,
} from 'antd';
import { UserOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { apiEditUser, apiGetCurrentUser } from '@/apis';
import moment from 'moment';
import dayjs from 'dayjs';
import { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const PersonalInformation: React.FC = () => {
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const queryClient = useQueryClient();
   const editProfileMutator = useMutation({
      mutationFn: apiEditUser,
   });
   const {
      handleSubmit,
      control,
      reset,
      formState: { errors },
      getValues,
   } = useForm();
   const { data, isLoading } = useQuery({
      queryKey: ['userProfile'],
      queryFn: apiGetCurrentUser,
   });
   const handleEditUser = (
      data: Record<string, UploadFile | string | undefined>,
   ) => {
      const formData = new FormData();
      if (Array.isArray(data?.avatarEdit) && data.avatarEdit.length > 0) {
         delete (data as Record<string, string>).avatar;
      }
      Object.entries(data).forEach(
         ([key, value]: [string, UploadFile | string | undefined]) => {
            if (key === 'avatarEdit' && value) {
               const files: UploadFile[] = Array.isArray(value)
                  ? value
                  : [value as UploadFile];
               const fileToAppend =
                  files.length > 0
                     ? (files[0].originFileObj as File)
                     : undefined;
               if (fileToAppend) {
                  formData.append('avatar', fileToAppend);
               }
            } else {
               formData.append(key, value as string);
            }
         },
      );

      editProfileMutator.mutate(formData, {
         onSuccess: (response: Res) => {
            if (response.success) {
               message.success('Edit profile updated successfully');
               setIsEditing(false);
               queryClient.invalidateQueries({
                  queryKey: ['userProfile'],
               });
               queryClient.invalidateQueries({
                  queryKey: ['currentUser'],
               });
               reset();
            }
         },
         onError: () => {
            message.error('Edit profile failed');
         },
      });
   };
   const getBase64 = (file: RcFile): Promise<string> =>
      new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result as string);
         reader.onerror = (error) => reject(error);
      });
   const user = data?.data;
   return (
      <>
         <Spin
            spinning={isLoading || editProfileMutator.isPending}
            fullscreen
            size="large"
         />
         <div className="w-full px-7">
            <form onSubmit={handleSubmit(handleEditUser)} className="w-full">
               <h2 className="mb-4 text-3xl font-semibold text-center">
                  Personal information
               </h2>
               <div className="flex justify-center items-center my-4 w-full"></div>
               <div className="flex flex-col justify-center items-center">
                  <Controller
                     control={control}
                     name="avatarEdit"
                     render={({ field: { onChange, value } }) => (
                        <Flex vertical gap={5}>
                           {isEditing ? (
                              <Upload
                                 listType="picture-circle"
                                 className="avatar-uploader"
                                 accept="image/*"
                                 showUploadList={false}
                                 customRequest={() => {}}
                                 fileList={
                                    typeof value === 'string' ? null : value
                                 }
                                 onChange={({ fileList }) => {
                                    (async () => {
                                       fileList[0].thumbUrl = await getBase64(
                                          fileList[0].originFileObj as RcFile,
                                       );
                                       onChange(fileList);
                                    })();
                                 }}
                                 maxCount={1}
                              >
                                 <div className="relative group">
                                    <Avatar
                                       size={80}
                                       src={
                                          (isEditing &&
                                             getValues('avatarEdit')?.[0]
                                                ?.thumbUrl) ||
                                          user?.avatar
                                       }
                                       icon={<UserOutlined />}
                                    />
                                    {isEditing && (
                                       <div className="hidden absolute top-0 left-0 items-center p-2 w-full h-full bg-gray-100 rounded-full group-hover:block">
                                          <PlusOutlined />
                                          <div style={{ marginTop: 8 }}>
                                             Upload
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </Upload>
                           ) : (
                              <Avatar
                                 size={80}
                                 src={
                                    (isEditing &&
                                       getValues('avatarEdit')?.[0]
                                          ?.thumbUrl) ||
                                    user?.avatar
                                 }
                                 icon={<UserOutlined />}
                              />
                           )}
                           {errors?.avatarEdit && (
                              <span className="text-xs text-red-600 font-main">
                                 {errors?.avatarEdit.message as string}
                              </span>
                           )}
                        </Flex>
                     )}
                  />
                  <Row gutter={[0, 0]} className="mt-5">
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base whitespace-nowrap w-[50%] md:w-[30%] lg:w-[40%]">
                              First name :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="firstname"
                                 defaultValue={user?.firstname}
                                 rules={{
                                    required: 'First name is required',
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={errors?.firstname && 'error'}
                                       />
                                       {errors?.firstname && (
                                          <span className="text-xs text-red-600 font-main">
                                             {
                                                errors?.firstname
                                                   .message as string
                                             }
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <span className="text-base">
                                 {user?.firstname}
                              </span>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base whitespace-nowrap w-[50%] md:w-[30%] lg:w-[40%]">
                              Last name :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="lastname"
                                 defaultValue={user?.lastname}
                                 rules={{
                                    required: 'Last name is required',
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={errors?.lastname && 'error'}
                                       />
                                       {errors?.lastname && (
                                          <span className="text-xs text-red-600 font-main">
                                             {
                                                errors?.lastname
                                                   ?.message as string
                                             }
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <span className="text-base">
                                 {user?.lastname}
                              </span>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-center py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base w-[50%] md:w-[30%] lg:w-[40%]">
                              Email address :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="email"
                                 defaultValue={user?.email}
                                 rules={{
                                    required: 'Email is required',
                                    pattern: {
                                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                       message: 'Invalid email address',
                                    },
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={errors?.email && 'error'}
                                       />
                                       {errors?.email && (
                                          <span className="text-xs text-red-600 font-main">
                                             {errors?.email?.message as string}
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">{user?.email}</div>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base w-[50%] md:w-[30%] lg:w-[40%]">
                              Phone number :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="phone"
                                 defaultValue={user?.phone}
                                 rules={{
                                    required: 'Phone is required',
                                    pattern: {
                                       value: /^0\d{9}$/,
                                       message: 'Invalid phone number',
                                    },
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={errors?.phone && 'error'}
                                       />
                                       {errors?.phone && (
                                          <span className="text-xs text-red-600 font-main">
                                             {errors?.phone?.message as string}
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">{user?.phone}</div>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base w-[50%] md:w-[30%] lg:w-[40%]">
                              Date of birth :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="dateOfBirth"
                                 defaultValue={
                                    user?.dateOfBirth
                                       ? dayjs(user?.dateOfBirth)
                                       : null
                                 }
                                 rules={{
                                    required: 'Date of birth is required',
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <DatePicker
                                          {...field}
                                          format="DD-MM-YYYY"
                                          onChange={(value) => {
                                             field.onChange(
                                                value ? dayjs(value) : null,
                                             );
                                          }}
                                          status={
                                             errors?.dateOfBirth && 'error'
                                          }
                                       />
                                       {errors?.dateOfBirth && (
                                          <span className="text-xs text-red-600 font-main">
                                             {
                                                errors?.dateOfBirth
                                                   ?.message as string
                                             }
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">
                                 {moment(user?.dateOfBirth || undefined).format(
                                    'DD-MM-YYYY',
                                 )}
                              </div>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base w-[50%] md:w-[30%] lg:w-[40%]">
                              Nationality :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="nationality"
                                 defaultValue={user?.nationality}
                                 rules={{
                                    required: 'Nationality is required',
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={
                                             errors?.nationality && 'error'
                                          }
                                       />
                                       {errors?.nationality && (
                                          <span className="text-xs text-red-600 font-main">
                                             {
                                                errors?.nationality
                                                   ?.message as string
                                             }
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">
                                 {user?.nationality}
                              </div>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base w-[50%] md:w-[30%] lg:w-[40%]">
                              Gender :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 defaultValue={user?.gender}
                                 name="gender"
                                 rules={{
                                    required: 'Gender is required',
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Select
                                          {...field}
                                          status={errors?.gender && 'error'}
                                          className="min-w-[100px]"
                                          options={[
                                             { label: 'Male', value: 'Male' },
                                             {
                                                label: 'Female',
                                                value: 'Female',
                                             },
                                             { label: 'Other', value: 'Other' },
                                          ]}
                                       />
                                       {errors?.gender && (
                                          <span className="text-xs text-red-600 font-main">
                                             {errors?.gender?.message as string}
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">{user?.gender}</div>
                           )}
                        </div>
                     </Col>
                     <Col span={24} lg={12}>
                        <div className="flex items-start py-6 px-3 w-full border-t border-gray-300">
                           <div className="font-medium text-base w-[50%] md:w-[30%] lg:w-[40%]">
                              Address :
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="address"
                                 defaultValue={user?.address}
                                 rules={{
                                    required: 'Address is required',
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={errors?.address && 'error'}
                                       />
                                       {errors?.address && (
                                          <span className="text-xs text-red-600 font-main">
                                             {
                                                errors?.address
                                                   ?.message as string
                                             }
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">{user?.address}</div>
                           )}
                        </div>
                     </Col>
                     <Col span={24}>
                        <div className="flex items-start py-6 w-full border-t border-b border-gray-300">
                           <div className="font-medium text-base lg:w-[20%] pl-3 w-[50%] md:w-[30%]">
                              Personal ID:
                           </div>
                           {isEditing ? (
                              <Controller
                                 control={control}
                                 name="personalId"
                                 defaultValue={user?.personalId}
                                 rules={{
                                    required: 'Personal Id is required',
                                    pattern: {
                                       value: /^\d{12}$/,
                                       message:
                                          'Invalid Personal ID, it should have 12 digits',
                                    },
                                 }}
                                 render={({ field }) => (
                                    <div className="flex flex-col gap-1">
                                       <Input
                                          {...field}
                                          status={errors?.personalId && 'error'}
                                       />
                                       {errors?.personalId && (
                                          <span className="text-xs text-red-600 font-main">
                                             {
                                                errors?.personalId
                                                   ?.message as string
                                             }
                                          </span>
                                       )}
                                    </div>
                                 )}
                              />
                           ) : (
                              <div className="text-base">
                                 {user?.personalId}
                              </div>
                           )}
                        </div>
                     </Col>
                  </Row>
               </div>
               {isEditing && (
                  <Flex gap={10}>
                     <Button
                        className="mt-5 bg-blue-500"
                        type="primary"
                        size="large"
                        htmlType="submit"
                     >
                        Save
                     </Button>
                     <Button
                        className="mt-5"
                        size="large"
                        onClick={() => setIsEditing(false)}
                     >
                        Cancel
                     </Button>
                  </Flex>
               )}
            </form>
            {!isEditing && (
               <Button
                  type="primary"
                  size="large"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="mt-5 bg-blue-500"
               >
                  Edit
               </Button>
            )}
         </div>
      </>
   );
};

export default PersonalInformation;
