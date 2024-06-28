import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import { navigates, path } from '@/utils/constant';
import { MenuAccount, SignIn, SignUp } from '@/components';
import { NavLink, useNavigate } from 'react-router-dom';
import {
   Flex,
   Button,
   Modal,
   Tabs,
   Drawer,
   Image,
   Popover,
   Avatar,
} from 'antd';
import type { TabsProps } from 'antd';
import icons from '@/utils/icons';
import { useAuth } from '@/hooks';
import clsx from 'clsx';

const Header: React.FC = () => {
   const { SlClose, AiOutlineUsergroupAdd, PiSignInBold, CgMenuLeft, HiMenu } =
      icons;
   const navigate = useNavigate();
   const [openNavigate, setOpenNavigate] = useState(false);
   const {
      isAuthenticated,
      user: currentUser,
      authModel,
      setAuthModel,
   } = useAuth();
   const tabItemsModal: TabsProps['items'] = [
      {
         key: 'signin',
         label: (
            <div
               className="flex justify-center items-center text-xl font-main w-[120px] sm:w-[300px] md:w-[350px] lg:w-[390px]"
               onClick={() =>
                  setAuthModel({ isOpen: true, activeTab: 'signin' })
               }
            >
               Sign In
            </div>
         ),
         children: <SignIn setModalOpen={setAuthModel} />,
      },
      {
         key: 'signup',
         label: (
            <div
               className="flex justify-center items-center text-xl font-main w-[120px] sm:w-[300px] md:w-[350px] lg:w-[390px]"
               onClick={() =>
                  setAuthModel({ isOpen: true, activeTab: 'signup' })
               }
            >
               Sign Up
            </div>
         ),
         children: <SignUp />,
      },
   ];
   return (
      <header className="flex sticky top-0 z-10 justify-center items-center w-full bg-white h-[90px]">
         <div className="flex justify-between px-3 w-full select-none md:px-10">
            <div className="lg:hidden" onClick={() => setOpenNavigate(true)}>
               <CgMenuLeft size={30} />
            </div>
            <Image
               src={logo}
               className="cursor-pointer w-[110px] md:w-[150px]"
               preview={false}
               onClick={() => navigate(`/${path.HOME}`)}
            />
            <Flex gap={40} align="center">
               <div className="hidden lg:block">
                  <Flex gap={15} align="center">
                     {navigates.map((navigate, index) => (
                        <NavLink
                           key={index}
                           to={navigate.path}
                           className={({ isActive }) =>
                              clsx(
                                 'relative font-main text-[20px] font-medium text-black transition duration-500 ease-in-out',
                                 isActive ? 'navLink-active text-blue-500' : '',
                                 'navLink',
                              )
                           }
                        >
                           {navigate.title}
                        </NavLink>
                     ))}
                  </Flex>
               </div>

               <Flex gap={10} align="center">
                  {!isAuthenticated && !currentUser ? (
                     <>
                        <Button
                           className="hidden px-2 h-10 rounded-full md:px-7 lg:block font-main"
                           onClick={() =>
                              setAuthModel({
                                 isOpen: true,
                                 activeTab: 'signup',
                              })
                           }
                        >
                           Sign up
                        </Button>
                        <Button
                           type="primary"
                           className="hidden px-2 h-10 text-white bg-blue-500 rounded-full md:px-7 lg:block font-main"
                           onClick={() =>
                              setAuthModel({
                                 isOpen: true,
                                 activeTab: 'signin',
                              })
                           }
                        >
                           Sign in
                        </Button>
                     </>
                  ) : (
                     <Popover
                        placement="bottom"
                        content={<MenuAccount />}
                        arrow={true}
                        mouseLeaveDelay={0.3}
                        trigger={['hover']}
                     >
                        <span className="flex gap-1.5 justify-center items-center py-1.5 px-3 rounded-full border border-gray-300 cursor-pointer lg:mx-5">
                           <HiMenu size={17} />
                           <Avatar
                              size={30}
                              src={currentUser?.avatar}
                              className="border border-blue-500"
                           />
                        </span>
                     </Popover>
                  )}
               </Flex>
            </Flex>
         </div>

         <Modal
            centered
            open={authModel.isOpen}
            onOk={() => setAuthModel({ isOpen: false, activeTab: 'signin' })}
            onCancel={() =>
               setAuthModel({ isOpen: false, activeTab: 'signin' })
            }
            width={840}
            footer={null}
            closeIcon={<SlClose size={25} />}
            styles={{
               mask: {
                  backdropFilter: 'blur(10px)',
               },
            }}
         >
            <Tabs
               centered={true}
               activeKey={authModel.activeTab}
               items={tabItemsModal}
               tabBarGutter={0}
            />
         </Modal>
         <Drawer
            title={
               <div
                  className="flex justify-end items-center w-full cursor-pointer"
                  onClick={() => setOpenNavigate(false)}
               >
                  <SlClose size={28} />
               </div>
            }
            placement="left"
            width="100%"
            onClose={() => setOpenNavigate(false)}
            open={openNavigate}
            closeIcon={null}
         >
            <div
               className="flex flex-col gap-5 select-none"
               onClick={() => setOpenNavigate(false)}
            >
               <Flex gap={20} vertical>
                  {navigates.map((navigate, index) => (
                     <NavLink
                        className="flex gap-5 items-center font-medium font-main text-[22px]"
                        key={index}
                        to={navigate.path}
                     >
                        <span>{navigate.icon}</span>
                        <span>{navigate.title}</span>
                     </NavLink>
                  ))}
               </Flex>
               {!isAuthenticated && (
                  <Flex gap={20} vertical>
                     <span
                        className="flex gap-5 items-center font-medium cursor-pointer font-main text-[22px]"
                        onClick={() =>
                           setAuthModel({ isOpen: true, activeTab: 'signin' })
                        }
                     >
                        <PiSignInBold />
                        <span>Sign in</span>
                     </span>
                     <span
                        className="flex gap-5 items-center font-medium cursor-pointer font-main text-[22px]"
                        onClick={() =>
                           setAuthModel({ isOpen: true, activeTab: 'signup' })
                        }
                     >
                        <span>
                           <AiOutlineUsergroupAdd />
                        </span>
                        <span> Sign up</span>
                     </span>
                  </Flex>
               )}
            </div>
         </Drawer>
      </header>
   );
};

export default Header;
