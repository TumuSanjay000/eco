import React from 'react';
import { Tabs } from 'antd';
import Products from './Products'
function Profile() {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="My Products" key="1">
            <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bids" key="2">
        <h1>Bids</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Genral" key="3">
        <h1>General</h1>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
