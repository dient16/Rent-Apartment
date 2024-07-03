import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Badge } from 'antd';
import { Link } from 'react-router-dom';
import {
   HomeOutlined,
   CalendarOutlined,
   MessageOutlined,
   BellOutlined,
   UserOutlined,
} from '@ant-design/icons';
import { path } from '@/utils/constant';
import logo from '@/assets/logo.png';
import type { MenuProps } from 'antd';

const { Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
   {
      key: 'today',
      label: <Link to={path.HOST_DASHBOARD}>Today</Link>,
      icon: <HomeOutlined />,
   },
   {
      key: 'calendar',
      label: <Link to={path.HOST_CALENDAR}>Calendar</Link>,
      icon: <CalendarOutlined />,
   },
   {
      key: 'listings',
      label: <Link to={path.HOST_LISTINGS}>Listings</Link>,
      icon: <HomeOutlined />,
   },
   {
      key: 'messages',
      label: <Link to={path.HOST_BOOKINGS}>Messages</Link>,
      icon: <MessageOutlined />,
   },
];

const items: MenuProps['items'] = [
   {
      key: '1',
      label: <Link to={path.HOST_PROFILE}>Profile</Link>,
   },
   {
      key: '2',
      label: <Link to={path.HOME}>Logout</Link>,
   },
];

const HostHeader: React.FC = () => {
   const [current, setCurrent] = useState('today');

   const onClick: MenuProps['onClick'] = (e) => {
      setCurrent(e.key);
   };

   return (
      <Header className="flex justify-between items-center p-0 w-full bg-white border-b border-gray-300 font-main">
         <div className="flex items-center pl-5">
            <img src={logo} alt="Logo" className="h-10" />
         </div>
         <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
            className="flex-1 justify-center text-lg font-main"
         />
         <div className="flex gap-10 items-center pr-10">
            <Badge count={5} offset={[2, 0]}>
               <BellOutlined className="text-xl" />
            </Badge>
            <Dropdown menu={{ items }} placement="bottomRight">
               <Avatar icon={<UserOutlined />} />
            </Dropdown>
         </div>
      </Header>
   );
};

export default HostHeader;
