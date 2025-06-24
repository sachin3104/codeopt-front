import React from 'react';
import UserLayout from '@/components/user/UserLayout';
import { Background } from '@/components/common/background';
import Header from '@/components/common/header/Header';

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Background />
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <UserLayout />
      </div>
    </div>
  );
};

export default UserPage; 