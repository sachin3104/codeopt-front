import React from 'react';
import Header from '@/components/common/header/Header';
import ConvertLayout from '@/components/convert/ConvertLayout';
import { Background } from '@/components/common/background';

const ConvertResult: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header variant="convert" />
        <main className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 pt-12 xs:pt-14 sm:pt-16 md:pt-18 lg:pt-20 pb-4 sm:pb-6 md:pb-8">
          <ConvertLayout />
        </main>
      </div>
    </div>
  );
};

export default ConvertResult; 