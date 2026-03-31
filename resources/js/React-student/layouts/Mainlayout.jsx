import React from 'react';
import { Header } from './Header';
import { Outlet } from "react-router-dom";

const MainLayout = ({ user }) => {
  return (
    <div className="app-container">

      <Header username={user} />

      <div className="content-wrapper" style={{ display: 'flex' }}>
        <main className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;