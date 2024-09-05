import React from 'react';
import { Layout, Menu, Empty } from 'antd';

const { Sider, Content } = Layout;

const App: React.FC = () => {
   return (
      <Layout className="h-screen">
         <Sider width={300} className="bg-white">
            <Menu mode="inline" defaultSelectedKeys={['1']} className="h-full">
               <Menu.Item key="1" className="font-bold text-lg">
                  <div className="flex justify-between items-center">
                     <span>All</span>
                     <span className="bg-gray-200 px-2 py-1 rounded-full">
                        Unread
                     </span>
                  </div>
               </Menu.Item>
               <Menu.Item key="2">
                  <div className="flex justify-center items-center h-48">
                     <Empty description="You have no messages" />
                  </div>
               </Menu.Item>
            </Menu>
         </Sider>
         <Layout>
            <Content className="p-4 bg-gray-100">
               <div className="bg-white p-4 rounded-md shadow-md h-full">
                  <h2 className="text-xl font-semibold">
                     Detailed Information
                  </h2>
               </div>
            </Content>
         </Layout>
      </Layout>
   );
};

export default App;
