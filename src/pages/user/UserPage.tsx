import React from 'react';
import UserLayout from '@/components/user/UserLayout';
import { Background } from '@/components/common/background';
import Header from '@/components/common/header/Header';

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Background />
      <Header />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 pt-20 sm:pt-24 md:pt-28">
        <UserLayout />
      </div>
    </div>
  );
};

export default UserPage; 