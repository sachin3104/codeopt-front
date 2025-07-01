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
        <main className="container mx-auto px-4 pt-[70px] pb-8">
          <ConvertLayout />
        </main>
      </div>
    </div>
  );
};

export default ConvertResult; 