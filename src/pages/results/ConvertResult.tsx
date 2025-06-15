import React from 'react';
import Header from '@/components/header/Header';
import ConvertLayout from '@/components/convert-result/ConvertLayout';
import { Background } from '@/components/background/background';

const ConvertResult: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <ConvertLayout />
        </main>
      </div>
    </div>
  );
};

export default ConvertResult; 