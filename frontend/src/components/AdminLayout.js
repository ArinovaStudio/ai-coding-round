import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-16 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;